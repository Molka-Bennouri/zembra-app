import { useState, useCallback, useEffect } from "react"
import { API_BASE, getAuthToken } from "../utils/paymentUtils"

export function usePayments(sessionId) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/payments`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })

      if (!res.ok) {
        throw new Error(`Erreur ${res.status} : ${res.statusText}`)
      }

      const json = await res.json()
      setPayments(Array.isArray(json) ? json : json.data ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments, sessionId])

  return {
    payments,
    setPayments,
    loading,
    error,
    fetchPayments,
  }
}