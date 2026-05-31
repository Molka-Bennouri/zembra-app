/* ============================================================
   ADMIN DASHBOARD
   Redesign: Dense layout, dark theme, interactive charts.
   Preserves: useAdminDashboard hook and all data processing.
============================================================ */

import { useState, useEffect } from "react";
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
import { Bar, Pie } from "react-chartjs-2";
import "./Dashboard.css"; // Reuse dashboard styles
import { useAdminDashboard } from "../hooks/useAdminDashboard";

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

// ── Time Ago helper ──────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now - past;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return past.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export default function AdminDashboard() {
  const {
    stats,
    chartData,
    errors,
    networksData,
    loading,
    error,
  } = useAdminDashboard();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // loading state
  if (loading) {
    return (
      <div className="pp-loader">
        <div className="pp-spinner" />
        <span className="pp-loader-text">Loading dashboard…</span>
      </div>
    );
  }

  // error state
  if (error) {
    return (
      <div className="adm-root">
        <div className="dash-empty">
           <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--error)' }}></i>
           <p>Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  // ── CHART DATA ──
  const barData = {
    labels: chartData.map((d) => d.label),
    datasets: [
      {
        type: "bar",
        label: "Requests",
        data: chartData.map((d) => d.value),
        backgroundColor: "rgba(67, 97, 238, 0.7)",
        hoverBackgroundColor: "#4361EE",
        borderRadius: 6,
        borderSkipped: false,
        yAxisID: "y",
        order: 2,
      },
      {
        type: "line",
        label: "Success rate %",
        data: chartData.map((d) => d.success),
        borderColor: "#22C55E",
        backgroundColor: "transparent",
        pointBackgroundColor: "#22C55E",
        pointBorderColor: "#1E1F2E",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
      legend: { display: false },
      tooltip: {
        backgroundColor: "#252636",
        titleColor: "#F1F3F9",
        bodyColor: "#A0A4B8",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: "'Inter', sans-serif", weight: "600" },
        bodyFont: { family: "'Inter', sans-serif" },
      }
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.04)", drawBorder: false },
        ticks: { color: "#6B7088", font: { size: 11, family: "'Inter', sans-serif" } },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.04)", drawBorder: false },
        ticks: {
          color: "#6B7088",
          font: { size: 11 },
          callback: (v) => (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v),
        },
      },
      y2: {
        grid: { drawOnChartArea: false, drawBorder: false },
        ticks: {
          color: "#6B7088",
          font: { size: 11 },
          callback: (v) => v + "%",
        },
        min: 0,
        max: 100,
      },
    },
  };

  // ── PIE CHART DATA ──
  const PIE_COLORS = [
    "#2E5AF4", // brand blue
    "#14B8A6", // teal
    "#F59E0B", // amber
    "#EC4899", // rose
    "#8B5CF6", // violet
    "#10B981", // emerald
    "#F97316", // orange
    "#6366F1", // indigo
    "#0EA5E9", // sky
    "#64748B", // slate
  ];

  const pieData = {
    labels: networksData.map((n) => n.network),
    datasets: [
      {
        label: "Network Usage",
        data: networksData.map((n) => n.count),
        backgroundColor: networksData.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
        borderColor: "#FFFFFF",
        borderWidth: 2,
        hoverBorderColor: "#FFFFFF",
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#A0A4B8",
          font: { size: 11, family: "'Inter', sans-serif" },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: "#252636",
        titleColor: "#F1F3F9",
        bodyColor: "#F1F3F9",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="adm-root">
      
      {/* ── HEADER ── */}
      <div className="dash-header">
        <div>
          <h2 className="dash-title">Admin Dashboard</h2>
          <p className="dash-subtitle">
            System overview and global metrics
          </p>
        </div>
        <div className="dash-header-right">
           <span className="dash-last-update">
              {time.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              {" — "}
              {time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })}
           </span>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <div className="dash-kpi-grid">
        
        <div className="dash-kpi card-hover">
          <div className="dash-kpi-icon" style={{ background: "rgba(67, 97, 238, 0.12)", color: "#4361EE" }}>
            <i className="fa-solid fa-server"></i>
          </div>
          <div className="dash-kpi-body">
            <div className="dash-kpi-label">Total Requests (24h)</div>
            <div className="dash-kpi-value">{Number(stats.requests || 0).toLocaleString()}</div>
            <div className="dash-kpi-subtext">Global API volume</div>
          </div>
        </div>

        <div className="dash-kpi card-hover">
          <div className="dash-kpi-icon" style={{ background: "rgba(34, 197, 94, 0.12)", color: "#22C55E" }}>
            <i className="fa-solid fa-check-double"></i>
          </div>
          <div className="dash-kpi-body">
            <div className="dash-kpi-label">Success Rate</div>
            <div className="dash-kpi-value">
              {Number(stats.successRate || 0).toFixed(1)}
              <span className="dash-kpi-suffix">%</span>
            </div>
            <div className="dash-kpi-subtext">Across all endpoints</div>
          </div>
        </div>

        <div className="dash-kpi card-hover">
          <div className="dash-kpi-icon" style={{ background: "rgba(139, 92, 246, 0.12)", color: "#8B5CF6" }}>
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="dash-kpi-body">
            <div className="dash-kpi-label">Active Users</div>
            <div className="dash-kpi-value">{Number(stats.users || 0).toLocaleString()}</div>
            <div className="dash-kpi-subtext">Currently subscribed</div>
          </div>
        </div>

      </div>

      {/* ── CHARTS ROW ── */}
      <div className="dash-charts-grid">
        
        {/* Request volume */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Global Request Volume</h3>
              <p className="dash-card-sub">Last 7 days aggregation</p>
            </div>
            <div className="dash-chart-legend">
              <span className="dash-legend-item">
                <span className="dash-legend-dot" style={{ background: "#4361EE" }}></span>
                Total
              </span>
              <span className="dash-legend-item">
                <span className="dash-legend-dot dash-legend-dot-line" style={{ background: "#22C55E" }}></span>
                Success %
              </span>
            </div>
          </div>
          <div className="dash-chart-wrap">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Networks pie */}
        <div className="dash-card">
          <div className="dash-chart-wrap" style={{ height: "240px", display: 'flex', justifyContent: 'center' }}>
            {networksData.length > 0 ? (
              <Pie data={pieData} options={pieOptions} />
            ) : (
              <div className="dash-empty">
                <i className="fa-regular fa-folder-open"></i>
                <p>No network data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── ERRORS TABLE ── */}
      <div className="dash-card" style={{ marginTop: '24px' }}>
        <div className="error-card-header" style={{ marginBottom: '16px' }}>
          <div>
            <h3 className="dash-card-title">Recent System Errors</h3>
            <p className="dash-card-sub">Live monitoring</p>
          </div>
          <span className="live-badge">
            <span className="live-dot" style={{ marginRight: '6px', width: 6, height: 6 }}></span> Live
          </span>
        </div>

        {errors.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="error-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Status Code</th>
                  <th>Endpoint</th>
                  <th>Occurrences</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((e, i) => (
                  <tr key={i}>
                    <td style={{ whiteSpace: 'nowrap' }}>{timeAgo(e.time)}</td>
                    <td>
                      <span className={`dash-code-badge ${e.code >= 500 ? "code-5xx" : "code-4xx"}`}>
                        {e.code}
                      </span>
                    </td>
                    <td className="err-endpoint" style={{ fontFamily: 'var(--font-mono)' }}>
                      {e.endpoint}
                    </td>
                    <td className="err-count">{e.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dash-empty" style={{ padding: '40px' }}>
             <i className="fa-regular fa-face-smile" style={{ fontSize: 32, opacity: 0.2 }}></i>
             <p>No errors reported recently</p>
          </div>
        )}
      </div>

    </div>
  );
}
