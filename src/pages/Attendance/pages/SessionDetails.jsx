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
    const [pendingChanges, setPendingChanges] = useState(0);

    // Sync offline mode with tab
    useEffect(() => {
        setIsOfflineMode(activeTab === 'MANUAL');
    }, [activeTab]);

    // Mock Batch Students for Demo (Assume Session is for Batch B-003)
    const batchStudents = MOCK_STUDENTS.filter(s => s.batchId === 'B-003');

    // Helper to get effective attendance status (store vs default)
    const getStudentStatus = (student) => {
        const record = attendanceList.find(r => r.studentId === student.id);
        return {
            status: record ? record.status : 'UNMARKED',
            mode: record ? record.mode : 'OFFLINE', // Default to offline unless marked Online
            remarks: record?.overrideReason || ''
        };
    };

    const handleMarkAll = (status) => {
        // Filter out ONLINE students
        const eligibleStudents = batchStudents.filter(s => {
            const { mode } = getStudentStatus(s);
            return mode !== 'ONLINE';
        });

        const onlineCount = batchStudents.length - eligibleStudents.length;

        if (eligibleStudents.length === 0) {
            alert("No eligible offline students to mark. (Online students are protected)");
            return;
        }

        if (window.confirm(`Mark ${eligibleStudents.length} students as ${status}?\n(${onlineCount} Online students excluded)`)) {
            eligibleStudents.forEach(student => {
                markAttendance(student.id, status, 'MANUAL');
            });
            setPendingChanges(prev => prev + eligibleStudents.length);
        }
    };

    const handleManualMark = (id, status) => {
        const res = markAttendance(id, status, 'MANUAL');
        if (res.success) {
            setPendingChanges(prev => prev + 1);
        } else {
            alert(res.message);
        }
    };

    const handleSaveChanges = () => {
        // Simulate API Save
        setPendingChanges(0);
        alert('Changes saved successfully!');
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

    return (
        <div className="fade-in pb-5">
            {/* Top Tracker / Header */}
            <div className="mb-4 d-flex flex-wrap gap-3 justify-content-between align-items-center bg-white p-3 rounded shadow-sm border">
                <div>
                    <h4 className="m-0 fw-bold">Live Session: {sessionId}</h4>
                    <div className="d-flex align-items-center gap-2 mt-1">
                        <span className="badge bg-success bg-opacity-10 text-success">Active</span>
                        {pendingChanges > 0 && (
                            <span className="badge bg-warning text-dark animate-pulse">
                                {pendingChanges} Unsaved Changes
                            </span>
                        )}
                    </div>
                </div>
                <div className="d-flex gap-2">
                    {pendingChanges > 0 && (
                        <button
                            className="btn btn-primary btn-sm px-4"
                            onClick={handleSaveChanges}
                        >
                            Save Changes
                        </button>
                    )}
                    <button
                        className="btn btn-danger btn-sm px-4"
                        disabled={pendingChanges > 0}
                        title={pendingChanges > 0 ? "Save changes before ending session" : ""}
                        onClick={() => {
                            if (window.confirm('End Session? This will finalize all records.')) {
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
                    {/* Offline Mode Banner integrated? User wanted it red/orange. 
                        OfflineMarker component now handles that. Use it here if needed or separate. 
                        The previous code had OfflineMarker in the header line. 
                        Ideally it should be distinct. 
                        Let's put OfflineMarker outside the table card for better visibility if active. */}

                    {/* Note: OfflineMarker has its own 'isActive' check. We pass it `true` to show. 
                         In this view, the user might want it visible always if 'Manual' logic is primary? 
                         Or maybe toggleable? 
                         Currently strict requirement: "Only OFFLINE students can be marked manually".
                         Let's keep it visible.
                     */}

                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-3">
                                <h5 className="mb-0 fw-bold">Master Attendance List</h5>
                                <span className="badge bg-light text-secondary border">
                                    {batchStudents.length} Students
                                </span>
                            </div>

                            <div className="d-flex gap-2 align-items-center">
                                {/* We keep OfflineMarker component usage but perhaps styled differently? 
                                    Actually OfflineMarker is a Block component (card). 
                                    Putting a Card inside this header flex is layout breaking.
                                    Let's MOVE OfflineMarker out of here to above the table card.
                                */}

                                <div className="d-flex gap-2" style={{ minWidth: 'fit-content' }}>
                                    <button
                                        className="btn btn-outline-success btn-sm text-nowrap d-flex align-items-center gap-1"
                                        onClick={() => handleMarkAll('PRESENT')}
                                        title="Mark all eligible offline students as Present"
                                    >
                                        <i className="bi bi-check-all"></i> Mark All Present
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm text-nowrap d-flex align-items-center gap-1"
                                        onClick={() => handleMarkAll('ABSENT')}
                                        title="Mark all eligible offline students as Absent"
                                    >
                                        <i className="bi bi-x-circle"></i> Mark All Absent
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Insert OfflineMarker here if needed, but it's a big block.
                            Let's put it in the body before table? 
                            Or effectively replace the "QR" panel location? 
                            For now, let's place it above the table content. 
                        */}
                        <div className="px-3 pt-3">
                            <OfflineMarker isActive={true} />
                        </div>

                        <div className="card-body p-0">
                            <AttendanceTable
                                students={batchStudents.map(s => {
                                    const { status, remarks, mode } = getStudentStatus(s);
                                    return {
                                        ...s,
                                        studentId: s.id,
                                        status,
                                        mode, // Pass mode explicitly
                                        remarks
                                    };
                                })}
                                onStatusChange={handleManualMark}
                                onRemarkChange={() => { setPendingChanges(prev => prev + 1) }}
                                isEditable={true} // Always editable for Offline students in Live logic
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
