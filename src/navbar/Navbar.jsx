/* ============================================================
   SIDEBAR NAVIGATION COMPONENT
   Redesign: Replaces top navbar with fixed left sidebar.
   Preserves: role-based nav items, auth logic, profile hook.
============================================================ */

import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationPanel from "../notifications/NotificationPanel";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";

/* ── Navigation config by role ─────────────────────────────── */
const getNavItems = (role) => {
  if (role === "admin") {
    return [
      { label: "Dashboard", path: "/AdminDashboard", icon: "fa-solid fa-chart-line" },
      { label: "Users", path: "/ClientList", icon: "fa-solid fa-users" },
      { label: "Plans", path: "/PlansList", icon: "fa-solid fa-tags" },
      { label: "Networks", path: "/NetworkList", icon: "fa-solid fa-network-wired" },
      { label: "Fields", path: "/FieldList", icon: "fa-solid fa-table-cells" },
    ];
  }

  return [
    {
      label: "Dashboard",
      path: "/Dashboard",
      icon: "fa-solid fa-chart-line",
    },
    {
      label: "API",
      icon: "fa-solid fa-code",
      items: [
        { label: "Listing Details", path: "/listing", icon: "fa-regular fa-file-lines" },
        { label: "Page Reviews", path: "/reviews", icon: "fa-regular fa-star" },
        { label: "Match Listing", path: "/match", icon: "fa-solid fa-magnifying-glass" },
      ],
    },
    {
      label: "History",
      path: "/scrapinghistory",
      icon: "fa-solid fa-clock-rotate-left",
    },
    {
      label: "Payments",
      icon: "fa-solid fa-credit-card",
      items: [
        { label: "Manage Payments", path: "/payment", icon: "fa-regular fa-credit-card" },
        { label: "Payment History", path: "/paymenthistory", icon: "fa-regular fa-clock" },
      ],
    },
  ];
};

/* ── Sidebar Component ─────────────────────────────────────── */
export default function Navbar() {
  const { profile } = useProfile();
  const userName = profile?.full_name || "User";
  const userEmail = profile?.email || "";
  const role = localStorage.getItem("role");
  const navItems = getNavItems(role);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userRef = useRef(null);

  // Get initials for avatar
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target))
        setUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleSection = (label) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (path) => {
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  const isParentActive = (items) => {
    return items?.some((item) => isActive(item.path));
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Dispatch custom event for content margin adjustment
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: { collapsed } }));
  }, [collapsed]);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="mobile-hamburger"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? "visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Logo */}
        <Link
          to={role === "admin" ? "/AdminDashboard" : "/Dashboard"}
          className="sidebar-logo"
        >
          <img src="/zembra-logo.jpg" alt="Zembra" className="sidebar-logo-mark" />
          <span className="sidebar-logo-text">Zembra</span>
        </Link>

        {/* Collapse toggle (desktop only) */}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i className={`fa-solid fa-chevron-${collapsed ? "right" : "left"}`} style={{ fontSize: 10 }}></i>
        </button>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>

          {navItems.map((item) => {
            // Item with sub-items (expandable)
            if (item.items) {
              const isExpanded = expandedSections[item.label] || isParentActive(item.items);

              return (
                <div key={item.label}>
                  <button
                    className={`sidebar-item ${isParentActive(item.items) ? "active" : ""}`}
                    onClick={() => toggleSection(item.label)}
                  >
                    <span className="sidebar-item-icon">
                      <i className={item.icon}></i>
                    </span>
                    <span className="sidebar-item-label">{item.label}</span>
                    <i
                      className={`fa-solid fa-chevron-down sidebar-expand-icon ${isExpanded ? "rotated" : ""}`}
                    ></i>
                    <span className="sidebar-tooltip">{item.label}</span>
                  </button>

                  <div className={`sidebar-subnav ${isExpanded ? "open" : ""}`}>
                    {item.items.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className={`sidebar-subitem ${isActive(sub.path) ? "active" : ""}`}
                      >
                        <i className={sub.icon} style={{ fontSize: 12 }}></i>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            // Simple nav item
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
              >
                <span className="sidebar-item-icon">
                  <i className={item.icon}></i>
                </span>
                <span className="sidebar-item-label">{item.label}</span>
                <span className="sidebar-tooltip">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="sidebar-user" ref={userRef}>
          <button
            className="sidebar-user-trigger"
            onClick={() => setUserDropdownOpen((v) => !v)}
          >
            <div className="sidebar-user-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{userName}</span>
              <span className="sidebar-user-email">{userEmail}</span>
            </div>
          </button>

          <div className={`sidebar-user-dropdown ${userDropdownOpen ? "open" : ""}`}>
            <Link
              to={role === "admin" ? "/admin/profile" : "/profile"}
              className="sidebar-user-dropdown-item"
              onClick={() => setUserDropdownOpen(false)}
            >
              <i className="fa-regular fa-user" style={{ fontSize: 13 }}></i>
              Profile
            </Link>
            <div className="sidebar-user-dropdown-divider" />
            <button
              className="sidebar-user-dropdown-item logout"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: 13 }}></i>
              Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}