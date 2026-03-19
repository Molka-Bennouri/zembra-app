import { useState } from 'react';
import './QueryBuild.css';

function QueryBuild() {
  const [network, setNetwork] = useState('');
  const [slug, setSlug] = useState('');
  const [fields, setFields] = useState({
    rating: false,
    reviews: false,
    address: false,
    phone: false,
    website: false,
    images: false,
    categories: false,
    hours: false,
  });

  const handleFieldChange = (field) => {
    setFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="query-build-container">
      <div className="query-card">
        <div className="query-two-col">
          {/* LEFT COLUMN */}
          <div className="query-left">
            {/* Network Section */}
            <div className="section-block">
              <div className="card-header">
                <label className="parameter-label">Network</label>
              </div>
              <select
                className="dropdown-select"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
              >
                <option value=""></option>
                <option>Community Health Network</option>
                <option>Kununu</option>
                <option>Viator</option>
              </select>
              <p className="helper-text">Please select a network</p>
            </div>

            <div className="section-block">
              <div className="card-header">
                <label className="parameter-label">Slug / Page ID</label>
                <span className="required-badge">Required</span>
              </div>
              <input
                type="text"
                className="parameter-input"
                placeholder="slug-per-network"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <p className="helper-text">Unique identifier for your listing</p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="query-right">
            <div className="section-block" style={{ borderBottom: 'none' }}>
              <div className="card-header">
                <h3 className="parameter-label">Response Fields</h3>
              </div>
              <div className="fields-grid">
                {['addressComponents', 'formattedAddress', 'pageId', 'reviewPageSlug', 'reviewPageUrl', 'aliases', 'categories', 'businessName', 'phone', 'photos', 'priceRange', 'profileImage', 'businessWebsite', 'totalReviewCount', 'overallRating'].map(field => (
                  <div className="checkbox-group" key={field}>
                    <input
                      type="checkbox"
                      id={field}
                      checked={fields[field]}
                      onChange={() => handleFieldChange(field)}
                      className="checkbox-input"
                    />
                    <label htmlFor={field} className="checkbox-label">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  </div>
                ))}
              </div>

              <div className="section-block" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <button className="execute-btn">
                <i className="fa-solid fa-bolt fa-xs"></i>
                Execute Query
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueryBuild;
