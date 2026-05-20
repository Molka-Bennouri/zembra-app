import ProfileHeader from "./ProfileHeader";
import AccountForms from "./AccountForms";
import "./ProfilePage.css";
import { useProfile } from "../hooks/useProfile";

export default function ProfilePage() {
  const { profile, loading, error } = useProfile();

  if (loading)
    return (
      <div className="pp-loader">
        <div className="pp-spinner" />
        <span className="pp-loader-text">Loading profile…</span>
      </div>
    );

  if (error)
    return (
      <div className="pp-error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Failed to load profile: {error}
      </div>
    );

  return (
    <div className="pp-page">
      <main className="pp-main">
        <ProfileHeader user={profile} AccountForms={AccountForms} />
      </main>
    </div>
  );
}