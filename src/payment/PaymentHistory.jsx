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

// ── PDF generation ──────────────────────────────────────────────────────────
function loadJsPDF() {
  return new Promise((resolve, reject) => {
    if (window.jspdf) return resolve(window.jspdf.jsPDF)
    const script = document.createElement("script")
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    script.onload = () => resolve(window.jspdf.jsPDF)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function downloadInvoice(payment) {
  const JsPDF = await loadJsPDF()
  const doc = new JsPDF({ unit: "mm", format: "a4" })

  const PRIMARY = [37, 99, 235]   // blue-600
  const DARK    = [15, 23, 42]    // slate-900
  const MUTED   = [100, 116, 139] // slate-500
  const SUCCESS = [22, 163, 74]   // green-600
  const FAIL    = [220, 38, 38]   // red-600

  // ── Header bar ──────────────────────────────────────────────────────────
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, 210, 28, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.text("FACTURE", 14, 17)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(200, 220, 255)
  doc.text("Zembra — Plateforme de scraping & API", 14, 23)

  // ── Invoice meta (right) ─────────────────────────────────────────────────
  const invoiceNum = `INV-${String(payment.id).padStart(6, "0")}`
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text(invoiceNum, 196, 14, { align: "right" })
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(200, 220, 255)
  doc.text(`Émise le : ${formatDate(payment.created_at)}`, 196, 20, { align: "right" })

  // ── Section : Détails de la transaction ─────────────────────────────────
  let y = 42

  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(...DARK)
  doc.text("Détails de la transaction", 14, y)

  // Divider
  doc.setDrawColor(...PRIMARY)
  doc.setLineWidth(0.6)
  doc.line(14, y + 2, 196, y + 2)

  y += 12

  const rows = [
    ["N° de transaction", `#${payment.id}`],
    ["Description",       payment.description || "—"],
    ["Date",              formatDate(payment.created_at)],
    ["Montant",           formatAmount(payment.amount)],
    ["Statut",            payment.status === "succeeded" ? "Payé" : "Échoué"],
  ]

  rows.forEach(([label, value], i) => {
    const bg = i % 2 === 0 ? [248, 250, 252] : [255, 255, 255]
    doc.setFillColor(...bg)
    doc.rect(14, y - 5, 182, 9, "F")

    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(...MUTED)
    doc.text(label, 18, y)

    doc.setFont("helvetica", "normal")
    doc.setTextColor(...DARK)

    // Colorize status
    if (label === "Statut") {
      doc.setTextColor(...(payment.status === "succeeded" ? SUCCESS : FAIL))
      doc.setFont("helvetica", "bold")
    }
    if (label === "Montant") {
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...PRIMARY)
    }

    doc.text(value, 100, y)
    y += 10
  })

  y += 6

  // ── Total box ────────────────────────────────────────────────────────────
  doc.setFillColor(...PRIMARY)
  doc.roundedRect(130, y, 66, 18, 3, 3, "F")
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(200, 220, 255)
  doc.text("TOTAL TTC", 163, y + 6, { align: "center" })
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.setTextColor(255, 255, 255)
  doc.text(formatAmount(payment.amount), 163, y + 14, { align: "center" })

  // ── Footer ───────────────────────────────────────────────────────────────
  doc.setFillColor(248, 250, 252)
  doc.rect(0, 272, 210, 25, "F")
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text("Zembra — contact@zembra.io", 14, 282)
  doc.text("Ce document est généré automatiquement et ne constitue pas un reçu fiscal officiel.", 14, 288)
  doc.text(`Page 1 / 1`, 196, 288, { align: "right" })

  doc.save(`facture-${invoiceNum}.pdf`)
}

export default function PaymentHistory() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sessionId, setSessionId] = useState(null)
  const [downloading, setDownloading] = useState(null)

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

  const handleDownload = async (p) => {
    setDownloading(p.id)
    try {
      await downloadInvoice(p)
    } finally {
      setDownloading(null)
    }
  }

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
            <div className="ph-table ph-table--with-actions">
              <div className="ph-table-row ph-table-row--head">
                <span>Date</span>
                <span>Description</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Facture</span>
              </div>

              {filtered.map((p) => (
                <div key={p.id} className="ph-table-row">
                  <span className="ph-col-date">{formatDate(p.created_at)}</span>
                  <span className="ph-col-desc">{p.description || "—"}</span>
                  <span className="ph-col-amount">{formatAmount(p.amount)}</span>
                  <span className={`ph-status ${statusClass[p.status]}`}>
                    {statusLabel[p.status]}
                  </span>
                  <span className="ph-col-invoice">
                    <button
                      className="ph-invoice-btn"
                      onClick={() => handleDownload(p)}
                      disabled={downloading === p.id}
                      title="Télécharger la facture PDF"
                    >
                      {downloading === p.id ? (
                        <i className="fa-solid fa-spinner fa-spin" />
                      ) : (
                        <i className="fa-solid fa-file-arrow-down" />
                      )}
                    </button>
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
