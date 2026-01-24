import React, { useState } from 'react';
import {
    Save,
    ShieldAlert,
    Calendar,
    Lock,
    FileBadge,
    QrCode,
    AlertTriangle,
    Bell,
    Eye,
    Check
} from 'lucide-react';

/* ---------------- HELPERS ---------------- */

const clamp = (val, min, max) =>
    Math.min(Math.max(Number(val), min), max);

/* ---------------- SUB-COMPONENTS ---------------- */

const SectionCard = ({ title, icon: Icon, children, description }) => (
    <div className="col-md-6 col-xl-4 d-flex">
        <div className="card shadow-sm border-0 w-100 overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom-0">
                <div className="d-flex align-items-center gap-2 mb-1">
                    <div className="p-2 bg-primary bg-opacity-10 rounded-circle text-primary">
                        <Icon size={18} />
                    </div>
                    <h6 className="mb-0 fw-bold text-dark">{title}</h6>
                </div>
                {description && <div className="text-muted small ps-1">{description}</div>}
            </div>
            <div className="card-body pt-0">
                <div className="d-flex flex-column gap-3">
                    {children}
                </div>
            </div>
        </div>
    </div>
);

const ToggleInput = ({ label, value, onToggle, helpText }) => (
    <div className="form-check form-switch d-flex justify-content-between ps-0 align-items-center mb-1">
        <div>
            <label className="form-check-label fw-medium text-dark small mb-0" onClick={onToggle}>
                {label}
            </label>
            {helpText && <div className="text-muted" style={{ fontSize: '0.75rem' }}>{helpText}</div>}
        </div>
        <input
            className="form-check-input ms-3 cursor-pointer"
            type="checkbox"
            checked={value}
            onChange={onToggle}
            style={{ width: '2.5rem', height: '1.25rem' }}
        />
    </div>
);

const NumberInput = ({ label, value, onChange, min, max, suffix }) => (
    <div className="mb-1">
        <label className="form-label small fw-medium text-secondary mb-1">{label}</label>
        <div className="input-group input-group-sm">
            <input
                type="number"
                className="form-control"
                value={value}
                min={min}
                max={max}
                onChange={e => onChange(e.target.value)}
            />
            {suffix && <span className="input-group-text bg-light">{suffix}</span>}
        </div>
    </div>
);

const RangeInput = ({ label, value, onChange, min = 0, max = 100 }) => (
    <div className="mb-1">
        <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label small fw-medium text-secondary mb-0">{label}</label>
            <span className={`badge ${value > 80 ? 'bg-success' : value > 50 ? 'bg-warning' : 'bg-danger'}`}>
                {value}%
            </span>
        </div>
        <input
            type="range"
            className="form-range"
            min={min}
            max={max}
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    </div>
);

const SelectInput = ({ label, value, options, onChange }) => (
    <div className="mb-1">
        <label className="form-label small fw-medium text-secondary mb-1">{label}</label>
        <select
            className="form-select form-select-sm"
            value={value}
            onChange={e => onChange(e.target.value)}
        >
            {options.map(o => (
                <option key={o} value={o}>
                    {o.replace(/_/g, ' ')}
                </option>
            ))}
        </select>
    </div>
);

/* ---------------- MAIN COMPONENT ---------------- */

