import { useState } from "react"
import "./PaymentHistory.css"

export default function PaymentHistory() {
  const [filterStatus, setFilterStatus] = useState("all")

  const paymentHistory = [
    { id: "INV-2026-001", date: "March 1, 2026", description: "Startup Plan - Monthly", amount: 500, status: "paid", paymentMethod: "Visa **** 4242" },
    { id: "INV-2025-010", date: "November 15, 2025", description: "Plan Upgrade Fee", amount: 25, status: "refunded", paymentMethod: "Visa **** 4242" },
    { id: "INV-2025-007", date: "September 15, 2025", description: "Additional Storage", amount: 75, status: "pending", paymentMethod: "Visa **** 4242" },
    { id: "INV-2025-006", date: "September 1, 2025", description: "Basic Plan - Monthly", amount: 50, status: "paid", paymentMethod: "Visa **** 4242" }
  ]

  const filteredPayments = filterStatus === "all"
    ? paymentHistory
    : paymentHistory.filter(p => p.status === filterStatus)

  const totalPaid = paymentHistory
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalRefunded = paymentHistory
    .filter(p => p.status === "refunded")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalPending = paymentHistory
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0)

  const downloadCSV = () => {
    const content = paymentHistory.map(inv =>
      `${inv.id} | ${inv.description} | ${inv.date} | $${inv.amount} | ${inv.status}`
    ).join("\n")

    const blob = new Blob([content], { type: "application/pdf" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoices-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="payment-history-container">
      <header className="payment-history-header">
        <div>
          <h1 className="payment-history-title">Payment History</h1>
          <p className="payment-history-subtitle">View and manage your billing transactions</p>
        </div>
        <button onClick={downloadCSV} className="export-btn">
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
            <i className="fa-solid fa-check"></i>
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Paid</span>
            <span className="summary-value">${totalPaid.toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon refunded">
            <i className="fa-solid fa-rotate-left"></i>
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Refunded</span>
            <span className="summary-value">${totalRefunded.toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon pending">
            <i className="fa-regular fa-clock"></i>
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
            onClick={() => setFilterStatus("all")}
          >
            All
          </button>
          <button
            className={`filter-tab ${filterStatus === "paid" ? "active" : ""}`}
            onClick={() => setFilterStatus("paid")}
          >
            Paid
          </button>
          <button
            className={`filter-tab ${filterStatus === "refunded" ? "active" : ""}`}
            onClick={() => setFilterStatus("refunded")}
          >
            Refunded
          </button>
          <button
            className={`filter-tab ${filterStatus === "pending" ? "active" : ""}`}
            onClick={() => setFilterStatus("pending")}
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

      {/* Payments Card */}
      <div className="payments-section">
        <div className="payments-card">
          <div className="payments-table">
            <div className="table-header">
              <span className="col-invoice">Invoice</span>
              <span className="col-date">Date</span>
              <span className="col-description">Description</span>
              <span className="col-method">Payment Method</span>
              <span className="col-amount">Amount</span>
              <span className="col-status">Status</span>
              <span className="col-actions">Actions</span>
            </div>

            {filteredPayments.length === 0 ? (
              <div className="empty-state">
                <p>No transactions found</p>
              </div>
            ) : (
              filteredPayments.map((payment) => (
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
                          <rect width="24" height="16" rx="2" fill="#1A1F71" />
                          <path d="M9.5 11L10.5 5H12L11 11H9.5Z" fill="#FFFFFF" />
                          <path d="M16 5L14.5 11H13L14.5 5H16Z" fill="#FFFFFF" />
                          <path d="M7 5L5 9.5L4.8 8.5L4.2 5.5C4.1 5.2 3.9 5 3.5 5H1L1 5.2C1.8 5.4 2.5 5.7 3 6L4.5 11H6L8.5 5H7Z" fill="#FFFFFF" />
                          <path d="M17 5L19.5 11H21L19 5H17Z" fill="#FFFFFF" />
                        </svg>
                      )}
                      {payment.paymentMethod.includes("Mastercard") && (
                        <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                          <rect width="24" height="16" rx="2" fill="#000000" />
                          <circle cx="9" cy="8" r="5" fill="#EB001B" />
                          <circle cx="15" cy="8" r="5" fill="#F79E1B" />
                          <path d="M12 4.5C13.1 5.3 13.8 6.6 13.8 8C13.8 9.4 13.1 10.7 12 11.5C10.9 10.7 10.2 9.4 10.2 8C10.2 6.6 10.9 5.3 12 4.5Z" fill="#FF5F00" />
                        </svg>
                      )}
                      <span>{payment.paymentMethod.split(" ").slice(-2).join(" ")}</span>
                    </span>
                  </span>
                  <span className="col-amount">${payment.amount.toLocaleString()}</span>
                  <span className="col-status">
                    <span className={`status-badge ${payment.status}`}>
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
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}