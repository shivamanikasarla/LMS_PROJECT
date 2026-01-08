import React, { useState } from 'react';
import { FiSearch, FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiWifi, FiWifiOff, FiMinusCircle, FiDownload, FiInfo } from 'react-icons/fi';

const AttendanceReports = ({
    viewMode,
    targetRole,
    users,
    attendanceRecords,
    allBatchSessions,
    targetStudentId,
    setTargetStudentId,
    targetStudentProfile,
    getEligibilityBadge, // Passed from parent
    setViewMode, // To switch between report modes
    getStudentSessionRecord
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    // --- BATCH REPORT VIEW ---
    if (viewMode === 'BATCH_REPORT') {
        return (
            <div className="batch-report-view fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="m-0 text-lg font-bold text-gray-800">Batch Performance Report</h4>
                        <p className="text-sm text-gray-500 m-0">Consolidated analytics for all {targetRole.toLowerCase()}s</p>
                    </div>
                    <button className="btn-secondary-sm bg-white text-dark border border-gray-300 d-flex gap-2 items-center">
                        <FiDownload /> Export CSV
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="kpi-card h-100 border-start border-4 border-primary p-3">
                            <div className="text-uppercase text-muted fw-bold small mb-2">Avg Attendance</div>
                            <div className="fs-2 fw-bold text-dark">
                                {Math.round(attendanceRecords.filter(r => r.status === 'Present').length / Math.max(1, attendanceRecords.length) * 100)}%
                            </div>
                            <div className="text-xs text-muted">Across all students</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="kpi-card h-100 border-start border-4 border-danger p-3">
                            <div className="text-uppercase text-muted fw-bold small mb-2">Critical Awareness</div>
                            <div className="fs-2 fw-bold text-danger">
                                {users.filter(u => {
                                    const total = attendanceRecords.filter(r => r.studentId === u.id).length;
                                    if (!total) return false;
                                    const present = attendanceRecords.filter(r => r.studentId === u.id && r.status === 'Present').length;
                                    return (present / total) < 0.75;
                                }).length}
                            </div>
                            <div className="text-xs text-muted">Students below 75%</div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="kpi-card h-100 border border-gray-200 p-3 bg-gray-50">
                            <div className="d-flex align-items-center gap-3">
                                <FiInfo className="text-primary" size={24} />
                                <div>
                                    <h6 className="fw-bold m-0">Performance Insight</h6>
                                    <p className="text-sm text-muted m-0">Attendance has dropped by 5% on Fridays. Consider rescheduling Friday sessions.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="attendance-content-card">
                    <div className="table-responsive">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th className="text-center">Total Classes</th>
                                    <th className="text-center">Present</th>
                                    <th className="text-center">Absent</th>
                                    <th className="text-center">Rate</th>
                                    <th className="text-center">Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users
                                    .filter(u => u.role === targetRole && u.status === 'Active')
                                    .map(user => {
                                        const records = attendanceRecords.filter(r => r.studentId === user.id);
                                        const total = records.length || 1; // avoid div by 0
                                        const present = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
                                        const absent = records.filter(r => r.status === 'Absent').length;
                                        const rate = Math.round((present / total) * 100);

                                        return (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="avatar-small fw-bold bg-light text-dark border">{user.name.charAt(0)}</div>
                                                        <div>
                                                            <div className="fw-bold text-dark">{user.name}</div>
                                                            <div className="small text-muted">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center fw-bold text-gray-600">{records.length}</td>
                                                <td className="text-center text-success fw-bold">{present}</td>
                                                <td className="text-center text-danger fw-bold">{absent}</td>
                                                <td className="text-center">
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <div className="progress w-100" style={{ height: '6px', width: '60px' }}>
                                                            <div className={`progress-bar ${rate < 75 ? 'bg-danger' : 'bg-success'}`} style={{ width: `${rate}%` }}></div>
                                                        </div>
                                                        <span className="small fw-bold">{rate}%</span>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    {getEligibilityBadge(rate)}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn-icon-secondary"
                                                        onClick={() => {
                                                            setTargetStudentId(user.id);
                                                            if (setViewMode) setViewMode('SINGLE');
                                                        }}
                                                        title="View Detailed Report"
                                                    >
                                                        <FiSearch size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // --- SINGLE USER REPORT VIEW ---
    if (viewMode === 'SINGLE') {
        return (
            <div className="single-student-view">
                {/* Step 1: Select User */}
                <div className="gradient-header-card mb-4">
                    <h4 className="mb-3 text-lg font-bold text-white">Select {targetRole} for Report</h4>
                    <div className="search-box-modern mb-3">
                        <FiSearch className="icon text-white" />
                        <input
                            type="text"
                            placeholder={`Search ${targetRole} by name...`}
                            className="search-input-modern text-white bg-white/10 placeholder-white/50 border-white/20 focus:bg-white/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="student-grid-modern">
                        {users.filter(u => u.role === targetRole && u.status === 'Active' && u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                            <div
                                key={user.id}
                                className={`student-card-modern ${targetStudentId === user.id ? 'active ring-2 ring-white' : ''} bg-white/10 hover:bg-white/20 text-white`}
                                onClick={() => setTargetStudentId(user.id)}
                            >
                                <div className="avatar-large-modern bg-white/20 text-white">{user.name.charAt(0)}</div>
                                <div className="name font-semibold">{user.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {targetStudentId && targetStudentProfile && (
                    <div className="d-flex flex-column gap-4 fade-in">
                        {/* Summary Metrics */}
                        <div className="row g-3">
                            <div className="col-md-3">
                                <div className="kpi-card h-100 border-start border-4 border-primary shadow-sm">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-uppercase text-muted fw-bold small">Total Classes</span>
                                        <FiCalendar className="text-primary opacity-50" size={20} />
                                    </div>
                                    <div className="fs-2 fw-bold text-dark">{attendanceRecords.filter(r => r.studentId === targetStudentId).length}</div>
                                    <div className="small text-muted">Sessions Conducted</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="kpi-card h-100 border-start border-4 border-success shadow-sm">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-uppercase text-muted fw-bold small">Present</span>
                                        <FiCheckCircle className="text-success opacity-50" size={20} />
                                    </div>
                                    <div className="fs-2 fw-bold text-success">{attendanceRecords.filter(r => r.studentId === targetStudentId && (r.status === 'Present' || r.status === 'Late')).length}</div>
                                    <div className="small text-muted">Classes Attended</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="kpi-card h-100 border-start border-4 border-danger shadow-sm">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-uppercase text-muted fw-bold small">Leaves/Absent</span>
                                        <FiXCircle className="text-danger opacity-50" size={20} />
                                    </div>
                                    <div className="fs-2 fw-bold text-danger">{attendanceRecords.filter(r => r.studentId === targetStudentId && r.status === 'Absent').length}</div>
                                    <div className="small text-muted">Sessions Missed</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="kpi-card h-100 border-start border-4 border-warning shadow-sm">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-uppercase text-muted fw-bold small">Avg Punctuality</span>
                                        <FiClock className="text-warning opacity-50" size={20} />
                                    </div>
                                    <div className="fs-2 fw-bold text-warning">92%</div>
                                    <div className="small text-muted">On-Time Arrival</div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed History Table */}
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
                                            {Math.round(
                                                attendanceRecords.filter(r => r.studentId === targetStudentId && r.status === 'Present').length /
                                                Math.max(1, attendanceRecords.filter(r => r.studentId === targetStudentId).length) * 100
                                            )}%
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
                    </div>
                )}
            </div>
        );
    }

    return null;
};

export default AttendanceReports;
