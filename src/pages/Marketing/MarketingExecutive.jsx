import React, { useState } from 'react';
import { FiPlus, FiDownload } from 'react-icons/fi';
import './Marketing.css';

// Components
import Analytics from './components/Analytics';
import Campaigns from './components/Campaigns';
import Leads from './components/Leads';
import MarketingOverview from './components/MarketingOverview'; // Correct Dashboard Component
import ContentLibrary from './components/ContentLibrary';
import Reports from './components/Reports';

const MarketingExecutive = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showCreateWizard, setShowCreateWizard] = useState(false);

    return (
        <div className="marketing-page executive-view">
            {/* 
        EXECUTIVE HEADER 
      */}
            <header className="marketing-header">
                <div className="page-title">
                    <span className="badge-role">Marketing Executive</span>
                    <h1>My Workspace</h1>
                    <p>Create, Execute, and Optimize Campaigns</p>
                </div>
                <div className="marketing-actions">
                    <button className="btn-primary" onClick={() => setActiveTab('create')}><FiPlus /> Create New Campaign</button>
                </div>
            </header>

            {/* TABS */}
            <div className="marketing-tabs">
                {[
                    { id: 'dashboard', label: 'Dashboard' },
                    { id: 'campaigns', label: 'Campaigns' },
                    { id: 'content-library', label: 'Content Library' },
                    { id: 'leads', label: 'Leads' },
                    { id: 'reports', label: 'Reports' },
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
                {activeTab === 'dashboard' && (
                    <div className="dashboard-view">
                        <MarketingOverview role="EXECUTIVE" />
                    </div>
                )}

                {/* Campaigns - Renamed from 'my-campaigns' internally for tab ID, but props remain same */}
                {activeTab === 'campaigns' && (
                    <Campaigns role="EXECUTIVE" />
                )}

                {/* Note: 'create' tab removed from nav list, but triggered by header button. 
                    We need to handle 'create' state if button sets activeTab('create'). 
                    Or maybe keep it as a modal overlay? 
                    The button sets activeTab('create'), so we must handle it. */}
                {activeTab === 'create' && (
                    <Campaigns role="EXECUTIVE" startWizard={true} />
                )}

                {activeTab === 'content-library' && (
                    <ContentLibrary role="EXECUTIVE" />
                )}

                {activeTab === 'leads' && (
                    <Leads role="EXECUTIVE" />
                )}

                {activeTab === 'reports' && (
                    <Reports role="EXECUTIVE" />
                )}
            </div>
        </div>
    );
};

export default MarketingExecutive;
