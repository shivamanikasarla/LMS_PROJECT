import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiLoader, FiRefreshCw, FiUser, FiClock } from 'react-icons/fi';
import './FeeManagement.css';
import { getAuditLogs } from '../../services/feeService';

const FeeAuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const fetchAuditLogs = async () => {
        setLoading(true);
        try {
            const data = await getAuditLogs();
            setLogs(data || []);
        } catch (error) {
            console.error('❌ Failed to fetch audit logs from backend:', error);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const getActionLabel = (action) => {
        const labels = {
            'FEE_CREATED': 'Created a new fee',
            'SCHOLARSHIP_ADDED': 'Added scholarship to student',
            'DISCOUNT_APPLIED': 'Applied discount',
            'REFUND_PROCESSED': 'Processed refund',
            'PAYMENT_RECORDED': 'Recorded payment',
            'SETTINGS_UPDATED': 'Updated settings',
            'FEE_STRUCTURE_MODIFIED': 'Modified fee structure',
            'INSTALLMENT_PLAN_CREATED': 'Created installment plan',
            'LATE_FEE_APPLIED': 'Applied late fee'
        };
        return labels[action] || action;
    };

    const getActionColor = (action) => {
        const colors = {
            'FEE_CREATED': '#10b981',
            'SCHOLARSHIP_ADDED': '#3b82f6',
            'DISCOUNT_APPLIED': '#f59e0b',
            'REFUND_PROCESSED': '#ef4444',
            'PAYMENT_RECORDED': '#6366f1',
            'SETTINGS_UPDATED': '#8b5cf6',
            'FEE_STRUCTURE_MODIFIED': '#f97316',
            'INSTALLMENT_PLAN_CREATED': '#06b6d4',
            'LATE_FEE_APPLIED': '#dc2626'
        };
        return colors[action] || '#64748b';
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Admin Audit Logs</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#64748b' }}>Track all admin operations and activities</p>
                </div>
                <button
                    className="btn-icon"
                    onClick={fetchAuditLogs}
                    disabled={loading}
                    title="Refresh"
                >
                    <FiRefreshCw className={loading ? 'spin' : ''} />
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <FiLoader size={48} className="spin" style={{ margin: '0 auto', color: '#6366f1' }} />
                    <p style={{ marginTop: 16, color: '#64748b' }}>Loading audit logs...</p>
                </div>
            ) : (
                <>
                    {/* Audit Log Timeline */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        {logs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                                <FiActivity size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                                <p style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>No audit logs yet</p>
                                <p style={{ margin: '8px 0 0 0', fontSize: 14 }}>Admin operations will appear here once backend is connected</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {logs.map((log, index) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        style={{
                                            display: 'flex',
                                            gap: 16,
                                            padding: 16,
                                            background: 'rgba(255, 255, 255, 0.5)',
                                            borderRadius: 12,
                                            borderLeft: `4px solid ${getActionColor(log.action)}`
                                        }}
                                    >
                                        {/* Icon */}
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: `${getActionColor(log.action)}20`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <FiActivity size={20} color={getActionColor(log.action)} />
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                                <div>
                                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                                                        {getActionLabel(log.action)}
                                                    </div>
                                                    {log.details && (
                                                        <div style={{ fontSize: 13, color: '#64748b' }}>
                                                            {log.details}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
                                                    <FiClock size={12} />
                                                    {log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : '-'}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
                                                    <FiUser size={12} />
                                                    <span style={{ fontWeight: 600 }}>Admin:</span>
                                                    <span>{log.adminEmail || 'System'}</span>
                                                </div>
                                                {log.targetUser && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
                                                        <FiUser size={12} />
                                                        <span style={{ fontWeight: 600 }}>User:</span>
                                                        <span>{log.targetUser}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Summary Stats */}
                    {logs.length > 0 && (
                        <div className="stats-grid" style={{ marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
                                <div style={{ fontSize: 32, fontWeight: 700, color: '#6366f1' }}>{logs.length}</div>
                                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Total Operations</div>
                            </div>
                            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
                                <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>
                                    {logs.filter(l => l.action === 'FEE_CREATED').length}
                                </div>
                                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Fees Created</div>
                            </div>
                            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
                                <div style={{ fontSize: 32, fontWeight: 700, color: '#3b82f6' }}>
                                    {logs.filter(l => l.action === 'SCHOLARSHIP_ADDED').length}
                                </div>
                                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Scholarships Added</div>
                            </div>
                            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
                                <div style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>
                                    {logs.filter(l => l.action === 'DISCOUNT_APPLIED').length}
                                </div>
                                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Discounts Applied</div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </motion.div>
    );
};

export default FeeAuditLogs;
