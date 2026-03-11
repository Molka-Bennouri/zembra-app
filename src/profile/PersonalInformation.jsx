import './AccountForms.css';

const PersonalInformation = () => {
  return (
    <div className="form-container">

      {/* ── Section 1: Personal Info ── */}
      <h2>Account &amp; Personal Info</h2>

      <div className="form-row-2">
        <div className="form-group">
          <label>First Name</label>
          <input type="text" defaultValue="Molka" />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" defaultValue="Bennouri" />
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label>Email</label>
          <input type="email" defaultValue="molka@zembratech.com" />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="tel" placeholder="phone" />
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

    </div>
  );
};

export default PersonalInformation;