import { useState, useEffect } from "react"
import { api } from "../utils/api"

export const useProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("Token:", localStorage.getItem("jwt_token"))
      console.log("Fetching:", `http://127.0.0.1:8000/api/me`)
      try {
        const data = await api.get("/me")

        const nameParts = data.full_name?.trim().split(" ")
        const initials =
          nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
            : data.full_name?.slice(0, 2).toUpperCase() ?? "??"

        setProfile({
          initials,
          full_name: data.full_name,
          email: data.email,
          emailVerified: true,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const updateProfile = async (fullName, email) => {
    try {
      const data = await api.put("/client/profile", {
        full_name: fullName,
        email: email,
      })

      // Recompute initials after update
      const nameParts = data.user.full_name?.trim().split(" ")
      const initials =
        nameParts.length >= 2
          ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
          : data.client.full_name?.slice(0, 2).toUpperCase() ?? "??"

      setProfile((prev) => ({
  ...prev,
  full_name: data.user.full_name,   // ← data.client
  email: data.user.email,           // ← data.client
  initials,
}))

      return { success: true, message: data.message }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      const data = await api.put("/client/password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      })

      return { success: true, message: data.message }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  return { profile, loading, error, updateProfile, updatePassword }
}