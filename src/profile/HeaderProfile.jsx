import { useState } from "react"
import "./HeaderProfile.css"
import AccountForms from "./AccountForms"

export default function HeaderProfile() {
  const [activeTab, setActiveTab] = useState("account")
  
  const user = {
    initials: "MB",
    fullName: "Moika Bennouri",
    location: "Tunisia",
    emailVerified: true,
  }

  const activities = [
    { action: "Logged in", time: "2 hours ago", location: "Tunisia" },
    { action: "Updated profile", time: "1 day ago", location: "Tunisia" },
    { action: "Changed password", time: "3 days ago", location: "Tunisia" },
    { action: "Created API key", time: "1 week ago", location: "Tunisia" },
  ]

  return (
    <div className="profile-page">
      <main className="profile-main">

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            onClick={() => setActiveTab("account")}
            className={`profile-tab ${activeTab === "account" ? "active" : ""}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Account
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`profile-tab ${activeTab === "activity" ? "active" : ""}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            Account Activity
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "account" ? (
          <div className="account-tab-content">
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-banner" />
              <div className="profile-info">
                <div className="profile-top-row">
                  <div className="profile-avatar">{user.initials}</div>
                </div>
                <div className="profile-details">
                  <h1 className="profile-name">{user.fullName}</h1>
                  <div className="profile-meta">
                    <div className="profile-location">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{user.location}</span>
                    </div>
                    {user.emailVerified && (
                      <div className="email-verified">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <path d="m9 11 3 3L22 4" />
                        </svg>
                        <span>Email verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Forms */}
            <AccountForms />
          </div>
        ) : (
          <div className="profile-card activity-card">
            <h2 className="activity-title">Recent Activity</h2>
            <div className="activity-list">
              {activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-info">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-location">{activity.location}</p>
                  </div>
                  <span className="activity-time">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}