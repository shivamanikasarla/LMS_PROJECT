import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_COURSES, MOCK_BATCHES, MOCK_SESSIONS, MOCK_STUDENTS } from '../data/mockData';
import { useAttendanceStore } from '../store/attendanceStore';
import { FiSave, FiFilter, FiRefreshCw, FiTrash2, FiUpload, FiCalendar, FiClock } from 'react-icons/fi';
import AttendanceStats from '../components/AttendanceStats';
import AttendanceTable from '../components/AttendanceTable';

const OfflineSync = () => {
    // Selectors
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSessionId, setSelectedSessionId] = useState('');

    const [activeTab, setActiveTab] = useState('ENTRY'); // ENTRY | QUEUE

    // Local Attendance State
    const [attendanceMap, setAttendanceMap] = useState({});

    // Filter Logic
    const filteredBatches = useMemo(() =>
        MOCK_BATCHES.filter(b => !selectedCourse || b.courseId === selectedCourse),
        [selectedCourse]);

    // Available Sessions for Date
    const availableSessions = useMemo(() => {
        if (!selectedBatch || !selectedDate) return [];
        return MOCK_SESSIONS.filter(s => s.batchId === selectedBatch && s.date === selectedDate);
    }, [selectedBatch, selectedDate]);

    // Students
    const students = useMemo(() => {
        if (!selectedBatch) return [];
        return MOCK_STUDENTS.filter(s => s.batchId === selectedBatch);
    }, [selectedBatch]);

    // Auto-init attendance
    useEffect(() => {
        if (selectedSessionId && students.length > 0) {
            const initial = {};
            students.forEach(s => {
                initial[s.id] = 'PRESENT';
            });
            setAttendanceMap(initial);
        } else {
            setAttendanceMap({});
        }
    }, [selectedSessionId, students]);

    // Stats Calculation
    const stats = useMemo(() => {
        const total = students.length;
        if (total === 0) return { total: 0, present: 0, absent: 0, late: 0, percentage: 0 };

        const vals = Object.values(attendanceMap);
        const present = vals.filter(s => s === 'PRESENT').length;
        const absent = vals.filter(s => s === 'ABSENT').length;
        const late = vals.filter(s => s === 'LATE').length;

        return {
            total,
            present,
            absent,
            late,
            percentage: total > 0 ? Math.round((present / total) * 100) : 0
        };
    }, [students, attendanceMap]);

    const handleStatusChange = (studentId, status) => {
        setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
    };

    // CSV Upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const text = evt.target.result;
            const lines = text.split('\n');
            const newMap = { ...attendanceMap };
            let count = 0;

            lines.forEach(line => {
                // Expected: StudentID, Status
                const parts = line.split(',');
                if (parts.length >= 2) {
                    const id = parts[0].trim();
                    const status = parts[1].trim().toUpperCase();

                    // Verify student is in batch
                    if (students.find(s => s.id === id) && ['PRESENT', 'ABSENT', 'LATE'].includes(status)) {
                        newMap[id] = status;
                        count++;
                    }
                }
            });
            setAttendanceMap(newMap);
            alert(`Parsed ${count} records from CSV.`);
            e.target.value = null; // Reset input
        };
        reader.readAsText(file);
    };

    // Save
    const { queueOfflineAttendance, syncOfflineData } = useAttendanceStore();

    const handleSave = () => {
        if (!selectedSessionId) return;

        Object.entries(attendanceMap).forEach(([sid, status]) => {
            queueOfflineAttendance(sid, status, selectedDate, selectedSessionId);
        });
        alert(`Attendance for ${students.length} students queued locally.`);
        setActiveTab('QUEUE');
    };

    // Queue Logic
    const [queue, setQueue] = useState([]);
    const loadQueue = () => {
        const stored = JSON.parse(localStorage.getItem('offline_attendance') || '[]');
        setQueue(stored);
    };
    useEffect(() => { loadQueue(); }, [activeTab]);

    const handleSync = async () => {
        await syncOfflineData();
        loadQueue();
        alert('Synced successfully!');
    };

    const handleClearQueue = () => {
        localStorage.removeItem('offline_attendance');
        loadQueue();
    };

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0 px-2">Batch Attendance Manager</h4>
                <div className="btn-group">
                    <button
                        className={`btn btn-sm ${activeTab === 'ENTRY' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('ENTRY')}
                    >
                        Manual Entry
                    </button>
                    <button
                        className={`btn btn-sm ${activeTab === 'QUEUE' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('QUEUE')}
                    >
                        Sync Queue ({queue.length})
                    </button>
                </div>
            </div>

            {activeTab === 'ENTRY' && (
                <>
                    {/* Filters */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label small fw-bold text-secondary">Batch</label>
                                    <select
                                        className="form-select"
                                        value={selectedBatch}
                                        onChange={e => { setSelectedBatch(e.target.value); setSelectedSessionId(''); }}
                                    >
                                        <option value="">Select Batch</option>
                                        {MOCK_BATCHES.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label small fw-bold text-secondary">Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={selectedDate}
                                        onChange={e => { setSelectedDate(e.target.value); setSelectedSessionId(''); }}
                                    />
                                </div>
                                <div className="col-md-4 d-flex align-items-end">
                                    {/* CSV Upload Button - Only active if session selected */}
                                    <div className="w-100">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            id="csv-upload"
                                            className="d-none"
                                            onChange={handleFileUpload}
                                            disabled={!selectedSessionId}
                                        />
                                        <label
                                            htmlFor="csv-upload"
                                            className={`btn btn-outline-primary w-100 ${!selectedSessionId ? 'disabled' : ''}`}
                                        >
                                            <FiUpload className="me-2" /> Upload CSV
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Session Selection */}
                    {selectedBatch && selectedDate && !selectedSessionId && (
                        <div className="mb-4 fade-in">
                            <h6 className="fw-bold text-muted mb-3">Select a Session for {selectedDate}:</h6>
                            {availableSessions.length > 0 ? (
                                <div className="row g-3">
                                    {availableSessions.map(sess => (
                                        <div className="col-md-4" key={sess.id}>
                                            <div
                                                className="card h-100 border-0 shadow-sm hover-shadow cursor-pointer"
                                                onClick={() => setSelectedSessionId(sess.id)}
                                            >
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="badge bg-primary bg-opacity-10 text-primary">{sess.type}</span>
                                                        <FiClock className="text-muted" />
                                                    </div>
                                                    <h6 className="fw-bold mb-1">{sess.title}</h6>
                                                    <p className="text-muted small mb-0">{sess.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alert alert-info">
                                    <FiCalendar className="me-2" /> No sessions scheduled for this date.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Attendance Table */}
                    {selectedSessionId ? (
                        <div className="fade-in">
                            <div className="d-flex justify-content-between mb-3">
                                <h5 className="fw-bold">Marking for: {availableSessions.find(s => s.id === selectedSessionId)?.title}</h5>
                                <button className="btn btn-dark btn-sm" onClick={() => setSelectedSessionId('')}>Change Session</button>
                            </div>

                            {/* Stats */}
                            <div className="mb-4">
                                <AttendanceStats stats={stats} />
                            </div>

                            {/* Table */}
                            <div className="card border-0 shadow-sm mb-4">
                                <div className="card-body p-0">
                                    <AttendanceTable
                                        students={students.map(s => ({
                                            ...s,
                                            studentId: s.id,
                                            status: attendanceMap[s.id] || 'UNMARKED',
                                            remarks: ''
                                        }))}
                                        onStatusChange={handleStatusChange}
                                        onRemarkChange={() => { }}
                                        isEditable={true}
                                    />
                                </div>
                            </div>

                            <button
                                className="btn btn-success btn-lg w-100 rounded-pill shadow-sm"
                                onClick={handleSave}
                            >
                                <FiSave className="me-2" /> Save Offline Attendance
                            </button>
                        </div>
                    ) : null}
                </>
            )}

            {/* Queue Tab (Same as before) */}
            {activeTab === 'QUEUE' && (
                <div className="card border-0 shadow-sm">
                    {/* ... Queue UI ... */}
                    <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold">Pending Records ({queue.length})</h5>
                        <div>
                            <button className="btn btn-outline-danger btn-sm me-2" onClick={handleClearQueue}>
                                <FiTrash2 /> Clear
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={handleSync}>
                                <FiRefreshCw /> Sync Now
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Student ID</th>
                                    <th>Status</th>
                                    <th>Session</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queue.map((r, i) => (
                                    <tr key={i}>
                                        <td className="ps-4 fw-medium">{r.studentId}</td>
                                        <td>
                                            <span className={`badge bg-${r.status === 'PRESENT' ? 'success' : 'danger'} bg-opacity-10 text-${r.status === 'PRESENT' ? 'success' : 'danger'}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="small text-muted">{r.sessionId}</td>
                                        <td className="text-muted small">
                                            {r.timestamp ? new Date(r.timestamp).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                                {queue.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">queue is empty</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
export default OfflineSync;
