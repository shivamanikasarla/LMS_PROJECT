import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';

import { Users } from 'lucide-react'; // Added Icon


import { MOCK_STUDENTS } from '../data/mockData';

import { useAttendanceStore } from '../store/attendanceStore.jsx';
import AttendanceTable from '../components/AttendanceTable.jsx';
import OfflineMarker from '../components/OfflineMarker.jsx';
import SessionReport from '../components/SessionReport.jsx';
import QRPanel from '../components/QRPanel.jsx';
import { Camera, QrCode, ListChecks } from 'lucide-react';

/* ---------------- LIVE VIEW ---------------- */

const LiveView = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const {
        session,
        attendanceList,
        startSession, // Needed to init session
        isSessionLocked,
        stopSession,
        markAttendance
    } = useAttendanceStore();

    const [activeTab, setActiveTab] = useState('QR'); // 'QR', 'FACE', 'MANUAL'
    const [isOfflineMode, setIsOfflineMode] = useState(false);

    // Sync offline mode with tab
    useEffect(() => {
        setIsOfflineMode(activeTab === 'MANUAL');
    }, [activeTab]);

    // Mock Batch Students for Demo (Assume Session is for Batch B-003)
    const batchStudents = MOCK_STUDENTS.filter(s => s.batchId === 'B-003');

    const handleMarkAll = (status) => {
        if (window.confirm(`Mark all ${batchStudents.length} students as ${status}?`)) {
            batchStudents.forEach(student => {
                // Only mark if not already marked (optional, or overwrite)
                markAttendance(student.id, status, 'MANUAL');
            });
        }
    };

    // Initialize session if missing (Simulate fetching)
    useEffect(() => {
        if (!session.id || session.id !== sessionId) {
            // For demo purposes, we auto-start/load the session if hitting this URL
            startSession(sessionId, 'QR', 5, 60);
        }
    }, [sessionId, session.id, startSession]);

    // Guard: wait for session to exist
    if (!session || !session.id) {
        return <div className="p-5 text-center text-muted">Loading session context...</div>;
    }

    // Redirect if locked
    if (isSessionLocked()) {
        return <Navigate to={`/attendance/sessions/${sessionId}/report`} replace />;
    }

    // Simulate "Student Action" (Instructor can simulate a self-check-in)
    const handleSimulateStudentScan = () => {
        // Find a student not yet marked
        markAttendance('SIMULATED_STUDENT_' + Date.now(), 'PRESENT', 'STUDENT_SELF');
    };

    return (
        <div className="fade-in pb-5">
            {/* Top Tracker / Header */}
            <div className="mb-4 d-flex flex-wrap gap-3 justify-content-between align-items-center bg-white p-3 rounded shadow-sm border">
                <div>
                    <h4 className="m-0 fw-bold">Live Session: {sessionId}</h4>
                    <span className="badge bg-success bg-opacity-10 text-success">Active</span>
                </div>
                <div>
                    <button
                        className="btn btn-danger btn-sm px-4"
                        onClick={() => {
                            if (window.confirm('End Session?')) {
                                stopSession();
                                navigate(`/attendance/sessions/${sessionId}/report`);
                            }
                        }}
                    >
                        End Session
                    </button>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-3">
                                <h5 className="mb-0 fw-bold">Master Attendance List</h5>
                                <span className="badge bg-light text-secondary border">
                                    {batchStudents.length} Students
                                </span>
                            </div>

                            <div className="d-flex gap-2">
                                <OfflineMarker isActive />
                                <button
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() => handleMarkAll('PRESENT')}
                                >
                                    Mark All Present
                                </button>
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleMarkAll('ABSENT')}
                                >
                                    Mark All Absent
                                </button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <AttendanceTable
                                students={batchStudents.map(s => {
                                    const record = attendanceList.find(r => r.studentId === s.id);
                                    return {
                                        ...s,
                                        studentId: s.id,
                                        status: record ? record.status : 'UNMARKED',
                                        remarks: record?.overrideReason || ''
                                    };
                                })}
                                onStatusChange={(id, status) => markAttendance(id, status, 'MANUAL')}
                                onRemarkChange={() => { }}
                                isEditable={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ---------------- REPORT VIEW ---------------- */

const ReportView = () => {
    const { sessionId } = useParams();

    return (
        <div className="fade-in">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="fw-bold m-0">Session Final Report</h4>
                    <p className="text-muted m-0 small">ID: {sessionId}</p>
                </div>
            </div>
            <SessionReport sessionId={sessionId} />
        </div>
    );
};

/* ---------------- END HANDLER ---------------- */

const EndSessionHandler = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { stopSession } = useAttendanceStore();

    useEffect(() => {
        const confirmEnd = window.confirm("Are you sure you want to end this session?");
        if (confirmEnd) {
            stopSession();
            navigate(`../report`, { replace: true });
        } else {
            navigate(`../live`, { replace: true });
        }
    }, [sessionId, stopSession, navigate]);

    return <div className="p-5 text-center">Processing...</div>;
};

/* ---------------- ROUTER ---------------- */

const SessionDetails = () => {
    return (
        <Routes>
            <Route index element={<Navigate to="live" replace />} />
            <Route path="live" element={<LiveView />} />
            <Route path="end" element={<EndSessionHandler />} />
            <Route path="report" element={<ReportView />} />
        </Routes>
    );
};

export default SessionDetails;
