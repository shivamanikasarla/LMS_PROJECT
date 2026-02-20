import React, { useState } from 'react';
import { FiX, FiUser, FiSettings, FiActivity, FiLayers, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';

const AffiliateDetails = ({ affiliate, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!affiliate) return null;

    // Mock History Data
    const batches = [
        { id: 'B-101', name: 'Java Jan', course: 'Java FS', assignedAt: '2026-01-10', clicks: 120, sales: 10, revenue: 100000, commission: '15%', status: 'Active' },
        { id: 'B-102', name: 'Python Mar', course: 'Python', assignedAt: '2026-01-15', clicks: 80, sales: 6, revenue: 60000, commission: '10%', status: 'Active' },
        { id: 'B-103', name: 'React Weekend', course: 'ReactJS', assignedAt: '2026-02-01', clicks: 45, sales: 2, revenue: 20000, commission: '₹500', status: 'Inactive' },
    ];

    const payouts = [
        { id: 'P-99', date: '2025-12-31', amount: 4500, status: 'PAID' },
        { id: 'P-100', date: '2026-01-15', amount: 1200, status: 'PENDING' },
    ];

    return (
        <div className="card shadow-lg border-0 h-100">
            {/* Header */}
            <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: 48, height: 48 }}>
                        {affiliate.name.charAt(0)}
                    </div>
                    <div>
                        <h5 className="mb-0 fw-bold">{affiliate.name}</h5>
                        <div className="d-flex align-items-center gap-2 small text-muted">
                            <span>ID: {affiliate.id}</span>
                            <span className="vr"></span>
                            <span>{affiliate.type}</span>
                            <span className="vr"></span>
                            <span className={`badge bg-${affiliate.status === 'ACTIVE' ? 'success' : 'secondary'} bg-opacity-10 text-${affiliate.status === 'ACTIVE' ? 'success' : 'secondary'} border-0`}>
                                {affiliate.status}
                            </span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="btn btn-light btn-sm rounded-circle p-2">
                    <FiX size={20} />
                </button>
            </div>

            {/* Navigation */}
            <div className="px-4 border-bottom bg-light bg-opacity-25">
                <ul className="nav nav-tabs border-bottom-0 gap-3">
                    <li className="nav-item">
                        <button
                            className={`nav-link border-0 border-bottom border-3 py-3 px-1 ${activeTab === 'overview' ? 'active border-primary fw-bold text-primary' : 'text-muted border-transparent'}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <FiActivity className="me-2" /> Overview
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link border-0 border-bottom border-3 py-3 px-1 ${activeTab === 'batches' ? 'active border-primary fw-bold text-primary' : 'text-muted border-transparent'}`}
                            onClick={() => setActiveTab('batches')}
                        >
                            <FiLayers className="me-2" /> Batches ({batches.length})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link border-0 border-bottom border-3 py-3 px-1 ${activeTab === 'payouts' ? 'active border-primary fw-bold text-primary' : 'text-muted border-transparent'}`}
                            onClick={() => setActiveTab('payouts')}
                        >
                            <FiDollarSign className="me-2" /> Payouts
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link border-0 border-bottom border-3 py-3 px-1 ${activeTab === 'settings' ? 'active border-primary fw-bold text-primary' : 'text-muted border-transparent'}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <FiSettings className="me-2" /> Settings
                        </button>
                    </li>
                </ul>
            </div>

            {/* Content */}
            <div className="card-body p-4 overflow-auto" style={{ maxHeight: '60vh' }}>

                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="animate-fade-in">
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <div className="p-3 bg-light rounded border text-center">
                                    <div className="h3 fw-bold text-primary mb-1">₹85,000</div>
                                    <div className="small text-muted">Total Revenue</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 bg-light rounded border text-center">
                                    <div className="h3 fw-bold text-success mb-1">₹12,750</div>
                                    <div className="small text-muted">Commission Earned</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 bg-light rounded border text-center">
                                    <div className="h3 fw-bold text-dark mb-1">17</div>
                                    <div className="small text-muted">Total Enrollments</div>
                                </div>
                            </div>
                        </div>



                        {/* RISK ANALYSIS SECTION */}
                        {(affiliate.riskLevel === 'High' || affiliate.riskLevel === 'Medium') && (
                            <div className={`p-3 border rounded mb-4 ${affiliate.riskLevel === 'High' ? 'bg-danger bg-opacity-10 border-danger' : 'bg-warning bg-opacity-10 border-warning'}`}>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <FiAlertTriangle className={affiliate.riskLevel === 'High' ? 'text-danger' : 'text-warning'} />
                                    <h6 className={`mb-0 fw-bold ${affiliate.riskLevel === 'High' ? 'text-danger' : 'text-danger-emphasis'}`}>Fraud & Abuse Signals Detected</h6>
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    {affiliate.fraudSignals.map((signal, idx) => (
                                        <span key={idx} className={`badge ${affiliate.riskLevel === 'High' ? 'bg-danger text-white' : 'bg-warning text-dark'}`}>
                                            {signal}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <h6 className="fw-bold mb-3">Contact Information</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="small text-muted text-uppercase fw-bold">Email</label>
                                <div>{affiliate.email || 'N/A'}</div>
                            </div>
                            <div className="col-md-6">
                                <label className="small text-muted text-uppercase fw-bold">Phone</label>
                                <div>{affiliate.phone || 'N/A'}</div>
                            </div>
                            <div className="col-12">
                                <label className="small text-muted text-uppercase fw-bold">Address</label>
                                <div>{affiliate.address || 'No address provided'}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. BATCHES TAB */}
                {activeTab === 'batches' && (
                    <div className="animate-fade-in">
                        <div className="table-responsive border rounded">
                            <table className="table table-hover align-middle mb-0 text-nowrap">
                                <thead className="table-light">
                                    <tr>
                                        <th>Batch</th>
                                        <th>Course</th>
                                        <th>Commission</th>
                                        <th>Link</th>
                                        <th className="text-center">Clicks</th>
                                        <th className="text-center">Enrollments</th>
                                        <th className="text-end">Revenue</th>
                                        <th className="text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {batches.map(batch => (
                                        <tr key={batch.id}>
                                            <td className="fw-bold text-dark">{batch.name}</td>
                                            <td className="text-muted small">{batch.course}</td>
                                            <td className="text-primary fw-bold">{batch.commission}</td>
                                            <td>
                                                <button className="btn btn-sm btn-light border text-primary py-0 px-2" title="View Link">View</button>
                                            </td>
                                            <td className="text-center">{batch.clicks}</td>
                                            <td className="text-center fw-bold">{batch.sales}</td>
                                            <td className="text-end">₹{batch.revenue.toLocaleString()}</td>
                                            <td className="text-center">
                                                <span className={`badge ${batch.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                                    {batch.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 text-center">
                            <button className="btn btn-sm btn-light text-primary fw-bold" onClick={() => setActiveTab('settings')}>Assign New Batch +</button>
                        </div>
                    </div>
                )}

                {/* 3. PAYOUTS TAB */}
                {activeTab === 'payouts' && (
                    <div className="animate-fade-in">
                        <div className="table-responsive border rounded">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Payout ID</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Receipt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payouts.map(pay => (
                                        <tr key={pay.id}>
                                            <td><span className="font-monospace small">{pay.id}</span></td>
                                            <td>{pay.date}</td>
                                            <td className="fw-bold">₹{pay.amount.toLocaleString()}</td>
                                            <td>
                                                <span className={`badge bg-${pay.status === 'PAID' ? 'success' : 'warning'} bg-opacity-25 text-${pay.status === 'PAID' ? 'success' : 'dark'}`}>
                                                    {pay.status}
                                                </span>
                                            </td>
                                            <td><button className="btn btn-sm btn-link text-decoration-none">Download</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 4. SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div className="animate-fade-in">
                        <div className="row g-4">
                            <div className="col-12">
                                <div className="p-3 border rounded bg-light">
                                    <h6 className="fw-bold mb-3">Default Commission Rules</h6>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted">Commission Type</label>
                                            <select className="form-select" value={affiliate.commissionType} disabled>
                                                <option value="PERCENT">Percentage (%)</option>
                                                <option value="FIXED">Fixed Amount (₹)</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted">Default Value</label>
                                            <input type="text" className="form-control" value={affiliate.commissionValue} disabled />
                                        </div>
                                    </div>
                                    <div className="mt-3 small text-muted">
                                        <FiActivity className="me-1" /> To update these defaults, edit the affiliate profile.
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="p-3 border rounded bg-light">
                                    <h6 className="fw-bold mb-3">Payout Preferences</h6>
                                    <p className="small mb-1"><span className="fw-bold">Method:</span> Bank Transfer</p>
                                    <p className="small mb-0"><span className="fw-bold">Details:</span> HDFC0001234, Acct: ******8902</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer */}
            <div className="card-footer bg-light py-3 px-4 d-flex justify-content-end gap-2 text-end">
                <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>Close</button>
                <button className="btn btn-primary btn-sm px-3">Edit Profile</button>
            </div>
        </div >
    );
};

export default AffiliateDetails;
