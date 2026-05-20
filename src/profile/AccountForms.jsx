import "./AccountForms.css";
import { useProfile } from "../hooks/useProfile";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { useEffect, useState } from "react";

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2l12 12M6.5 6.6A2 2 0 0 0 9.4 9.5" />
      <path d="M4.2 4.3C2.6 5.3 1 8 1 8s2.5 5 7 5a7 7 0 0 0 3.8-1.2M7 3.1A7 7 0 0 1 15 8s-.7 1.5-2 2.8" />
    </svg>
  );

const ErrIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="8" cy="8" r="6.5" />
    <line x1="8" y1="5" x2="8" y2="8.5" />
    <circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none" />
  </svg>
);

const OkIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6.5" />
    <polyline points="5 8 7.2 10.2 11 6" />
  </svg>
);

function PasswordInput({ name, value, placeholder, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="af-input-eye-wrap">
      <input
        className="af-input"
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      />
      <button
        type="button"
        className="af-eye-btn"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        <EyeIcon open={show} />
      </button>
    </div>
  );
}

const AccountForms = () => {
  const { profile, loading, error, updateProfile, updatePassword } = useProfile();
  const { deleteAccount, loading: deleting, error: deleteError } = useDeleteAccount();

  const [formData, setFormData] = useState({ full_name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [profileMsg, setProfileMsg]   = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [delPassword, setDelPassword] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({ full_name: profile.full_name || "", email: profile.email || "" });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((p) => ({ ...p, [name]: value }));
  };

  const handleSaveProfile = async () => {
    const result = await updateProfile(formData.full_name, formData.email);
    setProfileMsg(result);
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handleSavePassword = async () => {
    const result = await updatePassword(
      passwordData.current_password,
      passwordData.new_password,
      passwordData.confirm_password
    );
    setPasswordMsg(result);
    if (result.success) {
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    }
    setTimeout(() => setPasswordMsg(null), 3000);
  };

  const handleDeleteConfirm = async () => {
    if (!delPassword) return;
    await deleteAccount(delPassword);
  };

  if (loading) return null;
  if (error)   return null;

  return (
    <>
      <div className="af-grid">

        {/* ── Card 1: Personal Info ── */}
        <div className="af-card">
          <div className="af-card-header">
            <div className="af-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h2 className="af-card-title">Personal Information</h2>
              <p className="af-card-subtitle">Update your name and email address</p>
            </div>
          </div>

          <div className="af-card-body">
            <div className="af-field">
              <label className="af-label">Full name</label>
              <input
                className="af-input"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>

            <div className="af-field">
              <label className="af-label">Email address</label>
              <input
                className="af-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            {profileMsg && (
              <div className={`af-msg ${profileMsg.success ? "af-msg--ok" : "af-msg--err"}`}>
                {profileMsg.success ? <OkIcon /> : <ErrIcon />}
                {profileMsg.message}
              </div>
            )}
          </div>

          <div className="af-card-footer">
            <button className="af-btn af-btn--primary" onClick={handleSaveProfile}>
              Save changes
            </button>
          </div>
        </div>

        {/* ── Card 2: Security ── */}
        <div className="af-card">
          <div className="af-card-header">
            <div className="af-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h2 className="af-card-title">Security</h2>
              <p className="af-card-subtitle">Change your password</p>
            </div>
          </div>

          <div className="af-card-body">
            <div className="af-field">
              <label className="af-label">Current password</label>
              <PasswordInput
                name="current_password"
                value={passwordData.current_password}
                placeholder="Enter current password"
                onChange={handlePasswordChange}
              />
            </div>

            <div className="af-field">
              <label className="af-label">New password</label>
              <PasswordInput
                name="new_password"
                value={passwordData.new_password}
                placeholder="Enter new password"
                onChange={handlePasswordChange}
              />
            </div>

            <div className="af-field">
              <label className="af-label">Confirm new password</label>
              <PasswordInput
                name="confirm_password"
                value={passwordData.confirm_password}
                placeholder="Re-enter new password"
                onChange={handlePasswordChange}
              />
            </div>

            {passwordMsg && (
              <div className={`af-msg ${passwordMsg.success ? "af-msg--ok" : "af-msg--err"}`}>
                {passwordMsg.success ? <OkIcon /> : <ErrIcon />}
                {passwordMsg.message}
              </div>
            )}
          </div>

          <div className="af-card-footer af-card-footer--split">
            <button
              className="af-btn af-btn--danger-ghost"
              onClick={() => setShowModal(true)}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 4.5 14.5 11.5 14.5 13 6" />
                <line x1="1" y1="6" x2="15" y2="6" />
                <path d="M5.5 6V4a2.5 2.5 0 0 1 5 0v2" />
              </svg>
              Delete account
            </button>
            <button className="af-btn af-btn--primary" onClick={handleSavePassword}>
              Update password
            </button>
          </div>
        </div>

      </div>

      {/* ── Delete modal ── */}
      {showModal && (
        <div className="af-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="af-modal">
            <div className="af-modal-header">
              <div className="af-modal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="af-modal-title">Delete Account</h3>
                <p className="af-modal-desc">This action is <strong>permanent</strong> and cannot be undone.</p>
              </div>
            </div>

            <div className="af-modal-body">
              <div className="af-field">
                <label className="af-label">Confirm your password</label>
                <PasswordInput
                  name="del_password"
                  value={delPassword}
                  placeholder="Enter your password"
                  onChange={(e) => setDelPassword(e.target.value)}
                />
              </div>
              {deleteError && (
                <div className="af-msg af-msg--err">
                  <ErrIcon />{deleteError}
                </div>
              )}
            </div>

            <div className="af-modal-footer">
              <button
                className="af-btn af-btn--secondary"
                onClick={() => { setShowModal(false); setDelPassword(""); }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="af-btn af-btn--danger"
                onClick={handleDeleteConfirm}
                disabled={deleting || !delPassword}
              >
                {deleting ? "Deleting…" : "Yes, delete my account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountForms;