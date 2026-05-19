import { useState, useMemo } from "react";
import { useClientsList } from "../../hooks/useClientsList.js";
import { deleteClient } from "../../utils/clientService";
import './ClientList.css'

export default function ClientList() {
  const { clients, loading, error, refetch } = useClientsList();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;

    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.role?.toLowerCase().includes(q) ||
        c.provider?.toLowerCase().includes(q)
    );
  }, [clients, search]);

  const handleDeleteClick = (id) => setConfirmId(id);

  const handleDeleteConfirm = async (id) => {
    setDeletingId(id);
    setConfirmId(null);

    try {
      const { error } = await deleteClient(id);
      if (error) {
        console.log(error);
        return;
      }
      refetch();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="cl-page">
      {/* Confirm overlay */}
      {confirmId && (
        <div className="cl-overlay" onClick={() => setConfirmId(null)}>
          <div className="cl-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this client ?</h3>
            <p>This action is irreversible. The client will be deleted permanently.</p>

            <div className="cl-dialog-actions">
              <button className="cl-btn cl-btn-ghost" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button
                className="cl-btn cl-btn-danger"
                onClick={() => handleDeleteConfirm(confirmId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="cl-card">
        {/* Header */}
        <div className="cl-header">
          <div>
            <h1 className="cl-title">Clients</h1>
            <p className="cl-subtitle">Client management</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="cl-toolbar">
          <input
            className="cl-search"
            type="text"
            placeholder="Search by name, email, role, provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {!loading && !error && (
            <span className="cl-count">
              {filtered.length} / {clients.length} client{clients.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="cl-body">
          {/* Error */}
          {error && <div className="cl-error">{error}</div>}

          {/* Loading */}
          {loading && <div className="cl-loading">Loading...</div>}

          {/* Table */}
          {!loading && !error && filtered.length > 0 && (
            <div className="cl-table-wrap">
              <table className="cl-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Provider</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((client) => (
                    <tr
                      key={client.id}
                      className={deletingId === client.id ? "cl-row-deleting" : ""}
                    >
                      <td>{client.id}</td>

                      <td className="cl-cell-name">
                        <span className="cl-dot" />
                        {client.name}
                      </td>

                      <td>{client.email}</td>

                      <td>
                        {client.role ? (
                          <span className="cl-badge">{client.role}</span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td>
                        {client.provider ? (
                          <span className="cl-badge cl-badge-alt">
                            {client.provider}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="cl-mono">
                        {client.created_at ?? "—"}
                      </td>

                      <td className="cl-mono">
                        {client.updated_at ?? "—"}
                      </td>

                      <td className="cl-actions">
                        <button
                          className="cl-action-delete"
                          onClick={() => handleDeleteClick(client.id)}
                          disabled={deletingId === client.id}
                        >
                          {deletingId === client.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="cl-empty">
              No clients found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}