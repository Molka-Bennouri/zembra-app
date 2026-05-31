import { useState, useEffect, useRef, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

// ── useDashboard hook ──────────────────────────────────────

const API = "http://127.0.0.1:8000/api";
const POLL_INTERVAL = 30000;

const EMPTY_STATS = {
  networks: { active: 0, total: 0, list: [] },
  requests_24h: { total: 0, success: 0, errors: 0 },
  success_rate: 0,
};

function useDashboard() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [requests, setRequests] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
  });

  const getJson = useCallback(async (url) => {
    const res = await fetch(url, {
      headers: authHeader(),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    return res.json();
  }, []);

  const fetchKpis = useCallback(
    () => getJson(`${API}/kpis`),
    [getJson]
  );

  const fetchRequests = useCallback(
    () => getJson(`${API}/dashboard/requests`),
    [getJson]
  );

  const fetchChart = useCallback(
    () => getJson(`${API}/dashboard/chart?days=7`),
    [getJson]
  );

  const refresh = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);

    setError(null);

    try {
      const [kpis, reqs, chart] =
        await Promise.all([
          fetchKpis(),
          fetchRequests(),
          fetchChart(),
        ]);

      setStats(kpis);
      setRequests(reqs);
      setChartData(chart);
      setLastUpdate(new Date());

    } catch (e) {
      setError(e.message);

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchKpis, fetchRequests, fetchChart]);

  useEffect(() => {
    refresh();

    const timer = setInterval(
      () => refresh(),
      POLL_INTERVAL
    );

    return () => clearInterval(timer);

  }, [refresh]);

  return {
    stats,
    requests,
    chartData,
    loading,
    error,
    lastUpdate,
    refreshing,
    refresh,
  };
}

// ── CountUp ──────────────────────────────────────

function CountUp({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const from = prev.current;
    prev.current = target;

    let start = null;

    const step = (ts) => {
      if (!start) start = ts;

      const p = Math.min(
        (ts - start) / duration,
        1
      );

      setVal(
        Math.floor(
          from + p * (target - from)
        )
      );

      if (p < 1)
        requestAnimationFrame(step);
    };

    requestAnimationFrame(step);

  }, [target, duration]);

  return <span>{val.toLocaleString()}</span>;
}

// ── Chart Legend ──────────────────────────────────────

