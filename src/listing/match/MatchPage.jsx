import { useState } from 'react';
import '../details/ListingPage.css'; /* Reuse the shared API page layout */

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
    <div className="api-page-root">
      <main className="api-main-content">

        <HeroSection
          title="Listing Identification"
          description="Identify and match business profiles across different networks using name, address, and coordinates."
        />

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="api-tab-content">
         {activeTab === 'visual' && (
            <div className="api-visual-layout">
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