// utils/paymentUtils.js

export const API_BASE = "http://localhost:8000"

export const getAuthToken = () => localStorage.getItem("jwt_token")

export const statusLabel = {
  succeeded: "Paid",
  failed: "Failed",

}

export const statusClass = {
  succeeded: "paid",
  failed: "failed",

}

export function formatAmount(amount, currency = "TND") {
  return new Intl.NumberFormat("en-TN", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-EN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}