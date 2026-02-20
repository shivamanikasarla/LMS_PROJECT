
import React, { useState } from 'react';
import { FiLink, FiMousePointer, FiDollarSign, FiCopy, FiTrendingUp } from 'react-icons/fi';
import './Affiliates.css';

const AffiliatePortal = () => {
    // Mock Affiliate Data
    const affiliate = {
        name: 'John Doe',
        code: 'AFF-2024-001',
        balance: 450.00,
        commissionType: 'PERCENT', // or 'FIXED'
        commissionValue: 15
    };

    // Link Generator State
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');

    const courses = [{ id: 101, title: 'ReactJS Masterclass' }, { id: 102, title: 'Full Stack Java' }];
    const batches = { 101: [{ id: 'B1', name: 'Sept 2024' }], 102: [{ id: 'B3', name: 'Nov 2024' }] };

    const handleGenerate = () => {
        if (!selectedBatch) return;
        const url = `https://lms-demo.com/enroll/batch/${selectedBatch}?ref=${affiliate.code}`;
        setGeneratedLink(url);
    };

    return (
        <div className="affiliate-page">
            <header className="affiliate-header">
                <div className="page-title">
                    <h1>Welcome, {affiliate.name} 👋</h1>
                    <p>Track your performance and manage your earnings.</p>
                </div>
                <div className="marketing-actions">
                    <span className="badge bg-green-subtle text-green p-2 px-3 rounded-pill border border-green">
                        Status: <strong>Active</strong>
                    </span>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="affiliate-summary" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                <div className="summary-card">
                    <div className="summary-label">Total Clicks</div>
                    <div className="summary-value">1,240</div>
                    <div className="text-sm text-muted mt-2"><FiMousePointer /> +45 today</div>
                </div>
                <div className="summary-card">
                    <div className="summary-label">Enrollments</div>
                    <div className="summary-value">85</div>
                    <div className="text-sm text-muted mt-2"><FiTrendingUp /> 6.8% conversion</div>
                </div>
                <div className="summary-card highlight">
                    <div>
                        <div className="summary-label text-white-50">Unpaid Earnings</div>
                        <div className="summary-value text-white">${affiliate.balance.toFixed(2)}</div>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-label">Commission Model</div>
                    <div className="summary-value text-blue">
                        {affiliate.commissionType === 'PERCENT' ? `${affiliate.commissionValue}%` : `$${affiliate.commissionValue}`}
                    </div>
                    <div className="text-sm text-muted mt-2">
                        {affiliate.commissionType === 'PERCENT' ? 'Per enrollment' : 'Fixed per sale'}
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                {/* Visual Process Guide (Requested by User) */}
                <div className="col-md-7">
                    <div className="commission-settings h-100">
                        <h3>Your Success Journey</h3>
                        <p className="text-muted">Follow these steps to maximize your earnings.</p>

                        <div className="process-steps mt-4 d-flex flex-column gap-3">
                            <div className="d-flex gap-3 align-items-center p-3 bg-light rounded">
                                <span className="step-num text-blue font-bold text-xl">01</span>
                                <div>
                                    <h5 className="m-0 font-bold">Choose a Course</h5>
                                    <p className="m-0 text-sm text-muted">Select a high-demand batch from the list below.</p>
                                </div>
                            </div>
                            <div className="d-flex gap-3 align-items-center p-3 bg-light rounded">
                                <span className="step-num text-purple font-bold text-xl" style={{ color: '#9333ea' }}>02</span>
                                <div>
                                    <h5 className="m-0 font-bold">Generate Unique Link</h5>
                                    <p className="m-0 text-sm text-muted">Create a tracked link attached to your ID <strong>{affiliate.code}</strong>.</p>
                                </div>
                            </div>
                            <div className="d-flex gap-3 align-items-center p-3 bg-light rounded">
                                <span className="step-num text-green font-bold text-xl" style={{ color: '#16a34a' }}>03</span>
                                <div>
                                    <h5 className="m-0 font-bold">Promote & Earn</h5>
                                    <p className="m-0 text-sm text-muted">
                                        Share on social media. You earn {affiliate.commissionType === 'PERCENT' ? `${affiliate.commissionValue}%` : `$${affiliate.commissionValue}`} on every sale!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Self-Serve Link Generator */}
                <div className="col-md-5">
                    <div className="commission-settings h-100 bg-blue-subtle border-blue">
                        <h3 className="text-blue"><FiLink className="me-2" /> Create Link</h3>
                        <p className="text-blue-dark opacity-75 mb-4">Ready to promote? Get your link now.</p>

                        <div className="st-group">
                            <label>Course</label>
                            <select className="st-input bg-white" onChange={e => setSelectedCourse(e.target.value)}>
                                <option value="">-- Select Course --</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                        </div>

                        <div className="st-group">
                            <label>Batch</label>
                            <select className="st-input bg-white" onChange={e => setSelectedBatch(e.target.value)} disabled={!selectedCourse}>
                                <option value="">-- Select Batch --</option>
                                {selectedCourse && batches[selectedCourse]?.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <button className="btn-save w-100 mb-3" onClick={handleGenerate} disabled={!selectedBatch}>Generate My Link</button>

                        {generatedLink && (
                            <div className="bg-white p-3 rounded border">
                                <small className="text-muted d-block mb-1">Your Tracking Link:</small>
                                <div className="d-flex gap-2">
                                    <input type="text" className="form-control form-control-sm" readOnly value={generatedLink} />
                                    <button className="btn-icon-plain" onClick={() => navigator.clipboard.writeText(generatedLink)}><FiCopy /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AffiliatePortal;
