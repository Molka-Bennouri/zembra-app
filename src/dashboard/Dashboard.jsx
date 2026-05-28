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
    <div className="adm-root">

      <div className="page-header">
        <div>
          <h1 className="adm-title">
            Dashboard
          </h1>

          <p className="adm-subtitle">
            Overview of your scraping activity
          </p>
        </div>

        <div className="header-right">

          {error && (
            <span className="error-badge">
              ⚠ {error}
            </span>
          )}

          <span className="last-update">
            {lastUpdate
              ? `Updated at ${lastUpdate.toLocaleTimeString()}`
              : "Loading..."}
          </span>

          <button
            className={`refresh-btn ${refreshing
                ? "refreshing"
                : ""
              }`}
            onClick={() =>
              refresh(true)
            }
          >
            {refreshing
              ? "↻ Refreshing..."
              : "↻ Refresh"}
          </button>

        </div>
      </div>



      <div className="adm-root">




        {/* ── KPIs ── */}
        <div className="kpi-grid">

          <div className="kpi">
            <div className="kpi-label">Used networks</div>
            <div className="kpi-value">
              {loading ? (
                <Skeleton width={60} height={36} />
              ) : (
                <>
                  <CountUp target={stats.networks.active} />
                  <span className="kpi-denom">/ {stats.networks.total}</span>
                </>
              )}
            </div>
          </div>

          <div className="kpi">
            <div className="kpi-label">Requests (24h)</div>
            <div className="kpi-value">
              {loading ? (
                <Skeleton width={80} height={36} />
              ) : (
                <CountUp target={stats.requests_24h.total} />
              )}
            </div>
          </div>

          <div className="kpi">
            <div className="kpi-label">Success rate</div>
            <div className="kpi-value">
              {loading ? (
                <Skeleton width={70} height={36} />
              ) : (
                <>
                  <CountUp target={Math.round(stats.success_rate)} />
                  <span style={{ fontSize: 16, color: "#aaa", fontWeight: 400 }}>%</span>
                </>
              )}
            </div>
          </div>

        </div>

        {/* ── CHARTS ROW ── */}
        <div className="charts-grid">

          <div className="card">
            <div className="card-title">Request volume</div>
            <div className="card-sub">Last 7 days</div>
            <ChartLegend items={[
              { label: "Requests", color: "#6C63FF" },
              { label: "Success rate %", color: "#3ECFCF" },
            ]} />
            <div className="chart-canvas-wrap">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          <div className="card">
            <div className="req-header">
              <div className="card-title">Recent requests</div>
              <span className="kpi-sub">{filtered.length} entries shown</span>
            </div>

            <div className="sd-tabs">
              {["all", "success", "error"].map((t) => (
                <button
                  key={t}
                  className={`sd-tab ${activeTab === t ? "sd-tab--active" : ""
                    }`}
                  onClick={() => setActiveTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {loading ? (
              <div
                style={{
                  padding: "16px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height={40} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="table-empty">No requests found</p>
            ) : (
              <div className="req-table">
                <div className="req-table__head">
                  <span>Network</span>
                  <span>Slug</span>
                  <span>Status</span>
                  <span>Code</span>
                  <span>Executed</span>
                </div>

                {filtered.slice(0, 5).map((r) => {
                  const codeCls =
                    r.status_code >= 500
                      ? "code-5xx"
                      : r.status_code >= 400
                        ? "code-4xx"
                        : "code-2xx";

                  const date = r.created_at
                    ? new Date(r.created_at).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : "—";

                  return (
                    <div key={r.id} className="req-table__row">
                      <span className="t-network">{r.network}</span>
                      <span className="t-slug">{r.slug}</span>
                      <span className={`status-badge badge-${r.status}`}>
                        {r.status}
                      </span>
                      <span className={`code-badge ${codeCls}`}>
                        {r.status_code ?? "—"}
                      </span>
                      <span className="t-muted">{date}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}