<<<<<<< Updated upstream
import logo from './logo.svg';
=======
/* ============================================================
   APP.JS — Main Router
   Updated: layout uses sidebar + content wrapper
============================================================ */

import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
>>>>>>> Stashed changes
import './App.css';

/* ── Layout wrapper: sidebar + content area ─────────────────── */
function SidebarLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      setSidebarCollapsed(e.detail.collapsed);
    };
    window.addEventListener("sidebar-toggle", handler);
    return () => window.removeEventListener("sidebar-toggle", handler);
  }, []);

  return (
    <>
      <Navbar />
      <div className={`app-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Outlet />
      </div>
    </>
  );
}

function App() {
  return (
<<<<<<< Updated upstream
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
=======
    <Router>
      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#111827',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '12px',
            fontSize: '13px',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          },
          success: {
            iconTheme: { primary: '#22C55E', secondary: '#FFFFFF' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
          },
        }}
      />

      <Routes>
        {/* No sidebar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/auth/callback" element={<SSOCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* With sidebar */}
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/listing" element={<ListingPage />} />
          <Route path="/reviews" element={<ReviewPage />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/payment" element={<ManagePayment />} />
          <Route path="/paymenthistory" element={<PaymentHistory />} />
          <Route path="/modalcard" element={<ModalCard />} />
          <Route path="/scrapinghistory" element={<QueryHistory />} />

          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/AddNetworkForm" element={<AddNetworkForm />} />
          <Route path="/AddFieldForm" element={<AddFieldForm />} />
          <Route path="/AddPlanForm" element={<AddPlanForm />} />
          <Route path="/NetworkList" element={<NetworkList />} />
          <Route path="/FieldList" element={<FieldList />} />
          <Route path="/ClientList" element={<ClientList />} />
          <Route path="/PlansList" element={<PlansList />} />
          <Route path="/admin/clients/create"    element={<AddClientPage />} />
          <Route path="/admin/clients/:id/edit" element={<EditClientPage />} />
        </Route>
      </Routes>
    </Router>
>>>>>>> Stashed changes
  );
}

export default App;
