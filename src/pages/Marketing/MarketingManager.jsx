import React, { useState } from 'react';
import { FiDownload, FiCalendar, FiFilter } from 'react-icons/fi';
import './Marketing.css';

// Component placeholders (will repurpose existing ones later)
import MarketingOverview from './components/MarketingOverview'; // Dashboard
import Campaigns from './components/Campaigns'; // Approvals/All
import Analytics from './components/Analytics';
import MarketingSettings from './components/MarketingSettings';
import Leads from './components/Leads'; // Monitor Mode
import Reports from './components/Reports';
import Automations from './components/Automations'; // Rule Builder
import ContentLibrary from './components/ContentLibrary'; // Asset Management

const MarketingManager = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const handleExport = () => {
        console.log("Exporting Manager Report...");
    };

    return (
        <div className="marketing-page manager-view">
            {/* 
        ADMIN / MANAGER HEADER 
        Review: No "Create Campaign" button here.
      */}
            <header className="marketing-header">
                <div className="page-title">
                    <span className="badge-role">Marketing Manager</span>
                    <h1>Command Center</h1>
                    <p>Strategy, Approvals, and Global Analytics</p>
                </div>
                <div className="marketing-actions">
                    <button className="btn-secondary"><FiCalendar /> Date Filter</button>
                    <button className="btn-secondary" onClick={handleExport}><FiDownload /> Export Report</button>
                </div>
            </header>

            {/* TABS */}
            <div className="marketing-tabs">
                {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'campaign-control', label: 'Campaign Control' },
                    { id: 'leads-monitor', label: 'Leads Monitor' },
                    { id: 'automations', label: 'Automations' },
                    { id: 'reports', label: 'Reports' },
                    { id: 'settings', label: 'Settings' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="dashboard-view">
                        <MarketingOverview role="MANAGER" />
                    </div>
                )}
                {activeTab === 'campaign-control' && (
                    <Campaigns role="MANAGER" />
                )}
                {activeTab === 'leads-monitor' && (
                    <Leads role="MANAGER" />
                )}
                {/* Automations */}
                {activeTab === 'automations' && <Automations role="MANAGER" />}

                {/* Reports */}
                {activeTab === 'reports' && <Reports role="MANAGER" />}

                {/* Settings */}
                {activeTab === 'settings' && <MarketingSettings role="MANAGER" />}
            </div>
        </div>
    );
};

export default MarketingManager;
