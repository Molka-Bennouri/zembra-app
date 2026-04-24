import ProfileHeader from "./ProfileHeader"
import AccountForms from "./AccountForms"
import "./ProfilePage.css"
import { useProfile } from "../hooks/useProfile"

export default function ProfilePage() {
  const { profile, loading, error } = useProfile()

  if (loading) return (
    <div className="loader-container full-page">
        <div className="spinner"></div>
    </div>
);
  if (error) return <div className="profile-error">Failed to load profile: {error}</div>

  return (
    <div className="profile-page">
      <main className="profile-main">
        <ProfileHeader
          user={profile}
          AccountForms={AccountForms}
        />
      </main>
    </div>
  )
}