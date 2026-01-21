import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCheckSquare, FiUser, FiMapPin, FiClock,
    FiCheckCircle, FiXCircle, FiSkipForward, FiLock, FiMap
} from 'react-icons/fi';

const TransportAttendance = () => {
    // --- State ---
    const [selectedRoute, setSelectedRoute] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedShift, setSelectedShift] = useState('Morning');
    const [isTripCompleted, setIsTripCompleted] = useState(false);

    // Mock Data Loading
    const [routes, setRoutes] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId_date_shift: 'Present' | 'Absent' | 'Skipped' }

    useEffect(() => {
        const savedRoutes = localStorage.getItem('lms_transport_routes');
        const savedStudents = localStorage.getItem('lms_transport_students');
        if (savedRoutes) setRoutes(JSON.parse(savedRoutes));
        if (savedStudents) setStudents(JSON.parse(savedStudents));
    }, []);

    // --- Helpers ---
    const getStudentsForRoute = () => {
        if (!selectedRoute) return [];
        return students.filter(s => s.routeId === parseInt(selectedRoute));
    };

    const getAttendanceStatus = (studentId) => {
        const key = `${studentId}_${selectedDate}_${selectedShift}`;
        return attendance[key] || null;
    };

    const markAttendance = (studentId, status) => {
        if (isTripCompleted) return;
        const key = `${studentId}_${selectedDate}_${selectedShift}`;
        setAttendance({ ...attendance, [key]: status });
    };

    const handleCompleteTrip = () => {
        if (window.confirm('Are you sure you want to complete this trip? Attendance will be locked.')) {
            setIsTripCompleted(true);
        }
    };

    const filteredStudents = getStudentsForRoute();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Controls */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Select Route</label>
                    <select
                        className="form-select" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        value={selectedRoute}
                        onChange={e => { setSelectedRoute(e.target.value); setIsTripCompleted(false); }}
                    >
                        <option value="">-- Choose Route --</option>
                        {routes.map(r => <option key={r.id} value={r.id}>{r.name} ({r.code})</option>)}
                    </select>
                </div>
                <div style={{ width: '200px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                    />
                </div>
                <div style={{ width: '200px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Shift</label>
                    <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                        {['Morning', 'Evening'].map(shift => (
                            <button
                                key={shift}
                                onClick={() => setSelectedShift(shift)}
                                style={{
                                    flex: 1, padding: '8px', borderRadius: '6px', border: 'none',
                                    background: selectedShift === shift ? 'white' : 'transparent',
                                    color: selectedShift === shift ? '#4f46e5' : '#64748b',
                                    fontWeight: '600', cursor: 'pointer', boxShadow: selectedShift === shift ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                {shift}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Attendance List */}
            {selectedRoute ? (
                <div className="glass-card table-container">
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>Mark Attendance</h3>
                        {isTripCompleted ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontWeight: '600', fontSize: '14px', background: '#fff7ed', padding: '6px 12px', borderRadius: '20px' }}>
                                <FiLock /> Trip Completed & Locked
                            </span>
                        ) : (
                            <button
                                onClick={handleCompleteTrip}
                                className="btn-primary"
                                style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '8px', background: '#10b981', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Complete Trip
                            </button>
                        )}
                    </div>
                    <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '16px' }}>Student Details</th>
                                <th style={{ padding: '16px' }}>Pickup Point</th>
                                <th style={{ padding: '16px' }}>Status</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map(student => {
                                        const status = getAttendanceStatus(student.id);
                                        return (
                                            <motion.tr
                                                key={student.id}
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                style={{ borderBottom: '1px solid #f1f5f9' }}
                                            >
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '600', color: '#1e293b' }}>{student.name}</div>
                                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{student.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px', color: '#475569' }}>
                                                    <FiMapPin size={12} style={{ marginRight: 6 }} />{student.pickup}
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    {status ? (
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                                            padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                                            background: status === 'Present' ? '#ecfdf5' : status === 'Absent' ? '#fef2f2' : '#fff7ed',
                                                            color: status === 'Present' ? '#10b981' : status === 'Absent' ? '#ef4444' : '#f59e0b'
                                                        }}>
                                                            {status === 'Present' && <FiCheckCircle />}
                                                            {status === 'Absent' && <FiXCircle />}
                                                            {status === 'Skipped' && <FiSkipForward />}
                                                            {status}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>Pending</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                                    {!isTripCompleted && (
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                            <button
                                                                onClick={() => markAttendance(student.id, 'Present')}
                                                                title="Mark Present"
                                                                style={{
                                                                    border: 'none', borderRadius: '6px', width: 32, height: 32, cursor: 'pointer',
                                                                    background: status === 'Present' ? '#10b981' : '#f1f5f9',
                                                                    color: status === 'Present' ? 'white' : '#64748b'
                                                                }}
                                                            >
                                                                <FiCheckCircle />
                                                            </button>
                                                            <button
                                                                onClick={() => markAttendance(student.id, 'Absent')}
                                                                title="Mark Absent"
                                                                style={{
                                                                    border: 'none', borderRadius: '6px', width: 32, height: 32, cursor: 'pointer',
                                                                    background: status === 'Absent' ? '#ef4444' : '#f1f5f9',
                                                                    color: status === 'Absent' ? 'white' : '#64748b'
                                                                }}
                                                            >
                                                                <FiXCircle />
                                                            </button>
                                                            <button
                                                                onClick={() => markAttendance(student.id, 'Skipped')}
                                                                title="Skip / On Leave"
                                                                style={{
                                                                    border: 'none', borderRadius: '6px', width: 32, height: 32, cursor: 'pointer',
                                                                    background: status === 'Skipped' ? '#f59e0b' : '#f1f5f9',
                                                                    color: status === 'Skipped' ? 'white' : '#64748b'
                                                                }}
                                                            >
                                                                <FiSkipForward />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No students found in this route.</td></tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    <FiMap size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p>Select a route and date to view student list and mark attendance.</p>
                </div>
            )}
        </div>
    );
};

export default TransportAttendance;
