'use client';

import React, { useState } from 'react';
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

        {/* Response Fields Section */}
        <div className="section-block">
          <div className="card-header">
            <h3 className="parameter-label">Response Fields</h3>
          </div>
        <div className="fields-grid">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="rating"
              checked={fields.rating}
              onChange={() => handleFieldChange('rating')}
              className="checkbox-input"
            />
            <label htmlFor="rating" className="checkbox-label">Rating</label>
          </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="reviews"
                checked={fields.reviews}
                onChange={() => handleFieldChange('reviews')}
                className="checkbox-input"
              />
              <label htmlFor="reviews" className="checkbox-label">Reviews</label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="address"
                checked={fields.address}
                onChange={() => handleFieldChange('address')}
                className="checkbox-input"
              />
              <label htmlFor="address" className="checkbox-label">Address</label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="phone"
                checked={fields.phone}
                onChange={() => handleFieldChange('phone')}
                className="checkbox-input"
              />
              <label htmlFor="phone" className="checkbox-label">Phone</label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="website"
                checked={fields.website}
                onChange={() => handleFieldChange('website')}
                className="checkbox-input"
              />
              <label htmlFor="website" className="checkbox-label">Website</label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="images"
                checked={fields.images}
                onChange={() => handleFieldChange('images')}
                className="checkbox-input"
              />
              <label htmlFor="images" className="checkbox-label">Images</label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="categories"
                checked={fields.categories}
                onChange={() => handleFieldChange('categories')}
                className="checkbox-input"
              />
              <label htmlFor="categories" className="checkbox-label">Categories</label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="hours"
                checked={fields.hours}
                onChange={() => handleFieldChange('hours')}
                className="checkbox-input"
              />
              <label htmlFor="hours" className="checkbox-label">Hours</label>
            </div>
          </div>
        </div>
        <div className="section-block" style={{borderBottom: 'none', paddingBottom: 0}}>
          <button className="execute-btn">
            <i className="fa-solid fa-bolt fa-xs"></i>
            Execute Query
          </button>
        </div>
      </div>
    </div>
  );
}

export default QueryBuild;
