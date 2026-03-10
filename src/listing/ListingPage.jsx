import React, { useState } from 'react';
import './ListingPage.css';
import QueryBuild from './QueryBuild';
import QueryResponse from './QueryResponse';
import CurlRequest from './CurlRequest';

const ListingPage = () => {
  const [activeTab, setActiveTab] = useState('visual');

  return (
    <div className="api-query-builder">
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-badge">
            <span className="badge-icon"><i className="fa-solid fa-bolt fa-xs"></i></span>
            <span className="badge-text">API Query Builder</span>
          </div>
          <h1 className="hero-title">Build Your Query</h1>
          <p className="hero-description">
            Create powerful API queries with our intuitive builder. Get insights from listing data in seconds.
          </p>
        </section>

        <section className="tabs-section">
          <div className="tabs-container">
            <button 
              className={`tab ${activeTab === 'visual' ? 'active' : ''}`}
              onClick={() => setActiveTab('visual')}
            >
              <span className="tab-icon"><i class="fa-solid fa-code"></i></span>
              Visual Builder
            </button>
            <button 
              className={`tab ${activeTab === 'curl' ? 'active' : ''}`}
              onClick={() => setActiveTab('curl')}
            >
              <span className="tab-icon"><i class="fa-solid fa-code"></i></span>
              cURL Code
            </button>
          </div>
        </section>

        <div className="tab-content">
  {activeTab === 'visual' && (
  <div className="visual-layout">
    <QueryBuild />
    <QueryResponse />
  </div>
)}
  {activeTab === 'curl' && <CurlRequest />}
</div>
      </main>
    </div>
  );
};

export default ListingPage;