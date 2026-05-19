import { useState, useMemo } from "react";
import { usePlansList } from "../../hooks/usePlansList";
import { deletePlan } from "../../utils/planService";
import { useNavigate } from "react-router-dom";
import "./PlansList.css";

export default function PlansList() {
  const { plans, loading, error, refetch } = usePlansList();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return plans;
    return plans.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.duration_days?.toString().includes(q) ||
        p.amount?.toString().includes(q)
    );
  }, [plans, search]);

  const handleDeleteClick = (id) => setConfirmId(id);

  const handleDeleteConfirm = async (id) => {
    setDeletingId(id);
    setConfirmId(null);
    try {
      const { error } = await deletePlan(id);
      if (error) {
        console.log(error);
        return;
      }
      refetch();
    } finally {
      setDeletingId(null);
    }
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="pl-page">
      {/* Confirm overlay */}
      {confirmId && (
        <div className="pl-overlay" onClick={() => setConfirmId(null)}>
          <div className="pl-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="pl-dialog-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3>Delete this plan?</h3>
            <p>This action is irreversible. The plan will be permanently deleted.</p>
            <div className="pl-dialog-actions">
              <button className="pl-btn pl-btn-ghost" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="pl-btn pl-btn-danger" onClick={() => handleDeleteConfirm(confirmId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="pl-card">
        {/* Header */}
        <div className="pl-header">
          <div className="pl-header-left">
            <div className="pl-header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div>
              <h1 className="pl-title">Payment Plans</h1>
              <p className="pl-subtitle">Zembra subscription plans management</p>
            </div>
          </div>

          <div className="pl-header-actions">
            <button
              className="pl-btn pl-btn-ghost pl-btn-icon"
              onClick={refetch}
              disabled={loading}
              title="Refresh"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                style={loading ? { animation: "pl-spin 0.75s linear infinite" } : {}}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </button>
            <button
              onClick={() => navigate("/AddPlanForm")}
              className="pl-btn pl-btn-primary"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add a plan
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="pl-toolbar">
          <div className="pl-search-wrap">
            <svg className="pl-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="pl-search"
              type="text"
              placeholder="Search by name, amount or duration…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="pl-search-clear" onClick={() => setSearch("")} title="Clear">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          {!loading && !error && (
            <span className="pl-count">
              {filtered.length} / {plans.length} plan{plans.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="pl-body">
          {/* Error */}
          {error && (
            <div className="pl-error-banner">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && !error && (
            <div className="pl-skeleton-list">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="pl-skeleton-row" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && plans.length === 0 && (
            <div className="pl-empty">
              <div className="pl-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <p>No plans created yet.</p>
              <button
                className="pl-btn pl-btn-primary pl-btn-sm"
                onClick={() => navigate("/AddPlanForm")}
              >
                Add the first plan
              </button>
            </div>
          )}

          {/* No search results */}
          {!loading && !error && plans.length > 0 && filtered.length === 0 && (
            <div className="pl-empty">
              <div className="pl-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <p>No results found for « {search} ».</p>
              <button className="pl-btn pl-btn-ghost pl-btn-sm" onClick={() => setSearch("")}>
                Clear Search
              </button>
            </div>
          )}

          {/* Table */}
          {!loading && !error && filtered.length > 0 && (
            <div className="pl-table-wrap">
              <table className="pl-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Duration (days)</th>
                    <th>Features</th>
                    <th>Created At</th>
                    <th className="pl-th-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((plan) => (
                    <tr
                      key={plan.id}
                      className={deletingId === plan.id ? "pl-row-deleting" : ""}
                    >
                      <td className="pl-cell-name">
                        <span className="pl-name-dot" />
                        {plan.name}
                      </td>
                      <td>
                        <span className="pl-badge pl-badge-amount">
                          {formatAmount(plan.amount)}
                        </span>
                      </td>
                      <td>
                        <span className="pl-badge pl-badge-duration">
                          {plan.duration_days} days
                        </span>
                      </td>
                      <td className="pl-cell-features">
                        {plan.features && plan.features.length > 0 ? (
                          <div className="pl-features-list">
                            {plan.features.slice(0, 2).map((f, i) => (
                              <span key={i} className="pl-feature-tag">{f}</span>
                            ))}
                            {plan.features.length > 2 && (
                              <span className="pl-feature-more">+{plan.features.length - 2}</span>
                            )}
                          </div>
                        ) : (
                          <span className="pl-cell-empty">—</span>
                        )}
                      </td>
                      <td className="pl-cell-date">
                        {plan.created_at ? formatDate(plan.created_at) : <span className="pl-cell-empty">—</span>}
                      </td>
                      <td className="pl-cell-actions">
                        <button
                          onClick={() => navigate("/AddPlanForm", { state: { plan } })}
                          className="pl-action-btn pl-action-edit"
                          title="Edit"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="pl-action-btn pl-action-delete"
                          title="Delete"
                          onClick={() => handleDeleteClick(plan.id)}
                          disabled={deletingId === plan.id}
                        >
                          {deletingId === plan.id ? (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                              style={{ animation: "pl-spin 0.75s linear infinite" }}>
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                          ) : (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          )}
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes pl-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}