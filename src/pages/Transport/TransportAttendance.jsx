import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCheckCircle, FiXCircle, FiAlertCircle, FiClock, FiGrid, FiMapPin
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { generateQRData, validateQRData, recordQRScan, getTodaysScans } from '../../utils/qrGenerator';
import { useTransportTheme } from './Transport';

const TransportAttendance = () => {
    const theme = useTransportTheme();
    const isDark = theme?.isDark || false;

    // State
    const [selectedTrip, setSelectedTrip] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedType, setSelectedType] = useState('pickup'); // pickup | drop
    const [selectedMethod, setSelectedMethod] = useState('manual'); // manual | qr
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [attendance, setAttendance] = useState({});
    const [qrScans, setQRScans] = useState([]);

    // Manual Override Modal
    const [showOverrideModal, setShowOverrideModal] = useState(false);
    const [overrideStudent, setOverrideStudent] = useState(null);
    const [overrideNewStatus, setOverrideNewStatus] = useState('');
    const [overrideReason, setOverrideReason] = useState('');

    // Data
    const [routes, setRoutes] = useState([]);
    const [students, setStudents] = useState([]);

    const colors = {
        text: isDark ? '#f1f5f9' : '#1e293b',
        textMuted: isDark ? '#94a3b8' : '#64748b',
        bg: isDark ? '#0f172a' : '#ffffff',
        cardBg: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '#334155' : '#e2e8f0',
    };

    // Load data
    useEffect(() => {
        const savedRoutes = JSON.parse(localStorage.getItem('lms_transport_routes') || '[]');
        const savedStudents = JSON.parse(localStorage.getItem('lms_transport_students') || '[]');
        setRoutes(savedRoutes);
        setStudents(savedStudents);
        setQRScans(getTodaysScans());
    }, []);

    // Get stats
    const getStats = () => {
        const allStudents = selectedTrip ? students.filter(s => s.routeId === parseInt(selectedTrip)) : students;

        const present = allStudents.filter(s => {
            const key = `${s.id}_${selectedDate}_${selectedType}`;
            return attendance[key] === 'picked' || attendance[key] === 'dropped';
        }).length;

        const absent = allStudents.filter(s => {
            const key = `${s.id}_${selectedDate}_${selectedType}`;
            return attendance[key] === 'absent';
        }).length;

        const rejected = allStudents.filter(s => {
            const key = `${s.id}_${selectedDate}_${selectedType}`;
            return attendance[key] === 'rejected';
        }).length;

        return {
            present,
            absent,
            rejected,
            expected: allStudents.length
        };
    };

    const stats = getStats();

    // Get students for display
    const getFilteredStudents = () => {
        if (!selectedTrip) return [];
        return students.filter(s => s.routeId === parseInt(selectedTrip));
    };

    const filteredStudents = getFilteredStudents();

    // Mark attendance
    const markAttendance = (studentId, status) => {
        const key = `${studentId}_${selectedDate}_${selectedType}`;
        setAttendance(prev => ({ ...prev, [key]: status }));
    };

    // Get attendance status
    const getAttendanceStatus = (studentId) => {
        const key = `${studentId}_${selectedDate}_${selectedType}`;
        return attendance[key] || null;
    };

    // Get QR scan info for student
    const getQRScanInfo = (studentId) => {
        return qrScans.find(scan =>
            scan.studentId === studentId &&
            scan.tripType === selectedType.toUpperCase() &&
            scan.date === selectedDate
        );
    };

    // Handle QR token view
    const showQRToken = (student) => {
        setSelectedStudent(student);
        setShowQRModal(true);
    };

    // Generate QR token
    const generateToken = (studentId) => {
        return `TOKEN-${studentId.replace(/[^0-9A-Z]/g, '')}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    };

    // Calculate expiry time (end of day)
    const getExpiryTime = () => {
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        const diff = endOfDay - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Controls */}
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {/* Select Trip */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.textMuted, marginBottom: '8px' }}>
                            Select Trip
                        </label>
                        <select
                            value={selectedTrip}
                            onChange={(e) => setSelectedTrip(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: `1px solid ${colors.border}`,
                                background: colors.bg,
                                color: colors.text,
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        >
                            <option value="">Select a Trip...</option>
                            {routes.map(route => (
                                <option key={route.id} value={route.id}>{route.name} ({route.code})</option>
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
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: `1px solid ${colors.border}`,
                                background: colors.bg,
                                color: colors.text,
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.textMuted, marginBottom: '8px' }}>
                            Type
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: `1px solid ${colors.border}`,
                                background: colors.bg,
                                color: colors.text,
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        >
                            <option value="pickup">Morning Pickup</option>
                            <option value="drop">Evening Drop</option>
                        </select>
                    </div>

                    {/* Method */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.textMuted, marginBottom: '8px' }}>
                            Method
                        </label>
                        <select
                            value={selectedMethod}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: `1px solid ${colors.border}`,
                                background: colors.bg,
                                color: colors.text,
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        >
                            <option value="manual">Manual Entry</option>
                            <option value="qr">QR Token Scan</option>
                        </select>
                    </div>
                </div>
            </div >

            {/* Stat Cards */}
            < div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <StatCard icon={<FiCheckCircle />} count={stats.present} label="Present" color="#10b981" isDark={isDark} />
                <StatCard icon={<FiXCircle />} count={stats.absent} label="Absent" color="#ef4444" isDark={isDark} />
                <StatCard icon={<FiAlertCircle />} count={stats.rejected} label="Rejected" color="#f59e0b" isDark={isDark} />
                <StatCard icon={<FiClock />} count={stats.expected} label="Expected" color="#6366f1" isDark={isDark} />
            </div >

            {/* Student List */}
            {
                filteredStudents.length > 0 ? (
                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        {filteredStudents.map((student, index) => {
                            const status = getAttendanceStatus(student.id);
                            const qrScan = getQRScanInfo(student.id);

                            return (
                                <motion.div
                                    key={student.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{
                                        padding: '20px 24px',
                                        borderBottom: index < filteredStudents.length - 1 ? `1px solid ${colors.border}` : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px'
                                    }}
                                >
                                    {/* Avatar */}
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: isDark ? '#334155' : '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: colors.text
                                    }}>
                                        {student.name.charAt(0)}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '15px', fontWeight: '600', color: colors.text }}>
                                            {student.name}
                                        </div>
                                        <div style={{ fontSize: '13px', color: colors.textMuted, marginTop: '2px' }}>
                                            {student.id} • {student.pickup || 'No pickup location'}
                                        </div>
                                        {status && (
                                            <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                                {/* GPS Coordinates */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FiMapPin size={12} />
                                                    <span>12.9716, 775946</span>
                                                </div>
                                                {/* Timestamp */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FiClock size={12} />
                                                    <span>{qrScan?.scanTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                                </div>
                                                {/* Method Badge */}
                                                <span style={{
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    background: qrScan ? (isDark ? 'rgba(99, 102, 241, 0.15)' : '#eff6ff') : (isDark ? 'rgba(148, 163, 184, 0.15)' : '#f1f5f9'),
                                                    color: qrScan ? '#6366f1' : colors.textMuted
                                                }}>
                                                    {qrScan ? 'QR' : 'Manual'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Badge */}
                                    <div>
                                        {status ? (
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                background: status === 'picked' || status === 'dropped' ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5') :
                                                    status === 'absent' ? (isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2') :
                                                        (isDark ? 'rgba(251, 191, 36, 0.15)' : '#fff7ed'),
                                                color: status === 'picked' || status === 'dropped' ? '#10b981' :
                                                    status === 'absent' ? '#ef4444' : '#f59e0b'
                                            }}>
                                                {status === 'picked' ? 'Picked' : status === 'dropped' ? 'Dropped' : status === 'absent' ? 'Absent' : 'Rejected'}
                                            </span>
                                        ) : (
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                background: isDark ? '#1e293b' : '#f8fafc',
                                                color: colors.textMuted
                                            }}>
                                                Pending
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        {/* QR Icon - always visible */}
                                        <button
                                            onClick={() => showQRToken(student)}
                                            style={{
                                                padding: '8px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                background: isDark ? '#334155' : '#eff6ff',
                                                color: '#6366f1',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title="View QR Token"
                                        >
                                            <FiGrid size={16} />
                                        </button>

                                        {/* Manual Entry Mode - Always show action buttons */}
                                        {selectedMethod === 'manual' && (
                                            <>
                                                <button
                                                    onClick={() => markAttendance(student.id, selectedType === 'pickup' ? 'picked' : 'dropped')}
                                                    style={{
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        background: status === 'picked' || status === 'dropped' ? '#10b981' : (isDark ? '#334155' : '#ecfdf5'),
                                                        color: status === 'picked' || status === 'dropped' ? 'white' : '#10b981',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Mark Present"
                                                >
                                                    <FiCheckCircle size={16} />
                                                </button>
                                                <button
                                                    onClick={() => markAttendance(student.id, 'absent')}
                                                    style={{
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        background: status === 'absent' ? '#ef4444' : (isDark ? '#334155' : '#fef2f2'),
                                                        color: status === 'absent' ? 'white' : '#ef4444',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Mark Absent"
                                                >
                                                    <FiXCircle size={16} />
                                                </button>

                                                {/* Edit button - visible if attendance is marked */}
                                                {status && (
                                                    <button
                                                        onClick={() => {
                                                            setOverrideStudent(student);
                                                            setOverrideNewStatus('');
                                                            setOverrideReason('');
                                                            setShowOverrideModal(true);
                                                        }}
                                                        style={{
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            background: isDark ? '#334155' : '#fff7ed',
                                                            color: '#f59e0b',
                                                            cursor: 'pointer'
                                                        }}
                                                        title="Edit Attendance"
                                                    >
                                                        <FiAlertCircle size={16} />
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {/* QR Scan Mode - Show scan button only when pending */}
                                        {selectedMethod === 'qr' && (
                                            <>
                                                {!status && (
                                                    <button
                                                        onClick={() => {
                                                            // Simulate scan
                                                            markAttendance(student.id, selectedType === 'pickup' ? 'picked' : 'dropped');
                                                            setQRScans([...qrScans, {
                                                                studentId: student.id,
                                                                tripType: selectedType.toUpperCase(),
                                                                date: selectedDate,
                                                                scanTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                                                            }]);
                                                        }}
                                                        style={{
                                                            padding: '8px 16px',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            background: '#1e293b',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontSize: '13px',
                                                            fontWeight: '600',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}
                                                    >
                                                        <FiGrid size={14} /> Scan Token
                                                    </button>
                                                )}

                                                {/* Manual override buttons in QR mode */}
                                                {status && (
                                                    <>
                                                        <button
                                                            onClick={() => markAttendance(student.id, 'absent')}
                                                            style={{
                                                                padding: '8px',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                background: status === 'absent' ? '#ef4444' : (isDark ? '#334155' : '#fef2f2'),
                                                                color: status === 'absent' ? 'white' : '#ef4444',
                                                                cursor: 'pointer'
                                                            }}
                                                            title="Mark Absent"
                                                        >
                                                            <FiXCircle size={16} />
                                                        </button>

                                                        {/* Edit button */}
                                                        <button
                                                            onClick={() => {
                                                                setOverrideStudent(student);
                                                                setOverrideNewStatus('');
                                                                setOverrideReason('');
                                                                setShowOverrideModal(true);
                                                            }}
                                                            style={{
                                                                padding: '8px',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                background: isDark ? '#334155' : '#fff7ed',
                                                                color: '#f59e0b',
                                                                cursor: 'pointer'
                                                            }}
                                                            title="Edit Attendance"
                                                        >
                                                            <FiAlertCircle size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                        <FiClock size={48} style={{ color: colors.textMuted, opacity: 0.3, marginBottom: '16px' }} />
                        <p style={{ color: colors.textMuted, fontSize: '15px' }}>
                            Please select a trip to view students
                        </p>
                    </div>
                )
            }

            {/* QR Token Modal */}
            <AnimatePresence>
                {showQRModal && selectedStudent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowQRModal(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.5)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 1000,
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                padding: '80px 20px 20px',
                                overflowY: 'auto'
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background: colors.cardBg,
                                    borderRadius: '16px',
                                    padding: '32px',
                                    maxWidth: '500px',
                                    width: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                {/* Title */}
                                <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: colors.text }}>
                                    Student QR Token
                                </h3>
                                <p style={{ margin: '0 0 24px', fontSize: '14px', color: colors.textMuted }}>
                                    Security token for {selectedStudent.name}
                                </p>

                                {/* QR Code */}
                                <div style={{
                                    background: '#ffffff',
                                    padding: '24px',
                                    borderRadius: '12px',
                                    display: 'inline-block',
                                    marginBottom: '16px'
                                }}>
                                    <QRCodeSVG
                                        value={JSON.stringify({
                                            studentId: selectedStudent.id,
                                            name: selectedStudent.name,
                                            type: selectedType,
                                            date: selectedDate
                                        })}
                                        size={200}
                                        level="H"
                                    />
                                </div>

                                {/* Token */}
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    letterSpacing: '2px',
                                    color: colors.text,
                                    marginBottom: '24px'
                                }}>
                                    {generateToken(selectedStudent.id)}
                                </div>

                                {/* Info */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '16px',
                                    marginBottom: '24px',
                                    textAlign: 'left'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '4px' }}>Validity:</div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>Active</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '4px' }}>Expires:</div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>{getExpiryTime()}</div>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '4px' }}>Scans today:</div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>
                                            {qrScans.filter(s => s.studentId === selectedStudent.id && s.date === selectedDate).length}
                                        </div>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => setShowQRModal(false)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: '#6366f1',
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Done
                                </button>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Manual Override Modal */}
            <AnimatePresence>
                {showOverrideModal && overrideStudent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowOverrideModal(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.5)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 1001,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px'
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background: colors.cardBg,
                                    borderRadius: '16px',
                                    padding: '32px',
                                    maxWidth: '550px',
                                    width: '100%'
                                }}
                            >
                                {/* Title */}
                                <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '700', color: colors.text }}>
                                    Manual Override
                                </h3>
                                <p style={{ margin: '0 0 32px', fontSize: '14px', color: colors.textMuted }}>
                                    Adjusting status for <strong>{overrideStudent.name}</strong>
                                </p>

                                {/* New Status Dropdown */}
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '8px' }}>
                                        New Status
                                    </label>
                                    <select
                                        value={overrideNewStatus}
                                        onChange={(e) => setOverrideNewStatus(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            border: `1px solid ${colors.border}`,
                                            background: colors.bg,
                                            color: colors.text,
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="">Select New Status</option>
                                        <option value="picked">Picked</option>
                                        <option value="dropped">Dropped</option>
                                        <option value="absent">Absent</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>

                                {/* Reason Textarea */}
                                <div style={{ marginBottom: '32px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '8px' }}>
                                        Reason for Override
                                    </label>
                                    <textarea
                                        value={overrideReason}
                                        onChange={(e) => setOverrideReason(e.target.value)}
                                        placeholder="Enter reason for audit..."
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            border: `1px solid ${colors.border}`,
                                            background: colors.bg,
                                            color: colors.text,
                                            fontSize: '14px',
                                            outline: 'none',
                                            minHeight: '120px',
                                            resize: 'vertical',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => {
                                            setShowOverrideModal(false);
                                            setOverrideNewStatus('');
                                            setOverrideReason('');
                                        }}
                                        style={{
                                            padding: '10px 24px',
                                            borderRadius: '8px',
                                            border: `1px solid ${colors.border}`,
                                            background: isDark ? '#1e293b' : '#f8fafc',
                                            color: colors.text,
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!overrideNewStatus) {
                                                alert('Please select a new status');
                                                return;
                                            }
                                            if (!overrideReason.trim()) {
                                                alert('Please provide a reason for the override');
                                                return;
                                            }

                                            // Get current status
                                            const key = `${overrideStudent.id}_${selectedDate}_${selectedType}`;
                                            const currentStatus = attendance[key];

                                            // Log the edit
                                            const editLog = JSON.parse(localStorage.getItem('attendance_edit_log') || '[]');
                                            editLog.push({
                                                studentId: overrideStudent.id,
                                                studentName: overrideStudent.name,
                                                previousStatus: currentStatus || 'None',
                                                newStatus: overrideNewStatus,
                                                date: selectedDate,
                                                type: selectedType,
                                                reason: overrideReason,
                                                editedAt: new Date().toISOString(),
                                                editedBy: 'Admin'
                                            });
                                            localStorage.setItem('attendance_edit_log', JSON.stringify(editLog));

                                            // Apply new status
                                            if (overrideNewStatus === 'pending') {
                                                // Remove attendance
                                                const newAttendance = { ...attendance };
                                                delete newAttendance[key];
                                                setAttendance(newAttendance);
                                                // Remove from QR scans
                                                setQRScans(qrScans.filter(s => !(s.studentId === overrideStudent.id && s.date === selectedDate && s.tripType === selectedType.toUpperCase())));
                                            } else {
                                                // Set new status
                                                setAttendance({ ...attendance, [key]: overrideNewStatus });
                                            }

                                            // Close modal
                                            setShowOverrideModal(false);
                                            setOverrideNewStatus('');
                                            setOverrideReason('');
                                        }}
                                        style={{
                                            padding: '10px 24px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: '#6366f1',
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Apply Override
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div >
    );
};

// Stat Card Component
const StatCard = ({ icon, count, label, color, isDark }) => (
    <div style={{
        background: isDark ? '#1e293b' : '#ffffff',
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: `${color}15`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
            }}>
                {icon}
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#f1f5f9' : '#1e293b' }}>
                {count}
            </div>
        </div>
        <div style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: '500' }}>
            {label}
        </div>
    </div>
);

export default TransportAttendance;
