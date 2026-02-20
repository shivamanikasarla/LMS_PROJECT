import React from 'react';
import { FiSettings, FiMaximize, FiShield, FiClock, FiMapPin, FiWifi, FiUserCheck, FiUsers, FiActivity } from 'react-icons/fi';

const AttendanceStatsConfig = ({
    activeSession,
    stats,
    showSettings,
    setShowSettings,
    startQrSession,
    config,
    setConfig,
    showAdvancedControls
}) => {
    if (!activeSession) return null;

    return (
        <>
            {/* Session Controls & Stats */}
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
                <div className="d-flex gap-2">
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
            </div>

            {/* Advanced Settings Panel */}
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
                                <span className="text-sm text-muted">min</span>
                            </div>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <div className="setting-label"><FiMapPin /> Geo-Fencing</div>
                                <div className="setting-desc">Restrict check-ins to campus (500m)</div>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={config.geoFencing}
                                    onChange={() => setConfig({ ...config, geoFencing: !config.geoFencing })}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <div className="setting-label"><FiUserCheck /> Face Recognition</div>
                                <div className="setting-desc">Require facial verification for mobile app</div>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={config.faceRecognition}
                                    onChange={() => setConfig({ ...config, faceRecognition: !config.faceRecognition })}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <div className="setting-label"><FiClock /> Session Locking Rule</div>
                                <div className="setting-desc">Auto-lock attendance after 24 hours</div>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={true}
                                    readOnly
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AttendanceStatsConfig;
