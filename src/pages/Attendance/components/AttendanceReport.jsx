import React, { useState, useMemo, useCallback } from 'react';
import { FiDownload, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiInfo, FiMinusCircle } from 'react-icons/fi';
import StudentAttendanceProfile from './StudentAttendanceProfile';

/* ---------------- CONFIGURATION ---------------- */

const CONSTANTS = {
    ELIGIBILITY_THRESHOLD: 75,
    WARNING_THRESHOLD: 65,
    STATUS_CONFIG: {
        PRESENT: { label: 'Present', color: 'success', icon: <FiCheckCircle /> },
        LATE: { label: 'Late', color: 'warning', icon: <FiClock /> },
        PARTIAL: { label: 'Partial', color: 'info', icon: <FiClock /> },
        ABSENT: { label: 'Absent', color: 'danger', icon: <FiXCircle /> },
        EXCUSED: { label: 'Excused', color: 'secondary', icon: <FiAlertCircle /> },
        MEDICAL: { label: 'Medical', color: 'primary', icon: <FiInfo /> },
        DEFAULT: { label: 'Unknown', color: 'secondary', icon: <FiMinusCircle /> }
    }
};

/* ---------------- SUB-COMPONENTS ---------------- */

const ReportStat = React.memo(({ label, value, color, status }) => (
    <div className="col">
        <div className={`fw-bold fs-4 ${color ? `text-${color}` : 'text-dark'}`}>
            {value}
        </div>
        <div className="text-muted small text-uppercase fw-semibold">{label}</div>
        {status && <div className={`badge bg-${color} mt-1`}>{status}</div>}
    </div>
));

const StatusBadge = React.memo(({ status }) => {
    const config = CONSTANTS.STATUS_CONFIG[status] || CONSTANTS.STATUS_CONFIG.DEFAULT;
    return (
        <span className={`badge bg-${config.color} d-inline-flex align-items-center gap-2 px-3 py-2`}>
            {config.icon}
            <span>{config.label}</span>
        </span>
    );
});

/* ---------------- MAIN COMPONENT ---------------- */



const AttendanceReport = ({ history = [] }) => {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedStudent, setSelectedStudent] = useState(null);

    /* ---------------- MEMOIZED COMPUTATIONS ---------------- */

    const filteredHistory = useMemo(() => {
        if (statusFilter === 'ALL') return history;
        return history.filter(record => record.status === statusFilter);
    }, [history, statusFilter]);

    const reportSummary = useMemo(() => {
        const total = history.length;
        const attended = history.filter(r =>
            ['PRESENT', 'LATE', 'PARTIAL'].includes(r.status)
        ).length;

        const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

        return {
            total,
            attended,
            absent: total - attended,
            percentage
        };
    }, [history]);

    /* ---------------- RENDER ---------------- */

    return (
        <div className="card shadow-sm border-0 mt-4 overflow-hidden">
            {/* Summary Section */}
            <div className="card-body border-bottom bg-light bg-opacity-50 py-4">
                <div className="row text-center g-3">
                    <ReportStat label="Total Sessions" value={reportSummary.total} />
                    <ReportStat label="Attended" value={reportSummary.attended} color="success" />
                    <ReportStat label="Absent" value={reportSummary.absent} color="danger" />
                    <ReportStat
                        label="Attendance %"
                        value={`${reportSummary.percentage}%`}
                        color={reportSummary.percentage >= 75 ? 'success' : 'warning'}
                    />
                </div>
            </div>

            {/* Controls Header */}
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                    <FiClock className="text-primary" />
                    Attendance History
                </h6>

                <div className="d-flex gap-2">
                    <select
                        className="form-select form-select-sm"
                        style={{ width: '150px' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        aria-label="Filter by details"
                    >
                        <option value="ALL">All Statuses</option>
                        {['PRESENT', 'ABSENT', 'LATE'].map(status => (
                            <option key={status} value={status}>
                                {CONSTANTS.STATUS_CONFIG[status]?.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">SL .no</th>
                            <th>Date</th>
                            <th>Course Name</th>
                            <th>Student Name</th>
                            <th>Status</th>
                            <th>Method</th>
                            <th className="text-center">Attendance (Min)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map((record, index) => (
                                <tr key={record.id || index}>
                                    <td className="ps-4 text-muted">{index + 1}</td>
                                    <td className="fw-medium text-secondary">{record.date}</td>
                                    <td className="fw-semibold text-dark">{record.courseName || record.subject}</td>
                                    <td
                                        className="fw-medium text-primary cursor-pointer text-decoration-underline"
                                        onClick={() => setSelectedStudent({
                                            id: record.studentId,
                                            name: record.studentName,
                                            courseName: record.courseName
                                        })}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {record.studentName || '—'}
                                    </td>
                                    <td>
                                        <StatusBadge status={record.status} />
                                    </td>
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {record.method}
                                        </span>
                                    </td>
                                    <td className="text-center">{record.attendanceInMinutes || record.presenceMinutes || 0}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center text-muted py-5">
                                    <div className="d-flex flex-column align-items-center gap-2">
                                        <FiMinusCircle size={24} className="opacity-50" />
                                        <p className="mb-0">No attendance records found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Student Profile Modal */}
            {selectedStudent && (
                <StudentAttendanceProfile
                    key={selectedStudent.id}
                    student={selectedStudent}
                    studentHistory={history.filter(h => h.studentId === selectedStudent.id)}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
};

export default AttendanceReport;