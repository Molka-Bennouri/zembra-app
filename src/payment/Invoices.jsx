import { useState } from "react"
import "./Invoices.css"

export default function Invoices() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  const invoices = [
    { id: "INV-2026-048", date: "February 20, 2026", dueDate: "March 7, 2026", description: "Business Plan - Monthly", amount: 1000, status: "paid", customer: "Enterprise Solutions", items: 1 },
    { id: "INV-2026-044", date: "January 15, 2026", dueDate: "January 30, 2026", description: "Basic Plan - Monthly", amount: 50, status: "paid", customer: "Startup Hub", items: 1 },
    { id: "INV-2026-042", date: "December 15, 2025", dueDate: "December 30, 2025", description: "Additional Storage", amount: 75, status: "overdue", customer: "Web Services Ltd", items: 1 },
    { id: "INV-2026-041", date: "December 1, 2025", dueDate: "December 16, 2025", description: "Basic Plan - Monthly", amount: 50, status: "paid", customer: "Startup Hub", items: 1 }
  ]

  let filtered = filterStatus === "all" ? invoices : invoices.filter(i => i.status === filterStatus)

  if (searchTerm) {
    filtered = filtered.filter(i =>
      i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Apply sorting
  const sorted = [...filtered].sort((a, b) => {
    let aVal, bVal

    switch (sortBy) {
      case "amount":
        aVal = a.amount
        bVal = b.amount
        break
      case "customer":
        aVal = a.customer.toLowerCase()
        bVal = b.customer.toLowerCase()
        break
      case "status":
        aVal = a.status
        bVal = b.status
        break
      case "date":
      default:
        aVal = new Date(a.date)
        bVal = new Date(b.date)
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const paidTotal = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)
  const overdueTotal = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0)

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (status) => {
    setFilterStatus(status)
  }

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(newSortBy)
      setSortOrder("desc")
    }
  }

  const downloadCSV = () => {
    const headers = ["Invoice ID", "Customer", "Date", "Due Date", "Amount", "Status", "Description"]
    const rows = sorted.map(inv => [
      inv.id,
      inv.customer,
      inv.date,
      inv.dueDate,
      `$${inv.amount}`,
      inv.status,
      inv.description
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoices-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const downloadPDF = () => {
    const content = sorted.map(inv =>
      `${inv.id} | ${inv.customer} | ${inv.date} | $${inv.amount} | ${inv.status}`
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
    <div className="invoices-container">
      <header className="invoices-header">
        <div>
          <h1 className="invoices-title">Invoices</h1>
          <p className="invoices-subtitle">Send,and manage your invoices</p>
        </div>
        <div className="header-actions">
          <div className="download-menu">
            <button className="download-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
            <div className="download-menu-items">
              <button onClick={downloadCSV} className="menu-item">
                <i class="fa-regular fa-file"></i>
                Download as CSV
              </button>
              <button onClick={downloadPDF} className="menu-item">
                <i class="fa-regular fa-file"></i>
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon paid">
            <i className="fa-solid fa-check"></i>
          </div>
          <div className="summary-content">
            <span className="summary-label">Paid</span>
            <span className="summary-value">${paidTotal.toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon overdue">
            <i className="fa-regular fa-clock"></i>
          </div>
          <div className="summary-content">
            <span className="summary-label">Overdue</span>
            <span className="summary-value">${overdueTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          <button
            className={`filter-tab ${filterStatus === "paid" ? "active" : ""}`}
            onClick={() => handleFilterChange("paid")}
          >
            Paid
          </button>
          <button
            className={`filter-tab ${filterStatus === "overdue" ? "active" : ""}`}
            onClick={() => handleFilterChange("overdue")}
          >
            Overdue
          </button>
        </div>
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 12 }}></i>
          <input
            type="text"
            placeholder="Search invoices..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="invoices-section">
        <div className="invoices-card">

          <div className="invoices-table">
            <div className="table-header">
              <span className="col-invoice">Invoice</span>
              <span className="col-customer">
                <button className="sort-btn" onClick={() => handleSort("customer")}>
                  Customer
                  {sortBy === "customer" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: sortOrder === "asc" ? "rotate(180deg)" : "" }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </button>
              </span>

              <span className="col-date">
                <button className="sort-btn" onClick={() => handleSort("date")}>
                  Date
                  {sortBy === "date" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: sortOrder === "asc" ? "rotate(180deg)" : "" }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </button>
              </span>

              <span className="col-due">Due Date</span>

              <span className="col-amount">
                <button className="sort-btn" onClick={() => handleSort("amount")}>
                  Amount
                  {sortBy === "amount" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: sortOrder === "asc" ? "rotate(180deg)" : "" }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </button>
              </span>

              <span className="col-status">
                <button className="sort-btn" onClick={() => handleSort("status")}>
                  Status
                  {sortBy === "status" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: sortOrder === "asc" ? "rotate(180deg)" : "" }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </button>
              </span>

              <span className="col-actions">Actions</span>
            </div>

            {sorted.length === 0 ? (
              <div className="empty-state">
                <p>No invoices found</p>
              </div>
            ) : (
              sorted.map((invoice) => (
                <div key={invoice.id} className="table-row">
                  <span className="col-invoice">
                    <span className="invoice-id">{invoice.id}</span>
                  </span>

                  <span className="col-customer">
                    <span className="customer-name">{invoice.customer}</span>
                  </span>

                  <span className="col-date">{invoice.date}</span>

                  <span className="col-due">
                    <span className="due-date">{invoice.dueDate}</span>
                  </span>

                  <span className="col-amount">
                    ${invoice.amount.toLocaleString()}
                  </span>

                  <span className="col-status">
                    <span className={`status-badge ${invoice.status}`}>
                      {invoice.status}
                    </span>
                  </span>

                  <span className="col-actions">
                    <button className="action-btn" title="Download">
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