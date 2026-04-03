import "./ProfileHeader.css"

export default function ProfileHeader({ user, AccountForms }) {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Manage Your Profile</h1>
        <p className="hero-description">
          Update your personal information and manage your account settings.
        </p>
      </section>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar-container">
          <div className="profile-avatar">{user.initials}</div>
        </div>
        <div className="profile-details">
          <h1 className="profile-name">{user.fullName}</h1>
          <div className="profile-meta">
            {user.emailVerified && (
              <div className="email-verified">
                <i className="fa-regular fa-circle-check" style={{ fontSize: 12 }}></i>
                <span>Email verified</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forms */}
      <AccountForms />
    </>
  )
}