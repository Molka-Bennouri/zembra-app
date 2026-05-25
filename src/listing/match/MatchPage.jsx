import { useState } from 'react';
import './MatchPage.css';

import HeroSection from '../components/HeroSection';
import Tabs from '../components/Tabs';
import CurlRequest from '../components/CurlRequest';
import MatchQueryBuild from './MatchQueryBuild';
import QueryHistory from '../QueryHistory';

const MatchPage = () => {
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

        {/* Content */}
        <div className="tab-content">
         {activeTab === 'visual' && (
            <div className="visual-layout">
              <MatchQueryBuild onQueryExecuted={handleQueryExecuted} />
            </div>
          )}
          {activeTab === 'curl' && <CurlRequest />}
          {activeTab === 'history' && (
            <QueryHistory refreshTrigger={refreshTrigger} type="match" />
          )}
        </div>

      </main>
    </div>
  );
};

export default MatchPage;