const AttendanceSettings = () => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [settings, setSettings] = useState({
        /* -------- Academic Rules -------- */
        academic: {
            examEligibilityPercent: 75,
            warningThresholdPercent: 60
        },

        /* -------- Attendance Rules -------- */
        attendance: {
            minPresenceMinutes: 30,
            exitEarlyAction: 'MARK_PARTIAL',
            // Advanced
            reverificationInterval: 10,
            statuses: ['PRESENT', 'LATE', 'PARTIAL', 'EXCUSED', 'MEDICAL', 'PROXY_SUSPECTED']
        },

        /* -------- Session Controls -------- */
        session: {
            qrMode: 'ALWAYS',
            gracePeriodMinutes: 15,
            strictStart: true, // ON
            conflictAction: 'FLAG_FOR_REVIEW',
            protocolsEnabled: true
        },

        /* -------- Device & Security -------- */
        security: {
            // Basic
            oneDevicePerSession: true,
            logIpAddress: true,

            // Advanced / Hidden by default
            deviceBinding: false, // Default OFF
            logDeviceFingerprint: false, // Default OFF
            geoFencingEnabled: false, // Default OFF
            geoFenceRadiusMeters: 50,
            faceRecognitionEnabled: false, // Privacy fear -> OFF
            wifiRestrictionEnabled: false, // Complaints -> OFF
        },

        /* -------- Exceptions -------- */
        exceptions: {
            cameraFailureAllowed: true,
            networkFailureGraceMinutes: 10,
            emergencyUnlockAllowed: true,
            powerFailureGraceMinutes: 15
        },

        /* -------- Alerts -------- */
        notifications: {
            eligibilityRiskAlert: true,
            consecutiveAbsenceLimit: 3, // Implicit alert
            // Advanced
            notifyParents: false, // Optional -> OFF
            suspiciousActivityAlert: true
        },

        /* -------- Manual Control & Audit -------- */
        audit: {
            manualOverrideAllowed: true,
            overrideReasonMandatory: true,

            // Advanced
            auditLogEnabled: false, // "Enable later" -> OFF
            faceDataRetentionDays: 60,
            consentRequired: true,
            dataAccessScope: 'ADMIN_ONLY'
        }
    });

    /* ---------------- GENERIC UPDATERS ---------------- */

    const updateField = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const updateNumber = (section, key, value, min, max) =>
        updateField(section, key, clamp(value, min, max));

    const toggle = (section, key) =>
        updateField(section, key, !settings[section][key]);

    const handleSave = () => {
        console.log('FINAL ATTENDANCE CONFIG', {
            ...settings,
            updatedAt: new Date().toISOString()
        });
        // In a real app, use a toast notification here
        alert('Attendance configuration saved successfully');
    };

    /* ---------------- RENDER ---------------- */

    return (
        <div className="container-fluid p-0 fade-in">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Global Configuration</h4>
                    <p className="text-muted small mb-0">
                        Manage enterprise-grade attendance rules, security protocols, and compliance settings.
                    </p>
                </div>
                <button
                    className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                    onClick={handleSave}
                >
                    <Save size={18} />
                    <span>Save Changes</span>
                </button>
            </div>

            <div className="row g-4">

                {/* 1. Academic Standards */}
                <SectionCard
                    title="Academic Standards"
                    icon={FileBadge}
                    description="Set eligibility criteria and academic thresholds."
                >
                    <RangeInput
                        label="Exam Eligibility Threshold"
                        value={settings.academic.examEligibilityPercent}
                        onChange={v => updateNumber('academic', 'examEligibilityPercent', v, 0, 100)}
                    />
                    <RangeInput
                        label="At-Risk Warning Threshold"
                        value={settings.academic.warningThresholdPercent}
                        onChange={v => updateNumber('academic', 'warningThresholdPercent', v, 0, 100)}
                    />
                </SectionCard>

                {/* 2. Attendance Rules */}
                <SectionCard
                    title="Attendance Rules"
                    icon={Calendar}
                    description="Simple presence logic."
                >
                    <NumberInput
                        label="Minimum Presence for Credit"
                        value={settings.attendance.minPresenceMinutes}
                        suffix="mins"
                        onChange={v => updateNumber('attendance', 'minPresenceMinutes', v, 0, 300)}
                    />
                    <SelectInput
                        label="Action on Early Exit"
                        value={settings.attendance.exitEarlyAction}
                        options={['MARK_PARTIAL', 'MARK_ABSENT']}
                        onChange={v => updateField('attendance', 'exitEarlyAction', v)}
                    />
                </SectionCard>

                {/* 3. Session Controls */}
                <SectionCard
                    title="Session Controls"
                    icon={QrCode}
                    description="Manage class discipline."
                >
                    <SelectInput
                        label="QR Code Mode"
                        value={settings.session.qrMode}
                        options={['ALWAYS', 'START_ONLY', 'START_AND_END']}
                        onChange={v => updateField('session', 'qrMode', v)}
                    />
                    <NumberInput
                        label="Grace Period Duration"
                        value={settings.session.gracePeriodMinutes}
                        suffix="mins"
                        onChange={v => updateNumber('session', 'gracePeriodMinutes', v, 0, 60)}
                    />
                    <ToggleInput
                        label="Strict Start Enforcement"
                        helpText="Students cannot join before start time."
                        value={settings.session.strictStart}
                        onToggle={() => toggle('session', 'strictStart')}
                    />
                </SectionCard>

                {/* 4. Device Security (Basic) */}
                <SectionCard
                    title="Device Security"
                    icon={ShieldAlert}
                    description="Basic misuse prevention."
                >
                    <ToggleInput
                        label="One Device Per Session"
                        value={settings.security.oneDevicePerSession}
                        onToggle={() => toggle('security', 'oneDevicePerSession')}
                    />
                    <ToggleInput
                        label="Log IP Address"
                        value={settings.security.logIpAddress}
                        onToggle={() => toggle('security', 'logIpAddress')}
                    />
                </SectionCard>

                {/* 5. Exceptions */}
                <SectionCard
                    title="Exceptions"
                    icon={AlertTriangle}
                    description="Reduce daily conflicts."
                >
                    <ToggleInput label="Allow Camera Failure" value={settings.exceptions.cameraFailureAllowed} onToggle={() => toggle('exceptions', 'cameraFailureAllowed')} />
                    <NumberInput label="Network Failure Grace" value={settings.exceptions.networkFailureGraceMinutes} suffix="mins"
                        onChange={v => updateNumber('exceptions', 'networkFailureGraceMinutes', v, 0, 60)} />
                    <ToggleInput label="Emergency Unlock" value={settings.exceptions.emergencyUnlockAllowed} onToggle={() => toggle('exceptions', 'emergencyUnlockAllowed')} />
                </SectionCard>

                {/* 6. Alerts */}
                <SectionCard
                    title="Alerts"
                    icon={Bell}
                    description="Early intervention triggers."
                >
                    <ToggleInput label="Eligibility Risk Alert" value={settings.notifications.eligibilityRiskAlert} onToggle={() => toggle('notifications', 'eligibilityRiskAlert')} />
                    <NumberInput label="Consecutive Absence Alert Limit" value={settings.notifications.consecutiveAbsenceLimit} suffix="days"
                        onChange={v => updateNumber('notifications', 'consecutiveAbsenceLimit', v, 1, 10)} />
                </SectionCard>

                {/* 7. Manual Control */}
                <SectionCard
                    title="Manual Control"
                    icon={Lock}
                    description="Admin override powers."
                >
                    <ToggleInput label="Allow Manual Override" value={settings.audit.manualOverrideAllowed} onToggle={() => toggle('audit', 'manualOverrideAllowed')} />
                    <ToggleInput label="Require Reason" value={settings.audit.overrideReasonMandatory} onToggle={() => toggle('audit', 'overrideReasonMandatory')} />
                </SectionCard>

            </div>

            {/* Advanced Settings Toggle */}
            <div className="d-flex justify-content-center my-5">
                <button
                    className={`btn rounded-pill px-4 ${showAdvanced ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
                </button>
            </div>

            {/* Advanced Settings Section */}
            {showAdvanced && (
                <div className="row g-4 fade-in pb-5">
                    <div className="col-12"><hr className="text-secondary opacity-25" /></div>
                    <div className="col-12 mb-2">
                        <h5 className="text-secondary fw-bold">Advanced Enterprise Controls</h5>
                        <p className="text-muted small">Features for mature institutions. Use with caution.</p>
                    </div>

                    {/* Advanced Security */}
                    <SectionCard
                        title="Advanced Security"
                        icon={ShieldAlert}
                        description="Geo-fencing, Biometrics, Network."
                    >
                        <ToggleInput label="Device Binding" value={settings.security.deviceBinding} onToggle={() => toggle('security', 'deviceBinding')} />
                        <ToggleInput label="Geo-Fencing" value={settings.security.geoFencingEnabled} onToggle={() => toggle('security', 'geoFencingEnabled')} />
                        <ToggleInput label="Face Recognition" value={settings.security.faceRecognitionEnabled} onToggle={() => toggle('security', 'faceRecognitionEnabled')} />
                        <ToggleInput label="Wi-Fi Restriction" value={settings.security.wifiRestrictionEnabled} onToggle={() => toggle('security', 'wifiRestrictionEnabled')} />
                        <ToggleInput label="Log Device Fingerprint" value={settings.security.logDeviceFingerprint} onToggle={() => toggle('security', 'logDeviceFingerprint')} />
                    </SectionCard>

                    {/* Advanced Audit & Logs */}
                    <SectionCard
                        title="Audit & Compliance"
                        icon={Lock}
                        description="Data retention and logging."
                    >
                        <ToggleInput label="Audit Logs" value={settings.audit.auditLogEnabled} onToggle={() => toggle('audit', 'auditLogEnabled')} />
                        <ToggleInput label="Parent Notifications" value={settings.notifications.notifyParents} onToggle={() => toggle('notifications', 'notifyParents')} />
                        <ToggleInput label="User Consent Required" value={settings.audit.consentRequired} onToggle={() => toggle('audit', 'consentRequired')} />
                        <NumberInput label="Face Data Retention" value={settings.audit.faceDataRetentionDays} suffix="days"
                            onChange={v => updateNumber('audit', 'faceDataRetentionDays', v, 1, 365)} />
                    </SectionCard>

                    {/* Advanced Attendance Logic */}
                    <SectionCard
                        title="Deep Verification"
                        icon={Eye}
                    >
                        <NumberInput
                            label="Re-verification Interval"
                            value={settings.attendance.reverificationInterval}
                            suffix="mins"
                            onChange={v => updateNumber('attendance', 'reverificationInterval', v, 1, 60)}
                        />
                        <ToggleInput label="Suspicious Activity Alert" value={settings.notifications.suspiciousActivityAlert} onToggle={() => toggle('notifications', 'suspiciousActivityAlert')} />
                    </SectionCard>

                </div>
            )}
        </div>
    );
};

export default AttendanceSettings;