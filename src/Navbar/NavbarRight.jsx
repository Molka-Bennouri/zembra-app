"use client"

import "./NavbarRight.css"

export default function NavbarRight({ userName = "Moika" }) {
  return (
    <header className="navbar">
      <div className="navbar-content">
        {/* Left side - can add logo here */}
        <div className="navbar-left"></div>

        {/* Right side */}
        <div className="navbar-right">
          {/* Notification Bell */}
          <button className="notification-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="notification-badge" />
          </button>

          {/* User Dropdown */}
          <div className="user-dropdown">
            <button className="user-dropdown-trigger">
              <div className="user-avatar-small">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="user-name">{userName}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
