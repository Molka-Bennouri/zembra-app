import './AccountForms.css';
import { useProfile } from "../hooks/useProfile";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { useEffect, useState } from "react";

const AccountForms = () => {
  const { profile, loading, error, updateProfile, updatePassword } = useProfile();
  const { deleteAccount, loading: deleting, error: deleteError } = useDeleteAccount();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Delete account modal state
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
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
    if (!password) return;
    await deleteAccount(password);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;

  return (
    <div className="form-container">
      <div className="two-col-layout">

        {/* ── Column 1: Personal Info ── */}
        <div className="settings-card">
          <h2>Personal Information</h2>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {profileMsg && (
            <p className={profileMsg.success ? "success-text" : "error-text"}>
              {profileMsg.message}
            </p>
          )}

          <div className="btn-row">
            <button className="btn-primary" onClick={handleSaveProfile}>Save</button>
          </div>
        </div>

        {/* ── Column 2: Security ── */}
        <div className="settings-card">
          <h2>Security</h2>

          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="current_password"
              value={passwordData.current_password}
              onChange={handlePasswordChange}
              placeholder="current password"
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="new_password"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              placeholder="new password"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              value={passwordData.confirm_password}
              onChange={handlePasswordChange}
              placeholder="re-enter password"
            />
          </div>

          {passwordMsg && (
            <p className={passwordMsg.success ? "success-text" : "error-text"}>
              {passwordMsg.message}
            </p>
          )}

          <div className="btn-row">
            <button className="btn-primary" onClick={handleSavePassword}>Save</button>
          </div>

          <div className="danger-zone">
            <button className="btn-danger" onClick={() => setShowModal(true)}>
              Delete your account
            </button>
          </div>
        </div>

      </div>

      {/* ── Delete Account Modal (unchanged) ── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Account</h3>
            <p>This action is <strong>irreversible</strong>. Enter your password to confirm.</p>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            {deleteError && <p className="error-text">{deleteError}</p>}
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => { setShowModal(false); setPassword(""); }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleting || !password}
              >
                {deleting ? "Deleting..." : "Yes, delete my account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountForms;