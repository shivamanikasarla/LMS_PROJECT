import React, { useState, useEffect } from 'react';
import { EXAM_TEMPLATES } from '../data/constants';
import { toast } from 'react-toastify';

const SetupMode = ({ onComplete, initialData }) => {
    // Phases: 'selection' | 'configuration'
    // Phases: 'selection' | 'configuration'
    const [phase, setPhase] = useState(initialData ? 'configuration' : 'selection');
    const [activeTab, setActiveTab] = useState('details');

    // Configuration State
    const [config, setConfig] = useState({
        title: '',
        course: '',
        type: 'mixed',
        totalMarks: 100,
        duration: 60,
        instructions: '',
        ...initialData
    });

    const [assets, setAssets] = useState({
        logo: null,
        bgImage: null,
        watermark: null,
        watermarkOpacity: 0.1,
        ...initialData?.customAssets
    });

    const [settings, setSettings] = useState({
        maxAttempts: 1,
        gradingStrategy: 'highest',
        cooldownPeriod: 0,

        // Settings
        negativeMarking: false,
        negativeMarkingPenalty: 0.25,
        autoSubmit: true,
        shuffleQuestions: false,
        shuffleOptions: false,
        allowResume: true,
        allowReattempt: false,
        allowLateEntry: false,
        lateEntryWindow: 15,

        // Grading
        autoEvaluation: true,
        partialMarking: false,

        // Results
        showResults: true,
        resultView: 'score',
        showRank: false,
        showPercentile: false,

        // Notifications
        scheduledNotification: false,
        examReminder: 0,
        collectFeedback: false,

        // Accessibility
        screenReader: false,

        ...initialData?.settings
    });

    const [proctoring, setProctoring] = useState({
        enabled: false,
        cameraRequired: false,
        microphoneRequired: false,
        cameraMonitoring: false,
        maxViolations: 5,
        maxTabSwitches: 2,
        blockOnTabSwitch: true,
        forceFullScreen: false,
        disableCopyPaste: false,
        deviceRestriction: 'any',
        ...initialData?.proctoring
    });

    const [logoError, setLogoError] = useState(false);

    // Initial Data Load (if editing)
    useEffect(() => {
        if (initialData) {
            setConfig({
                title: initialData.title || '',
                course: initialData.course || '',
                type: initialData.type || 'mixed',
                totalMarks: initialData.targetMarks || 100,
                duration: initialData.duration || 60
            });
            if (initialData.customAssets) {
                setAssets({
                    bgImage: initialData.customAssets.bgImage,
                    watermark: initialData.customAssets.watermark,
                    watermarkOpacity: initialData.customAssets.watermarkOpacity ?? 0.1,
                    orientation: initialData.customAssets.orientation ?? 'portrait'
                });
            }
        } else {
            // Load Global Defaults for NEW exam
            const globalSettings = localStorage.getItem('exam_global_settings');
            if (globalSettings) {
                const parsed = JSON.parse(globalSettings);
                if (parsed.defaults) {
                    setConfig(prev => ({
                        ...prev,
                        duration: parsed.defaults.duration || 60,
                        totalMarks: parsed.defaults.totalMarks || 100
                    }));
                }

                if (parsed.visuals) {
                    setAssets(prev => ({
                        ...prev,
                        bgImage: parsed.visuals.bgImage || null,
                        watermark: parsed.visuals.watermarkType === 'text' ? parsed.visuals.watermarkText : (parsed.visuals.watermarkType === 'image' ? parsed.visuals.watermarkImage : null),
                        watermarkOpacity: parsed.visuals.watermarkOpacity ?? 0.1,
                        orientation: parsed.visuals.orientation || 'portrait'
                    }));
                }

                // Load global grading & attempts into local state
                setSettings({
                    maxAttempts: parsed.attemptRules?.maxAttempts || 1,
                    gradingStrategy: parsed.attemptRules?.evaluationStrategy || 'highest',
                    showResults: parsed.grading?.resultVisibility === 'immediate'
                });

                if (parsed.proctoring && parsed.proctoring.defaultEnabled) {
                    setProctoring({
                        enabled: true,
                        noiseDetection: parsed.proctoring.noiseDetection || false,
                        screenMonitoring: parsed.proctoring.screenMonitoring || false,
                        fullScreen: parsed.proctoring.fullScreen || false,
                        autoRedirect: parsed.proctoring.autoRedirect || false
                    });
                }
            }
        }
        if (initialData) {
            if (initialData.settings) {
                setSettings({
                    maxAttempts: initialData.settings.maxAttempts || 1,
                    gradingStrategy: initialData.settings.gradingStrategy || 'highest',
                    showResults: initialData.settings.showResults !== false
                });
            }
            if (initialData.proctoring) {
                setProctoring({
                    enabled: initialData.proctoring.enabled || false,
                    noiseDetection: initialData.proctoring.noiseDetection || false,
                    screenMonitoring: initialData.proctoring.screenMonitoring || false,
                    fullScreen: initialData.proctoring.fullScreen || false,
                    autoRedirect: initialData.proctoring.autoRedirect || false
                });
            }
        }
    }, [initialData]);

    const handleSelection = (choice, template = null) => {
        if (choice === 'template' && template) {
            setConfig(prev => ({
                ...prev,
                title: template.title,
                course: template.course,
                type: template.questions.some(q => q.type === 'coding') ? 'coding' : 'mixed',
                // Keep default marks/duration or infer from template if added to data
            }));
            // Pass questions up via onComplete, but here just set Config phase
        } else if (choice === 'blank') {
            setConfig(prev => ({ ...prev, type: template })); // template is 'mixed'/'coding' string here
        }
        setPhase('configuration');
    };

    const handleAssetChange = (key, value) => {
        setAssets(prev => ({ ...prev, [key]: value }));
    };

    const handleFileChange = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                handleAssetChange(key, ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateAndContinue = () => {
        if (!config.title.trim() || !config.course.trim()) {
            toast.error("Please enter Exam Title and Course.");
            return;
        }
        onComplete({
            ...config,
            customAssets: assets,
            settings,
            proctoring
        });
    };

    if (phase === 'selection') {
        return (
            <div className="container py-5 animate-fade-in">
                <div className="text-center mb-5">
                    <h1 className="fw-bold display-6">Create New Exam</h1>
                    <p className="text-muted">Select a starting point for your assessment.</p>
                </div>

                <div className="row g-4 justify-content-center">
                    {/* Blank */}
                    <div className="col-md-5 col-lg-4">
                        <div className="card h-100 border-0 shadow-sm hover-lift cursor-pointer" onClick={() => handleSelection('blank', 'mixed')}>
                            <div className="card-body p-4 text-center d-flex flex-column justify-content-center align-items-center">
                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-3">
                                    <i className="bi bi-file-earmark-plus fs-1"></i>
                                </div>
                                <h5 className="fw-bold">Start from Scratch</h5>
                                <p className="text-muted small">Empty paper. You add the questions.</p>
                            </div>
                        </div>
                    </div>

                    {/* Templates */}
                    <div className="col-md-5 col-lg-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-header bg-white border-0 pt-4 pb-0 text-center">
                                <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex p-3 mb-2">
                                    <i className="bi bi-grid-1x2 fs-1"></i>
                                </div>
                                <h5 className="fw-bold">Use a Template</h5>
                            </div>
                            <div className="card-body p-3">
                                <div className="d-flex flex-column gap-2">
                                    {EXAM_TEMPLATES.map(t => (
                                        <button key={t.id} className="btn btn-light btn-sm text-start" onClick={() => handleSelection('template', t)}>
                                            <i className="bi bi-chevron-right me-2 text-muted"></i>{t.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4 animate-fade-in" style={{ maxWidth: '800px' }}>
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="card-header bg-white border-bottom p-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="fw-bold mb-1">Exam Configuration</h4>
                            <p className="text-muted small mb-0">Set up the details and design of your paper.</p>
                        </div>
                        {!initialData && (
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => setPhase('selection')}>
                                <i className="bi bi-arrow-left me-1"></i> Back
                            </button>
                        )}
                    </div>
                </div>

                <div className="card-body p-4 p-md-5">
                    {/* TABS HEADER */}
                    <div className="mb-4 text-center">
                        <div className="btn-group p-1 bg-light rounded-pill border shadow-sm" role="group">
                            {['details', 'design', 'settings', 'proctoring', 'grading', 'notify'].map(tab => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${activeTab === tab ? 'btn-white shadow-sm text-primary' : 'text-muted border-0'}`}
                                    style={{ minWidth: 100 }}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="tab-content animate-fade-in">
                        {/* 1. DETAILS TAB */}
                        {activeTab === 'details' && (
                            <div className="row g-4">
                                <div className="col-12 text-center mb-2">
                                    <h6 className="fw-bold text-muted text-uppercase small ls-1">Basic Configuration</h6>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-label small fw-bold">Exam Title <span className="text-danger">*</span></label>
                                    <input className="form-control form-control-lg" value={config.title} onChange={(e) => setConfig({ ...config, title: e.target.value })} placeholder="e.g. Final Semester Assessment" autoFocus />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label small fw-bold">Type</label>
                                    <select className="form-select form-select-lg" value={config.type} onChange={(e) => setConfig({ ...config, type: e.target.value })}>
                                        <option value="mixed">Mixed</option>
                                        <option value="quiz">Quiz (MCQ)</option>
                                        <option value="coding">Coding</option>
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label small fw-bold">Course / Subject <span className="text-danger">*</span></label>
                                    <input className="form-control" value={config.course} onChange={(e) => setConfig({ ...config, course: e.target.value })} placeholder="e.g. Computer Science 101" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Duration (Minutes)</label>
                                    <input type="number" className="form-control" value={config.duration} onChange={(e) => setConfig({ ...config, duration: e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Total Marks</label>
                                    <input type="number" className="form-control" value={config.totalMarks} onChange={(e) => setConfig({ ...config, totalMarks: e.target.value })} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Instructions for Students</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="Enter specific instructions for this exam (e.g. 'All questions are compulsory', 'Use of calculator is allowed')..."
                                        value={config.instructions || ''}
                                        onChange={(e) => setConfig({ ...config, instructions: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* 2. DESIGN TAB */}
                        {activeTab === 'design' && (
                            <div className="row g-4">
                                {/* Orientation */}
                                <div className="col-12 text-center mb-2">
                                    <h6 className="fw-bold text-muted text-uppercase small ls-1">Paper Appearance</h6>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Paper Orientation</label>
                                    <div className="d-flex gap-3">
                                        <div
                                            className={`card border-2 p-3 cursor-pointer w-100 text-center transition-all ${assets.orientation === 'portrait' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                            onClick={() => handleAssetChange('orientation', 'portrait')}
                                        >
                                            <i className="bi bi-file-earmark-text fs-2 mb-2 d-block"></i>
                                            <span className="small fw-bold">Portrait</span>
                                        </div>
                                        <div
                                            className={`card border-2 p-3 cursor-pointer w-100 text-center transition-all ${assets.orientation === 'landscape' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                            onClick={() => handleAssetChange('orientation', 'landscape')}
                                        >
                                            <i className="bi bi-file-earmark-spreadsheet fs-2 mb-2 d-block"></i>
                                            <span className="small fw-bold">Landscape</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Logo */}
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Institute Logo</label>
                                    <div className="d-flex gap-3 align-items-center">
                                        {assets.logo && (
                                            <img src={assets.logo} alt="logo" className="rounded border shadow-sm" style={{ width: 60, height: 60, objectFit: 'contain' }} />
                                        )}
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'logo')}
                                        />
                                    </div>
                                    <div className="form-text small">Displayed at the top of the exam paper.</div>
                                </div>

                                {/* Background Image */}
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Background Image</label>
                                    <div className="d-flex gap-3 align-items-center">
                                        {assets.bgImage && (
                                            <img src={assets.bgImage} alt="bg" className="rounded border shadow-sm" style={{ width: 60, height: 80, objectFit: 'cover' }} />
                                        )}
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'bgImage')}
                                        />
                                    </div>
                                    <div className="form-text small">Optional. Used as paper texture or pattern.</div>
                                </div>

                                {/* Watermark */}
                                <div className="col-12">
                                    <div className="card h-100 bg-light border-0">
                                        <div className="card-body">
                                            <h6 className="fw-bold mb-3">Watermark Settings</h6>
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <label className="small fw-bold mb-2">Watermark Type</label>
                                                    <select
                                                        className="form-select"
                                                        value={typeof assets.watermark === 'string' && !assets.watermark.startsWith('data:') ? 'text' : 'image'}
                                                        onChange={(e) => handleAssetChange('watermark', e.target.value === 'text' ? 'CONFIDENTIAL' : null)}
                                                    >
                                                        <option value="text">Text Watermark</option>
                                                        <option value="image">Image Watermark</option>
                                                    </select>
                                                </div>

                                                {(typeof assets.watermark === 'string' && !assets.watermark.startsWith('data:')) ? (
                                                    <div className="col-md-8">
                                                        <label className="small fw-bold mb-2">Watermark Text</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={assets.watermark || ''}
                                                            onChange={(e) => handleAssetChange('watermark', e.target.value)}
                                                            placeholder="e.g. DRAFT"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="col-md-8">
                                                        <label className="small fw-bold mb-2">Upload Watermark</label>
                                                        <div className="d-flex gap-3 align-items-center">
                                                            {assets.watermark && assets.watermark.startsWith('data:') && (
                                                                <img src={assets.watermark} alt="wm" className="rounded border" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                                                            )}
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                accept="image/*"
                                                                onChange={(e) => handleFileChange(e, 'watermark')}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="col-12">
                                                    <label className="small fw-bold mb-1">Opacity: {Math.round(assets.watermarkOpacity * 100)}%</label>
                                                    <input
                                                        type="range"
                                                        className="form-range"
                                                        min="0.05"
                                                        max="0.5"
                                                        step="0.05"
                                                        value={assets.watermarkOpacity}
                                                        onChange={(e) => handleAssetChange('watermarkOpacity', parseFloat(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. SETTINGS TAB */}
                        {activeTab === 'settings' && (
                            <div className="row g-4">
                                {/* A. Negative Marking */}
                                <div className="col-md-6">
                                    <div className="card h-100 bg-secondary bg-opacity-10 border-0">
                                        <div className="card-body">
                                            <div className="form-check form-switch mb-2">
                                                <input className="form-check-input" type="checkbox" checked={settings.negativeMarking} onChange={e => setSettings({ ...settings, negativeMarking: e.target.checked })} />
                                                <label className="form-check-label fw-bold">Negative Marking</label>
                                            </div>
                                            {settings.negativeMarking && (
                                                <div className="mt-2 animate-slide-down">
                                                    <label className="small text-muted mb-1">Deduction per wrong answer</label>
                                                    <input type="number" step="0.25" className="form-control form-control-sm" value={settings.negativeMarkingPenalty} onChange={(e) => setSettings({ ...settings, negativeMarkingPenalty: parseFloat(e.target.value) })} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* B. Auto Submit */}
                                <div className="col-md-6">
                                    <div className="card h-100 bg-light border-0">
                                        <div className="card-body d-flex align-items-center">
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={settings.autoSubmit} onChange={e => setSettings({ ...settings, autoSubmit: e.target.checked })} />
                                                <label className="form-check-label fw-bold">Auto Submit on Time Expiry</label>
                                                <div className="small text-muted mt-1">Automatically submits when timer hits 00:00</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* C. Shuffle */}
                                <div className="col-md-6">
                                    <div className="card h-100 bg-light border-0">
                                        <div className="card-body">
                                            <label className="fw-bold mb-3 d-block">Shuffling</label>
                                            <div className="form-check form-switch mb-2">
                                                <input className="form-check-input" type="checkbox" checked={settings.shuffleQuestions} onChange={e => setSettings({ ...settings, shuffleQuestions: e.target.checked })} />
                                                <label className="form-check-label">Shuffle Questions</label>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={settings.shuffleOptions} onChange={e => setSettings({ ...settings, shuffleOptions: e.target.checked })} />
                                                <label className="form-check-label">Shuffle Options</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* D & E. Resume & Reattempt */}
                                <div className="col-md-6">
                                    <div className="card h-100 bg-light border-0">
                                        <div className="card-body">
                                            <div className="form-check form-switch mb-3">
                                                <input className="form-check-input" type="checkbox" checked={settings.allowResume} onChange={e => setSettings({ ...settings, allowResume: e.target.checked })} />
                                                <label className="form-check-label fw-bold">Allow Resume</label>
                                                <div className="small text-muted">Students can continue after refresh</div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={settings.allowReattempt} onChange={e => setSettings({ ...settings, allowReattempt: e.target.checked })} />
                                                <label className="form-check-label fw-bold">Allow Reattempt</label>
                                            </div>
                                            {settings.allowReattempt && (
                                                <div className="mt-2 animate-slide-down">
                                                    <label className="small text-muted mb-1">Max Attempts</label>
                                                    <input type="number" className="form-control form-control-sm" value={settings.maxAttempts} onChange={(e) => setSettings({ ...settings, maxAttempts: e.target.value })} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* F. Late Entry */}
                                <div className="col-12">
                                    <div className="card bg-warning bg-opacity-10 border-0">
                                        <div className="card-body d-flex align-items-center justify-content-between">
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={settings.allowLateEntry} onChange={e => setSettings({ ...settings, allowLateEntry: e.target.checked })} />
                                                <label className="form-check-label fw-bold">Allow Late Entry</label>
                                            </div>
                                            {settings.allowLateEntry && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="small text-muted text-nowrap">Window (mins):</span>
                                                    <input type="number" className="form-control form-control-sm" style={{ width: 80 }} value={settings.lateEntryWindow} onChange={(e) => setSettings({ ...settings, lateEntryWindow: e.target.value })} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. PROCTORING TAB */}
                        {activeTab === 'proctoring' && (
                            <div className="row g-4">
                                <div className="col-12 mb-2">
                                    <div className="form-check form-switch custom-switch-lg">
                                        <input className="form-check-input" type="checkbox" checked={proctoring.enabled} onChange={e => setProctoring({ ...proctoring, enabled: e.target.checked })} />
                                        <label className="form-check-label fw-bold h5 mb-0">Enable Proctoring System</label>
                                    </div>
                                </div>

                                {proctoring.enabled && (
                                    <>
                                        {/* A & B. Hardware */}
                                        <div className="col-md-6">
                                            <div className="card h-100 border-danger border-opacity-25 bg-danger bg-opacity-10">
                                                <div className="card-body">
                                                    <h6 className="fw-bold text-danger mb-3"><i className="bi bi-camera-video me-2"></i>Hardware Access</h6>
                                                    <div className="form-check form-switch mb-2">
                                                        <input className="form-check-input" type="checkbox" checked={proctoring.cameraRequired} onChange={e => setProctoring({ ...proctoring, cameraRequired: e.target.checked })} />
                                                        <label className="form-check-label">Camera Required</label>
                                                    </div>
                                                    <div className="form-check form-switch mb-2">
                                                        <input className="form-check-input" type="checkbox" checked={proctoring.microphoneRequired} onChange={e => setProctoring({ ...proctoring, microphoneRequired: e.target.checked })} />
                                                        <label className="form-check-label">Microphone Required</label>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input className="form-check-input" type="checkbox" checked={proctoring.cameraMonitoring} onChange={e => setProctoring({ ...proctoring, cameraMonitoring: e.target.checked })} />
                                                        <label className="form-check-label">Continuous Monitoring (10s interval)</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* D & E. Violations */}
                                        <div className="col-md-6">
                                            <div className="card h-100 border-warning border-opacity-25 bg-warning bg-opacity-10">
                                                <div className="card-body">
                                                    <h6 className="fw-bold text-dark mb-3"><i className="bi bi-exclamation-triangle me-2"></i>Violations & Limits</h6>
                                                    <div className="mb-3">
                                                        <label className="small fw-bold">Max Violations (Auto Block)</label>
                                                        <input type="number" className="form-control form-control-sm" value={proctoring.maxViolations} onChange={(e) => setProctoring({ ...proctoring, maxViolations: e.target.value })} />
                                                        <small className="text-muted x-small">Exam will lock after {proctoring.maxViolations} warnings</small>
                                                    </div>
                                                    <div>
                                                        <label className="small fw-bold">Max Tab Switches</label>
                                                        <div className="input-group input-group-sm">
                                                            <input type="number" className="form-control" value={proctoring.maxTabSwitches} onChange={(e) => setProctoring({ ...proctoring, maxTabSwitches: e.target.value })} />
                                                            <div className="input-group-text bg-white">
                                                                <input className="form-check-input mt-0 me-2" type="checkbox" checked={proctoring.blockOnTabSwitch} onChange={e => setProctoring({ ...proctoring, blockOnTabSwitch: e.target.checked })} />
                                                                Auto Submit
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* F, G, H. Environment */}
                                        <div className="col-12">
                                            <div className="card bg-light border-0">
                                                <div className="card-body">
                                                    <h6 className="fw-bold mb-3">Environment Security</h6>
                                                    <div className="row g-3">
                                                        <div className="col-md-4">
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" checked={proctoring.forceFullScreen} onChange={e => setProctoring({ ...proctoring, forceFullScreen: e.target.checked })} />
                                                                <label className="form-check-label">Force Full Screen</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" checked={proctoring.disableCopyPaste} onChange={e => setProctoring({ ...proctoring, disableCopyPaste: e.target.checked })} />
                                                                <label className="form-check-label">Disable Copy/Paste</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 d-flex align-items-center gap-2">
                                                            <label className="small fw-bold text-nowrap">Device:</label>
                                                            <select className="form-select form-select-sm" value={proctoring.deviceRestriction} onChange={(e) => setProctoring({ ...proctoring, deviceRestriction: e.target.value })}>
                                                                <option value="any">Any Device</option>
                                                                <option value="desktop">Desktop / Laptop Only</option>
                                                                <option value="mobile">Mobile Only</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* 4. GRADING & RESULTS TAB */}
                        {activeTab === 'grading' && (
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <h6 className="fw-bold text-uppercase text-muted small ls-1 mb-3">Evaluation</h6>
                                    <div className="card bg-light border-0">
                                        <div className="card-body">
                                            <div className="form-check form-switch mb-3">
                                                <input className="form-check-input" type="checkbox" checked={settings.autoEvaluation} onChange={e => setSettings({ ...settings, autoEvaluation: e.target.checked })} />
                                                <label className="form-check-label fw-bold">Auto Evaluation</label>
                                                <div className="small text-muted">For MCQs and objective answers</div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={settings.partialMarking} onChange={e => setSettings({ ...settings, partialMarking: e.target.checked })} />
                                                <label className="form-check-label fw-bold">Partial Marking</label>
                                                <div className="small text-muted">Award marks for partially correct answers</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <h6 className="fw-bold text-uppercase text-muted small ls-1 mb-3">Results Display</h6>
                                    <div className="card bg-light border-0">
                                        <div className="card-body">
                                            <div className="form-check form-switch mb-3">
                                                <input className="form-check-input" type="checkbox" checked={settings.showResults} onChange={e => setSettings({ ...settings, showResults: e.target.checked })} />
                                                <label className="form-check-label fw-bold">Show Result Instantly</label>
                                            </div>

                                            {settings.showResults && (
                                                <div className="mb-3">
                                                    <label className="small fw-bold mb-2">Analysis Level</label>
                                                    <div className="btn-group w-100" role="group">
                                                        <input type="radio" className="btn-check" name="resView" id="rv1" checked={settings.resultView === 'score'} onChange={() => setSettings({ ...settings, resultView: 'score' })} />
                                                        <label className="btn btn-outline-primary btn-sm" htmlFor="rv1">Score Only</label>

                                                        <input type="radio" className="btn-check" name="resView" id="rv2" checked={settings.resultView === 'score_correct'} onChange={() => setSettings({ ...settings, resultView: 'score_correct' })} />
                                                        <label className="btn btn-outline-primary btn-sm" htmlFor="rv2">+ Answers</label>

                                                        <input type="radio" className="btn-check" name="resView" id="rv3" checked={settings.resultView === 'full'} onChange={() => setSettings({ ...settings, resultView: 'full' })} />
                                                        <label className="btn btn-outline-primary btn-sm" htmlFor="rv3">Full Review</label>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="d-flex gap-3 mt-3">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" checked={settings.showRank} onChange={e => setSettings({ ...settings, showRank: e.target.checked })} />
                                                    <label className="form-check-label text-muted small">Show Rank</label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" checked={settings.showPercentile} onChange={e => setSettings({ ...settings, showPercentile: e.target.checked })} />
                                                    <label className="form-check-label text-muted small">Show Percentile</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. NOTIFICATIONS & ACCESS TAB */}
                        {activeTab === 'notify' && (
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="card h-100 bg-info bg-opacity-10 border-0">
                                        <div className="card-body">
                                            <h6 className="fw-bold text-dark mb-3"><i className="bi bi-bell me-2"></i>Notifications</h6>
                                            <div className="form-check form-switch mb-3">
                                                <input className="form-check-input" type="checkbox" checked={settings.scheduledNotification} onChange={e => setSettings({ ...settings, scheduledNotification: e.target.checked })} />
                                                <label className="form-check-label">Send Scheduled Notification</label>
                                            </div>
                                            <div className="mb-3">
                                                <label className="small fw-bold">Reminder Before Exam</label>
                                                <select className="form-select form-select-sm" value={settings.examReminder} onChange={(e) => setSettings({ ...settings, examReminder: parseInt(e.target.value) })}>
                                                    <option value={0}>No Reminder</option>
                                                    <option value={15}>15 Minutes Before</option>
                                                    <option value={60}>1 Hour Before</option>
                                                    <option value={1440}>24 Hours Before</option>
                                                </select>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={settings.collectFeedback} onChange={e => setSettings({ ...settings, collectFeedback: e.target.checked })} />
                                                <label className="form-check-label">Collect Feedback after Exam</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card h-100 bg-light border-0">
                                        <div className="card-body">
                                            <h6 className="fw-bold text-dark mb-3"><i className="bi bi-person-wheelchair me-2"></i>Accessibility</h6>
                                            <p className="small text-muted mb-3">
                                                Ensure your exam is accessible to all students.
                                            </p>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={settings.screenReader} onChange={e => setSettings({ ...settings, screenReader: e.target.checked })} />
                                                <label className="form-check-label fw-bold">Screen Reader Optimization</label>
                                                <div className="small text-muted mt-1">Enables ARIA labels and simplified navigation structure.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>



                    <div className="d-flex justify-content-end pt-3">
                        <button className="btn btn-primary px-5 fw-bold shadow-sm rounded-pill" onClick={validateAndContinue}>
                            Continue to Editor <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                    </div>

                </div >
            </div >
        </div >
    );
};

export default SetupMode;
