import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiTruck, FiUser, FiArrowLeft, FiChevronRight,
    FiCheckCircle, FiAlertCircle, FiSettings,
    FiFileText, FiPlus, FiDownload, FiClock, FiMapPin, FiCreditCard,
    FiLayers, FiSave, FiX, FiCheck
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import TransportService from '../../services/transportService';

const TransportFees = () => {
    // --- State ---
    const [routes, setRoutes] = useState([]);
    const [students, setStudents] = useState([]);

    // Fee Config
    const [fees, setFees] = useState({});

    // Student Specific Overrides
    const [studentOverrides, setStudentOverrides] = useState({});

    // Transactions
    const [transactions, setTransactions] = useState([]);

    // Settings
    const [settings, setSettings] = useState({ lateFee: 0, dueDate: 5 });

    // Navigation
    const [view, setView] = useState('status');
    const [statusView, setStatusView] = useState('routes');
    const [activeRoute, setActiveRoute] = useState(null);
    const [activeStudentProfile, setActiveStudentProfile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusSearch, setStatusSearch] = useState('');

    // Config View
    const [configSearch, setConfigSearch] = useState('');
    const [selectedConfigItem, setSelectedConfigItem] = useState(null);
    const [configForm, setConfigForm] = useState({ annual: '' });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Modal
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [paymentForm, setPaymentForm] = useState({ amount: '', mode: 'Cash', date: '', remarks: '', isThirdParty: false });
    const [studentSearchQuery, setStudentSearchQuery] = useState(''); // For searching in modal

    // Stats
    const [stats, setStats] = useState({ total: 0, collected: 0, pending: 0 });

    useEffect(() => {
        // Load initial data
        try {
            const savedFees = localStorage.getItem('lms_transport_fees_config');
            const savedOverrides = localStorage.getItem('lms_transport_fee_overrides');
            const savedTxns = localStorage.getItem('lms_transport_transactions');
            const savedSettings = localStorage.getItem('lms_transport_settings');

            if (savedFees) setFees(JSON.parse(savedFees));
            if (savedOverrides) setStudentOverrides(JSON.parse(savedOverrides));
            if (savedTxns) setTransactions(JSON.parse(savedTxns));
            if (savedSettings) setSettings(JSON.parse(savedSettings));
        } catch (e) {
            console.error("Error loading local storage:", e);
        }

        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch All Required Data in Parallel
            const [routesResponse, studentsResponse, assignmentsResponse, vehiclesResponse] = await Promise.allSettled([
                TransportService.Route.getAllRoutes(),
                TransportService.Student.getAllStudents(),
                TransportService.Student.getStudentTransportMappings(),
                TransportService.Vehicle.getAllVehicles()
            ]);

            // 0. Process Vehicles (To map Vehicle -> Route)
            let vehicleRouteMap = {};
            if (vehiclesResponse.status === 'fulfilled') {
                const vehiclesData = vehiclesResponse.value;
                const rawVehicles = Array.isArray(vehiclesData) ? vehiclesData : (vehiclesData?.data || []);
                rawVehicles.forEach(v => {
                    const rId = (v.route && v.route.id) ? v.route.id : v.routeId;
                    if (v.id && rId) {
                        vehicleRouteMap[String(v.id)] = String(rId);
                    }
                });
            }

            // 1. Process Routes
            let processedRoutes = [];
            if (routesResponse.status === 'fulfilled') {
                const routesData = routesResponse.value;
                console.log("Routes Data:", routesData);
                let rawRoutes = [];
                if (Array.isArray(routesData)) rawRoutes = routesData;
                else if (routesData?.data && Array.isArray(routesData.data)) rawRoutes = routesData.data;
                else if (routesData?.routes && Array.isArray(routesData.routes)) rawRoutes = routesData.routes;

                processedRoutes = rawRoutes.map(r => ({
                    id: String(r.id || r.routeId),
                    name: String(r.name || r.routeName || r.route_name || 'Unnamed Route'),
                    code: String(r.code || r.routeCode || r.route_code || 'N/A')
                })).filter(r => r.id);
                setRoutes(processedRoutes);
            } else {
                console.error("Failed to fetch routes:", routesResponse.reason);
                setError("Failed to fetch routes.");
            }

            // 2. Process Assignments (Mappings)
            let assignmentMap = {}; // Map studentId -> routeId
            if (assignmentsResponse.status === 'fulfilled') {
                const assignmentsData = assignmentsResponse.value;
                console.log("Assignments Data:", assignmentsData);
                let rawAssignments = [];
                if (Array.isArray(assignmentsData)) rawAssignments = assignmentsData;
                else if (assignmentsData?.content && Array.isArray(assignmentsData.content)) rawAssignments = assignmentsData.content; // Pagination support
                else if (assignmentsData?.data && Array.isArray(assignmentsData.data)) rawAssignments = assignmentsData.data;

                rawAssignments.forEach(assignment => {
                    const getVal = (val) => (val && typeof val === 'object' && val.id) ? val.id : val;
                    const sId = getVal(assignment.studentId) || getVal(assignment.student?.id) || getVal(assignment.student?.userId);

                    // Try direct route
                    let rId = getVal(assignment.routeId) || getVal(assignment.route?.id);

                    // Try via Vehicle
                    if (!rId) {
                        const vId = getVal(assignment.vehicleId) || getVal(assignment.vehicle?.id);
                        if (vId && vehicleRouteMap[String(vId)]) {
                            rId = vehicleRouteMap[String(vId)];
                        } else if (assignment.vehicle) {
                            // Fallback to nested vehicle object if logic matches
                            const vehicleObj = assignment.vehicle;
                            rId = getVal(vehicleObj.routeId) || getVal(vehicleObj.route?.id);
                        }
                    }

                    if (sId && rId) {
                        assignmentMap[String(sId)] = String(rId);
                    }
                });
            } else {
                console.warn("Failed to fetch assignments (optional but recommended):", assignmentsResponse.reason);
            }

            // 3. Process Students & Link with Routes
            if (studentsResponse.status === 'fulfilled') {
                const studentsData = studentsResponse.value;
                let rawStudents = [];
                if (Array.isArray(studentsData)) rawStudents = studentsData;
                else if (studentsData?.students && Array.isArray(studentsData.students)) rawStudents = studentsData.students;

                const mappedStudents = rawStudents.map(s => {
                    const user = s.user || {};
                    const studentId = String(user.userId || s.id || Math.random());

                    let assignedRouteId = assignmentMap[studentId];
                    if (!assignedRouteId) {
                        const directRoute = s.routeId || user.routeId;
                        if (directRoute && typeof directRoute === 'object' && directRoute.id) assignedRouteId = directRoute.id;
                        else assignedRouteId = directRoute;
                    }

                    return {
                        id: studentId,
                        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || s.name || 'Unknown',
                        routeId: assignedRouteId ? String(assignedRouteId) : null,
                        class: s.grade || s.class || 'N/A',
                        pickup: s.pickupPoint || 'N/A',
                        rollNo: s.rollNo || s.admissionNo || 'N/A'
                    };
                });
                setStudents(mappedStudents);
            } else {
                console.error("Failed to fetch students:", studentsResponse.reason);
                setError("Failed to fetch students.");
            }

        } catch (error) {
            console.error("Critical error in fetchData:", error);
            setError("Unexpected error loading data.");
        } finally {
            setLoading(false);
        }
    };

    // --- Helpers ---
    const getStudentFee = (student) => {
        if (!student) return 0;
        if (studentOverrides && studentOverrides[student.id]?.annual) return parseInt(studentOverrides[student.id].annual) || 0;
        if (!student.routeId) return 0;
        if (fees && fees[student.routeId]?.annual) return parseInt(fees[student.routeId].annual) || 0;
        return 0;
    };

    const getStudentPaidAmount = (studentId) => {
        if (!transactions) return 0;
        return transactions
            .filter(t => t.studentId === studentId)
            .reduce((sum, t) => sum + (parseInt(t.amount) || 0), 0);
    };

    const getStudentFeeStatus = (student) => {
        const fee = getStudentFee(student);
        const paid = getStudentPaidAmount(student.id);
        if (fee === 0) return 'Not Set';
        if (paid >= fee) return 'Paid';
        if (paid > 0) return 'Partial';
        return 'Pending';
    };

    // Stats Effect
    useEffect(() => {
        if (!students) return;
        let total = 0, collected = 0;
        students.forEach(s => {
            const fee = getStudentFee(s);
            if (fee > 0) {
                total += fee;
                collected += getStudentPaidAmount(s.id);
            }
        });
        setStats({ total, collected, pending: Math.max(0, total - collected) });
    }, [students, fees, transactions, studentOverrides]);

    // Persistence
    useEffect(() => {
        localStorage.setItem('lms_transport_fees_config', JSON.stringify(fees));
        localStorage.setItem('lms_transport_fee_overrides', JSON.stringify(studentOverrides));
        localStorage.setItem('lms_transport_transactions', JSON.stringify(transactions));
        localStorage.setItem('lms_transport_settings', JSON.stringify(settings));
    }, [fees, transactions, settings, studentOverrides]);

    // --- Config Logic ---
    useEffect(() => {
        if (!selectedConfigItem || !fees) return;

        const existing = fees[selectedConfigItem.id] || {};
        setConfigForm({
            annual: existing.annual || ''
        });
    }, [selectedConfigItem, fees]);

    const handleConfigFormChange = (field, value) => {
        setConfigForm({ ...configForm, [field]: value });
    };

    const handleSaveConfig = () => {
        if (!selectedConfigItem) return;
        setFees({ ...fees, [selectedConfigItem.id]: configForm });
        alert(`Fee Structure Saved for ${selectedConfigItem.name}!`);
    };

    // Payment Actions
    const openPaymentModal = (student = null) => {
        setSelectedStudent(student);
        setStudentSearchQuery(''); // Reset search

        if (student) {
            // Pre-fill amount if coming from a specific student
            const fee = getStudentFee(student);
            const paid = getStudentPaidAmount(student.id);
            const due = Math.max(0, fee - paid);
            setPaymentForm({
                amount: due,
                mode: 'UPI', // Default to UPI as per screenshot
                date: new Date().toISOString().split('T')[0],
                remarks: '',
                isThirdParty: false
            });
        } else {
            // Reset form for manual entry
            setPaymentForm({
                amount: '0.00',
                mode: 'UPI',
                date: new Date().toISOString().split('T')[0],
                remarks: '',
                isThirdParty: false
            });
        }
        setShowPaymentModal(true);
    };

    // Select student from within modal search
    const selectStudentForPayment = (student) => {
        setSelectedStudent(student);
        const fee = getStudentFee(student);
        const paid = getStudentPaidAmount(student.id);
        const due = Math.max(0, fee - paid);
        setPaymentForm({
            ...paymentForm,
            amount: due,
        });
    };

    const handleAddPayment = () => {
        if (!selectedStudent || !paymentForm.amount) return;
        const newTxn = {
            id: `txn_${Date.now()}`,
            studentId: selectedStudent.id,
            studentName: selectedStudent.name,
            routeId: selectedStudent.routeId,
            amount: parseInt(paymentForm.amount),
            mode: paymentForm.mode,
            date: paymentForm.date,
            remarks: paymentForm.remarks,
            isThirdParty: paymentForm.isThirdParty,
            timestamp: new Date().toISOString()
        };
        setTransactions([newTxn, ...transactions]);
        setShowPaymentModal(false);
    };

    const handleDownloadReceipt = (txn) => {
        alert(`Generating Receipt for ${txn.id}...`);
    };

    // --- Renders ---

    // 3. Fee Structure (Config) Render
    const renderConfigSplitView = () => {
        const safeRoutes = routes || [];
        const filteredRoutes = safeRoutes.filter(item => {
            if (!item) return false;
            const query = (configSearch || '').toLowerCase();
            const name = String(item.name || '').toLowerCase();
            const code = String(item.code || '').toLowerCase();
            return name.includes(query) || code.includes(query);
        });

        return (
            <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', minHeight: '500px', overflow: 'hidden', padding: 0 }}>
                {/* Left Panel: Sidebar (Routes Only) */}
                <div style={{ borderRight: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>All Routes ({safeRoutes.length})</div>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <FiSearch color="#94a3b8" />
                            <input
                                placeholder="Search Route (Config)..."
                                value={configSearch}
                                onChange={e => setConfigSearch(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%', marginLeft: '8px' }}
                            />
                        </div>
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
                        {loading ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading Backend Data...</div>
                        ) : error ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
                        ) : filteredRoutes.length === 0 ? (
                            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                                No routes found used '{configSearch}'
                            </div>
                        ) : (
                            filteredRoutes.map(item => {
                                const isSelected = selectedConfigItem?.id === item.id;
                                const isConfigured = fees[item.id]?.annual;

                                return (
                                    <div key={item.id} onClick={() => setSelectedConfigItem(item)} style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '4px', cursor: 'pointer', background: isSelected ? '#e0e7ff' : 'transparent', color: isSelected ? '#4f46e5' : '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <FiTruck size={14} color={isSelected ? '#4f46e5' : '#64748b'} />
                                            <div>
                                                <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.name}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>{item.code}</div>
                                            </div>
                                        </div>
                                        {isConfigured && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Panel: Content (Route Form Only) */}
                <div style={{ padding: '40px', background: 'white', display: 'flex', flexDirection: 'column' }}>
                    {!selectedConfigItem ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column', gap: 16 }}>
                            <FiLayers size={48} style={{ opacity: 0.2 }} /><div>Select a Route to configure fees</div>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={selectedConfigItem.id}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '32px' }}>
                                <div style={{ width: 56, height: 56, borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiTruck size={24} /></div>
                                <div><h2 style={{ margin: 0 }}>{selectedConfigItem.name}</h2><p style={{ margin: '4px 0', color: '#64748b' }}>Route Code: {selectedConfigItem.code || 'N/A'}</p></div>
                            </div>

                            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px' }}>Fee Configuration</h3>

                            <div style={{ display: 'grid', gap: '24px', maxWidth: '500px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Total Route Fee</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}><span style={{ color: '#94a3b8', marginRight: '8px' }}>₹</span><input type="number" value={configForm.annual} onChange={e => handleConfigFormChange('annual', e.target.value)} placeholder="e.g. 6000" style={{ border: 'none', width: '100%', outline: 'none', fontSize: '16px', background: 'transparent', fontWeight: 'bold' }} /></div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>/ year</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '24px' }}>
                                    <button onClick={handleSaveConfig} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px', background: '#4f46e5', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}>
                                        <FiSave /> Save Structure
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        );
    };

    // 1. Fee Status Render (Routes Grid)
    const renderRoutesGrid = () => {
        const safeRoutes = routes || [];
        const filteredRoutes = safeRoutes.filter(r => {
            if (!r) return false;
            const query = (statusSearch || '').toLowerCase();
            const name = String(r.name || '').toLowerCase();
            const code = String(r.code || '').toLowerCase();
            return name.includes(query) || code.includes(query);
        });

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ background: 'white', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', width: '300px' }}>
                        <FiSearch color="#94a3b8" />
                        <input
                            placeholder="Search Route to View Status..."
                            value={statusSearch}
                            onChange={e => setStatusSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '14px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {loading ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading Routess...</div>
                    ) : filteredRoutes.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No routes match your search</div>
                    ) : (
                        filteredRoutes.map(route => {
                            const routeStudents = (students || []).filter(s => String(s.routeId) === String(route.id));
                            const paidCount = routeStudents.filter(s => getStudentFeeStatus(s) === 'Paid').length;
                            const pendingCount = routeStudents.length - paidCount;
                            const feeConfigured = fees[route.id]?.annual ? true : false;

                            return (
                                <motion.div key={route.id} whileHover={{ y: -5 }} className="glass-card" onClick={() => { setActiveRoute(route); setStatusView('list'); setSearchTerm(''); }} style={{ padding: '24px', cursor: 'pointer', borderTop: `4px solid ${feeConfigured ? '#4f46e5' : '#cbd5e1'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}><div style={{ fontWeight: 'bold', fontSize: '18px' }}>{route.name}</div><div style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{route.code}</div></div>
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '14px', color: '#64748b' }}><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiUser /> {routeStudents.length} Students</div><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FaRupeeSign /> {fees[route.id]?.annual || 'No Fee'}</div></div>
                                    <div style={{ background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', height: '8px', marginBottom: '8px' }}><div style={{ width: `${routeStudents.length ? (paidCount / routeStudents.length) * 100 : 0}%`, height: '100%', background: '#10b981', transition: 'width 0.5s' }} /></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600' }}><span style={{ color: '#10b981' }}>{paidCount} Paid</span><span style={{ color: '#f59e0b' }}>{pendingCount} Pending</span></div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    };

    const renderStudentList = () => {
        const filteredStudents = (students || [])
            .filter(s => String(s.routeId) === String(activeRoute?.id))
            .filter(s => s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()));

        return (
            <div className="glass-card table-container">
                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><button onClick={() => setStatusView('routes')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center' }}><FiArrowLeft size={20} color="#64748b" /></button><h3 style={{ margin: 0 }}>{activeRoute?.name} - Student List</h3></div>
                    <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                        <FiSearch color="#94a3b8" />
                        <input
                            placeholder="Search Student..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', fontSize: '13px' }}
                        />
                    </div>
                </div>
                {filteredStudents.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No students assigned to this route found.</div>
                ) : (
                    <table className="premium-table" style={{ width: '100%' }}>
                        <thead><tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px' }}><th style={{ padding: '16px' }}>Student</th><th style={{ padding: '16px' }}>Class</th><th style={{ padding: '16px' }}>Fee Status</th><th style={{ padding: '16px' }}>Fee / Paid</th><th style={{ padding: '16px', textAlign: 'right' }}>Actions</th></tr></thead>
                        <tbody>
                            {filteredStudents.map(student => {
                                const status = getStudentFeeStatus(student); const fee = getStudentFee(student); const paid = getStudentPaidAmount(student.id); const isCustom = !!studentOverrides[student.id];
                                return (
                                    <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}><td onClick={() => { setActiveStudentProfile(student); setStatusView('details'); }} style={{ padding: '16px', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{student.name} {isCustom && <span style={{ fontSize: '10px', background: '#e0e7ff', color: '#4f46e5', padding: '2px 6px', borderRadius: '4px' }}>Custom</span>} <FiChevronRight size={14} color="#94a3b8" /></div></td><td style={{ padding: '16px' }}>{student.class}</td><td style={{ padding: '16px' }}><span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: status === 'Paid' ? '#ecfdf5' : status === 'Partial' ? '#eff6ff' : '#fff7ed', color: status === 'Paid' ? '#10b981' : status === 'Partial' ? '#3b82f6' : '#f59e0b' }}>{status.toUpperCase()}</span></td><td style={{ padding: '16px', fontWeight: '500' }}>₹{fee} / <span style={{ color: '#10b981' }}>₹{paid}</span></td><td style={{ padding: '16px', textAlign: 'right' }}><button onClick={(e) => { e.stopPropagation(); openPaymentModal(student); }} disabled={status === 'Paid'} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: status === 'Paid' ? '#f1f5f9' : 'white', cursor: status === 'Paid' ? 'not-allowed' : 'pointer', color: status === 'Paid' ? '#94a3b8' : '#4f46e5', fontWeight: '600', fontSize: '13px' }}>Collect</button></td></tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        );
    };

    const renderStudentDetails = () => {
        const student = activeStudentProfile;
        if (!student) return null; // Safety check

        const studentTxns = (transactions || []).filter(t => t.studentId === student.id).sort((a, b) => new Date(b.date) - new Date(a.date));
        const fee = getStudentFee(student); const paid = getStudentPaidAmount(student.id); const due = fee - paid;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><button onClick={() => setStatusView('list')} style={{ background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 6 }}><FiArrowLeft size={16} /> Back to List</button><h2 style={{ margin: 0, fontSize: '20px' }}>Student Fee Profile</h2></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center', alignItems: 'center' }}><div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}><FiUser /></div><div><h3 style={{ margin: 0, fontSize: '18px' }}>{student.name}</h3><p style={{ margin: '4px 0', color: '#64748b' }}>Roll No: {student.rollNo}</p></div></div>
                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h4 style={{ margin: '0 0 16px 0' }}>Financial Summary</h4>

                            {studentOverrides[student.id] ? (
                                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FiCheckCircle /> Custom One-Time Fee Applied
                                </div>
                            ) : null}

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span style={{ color: '#64748b' }}>Total Fee</span><span style={{ fontWeight: 'bold' }}>₹{parseInt(fee).toLocaleString()}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span style={{ color: '#64748b' }}>Paid Amount</span><span style={{ fontWeight: 'bold', color: '#10b981' }}>₹{paid.toLocaleString()}</span></div>
                            <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '8px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}><span>Due Pending</span><span style={{ fontWeight: 'bold', color: due > 0 ? '#ef4444' : '#10b981' }}>₹{Math.max(0, due).toLocaleString()}</span></div>
                            <button onClick={() => openPaymentModal(student)} disabled={due <= 0} style={{ width: '100%', padding: '12px', marginTop: '20px', background: due > 0 ? '#4f46e5' : '#f1f5f9', color: due > 0 ? 'white' : '#94a3b8', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: due > 0 ? 'pointer' : 'not-allowed' }}>{due > 0 ? 'Collect Fee Now' : 'Fully Paid'}</button>
                        </div>
                    </div>
                    <div className="glass-card table-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}><h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><FiClock /> Payment History</h3></div>
                        <table className="premium-table" style={{ width: '100%' }}>
                            <thead><tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px' }}><th style={{ padding: '16px' }}>Date</th><th style={{ padding: '16px' }}>Txn ID</th><th style={{ padding: '16px' }}>Mode</th><th style={{ padding: '16px' }}>Amount</th><th style={{ padding: '16px' }}>Remarks</th><th style={{ padding: '16px', textAlign: 'right' }}>Receipt</th></tr></thead>
                            <tbody>{studentTxns.map(txn => (
                                <tr key={txn.id} style={{ borderBottom: '1px solid #f1f5f9' }}><td style={{ padding: '16px' }}>{txn.date}</td><td style={{ padding: '16px', fontSize: '12px', color: '#64748b' }}>{txn.id.split('_')[1]}</td><td style={{ padding: '16px' }}>{txn.mode}</td><td style={{ padding: '16px', fontWeight: '600', color: '#10b981' }}>+ ₹{txn.amount.toLocaleString()}</td><td style={{ padding: '16px', color: '#64748b' }}>{txn.remarks || '-'}</td><td style={{ padding: '16px', textAlign: 'right' }}><button onClick={() => handleDownloadReceipt(txn)} style={{ color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer' }}><FiDownload /></button></td></tr>
                            ))}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}><div style={{ padding: 12, borderRadius: '50%', background: '#eff6ff', color: '#3b82f6' }}><FaRupeeSign size={24} /></div><div><div style={{ fontSize: '13px', color: '#64748b' }}>Total Expected</div><div style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{stats.total.toLocaleString()}</div></div></div>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}><div style={{ padding: 12, borderRadius: '50%', background: '#ecfdf5', color: '#10b981' }}><FiCheckCircle size={24} /></div><div><div style={{ fontSize: '13px', color: '#64748b' }}>Collected</div><div style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{stats.collected.toLocaleString()}</div></div></div>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}><div style={{ padding: 12, borderRadius: '50%', background: '#fff7ed', color: '#f59e0b' }}><FiAlertCircle size={24} /></div><div><div style={{ fontSize: '13px', color: '#64748b' }}>Pending</div><div style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{stats.pending.toLocaleString()}</div></div></div>
            </div>

            {/* View Tabs */}
            <div className="glass-card" style={{ padding: '8px', display: 'flex', gap: '8px' }}>
                {['status', 'transactions', 'config', 'settings'].map(tab => (
                    <button key={tab} onClick={() => { setView(tab); if (tab === 'status') setStatusView('routes'); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: view === tab ? '#4f46e5' : 'transparent', color: view === tab ? 'white' : '#64748b', fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize' }}>
                        {tab === 'config' ? 'Fee Structure' : tab === 'status' ? 'Fee Status' : tab === 'transactions' ? 'Payment History' : tab}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

                    {view === 'status' && (<div>{statusView === 'routes' && renderRoutesGrid()}{statusView === 'list' && renderStudentList()}{statusView === 'details' && renderStudentDetails()}</div>)}

                    {view === 'transactions' && (
                        <div className="glass-card table-container">
                            <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0 }}>Payment History (Global)</h3>
                                <div style={{ display: 'flex', gap: '12px' }}>

                                    {/* ADDED: Manual Payment Button for Admins */}
                                    <button onClick={() => openPaymentModal(null)} style={{ padding: '8px 16px', borderRadius: '6px', background: '#10b981', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: '600' }}>
                                        <FiPlus /> Add Manual Payment
                                    </button>

                                    <button style={{ padding: '8px 16px', borderRadius: '6px', background: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        Export CSV
                                    </button>
                                </div>
                            </div>
                            <table className="premium-table" style={{ width: '100%' }}>
                                <thead><tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px' }}><th style={{ padding: '16px' }}>Date</th><th style={{ padding: '16px' }}>Student</th><th style={{ padding: '16px' }}>Route</th><th style={{ padding: '16px' }}>Amount</th><th style={{ padding: '16px', textAlign: 'right' }}>Ref</th></tr></thead>
                                <tbody>{transactions.map(txn => (<tr key={txn.id} style={{ borderBottom: '1px solid #f1f5f9' }}><td style={{ padding: '16px' }}>{txn.date}</td><td style={{ padding: '16px', fontWeight: '600' }}>{txn.studentName}</td><td style={{ padding: '16px' }}>{routes.find(r => r.id === txn.routeId)?.name || 'Unknown'}</td><td style={{ padding: '16px', fontWeight: 'bold' }}>₹{txn.amount.toLocaleString()}</td><td style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#94a3b8' }}>{txn.id}</td></tr>))}</tbody>
                            </table>
                        </div>
                    )}

                    {view === 'config' && renderConfigSplitView()}

                    {view === 'settings' && (
                        <div className="glass-card" style={{ padding: '32px', maxWidth: '600px' }}>
                            <h3 style={{ marginBottom: '24px' }}>General Settings</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div><label style={{ display: 'block', marginBottom: '8px' }}>Late Fee (Per Day)</label><input type="number" value={settings.lateFee} onChange={e => setSettings({ ...settings, lateFee: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} /></div>
                                <button style={{ padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600' }}>Update Settings</button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* UPGRADED Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <>
                        <div onClick={() => setShowPaymentModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} />
                        <motion.div initial={{ x: '-50%', y: '-50%', opacity: 0, scale: 0.95 }} animate={{ x: '-50%', y: '-50%', opacity: 1, scale: 1 }} style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', padding: '0', borderRadius: '16px', width: '480px', zIndex: 101, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>

                            {/* Header */}
                            <div style={{ padding: '24px 24px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>Record Manual Payment</h3>
                                <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                                    <FiX size={20} color="#6b7280" />
                                </button>
                            </div>

                            <div style={{ padding: '24px' }}>
                                {/* Search */}
                                {!selectedStudent ? (
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Search Student ID / Name</label>
                                        <input
                                            placeholder="Enter student details..."
                                            value={studentSearchQuery}
                                            onChange={e => setStudentSearchQuery(e.target.value)}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', background: '#f9fafb' }}
                                            autoFocus
                                        />
                                        {/* Dropdown Logic Here */}
                                        {studentSearchQuery.length > 1 && (
                                            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', marginTop: '4px', background: 'white', position: 'absolute', width: 'calc(100% - 48px)', zIndex: 10 }}>
                                                {students.filter(s => s.name.toLowerCase().includes(studentSearchQuery.toLowerCase())).slice(0, 5).map(s => (
                                                    <div key={s.id} onClick={() => selectStudentForPayment(s)} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '14px' }}>
                                                        <div style={{ fontWeight: '600', color: '#111827' }}>{s.name}</div>
                                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Class {s.class} • {s.rollNo}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ marginBottom: '24px', padding: '12px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div><div style={{ fontWeight: '600' }}>{selectedStudent.name}</div><div style={{ fontSize: '12px', color: '#6b7280' }}>Class {selectedStudent.class}</div></div>
                                        <button onClick={() => setSelectedStudent(null)} style={{ fontSize: '12px', color: '#4f46e5', border: 'none', background: 'none', cursor: 'pointer' }}>Change</button>
                                    </div>
                                )}

                                {/* Amount */}
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={paymentForm.amount}
                                        readOnly
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', background: '#f9fafb', color: '#374151' }}
                                    />
                                </div>

                                {/* Payment Mode - Dropdown */}
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Mode</label>
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            value={paymentForm.mode}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', background: 'white', appearance: 'none', cursor: 'pointer' }}
                                        >
                                            <option value="Cash">Cash</option>
                                            <option value="UPI">UPI</option>
                                            <option value="Card">Card</option>
                                            <option value="Cheque">Cheque</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                        </select>
                                        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}>
                                            <FiChevronRight style={{ transform: 'rotate(90deg)' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Remarks */}
                                <div style={{ marginBottom: '32px' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remarks</label>
                                    <textarea
                                        placeholder="Notes..."
                                        value={paymentForm.remarks}
                                        onChange={e => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', background: 'white', minHeight: '80px', fontFamily: 'inherit', resize: 'none' }}
                                    />
                                </div>

                                {/* Footer Buttons */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button
                                        onClick={() => setShowPaymentModal(false)}
                                        style={{ padding: '10px 20px', borderRadius: '8px', background: 'white', color: '#6b7280', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddPayment}
                                        disabled={parseInt(paymentForm.amount) <= 0}
                                        style={{
                                            padding: '10px 24px',
                                            background: '#8b5cf6', // Purple to match mock
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: parseInt(paymentForm.amount) > 0 ? 'pointer' : 'not-allowed',
                                            opacity: parseInt(paymentForm.amount) > 0 ? 1 : 0.6,
                                            fontSize: '14px'
                                        }}>
                                        Record Payment
                                    </button>
                                </div>

                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TransportFees;
