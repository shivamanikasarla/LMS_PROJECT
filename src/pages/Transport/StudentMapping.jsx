import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUserCheck, FiSearch, FiMapPin, FiTruck,
    FiAlertCircle, FiCheckCircle, FiTrash2, FiEdit2, FiPlus, FiX, FiGrid
} from 'react-icons/fi';
import StudentQRDisplay from '../../components/Transport/StudentQRDisplay';

const StudentMapping = () => {
    // --- State ---
    const [students, setStudents] = useState(() => {
        const saved = localStorage.getItem('lms_transport_students');
        return saved ? JSON.parse(saved) : [
            { id: 'S-2026001', name: 'Aarav Sharma', class: 'Class 10-A', routeId: 1, pickup: 'Central Station', shift: 'Morning', status: 'Active' },
            { id: 'S-2026002', name: 'Vivaan Gupta', class: 'Class 9-B', routeId: 1, pickup: 'Market Road', shift: 'Morning', status: 'Active' },
            { id: 'S-2026003', name: 'Aditya Kumar', class: 'Class 12-C', routeId: 2, pickup: 'Mall Road', shift: 'Evening', status: 'Active' },
        ];
    });

    const [routes, setRoutes] = useState([]); // Will load from localStorage
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null); // For editing/assigning
    const [isSheetOpen, setIsSheetOpen] = useState(false); // Side sheet for assignment

    // Form State
    const [assignForm, setAssignForm] = useState({
        routeId: '', pickup: '', shift: 'Morning'
    });

    // Add Student Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newStudentForm, setNewStudentForm] = useState({
        name: '', class: '', routeId: '', pickup: '', shift: 'Morning'
    });

    // QR Code Modal State
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [qrStudent, setQRStudent] = useState(null);

    // --- Effects ---
    useEffect(() => {
        const savedRoutes = localStorage.getItem('lms_transport_routes');
        if (savedRoutes) {
            setRoutes(JSON.parse(savedRoutes));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('lms_transport_students', JSON.stringify(students));
    }, [students]);

    // --- Helpers ---
    const getRouteDetails = (routeId) => routes.find(r => r.id === parseInt(routeId));

    const checkCapacity = (routeId) => {
        const route = getRouteDetails(routeId);
        if (!route) return false;
        // Count students in this route
        const currentCount = students.filter(s => s.routeId === route.id).length;
        return currentCount < route.capacity;
    };

    // --- Handlers ---
    const handleOpenAssign = (student) => {
        setSelectedStudent(student);
        setAssignForm({
            routeId: student.routeId || '',
            pickup: student.pickup || '',
            shift: student.shift || 'Morning'
        });
        setIsSheetOpen(true);
    };

    const handleClose = () => {
        setIsSheetOpen(false);
        setSelectedStudent(null);
    };

    const handleAssign = (e) => {
        e.preventDefault();

        // Capacity Check
        if (assignForm.routeId && parseInt(assignForm.routeId) !== selectedStudent.routeId) {
            if (!checkCapacity(assignForm.routeId)) {
                alert('Selected route is at full capacity! Please choose another route.');
                return;
            }
        }

        setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, ...assignForm, routeId: parseInt(assignForm.routeId) } : s));
        handleClose();
    };

    const handleUnassign = (id) => {
        if (window.confirm('Remove student from transport?')) {
            setStudents(students.map(s => s.id === id ? { ...s, routeId: null, pickup: '', shift: '' } : s));
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Add Student Handler ---
    const handleAddStudent = (e) => {
        e.preventDefault();
        const newId = `S-${Date.now()}`;
        const newStudent = {
            id: newId,
            name: newStudentForm.name,
            class: newStudentForm.class,
            routeId: newStudentForm.routeId ? parseInt(newStudentForm.routeId) : null,
            pickup: newStudentForm.pickup || '',
            shift: newStudentForm.shift || 'Morning',
            status: 'Active'
        };

        // Capacity check if route selected
        if (newStudent.routeId && !checkCapacity(newStudent.routeId)) {
            alert('Selected route is at full capacity!');
            return;
        }

        setStudents([...students, newStudent]);
        setIsAddModalOpen(false);
        setNewStudentForm({ name: '', class: '', routeId: '', pickup: '', shift: 'Morning' });
    };

    return (
        <div style={{ position: 'relative', minHeight: '600px' }}>
            {/* Header / Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flex: 1,
                    maxWidth: '400px',
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                }}>
                    <FiSearch color="#6366f1" size={20} />
                    <input
                        type="text"
                        placeholder="Search student by Name or ID..."
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            width: '100%',
                            fontSize: '14px',
                            color: '#334155',
                            fontWeight: '500'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: '600'
                    }}
                >
                    <FiPlus /> Add Student
                </button>
            </div>

            {/* List */}
            <div className="glass-card table-container">
                <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '16px' }}>Student</th>
                            <th style={{ padding: '16px' }}>Assigned Route</th>
                            <th style={{ padding: '16px' }}>Pickup Point</th>
                            <th style={{ padding: '16px' }}>Shift</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => {
                            const route = getRouteDetails(student.routeId);
                            return (
                                <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{student.name}</div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>{student.id} • {student.class}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        {route ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6366f1', background: '#e0e7ff', padding: '2px 8px', borderRadius: '4px' }}>{route.code}</span>
                                                <span style={{ fontSize: '13px', color: '#334155' }}>{route.name}</span>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Not Assigned</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '13px', color: '#334155' }}>
                                        {student.pickup ? <><FiMapPin size={12} style={{ marginRight: 4, color: '#64748b' }} /> {student.pickup}</> : '-'}
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '13px', color: '#334155' }}>{student.shift || '-'}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                            {student.routeId && (
                                                <button
                                                    onClick={() => {
                                                        setQRStudent(student);
                                                        setIsQRModalOpen(true);
                                                    }}
                                                    style={{
                                                        border: 'none',
                                                        background: '#eff6ff',
                                                        padding: 8,
                                                        borderRadius: 6,
                                                        cursor: 'pointer',
                                                        color: '#6366f1',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 4
                                                    }}
                                                    title="View QR Codes"
                                                >
                                                    <FiGrid size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleOpenAssign(student)}
                                                className="btn-primary"
                                                style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px' }}
                                            >
                                                {student.routeId ? 'Change Route' : 'Assign'}
                                            </button>
                                            {student.routeId && (
                                                <button
                                                    onClick={() => handleUnassign(student.id)}
                                                    style={{ border: 'none', background: '#fef2f2', padding: 8, borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Side Sheet for Assignment */}
            <AnimatePresence>
                {isSheetOpen && selectedStudent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={handleClose}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 50 }}
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed', top: 0, right: 0, height: '100%', width: '400px',
                                background: 'white', boxShadow: '-5px 0 25px rgba(0,0,0,0.1)', zIndex: 51,
                                padding: '32px', display: 'flex', flexDirection: 'column'
                            }}
                        >
                            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Assign Transport</h2>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                                Mapping <strong>{selectedStudent.name}</strong> to a route.
                            </p>

                            <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Select Route</label>
                                    <select
                                        className="form-select" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                        value={assignForm.routeId}
                                        onChange={e => setAssignForm({ ...assignForm, routeId: e.target.value, pickup: '' })} // Reset pickup on route change
                                        required
                                    >
                                        <option value="">-- Choose Route --</option>
                                        {routes.map(r => {
                                            const count = students.filter(s => s.routeId === r.id).length;
                                            const isFull = count >= r.capacity;
                                            return (
                                                <option key={r.id} value={r.id} disabled={isFull}>
                                                    {r.code} - {r.name} ({count}/{r.capacity} Seats) {isFull ? '[FULL]' : ''}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>

                                {assignForm.routeId && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Pickup Point</label>
                                        <select
                                            className="form-select" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                            value={assignForm.pickup}
                                            onChange={e => setAssignForm({ ...assignForm, pickup: e.target.value })}
                                            required
                                        >
                                            <option value="">-- Choose Stop --</option>
                                            {getRouteDetails(assignForm.routeId)?.stops.map((stop, i) => (
                                                <option key={i} value={stop}>{stop}</option>
                                            ))}
                                        </select>
                                    </motion.div>
                                )}

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Shift</label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {['Morning', 'Evening', 'Both'].map(option => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => setAssignForm({ ...assignForm, shift: option })}
                                                style={{
                                                    flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid',
                                                    borderColor: assignForm.shift === option ? '#6366f1' : '#e2e8f0',
                                                    background: assignForm.shift === option ? '#eff6ff' : 'transparent',
                                                    color: assignForm.shift === option ? '#4f46e5' : '#64748b',
                                                    fontWeight: '500', cursor: 'pointer'
                                                }}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                                    <button type="button" onClick={handleClose} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary" style={{ flex: 2, padding: '12px', background: '#4f46e5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: 'white' }}>
                                        Confirm Assignment
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Add Student Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: '-50%' }}
                            animate={{ opacity: 1, scale: 1, x: '-50%' }}
                            exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                            style={{
                                position: 'fixed', top: '80px', left: '50%',
                                width: 'calc(100% - 32px)', maxWidth: '480px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
                                background: 'white', borderRadius: '16px', padding: '24px', zIndex: 51,
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ margin: 0, fontSize: '20px' }}>Add New Student</h3>
                                <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} /></button>
                            </div>

                            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Student Name <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Aarav Sharma"
                                        value={newStudentForm.name}
                                        onChange={e => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Class <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Class 10-A"
                                        value={newStudentForm.class}
                                        onChange={e => setNewStudentForm({ ...newStudentForm, class: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px' }}>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Optional: Assign to route now</p>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Route (Optional)</label>
                                        <select
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                            value={newStudentForm.routeId}
                                            onChange={e => setNewStudentForm({ ...newStudentForm, routeId: e.target.value, pickup: '' })}
                                        >
                                            <option value="">-- No Route --</option>
                                            {routes.map(r => {
                                                const count = students.filter(s => s.routeId === r.id).length;
                                                const isFull = count >= r.capacity;
                                                return (
                                                    <option key={r.id} value={r.id} disabled={isFull}>
                                                        {r.code} - {r.name} ({count}/{r.capacity}) {isFull ? '[FULL]' : ''}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    {newStudentForm.routeId && (
                                        <div style={{ marginTop: '12px' }}>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Pickup Point</label>
                                            <select
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                                value={newStudentForm.pickup}
                                                onChange={e => setNewStudentForm({ ...newStudentForm, pickup: e.target.value })}
                                            >
                                                <option value="">-- Choose Stop --</option>
                                                {getRouteDetails(newStudentForm.routeId)?.stops.map((stop, i) => (
                                                    <option key={i} value={stop}>{stop}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <button type="submit" style={{ marginTop: '8px', padding: '12px', background: '#4f46e5', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                                    Add Student
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* QR Code Modal */}
            <AnimatePresence>
                {isQRModalOpen && qrStudent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsQRModalOpen(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.6)',
                                zIndex: 1000,
                                backdropFilter: 'blur(4px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px'
                            }}
                        >
                            <div onClick={(e) => e.stopPropagation()}>
                                <StudentQRDisplay
                                    student={qrStudent}
                                    route={getRouteDetails(qrStudent.routeId)}
                                    onClose={() => setIsQRModalOpen(false)}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentMapping;
