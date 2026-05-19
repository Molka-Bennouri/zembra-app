import { useState, useMemo } from "react";
import { useNetworksList } from "../../hooks/useNetworksList";
import { deleteNetwork } from "../../utils/networkService";
import { useNavigate } from "react-router-dom";
import "./NetworkList.css";

export default function NetworkList() {
  const { networks, loading, error, refetch } = useNetworksList();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return networks;
    return networks.filter(
      (n) =>
        n.name?.toLowerCase().includes(q) ||
        n.label?.toLowerCase().includes(q) ||
        n.slug_pattern?.toLowerCase().includes(q)
    );
  }, [networks, search]);

  const handleDeleteClick = (id) => setConfirmId(id);
  
  const handleDeleteConfirm = async (id) => {
    setDeletingId(id);
    setConfirmId(null);
    try {
      // await deleteNetwork(id); // plug your delete call here
      const { error } = await deleteNetwork(id);
if (error) {
  console.log(error);
  return;
} // simulate
      refetch();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="nl-page">
      {/* Confirm overlay */}
      {confirmId && (
        <div className="nl-overlay" onClick={() => setConfirmId(null)}>
          <div className="nl-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="nl-dialog-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3>Delete this network ?</h3>
            <p>this action is irreversible. The network will be deleted permanently.</p>
            <div className="nl-dialog-actions">
              <button className="nl-btn nl-btn-ghost" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="nl-btn nl-btn-danger" onClick={() => handleDeleteConfirm(confirmId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="nl-card">
        {/* Header */}
        <div className="nl-header">
          <div className="nl-header-left">
            <div className="nl-header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2" />
                <circle cx="5" cy="19" r="2" />
                <circle cx="19" cy="19" r="2" />
                <line x1="12" y1="7" x2="5" y2="17" />
                <line x1="12" y1="7" x2="19" y2="17" />
              </svg>
            </div>
            <div>
              <h1 className="nl-title">Networks</h1>
              <p className="nl-subtitle">Scraped networks management</p>
            </div>
          </div>

          <div className="nl-header-actions">
            <button className="nl-btn nl-btn-ghost nl-btn-icon" onClick={refetch} disabled={loading} title="Rafraîchir">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                style={loading ? { animation: "nl-spin 0.75s linear infinite" } : {}}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </button>
            <button
  onClick={() => navigate("/AddNetworkForm")}
  className="nl-btn nl-btn-primary"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
  Add a network
</button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="nl-toolbar">
          <div className="nl-search-wrap">
            <svg className="nl-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="nl-search"
              type="text"
              placeholder="Search by name or label…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="nl-search-clear" onClick={() => setSearch("")} title="Effacer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          {!loading && !error && (
            <span className="nl-count">
              {filtered.length} / {networks.length} network{networks.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="nl-body">
          {/* Error */}
          {error && (
            <div className="nl-error-banner">
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
            <div className="nl-skeleton-list">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="nl-skeleton-row" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && networks.length === 0 && (
            <div className="nl-empty">
              <div className="nl-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="5" cy="19" r="2" />
                  <circle cx="19" cy="19" r="2" />
                  <line x1="12" y1="7" x2="5" y2="17" />
                  <line x1="12" y1="7" x2="19" y2="17" />
                </svg>
              </div>
              <p>No networks scraped yet.</p>
              <a href="/admin/networks/new" className="nl-btn nl-btn-primary nl-btn-sm">
                Add the first network
              </a>
            </div>
          )}

          {/* No search results */}
          {!loading && !error && networks.length > 0 && filtered.length === 0 && (
            <div className="nl-empty">
              <div className="nl-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <p>No results found for « {search} ».</p>
              <button className="nl-btn nl-btn-ghost nl-btn-sm" onClick={() => setSearch("")}>Clear Search</button>
            </div>
          )}

          {/* Table */}
          {!loading && !error && filtered.length > 0 && (
            <div className="nl-table-wrap">
              <table className="nl-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Label</th>
                    <th>Slug regex pattern</th>
                    <th className="nl-th-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((network) => (
                    <tr
                      key={network.id}
                      className={deletingId === network.id ? "nl-row-deleting" : ""}
                    >
                      <td className="nl-cell-name">
                        <span className="nl-name-dot" />
                        {network.name}
                      </td>
                      <td>
                        {network.label
                          ? <span className="nl-badge">{network.label}</span>
                          : <span className="nl-cell-empty">—</span>
                        }
                      </td>
                      <td className="nl-cell-mono">
                        {network.slug_pattern ?? <span className="nl-cell-empty">—</span>}
                      </td>
                      <td className="nl-cell-actions">
                        <button
                          onClick={() => navigate("/AddNetworkForm", { state: { network } })}
  className="nl-action-btn nl-action-edit"
  title="Edit"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="nl-action-btn nl-action-delete"
                          title="Delete"
                          onClick={() => handleDeleteClick(network.id)}
                          disabled={deletingId === network.id}
                        >
                          {deletingId === network.id ? (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                              style={{ animation: "nl-spin 0.75s linear infinite" }}>
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

      <style>{`@keyframes nl-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}