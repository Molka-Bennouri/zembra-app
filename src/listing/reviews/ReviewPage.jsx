import { useState } from 'react';
import '../details/ListingPage.css'; /* Reuse the shared API page layout */

import HeroSection from '../components/HeroSection';
import Tabs from '../components/Tabs';
import CurlRequest from '../components/CurlRequest';
import ReviewQueryBuilder from './ReviewQueryBuilder';
import QueryHistory from '../QueryHistory';

const ReviewPage = () => {
  const [activeTab, setActiveTab] = useState('visual');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleQueryExecuted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="api-page-root">
      <main className="api-main-content">

        <HeroSection
          title="Review Aggregation"
          description="Extract, filter, and analyze customer reviews from multiple sources. Access ratings, publish dates, and AI-powered sentiment summaries."
        />

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="api-tab-content">
          {activeTab === 'visual' && (
            <div className="api-visual-layout">
              <ReviewQueryBuilder onQueryExecuted={handleQueryExecuted} />
            </div>
          )}

          {activeTab === 'curl' && <CurlRequest />}

          {activeTab === 'history' && (
            <QueryHistory refreshTrigger={refreshTrigger} type="reviews" />
          )}
        </div>

      </main>
    </div>
  );
};

export default ReviewPage;