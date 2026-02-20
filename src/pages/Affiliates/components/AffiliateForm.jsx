
import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { generateAffiliateCode } from '../utils/codeGenerator';
import './AffiliateForm.css';

const AffiliateForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        accountType: 'individual', // 'individual' or 'group'
        groupName: '',
        name: '',
        email: '',
        mobile: '',
        password: '',
        affiliateCode: '',
        username: '',
        category: 'STUDENT',
        commissionType: 'PERCENT',
        commissionValue: 15,
        status: 'ACTIVE',
        payoutMethod: 'BANK_TRANSFER',
        payoutCycle: 'MONTHLY',
        minPayoutAmount: 1000,
        payoutDetails: '',
        adminNotes: '',
        website: '',
        address: '',
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
        notify: false,
        cookieDays: 30,
        forcePasswordReset: true
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Auto-generate code on mount if empty
        if (!formData.affiliateCode) {
            setFormData(prev => ({ ...prev, affiliateCode: generateAffiliateCode() }));
        }
    }, []);

    const handleRegenerateCode = () => {
        setFormData(prev => ({ ...prev, affiliateCode: generateAffiliateCode() }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTypeChange = (type) => {
        setFormData(prev => ({ ...prev, accountType: type }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, role: 'Affiliate' });
    };

    return (
        <form onSubmit={handleSubmit} className="container-fluid p-0">
            <div className="alert alert-info border-0 shadow-sm d-flex align-items-center mb-4">
                <FiRefreshCw className="me-2" />
                <div>
                    <strong>Create New Affiliate</strong>
                    <div className="small opacity-75">Fill in the details below. Default password logic applies if left blank.</div>
                </div>
            </div>

            <div className="row g-4">
                {/* COLUMN 1: Identity & System */}
                <div className="col-12">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                            <h5 className="card-title fw-bold text-primary mb-0">Identity & Role</h5>
                        </div>
                        <div className="card-body p-4">

                            <div className="row g-3">
                                <div className="col-md-6 order-2 order-md-1">
                                    <div className="bg-light p-3 rounded border h-100 d-flex flex-column justify-content-center">
                                        <label className="form-label text-muted small fw-bold mb-1">SYSTEM CODE</label>
                                        <div className="input-group input-group-sm">
                                            <input
                                                type="text"
                                                name="affiliateCode"
                                                className="form-control fw-bold text-primary bg-white border-end-0"
                                                value={formData.affiliateCode}
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary border-start-0 bg-white"
                                                onClick={handleRegenerateCode}
                                                title="Regenerate Code"
                                            >
                                                <FiRefreshCw />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 order-1 order-md-2">
                                    <label className="form-label">Affiliate Category <span className="text-danger">*</span></label>
                                    <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                                        <option value="STUDENT">Student</option>
                                        <option value="INFLUENCER">Influencer / Creator</option>
                                        <option value="TRAINING_PARTNER">Training Partner (Institute)</option>
                                        <option value="INTERNAL_SALES">Internal Sales</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row g-3 mt-2">
                                <div className="col-md-6">
                                    <label className="form-label">Full Name <span className="text-danger">*</span></label>
                                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Username <span className="text-muted small">(Unique)</span> <span className="text-danger">*</span></label>
                                    <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Email <span className="text-danger">*</span></label>
                                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Mobile <span className="text-danger">*</span></label>
                                    <input type="tel" name="mobile" className="form-control" value={formData.mobile} onChange={handleChange} required />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Affiliate Type <span className="text-danger">*</span></label>
                                    <div className="d-flex gap-4 mt-1">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="accountType"
                                                id="typeIndividual"
                                                value="individual"
                                                checked={formData.accountType === 'individual'}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="typeIndividual">
                                                Individual
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="accountType"
                                                id="typeGroup"
                                                value="group"
                                                checked={formData.accountType === 'group'}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="typeGroup">
                                                Group / Organization
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {formData.accountType === 'group' && (
                                    <div className="col-12 animate-fade-in">
                                        <label className="form-label">Organization Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="groupName"
                                            className="form-control"
                                            placeholder="e.g. Ace Coaching Center"
                                            value={formData.groupName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                )}

                                <div className="col-md-6">
                                    <label className="form-label">Password <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="form-control"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Set a secure password"
                                        />
                                        <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                    <div className="form-text text-muted small">
                                        <i className="bi bi-shield-lock"></i> Passwords are salted & hashed (bcrypt) before storage.
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Status</label>
                                    <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                                        <option value="ACTIVE">Active</option>
                                        <option value="PENDING">Pending Approval</option>
                                        <option value="SUSPENDED">Suspended</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: Money & Admin (Stacked Below now) */}
                <div className="col-12">
                    {/* Commercials Card */}
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                            <h5 className="card-title fw-bold text-success mb-0">Commercials & Payouts</h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="alert alert-light border small text-muted mb-4">
                                <i className="bi bi-info-circle me-1"></i>
                                Values below serve as the <strong>Default Commission</strong>. You can override these per-batch when generating links.
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Default Commission Type</label>
                                    <select name="commissionType" className="form-select" value={formData.commissionType} onChange={handleChange}>
                                        <option value="PERCENT">Percentage (%)</option>
                                        <option value="FIXED">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Default Value</label>
                                    <input type="number" name="commissionValue" className="form-control" value={formData.commissionValue} onChange={handleChange} />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Cookie Duration (Days)</label>
                                    <input
                                        type="number"
                                        name="cookieDays"
                                        className="form-control"
                                        value={formData.cookieDays || 30}
                                        onChange={handleChange}
                                        placeholder="e.g. 30"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Min. Threshold (₹)</label>
                                    <input type="number" name="minPayoutAmount" className="form-control" value={formData.minPayoutAmount} onChange={handleChange} />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Payout Cycle</label>
                                    <select name="payoutCycle" className="form-select" value={formData.payoutCycle} onChange={handleChange}>
                                        <option value="MONTHLY">Monthly</option>
                                        <option value="WEEKLY">Weekly</option>
                                        <option value="ON_DEMAND">On Demand</option>
                                    </select>
                                </div>

                                <div className="col-md-12 mt-4">
                                    <h6 className="text-muted text-xs font-bold text-uppercase mb-2">Payment Details</h6>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Method</label>
                                            <select name="payoutMethod" className="form-select" value={formData.payoutMethod} onChange={handleChange}>
                                                <option value="BANK_TRANSFER">Bank Transfer</option>
                                                <option value="UPI">UPI</option>
                                                <option value="PAYPAL">PayPal</option>
                                            </select>
                                        </div>
                                        <div className="col-md-8">
                                            <label className="form-label">Account Details <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                name="payoutDetails"
                                                className="form-control"
                                                placeholder={
                                                    formData.payoutMethod === 'UPI' ? 'Enter UPI ID (e.g. name@okhdfcbank)' :
                                                        formData.payoutMethod === 'PAYPAL' ? 'Enter PayPal Email Address' :
                                                            'Acct No, IFSC, Branch Name...'
                                                }
                                                value={formData.payoutDetails}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin & Meta Card */}
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4 bg-light rounded">
                            <h6 className="fw-bold mb-3 text-dark">Admin & Security</h6>

                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label">Internal Notes</label>
                                    <input
                                        type="text"
                                        name="adminNotes"
                                        className="form-control"
                                        placeholder="Internal remarks (e.g. Verified manually)..."
                                        value={formData.adminNotes}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12 mt-3">
                                    <div className="d-flex align-items-center gap-4 border-top pt-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="forcePasswordReset"
                                                id="forcePasswordReset"
                                                checked={formData.forcePasswordReset}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label small fw-bold text-dark" htmlFor="forcePasswordReset">
                                                Force Password Reset
                                            </label>
                                        </div>

                                        <div className="vr opacity-25"></div>

                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="termsAccepted"
                                                id="termsAccepted"
                                                checked={formData.termsAccepted}
                                                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                                                disabled
                                            />
                                            <label className="form-check-label small text-muted" htmlFor="termsAccepted">
                                                Terms Agreement Signed
                                                {formData.termsAcceptedAt && <span className="ms-1 text-xs">({new Date(formData.termsAcceptedAt).toLocaleDateString()})</span>}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2 justify-content-end mt-4 pt-2 border-top">
                                <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-4 fw-bold">Create Affiliate</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AffiliateForm;
