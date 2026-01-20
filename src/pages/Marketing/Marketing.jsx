import React, { useState } from 'react';
import { FiDownload, FiPlus } from 'react-icons/fi';
import './Marketing.css';

// Import Components
import MarketingOverview from './components/MarketingOverview';
import Campaigns from './components/Campaigns';
import Coupons from './components/Coupons';
import Leads from './components/Leads';
import Analytics from './components/Analytics';
import Automations from './components/Automations';
import MarketingSettings from './components/MarketingSettings';
import Reports from './components/Reports';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleExport = () => {
    // Basic CSV export simulation
    const csvContent = "data:text/csv;charset=utf-8,Marketing Report\nGenerated on " + new Date().toLocaleDateString();
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "marketing_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="marketing-page">
      <header className="marketing-header">
        <div className="page-title">
          <h1>Marketing Hub</h1>
          <p>Promotion strategy, campaigns, and growth analytics.</p>
        </div>
        <div className="marketing-actions">
          <button className="btn-secondary" onClick={handleExport}><FiDownload /> Export Report</button>
          {/* Note: Create Campaign button removed from header as it's now context-specific in Campaigns tab, 
              or could be passed as prop if needed globally. Keeping header clean. */}
        </div>
      </header>

      {/* Tabs */}
      <div className="marketing-tabs">
        {['overview', 'campaigns', 'coupons', 'leads', 'analytics', 'automation', 'reports', 'settings'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ textTransform: 'capitalize' }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content" style={{ marginTop: 24 }}>
        {activeTab === 'overview' && <MarketingOverview />}
        {activeTab === 'campaigns' && <Campaigns />}
        {activeTab === 'coupons' && <Coupons />}
        {activeTab === 'leads' && <Leads />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'automation' && <Automations />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'settings' && <MarketingSettings />}
      </div>
    </div>
  );
};

export default Marketing;