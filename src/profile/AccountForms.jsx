import './AccountForms.css';
import { useProfile } from "../hooks/useProfile";
import { useEffect, useState } from "react";

const AccountForms = () => {
  const { profile, loading, error } = useProfile();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: ""
  });

  // Fill form when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || ""
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;

  return (
    <div className="form-container">

      {/* ── Section 1: Personal Info ── */}
      <h2>Account &amp; Personal Info</h2>

      <div className="form-row-2">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="btn-row">
        <button className="btn-primary">Save</button>
      </div>

      <hr className="section-divider" />

      {/* ── Section 2: Change Password ── */}
      <h2>Change Password</h2>

      <div className="form-row-3">
        <div className="form-group">
          <label>Current Password</label>
          <input type="password" placeholder="current password" />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input type="password" placeholder="new password" />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" placeholder="re-enter password" />
        </div>
      </div>

      <div className="btn-row">
        <button className="btn-primary">Save</button>
      </div>

      <div className="btn-row">
        <button className="btn-danger">Delete your account</button>
      </div>

    </div>
  );
};

export default AccountForms;