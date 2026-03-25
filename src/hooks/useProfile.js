import { useState, useEffect } from "react"
import { api } from "../utils/api"

export const useProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
        console.log("Token:", localStorage.getItem("jwt_token"))
  console.log("Fetching:", `http://127.0.0.1:8000/api/clients/me`)
      try {
        const data = await api.get("/clients/me")

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

  return { profile, loading, error }
}