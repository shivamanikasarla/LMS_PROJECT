import React from 'react';
import {
    FiUsers, FiClock, FiTarget, FiActivity, FiDollarSign, FiTag,
    FiTrendingUp, FiGlobe, FiAward, FiLayers, FiPercent
} from 'react-icons/fi';
import {
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
    FunnelChart, Funnel, LabelList
} from 'recharts';
import HealthIndicators from './HealthIndicators';

const MarketingOverview = ({ role = 'MANAGER' }) => {

    // --- Data Mocking based on Role ---
    const isManager = role === 'MANAGER' || role === 'ADMIN';

    // MANAGER: Global Stats
    const managerStats = {
        totalCampaigns: 12,
        active: 8,
        paused: 4,
        totalLeads: 12450,
        conversionRate: 6.8,
        revenue: 145000,
        topChannel: 'Email Lists'
    };

    // EXECUTIVE: Personal Stats
    const executiveStats = {
        myActiveCampaigns: 3,
        myLeads: 342,
        cpl: 45.50, // Cost Per Lead
        conversionRate: 8.2,
        revenueImpact: 12500,
        topChannel: 'Social Ads'
    };

    // Shared Chart Data
    const marketingFunnelData = [
        { value: 12000, name: 'Site Visits', fill: '#3b82f6' },
        { value: 4500, name: 'Signups', fill: '#8b5cf6' },
        { value: 850, name: 'Purchased', fill: '#10b981' },
    ];

    const leadsVsConversionsData = [
        { date: 'Mon', leads: 140, conversions: 12 },
        { date: 'Tue', leads: 200, conversions: 24 },
        { date: 'Wed', leads: 180, conversions: 20 },
        { date: 'Thu', leads: 250, conversions: 35 },
        { date: 'Fri', leads: 300, conversions: 48 },
        { date: 'Sat', leads: 400, conversions: 60 },
        { date: 'Sun', leads: 380, conversions: 55 },
    ];

    return (
        <div className="overview-section fade-in">
            {/* WIDGETS GRID */}
            <div className="row g-4 mb-4">

                {/* --- MANAGER WIDGETS --- */}
                {isManager && (
                    <>
                        {/* 1. Total Campaigns */}
                        <div className="col-md-4">
                            <div className="stat-card h-100">
                                <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}><FiLayers /></div>
                                <div className="d-flex flex-column">
                                    <span className="stat-label">Total Campaigns</span>
                                    <span className="stat-value">{managerStats.totalCampaigns}</span>
                                    <div className="small text-muted mt-1">
                                        <span className="text-success fw-bold">{managerStats.active} Active</span> • <span className="text-warning fw-bold">{managerStats.paused} Paused</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Global Leads */}
                        <div className="col-md-4">
                            <div className="stat-card h-100">
                                <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#16a34a' }}><FiUsers /></div>
                                <div className="d-flex flex-column">
                                    <span className="stat-label">Global Leads</span>
                                    <span className="stat-value">{managerStats.totalLeads.toLocaleString()}</span>
                                    <span className="stat-trend trend-up"><FiTrendingUp /> +12% this week</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Global Revenue */}
                        <div className="col-md-4">
                            <div className="stat-card h-100">
                                <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}><FiDollarSign /></div>
                                <div className="d-flex flex-column">
                                    <span className="stat-label">Total Revenue</span>
                                    <span className="stat-value text-success">${managerStats.revenue.toLocaleString()}</span>
                                    <span className="stat-trend trend-up"><FiTrendingUp /> +8% vs last month</span>
                                </div>
                            </div>
                        </div>

                        {/* 4. Conversion Rate */}
                        <div className="col-md-4">
                            <div className="stat-card h-100">
                                <div className="stat-icon-wrapper" style={{ background: '#fff7ed', color: '#ea580c' }}><FiPercent /></div>
                                <div className="d-flex flex-column">
                                    <span className="stat-label">Avg. Conversion Rate</span>
                                    <span className="stat-value">{managerStats.conversionRate}%</span>
                                </div>
                            </div>
                        </div>

                        {/* 5. Top Channel */}
                        <div className="col-md-4">
                            <div className="stat-card h-100">
                                <div className="stat-icon-wrapper" style={{ background: '#f5f3ff', color: '#7c3aed' }}><FiGlobe /></div>
                                <div className="d-flex flex-column">
                                    <span className="stat-label">Top Channel</span>
                                    <span className="stat-value">{managerStats.topChannel}</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* --- EXECUTIVE WIDGETS --- */}
                {!isManager && (
                    <>
                        {/* 1. My Active Campaigns */}
                        <div className="col-md-4">
                            <div className="stat-card h-100">
                                <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}><FiLayers /></div>
                                <div className="d-flex flex-column">
                                    <span className="stat-label">My Active Campaigns</span>
                                    <span className="stat-value">{executiveStats.myActiveCampaigns}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. My Leads */}
                        <div className="col-md-4">
                            <div className="stat-card h-100">
                                <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#16a34a' }}><FiUsers /></div>
                                <div className="d-flex flex-column">
                                    <span className="stat-label">Leads Generated</span>
                                    <span className="stat-value">{executiveStats.myLeads}</span>
                                    <span className="stat-trend trend-up"><FiTrendingUp /> Personal Best</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Revenue Impact */}
                        <div className="col-md-4">
                            <div className="stat-card h-100">
                                <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}><FiDollarSign /></div>
                                <div className="d-flex flex-column">
                                    <span className="stat-label">Revenue Impact</span>
                                    <span className="stat-value text-success">${executiveStats.revenueImpact.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* 4. Cost Per Lead */}
                        <div className="col-md-4">
                            <div className="stat-card h-100">
                                <div className="stat-icon-wrapper" style={{ background: '#fef2f2', color: '#dc2626' }}><FiTag /></div>
                                <div className="d-flex flex-column">
                                    <span className="stat-label">Cost Per Lead (CPL)</span>
                                    <span className="stat-value">${executiveStats.cpl}</span>
                                    <div className="small text-muted">Target: &lt;$50.00</div>
                                </div>
                            </div>
                        </div>

                        {/* 5. My Conversion Rate */}
                        <div className="col-md-4">
                            <div className="stat-card h-100">
                                <div className="stat-icon-wrapper" style={{ background: '#fff7ed', color: '#ea580c' }}><FiPercent /></div>
                                <div className="d-flex flex-column">
                                    <span className="stat-label">My Conversion Rate</span>
                                    <span className="stat-value">{executiveStats.conversionRate}%</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Health Indicators (Shared) */}
            <HealthIndicators />

            {/* Charts Section (Shared for now, can be specialized if needed) */}
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="bg-white p-4 rounded border shadow-sm h-100">
                        <h5 className="mb-4">Performance Trend ({isManager ? 'Global' : 'Personal'})</h5>
                        <div style={{ width: '100%', height: 350, minHeight: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={leadsVsConversionsData}>
                                    <defs>
                                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="leads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLeads)" name="Leads" />
                                    <Area type="monotone" dataKey="conversions" stroke="#10b981" fillOpacity={1} fill="url(#colorConv)" name="Conversions" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="bg-white p-4 rounded border shadow-sm h-100">
                        <h5 className="mb-4">Funnel Efficiency</h5>
                        <div style={{ width: '100%', height: 350, minHeight: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <FunnelChart>
                                    <Tooltip />
                                    <Funnel
                                        dataKey="value"
                                        data={marketingFunnelData}
                                        isAnimationActive
                                    >
                                        <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                                    </Funnel>
                                </FunnelChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingOverview;
