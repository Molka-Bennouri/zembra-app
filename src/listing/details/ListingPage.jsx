import { useState } from 'react';
import './ListingPage.css';

import HeroSection from '../components/HeroSection';
import Tabs from '../components/Tabs';

import QueryBuild from './QueryBuild';
import QueryHistory from '../QueryHistory';

const ListingPage = () => {
  const [activeTab, setActiveTab] = useState('visual');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleQueryExecuted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="api-page-root">
      <main className="api-main-content">
        <HeroSection
          title="Listing Data Retrieval"
          description="Fetch comprehensive details for any listing across all supported networks. Use the visual builder below or copy the cURL command for your backend integration."
        />

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="api-tab-content">
          {activeTab === 'visual' && (
            <div className="api-visual-layout">
              <QueryBuild onQueryExecuted={handleQueryExecuted} />
            </div>
          )}
          {activeTab === 'history' && (
            <QueryHistory refreshTrigger={refreshTrigger} type="listing" />
          )}
        </div>
      </main>
    </div>
  );
};

export default ListingPage;