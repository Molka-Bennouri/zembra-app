import { useState, useEffect } from "react"
import "./PaymentHistory.css"

import HeroSection from "../listing/components/HeroSection"
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

  if (loading) {
    return (
      <div className="ph-loader">
        <div className="ph-spinner" />
        <span className="ph-loader-text">Loading payments…</span>
      </div>
    )
  }

  return (
    <div className="ph-page">
      <main className="ph-main">

        {sessionId && (
          <div className="ph-success-banner">
            <div className="ph-success-banner-icon">
              <i className="fa-solid fa-circle-check" />
            </div>
            <div className="ph-success-banner-body">
              <p>Payment successful</p>
              <code>{sessionId}</code>
            </div>
            <button
              className="ph-success-dismiss"
              onClick={() => setSessionId(null)}
              aria-label="Dismiss"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        )}

        <HeroSection
          title="Payment History"
          description="View and manage your Stripe transactions. Filter by status or search by description and transaction ID."
        />

        <div className="ph-kpi-grid">
          <div className="ph-kpi">
            <div className="ph-kpi-icon ph-kpi-icon--blue">
              <i className="fa-solid fa-wallet" />
            </div>
            <div className="ph-kpi-body">
              <div className="ph-kpi-label">Total Earned</div>
              <div className="ph-kpi-value">{formatAmount(total("succeeded"))}</div>
              <div className="ph-kpi-sub">Successful payments</div>
            </div>
          </div>

          <div className="ph-kpi">
            <div className="ph-kpi-icon ph-kpi-icon--red">
              <i className="fa-solid fa-circle-xmark" />
            </div>
            <div className="ph-kpi-body">
              <div className="ph-kpi-label">Failed Payments</div>
              <div className="ph-kpi-value">{formatAmount(total("failed"))}</div>
              <div className="ph-kpi-sub">Unsuccessful attempts</div>
            </div>
          </div>

          <div className="ph-kpi">
            <div className="ph-kpi-icon ph-kpi-icon--blue">
              <i className="fa-solid fa-receipt" />
            </div>
            <div className="ph-kpi-body">
              <div className="ph-kpi-label">Transactions</div>
              <div className="ph-kpi-value">{payments.length}</div>
              <div className="ph-kpi-sub">All time</div>
            </div>
          </div>
        </div>

        <div className="ph-toolbar">
          <div className="ph-filter-tabs">
            {["all", "succeeded", "failed"].map((s) => (
              <button
                key={s}
                className={`ph-filter-tab ${filterStatus === s ? "active" : ""}`}
                onClick={() => setFilterStatus(s)}
              >
                {{
                  all: "All",
                  succeeded: "Paid",
                  failed: "Failed",
                }[s]}
              </button>
            ))}
          </div>

          <div className="ph-search">
            <i className="fa-solid fa-magnifying-glass ph-search-icon" />
            <input
              className="ph-search-input"
              placeholder="Search transactions…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="ph-table-card">
          <div className="ph-table-header">
            <div>
              <h3 className="ph-table-title">Transactions</h3>
              <p className="ph-table-sub">
                {filtered.length} {filtered.length === 1 ? "result" : "results"}
                {filterStatus !== "all" && ` · ${filterStatus === "succeeded" ? "Paid" : "Failed"}`}
              </p>
            </div>
          </div>

          {error && (
            <div className="ph-error">
              <i className="fa-solid fa-triangle-exclamation" />
              <span>{error}</span>
            </div>
          )}

          {!error && filtered.length === 0 && (
            <div className="ph-empty">
              <i className="fa-regular fa-credit-card" />
              <p className="ph-empty-title">No transactions found</p>
              <p className="ph-empty-sub">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your filters or search query."
                  : "Your payment history will appear here once you make a purchase."}
              </p>
            </div>
          )}

          {!error && filtered.length > 0 && (
            <div className="ph-table">
              <div className="ph-table-row ph-table-row--head">
                <span>Date</span>
                <span>Description</span>
                <span>Amount</span>
                <span>Status</span>
              </div>

              {filtered.map((p) => (
                <div key={p.id} className="ph-table-row">
                  <span className="ph-col-date">{formatDate(p.created_at)}</span>
                  <span className="ph-col-desc">{p.description || "—"}</span>
                  <span className="ph-col-amount">{formatAmount(p.amount)}</span>
                  <span className={`ph-status ${statusClass[p.status]}`}>
                    {statusLabel[p.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
