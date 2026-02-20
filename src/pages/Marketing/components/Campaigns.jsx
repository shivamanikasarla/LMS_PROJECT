import React, { useState, useEffect } from 'react';
import { FiPlus, FiBarChart2, FiEdit, FiTrendingDown, FiTrendingUp, FiEye, FiCheck, FiPause, FiArchive, FiTag, FiDollarSign, FiGlobe } from 'react-icons/fi';

import { marketingService } from '../../../services/marketingService';
import { useAuth } from '../../../../src/pages/Library/context/AuthContext';

const Campaigns = ({ role = 'MANAGER', startWizard = false }) => {
    // --- STATE ---
    const isManager = role === 'MANAGER' || role === 'ADMIN';
    const { user } = useAuth() || {}; // Safety fallback

    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [wizardData, setWizardData] = useState({
        name: '',
        channel: 'Email',
        budget: 0,

        // Common
        startDate: '',
        endDate: '',
        objective: 'Leads',
        audienceSegment: 'All',
        description: '',

        // Email Specific
        subjectLine: '',
        emailBody: '',

        // Ads/Social Specific
        platform: 'Facebook',
        content: '', // External Link
        utmSource: '',
        utmMedium: '',
        utmCampaign: ''
    });

    const [filters, setFilters] = useState({});

    // Effect to trigger wizard if startWizard prop is true
    useEffect(() => {
        if (startWizard) {
            setShowCreateModal(true);
        }
    }, [startWizard]);

    // --- DATA FETCHING ---
    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            let data = [];
            if (isManager) {
                data = await marketingService.getAllCampaigns();
            } else {
                if (user?.id) {
                    data = await marketingService.getMyCampaigns(user.id);
                }
            }
            setCampaigns(data || []);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch campaigns", err);
            setError("Failed to load campaigns.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [isManager, user]);

    // Filter Logic
    const displayedCampaigns = campaigns.filter(c => {
        if (filters.status && c.status !== filters.status) return false;
        return true;
    });

    // --- HANDLERS ---
    const handleStatusChange = async (id, newStatus) => {
        try {
            // Optimistic Update
            setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));

            if (isManager) {
                await marketingService.updateCampaignStatus(id, newStatus);
            }
        } catch (err) {
            console.error("Failed to update status", err);
            fetchCampaigns();
        }
    };

    const handleCreateSubmit = async (isDraft = false) => {
        try {
            // VALIDATION: Basic checks
            if (!wizardData.name) { alert("Campaign Name is required"); return; }
            if (wizardData.channel === 'Ads' || wizardData.channel === 'Social') {
                if (!wizardData.content) { alert("External Link is required for Ads"); return; }
                if (!wizardData.utmSource || !wizardData.utmMedium || !wizardData.utmCampaign) {
                    alert("UTM Parameters (Source, Medium, Campaign) are MANDATORY for tracking.");
                    return;
                }
            }
            if (wizardData.channel === 'Email') {
                if (!wizardData.subjectLine) { alert("Subject Line is required"); return; }
            }

            const payload = {
                name: wizardData.name,
                channel: wizardData.channel,
                budget: wizardData.budget,
                objective: wizardData.objective,
                startDate: wizardData.startDate,
                endDate: wizardData.endDate,

                // Email Specifics (Audit/Storage)
                subjectLine: wizardData.channel === 'Email' ? wizardData.subjectLine : null,
                emailBody: wizardData.channel === 'Email' ? wizardData.emailBody : null,
                audienceSegment: wizardData.audienceSegment,

                // Ads/Social Specifics (Tracking Only)
                platform: (wizardData.channel === 'Ads' || wizardData.channel === 'Social') ? wizardData.platform : null,
                content: (wizardData.channel === 'Ads' || wizardData.channel === 'Social') ? wizardData.content : null,

                // UTM Tracking (Strictly Required for Ads)
                utmSource: wizardData.utmSource,
                utmMedium: wizardData.utmMedium,
                utmCampaign: wizardData.utmCampaign,

                description: wizardData.description,

                createdBy: user?.id,
                createdByRole: user?.role,
                status: isDraft ? 'DRAFT' : 'PENDING_APPROVAL',
                submittedAt: isDraft ? null : new Date().toISOString()
            };

            await marketingService.createCampaign(payload);

            // Refresh list
            fetchCampaigns();

            setShowCreateModal(false);
            setWizardStep(1); // Reset
            // Reset full state
            setWizardData({
                name: '', channel: 'Email', budget: 0,
                startDate: '', endDate: '',
                objective: 'Leads', audienceSegment: 'All', description: '',
                subjectLine: '', emailBody: '',
                platform: 'Facebook', content: '',
                utmSource: '', utmMedium: '', utmCampaign: ''
            });

        } catch (err) {
            console.error("Failed to create campaign", err);
            alert("Failed to create campaign. Please try again.");
        }
    };

    // --- WIZARD CONTENT ---
    const renderWizard = () => {
        const steps = [
            { id: 1, label: 'Placement' },
            { id: 2, label: 'Details' },
            { id: 3, label: 'Setup' },
            { id: 4, label: 'Review' }
        ];

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
                <div className="bg-white rounded shadow-lg w-100 max-w-4xl overflow-hidden d-flex" style={{ maxWidth: '900px', minHeight: '600px' }}>

                    {/* LEFT PANEL: MAIN FORM */}
                    <div className="p-4 flex-grow-1 d-flex flex-column" style={{ flex: '2', borderRight: '1px solid #f0f0f0' }}>

                        {/* HEADER */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0 text-dark">
                                {wizardStep === 1 && 'Placement'}
                                {wizardStep === 2 && 'Campaign Details'}
                                {wizardStep === 3 && 'Channel Setup'}
                                {wizardStep === 4 && 'Review & Submit'}
                            </h4>
                            <small className="text-muted">Step {wizardStep} of 4</small>
                        </div>

                        {/* STEP 1: PLACEMENT (CHANNEL) */}
                        {wizardStep === 1 && (
                            <div className="fade-in flex-grow-1">
                                <p className="text-muted mb-3">Where do you want your campaign to be seen?</p>
                                <div className="row g-3">
                                    {[
                                        { id: 'Email', icon: '📩', label: 'Email Blast', desc: 'Direct to inbox' },
                                        { id: 'Ads', icon: '📢', label: 'Social Ads', desc: 'External Link Tracking' },
                                        { id: 'Affiliate', icon: '🤝', label: 'Affiliates', desc: 'Partner network' },
                                        { id: 'SMS', icon: '📱', label: 'SMS', desc: 'Text messages' }
                                    ].map(opt => (
                                        <div className="col-md-6" key={opt.id}>
                                            <div
                                                className={`card h-100 cursor-pointer p-3 border ${wizardData.channel === opt.id ? 'border-primary bg-light' : ''}`}
                                                onClick={() => setWizardData({ ...wizardData, channel: opt.id })}
                                                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                            >
                                                <div className="fs-1 mb-2">{opt.icon}</div>
                                                <h6 className="fw-bold">{opt.label}</h6>
                                                <p className="small text-muted m-0">{opt.desc}</p>
                                                {wizardData.channel === opt.id && <div className="text-primary position-absolute top-0 end-0 m-2"><FiCheck /></div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: DETAILS */}
                        {wizardStep === 2 && (
                            <div className="fade-in flex-grow-1">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Campaign Name</label>
                                    <input
                                        type="text" className="form-control form-control-lg" placeholder="e.g., Summer Sale 2024"
                                        value={wizardData.name}
                                        onChange={e => setWizardData({ ...wizardData, name: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Objective</label>
                                    <select
                                        className="form-select"
                                        value={wizardData.objective || 'Leads'}
                                        onChange={e => setWizardData({ ...wizardData, objective: e.target.value })}
                                    >
                                        <option value="Leads">Lead Generation</option>
                                        <option value="Sales">Direct Sales</option>
                                        <option value="Awareness">Brand Awareness</option>
                                    </select>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Budget ($)</label>
                                        <input
                                            type="number" className="form-control"
                                            value={wizardData.budget}
                                            onChange={e => setWizardData({ ...wizardData, budget: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Audience Segment</label>
                                        <select
                                            className="form-select"
                                            value={wizardData.audienceSegment || 'All'}
                                            onChange={e => setWizardData({ ...wizardData, audienceSegment: e.target.value })}
                                        >
                                            <option value="All">All Users</option>
                                            <option value="New">New Signups (Last 30 days)</option>
                                            <option value="Inactive">Inactive (&gt; 90 days)</option>
                                            <option value="Premium">Premium Members</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Start Date</label>
                                        <input
                                            type="date" className="form-control"
                                            value={wizardData.startDate}
                                            onChange={e => setWizardData({ ...wizardData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">End Date</label>
                                        <input
                                            type="date" className="form-control"
                                            value={wizardData.endDate}
                                            onChange={e => setWizardData({ ...wizardData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: CHANNEL SETUP */}
                        {wizardStep === 3 && (
                            <div className="fade-in flex-grow-1">
                                {wizardData.channel === 'Email' ? (
                                    <>
                                        <div className="alert alert-info small mb-3">
                                            <FiEye className="me-2" /> Configuring <strong>Email Blast</strong>. Content is audited before sending.
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Email Subject Line</label>
                                            <input
                                                type="text" className="form-control"
                                                placeholder="Enter a catchy subject..."
                                                value={wizardData.subjectLine || ''}
                                                onChange={e => setWizardData({ ...wizardData, subjectLine: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Email Body Content</label>
                                            <textarea
                                                className="form-control" rows={5}
                                                placeholder="Write your email content here (supports basic text for now)..."
                                                value={wizardData.emailBody || ''}
                                                onChange={e => setWizardData({ ...wizardData, emailBody: e.target.value })}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="vstack gap-3">
                                        <div className="alert alert-warning small">
                                            <FiGlobe className="me-2" /> Configuring <strong>{wizardData.channel}</strong>.
                                            We do NOT host creatives. You must provide the external tracking link.
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Platform</label>
                                            <select
                                                className="form-select"
                                                value={wizardData.platform || 'Facebook'}
                                                onChange={e => setWizardData({ ...wizardData, platform: e.target.value })}
                                            >
                                                <option value="Facebook">Facebook / Instagram</option>
                                                <option value="LinkedIn">LinkedIn</option>
                                                <option value="Google">Google Ads</option>
                                                <option value="TikTok">TikTok</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">External Campaign Link (Creative URL)</label>
                                            <input
                                                type="url" className="form-control"
                                                placeholder="https://facebook.com/ads/manager/..."
                                                value={wizardData.content || ''}
                                                onChange={e => setWizardData({ ...wizardData, content: e.target.value })}
                                            />
                                            <div className="form-text">Paste the link to the live ad or creative here.</div>
                                        </div>

                                        <div className="card p-3 bg-light border">
                                            <h6 className="fw-bold small text-uppercase text-muted mb-3">UTM Tracking (Mandatory)</h6>
                                            <div className="row g-2">
                                                <div className="col-4">
                                                    <label className="form-label small fw-bold">Source</label>
                                                    <input
                                                        type="text" className="form-control form-control-sm" placeholder="e.g. facebook"
                                                        value={wizardData.utmSource || ''}
                                                        onChange={e => setWizardData({ ...wizardData, utmSource: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-4">
                                                    <label className="form-label small fw-bold">Medium</label>
                                                    <input
                                                        type="text" className="form-control form-control-sm" placeholder="e.g. cpc"
                                                        value={wizardData.utmMedium || ''}
                                                        onChange={e => setWizardData({ ...wizardData, utmMedium: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-4">
                                                    <label className="form-label small fw-bold">Campaign</label>
                                                    <input
                                                        type="text" className="form-control form-control-sm" placeholder="e.g. summer_24"
                                                        value={wizardData.utmCampaign || ''}
                                                        onChange={e => setWizardData({ ...wizardData, utmCampaign: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 4: REVIEW & LAUNCH */}
                        {wizardStep === 4 && (
                            <div className="fade-in flex-grow-1">
                                <div className="card bg-light mb-3 border-0">
                                    <div className="card-body">
                                        <h5 className="fw-bold">{wizardData.name}</h5>
                                        <div className="d-flex gap-3 text-muted small mt-2">
                                            <span className="badge bg-white text-dark border"><FiTag className="me-1" /> {wizardData.channel}</span>
                                            <span className="badge bg-white text-dark border"><FiCheck className="me-1" /> {wizardData.objective}</span>
                                            <span className="badge bg-white text-dark border"><FiDollarSign className="me-1" /> ${wizardData.budget}</span>
                                        </div>
                                        <hr className="my-3" />
                                        <div className="row small">
                                            <div className="col-6">
                                                <strong>Details:</strong><br />
                                                {wizardData.channel === 'Email' ? (
                                                    <>Subject: {wizardData.subjectLine}</>
                                                ) : (
                                                    <><span className="text-break">Link: {wizardData.content}</span><br />
                                                        Tracking: {wizardData.utmSource} / {wizardData.utmMedium}</>
                                                )}
                                            </div>
                                            <div className="col-6">
                                                <strong>Target:</strong><br />
                                                {wizardData.audienceSegment} Audience<br />
                                                {wizardData.startDate} to {wizardData.endDate}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="alert alert-secondary small d-flex align-items-center">
                                    <FiPause className="me-2 fs-4" />
                                    <div>
                                        <strong>Ready for Approval?</strong><br />
                                        Submitting will send this campaign to the Marketing Manager for review. It will not go live immediately.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ACTIONS */}
                        <div className="mt-auto pt-3 border-top d-flex justify-content-between">
                            <button className="btn btn-outline-secondary" onClick={() => {
                                if (wizardStep > 1) setWizardStep(wizardStep - 1);
                                else setShowCreateModal(false);
                            }}>
                                {wizardStep === 1 ? 'Cancel' : 'Back'}
                            </button>
                            <div className="d-flex gap-2">
                                {wizardStep === 4 && (
                                    <button className="btn btn-outline-dark" onClick={() => handleCreateSubmit(true)}>
                                        Save as Draft
                                    </button>
                                )}
                                <button className="btn btn-primary px-4 fw-bold" onClick={() => {
                                    if (wizardStep < 4) setWizardStep(wizardStep + 1);
                                    else handleCreateSubmit(false); // False = Submit for Approval
                                }}>
                                    {wizardStep === 4 ? 'Submit for Approval' : 'Next Step'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: SUMMARY & STEPS */}
                    <div className="p-4 bg-light d-none d-md-flex flex-column" style={{ flex: '1', borderLeft: '1px solid #e0e0e0' }}>
                        <h6 className="fw-bold mb-3">Steps Required to Launch</h6>
                        <div className="steps-tracker">
                            {steps.map((s, idx) => {
                                const isCompleted = wizardStep > s.id;
                                const isActive = wizardStep === s.id;
                                return (
                                    <div key={s.id} className={`d-flex align-items-center mb-3 ${isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted'}`}>
                                        <div
                                            className={`rounded-circle d-flex align-items-center justify-content-center me-2 ${isActive ? 'bg-primary text-white' : isCompleted ? 'bg-success text-white' : 'bg-white border'}`}
                                            style={{ width: '24px', height: '24px', fontSize: '12px' }}
                                        >
                                            {isCompleted ? <FiCheck /> : s.id}
                                        </div>
                                        <small className={`fw-bold ${isActive ? '' : 'fw-normal'}`}>{s.label}</small>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-auto bg-white p-3 rounded shadow-sm border">
                            <div className="text-center mb-2">
                                <span className="badge bg-warning text-dark">DRAFT MODE</span>
                            </div>
                            <small className="text-muted d-block text-center mb-2">
                                You can save your progress at any time.
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="campaigns-container">
            {/* Using a wrapper div to ensure valid JSX return structure */}
            {/* FILTERS & HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    {/* Basic Filter UI if FilterBar not available/complex, or usage here */}
                    <div className="btn-group">
                        {['Active', 'Pending Approval', 'Draft', 'Completed'].map(status => (
                            <button
                                key={status}
                                className={`btn btn-sm ${filters.status === status ? 'btn-dark' : 'btn-outline-secondary'}`}
                                onClick={() => setFilters({ ...filters, status: filters.status === status ? null : status })}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                {!isManager && (
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        <FiPlus className="me-2" /> Create Campaign
                    </button>
                )}
            </div>

            <div className="table-responsive bg-white rounded shadow-sm border">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Campaign Name</th>
                            <th>Channel</th>
                            {isManager && <th>Created By</th>}
                            <th>Status</th>
                            {!isManager && <th>Budget</th>}
                            <th className="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedCampaigns.length > 0 ? displayedCampaigns.map(c => (
                            <tr key={c.id}>
                                <td className="ps-4">
                                    <div className="fw-bold text-dark">{c.name}</div>
                                    <small className="text-muted">{c.objective}</small>
                                </td>
                                <td><span className="badge bg-light text-dark border">{c.channel}</span></td>

                                {isManager && (
                                    <td>
                                        <small className="text-muted">
                                            {c.createdByRole || 'User'} #{c.createdBy || '?'}
                                        </small>
                                    </td>
                                )}

                                <td>
                                    <span className={`badge ${c.status === 'Active' ? 'bg-success' :
                                        c.status === 'Pending Approval' ? 'bg-warning text-dark' :
                                            c.status === 'Draft' ? 'bg-secondary' :
                                                'bg-light text-dark border'
                                        }`}>
                                        {c.status}
                                    </span>
                                </td>

                                {!isManager && <td>${(c.budget || 0).toLocaleString()}</td>}

                                <td className="text-end pe-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        {isManager ? (
                                            <>
                                                {c.status === 'Pending Approval' && (
                                                    <button className="btn btn-sm btn-outline-success" onClick={() => handleStatusChange(c.id, 'Active')} title="Approve">
                                                        <FiCheck />
                                                    </button>
                                                )}
                                                {c.status === 'Active' && (
                                                    <button className="btn btn-sm btn-outline-warning" onClick={() => handleStatusChange(c.id, 'Paused')} title="Pause">
                                                        <FiPause />
                                                    </button>
                                                )}
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleStatusChange(c.id, 'Archived')} title="Archive">
                                                    <FiArchive />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {c.status === 'Draft' && (
                                                    <button className="btn btn-sm btn-outline-primary" title="Edit">
                                                        <FiEdit />
                                                    </button>
                                                )}
                                                <button className="btn btn-sm btn-outline-info" title="View">
                                                    <FiEye />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center py-5 text-muted">
                                    No campaigns found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Render Wizard */}
            {showCreateModal && renderWizard()}
        </div>
    );
};

export default Campaigns;
