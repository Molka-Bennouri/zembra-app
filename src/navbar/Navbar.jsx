import { useState, useRef, useEffect } from "react"
import "./Navbar.css"
import { Link } from "react-router-dom"

const navItems = [
  {
    label: "API",
    items: [
      { label: "Listing details", path: "/listing", icon: <i className="fa-regular fa-file-lines"></i>, desc: "Retrieve detailed listing data" },
      { label: "Page reviews", path: "/reviews", icon: <i className="fa-regular fa-star"></i>, desc: "Access page-level review data" },
      { label: "Match listing", path: "/match", icon: <i className="fa-solid fa-magnifying-glass"></i>, desc: "Match and identify listings" },
    ]
  },
  {
    label: "Payments",
    items: [
      { label: "Manage payments", path: "/payment", icon: <i className="fa-regular fa-credit-card"></i>, desc: "Update payment methods" },
      { label: "Payment history", path: "/paymenthistory", icon: <i className="fa-regular fa-clock"></i>, desc: "View past transactions" },
      { label: "Invoices", path: "/invoices", icon: <i className="fa-regular fa-file-lines"></i>, desc: "Download and manage invoices" },
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
        <i className={`fa-solid fa-chevron-down nav-chevron ${open ? "rotated" : ""}`} style={{ fontSize: 8 }}></i>
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
          <i className="fa-regular fa-user" style={{ fontSize: 16, color: '#9ca3af' }}></i>
        </div>
        <span className="user-name">{userName}</span>
        <i className={`fa-solid fa-chevron-down nav-chevron ${open ? "rotated" : ""}`} style={{ fontSize: 8 }}></i>
      </button>

      <div className={`user-dropdown-menu ${open ? "open" : ""}`}>
        <div className="user-dropdown-arrow" />

        {/* Profile */}
        <Link to="/profile" className="user-dropdown-item" onClick={() => setOpen(false)}>
          <span className="user-menu-icon">
            <i className="fa-regular fa-user text-gray-400" style={{ fontSize: 12 }}></i>
          </span>
          <span className="user-menu-label">Profile</span>
        </Link>

        <div className="user-menu-divider" />

        {/* Logout */}
        <Link to='/login' className="user-dropdown-item logout" onClick={() => setOpen(false)}>
          <span className="user-menu-icon">
            <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: 12 }}></i>
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
            <i className="fa-regular fa-bell" style={{ fontSize: 17 }}></i>
            <span className="notification-badge" />
          </button>

          {/* User Dropdown */}
          <UserDropdown userName={userName} />
        </div>
      </div>
    </header>
  )
}