import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUserCheck, FiSearch, FiMapPin, FiTruck,
    FiAlertCircle, FiCheckCircle, FiTrash2, FiEdit2, FiPlus, FiX, FiGrid
} from 'react-icons/fi';
import StudentQRDisplay from '../../components/Transport/StudentQRDisplay';
import TransportService from '../../services/transportService';

const StudentMapping = () => {
    // --- State ---
    const [students, setStudents] = useState([]);
    const [vehicles, setVehicles] = useState([]); // Changed from routes to vehicles
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null); // For editing/assigning
    const [isSheetOpen, setIsSheetOpen] = useState(false); // Side sheet for assignment

    // Form State
    const [assignForm, setAssignForm] = useState({
        vehicleId: '', pickup: '', shift: 'Morning'
    });

    // QR Code Modal State
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [qrStudent, setQRStudent] = useState(null);

    // --- Effects ---
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Vehicles from Transport Service
            const vehiclesData = await TransportService.Vehicle.getAllVehicles();
            setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);

            // 2. Fetch Students from Admin Service (Users)
            const usersData = await TransportService.Student.getAllStudents();
            console.log("Fetched Users:", usersData); // Debug log

            const mappedStudents = Array.isArray(usersData) ? usersData.map(studentEntity => {
                const user = studentEntity.user || {};
                return {
                    id: user.userId || studentEntity.id,
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Unknown',
                    class: studentEntity.grade || 'N/A',
                    // Assume backend has 'vehicleId' or we maintain 'routeId' but UI shows vehicle. 
                    // Ideally, we start tracking vehicleId.
                    vehicleId: user.vehicleId || null,
                    pickup: user.pickupPoint || '',
                    shift: user.shift || 'Morning',
                    status: user.enabled ? 'Active' : 'Inactive'
                };
            }) : [];

            setStudents(mappedStudents);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Helpers ---
    const getVehicleDetails = (vehicleId) => vehicles.find(v => v.id === parseInt(vehicleId));

    // Capacity Check (Optional: Buses have capacity too)
    const checkCapacity = (vehicleId) => {
        const vehicle = getVehicleDetails(vehicleId);
        if (!vehicle) return false;
        const currentCount = students.filter(s => s.vehicleId === vehicle.id).length;
        // Check 'capacity' field, default to 40 if missing
        return currentCount < (vehicle.capacity || 40);
    };

    // --- Handlers ---
    const handleOpenAssign = (student) => {
        setSelectedStudent(student);
        setAssignForm({
            vehicleId: student.vehicleId || '',
            pickup: student.pickup || '',
            shift: student.shift || 'Morning'
        });
        setIsSheetOpen(true);
    };

    const handleClose = () => {
        setIsSheetOpen(false);
        setSelectedStudent(null);
    };

    const handleAssign = async (e) => {
        e.preventDefault();

        // Capacity Check
        if (assignForm.vehicleId && parseInt(assignForm.vehicleId) !== selectedStudent.vehicleId) {
            if (!checkCapacity(assignForm.vehicleId)) {
                alert('Selected bus is at full capacity! Please choose another bus.');
                return;
            }
        }

        try {
            const updatedStudentData = {
                ...selectedStudent,
                vehicleId: parseInt(assignForm.vehicleId), // Sending vehicleId to backend
                pickupPoint: assignForm.pickup,
                shift: assignForm.shift
            };

            // Call API
            await TransportService.Student.updateStudent(selectedStudent.id, updatedStudentData);

            // Optimistic UI Update
            setStudents(students.map(s => s.id === selectedStudent.id ? {
                ...s,
                vehicleId: parseInt(assignForm.vehicleId),
                pickup: assignForm.pickup,
                shift: assignForm.shift
            } : s));

            handleClose();
        } catch (error) {
            console.error("Assignment failed", error);
            alert("Failed to assign bus. Please try again.");
        }
    };

    const handleUnassign = async (id) => {
        if (window.confirm('Remove student from transport?')) {
            try {
                const student = students.find(s => s.id === id);
                if (!student) return;

                const updatedData = {
                    ...student,
                    vehicleId: null,
                    pickupPoint: null,
                    shift: null
                };

                await TransportService.Student.updateStudent(id, updatedData);

                setStudents(students.map(s => s.id === id ? { ...s, vehicleId: null, pickup: '', shift: '' } : s));
            } catch (error) {
                console.error("Unassign failed", error);
                alert("Failed to remove student from transport.");
            }
        }
    };

    // Filter Logic
    const filteredStudents = students.filter(s =>
        (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.id && String(s.id).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading students...</div>;
    }

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
            </div>

            {/* List */}
            <div className="glass-card table-container">
                <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '16px' }}>Student</th>
                            <th style={{ padding: '16px' }}>Assigned Bus</th>
                            <th style={{ padding: '16px' }}>Pickup Point</th>
                            <th style={{ padding: '16px' }}>Shift</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => {
                            const vehicle = getVehicleDetails(student.vehicleId);
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
                                        {vehicle ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6366f1', background: '#e0e7ff', padding: '2px 8px', borderRadius: '4px' }}>{vehicle.vehicleNumber}</span>
                                                <span style={{ fontSize: '13px', color: '#334155' }}>Type: {vehicle.type}</span>
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
                                            {student.vehicleId && (
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
                                                {student.vehicleId ? 'Change Bus' : 'Assign'}
                                            </button>
                                            {student.vehicleId && (
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
                            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Assign Bus</h2>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                                Mapping <strong>{selectedStudent.name}</strong> to a vehicle.
                            </p>

                            <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Select Bus</label>
                                    <select
                                        className="form-select" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                        value={assignForm.vehicleId}
                                        onChange={e => setAssignForm({ ...assignForm, vehicleId: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Choose Bus --</option>
                                        {vehicles.map(v => {
                                            const count = students.filter(s => s.vehicleId === v.id).length;
                                            const capacity = v.capacity || 40;
                                            const isFull = count >= capacity;
                                            return (
                                                <option key={v.id} value={v.id} disabled={isFull}>
                                                    {v.vehicleNumber} ({v.type}) - ({count}/{capacity} Seats) {isFull ? '[FULL]' : ''}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>

                                {assignForm.vehicleId && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Pickup Point</label>
                                        <input
                                            type="text"
                                            className="form-select" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                            value={assignForm.pickup}
                                            onChange={e => setAssignForm({ ...assignForm, pickup: e.target.value })}
                                            placeholder="Enter pickup location"
                                        />
                                        {/* Note: Vehicles don't inherently have stops like Routes unless we join them. For now, manual entry or empty. */}
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
                                    route={getVehicleDetails(qrStudent.vehicleId)} // Passing vehicle as route prop for now, or update component
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
