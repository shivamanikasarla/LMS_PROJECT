import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    FiCalendar, FiClock, FiCheckCircle, FiXCircle,
    FiAlertCircle, FiMinusCircle, FiSearch, FiCheckSquare,
    FiXSquare, FiAlertTriangle, FiLock, FiDownload, FiInfo, FiUser, FiUnlock, FiSave, FiSettings, FiSmartphone, FiMapPin, FiCamera, FiBell, FiShield,
    FiWifi, FiWifiOff, FiMaximize, FiRefreshCw, FiActivity
} from 'react-icons/fi';
import { QRCodeCanvas } from 'qrcode.react';
import { MOCK_SESSIONS, MOCK_ATTENDANCE } from '../../../data/mockAttendance';
import { MOCK_USERS } from '../../../data/mockUsers';

const ATTENDANCE_STATUS = {
    PRESENT: 'Present',
    ABSENT: 'Absent',
    LATE: 'Late',
    EXCUSED: 'Excused',
    PENDING: 'Pending'
};

const LEAVE_TYPES = ["Medical", "Personal", "Official", "Other"];
const REMARK_OPTIONS = ["None", "Network Issue", "Late Join", "Device Issue", "Other"];

const AttendanceTab = ({ batchId, showAdvancedControls = false }) => {
    // --- State ---
    const [selectedDate, setSelectedDate] = useState('2026-01-06');
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isSessionLocked, setIsSessionLocked] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [userRole] = useState('Admin'); // Mock Role: 'Admin', 'Instructor', 'Viewer'

    // Advanced / Global State
    const [viewMode, setViewMode] = useState('BATCH'); // 'BATCH' or 'SINGLE'
    const [targetRole, setTargetRole] = useState('Student'); // 'Student', 'Instructor', 'Admin'
    const [targetStudentId, setTargetStudentId] = useState(null);

    // Advanced Settings State (UI Only)
    const [config, setConfig] = useState({
        qrEnabled: false,
        qrExpiry: 15,
        geoFence: false,
        faceId: false,
        autoAlert: true,
        notifyParents: false
    });

    // UI States
    const [bulkActionConfirm, setBulkActionConfirm] = useState(null);
    const [studentSummaryModal, setStudentSummaryModal] = useState(null);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    // --- QR Live Session State ---
    const [qrSession, setQrSession] = useState({
        isActive: false,
        startTime: null,
        expiryTime: null,
        token: null,
        scannedCount: 0
    });
    const [qrTimeLeft, setQrTimeLeft] = useState(0);
    const timerRef = useRef(null);

    // QR Logic: Start Session
    const startQrSession = () => {
        if (!activeSession) return;

        const duration = (config.qrExpiry || 5) * 60 * 1000; // default 5 mins
        const now = Date.now();
        const expiry = now + duration;
        const info = JSON.stringify({
            sessionId: activeSession.id,
            batchId: batchId,
            ts: now,
            validUntil: expiry
        });

        setQrSession({
            isActive: true,
            startTime: now,
            expiryTime: expiry,
            token: btoa(info), // Simple encode
            scannedCount: 0
        });
        setQrTimeLeft(duration / 1000);
    };

    // QR Logic: Timer
    useEffect(() => {
        if (qrSession.isActive && qrSession.expiryTime) {
            timerRef.current = setInterval(() => {
                const left = Math.max(0, Math.ceil((qrSession.expiryTime - Date.now()) / 1000));
                setQrTimeLeft(left);

                if (left <= 0) {
                    clearInterval(timerRef.current);
                    setQrSession(prev => ({ ...prev, isActive: false })); // Auto-close or just show expired
                }
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [qrSession.isActive, qrSession.expiryTime]);

    // QR Logic: Simulate Scan from "Student"
    const simulateStudentScan = (studentId) => {
        if (!qrSession.isActive) return { success: false, msg: "Session Closed" };
        if (Date.now() > qrSession.expiryTime) return { success: false, msg: "QR Expired" };

        const target = attendanceData.find(r => r.studentId === studentId);
        if (!target) return { success: false, msg: "Student Not Found" };

        // QR RULE: "Entry Only" - If already checked in, maybe ignore or update heartbeat
        if (target.checkInTime) return { success: false, msg: "Already Checked In" };

        handleStatusChange(studentId, ATTENDANCE_STATUS.PRESENT); // Mark as initially "In Class"

        // Update Metadata specific to QR (Entry Time + Init Duration)
        setAttendanceData(prev => prev.map(rec =>
            rec.studentId === studentId ? {
                ...rec,
                attendanceMode: 'QR',
                markedBy: 'System (QR)',
                checkInTime: new Date().toISOString(),
                durationMinutes: 0, // Start duration
                status: 'Present' // Initially present, will be validated by duration later
            } : rec
        ));

        setQrSession(prev => ({ ...prev, scannedCount: prev.scannedCount + 1 }));
        return { success: true, msg: `Checked In: ${target.name}` };
    };

    // Live Heartbeat Simulation (Increments duration for 'QR' users)
    useEffect(() => {
        let interval;
        if (qrSession.isActive) {
            interval = setInterval(() => {
                setAttendanceData(prev => prev.map(rec => {
                    if (rec.attendanceMode === 'QR' && rec.checkInTime) {
                        // Simulate heartbeat logic: Increment duration
                        return { ...rec, durationMinutes: (rec.durationMinutes || 0) + 1 };
                    }
                    return rec;
                }));
            }, 2000); // Fast-forward time: 2s = 1 minute simulation (for demo)
        }
        return () => clearInterval(interval);
    }, [qrSession.isActive]);

    const formatTimeLeft = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // --- Derived Data ---
    const sessionsForDate = useMemo(() =>
        MOCK_SESSIONS.filter(s => String(s.batchId) === String(batchId) && s.date === selectedDate),
        [batchId, selectedDate]);

    const activeSession = useMemo(() =>
        sessionsForDate.find(s => s.id === Number(selectedSessionId)),
        [sessionsForDate, selectedSessionId]);

    const allBatchSessions = useMemo(() =>
        MOCK_SESSIONS.filter(s => String(s.batchId) === String(batchId)).sort((a, b) => new Date(b.date) - new Date(a.date)),
        [batchId]
    );

    const targetStudentProfile = useMemo(() =>
        MOCK_USERS.find(u => u.id === targetStudentId),
        [targetStudentId]
    );

    const hasChanges = useMemo(() => {
        return JSON.stringify(attendanceData) !== JSON.stringify(originalData);
    }, [attendanceData, originalData]);

    const isReadOnly = isSessionLocked || userRole === 'Viewer';

    // --- Core Logic: Load Attendance ---
    useEffect(() => {
        if (!activeSession) {
            setAttendanceData([]);
            setOriginalData([]);
            return;
        }

        // 1. Session Locking Rule
        const sessionDateTime = new Date(`${activeSession.date}T${activeSession.time.split(' - ')[0].replace(' AM', ':00').replace(' PM', ':00')}`);
        const now = new Date();
        const hoursDiff = (now - sessionDateTime) / 36e5;
        const locked = hoursDiff > 24 && activeSession.status === 'Completed';
        setIsSessionLocked(locked);

        // 2. Fetch Active Participants (Based on Role if advanced, else Student)
        const roleToFetch = showAdvancedControls ? targetRole : 'Student';
        const activeParticipants = MOCK_USERS.filter(u => u.role === roleToFetch && u.status === 'Active');

        // 3. Merge Data with Mock Metrics
        const mappedData = activeParticipants.map(user => {
            const existingRecord = MOCK_ATTENDANCE.find(
                r => r.sessionId === activeSession.id && r.studentId === user.id
            );

            // Mock Eligibility (Random)
            const mockRate = Math.floor(Math.random() * (100 - 50 + 1) + 50);

            return {
                studentId: user.id,
                name: user.name,
                email: user.email,
                avatar: user.name.charAt(0),
                status: existingRecord ? existingRecord.status : ATTENDANCE_STATUS.PENDING,
                remarks: existingRecord ? existingRecord.remarks || '' : '',
                leaveType: existingRecord?.remarks && LEAVE_TYPES.includes(existingRecord.remarks) ? existingRecord.remarks : 'Medical',
                remarkType: existingRecord && REMARK_OPTIONS.includes(existingRecord.remarks) ? existingRecord.remarks : 'Other',
                markedBy: existingRecord?.markedBy || '-',
                timestamp: existingRecord?.timestamp || '-',
                attendanceMode: existingRecord?.attendanceMode || 'Offline',
                attendanceRate: mockRate
            };
        });

        setAttendanceData(mappedData);
        setOriginalData(mappedData);
    }, [activeSession, batchId, targetRole, showAdvancedControls]);

    // Helpers for Single View
    const getStudentSessionRecord = (sessionId, studentId) => {
        const rec = MOCK_ATTENDANCE.find(r => r.sessionId === sessionId && r.studentId === studentId);
        return rec || { status: ATTENDANCE_STATUS.PENDING, attendanceMode: 'Offline' };
    };

    // --- Handlers ---
    const handleStatusChange = (studentId, newStatus) => {
        if (isReadOnly) return;
        setAttendanceData(prev => prev.map(rec =>
            rec.studentId === studentId
                ? { ...rec, status: newStatus, timestamp: new Date().toISOString(), markedBy: `${userRole} (You)` }
                : rec
        ));
    };

    const handleModeChange = (studentId, mode) => {
        if (isReadOnly) return;
        setAttendanceData(prev => prev.map(rec =>
            rec.studentId === studentId ? { ...rec, attendanceMode: mode } : rec
        ));
    };

    const handleRemarkTypeChange = (studentId, type) => {
        if (isReadOnly) return;
        setAttendanceData(prev => prev.map(rec => {
            if (rec.studentId !== studentId) return rec;
            const newRemark = type === 'Other' ? '' : type;
            return { ...rec, remarkType: type, remarks: newRemark };
        }));
    };

    const handleLeaveTypeChange = (studentId, type) => {
        if (isReadOnly) return;
        setAttendanceData(prev => prev.map(rec => {
            if (rec.studentId !== studentId) return rec;
            return { ...rec, leaveType: type, remarks: type };
        }));
    };

    const handleRemarkTextChange = (studentId, text) => {
        if (isReadOnly) return;
        setAttendanceData(prev => prev.map(rec =>
            rec.studentId === studentId ? { ...rec, remarks: text } : rec
        ));
    };

    const handleBulkAction = (action) => {
        if (isReadOnly) return;
        const status = action === 'Present' ? ATTENDANCE_STATUS.PRESENT : ATTENDANCE_STATUS.ABSENT;
        setAttendanceData(prev => prev.map(rec => ({
            ...rec,
            status: status,
            timestamp: new Date().toISOString(),
            markedBy: `${userRole} (Bulk)`
        })));
        setBulkActionConfirm(null);
    };

    const handleSave = () => {
        setTimeout(() => {
            setOriginalData(attendanceData);
            setShowSaveSuccess(true);
            setTimeout(() => setShowSaveSuccess(false), 3000);
        }, 800);
    };

    // --- Helpers ---
    const getEligibilityBadge = (rate) => {
        if (rate >= 75) return <span className="eligibility-badge eligible" title="Eligible for Exam"><FiCheckCircle /> OK</span>;
        if (rate >= 60) return <span className="eligibility-badge warning" title="Low Attendance"><FiAlertCircle /> Low</span>;
        return <span className="eligibility-badge blocked" title="Not Eligible"><FiXCircle /> Ban</span>;
    };

    const stats = useMemo(() => {
        const total = attendanceData.length;
        if (total === 0) return { present: 0, absent: 0, late: 0, pending: 0, rate: 0, online: 0, offline: 0 };
        const presentRecs = attendanceData.filter(r => r.status === ATTENDANCE_STATUS.PRESENT);
        const present = presentRecs.length;

        const online = attendanceData.filter(r => (r.status === ATTENDANCE_STATUS.PRESENT || r.status === ATTENDANCE_STATUS.LATE) && r.attendanceMode === 'Online').length;
        const offline = attendanceData.filter(r => (r.status === ATTENDANCE_STATUS.PRESENT || r.status === ATTENDANCE_STATUS.LATE) && r.attendanceMode === 'Offline').length;

        const absent = attendanceData.filter(r => r.status === ATTENDANCE_STATUS.ABSENT).length;
        const late = attendanceData.filter(r => r.status === ATTENDANCE_STATUS.LATE).length;
        const pending = attendanceData.filter(r => r.status === ATTENDANCE_STATUS.PENDING).length;
        const effectivePresent = present + (late * 0.5);
        const rate = total > 0 ? Math.round((effectivePresent / total) * 100) : 0;
        return { present, absent, late, pending, rate, online, offline };
    }, [attendanceData]);

    const filteredList = attendanceData.filter(rec =>
        rec.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="attendance-tab">
            {/* Header: Controls */}
            {showAdvancedControls && (
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <h3 className="m-0 text-xl font-bold text-gray-800">Attendance Configuration</h3>
                        <div className="d-flex gap-2">
                            <select
                                className="form-select-modern"
                                value={targetRole}
                                onChange={(e) => {
                                    setTargetRole(e.target.value);
                                    setTargetStudentId(null);
                                    setAttendanceData([]);
                                }}
                                style={{ width: '160px' }}
                            >
                                <option value="Student">Students</option>
                                <option value="Instructor">Instructors</option>
                                <option value="Admin">Admins</option>
                            </select>
                            <select
                                className="form-select-modern"
                                value={viewMode}
                                onChange={(e) => setViewMode(e.target.value)}
                                style={{ width: '200px' }}
                            >
                                <option value="BATCH">Batch View (Session)</option>
                                <option value="SINGLE">Single User View</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* BATCH VIEW (Default or Selected) */}
            {(!showAdvancedControls || viewMode === 'BATCH') && (
                <>
                    {/* 1. Stepper / Header */}
                    <div className="session-selector-card">
                        <div className="step-group">
                            <span className="step-label">Step 1: Select Date</span>
                            <div className="date-input-wrapper">
                                <FiCalendar className="icon" />
                                <input
                                    type="date"
                                    className="form-input"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setSelectedSessionId(null);
                                    }}
                                />
                            </div>
                        </div>
                        <div className={`step-group flex-grow ${!selectedDate ? 'opacity-50' : ''}`}>
                            <span className="step-label">Step 2: Select Session</span>
                            {sessionsForDate.length > 0 ? (
                                <div className="session-pills">
                                    {sessionsForDate.map(session => (
                                        <button
                                            key={session.id}
                                            className={`session-pill ${selectedSessionId === session.id ? 'active' : ''}`}
                                            onClick={() => setSelectedSessionId(session.id)}
                                        >
                                            <div className="time">{session.time}</div>
                                            <div className="topic">{session.topic}</div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-sessions-msg">
                                    {selectedDate ? <><FiAlertCircle /> No sessions on this date.</> : "Pick a date first."}
                                </div>
                            )}
                        </div>
                    </div>

                    {!activeSession ? (
                        <div className="empty-content-state" style={{ border: '1px dashed #e2e8f0', borderRadius: '12px', background: '#fff', padding: '60px' }}>
                            <FiClock style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }} />
                            <h3 className="text-muted">No Session Selected</h3>
                            <p className="text-sm text-muted">Select a session to serve as the context for attendance.</p>
                        </div>
                    ) : (
                        <>
                            {/* 2. Session Controls & Settings */}
                            <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                                <div className="d-flex gap-3">
                                    <div className="kpi-mini">
                                        <span className="label">Present</span>
                                        <div className="d-flex flex-column">
                                            <span className="value text-success">{stats.present + stats.late}</span>
                                            {showAdvancedControls && (
                                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                                    On: <b>{stats.online}</b> | Off: <b>{stats.offline}</b>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="kpi-mini">
                                        <span className="label">Absent</span>
                                        <span className="value text-danger">{stats.absent}</span>
                                    </div>
                                    <div className="kpi-mini">
                                        <span className="label">Rate</span>
                                        <span className="value text-primary">{stats.rate}%</span>
                                    </div>
                                </div>
                                <button
                                    className={`btn-settings-toggle ${showSettings ? 'active' : ''}`}
                                    onClick={() => setShowSettings(!showSettings)}
                                >
                                    <FiSettings /> Session Configuration
                                </button>
                                <button
                                    className="btn-primary-add ms-2"
                                    onClick={startQrSession}
                                    style={{ background: '#6366f1', border: 'none' }}
                                >
                                    <FiMaximize /> Launch Priority QR
                                </button>
                            </div>

                            {showSettings && (
                                <div className="advanced-settings-panel">
                                    <h4 className="settings-title"><FiShield /> Advanced Verification & Alerts</h4>
                                    <div className="settings-grid">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <div className="setting-label"><FiClock /> QR Validity Duration</div>
                                                <div className="setting-desc">Time before QR expires (Minutes)</div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    style={{ width: '60px' }}
                                                    value={config.qrExpiry}
                                                    onChange={(e) => setConfig({ ...config, qrExpiry: parseInt(e.target.value) || 5 })}
                                                />
                                                <span className="text-muted text-sm">min</span>
                                            </div>
                                        </div>
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <div className="setting-label"><FiMapPin /> Geo-Fencing</div>
                                                <div className="setting-desc">Restrict marking to classroom radius</div>
                                            </div>
                                            <div className="toggle-switch">
                                                <input type="checkbox" checked={config.geoFence} onChange={e => setConfig({ ...config, geoFence: e.target.checked })} />
                                                <span className="slider"></span>
                                            </div>
                                        </div>
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <div className="setting-label"><FiCamera /> Face Recognition</div>
                                                <div className="setting-desc">Verify student identity via camera</div>
                                            </div>
                                            <div className="toggle-switch">
                                                <input type="checkbox" checked={config.faceId} onChange={e => setConfig({ ...config, faceId: e.target.checked })} />
                                                <span className="slider"></span>
                                            </div>
                                        </div>
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <div className="setting-label"><FiBell /> Notify Parents</div>
                                                <div className="setting-desc">Send SMS for Absent/Late status</div>
                                            </div>
                                            <div className="toggle-switch">
                                                <input type="checkbox" checked={config.notifyParents} onChange={e => setConfig({ ...config, notifyParents: e.target.checked })} />
                                                <span className="slider"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. Student List */}
                            <div className="attendance-content-card">
                                <div className="acc-header">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="search-box-wrapper compact">
                                            <FiSearch className="search-icon" />
                                            <input
                                                type="text"
                                                placeholder={`Search ${targetRole.toLowerCase()}...`}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        {isSessionLocked ? (
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="locked-badge"><FiLock /> {userRole === 'Admin' ? 'Locked' : 'Read Only'}</div>
                                                {userRole === 'Admin' && (
                                                    <button
                                                        className="btn-link-unlock"
                                                        title="Override Lock (Admin)"
                                                        onClick={() => setIsSessionLocked(false)}
                                                    >
                                                        <FiUnlock /> Unlock
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bulk-actions">
                                                <span className="text-muted text-sm mr-2">Bulk Actions:</span>
                                                <button className="btn-bulk present" onClick={() => setBulkActionConfirm('Present')}>
                                                    <FiCheckSquare /> All Present
                                                </button>
                                                <button className="btn-bulk absent" onClick={() => setBulkActionConfirm('Absent')}>
                                                    <FiXSquare /> All Absent
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table-custom attendance-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '30%' }}>{targetRole}</th>
                                                <th style={{ width: '35%' }} className="text-center">Status</th>
                                                <th style={{ width: '20%' }}>Details / Remarks</th>
                                                <th style={{ width: '15%' }}>Audit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredList.map(rec => (
                                                <tr key={rec.studentId}>
                                                    <td>
                                                        <div
                                                            className="student-info-cell clickable"
                                                            onClick={() => setStudentSummaryModal(rec)} // Mock summary
                                                            title="View Analytics"
                                                        >
                                                            <div className="avatar-small">{rec.avatar}</div>
                                                            <div>
                                                                <div className="s-name">{rec.name}</div>
                                                                <div className="s-meta">
                                                                    ID: {rec.studentId} • {getEligibilityBadge(rec.attendanceRate)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="status-toggles">
                                                            {[
                                                                { key: ATTENDANCE_STATUS.PRESENT, icon: <FiCheckCircle />, label: 'P', colorClass: 'present' },
                                                                { key: ATTENDANCE_STATUS.LATE, icon: <FiClock />, label: 'L', colorClass: 'late' },
                                                                { key: ATTENDANCE_STATUS.EXCUSED, icon: <FiMinusCircle />, label: 'E', colorClass: 'excused' },
                                                                { key: ATTENDANCE_STATUS.ABSENT, icon: <FiXCircle />, label: 'A', colorClass: 'absent' }
                                                            ].map(opt => (
                                                                <button
                                                                    key={opt.key}
                                                                    className={`status-btn ${opt.colorClass} ${rec.status === opt.key ? 'active' : ''}`}
                                                                    onClick={() => handleStatusChange(rec.studentId, opt.key)}
                                                                    disabled={isReadOnly}
                                                                    title={opt.label}
                                                                >
                                                                    {opt.icon} <span className="status-label-text">{opt.label}</span>
                                                                </button>
                                                            ))}
                                                        </div>

                                                        {/* Online/Offline Toggle - Only if Advanced Controls are enabled */}
                                                        {showAdvancedControls && (rec.status === ATTENDANCE_STATUS.PRESENT || rec.status === ATTENDANCE_STATUS.LATE) && (
                                                            <div className="attendance-mode-switch mt-2 d-flex justify-content-center gap-2">
                                                                <button
                                                                    className={`btn btn-sm d-flex align-items-center gap-1 ${rec.attendanceMode === 'Online' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                                    style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px' }}
                                                                    onClick={() => handleModeChange(rec.studentId, 'Online')}
                                                                    disabled={isReadOnly}
                                                                    title="Mark as Online"
                                                                >
                                                                    <FiWifi size={10} /> Online
                                                                </button>
                                                                <button
                                                                    className={`btn btn-sm d-flex align-items-center gap-1 ${rec.attendanceMode === 'Offline' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                                    style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px' }}
                                                                    onClick={() => handleModeChange(rec.studentId, 'Offline')}
                                                                    disabled={isReadOnly}
                                                                    title="Mark as Offline"
                                                                >
                                                                    <FiWifiOff size={10} /> Offline
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="remark-wrapper">
                                                            {rec.status === ATTENDANCE_STATUS.EXCUSED ? (
                                                                <select
                                                                    className="remark-select type-leave"
                                                                    value={rec.leaveType}
                                                                    onChange={(e) => handleLeaveTypeChange(rec.studentId, e.target.value)}
                                                                    disabled={isReadOnly}
                                                                >
                                                                    {LEAVE_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                                </select>
                                                            ) : (
                                                                <>
                                                                    <select
                                                                        className="remark-select"
                                                                        value={rec.remarkType}
                                                                        onChange={(e) => handleRemarkTypeChange(rec.studentId, e.target.value)}
                                                                        disabled={isReadOnly}
                                                                    >
                                                                        {REMARK_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                                    </select>
                                                                    {rec.remarkType === 'Other' && (
                                                                        <input
                                                                            type="text"
                                                                            className="remark-input mt-1"
                                                                            placeholder="Reason..."
                                                                            value={rec.remarks}
                                                                            onChange={(e) => handleRemarkTextChange(rec.studentId, e.target.value)}
                                                                            disabled={isReadOnly}
                                                                        />
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-muted small">
                                                        {rec.timestamp !== '-' ? (
                                                            <div className="audit-info">
                                                                <span>{new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                <span className="by-user">{rec.markedBy}</span>
                                                            </div>
                                                        ) : <span className="opacity-50">-</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredList.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center p-5 text-muted">
                                                        <FiUser size={24} className="mb-2 opacity-50" />
                                                        <p>No active {targetRole.toLowerCase()}s in this batch.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Sticky Save Bar */}
                            <div className={`sticky-save-bar ${hasChanges ? 'visible' : ''}`}>
                                <div className="save-bar-content">
                                    <span>{isSessionLocked ? "Allows override." : "You have unsaved changes."}</span>
                                    <div className="d-flex gap-2">
                                        <button className="btn-secondary-sm" onClick={() => setAttendanceData(originalData)}>Discard</button>
                                        <button className="btn-primary-sm" onClick={handleSave}>
                                            <FiSave /> Save Attendance
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* SINGLE USER VIEW (Advanced Only) */}
            {showAdvancedControls && viewMode === 'SINGLE' && (
                <div className="single-student-view">
                    {/* Step 1: Select User */}
                    <div className="gradient-header-card mb-4">
                        <h4 className="mb-3 text-lg font-bold text-gray-800">Select {targetRole}</h4>
                        <div className="search-box-modern mb-3">
                            <FiSearch className="icon" />
                            <input
                                type="text"
                                placeholder={`Search ${targetRole} by name...`}
                                className="search-input-modern"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="student-grid-modern">
                            {MOCK_USERS.filter(u => u.role === targetRole && u.status === 'Active' && u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                                <div
                                    key={user.id}
                                    className={`student-card-modern ${targetStudentId === user.id ? 'active' : ''}`}
                                    onClick={() => setTargetStudentId(user.id)}
                                >
                                    <div className="avatar-large-modern">{user.name.charAt(0)}</div>
                                    <div className="name font-semibold text-gray-800">{user.name}</div>
                                </div>
                            ))}
                        </div>
                        {MOCK_USERS.filter(u => u.role === targetRole && u.status === 'Active').length === 0 && (
                            <div className="text-center text-muted p-4">
                                No Active {targetRole}s found.
                            </div>
                        )}
                    </div>

                    {targetStudentId && targetStudentProfile && (
                        <div className="student-history-card">
                            <div className="student-info-header">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="avatar-large-modern" style={{ width: '64px', height: '64px', fontSize: '28px' }}>
                                        {targetStudentProfile.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="m-0 text-2xl font-bold text-gray-800">{targetStudentProfile.name}</h3>
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            <span className="text-gray-500">{targetStudentProfile.email}</span>
                                            <span className="badge bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-pill px-3">{targetRole}</span>
                                        </div>
                                    </div>
                                    <div className="ms-auto text-end">
                                        <div className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Overall Attendance</div>
                                        <div className="text-3xl font-bold text-gray-800">
                                            {Math.round(MOCK_ATTENDANCE.filter(r => r.studentId === targetStudentId && r.status === 'Present').length / Math.max(1, MOCK_ATTENDANCE.filter(r => r.studentId === targetStudentId).length) * 100)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Session Topic</th>
                                            <th className="text-center">Status</th>
                                            <th className="text-center">Mode</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allBatchSessions.map(session => {
                                            const rec = getStudentSessionRecord(session.id, targetStudentId);
                                            return (
                                                <tr key={session.id}>
                                                    <td>
                                                        <div className="font-semibold text-gray-800">{session.topic}</div>
                                                        <div className="d-flex align-items-center gap-3 mt-1 text-xs text-gray-500">
                                                            <span className="d-flex align-items-center gap-1"><FiCalendar /> {session.date}</span>
                                                            <span className="d-flex align-items-center gap-1"><FiClock /> {session.time}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="d-flex justify-content-center">
                                                            <span className={`status-badge ${rec.status.toLowerCase()}`}>
                                                                {rec.status === 'Present' && <FiCheckCircle />}
                                                                {rec.status === 'Absent' && <FiXCircle />}
                                                                {rec.status === 'Late' && <FiClock />}
                                                                {rec.status === 'Pending' && <FiMinusCircle />}
                                                                {rec.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        {(rec.status === 'Present' || rec.status === 'Late') && (
                                                            <span className={`badge ${rec.attendanceMode === 'Online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} border px-2 py-1`}>
                                                                {rec.attendanceMode === 'Online' ? <FiWifi /> : <FiWifiOff />} {rec.attendanceMode}
                                                            </span>
                                                        )}
                                                        {(rec.status === 'Absent' || rec.status === 'Pending') && <span className="text-muted">-</span>}
                                                    </td>
                                                    <td className="text-gray-600 text-sm">
                                                        {rec.remarks || <span className="opacity-50 italic">No remarks</span>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modals & Toasts */}
            {bulkActionConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content-small confirm-modal">
                        <div className="modal-icon-header"><FiAlertTriangle /></div>
                        <h3>Confirm Bulk Action</h3>
                        <p>Mark <strong>ALL {attendanceData.length} students</strong> as <strong>{bulkActionConfirm}</strong>?</p>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setBulkActionConfirm(null)}>Cancel</button>
                            <button className="btn-primary" onClick={() => handleBulkAction(bulkActionConfirm)}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {studentSummaryModal && (
                <div className="modal-overlay">
                    <div className="modal-content-small student-summary-modal">
                        <div className="modal-header">
                            <h3>{studentSummaryModal.name}</h3>
                            <button className="btn-close" onClick={() => setStudentSummaryModal(null)}><FiXCircle /></button>
                        </div>
                        <div className="modal-body">
                            <div className="summary-stats">
                                <div className="stat-item">
                                    <span className="label">Cumulative Rate</span>
                                    <span className={`value ${studentSummaryModal.attendanceRate < 75 ? 'text-danger' : 'text-success'}`}>
                                        {studentSummaryModal.attendanceRate}%
                                    </span>
                                </div>
                                <div className="stat-item"><span className="label">Eligibility</span> <span>{getEligibilityBadge(studentSummaryModal.attendanceRate)}</span></div>
                            </div>
                            <div className="alert-box mt-3">
                                <FiInfo size={16} />
                                <p className="text-sm m-0">This summary reflects the student's historical performance across all sessions in this batch.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* LIVE QR MODAL - Premium Full Screen Experience */}
            {qrSession.isActive && (
                <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.95)', zIndex: 99999, position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content-large" style={{ width: '900px', height: '600px', background: '#0f172a', color: 'white', border: '1px solid #334155', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
                        {/* Header */}
                        <div className="modal-header d-flex justify-content-between align-items-center p-4 border-bottom border-secondary" style={{ background: '#1e293b', borderColor: '#334155' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 rounded" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                                    <FiMaximize size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white m-0 fw-bold" style={{ fontSize: '1.25rem' }}>Live QR Session</h3>
                                    <p className="text-gray-400 m-0 text-sm">Scan for Entry • auto-tracking duration</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-4">
                                <div className="text-end">
                                    <div className="text-xs text-gray-500 uppercase fw-bold tracking-wider">Session Expires In</div>
                                    <div className="font-mono fw-bold" style={{ color: '#34d399', fontSize: '2rem', lineHeight: 1 }}>{formatTimeLeft(qrTimeLeft)}</div>
                                </div>
                                <button
                                    onClick={() => setQrSession(prev => ({ ...prev, isActive: false }))}
                                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                >
                                    <FiXCircle size={32} />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="modal-body p-0 d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
                            <div className="row g-0 w-100 h-100">
                                {/* Left: QR Code Area */}
                                <div className="col-md-5 d-flex flex-column align-items-center justify-content-center p-5 border-end border-secondary" style={{ borderColor: '#334155' }}>
                                    <div className="bg-white p-4 rounded-3 shadow-lg mb-4 position-relative">
                                        <QRCodeCanvas
                                            value={qrSession.token || 'init'}
                                            size={250}
                                            level={"H"}
                                            includeMargin={true}
                                        />
                                        <div className="position-absolute top-50 start-50 translate-middle bg-white p-2 rounded-circle shadow-sm">
                                            <FiActivity size={32} color="#6366f1" />
                                        </div>
                                    </div>
                                    <h4 className="text-white fw-bold mt-4">Scan using Student App</h4>
                                    <p className="text-gray-400 text-sm">Valid for {config.qrExpiry} minutes only.</p>
                                </div>

                                {/* Right: Live Feed */}
                                <div className="col-md-7 d-flex flex-column" style={{ background: '#020617' }}>
                                    <div className="p-4 flex-grow-1 overflow-hidden d-flex flex-column">
                                        <h4 className="text-gray-400 text-sm uppercase fw-bold mb-4 d-flex align-items-center gap-2">
                                            <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)' }}></span>
                                            Real-time Check-ins
                                        </h4>

                                        <div className="flex-grow-1 overflow-auto custom-scrollbar pe-2">
                                            <div className="d-flex flex-column gap-3">
                                                {attendanceData.filter(r => r.attendanceMode === 'QR').length === 0 ? (
                                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-gray-600">
                                                        <FiWifiOff size={48} className="mb-3 opacity-25" />
                                                        <p>Waiting for students to join...</p>
                                                    </div>
                                                ) : (
                                                    attendanceData
                                                        .filter(r => r.attendanceMode === 'QR')
                                                        .sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime))
                                                        .map(rec => (
                                                            <div key={rec.studentId} className="d-flex align-items-center justify-content-between p-3 rounded-3 border border-secondary" style={{ background: '#1e293b', borderColor: '#334155' }}>
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white shadow-sm" style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                                                        {rec.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-white fw-bold">{rec.name}</div>
                                                                        <div className="text-xs text-gray-400 font-monospace">
                                                                            {new Date(rec.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-end">
                                                                    <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">
                                                                        <FiCheckCircle className="me-1" /> Checked In
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 mt-1">{rec.durationMinutes}m duration</div>
                                                                </div>
                                                            </div>
                                                        ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Simulator Controls */}
                                    <div className="p-3 border-top border-secondary bg-dark bg-opacity-50" style={{ borderColor: '#334155' }}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="text-xs text-gray-500 uppercase fw-bold">Simulator Controls</span>
                                            <button
                                                className="btn btn-sm btn-primary d-flex align-items-center gap-2"
                                                style={{ fontSize: '0.75rem' }}
                                                onClick={() => {
                                                    const eligible = attendanceData.filter(u => !u.checkInTime);
                                                    if (eligible.length > 0) {
                                                        const randomStudent = eligible[Math.floor(Math.random() * eligible.length)];
                                                        simulateStudentScan(randomStudent.studentId);
                                                    }
                                                }}
                                            >
                                                <FiRefreshCw /> Auto-Scan Random Student
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSaveSuccess && (
                <div className="toast-success">
                    <FiCheckCircle /> Attendance saved successfully!
                </div>
            )}
        </div>
    );
};

export default AttendanceTab;
