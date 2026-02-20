import React, { useState } from 'react';
import { FiSave, FiSettings, FiBell, FiZap, FiTarget, FiDollarSign } from 'react-icons/fi';

const GeneralSettings = () => {
    const [settings, setSettings] = useState({
        attributionModel: 'last-touch',
        conversionWindow: 30,
        autoAssignRule: 'round-robin',
        defaultCommissionType: 'percentage',
        defaultCommissionValue: 10,
        notifications: {
            newLead: true,
            campaignBudget: true,
            systemErrors: true,
            email: true,
            sms: false
        }
    });

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleNotificationChange = (key, checked) => {
        setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: checked }
        }));
    };

    const handleSave = () => {
        // Mock save
        alert("Global settings saved successfully!");
    };

    return (
        <div className="general-settings animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary bg-opacity-10 p-2 rounded text-primary">
                        <FiSettings size={20} />
                    </div>
                    <div>
                        <h5 className="mb-0 fw-bold">General Configuration</h5>
                        <p className="small text-muted mb-0">Manage global defaults and behavioral logic.</p>
                    </div>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSave}>
                    <FiSave /> Save Changes
                </button>
            </div>

            <div className="row g-4">
                {/* 1. ATTRIBUTION & CONVERSION */}
                <div className="col-12">
                    <div className="card border shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <FiTarget className="text-muted" /> Attribution & Logic
                            </h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-muted">Default Attribution Model</label>
                                    <select
                                        className="form-select"
                                        value={settings.attributionModel}
                                        onChange={(e) => handleChange('attributionModel', e.target.value)}
                                    >
                                        <option value="first-touch">First Touch (First interaction gets credit)</option>
                                        <option value="last-touch">Last Touch (Last interaction gets credit)</option>
                                        <option value="linear">Linear (Credit distributed equally)</option>
                                        <option value="time-decay">Time Decay (Recent interactions get more)</option>
                                    </select>
                                    <div className="form-text small">Determines how revenue credit is assigned to campaigns.</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-muted">Conversion Window (Days)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={settings.conversionWindow}
                                        onChange={(e) => handleChange('conversionWindow', e.target.value)}
                                        min="1"
                                    />
                                    <div className="form-text small">Timeframe after a click to count as a conversion.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. AUTOMATION & RULES */}
                <div className="col-12">
                    <div className="card border shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <FiZap className="text-muted" /> Rules & Defaults
                            </h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-muted">Lead Auto-Assignment Rule</label>
                                    <select
                                        className="form-select"
                                        value={settings.autoAssignRule}
                                        onChange={(e) => handleChange('autoAssignRule', e.target.value)}
                                    >
                                        <option value="manual">Manual Assignment Only</option>
                                        <option value="round-robin">Round Robin (Distribute Equally)</option>
                                        <option value="geo-based">Geo-Based (Assign by Location)</option>
                                        <option value="source-based">Source-Based (Diff teams for FB vs Google)</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-muted">Default Commission Rule</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <FiDollarSign />
                                        </span>
                                        <select
                                            className="form-select"
                                            style={{ maxWidth: 140 }}
                                            value={settings.defaultCommissionType}
                                            onChange={(e) => handleChange('defaultCommissionType', e.target.value)}
                                        >
                                            <option value="percentage">Percentage %</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={settings.defaultCommissionValue}
                                            onChange={(e) => handleChange('defaultCommissionValue', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-text small">Fallback commission for new affiliates/campaigns.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. NOTIFICATIONS */}
                <div className="col-12">
                    <div className="card border shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <FiBell className="text-muted" /> Notifications & Alerts
                            </h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="fw-bold small text-muted mb-3 d-block">Alert Triggers</label>
                                    <div className="d-flex flex-col gap-3">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.notifications.newLead}
                                                onChange={(e) => handleNotificationChange('newLead', e.target.checked)}
                                            />
                                            <label className="form-check-label">New Lead Detected</label>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.notifications.campaignBudget}
                                                onChange={(e) => handleNotificationChange('campaignBudget', e.target.checked)}
                                            />
                                            <label className="form-check-label">Campaign Budget Threshold (80%)</label>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.notifications.systemErrors}
                                                onChange={(e) => handleNotificationChange('systemErrors', e.target.checked)}
                                            />
                                            <label className="form-check-label">System Critical Errors</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 border-start ps-md-4">
                                    <label className="fw-bold small text-muted mb-3 d-block">Delivery Channels</label>
                                    <div className="d-flex flex-col gap-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.notifications.email}
                                                onChange={(e) => handleNotificationChange('email', e.target.checked)}
                                            />
                                            <label className="form-check-label">Email Notifications</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={settings.notifications.sms}
                                                onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                                            />
                                            <label className="form-check-label">SMS Alerts</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
