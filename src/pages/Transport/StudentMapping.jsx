import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUserCheck, FiSearch, FiMapPin, FiTruck,
    FiAlertCircle, FiCheckCircle, FiTrash2, FiEdit2, FiPlus, FiX, FiGrid
} from 'react-icons/fi';
import StudentQRDisplay from '../../components/Transport/StudentQRDisplay';
import TransportService from '../../services/transportService';

// ... (imports)

const StudentMapping = () => {
    // --- State ---
    const [students, setStudents] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Form State
    const [assignForm, setAssignForm] = useState({
        vehicleId: '', pickup: '', drop: '', shift: 'Morning'
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
            // Fetch dependencies in parallel but handle failures individually
            const [studentsResponse, vehiclesResponse, routesResponse, assignmentsResponse] = await Promise.allSettled([
                TransportService.Student.getAllStudents(),
                TransportService.Vehicle.getAllVehicles(),
                TransportService.Route.getAllRoutes(),
                TransportService.Student.getStudentTransportMappings()
            ]);

            // Handle Students
            let usersData = [];
            if (studentsResponse.status === 'fulfilled') {
                usersData = studentsResponse.value;
            } else {
                console.error("Failed to fetch students", studentsResponse.reason);
            }

            // Handle Vehicles
            if (vehiclesResponse.status === 'fulfilled') {
                setVehicles(Array.isArray(vehiclesResponse.value) ? vehiclesResponse.value : []);
            }

            // Handle Routes
            if (routesResponse.status === 'fulfilled') {
                setRoutes(Array.isArray(routesResponse.value) ? routesResponse.value : []);
            }

            // Handle Assignments
            let assignmentMap = {};

            if (assignmentsResponse.status === 'fulfilled') {
                let rawData = assignmentsResponse.value;
                let validArray = [];

                if (Array.isArray(rawData)) {
                    validArray = rawData;
                } else if (rawData && Array.isArray(rawData.content)) {
                    validArray = rawData.content;
                } else if (rawData && Array.isArray(rawData.data)) {
                    validArray = rawData.data;
                } else {
                    console.warn("Unexpected assignments data structure:", rawData);
                }

                if (validArray.length > 0) {
                    console.log("Assignments Array:", validArray);

                    validArray.forEach(assignment => {
                        const sId = assignment.studentId || assignment.student?.id || assignment.student?.userId;
                        if (sId) {
                            assignmentMap[String(sId)] = assignment;
                        }
                    });
                }
            } else {
                console.warn("Assignments fetch failed:", assignmentsResponse.reason);
            }

            // Merge
            const mappedStudents = Array.isArray(usersData) ? usersData.map(studentEntity => {
                const user = studentEntity.user || studentEntity;
                const studentId = user.userId || user.id || studentEntity.id;

                const assignment = assignmentMap[String(studentId)];

                const vehicleId = assignment
                    ? (assignment.vehicle?.id || assignment.vehicleId)
                    : (studentEntity.vehicleId || user.vehicleId || null);

                const pickup = assignment
                    ? assignment.pickupPoint
                    : (studentEntity.pickupPoint || user.pickupPoint || '');

                const drop = assignment
                    ? assignment.dropPoint
                    : (studentEntity.dropPoint || user.dropPoint || '');

                const shift = assignment
                    ? assignment.shift
                    : (studentEntity.shift || user.shift || '');

                return {
                    id: studentId,
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || user.name || 'Unknown',
                    class: studentEntity.grade || user.grade || 'N/A',
                    assignmentId: assignment ? assignment.id : null, // Store Assignment ID for Deletion
                    vehicleId: vehicleId,
                    pickup: pickup,
                    drop: drop,
                    shift: shift,
                    status: (user.enabled !== undefined ? user.enabled : true) ? 'Active' : 'Inactive'
                };
            }) : [];

            mappedStudents.sort((a, b) => {
                const aAssigned = a.vehicleId ? 1 : 0;
                const bAssigned = b.vehicleId ? 1 : 0;
                if (aAssigned !== bAssigned) return bAssigned - aAssigned;
                return a.name.localeCompare(b.name);
            });

            setStudents(mappedStudents);

        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    // ... (rest of the file remains same)

    // --- Helpers ---
    const getVehicleDetails = (vehicleId) => vehicles.find(v => v.id === parseInt(vehicleId));

    const checkCapacity = (vehicleId) => {
        const vehicle = getVehicleDetails(vehicleId);
        if (!vehicle) return false;
        const currentCount = students.filter(s => s.vehicleId === vehicle.id).length;
        return currentCount < (vehicle.capacity || 40);
    };

    // --- Handlers ---
    const [assignStep, setAssignStep] = useState('search');
    const [assignSearchTerm, setAssignSearchTerm] = useState('');

    const handleOpenAssignStream = () => {
        setAssignStep('search');
        setAssignSearchTerm('');
        setSelectedStudent(null);
        setIsSheetOpen(true);
    };

    const handleSelectStudentForAssign = (student) => {
        setSelectedStudent(student);
        setAssignForm({
            vehicleId: '',
            pickup: '',
            drop: '',
            shift: 'Morning'
        });
        setAssignStep('form');
    };

    const handleEditAssign = (student) => {
        setSelectedStudent(student);
        setAssignForm({
            vehicleId: student.vehicleId || '',
            pickup: student.pickup || '',
            drop: student.drop || '',
            shift: student.shift || 'Morning'
        });
        setAssignStep('form');
        setIsSheetOpen(true);
    };

    const handleClose = () => {
        setIsSheetOpen(false);
        setSelectedStudent(null);
        setAssignStep('search');
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
            const mappingData = {
                studentId: selectedStudent.id,
                vehicleId: parseInt(assignForm.vehicleId),
                pickupPoint: assignForm.pickup,
                dropPoint: assignForm.drop,
                shift: assignForm.shift
            };

            // Call API
            await TransportService.Student.assignStudentToBus(mappingData);

            // Optimistic UI Update
            setStudents(students.map(s => s.id === selectedStudent.id ? {
                ...s,
                vehicleId: parseInt(assignForm.vehicleId),
                pickup: assignForm.pickup,
                drop: assignForm.drop,
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

                if (student.assignmentId) {
                    // Correct way: Delete the assignment record
                    await TransportService.Student.deleteAssignment(student.assignmentId);
                } else {
                    console.warn("No assignment ID found, falling back to legacy update (might fail)");
                    // Fallback (Legacy): Try updating student record directly
                    const updatedData = {
                        ...student,
                        vehicleId: null,
                        pickupPoint: null,
                        dropPoint: null,
                        shift: null
                    };
                    await TransportService.Student.updateStudent(id, updatedData);
                }

                // Optimistic UI Update
                setStudents(students.map(s => s.id === id ? {
                    ...s,
                    assignmentId: null,
                    vehicleId: null,
                    pickup: '',
                    drop: '',
                    shift: ''
                } : s));

            } catch (error) {
                console.error("Unassign failed", error);
                alert("Failed to remove student from transport: " + (error.response?.data?.message || error.message));
            }
        }
    };

    // Filter Logic for Main Table (Only Assigned)
    const assignedStudents = students.filter(s =>
        s.vehicleId &&
        ((s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (s.id && String(s.id).toLowerCase().includes(searchTerm.toLowerCase())))
    );

    // Filter Logic for Assign Search (Only Unassigned)
    const unassignedStudents = students.filter(s =>
        !s.vehicleId &&
        ((s.name && s.name.toLowerCase().includes(assignSearchTerm.toLowerCase())) ||
            (s.id && String(s.id).toLowerCase().includes(assignSearchTerm.toLowerCase())))
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
                        placeholder="Search assigned students..."
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
                    onClick={handleOpenAssignStream}
                    className="btn-primary"
                    style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        background: '#4f46e5',
                        color: 'white',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)'
                    }}
                >
                    <FiPlus /> Assign New Student
                </button>
            </div>

            {/* List */}
            <div className="glass-card table-container">
                {/* ... existing table code ... */}
                <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '16px' }}>Student</th>
                            <th style={{ padding: '16px' }}>Assigned Bus</th>
                            <th style={{ padding: '16px' }}>Pickup Point</th>
                            <th style={{ padding: '16px' }}>Drop Point</th>
                            <th style={{ padding: '16px' }}>Shift</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedStudents.length > 0 ? (
                            assignedStudents.map(student => {
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
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Not Assigned</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#334155' }}>
                                            {student.pickup ? <><FiMapPin size={12} style={{ marginRight: 4, color: '#64748b' }} /> {student.pickup}</> : '-'}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#334155' }}>
                                            {student.drop ? <><FiMapPin size={12} style={{ marginRight: 4, color: '#64748b' }} /> {student.drop}</> : '-'}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#334155' }}>{student.shift || '-'}</td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                <button
                                                    onClick={() => handleEditAssign(student)}
                                                    className="btn-primary"
                                                    style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', background: 'white', color: '#4f46e5', border: '1px solid #e0e7ff' }}
                                                >
                                                    <FiEdit2 /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleUnassign(student.id)}
                                                    style={{ border: 'none', background: '#fef2f2', padding: 8, borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                    No students assigned to transport yet. Click "Assign New Student" to start.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Side Sheet for Assignment */}
            <AnimatePresence>
                {isSheetOpen && (
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
                            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
                                {assignStep === 'search' ? 'Search Student' : 'Assign Bus'}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                                {assignStep === 'search'
                                    ? 'Find a student to assign transport.'
                                    : <>Mapping <strong>{selectedStudent?.name}</strong> to a vehicle.</>
                                }
                            </p>

                            {assignStep === 'search' ? (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <input
                                        type="text"
                                        placeholder="Search by Name or ID..."
                                        autoFocus
                                        style={{
                                            padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1',
                                            width: '100%', fontSize: '14px'
                                        }}
                                        value={assignSearchTerm}
                                        onChange={(e) => setAssignSearchTerm(e.target.value)}
                                    />

                                    <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                                        {unassignedStudents.length > 0 ? (
                                            unassignedStudents.map(s => (
                                                <div
                                                    key={s.id}
                                                    onClick={() => handleSelectStudentForAssign(s)}
                                                    style={{
                                                        padding: '12px', borderBottom: '1px solid #f1f5f9',
                                                        cursor: 'pointer', transition: 'background 0.2s',
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                                >
                                                    <div>
                                                        <div style={{ fontWeight: '600' }}>{s.name}</div>
                                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{s.class}</div>
                                                    </div>
                                                    <FiPlus color="#6366f1" />
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                                                {assignSearchTerm ? 'No matching unassigned students.' : 'Type to search...'}
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={handleClose} style={{ padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
                                        Cancel
                                    </button>
                                </div>
                            ) : (
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
                                                        {v.vehicleNumber} {v.route ? `- (${v.route.routeName})` : ''} - ({count}/{capacity} Seats) {isFull ? '[FULL]' : ''}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>

                                    {assignForm.vehicleId && (
                                        <>
                                            {/* Shift Selection */}
                                            <div style={{ marginBottom: '16px' }}>
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
                                                                fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Pickup Point</label>
                                                {(() => {
                                                    const selectedVeh = vehicles.find(v => v.id == assignForm.vehicleId);
                                                    let fullRoute = null;
                                                    if (selectedVeh?.route) {
                                                        if (selectedVeh.route.id) fullRoute = routes.find(r => r.id == selectedVeh.route.id);
                                                        if (!fullRoute && selectedVeh.route.routeCode) fullRoute = routes.find(r => r.routeCode == selectedVeh.route.routeCode);
                                                    } else if (selectedVeh?.routeId) {
                                                        fullRoute = routes.find(r => r.id == selectedVeh.routeId);
                                                    }

                                                    let points = [];
                                                    if (assignForm.shift === 'Evening') {
                                                        points = fullRoute?.dropPoints || selectedVeh?.route?.dropPoints || [];
                                                    } else {
                                                        points = fullRoute?.pickupPoints || selectedVeh?.route?.pickupPoints || [];
                                                    }

                                                    if (points.length > 0) {
                                                        return (
                                                            <select
                                                                className="form-select" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                                                value={assignForm.pickup}
                                                                onChange={e => setAssignForm({ ...assignForm, pickup: e.target.value })}
                                                            >
                                                                <option value="">-- Select Pickup Point --</option>
                                                                {points.map((point, index) => {
                                                                    const pointName = typeof point === 'object' ? (point.stopName || point.name) : point;
                                                                    return <option key={index} value={pointName}>{pointName}</option>;
                                                                })}
                                                            </select>
                                                        );
                                                    } else {
                                                        return (
                                                            <input type="text" className="form-select" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }} value={assignForm.pickup} onChange={e => setAssignForm({ ...assignForm, pickup: e.target.value })} placeholder="Enter pickup location" />
                                                        );
                                                    }
                                                })()}
                                            </motion.div>

                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px' }}>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Drop Point</label>
                                                {(() => {
                                                    const selectedVeh = vehicles.find(v => v.id == assignForm.vehicleId);
                                                    let fullRoute = null;
                                                    if (selectedVeh?.route) {
                                                        if (selectedVeh.route.id) fullRoute = routes.find(r => r.id == selectedVeh.route.id);
                                                        if (!fullRoute && selectedVeh.route.routeCode) fullRoute = routes.find(r => r.routeCode == selectedVeh.route.routeCode);
                                                    } else if (selectedVeh?.routeId) {
                                                        fullRoute = routes.find(r => r.id == selectedVeh.routeId);
                                                    }

                                                    let points = [];
                                                    if (assignForm.shift === 'Evening') {
                                                        points = fullRoute?.pickupPoints || selectedVeh?.route?.pickupPoints || [];
                                                    } else {
                                                        points = fullRoute?.dropPoints || selectedVeh?.route?.dropPoints || [];
                                                    }

                                                    if (points.length > 0) {
                                                        return (
                                                            <select
                                                                className="form-select" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                                                value={assignForm.drop}
                                                                onChange={e => setAssignForm({ ...assignForm, drop: e.target.value })}
                                                            >
                                                                <option value="">-- Select Drop Point --</option>
                                                                {points.map((point, index) => {
                                                                    const pointName = typeof point === 'object' ? (point.stopName || point.name) : point;
                                                                    return <option key={index} value={pointName}>{pointName}</option>;
                                                                })}
                                                            </select>
                                                        );
                                                    } else {
                                                        return (
                                                            <input type="text" className="form-select" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }} value={assignForm.drop} onChange={e => setAssignForm({ ...assignForm, drop: e.target.value })} placeholder="Enter drop location" />
                                                        );
                                                    }
                                                })()}
                                            </motion.div>
                                        </>
                                    )}

                                    <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                                        <button type="button" onClick={() => setAssignStep('search')} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}>
                                            Back
                                        </button>
                                        <button type="submit" className="btn-primary" style={{ flex: 2, padding: '12px', background: '#4f46e5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: 'white' }}>
                                            Confirm
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* QR Code Modal (Preserved) */}
            <AnimatePresence>
                {isQRModalOpen && qrStudent && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsQRModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} >
                            <div onClick={(e) => e.stopPropagation()}>
                                <StudentQRDisplay student={qrStudent} route={getVehicleDetails(qrStudent.vehicleId)} onClose={() => setIsQRModalOpen(false)} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentMapping;
