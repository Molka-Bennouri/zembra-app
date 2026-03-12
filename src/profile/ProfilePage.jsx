import { useState } from "react"
import ProfileHeader from "./ProfileHeader"
import AccountForms from "./AccountForms"
import "./ProfilePage.css"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("account")

  const user = {
    initials: "MB",
    fullName: "Moika Bennouri",
    location: "Tunisia",
    emailVerified: true,
  }

  const activities = [
    { action: "Logged in", time: "2 hours ago", location: "Tunisia" },
    { action: "Updated profile", time: "1 day ago", location: "Tunisia" },
    { action: "Changed password", time: "3 days ago", location: "Tunisia" },
    { action: "Created API key", time: "1 week ago", location: "Tunisia" },
  ]

  return (
    <div className="profile-page">
      <main className="profile-main">
        <ProfileHeader
          user={user}
          activities={activities}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          AccountForms={AccountForms}
        />
      </main>
    </div>
  )
}