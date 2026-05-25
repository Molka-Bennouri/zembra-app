import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import NotificationPanel from "../notifications/NotificationPanel";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";

const getNavItems = (role) => {
  if (role === "admin") {
    return [
      { label: "Dashboard", path: "/AdminDashboard" },
      { label: "Users", path: "/ClientList" },
      { label: "Plans", path: "/PlansList" },
      { label: "Networks", path: "/NetworkList" },
      { label: "Fields", path: "/FieldList" },
    ];
  }
  return [
    {
      label: "Dashboard",
      path: "/Dashboard",
    },
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
      ]
    }
  ];
};

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
            <Link key={i} to={item.path} className="nav-dropdown-item" onClick={() => setOpen(false)}>
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-text">
                <span className="nav-item-label">{item.label}</span>
                <span className="nav-item-desc">{item.desc}</span>
              </span>
            </Link>
          ) : (
            <button key={i} className="nav-dropdown-item" onClick={() => setOpen(false)}>
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
  const navigate = useNavigate()
  const { logout } = useAuth()
  const role = localStorage.getItem("role")

  const handleLogout = () => {
    setOpen(false)
    logout()
    localStorage.removeItem("role")
    navigate("/login")
  }

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
        <Link
          to={role === "admin" ? "/admin/profile" : "/profile"}
          className="user-dropdown-item"
          onClick={() => setOpen(false)}
        >
          <span className="user-menu-icon">
            <i className="fa-regular fa-user text-gray-400" style={{ fontSize: 12 }}></i>
          </span>
          <span className="user-menu-label">Profile</span>
        </Link>
        <div className="user-menu-divider" />
        <button className="user-dropdown-item logout" onClick={handleLogout}>
          <span className="user-menu-icon">
            <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: 12 }}></i>
          </span>
          <span className="user-menu-label">Logout</span>
        </button>
      </div>
    </div>
  )
}

function NotificationDropdown() {
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
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="notification-btn"
        onClick={() => setOpen(v => !v)}
      >
        <i className="fa-regular fa-bell" style={{ fontSize: 17 }}></i>
        <span className="notification-badge" />
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 12px)",
          right: 0,
          zIndex: 1000,
          width: "380px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}>
          <NotificationPanel />
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { profile } = useProfile()
  const userName = profile?.full_name || "User"
  const role = localStorage.getItem("role")
  const navItems = getNavItems(role)

  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <Link
            to={role === "admin" ? "/admin/dashboard" : "/Dashboard"}
            style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}
          >
            <img src="/zembra-logo.jpg" alt="Zembra" className="navbar-logo-mark" />
            <span className="navbar-logo-text">Zembra</span>
          </Link>
          <div className="navbar-divider" />
          {navItems.map(item =>
            item.items ? (
              <NavDropdown key={item.label} label={item.label} items={item.items} />
            ) : (
              <Link key={item.label} to={item.path} className="nav-simple-link">
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="navbar-right">
          <NotificationDropdown />
          <UserDropdown userName={userName} />
        </div>
      </div>
    </header>
  )
}