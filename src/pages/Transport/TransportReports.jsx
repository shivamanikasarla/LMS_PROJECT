import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiFileText, FiDownload, FiBarChart, FiPieChart, FiGrid
} from 'react-icons/fi';

const TransportReports = () => {
    const reports = [
        { id: 1, title: 'Vehicle Utilization Report', desc: 'Distance traveled, fuel consumption, and active days per vehicle.', icon: FiBarChart, color: '#6366f1' },
        { id: 2, title: 'Driver Attendance & Shifts', desc: 'Monthly attendance logs, shift details, and working hours.', icon: FiGrid, color: '#10b981' },
        { id: 3, title: 'Route Capacity Analysis', desc: 'Occupancy rates per route, student counts, and overflow alerts.', icon: FiPieChart, color: '#f59e0b' },
        { id: 4, title: 'Maintenance Expense History', desc: 'Detailed log of all repair and service costs over the last year.', icon: FiFileText, color: '#ef4444' },
        { id: 5, title: 'Student Transport Fee Status', desc: 'List of paid, pending, and overdue fees arranged by class.', icon: FiFileText, color: '#8b5cf6' },
    ];

    const handleDownload = (reportName) => {
        // Mock download
        alert(`Downloading ${reportName} as CSV...`);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {reports.map((report, index) => (
                <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card"
                    style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
                >
                    <div>
                        <div style={{
                            width: 48, height: 48, borderRadius: '12px',
                            background: `${report.color}20`, color: report.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '24px', marginBottom: '16px'
                        }}>
                            <report.icon />
                        </div>
                        <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#1e293b' }}>{report.title}</h3>
                        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>{report.desc}</p>
                    </div>

                    <button
                        onClick={() => handleDownload(report.title)}
                        style={{
                            marginTop: '24px', padding: '10px', width: '100%',
                            background: 'white', border: '1px solid #e2e8f0',
                            borderRadius: '8px', color: '#475569', fontWeight: '600',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#cbd5e1'; }}
                        onMouseOut={e => { e.target.style.background = 'white'; e.target.style.borderColor = '#e2e8f0'; }}
                    >
                        <FiDownload /> Export CSV
                    </button>
                </motion.div>
            ))}
        </div>
    );
};

export default TransportReports;