function ChartLegend({ items }) {
  return (
    <div className="chart-legend">
      {items.map((item, i) => (
        <span
          key={i}
          className="chart-legend-item"
        >
          <span
            className="legend-dot"
            style={{
              background: item.color
            }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────

function Skeleton({
  width = "100%",
  height = 20,
  style = {}
}) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: 6,
        ...style
      }}
    />
  );
}

// ── Dashboard ──────────────────────────────────────

export default function Dashboard() {

  const [activeTab, setActiveTab] =
    useState("all");

  const {
    stats,
    requests,
    chartData,
    loading,
    error,
    lastUpdate,
    refreshing,
    refresh
  } = useDashboard();

  const filtered =
    activeTab === "all"
      ? requests
      : requests.filter(
        (r) =>
          r.status === activeTab
      );

  const barData = {
    labels: chartData.map(
      (d) => d.label
    ),

    datasets: [
      {
        type: "bar",
        label: "Requests",
        data: chartData.map(
          (d) => d.total
        ),
        backgroundColor:
          "#6C63FF",
        borderRadius: 4,
        yAxisID: "y",
        order: 2,
      },

      {
        type: "line",
        label: "Success rate %",
        data: chartData.map(
          (d) => d.success_rate
        ),
        borderColor:
          "#3ECFCF",
        backgroundColor:
          "transparent",
        pointBackgroundColor:
          "#3ECFCF",
        pointRadius: 4,
        tension: 0.35,
        yAxisID: "y2",
        order: 1,
        borderDash: [4, 2],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },

    scales: {
      x: {
        grid: {
          color:
            "rgba(0,0,0,0.06)"
        },

        ticks: {
          color: "#888",
          font: { size: 11 }
        }
      },

      y: {
        beginAtZero: true,
        position: "left",

        ticks: {
          // Show plain numbers under 1000, then compact "k" format above
          callback: (v) =>
            v >= 1000
              ? (v / 1000).toFixed(1).replace(/\.0$/, "") + "k"
              : v
        }
      },

      y2: {
        position: "right",
        min: 0,
        max: 100,

        grid: {
          drawOnChartArea: false
        },

        ticks: {
          callback: (v) =>
            v + "%"
        }
      }
    }
  };

  return (
    <div className="dash-root">
      {/* ── Page Header ── */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Overview of your scraping activity</p>
        </div>
        <div className="dash-header-right">
          {error && (
            <span className="dash-error-badge">
              <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 11 }}></i>
              {error}
            </span>
          )}
          <span className="dash-last-update">
            {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : "Loading..."}
          </span>
          <button className={`dash-refresh-btn ${refreshing ? "refreshing" : ""}`} onClick={() => refresh(true)}>
            <i className={`fa-solid fa-arrows-rotate ${refreshing ? "fa-spin" : ""}`}></i>
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="dash-kpi-grid">
        <div className="dash-kpi card-hover">
          <div className="dash-kpi-icon" style={{ background: "rgba(108, 99, 255, 0.1)", color: "#6C63FF" }}>
            <i className="fa-solid fa-network-wired"></i>
          </div>
          <div className="dash-kpi-body">
            <div className="dash-kpi-label">Used Networks</div>
            <div className="dash-kpi-value">
              {loading ? <Skeleton width={60} height={32} /> : <><CountUp target={stats.networks.active} /><span className="dash-kpi-suffix">/ {stats.networks.total}</span></>}
            </div>
            <div className="dash-kpi-subtext">Active networks</div>
          </div>
        </div>
        <div className="dash-kpi card-hover">
          <div className="dash-kpi-icon" style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22C55E" }}>
            <i className="fa-solid fa-arrow-right-arrow-left"></i>
          </div>
          <div className="dash-kpi-body">
            <div className="dash-kpi-label">Requests (24h)</div>
            <div className="dash-kpi-value">
              {loading ? <Skeleton width={60} height={32} /> : <CountUp target={stats.requests_24h.total} />}
            </div>
            <div className="dash-kpi-subtext">{stats.requests_24h.success} succeeded, {stats.requests_24h.errors} failed</div>
          </div>
        </div>
        <div className="dash-kpi card-hover">
          <div className="dash-kpi-icon" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#F59E0B" }}>
            <i className="fa-solid fa-check-circle"></i>
          </div>
          <div className="dash-kpi-body">
            <div className="dash-kpi-label">Success Rate</div>
            <div className="dash-kpi-value">
              {loading ? <Skeleton width={60} height={32} /> : <><CountUp target={Math.round(stats.success_rate)} /><span className="dash-kpi-suffix">%</span></>}
            </div>
            <div className="dash-kpi-subtext">Overall success rate</div>
          </div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="dash-charts-grid">
        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Request Volume</h3>
              <p className="dash-card-sub">Last 7 days</p>
            </div>
            <div className="dash-chart-legend">
              <span className="dash-legend-item"><span className="dash-legend-dot" style={{ background: "#6C63FF" }}></span> Requests</span>
              <span className="dash-legend-item"><span className="dash-legend-dot dash-legend-dot-line" style={{ background: "#22C55E" }}></span> Success rate</span>
            </div>
          </div>
          <div className="dash-chart-wrap">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Recent Requests</h3>
              <p className="dash-card-sub">{filtered.length} entries</p>
            </div>
            <a href="/scrapinghistory" className="dash-view-all">View all <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }}></i></a>
          </div>

          <div className="dash-filter-tabs">
            {["all", "success", "error"].map((t) => (
              <button key={t} className={`dash-filter-tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="dash-request-list">
            {loading ? (
              <div className="dash-skeleton-list">
                {[1, 2, 3].map((i) => <Skeleton key={i} height={56} style={{ borderRadius: 10 }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="dash-empty">
                <i className="fa-regular fa-folder-open"></i>
                <p>No requests found</p>
              </div>
            ) : (
              filtered.slice(0, 5).map((r) => {
                const codeCls = r.status_code >= 500 ? "code-5xx" : r.status_code >= 400 ? "code-4xx" : "code-2xx";
                const date = r.created_at ? new Date(r.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
                return (
                  <div key={r.id} className="dash-request-card card-hover">
                    <div className="dash-req-left">
                      <span className="dash-req-network">{r.network}</span>
                      <span className="dash-req-slug">{r.slug}</span>
                    </div>
                    <div className="dash-req-right">
                      <span className={`dash-status-pill pill-${r.status}`}>{r.status}</span>
                      <span className={`dash-code-badge ${codeCls}`}>{r.status_code ?? "—"}</span>
                      <span className="dash-req-time">{date}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}