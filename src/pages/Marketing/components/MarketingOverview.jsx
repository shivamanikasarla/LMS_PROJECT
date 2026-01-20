import React from 'react';
import {
    FiUsers, FiClock, FiTarget, FiActivity, FiDollarSign, FiTag,
    FiTrendingUp, FiGlobe, FiAward
} from 'react-icons/fi';
import {
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
    FunnelChart, Funnel, LabelList
} from 'recharts';
import HealthIndicators from './HealthIndicators';

const MarketingOverview = () => {
    // --- Overview Data ---
    const overviewStats = {
        totalLeads: 12450,
        newLeadsToday: 48,
        newLeadsWeek: 342,
        conversions: 850,
        conversionRate: 6.8,
        revenue: 145000,
        cost: 48000,
        roi: 202,
        topChannel: 'Email Lists',
        topCampaign: 'Summer Bootcamp'
    };

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

    const sourceData = [
        { name: 'Email', value: 45 },
        { name: 'Social', value: 30 },
        { name: 'Organic', value: 15 },
        { name: 'Referral', value: 10 },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="overview-section fade-in">
            {/* 3x3 Grid for Key Metrics */}
            <div className="row g-4 mb-4">
                {/* Row 1: Lead Metrics */}
                <div className="col-md-4">
                    <div className="stat-card h-100">
                        <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}><FiUsers /></div>
                        <div className="d-flex flex-column">
                            <span className="stat-label">Total Leads</span>
                            <span className="stat-value">{overviewStats.totalLeads.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="stat-card h-100">
                        <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#16a34a' }}><FiClock /></div>
                        <div className="d-flex flex-column">
                            <span className="stat-label">New Leads</span>
                            <span className="stat-value text-dark fs-5">
                                <span className="fw-bold">{overviewStats.newLeadsToday}</span> <span className="text-muted fs-6">Today</span>
                                <span className="mx-2 text-muted">|</span>
                                <span className="fw-bold">{overviewStats.newLeadsWeek}</span> <span className="text-muted fs-6">Week</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="stat-card h-100">
                        <div className="stat-icon-wrapper" style={{ background: '#fff7ed', color: '#ea580c' }}><FiTarget /></div>
                        <div className="d-flex flex-column">
                            <span className="stat-label">Conversions</span>
                            <span className="stat-value">{overviewStats.conversions}</span>
                            <span className="stat-trend trend-up"><FiTrendingUp /> +12%</span>
                        </div>
                    </div>
                </div>

                {/* Row 2: Financial Metrics */}
                <div className="col-md-4">
                    <div className="stat-card h-100">
                        <div className="stat-icon-wrapper" style={{ background: '#fafaef', color: '#ca8a04' }}><FiActivity /></div>
                        <div className="d-flex flex-column">
                            <span className="stat-label">Conversion Rate</span>
                            <span className="stat-value">{overviewStats.conversionRate}%</span>
                            <span className="stat-trend trend-up"><FiTrendingUp /> +1.2%</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="stat-card h-100">
                        <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}><FiDollarSign /></div>
                        <div className="d-flex flex-column">
                            <span className="stat-label">Revenue Generated</span>
                            <span className="stat-value">${overviewStats.revenue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="stat-card h-100">
                        <div className="stat-icon-wrapper" style={{ background: '#fef2f2', color: '#dc2626' }}><FiTag /></div>
                        <div className="d-flex flex-column">
                            <span className="stat-label">Cost Spent</span>
                            <span className="stat-value">${overviewStats.cost.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Row 3: Performance Metrics */}
                <div className="col-md-4">
                    <div className="stat-card h-100">
                        <div className="stat-icon-wrapper" style={{ background: '#f5f3ff', color: '#7c3aed' }}><FiTrendingUp /></div>
                        <div className="d-flex flex-column">
                            <span className="stat-label">ROI</span>
                            <span className="stat-value">{overviewStats.roi}%</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="stat-card h-100">
                        <div className="stat-icon-wrapper" style={{ background: '#fff1f2', color: '#e11d48' }}><FiGlobe /></div>
                        <div className="d-flex flex-column">
                            <span className="stat-label">Top Channel</span>
                            <span className="stat-value fs-5">{overviewStats.topChannel}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="stat-card h-100">
                        <div className="stat-icon-wrapper" style={{ background: '#f0f9ff', color: '#0284c7' }}><FiAward /></div>
                        <div className="d-flex flex-column">
                            <span className="stat-label">Top Campaign</span>
                            <span className="stat-value fs-5 text-truncate" title={overviewStats.topCampaign}>{overviewStats.topCampaign}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Health Indicators Section */}
            <HealthIndicators />

            {/* Charts Section */}
            <div className="row g-4">
                {/* Leads vs Conversions */}
                <div className="col-lg-8">
                    <div className="bg-white p-4 rounded border shadow-sm h-100">
                        <h5 className="mb-4">Leads vs Conversions Trend</h5>
                        <div style={{ width: '100%', height: 350 }}>
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

                {/* Marketing Funnel */}
                <div className="col-lg-4">
                    <div className="bg-white p-4 rounded border shadow-sm h-100">
                        <h5 className="mb-4">Marketing Funnel</h5>
                        <div style={{ width: '100%', height: 350 }}>
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

                {/* Channel Performance (Source Data) */}
                <div className="col-12">
                    <div className="bg-white p-4 rounded border shadow-sm">
                        <h5 className="mb-4">Channel Performance</h5>
                        <div className="row">
                            <div className="col-md-6" style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sourceData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={80} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#6366f1" name="Traffic Share (%)" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="col-md-6" style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sourceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {sourceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="middle" align="right" layout="vertical" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingOverview;
