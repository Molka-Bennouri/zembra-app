import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import useDashboard from "../hooks/useDashboard";

function CountUp({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const from = prev.current;
    prev.current = target;
    let start = null;

    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(from + p * (target - from)));
      if (p < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{val.toLocaleString()}</span>;
}

export default function Dashboard() {
  const {
    stats,
    requests,
    loading,
    error,
    lastUpdate,
    refreshing,
    refresh,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState("all");

  const networks = stats.networks || {
    active: 0,
    total: 0,
    list: [],
  };

  const filtered =
    activeTab === "all"
      ? requests
      : requests.filter((r) => r.status === activeTab);

  const lastUpdateLabel = lastUpdate
    ? lastUpdate.toLocaleTimeString()
    : "—";

  return (
    <div className="sd-root">
      <div className="sd-layout">
        {/* ── HEADER ── */}
        <header className="sd-page-header">
          <div>
            <h1 className="sd-page-title">Dashboard</h1>
            <p className="sd-page-sub">
              Overview of your scraping activity
            </p>
          </div>

          <div className="sd-header-actions">
            {lastUpdate && (
              <span className="sd-last-update">
                Updated at {lastUpdateLabel}
              </span>
            )}

            <button
              className={`sd-refresh-btn ${refreshing ? "sd-refresh-btn--spinning" : ""
                }`}
              onClick={() => refresh(true)}
              disabled={refreshing}
            >
              Refresh
            </button>
          </div>
        </header>

        {/* ── ERROR ── */}
        {error && (
          <div className="sd-error-banner">
            Failed to load data — {error}
            <button onClick={() => refresh(true)}>Retry</button>
          </div>
        )}

        {/* ── KPIs ── */}
        <section className="sd-kpis">
          {/* Networks */}
          <div className="sd-card">
            <p className="sd-kpi__label">Networks</p>
            <div className="sd-kpi__value">
              <CountUp target={networks.active} />
              <span className="sd-kpi__denom">
                / {networks.total}
              </span>
            </div>
          </div>

          {/* Requests */}
          <div className="sd-card">
            <p className="sd-kpi__label">Requests (24h)</p>
            <div className="sd-kpi__value">
              <CountUp
                target={stats.requests_24h?.total || 0}
              />
            </div>
          </div>

          {/* Success rate */}
          <div className="sd-card">
            <p className="sd-kpi__label">Success Rate</p>

            <div className="sd-rate">
              <div className="sd-rate__value">
                {stats.success_rate || 0}%
              </div>

              <div className="sd-rate__stats">
                <span className="sd-status-badge sd-status-badge--success">
                  ✓ {stats.requests_24h?.success || 0}
                </span>
                <span className="sd-status-badge sd-status-badge--error">
                  ✗ {stats.requests_24h?.errors || 0}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── TABLE ── */}
        <div className="sd-card">
          <div className="history-header-info">
            <h2 className="history-title">
              Recent Requests
            </h2>
            <p className="history-count">
              {filtered.length} entries shown
            </p>
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
            <p>Loading...</p>
          ) : filtered.length === 0 ? (
            <p>No requests found</p>
          ) : (
            <div className="sd-table">
              <div className="sd-table__head">
                <span>Network</span>
                <span>Slug</span>
                <span>Status</span>
                <span>Code</span>
                <span>Executed</span>
              </div>

              {filtered.map((r) => (
                <div key={r.id} className="sd-table__row">
                  <span className="sd-table__network">{r.network}</span>
                  <span className="sd-table__slug">{r.slug}</span>
                  <span className={`sd-status-badge sd-status-badge--${r.status}`}>
                    {r.status}
                  </span>
                  <span className={`sd-code-badge sd-code-badge--${r.status}`}>
                    {r.status_code ?? (r.status === "success" ? 200 : "—")}
                  </span>
                  <span className="sd-table__muted">{r.created_at}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}