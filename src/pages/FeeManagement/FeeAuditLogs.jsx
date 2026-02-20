import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiSearch, FiFilter, FiEye, FiClock, FiUser, FiServer, FiX, FiRefreshCcw } from 'react-icons/fi';
import { getAuditLogs } from '../../services/feeService';
import './FeeManagement.css'; // Reusing existing styles

const FeeAuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);
    const [filterModule, setFilterModule] = useState('ALL');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await getAuditLogs();
            // Sort by performedAt descending (newest first)
            const sortedData = (data || []).sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt));
            setLogs(sortedData);
        } catch (error) {
            console.error("Failed to load audit logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric', month: 'short', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'CREATE': return 'success'; // Greenish
            case 'UPDATE': return 'warning'; // Orangeish
            case 'DELETE': return 'danger';  // Reddish
            case 'VIEW': return 'info';      // Blueish
            default: return 'default';
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            (log.entityName && log.entityName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (log.performedBy && String(log.performedBy).includes(searchTerm));

        const matchesModule = filterModule === 'ALL' || log.module === filterModule;

        return matchesSearch && matchesModule;
    });

    return (
        <div className="audit-logs-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FiActivity className="text-primary" /> Audit Logs
                    </h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748b' }}>
                        Track all system changes and administrative actions
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-secondary" onClick={fetchLogs} title="Refresh Logs">
                        <FiRefreshCcw className={loading ? 'spin' : ''} />
                    </button>

                    <div className="search-box" style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiSearch color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: 14, width: 200 }}
                        />
                    </div>

                    <select
                        className="form-select"
                        value={filterModule}
                        onChange={(e) => setFilterModule(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="ALL">All Modules</option>
                        <option value="FEE_MANAGEMENT">Fee Management</option>
                        {/* Add other modules if they appear in the logs */}
                    </select>
                </div>
            </div>

            {/* Logs Table */}
            <div className="glass-card table-container">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Entity</th>
                            <th>Entity ID</th>
                            <th>Performed By</th>
                            <th>Date & Time</th>
                            <th>IP Address</th>
                            <th style={{ textAlign: 'center' }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
                                    <FiRefreshCcw className="spin" style={{ marginRight: 8 }} /> Loading audit history...
                                </td>
                            </tr>
                        ) : filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
                                    No audit logs found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map(log => (
                                <tr key={log.id}>
                                    <td>
                                        <span className={`status-badge ${getActionColor(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 500, color: '#334155' }}>{log.entityName}</td>
                                    <td style={{ fontFamily: 'monospace', color: '#64748b' }}>#{log.entityId}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <FiUser size={14} color="#94a3b8" />
                                            <span>User {log.performedBy}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                                            <FiClock size={14} color="#94a3b8" />
                                            {formatDate(log.performedAt)}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
                                            <FiServer size={14} />
                                            {log.ipAddress || 'Unknown'}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            className="btn-icon"
                                            onClick={() => setSelectedLog(log)}
                                            style={{ color: '#6366f1', background: '#e0e7ff' }}
                                        >
                                            <FiEye />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedLog && (
                    <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            style={{ maxWidth: 700 }}
                        >
                            <div className="modal-header">
                                <h3>Audit Log Details #{selectedLog.id}</h3>
                                <button className="btn-icon" onClick={() => setSelectedLog(null)}><FiX /></button>
                            </div>
                            <div className="modal-body">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                                    <div className="info-group">
                                        <label>Action</label>
                                        <div style={{ fontWeight: 600 }}>{selectedLog.action}</div>
                                    </div>
                                    <div className="info-group">
                                        <label>Module / Entity</label>
                                        <div>{selectedLog.module} / {selectedLog.entityName}</div>
                                    </div>
                                    <div className="info-group">
                                        <label>Performed By</label>
                                        <div>User ID: {selectedLog.performedBy}</div>
                                    </div>
                                    <div className="info-group">
                                        <label>Date</label>
                                        <div>{formatDate(selectedLog.performedAt)}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                    <div style={{ background: '#fef2f2', padding: 12, borderRadius: 8, border: '1px solid #fee2e2' }}>
                                        <div style={{ fontWeight: 600, color: '#b91c1c', marginBottom: 8 }}>Old Value (Before)</div>
                                        <pre style={{
                                            whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12,
                                            maxHeight: 200, overflowY: 'auto', margin: 0, color: '#7f1d1d'
                                        }}>
                                            {selectedLog.oldValue || 'N/A (Create Action)'}
                                        </pre>
                                    </div>
                                    <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 8, border: '1px solid #dcfce7' }}>
                                        <div style={{ fontWeight: 600, color: '#15803d', marginBottom: 8 }}>New Value (After)</div>
                                        <pre style={{
                                            whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12,
                                            maxHeight: 200, overflowY: 'auto', margin: 0, color: '#14532d'
                                        }}>
                                            {selectedLog.newValue || 'N/A (Delete Action)'}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={() => setSelectedLog(null)}>Close</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FeeAuditLogs;
