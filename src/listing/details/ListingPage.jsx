import { useState } from 'react';
import './ListingPage.css';

import HeroSection from '../common/HeroSection';
import Tabs from '../common/Tabs';
import QueryResponse from '../common/QueryResponse';
import CurlRequest from '../common/CurlRequest';

import QueryBuild from './QueryBuild';

const ListingPage = () => {
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