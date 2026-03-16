import { useState, useRef, useEffect } from "react"
import "./Navbar.css"
import { Link } from "react-router-dom"

const navItems = [
  {
    label: "API",
    items: [
      {
        label: "Listing details",
        path: "/listing",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
        desc: "Retrieve detailed listing data"
      },
      {
        label: "Page reviews",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
        desc: "Access page-level review data"
      },
      {
        label: "Match listing",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        ),
        desc: "Match and identify listings"
      },
    ]
  },
  {
    label: "Payments",
    items: [
      {
        label: "Manage payments",
        path : "/payment",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        ),
        desc: "Update payment methods"
      },
      {
        label: "Payment history",
        path : "/paymenthistory",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
        desc: "View past transactions"
      },
      {
        label: "Invoices",
        path : '/invoices',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
        desc: "Download and manage invoices"
      },
    ]
  }
]

function NavDropdown({ label, items }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="nav-dropdown">
      <button
        className={`nav-dropdown-trigger ${open ? "active" : ""}`}
        onClick={() => setOpen(v => !v)}
      >
        {label}
        <svg
          className={`nav-chevron ${open ? "rotated" : ""}`}
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div className={`nav-dropdown-menu ${open ? "open" : ""}`}>
        <div className="nav-dropdown-arrow" />
        {items.map((item, i) =>
          item.path ? (
            <Link
              key={i}
              to={item.path}
              className="nav-dropdown-item"
              onClick={() => setOpen(false)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-text">
                <span className="nav-item-label">{item.label}</span>
                <span className="nav-item-desc">{item.desc}</span>
              </span>
            </Link>
          ) : (
            <button
              key={i}
              className="nav-dropdown-item"
              onClick={() => setOpen(false)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-text">
                <span className="nav-item-label">{item.label}</span>
                <span className="nav-item-desc">{item.desc}</span>
              </span>
            </button>
          )
        )}
      </div>
    </div>
  )
}

function UserDropdown({ userName }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="user-dropdown">
      <button
        className={`user-dropdown-trigger ${open ? "active" : ""}`}
        onClick={() => setOpen(v => !v)}
      >
        <div className="user-avatar-small">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <span className="user-name">{userName}</span>
        <svg
          className={`nav-chevron ${open ? "rotated" : ""}`}
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div className={`user-dropdown-menu ${open ? "open" : ""}`}>
        <div className="user-dropdown-arrow" />

        {/* Profile */}
        <Link to="/profile" className="user-dropdown-item" onClick={() => setOpen(false)}>
          <span className="user-menu-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <span className="user-menu-label">Profile</span>
        </Link>

        <div className="user-menu-divider" />

        {/* Logout */}
        <Link to='/login' className="user-dropdown-item logout" onClick={() => setOpen(false)}>
          <span className="user-menu-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span className="user-menu-label">Logout</span>
        </Link>
      </div>
    </div>
  )
}

export default function Navbar({ userName = "Moika" }) {
  return (
    <header className="navbar">
      <div className="navbar-content">

        {/* Left — Logo + Nav */}
        <div className="navbar-left">
          <img src="/zembra-logo.jpg" alt="Zembra" className="navbar-logo-mark" />
          <span className="navbar-logo-text">Zembra</span>
          <div className="navbar-divider" />
          {navItems.map(item => (
            <NavDropdown key={item.label} label={item.label} items={item.items} />
          ))}
        </div>

        {/* Right */}
        <div className="navbar-right">
          {/* Notification Bell */}
          <button className="notification-btn">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="notification-badge" />
          </button>

          {/* User Dropdown */}
          <UserDropdown userName={userName} />
        </div>

      </div>
    </header>
  )
}