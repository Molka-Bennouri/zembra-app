import { useState } from 'react';
import './ListingPage.css';

import HeroSection from '../components/HeroSection';
import Tabs from '../components/Tabs';
import CurlRequest from '../components/CurlRequest';

import QueryBuild from './QueryBuild';
import ScrapingHistory from '../ScrapingHistory';

const ListingPage = () => {
  const [activeTab, setActiveTab] = useState('visual');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleQueryExecuted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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

        <div className="tab-content">
          {activeTab === 'visual' && (
            <div className="visual-layout">
              <QueryBuild onQueryExecuted={handleQueryExecuted} />
            </div>
          )}
          {activeTab === 'history' && (
            <ScrapingHistory refreshTrigger={refreshTrigger} />
          )}
        </div>
      </main>
    </div>
  );
};

export default ListingPage;