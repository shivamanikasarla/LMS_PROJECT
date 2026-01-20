import React, { useState } from 'react';
import { FiSearch, FiFilter, FiActivity, FiServer } from 'react-icons/fi';

const SystemLogs = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Logs Data
    const [logs] = useState([
        { id: 'LOG-1001', action: 'UPDATE', entity: 'Campaign: Summer Sale', user: 'John Doe', timestamp: '2024-03-15 14:30:22', ip: '192.168.1.101', status: 'Success' },
        { id: 'LOG-1002', action: 'CREATE', entity: 'Lead: Alice Smith', user: 'System (Auto)', timestamp: '2024-03-15 14:28:10', ip: '10.0.0.5', status: 'Success' },
        { id: 'LOG-1003', action: 'EXPORT', entity: 'Leads Report (CSV)', user: 'Sarah Lee', timestamp: '2024-03-15 11:15:00', ip: '192.168.1.105', status: 'Success' },
        { id: 'LOG-1004', action: 'DELETE', entity: 'Coupon: SAVE20', user: 'Admin User', timestamp: '2024-03-14 09:45:33', ip: '192.168.1.200', status: 'Warning' },
        { id: 'LOG-1005', action: 'LOGIN_FAIL', entity: 'User: mike.ross', user: 'Unknown', timestamp: '2024-03-14 08:30:12', ip: '45.2.12.99', status: 'Failed' },
    ]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Success': return <span className="badge bg-success bg-opacity-10 text-success border-success">Success</span>;
            case 'Warning': return <span className="badge bg-warning bg-opacity-10 text-warning border-warning">Warning</span>;
            case 'Failed': return <span className="badge bg-danger bg-opacity-10 text-danger border-danger">Failed</span>;
            default: return <span className="badge bg-secondary">Unknown</span>;
        }
    };

    const getActionColor = (action) => {
        if (action.includes('DELETE')) return 'text-danger fw-bold';
        if (action.includes('CREATE')) return 'text-primary fw-bold';
        if (action.includes('UPDATE')) return 'text-info fw-bold';
        return 'text-dark fw-bold';
    };

    const filteredLogs = logs.filter(log =>
        log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded shadow-sm border">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <FiServer className="text-secondary" />
                    <h5 className="mb-0">System Audit Logs</h5>
                </div>
                <div className="d-flex gap-2">
                    <div className="input-group input-group-sm" style={{ width: 250 }}>
                        <span className="input-group-text bg-light border-end-0"><FiSearch /></span>
                        <input
                            type="text"
                            className="form-control border-start-0 bg-light"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-sm btn-outline-secondary"><FiFilter /> Filter</button>
                    <button className="btn btn-sm btn-outline-primary">Export Logs</button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 text-nowrap">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Timestamp</th>
                            <th>Action Type</th>
                            <th>Entity Affected</th>
                            <th>Performed By</th>
                            <th>IP Address</th>
                            <th className="text-end pe-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="small">
                        {filteredLogs.map(log => (
                            <tr key={log.id}>
                                <td className="ps-4 text-muted font-monospace">{log.timestamp}</td>
                                <td className={getActionColor(log.action)}>{log.action}</td>
                                <td className="fw-bold text-dark">{log.entity}</td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-muted border" style={{ width: 24, height: 24, fontSize: 10 }}>
                                            {log.user.charAt(0)}
                                        </div>
                                        {log.user}
                                    </div>
                                </td>
                                <td className="font-monospace text-muted">{log.ip}</td>
                                <td className="text-end pe-4">{getStatusBadge(log.status)}</td>
                            </tr>
                        ))}
                        {filteredLogs.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted">
                                    <FiActivity size={32} className="mb-2 opacity-50" />
                                    <p className="mb-0">No logs found matching your search.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="card-footer bg-light py-2 px-3 small text-muted d-flex justify-content-between">
                <span>Showing {filteredLogs.length} records</span>
                <span>Log Retention: 90 Days</span>
            </div>
        </div>
    );
};

export default SystemLogs;
