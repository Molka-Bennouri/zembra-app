import { useState } from "react"
import ProfileHeader from "./ProfileHeader"
import AccountForms from "./AccountForms"
import "./ProfilePage.css"
import { useProfile } from "../hooks/useProfile"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("account")
  const { profile, loading, error } = useProfile()

  const activities = [
    { action: "Logged in", time: "2 hours ago", location: "Tunisia" },
    { action: "Updated profile", time: "1 day ago", location: "Tunisia" },
    { action: "Changed password", time: "3 days ago", location: "Tunisia" },
    { action: "Created API key", time: "1 week ago", location: "Tunisia" },
  ]

  if (loading) return <div className="profile-loading">Loading profile…</div>
  if (error) return <div className="profile-error">Failed to load profile: {error}</div>

  return (
    <div className="profile-page">
      <main className="profile-main">
        <ProfileHeader
          user={profile}
          activities={activities}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          AccountForms={AccountForms}
        />
      </main>
    </div>
  )
}