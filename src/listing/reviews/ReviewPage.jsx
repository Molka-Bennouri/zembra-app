import { useState } from 'react';
import './ReviewPage.css';

import HeroSection from '../components/HeroSection';
import Tabs from '../components/Tabs';
import QueryResponse from '../components/QueryResponse';
import CurlRequest from '../components/CurlRequest';

import ReviewQueryBuilder from './ReviewQueryBuilder';

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

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

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