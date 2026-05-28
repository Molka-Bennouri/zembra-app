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
import "./Dashboard.css";
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

function KpiCard({ label, value, decimals = 0, suffix = "" }) {
  const display =
    decimals > 0
      ? Number(value || 0).toFixed(decimals)
      : Number(value || 0).toLocaleString();

  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {display}
        {suffix}
      </div>
    </div>
  );
}

function ChartLegend({ items }) {
  return (
    <div className="chart-legend">
      {items.map((item, i) => (
        <span key={i} className="chart-legend-item">
          <span className="legend-dot" style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
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
    return <div className="adm-root">Error: {error}</div>;
  }
  // CHART DATA
  const barData = {
    labels: chartData.map((d) => d.label),
    datasets: [
      {
        type: "bar",
        label: "Requests",
        data: chartData.map((d) => d.value),
        backgroundColor: "#6C63FF",
        borderRadius: 4,
        yAxisID: "y",
        order: 2,
      },
      {
        type: "line",
        label: "Success rate %",
        data: chartData.map((d) => d.success),
        borderColor: "#3ECFCF",
        pointBackgroundColor: "#3ECFCF",
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
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { color: "#888", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: {
          color: "#888",
          callback: (v) => (v / 1000).toFixed(0) + "k",
        },
      },
      y2: {
        grid: { drawOnChartArea: false },
        ticks: {
          color: "#888",
          callback: (v) => v + "%",
        },
        min: 0,
        max: 100,
      },
    },
  };

  // PIE CHART DATA
  const colors = ["#6C63FF", "#3ECFCF", "#FF6B6B", "#FFA500", "#4ECDC4", "#95E1D3"];
  const pieData = {
    labels: networksData.map((n) => n.network),
    datasets: [
      {
        label: "Network Usage",
        data: networksData.map((n) => n.count),
        backgroundColor: colors.slice(0, networksData.length),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#888",
          font: { size: 11 },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        displayColors: true,
      },
    },
  };

  return (
    <div className="adm-root">
      {/* HEADER */}
      <h2 className="adm-title">Admin dashboard</h2>

      <p className="adm-subtitle">
        {time.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
        {" — "}
        {time.toLocaleTimeString("fr-FR")}
      </p>

      {/* KPI */}
      <div className="kpi-grid">
        <KpiCard
          label="Requests (24h)"
          value={stats.requests}
        />

        <KpiCard
          label="Success rate"
          value={stats.successRate}
          decimals={1}
        />

        <KpiCard
          label="Active users"
          value={stats.users}
        />
      </div>

      {/* CHARTS */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-title">Request volume</div>
          <div className="card-sub">Last 7 days</div>

          <ChartLegend
            items={[
              { label: "Requests", color: "#6C63FF" },
              { label: "Success rate", color: "#3ECFCF" },
            ]}
          />

          <div className="chart-canvas-wrap">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* NETWORKS */}
        <div className="card">
          <div className="card-title">Networks Usage</div>
          <div className="card-sub">Client network distribution</div>

          <div className="chart-canvas-wrap" style={{ height: "300px" }}>
            {networksData.length > 0 ? (
              <Pie data={pieData} options={pieOptions} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888" }}>
                No network data available
              </div>
            )}
          </div>
        </div>

        {/* ERRORS */}
        <div className="card">
          <div className="error-card-header">
            <div>
              <div className="card-title">
                Recent errors
              </div>
              <div className="card-sub">
                Last occurrences
              </div>
            </div>

            <span className="live-badge">Live</span>
          </div>

          <table className="error-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Code</th>
                <th>Endpoint</th>
                <th>Count</th>
              </tr>
            </thead>

            <tbody>
              {errors.map((e, i) => (
                <tr key={i}>
                  <td>{e.time}</td>
                  <td>
                    <span
                      className={`err-code ${
                        e.code >= 500
                          ? "err-code-5xx"
                          : "err-code-4xx"
                      }`}
                    >
                      {e.code}
                    </span>
                  </td>
                  <td className="err-endpoint">
                    {e.endpoint}
                  </td>
                  <td className="err-count">
                    {e.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
