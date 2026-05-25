import { useState, useEffect } from "react"
import "./PaymentHistory.css"

import { usePayments } from "../hooks/usePayments"
import {
  formatAmount,
  formatDate,
  statusClass,
  statusLabel,
} from "../utils/paymentUtils"

export default function PaymentHistory() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sessionId, setSessionId] = useState(null)

  const { payments, loading, error } = usePayments(sessionId)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sid = params.get("session_id")

    if (sid) {
      setSessionId(sid)
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])

  const filtered = payments.filter((p) => {
    const matchStatus =
      filterStatus === "all" || p.status === filterStatus

    const q = searchQuery.toLowerCase()

    const matchSearch =
      !q ||
      p.description?.toLowerCase().includes(q) ||
      String(p.id).includes(q)

    return matchStatus && matchSearch
  })

  const total = (status) =>
    payments
      .filter((p) => p.status === status)
      .reduce((acc, p) => acc + Number(p.amount), 0)

  return (
    <div className="payment-history-container">

      {/* ── SUCCESS BANNER ── */}
      {sessionId && (
        <div className="success-banner">
          <div className="success-banner-body">
            <p>Payment successful</p>
            <code>{sessionId}</code>
          </div>
          <button onClick={() => setSessionId(null)}>✕</button>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="payment-history-header">
        <div>
          <h1 className="payment-history-title">
            Payment History
          </h1>
          <p className="payment-history-subtitle">
            View and manage your Stripe transactions
          </p>
        </div>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="summary-cards">

        <div className="summary-card">
          <div className="summary-icon paid">✔</div>
          <div>
            <div className="summary-label">Total Earned</div>
            <div className="summary-value">
              {formatAmount(total("succeeded"))}
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon failed">✖</div>
          <div>
            <div className="summary-label">Failed Payments</div>
            <div className="summary-value">
              {formatAmount(total("failed"))}
            </div>
          </div>
        </div>

      </div>

      {/* ── FILTER BAR ── */}
      <div className="filter-bar">

        <div className="filter-tabs">
          {["all", "succeeded", "failed"].map(
            (s) => (
              <button
                key={s}
                className={`filter-tab ${
                  filterStatus === s ? "active" : ""
                }`}
                onClick={() => setFilterStatus(s)}
              >
                {{
                  all: "All",
                  succeeded: "Paid",
                  failed: "Failed",
                }[s]}
              </button>
            )
          )}
        </div>

        <div className="search-box">
          <input
            className="search-input"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      </div>

      {/* ── TABLE ── */}
      <div className="payments-section">
        <div className="payments-card">

          {loading && <p>Loading payments...</p>}
          {error && <p>{error}</p>}

          <div className="payment-table">

            {/* HEADER (Action removed) */}
            <div className="table-header">
              <span>Date</span>
              <span>Description</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {filtered.map((p) => (
              <div key={p.id} className="table-row">

                <span className="col-date">
                  {formatDate(p.created_at)}
                </span>

                <span className="col-description">
                  {p.description}
                </span>

                <span className="col-amount">
                  {formatAmount(p.amount)}
                </span>

                <span className={`status-badge ${statusClass[p.status]}`}>
                  {statusLabel[p.status]}
                </span>

              </div>
            ))}

          </div>

        </div>
      </div>

    </div>
  )
}