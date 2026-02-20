import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCheckCircle, FiXCircle, FiAlertCircle, FiClock, FiGrid, FiMapPin, FiRefreshCw, FiTruck
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useTransportTheme } from './TransportContext.jsx';
import TransportService from '../../services/transportService';

const TransportAttendance = () => {
    const theme = useTransportTheme();
    const isDark = theme?.isDark || false;

    // State
    const [selectedVehicle, setSelectedVehicle] = useState(''); // Vehicle ID
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedType, setSelectedType] = useState('pickup'); // 'pickup' or 'drop'
    // const [selectedMethod, setSelectedMethod] = useState('manual'); // 'manual' | 'qr_scanner' - Unused in new flow effectively, defaulting to manual

    // Modal State
    const [showBusQR, setShowBusQR] = useState(false);

    // Start with empty attendance map
    const [attendanceMap, setAttendanceMap] = useState({});

    // Data State
    const [vehicles, setVehicles] = useState([]);
    const [students, setStudents] = useState([]); // List of students on the vehicle's route
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const colors = {
        text: isDark ? '#f1f5f9' : '#1e293b',
        textMuted: isDark ? '#94a3b8' : '#64748b',
        bg: isDark ? '#0f172a' : '#ffffff',
        cardBg: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '#334155' : '#e2e8f0',
    };

    // Load Vehicles on Mount
    useEffect(() => {
        fetchVehicles();
    }, []);

    // Load Data when vehicle/date changes or vehicles loaded
    useEffect(() => {
        if (selectedDate && vehicles.length > 0) {
            fetchAttendanceAndStudents();
        }
    }, [selectedVehicle, selectedDate, vehicles]);

    const fetchVehicles = async () => {
        try {
            const data = await TransportService.Vehicle.getAllVehicles();
            if (data && Array.isArray(data)) {
                setVehicles(data);
            }
        } catch (err) {
            console.error("Failed to fetch vehicles", err);
        }
    };

    const fetchAttendanceAndStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch everything needed to build the correct list
            const [studentsData, assignmentsData, allAttendance] = await Promise.all([
                TransportService.Student.getAllStudents(),             // Admin: Student Names
                TransportService.Student.getStudentTransportMappings(), // Transport: Bus Assignments
                TransportService.Attendance.getAttendance()            // Transport: Today's Attendance
            ]);

            // 1. Process Students (Admin)
            // Create a Map for quick lookup: ID -> Name/Details
            const studentDetailsMap = {};
            (studentsData || []).forEach(s => {
                const user = s.user || {};
                const id = user.userId || s.id;
                studentDetailsMap[id] = {
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || s.name || 'Unknown',
                    originalId: id // Keep the original ID
                };
            });

            // 2. Process Assignments (Transport)
            // Filter assignments for the SELECTED VEHICLE and SHIFT
            let relevantAssignments = [];
            if (selectedVehicle && Array.isArray(assignmentsData)) {
                relevantAssignments = assignmentsData.filter(assignment => {
                    // Check Vehicle
                    const assignedVehicleId = assignment.vehicle?.id || assignment.vehicleId;
                    const matchesVehicle = parseInt(assignedVehicleId) === parseInt(selectedVehicle);

                    if (!matchesVehicle) return false;

                    // Check Shift
                    let shift = assignment.shift || 'Both'; // Default to Both if not specified (legacy support)
                    shift = String(shift).trim(); // Normalize

                    // Logic:
                    // Morning (pickup) -> Show 'Morning' OR 'Both'
                    // Evening (drop) -> Show 'Evening' OR 'Both'

                    if (selectedType === 'pickup') {
                        return shift.match(/^(Morning|Both)$/i);
                    } else if (selectedType === 'drop') {
                        return shift.match(/^(Evening|Both)$/i);
                    }
                    return true;
                });
            }

            // 3. Build Display List
            // Only show students who have a valid assignment for this bus/shift
            const studentsToDisplay = relevantAssignments.map(assignment => {
                const details = studentDetailsMap[assignment.studentId] || { name: 'Unknown Student' };
                return {
                    id: assignment.studentId,
                    name: details.name,
                    pickup: assignment.pickupPoint,
                    drop: assignment.dropPoint,
                    routeId: assignment.route?.id // If available
                };
            });

            setStudents(studentsToDisplay);

            // 4. Process Attendance
            const dateFiltered = Array.isArray(allAttendance)
                ? allAttendance.filter(r => r.attendanceDate === selectedDate)
                : [];

            const newMap = {};
            dateFiltered.forEach(record => {
                if (record) newMap[record.studentId] = record;
            });
            setAttendanceMap(newMap);

        } catch (err) {
            console.error("Failed to load data", err);
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const parseStudentId = (id) => {
        if (typeof id === 'number') return id;
        if (typeof id === 'string') {
            const match = id.match(/\d+/);
            if (match) return parseInt(match[0]);
        }
        return id;
    };

    const markAttendance = async (student, status) => {
        try {
            const studentNumId = parseStudentId(student.id);
            const currentVehicle = vehicles.find(v => v.id === parseInt(selectedVehicle));

            // We need Route ID for the backend entity
            const routeId = currentVehicle?.route?.id || currentVehicle?.route?.routeCode;

            if (!routeId) {
                alert("This vehicle does not have a valid route assigned. Cannot mark attendance.");
                return;
            }

            // Existing record
            const existingRecord = attendanceMap[studentNumId] || {};

            // Payload
            const payload = {
                id: existingRecord.id || null,
                studentId: studentNumId,
                route: { id: parseInt(routeId) }, // Assuming backend wants ID
                attendanceDate: selectedDate,
                markedBy: 'MANUAL',
                vehicle: { id: parseInt(selectedVehicle) },
                pickupStatus: selectedType === 'pickup' ? status : (existingRecord.pickupStatus || 'ABSENT'),
                dropStatus: selectedType === 'drop' ? status : (existingRecord.dropStatus || 'ABSENT'),
            };

            // Status Mapper
            let backendStatus = 'ABSENT';
            if (status === 'picked') backendStatus = 'PICKED_UP';
            else if (status === 'dropped') backendStatus = 'DROPPED';
            else if (status === 'absent') backendStatus = 'ABSENT';
            else if (status === 'rejected') backendStatus = 'SKIPPED';

            if (selectedType === 'pickup') payload.pickupStatus = backendStatus;
            else payload.dropStatus = backendStatus;

            // Call Service
            const savedRecord = await TransportService.Attendance.markAttendance(payload);

            // Update Local
            setAttendanceMap(prev => ({
                ...prev,
                [studentNumId]: savedRecord
            }));

        } catch (err) {
            console.error("Failed to mark attendance", err);
            alert("Failed to save attendance: " + err.message);
        }
    };

    const getStatusForDisplay = (student) => {
        const studentNumId = parseStudentId(student.id);
        const record = attendanceMap[studentNumId];
        if (!record) return null;

        const statusEnum = selectedType === 'pickup' ? record.pickupStatus : record.dropStatus;
        if (!statusEnum) return null;

        if (statusEnum === 'PICKED_UP') return 'picked';
        if (statusEnum === 'DROPPED') return 'dropped';
        if (statusEnum === 'ABSENT') return 'absent';
        if (statusEnum === 'SKIPPED') return 'rejected';
        return null;
    };

    // Stats
    const getStats = () => {
        const total = students.length;
        let present = 0;
        let absent = 0;
        let rejected = 0;

        students.forEach(s => {
            const st = getStatusForDisplay(s);
            if (st === 'picked' || st === 'dropped') present++;
            else if (st === 'absent') absent++;
            else if (st === 'rejected') rejected++;
        });

        return { present, absent, rejected, expected: total };
    };

    const stats = getStats();

    // Get Current Vehicle Info for QR
    const getCurrentVehicleInfo = () => {
        const v = vehicles.find(v => v.id === parseInt(selectedVehicle));
        return v ? `${v.vehicleNumber} ${v.route ? '(R-' + v.route.routeCode + ')' : ''}` : '';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Controls */}
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>

                    {/* Select Vehicle */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.textMuted, marginBottom: '8px' }}>
                            Select Vehicle
                        </label>
                        <select
                            value={selectedVehicle}
                            onChange={(e) => setSelectedVehicle(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 12px', borderRadius: '8px',
                                border: `1px solid ${colors.border}`, background: colors.bg,
                                color: colors.text, fontSize: '14px', outline: 'none'
                            }}
                        >
                            <option value="">Select a Vehicle...</option>
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.vehicleNumber} {v.route ? `(Route ${v.route.routeCode})` : '(No Route)'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.textMuted, marginBottom: '8px' }}>
                            Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 12px', borderRadius: '8px',
                                border: `1px solid ${colors.border}`, background: colors.bg,
                                color: colors.text, fontSize: '14px', outline: 'none'
                            }}
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.textMuted, marginBottom: '8px' }}>
                            Session Type
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 12px', borderRadius: '8px',
                                border: `1px solid ${colors.border}`, background: colors.bg,
                                color: colors.text, fontSize: '14px', outline: 'none'
                            }}
                        >
                            <option value="pickup">Morning Pickup</option>
                            <option value="drop">Evening Drop</option>
                        </select>
                    </div>

                    {/* Top Actions */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                        <button
                            onClick={fetchAttendanceAndStudents}
                            disabled={loading}
                            style={{
                                padding: '10px 16px', borderRadius: '8px', border: 'none',
                                background: loading ? colors.border : '#6366f1', color: 'white',
                                cursor: loading ? 'wait' : 'pointer', fontWeight: '600',
                                display: 'flex', alignItems: 'center', gap: '8px', height: '42px', flex: 1, justifyContent: 'center'
                            }}
                        >
                            <FiRefreshCw className={loading ? 'spin' : ''} />
                            Refresh
                        </button>

                        {/* Show Bus QR Button */}
                        <button
                            onClick={() => setShowBusQR(true)}
                            disabled={!selectedVehicle}
                            style={{
                                padding: '10px 16px', borderRadius: '8px', border: `1px solid ${colors.border}`,
                                background: isDark ? '#1e293b' : 'white', color: colors.text,
                                cursor: !selectedVehicle ? 'not-allowed' : 'pointer', fontWeight: '600',
                                display: 'flex', alignItems: 'center', gap: '8px', height: '42px', flex: 1, justifyContent: 'center'
                            }}
                        >
                            <FiGrid />
                            Bus QR
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <StatCard icon={<FiCheckCircle />} count={stats.present} label="Present" color="#10b981" isDark={isDark} />
                <StatCard icon={<FiXCircle />} count={stats.absent} label="Absent" color="#ef4444" isDark={isDark} />
                <StatCard icon={<FiAlertCircle />} count={stats.rejected} label="Skipped" color="#f59e0b" isDark={isDark} />
                <StatCard icon={<FiClock />} count={stats.expected} label="Expected" color="#6366f1" isDark={isDark} />
            </div>

            {/* Student List */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: colors.textMuted }}>Loading data...</div>
                ) : students.length > 0 ? (
                    students.map((student, index) => {
                        const status = getStatusForDisplay(student);
                        const record = attendanceMap[parseStudentId(student.id)];
                        const isMarkedByQR = record?.markedBy === 'QRCODE';

                        return (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                style={{
                                    padding: '20px 24px',
                                    borderBottom: index < students.length - 1 ? `1px solid ${colors.border}` : 'none',
                                    display: 'flex', alignItems: 'center', gap: '16px'
                                }}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    background: isDark ? '#334155' : '#f1f5f9',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '18px', fontWeight: '700', color: colors.text
                                }}>
                                    {student.name.charAt(0)}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '15px', fontWeight: '600', color: colors.text }}>
                                        {student.name}
                                    </div>
                                    <div style={{ fontSize: '13px', color: colors.textMuted, marginTop: '2px' }}>
                                        ID: {student.id} • Stop: {student.pickup || 'N/A'}
                                        {!selectedVehicle && student.routeId && (
                                            <span style={{ marginLeft: '8px', background: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                                                Route {student.routeId}
                                            </span>
                                        )}
                                    </div>
                                    {record && (
                                        <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            Marked By: {record.markedBy}
                                            {isMarkedByQR && <FiGrid size={12} />}
                                        </div>
                                    )}
                                </div>

                                {/* Status Badge */}
                                {status && (
                                    <span style={{
                                        padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600',
                                        background: status === 'picked' || status === 'dropped' ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5') :
                                            status === 'absent' ? (isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2') :
                                                (isDark ? 'rgba(251, 191, 36, 0.15)' : '#fff7ed'),
                                        color: status === 'picked' || status === 'dropped' ? '#10b981' :
                                            status === 'absent' ? '#ef4444' : '#f59e0b'
                                    }}>
                                        {status.toUpperCase()}
                                    </span>
                                )}

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <button
                                        onClick={() => markAttendance(student, selectedType === 'pickup' ? 'picked' : 'dropped')}
                                        disabled={!selectedVehicle}
                                        style={{
                                            padding: '8px', borderRadius: '8px', border: 'none',
                                            background: isDark ? '#334155' : '#ecfdf5',
                                            color: !selectedVehicle ? colors.textMuted : '#10b981',
                                            cursor: !selectedVehicle ? 'not-allowed' : 'pointer',
                                            opacity: !selectedVehicle ? 0.5 : 1
                                        }}
                                        title={!selectedVehicle ? "Select a vehicle to mark attendance" : (selectedType === 'pickup' ? "Mark Picked Up" : "Mark Dropped")}
                                    >
                                        <FiCheckCircle size={16} />
                                    </button>
                                    <button
                                        onClick={() => markAttendance(student, 'absent')}
                                        disabled={!selectedVehicle}
                                        style={{
                                            padding: '8px', borderRadius: '8px', border: 'none',
                                            background: isDark ? '#334155' : '#fef2f2',
                                            color: !selectedVehicle ? colors.textMuted : '#ef4444',
                                            cursor: !selectedVehicle ? 'not-allowed' : 'pointer',
                                            opacity: !selectedVehicle ? 0.5 : 1
                                        }}
                                        title={!selectedVehicle ? "Select a vehicle to mark attendance" : "Mark Absent"}
                                    >
                                        <FiXCircle size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div style={{ padding: '60px', textAlign: 'center', color: colors.textMuted }}>
                        No students found.
                    </div>
                )}
            </div>

            {/* Bus QR Modal */}
            <AnimatePresence>
                {showBusQR && selectedVehicle && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowBusQR(false)}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <div
                            onClick={e => e.stopPropagation()}
                            style={{
                                background: colors.cardBg, borderRadius: '24px', padding: '40px',
                                maxWidth: '450px', width: '90%', textAlign: 'center',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            <h2 style={{ color: colors.text, margin: '0 0 8px 0', fontSize: '24px' }}>Scan for Attendance</h2>
                            <p style={{ color: colors.textMuted, marginBottom: '32px' }}>
                                Students should scan this QR code on the bus.
                            </p>

                            <div style={{
                                background: 'white', padding: '24px', borderRadius: '20px',
                                display: 'inline-block', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                <QRCodeSVG
                                    value={JSON.stringify({
                                        type: 'TRANSPORT_ATTENDANCE',
                                        vehicleId: parseInt(selectedVehicle),
                                        date: selectedDate,
                                        tripType: selectedType,
                                        // Optional: Add a rolling token or signature for security
                                        timestamp: Date.now()
                                    })}
                                    size={250}
                                    level="H"
                                />
                            </div>

                            <div style={{ marginTop: '32px', textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366f1', marginBottom: '4px' }}>
                                    {getCurrentVehicleInfo()}
                                </div>
                                <div style={{ fontSize: '14px', color: colors.textMuted }}>
                                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    {' • '}
                                    {selectedType === 'pickup' ? 'Morning Pickup' : 'Evening Drop'}
                                </div>
                            </div>

                            <button
                                onClick={() => setShowBusQR(false)}
                                style={{
                                    marginTop: '40px', width: '100%', padding: '16px',
                                    borderRadius: '12px', border: 'none', background: '#6366f1',
                                    color: 'white', fontWeight: '600', fontSize: '16px', cursor: 'pointer',
                                    transition: 'transform 0.1s'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Simple Stat Card Component (unchanged)
const StatCard = ({ icon, count, label, color, isDark }) => (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: isDark ? `${color}20` : `${color}15`,
            color: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px'
        }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: isDark ? '#f1f5f9' : '#1e293b' }}>
                {count}
            </div>
            <div style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b' }}>
                {label}
            </div>
        </div>
    </div>
);

export default TransportAttendance;
