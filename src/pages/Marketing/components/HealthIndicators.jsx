import React from 'react';
import { FiTrendingDown, FiActivity, FiUserCheck, FiAlertCircle } from 'react-icons/fi';

const HealthIndicators = () => {
    // Mock Data for Health Indicators
    const indicators = {
        leadDropOff: {
            stage: 'Sign-up to Purchase',
            value: 65,
            status: 'Critical' // High drop-off
        },
        burnRate: {
            spent: 12000,
            total: 15000,
            percentage: 80,
            daysLeft: 5,
            status: 'Warning' // High burn rate
        },
        affiliateQuality: {
            score: 7.8, // out of 10
            trend: '+0.4',
            status: 'Good'
        },
        revenueLeakage: {
            value: 2.1, // percentage
            amount: 3200,
            status: 'Stable'
        }
    };

    return (
        <div className="health-indicators mb-4 animate-fade-in">
            <h5 className="mb-3 fw-bold d-flex align-items-center gap-2">
                <FiActivity className="text-primary" /> System Health & Risk Matrix
            </h5>
            <div className="row g-4">
                {/* 1. Lead Drop-off */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-danger">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <div className="small text-muted text-uppercase fw-bold">Lead Drop-off</div>
                                    <h3 className="mb-0 text-danger">{indicators.leadDropOff.value}%</h3>
                                </div>
                                <div className="p-2 bg-danger bg-opacity-10 text-danger rounded-circle">
                                    <FiTrendingDown size={20} />
                                </div>
                            </div>
                            <div className="small text-muted">
                                Biggest leak: <span className="fw-bold text-dark">{indicators.leadDropOff.stage}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Campaign Burn Rate */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-warning">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <div className="small text-muted text-uppercase fw-bold">Budget Burn Rate</div>
                                    <h3 className="mb-0 text-warning">{indicators.burnRate.percentage}%</h3>
                                </div>
                                <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-circle">
                                    <FiActivity size={20} />
                                </div>
                            </div>
                            <div className="progress" style={{ height: 6 }}>
                                <div
                                    className="progress-bar bg-warning"
                                    role="progressbar"
                                    style={{ width: `${indicators.burnRate.percentage}%` }}
                                ></div>
                            </div>
                            <div className="small text-muted mt-2">
                                <span className="fw-bold">${indicators.burnRate.spent.toLocaleString()}</span> spent, {indicators.burnRate.daysLeft} days left
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Affiliate Quality Score */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-success">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <div className="small text-muted text-uppercase fw-bold">Affiliate Quality</div>
                                    <h3 className="mb-0 text-success">{indicators.affiliateQuality.score}/10</h3>
                                </div>
                                <div className="p-2 bg-success bg-opacity-10 text-success rounded-circle">
                                    <FiUserCheck size={20} />
                                </div>
                            </div>
                            <div className="small text-muted">
                                Traffic quality is <span className="text-success fw-bold">High</span> ({indicators.affiliateQuality.trend})
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Revenue Leakage */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-info">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <div className="small text-muted text-uppercase fw-bold">Revenue Leakage</div>
                                    <h3 className="mb-0 text-dark">{indicators.revenueLeakage.value}%</h3>
                                </div>
                                <div className="p-2 bg-info bg-opacity-10 text-info rounded-circle">
                                    <FiAlertCircle size={20} />
                                </div>
                            </div>
                            <div className="small text-muted">
                                Lost approx <span className="fw-bold text-danger">${indicators.revenueLeakage.amount.toLocaleString()}</span> to refunds/fraud
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthIndicators;
