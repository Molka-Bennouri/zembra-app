import { useState } from "react"
import { api } from "../utils/api"

export const useDeleteAccount = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteAccount = async (password) => {
    setLoading(true)
    setError(null)
    try {
      await api.delete("/clients/delete-account", { password })
      // Clear token and redirect
      localStorage.removeItem("jwt_token")
      window.location.href = "/login"
    } catch (err) {
      setError(err.message || "Failed to delete account.")
    } finally {
      setLoading(false)
    }
  }

  return { deleteAccount, loading, error }
}