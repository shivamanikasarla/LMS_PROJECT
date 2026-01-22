import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiDollarSign, FiSearch, FiTruck, FiUser,
    FiCheckCircle, FiAlertCircle, FiCreditCard, FiSettings
} from 'react-icons/fi';

const TransportFees = () => {
    // --- State ---
    const [routes, setRoutes] = useState([]);
    const [students, setStudents] = useState([]);
    const [fees, setFees] = useState({}); // { routeId: { monthly: 1000, annual: 10000 } }
    const [payments, setPayments] = useState({}); // { studentId: { status: 'Paid', amount: 1000, date: '...' } }
    const [view, setView] = useState('status'); // 'status' or 'config'

    // KPI State
    const [stats, setStats] = useState({ total: 0, collected: 0, pending: 0 });

    useEffect(() => {
        // Load Data
        const savedRoutes = localStorage.getItem('lms_transport_routes');
        const savedStudents = localStorage.getItem('lms_transport_students');
        const savedFees = localStorage.getItem('lms_transport_fees_config');
        const savedPayments = localStorage.getItem('lms_transport_payments');

        if (savedRoutes) setRoutes(JSON.parse(savedRoutes));
        if (savedStudents) setStudents(JSON.parse(savedStudents));
        if (savedFees) setFees(JSON.parse(savedFees));
        if (savedPayments) setPayments(JSON.parse(savedPayments));
    }, []);

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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                        {routes.map(route => (
                            <div key={route.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                                <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FiTruck color="#64748b" /> {route.name} <span style={{ fontSize: '12px', color: '#6366f1', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>{route.code}</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Monthly Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={fees[route.id]?.monthly || ''}
                                            onChange={e => updateFeeConfig(route.id, 'monthly', e.target.value)}
                                            placeholder="0"
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Annual Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={fees[route.id]?.annual || ''}
                                            onChange={e => updateFeeConfig(route.id, 'annual', e.target.value)}
                                            placeholder="0"
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

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
