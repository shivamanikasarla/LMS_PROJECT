import React, { useState } from 'react';
import { FiSave, FiLock, FiActivity, FiGlobe } from 'react-icons/fi';

const MarketingSettings = ({ role = 'MANAGER' }) => {
    // Only Managers/Admins can access this, but safe check
    const isManager = role === 'MANAGER' || role === 'ADMIN';

    const [settings, setSettings] = useState({
        // Permissions
        allowExecutiveCampaignCreation: true,
        requireApprovalForCampaigns: true,
        maxCouponsPerCampaign: 5,

        // Affiliate
        defaultCommissionRate: 10,
        cookieDurationDays: 30,

        // API
        googleAdsApiKey: '********************',
        facebookPixelId: '********************'
    });

    if (!isManager) {
        return (
            <div className="alert alert-danger">
                Access Denied: You do not have permission to view these settings.
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <div className="bg-white rounded shadow-sm border p-4 max-w-4xl mx-auto">
            <h4 className="mb-4">Marketing Configuration</h4>

            {/* 1. Permissions & Workflow */}
            <div className="mb-5">
                <h6 className="d-flex align-items-center gap-2 mb-3 text-primary">
                    <FiLock /> Permissions & Workflow
                </h6>
                <div className="card p-3 border-light bg-light">
                    <div className="form-check form-switch mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="allowExecutiveCampaignCreation"
                            name="allowExecutiveCampaignCreation"
                            checked={settings.allowExecutiveCampaignCreation}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="allowExecutiveCampaignCreation">
                            Allow Marketing Executives to Draft Campaigns
                        </label>
                    </div>

                    <div className="form-check form-switch mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="requireApprovalForCampaigns"
                            name="requireApprovalForCampaigns"
                            checked={settings.requireApprovalForCampaigns}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="requireApprovalForCampaigns">
                            Require Manager/Admin Approval for Publishing
                        </label>
                        <small className="d-block text-muted ms-4">
                            If enabled, campaigns created by Executives will stay in <strong>Pending Approval</strong> state until approved.
                        </small>
                    </div>

                    <div className="mb-3 ms-1" style={{ maxWidth: 300 }}>
                        <label className="form-label small fw-bold">Max Coupons per Campaign</label>
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            name="maxCouponsPerCampaign"
                            value={settings.maxCouponsPerCampaign}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* 2. Affiliate Global Settings */}
            <div className="mb-5">
                <h6 className="d-flex align-items-center gap-2 mb-3 text-success">
                    <FiActivity /> Affiliate Global Defaults
                </h6>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Default Commission (%)</label>
                        <div className="input-group">
                            <input
                                type="number"
                                className="form-control"
                                name="defaultCommissionRate"
                                value={settings.defaultCommissionRate}
                                onChange={handleChange}
                            />
                            <span className="input-group-text">%</span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Cookie Duration (Days)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="cookieDurationDays"
                            value={settings.cookieDurationDays}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* 3. API Integrations */}
            <div className="mb-4">
                <h6 className="d-flex align-items-center gap-2 mb-3 text-info">
                    <FiGlobe /> API Integrations
                </h6>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Google Ads API Key</label>
                        <input
                            type="password"
                            className="form-control"
                            name="googleAdsApiKey"
                            value={settings.googleAdsApiKey}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Facebook Pixel ID</label>
                        <input
                            type="text"
                            className="form-control"
                            name="facebookPixelId"
                            value={settings.facebookPixelId}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <hr className="my-4" />

            <div className="d-flex justify-content-end">
                <button className="btn btn-primary d-flex align-items-center gap-2">
                    <FiSave /> Save Configuration
                </button>
            </div>
        </div>
    );
};

export default MarketingSettings;
