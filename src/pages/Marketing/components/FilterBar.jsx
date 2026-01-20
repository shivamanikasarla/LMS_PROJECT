import React from 'react';
import { FiFilter, FiCalendar } from 'react-icons/fi';

const FilterBar = ({
    filters = {},
    onFilterChange = () => { },
    showStatus = true,
    statusOptions = ['Active', 'Paused', 'Completed', 'Expired', 'Disabled'] // Default fallback
}) => {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div className="bg-white p-3 rounded border shadow-sm mb-4 d-flex flex-wrap gap-3 align-items-center">
            <div className="d-flex align-items-center gap-2 text-muted me-2">
                <FiFilter />
                <span className="fw-bold">Filters:</span>
            </div>

            {/* Date Range Filter */}
            <div className="d-flex align-items-center gap-2">
                <FiCalendar className="text-muted" />
                <select
                    className="form-select form-select-sm"
                    style={{ width: 140 }}
                    value={filters.dateRange || 'last30'}
                    onChange={(e) => handleChange('dateRange', e.target.value)}
                >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                </select>
            </div>

            {/* Channel Filter */}
            <select
                className="form-select form-select-sm"
                style={{ width: 150 }}
                value={filters.channel || 'All'}
                onChange={(e) => handleChange('channel', e.target.value)}
            >
                <option value="All">All Channels</option>
                <option value="Email">Email</option>
                <option value="Social">Social Media</option>
                <option value="Organic">Organic Search</option>
                <option value="Referral">Referral</option>
                <option value="SMS">SMS</option>
                <option value="WhatsApp">WhatsApp</option>
            </select>

            {/* Campaign Filter */}
            <select
                className="form-select form-select-sm"
                style={{ width: 180 }}
                value={filters.campaign || 'All'}
                onChange={(e) => handleChange('campaign', e.target.value)}
            >
                <option value="All">All Campaigns</option>
                <option value="Summer Bootcamp">Summer Bootcamp</option>
                <option value="Winter Special">Winter Special</option>
                <option value="Partner Promo">Partner Promo</option>
                <option value="Organic Search">Organic Search</option>
            </select>

            {/* Status Filter */}
            {showStatus && (
                <select
                    className="form-select form-select-sm"
                    style={{ width: 140 }}
                    value={filters.status || 'All'}
                    onChange={(e) => handleChange('status', e.target.value)}
                >
                    <option value="All">All Status</option>
                    {statusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default FilterBar;
