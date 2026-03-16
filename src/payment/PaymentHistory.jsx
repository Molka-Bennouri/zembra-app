
import { useState } from "react"
import "./PaymentHistory.css"

export default function PaymentHistory() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("all")
  const itemsPerPage = 10

  const paymentHistory = [
    {
      id: "INV-2026-001",
      date: "March 1, 2026",
      description: "Startup Plan - Monthly",
      amount: 500,
      status: "paid",
      paymentMethod: "Visa **** 4242"
    },
    {
      id: "INV-2026-002",
      date: "February 15, 2026",
      description: "Additional API Credits",
      amount: 150,
      status: "paid",
      paymentMethod: "Visa **** 4242"
    },
    {
      id: "INV-2026-003",
      date: "February 1, 2026",
      description: "Startup Plan - Monthly",
      amount: 500,
      status: "paid",
      paymentMethod: "Mastercard **** 8888"
    },
    {
      id: "INV-2025-012",
      date: "January 1, 2026",
      description: "Startup Plan - Monthly",
      amount: 500,
      status: "paid",
      paymentMethod: "Visa **** 4242"
    },
    {
      id: "INV-2025-011",
      date: "December 1, 2025",
      description: "Basic Plan - Monthly",
      amount: 50,
      status: "paid",
      paymentMethod: "Visa **** 4242"
    },
    {
      id: "INV-2025-010",
      date: "November 15, 2025",
      description: "Plan Upgrade Fee",
      amount: 25,
      status: "refunded",
      paymentMethod: "Visa **** 4242"
    },
    {
      id: "INV-2025-009",
      date: "November 1, 2025",
      description: "Basic Plan - Monthly",
      amount: 50,
      status: "paid",
      paymentMethod: "Visa **** 4242"
    },
    {
      id: "INV-2025-008",
      date: "October 1, 2025",
      description: "Basic Plan - Monthly",
      amount: 50,
      status: "paid",
      paymentMethod: "Visa **** 4242"
    },
    {
      id: "INV-2025-007",
      date: "September 15, 2025",
      description: "Additional Storage",
      amount: 75,
      status: "pending",
      paymentMethod: "Visa **** 4242"
    },
    {
      id: "INV-2025-006",
      date: "September 1, 2025",
      description: "Basic Plan - Monthly",
      amount: 50,
      status: "paid",
      paymentMethod: "Visa **** 4242"
    }
  ]

  const filteredPayments = filterStatus === "all" 
    ? paymentHistory 
    : paymentHistory.filter(p => p.status === filterStatus)

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage)

  const totalPaid = paymentHistory
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalRefunded = paymentHistory
    .filter(p => p.status === "refunded")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalPending = paymentHistory
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="payment-history-container">
      <header className="payment-history-header">
        <div>
          <h1 className="payment-history-title">Payment History</h1>
          <p className="payment-history-subtitle">View and manage your billing transactions</p>
        </div>
        <button className="export-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
      </header>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon paid">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Paid</span>
            <span className="summary-value">${totalPaid.toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon refunded">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Refunded</span>
            <span className="summary-value">${totalRefunded.toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon pending">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="summary-content">
            <span className="summary-label">Pending</span>
            <span className="summary-value">${totalPending.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => { setFilterStatus("all"); setCurrentPage(1); }}
          >
            All
          </button>
          <button 
            className={`filter-tab ${filterStatus === "paid" ? "active" : ""}`}
            onClick={() => { setFilterStatus("paid"); setCurrentPage(1); }}
          >
            Paid
          </button>
          <button 
            className={`filter-tab ${filterStatus === "refunded" ? "active" : ""}`}
            onClick={() => { setFilterStatus("refunded"); setCurrentPage(1); }}
          >
            Refunded
          </button>
          <button 
            className={`filter-tab ${filterStatus === "pending" ? "active" : ""}`}
            onClick={() => { setFilterStatus("pending"); setCurrentPage(1); }}
          >
            Pending
          </button>
        </div>
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search invoices..." className="search-input" />
        </div>
      </div>

      {/* Payment Table */}
      <div className="payment-table">
        <div className="table-header">
          <span className="col-invoice">Invoice</span>
          <span className="col-date">Date</span>
          <span className="col-description">Description</span>
          <span className="col-method">Payment Method</span>
          <span className="col-amount">Amount</span>
          <span className="col-status">Status</span>
          <span className="col-actions">Actions</span>
        </div>

        {paginatedPayments.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <p>No transactions found</p>
          </div>
        ) : (
          paginatedPayments.map((payment) => (
            <div key={payment.id} className="table-row">
              <span className="col-invoice">
                <span className="invoice-id">{payment.id}</span>
              </span>
              <span className="col-date">{payment.date}</span>
              <span className="col-description">{payment.description}</span>
              <span className="col-method">
                <span className="method-badge">
                  {payment.paymentMethod.includes("Visa") && (
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                      <rect width="24" height="16" rx="2" fill="#1A1F71"/>
                      <path d="M9.5 11L10.5 5H12L11 11H9.5Z" fill="#FFFFFF"/>
                      <path d="M16 5L14.5 11H13L14.5 5H16Z" fill="#FFFFFF"/>
                      <path d="M7 5L5 9.5L4.8 8.5L4.2 5.5C4.1 5.2 3.9 5 3.5 5H1L1 5.2C1.8 5.4 2.5 5.7 3 6L4.5 11H6L8.5 5H7Z" fill="#FFFFFF"/>
                      <path d="M17 5L19.5 11H21L19 5H17Z" fill="#FFFFFF"/>
                    </svg>
                  )}
                  {payment.paymentMethod.includes("Mastercard") && (
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                      <rect width="24" height="16" rx="2" fill="#000000"/>
                      <circle cx="9" cy="8" r="5" fill="#EB001B"/>
                      <circle cx="15" cy="8" r="5" fill="#F79E1B"/>
                      <path d="M12 4.5C13.1 5.3 13.8 6.6 13.8 8C13.8 9.4 13.1 10.7 12 11.5C10.9 10.7 10.2 9.4 10.2 8C10.2 6.6 10.9 5.3 12 4.5Z" fill="#FF5F00"/>
                    </svg>
                  )}
                  <span>{payment.paymentMethod.split(" ").slice(-2).join(" ")}</span>
                </span>
              </span>
              <span className="col-amount">${payment.amount.toLocaleString()}</span>
              <span className="col-status">
                <span className={`status-badge ${payment.status}`}>
                  {payment.status === "paid" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {payment.status === "refunded" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                  )}
                  {payment.status === "pending" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  )}
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </span>
              <span className="col-actions">
                <button className="action-btn" title="Download Invoice">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
                <button className="action-btn" title="View Details">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </span>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Previous
          </button>
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-number ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button 
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
