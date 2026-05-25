import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateClient, getClients } from "../../utils/clientService";

export default function EditClientPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [isFetching, setIsFetching]     = useState(true);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");

  // Prefill with current client data
  useEffect(() => {
    const load = async () => {
      const { clients, error } = await getClients();
      if (error) { setError(error); setIsFetching(false); return; }
      const client = clients.find((c) => String(c.id) === String(id));
      if (!client) { setError("Client not found."); setIsFetching(false); return; }
      setFullName(client.name ?? "");
      setEmail(client.email ?? "");
      setIsFetching(false);
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email) {
      setError("Full name and email are required.");
      return;
    }

    const payload = { full_name: fullName, email };
    if (password) {
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      payload.password = password;
    }

    setIsLoading(true);
    const { error: updateError } = await updateClient(id, payload);
    setIsLoading(false);

    if (updateError) {
      setError(updateError);
      return;
    }

    setSuccess("Client updated successfully.");
    setTimeout(() => navigate("/ClientList"), 1200);
  };

  return (
    <div className="cl-page">
      <div className="cl-card" style={{ maxWidth: 540 }}>

        {/* Header */}
        <div className="cl-header">
          <div>
            <h1 className="cl-title">Edit Client</h1>
            <p className="cl-subtitle">Update client information</p>
          </div>
          <button
            className="cl-btn cl-btn-ghost"
            onClick={() => navigate("/ClientList")}
          >
            ← Back
          </button>
        </div>

        {/* Form body */}
        <div className="cl-body" style={{ padding: "28px" }}>

          {/* Error */}
          {error && (
            <div className="cl-error" style={{ marginBottom: 20 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 20, padding: "12px 16px",
              background: "#f0fdf4", border: "1px solid #86efac",
              borderRadius: 8, color: "#16a34a", fontSize: 13.5
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {success}
            </div>
          )}

          {isFetching ? (
            <div className="cl-loading">Loading client data...</div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Full Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--cl-text-primary)" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="cl-search"
                  style={{ maxWidth: "100%", height: 40 }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--cl-text-primary)" }}>
                  Email
                </label>
                <input
                  type="email"
                  className="cl-search"
                  style={{ maxWidth: "100%", height: 40 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--cl-text-primary)" }}>
                  New Password
                  <span style={{ fontSize: 12, fontWeight: 400, color: "var(--cl-text-muted)", marginLeft: 8 }}>
                    (leave blank to keep current)
                  </span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="cl-search"
                    style={{ maxWidth: "100%", height: 40, paddingRight: 40 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: 10, top: "50%",
                      transform: "translateY(-50%)", background: "none",
                      border: "none", cursor: "pointer", color: "var(--cl-text-muted)",
                      padding: 0, display: "flex", alignItems: "center"
                    }}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  type="button"
                  className="cl-btn cl-btn-ghost"
                  onClick={() => navigate("/ClientList")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cl-btn cl-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}