import "./ProfileHeader.css";

export default function ProfileHeader({ user, AccountForms }) {
  return (
    <div className="ph-wrapper">

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Manage Your Profile</h1>
        <p className="hero-description">
          Update your personal information and manage your account.
        </p>
      </section>

      {/* ── Profile card ── */}
      <div className="ph-profile-card">
        <div className="ph-avatar">{user.initials}</div>
        <div className="ph-profile-info">
          <h2 className="ph-profile-name">{user.fullName}</h2>
          <div className="ph-profile-meta">
            {user.email && (
              <span className="ph-meta-email">{user.email}</span>
            )}
            {user.emailVerified && (
              <span className="ph-verified-badge">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="6.5" />
                  <polyline points="5 8 7.2 10.2 11 6" />
                </svg>
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Forms ── */}
      <AccountForms />

    </div>
  );
}