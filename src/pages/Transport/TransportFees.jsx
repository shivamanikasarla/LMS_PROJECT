import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiDollarSign, FiSearch, FiTruck, FiUser,
    FiCheckCircle, FiAlertCircle, FiCreditCard, FiSettings
} from 'react-icons/fi';
import TransportService from '../../services/transportService';

const TransportFees = () => {
    // --- State ---
    const [routes, setRoutes] = useState([]);
    const [students, setStudents] = useState([]);
    const [fees, setFees] = useState({});
    const [payments, setPayments] = useState({});
    const [view, setView] = useState('status');
    const [selectedRouteId, setSelectedRouteId] = useState('');
    const [loading, setLoading] = useState(false);

    // KPI State
    const [stats, setStats] = useState({ total: 0, collected: 0, pending: 0 });

    useEffect(() => {
        fetchData();

        // Load Config/Payments from LocalStorage (until backend is ready for these)
        const savedFees = localStorage.getItem('lms_transport_fees_config');
        const savedPayments = localStorage.getItem('lms_transport_payments');
        if (savedFees) setFees(JSON.parse(savedFees));
        if (savedPayments) setPayments(JSON.parse(savedPayments));
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [routesData, studentsData] = await Promise.all([
                TransportService.Route.getAllRoutes(),
                TransportService.Student.getAllStudents() // Ensure this maps correctly
            ]);

            setRoutes(routesData || []);

            // Map students to unified format if needed
            const mappedStudents = (studentsData || []).map(s => {
                // Handle different student structures (Entity vs User UserDTO)
                const user = s.user || {};
                return {
                    id: user.userId || s.id,
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || s.name || 'Unknown',
                    routeId: user.routeId || s.routeId || null, // Ensure backend provides this
                    class: s.grade || s.class || 'N/A'
                };
            });
            setStudents(mappedStudents);

        } catch (error) {
            console.error("Failed to fetch transport fee data", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Stats on data change
    useEffect(() => {
        let total = 0, collected = 0, pending = 0;
        students.forEach(s => {
            if (s.routeId) {
                const routeFee = fees[s.routeId]?.monthly || 0;
                total += parseInt(routeFee);
                if (payments[s.id]?.status === 'Paid') {
                    collected += parseInt(routeFee);
                } else {
                    pending += parseInt(routeFee);
                }
            }
        });
        setStats({ total, collected, pending });
    }, [students, fees, payments]);

    useEffect(() => {
        localStorage.setItem('lms_transport_fees_config', JSON.stringify(fees));
        localStorage.setItem('lms_transport_payments', JSON.stringify(payments));
    }, [fees, payments]);

    // --- Handlers ---
    const updateFeeConfig = (routeId, type, amount) => {
        setFees({
            ...fees,
            [routeId]: { ...fees[routeId], [type]: amount }
        });
    };

    const markPayment = (studentId, status) => {
        setPayments({
            ...payments,
            [studentId]: {
                status,
                date: new Date().toISOString().split('T')[0],
                amount: fees[students.find(s => s.id === studentId)?.routeId]?.monthly || 0
            }
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header / Config Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}><FiCheckCircle /></div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>Collected</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>₹{stats.collected.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff7ed', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}><FiAlertCircle /></div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>Pending</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>₹{stats.pending.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '8px' }}>
                    <button
                        onClick={() => setView('status')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: view === 'status' ? 'white' : 'transparent', fontWeight: '600', color: view === 'status' ? '#4f46e5' : '#64748b', cursor: 'pointer', boxShadow: view === 'status' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                    >
                        Fee Status
                    </button>
                    <button
                        onClick={() => setView('config')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: view === 'config' ? 'white' : 'transparent', fontWeight: '600', color: view === 'config' ? '#4f46e5' : '#64748b', cursor: 'pointer', boxShadow: view === 'config' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                    >
                        Configuration
                    </button>
                </div>
            </div>

            {view === 'status' ? (
                <div className="glass-card table-container">
                    <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '16px' }}>Student</th>
                                <th style={{ padding: '16px' }}>Route</th>
                                <th style={{ padding: '16px' }}>Fee Amount</th>
                                <th style={{ padding: '16px' }}>Status</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.filter(s => s.routeId).map(student => {
                                const route = routes.find(r => r.id === student.routeId);
                                const feeAmount = fees[student.routeId]?.monthly || 'Not Set';
                                const payment = payments[student.id] || { status: 'Pending' };

                                return (
                                    <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: '600', color: '#1e293b' }}>{student.name}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{student.id}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontSize: '13px', color: '#334155' }}>
                                                {route ? `${route.code} - ${route.name}` : 'Unknown Route'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: '600', color: '#334155' }}>
                                            ₹{feeAmount}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                                background: payment.status === 'Paid' ? '#ecfdf5' : '#fff7ed',
                                                color: payment.status === 'Paid' ? '#10b981' : '#f59e0b',
                                                display: 'inline-flex', alignItems: 'center', gap: 6
                                            }}>
                                                {payment.status === 'Paid' ? <FiCheckCircle /> : <FiAlertCircle />}
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            {payment.status !== 'Paid' && (
                                                <button
                                                    onClick={() => markPayment(student.id, 'Paid')}
                                                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#10b981' }}
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                            {payment.status === 'Paid' && (
                                                <button
                                                    onClick={() => markPayment(student.id, 'Pending')}
                                                    style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px', color: '#94a3b8', textDecoration: 'underline' }}
                                                >
                                                    Undo
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {students.filter(s => s.routeId).length === 0 && (
                                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No students assigned to routes yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '24px' }}>Route Fee Configuration</h3>
                    <h3 style={{ marginBottom: '24px' }}>Route Fee Configuration</h3>

                    {/* Route Selection */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: '500' }}>Select Route to Configure</label>
                        <select
                            value={selectedRouteId}
                            onChange={(e) => setSelectedRouteId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '14px',
                                background: 'white',
                                color: '#1e293b',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">-- Select a Route --</option>
                            {routes.map(route => (
                                <option key={route.id} value={route.id}>
                                    {route.name} ({route.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Selected Route Configuration */}
                    {selectedRouteId ? (
                        <div className="glass-card" style={{ padding: '24px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                            <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '16px' }}>
                                <FiTruck color="#6366f1" size={20} />
                                {routes.find(r => r.id === selectedRouteId)?.name}
                                <span style={{ fontSize: '12px', color: '#6366f1', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e0e7ff' }}>
                                    {routes.find(r => r.id === selectedRouteId)?.code}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: '500' }}>Monthly Fee (₹)</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>₹</div>
                                        <input
                                            type="number"
                                            value={fees[selectedRouteId]?.monthly || ''}
                                            onChange={e => updateFeeConfig(selectedRouteId, 'monthly', e.target.value)}
                                            placeholder="0"
                                            style={{ width: '100%', padding: '10px 12px 10px 28px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: '500' }}>Annual Fee (₹)</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>₹</div>
                                        <input
                                            type="number"
                                            value={fees[selectedRouteId]?.annual || ''}
                                            onChange={e => updateFeeConfig(selectedRouteId, 'annual', e.target.value)}
                                            placeholder="0"
                                            style={{ width: '100%', padding: '10px 12px 10px 28px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                            <FiSettings size={28} style={{ marginBottom: '8px', opacity: 0.5 }} />
                            <div>Please select a route to configure fees.</div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                        <button
                            onClick={() => {
                                localStorage.setItem('lms_transport_fees_config', JSON.stringify(fees));
                                alert('Fee configuration saved successfully!');
                            }}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                color: 'white',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                            }}
                        >
                            <FiCheckCircle /> Save Configuration
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransportFees;
