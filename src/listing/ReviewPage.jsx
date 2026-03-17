import { useState } from 'react';
import './ReviewPage.css';

import HeroSection from './HeroSection';
import ReviewQueryBuilder from './ReviewQueryBuilder';
import QueryResponse from './QueryResponse';
import CurlRequest from './CurlRequest';

const ReviewPage = () => {
  const [activeTab, setActiveTab] = useState('visual');

  return (
    <div className="api-query-builder">
      <main className="main-content">

        <HeroSection
          badge="API Query Builder"
          title="Build Your Query"
          description="Create powerful API queries with our intuitive builder. Get insights from listing data in seconds."
          icon="fa-solid fa-bolt fa-xs"
        />

        {/* Tabs */}
        <section className="tabs-section">
          <div className="tabs-container">
            <button
              className={`tab ${activeTab === 'visual' ? 'active' : ''}`}
              onClick={() => setActiveTab('visual')}
            >
              <span className="tab-icon">
                <i className="fa-solid fa-code"></i>
              </span>
              Visual Builder
            </button>

            <button
              className={`tab ${activeTab === 'curl' ? 'active' : ''}`}
              onClick={() => setActiveTab('curl')}
            >
              <span className="tab-icon">
                <i className="fa-solid fa-code"></i>
              </span>
              cURL Code
            </button>
          </div>
        </section>

        {/* Content */}
        <div className="tab-content">
          {activeTab === 'visual' && (
            <div className="visual-layout">
              <ReviewQueryBuilder/>
              <QueryResponse />
            </div>
          )}

          {activeTab === 'curl' && <CurlRequest />}
        </div>

      </main>
    </div>
  );
};

export default ReviewPage;