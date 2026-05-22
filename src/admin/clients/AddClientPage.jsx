import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../clients/ClientList.css";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function AddClientPage() {
  const navigate = useNavigate();

  const [fullName, setFullName]             = useState("");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [isLoading, setIsLoading]           = useState(false);
  const [error, setError]                   = useState("");
  const [success, setSuccess]               = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? `Error ${res.status}`);
        return;
      }

      setSuccess("Client created successfully.");
      setTimeout(() => navigate("/ClientList"), 1200);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const eyeOpen = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const eyeOff = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  const passwordToggleStyle = {
    position: "absolute", right: 10, top: "50%",
    transform: "translateY(-50%)", background: "none",
    border: "none", cursor: "pointer",
    color: "var(--cl-text-muted)", padding: 0,
    display: "flex", alignItems: "center",
  };

  return (
    <div className="cl-page">
      <div className="cl-card" style={{ maxWidth: 540 }}>

        {/* Header */}
        <div className="cl-header">
          <div>
            <h1 className="cl-title">Add Client</h1>
            <p className="cl-subtitle">Create a new client account</p>
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
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
                Password
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
                <button type="button" style={passwordToggleStyle} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? eyeOff : eyeOpen}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--cl-text-primary)" }}>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="cl-search"
                  style={{ maxWidth: "100%", height: 40, paddingRight: 40 }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
                <button type="button" style={passwordToggleStyle} onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? eyeOff : eyeOpen}
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
                {isLoading ? "Creating..." : "Create Client"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}