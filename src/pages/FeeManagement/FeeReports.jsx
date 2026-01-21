import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiPieChart, FiDownload, FiCalendar, FiDollarSign } from 'react-icons/fi';
import './FeeManagement.css';

const FeeReports = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Header Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                <h2 style={{ fontSize: 20, margin: 0 }}>Financial Analytics</h2>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiCalendar color="#64748b" />
                        <input type="date" className="form-input" style={{ border: 'none', background: 'transparent', padding: 0, height: 20, width: 110 }} />
                        <span style={{ color: '#cbd5e1' }}>-</span>
                        <input type="date" className="form-input" style={{ border: 'none', background: 'transparent', padding: 0, height: 20, width: 110 }} />
                    </div>
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 14 }}>
                        <FiDownload /> Export Report
                    </button>
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="stats-grid">
                <div className="glass-card">
                    <div className="stat-label" style={{ marginBottom: 12 }}>Total Revenue</div>
                    <div className="stat-value" style={{ fontSize: 36, color: '#10b981' }}>₹24,50,000</div>
                    <div style={{ fontSize: 13, color: '#10b981', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiTrendingUp /> +12.5% from last month
                    </div>
                </div>
                <div className="glass-card">
                    <div className="stat-label" style={{ marginBottom: 12 }}>Pending Dues</div>
                    <div className="stat-value" style={{ fontSize: 36, color: '#f59e0b' }}>₹4,20,500</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
                        Across 125 students
                    </div>
                </div>
                <div className="glass-card">
                    <div className="stat-label" style={{ marginBottom: 12 }}>Refunds Processed</div>
                    <div className="stat-value" style={{ fontSize: 36, color: '#ef4444' }}>₹15,000</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
                        3 requests this month
                    </div>
                </div>
            </div>

            {/* Charts Section (Mock) */}
            <div className="charts-grid">
                <div className="glass-card" style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ margin: 0, fontSize: 18 }}>Revenue Growth</h3>
                        <select className="form-select" style={{ width: 'auto', padding: '6px 12px' }}>
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    {/* Mock Line Chart */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: 20, borderBottom: '1px solid #e2e8f0' }}>
                        {[40, 60, 45, 80, 70, 95].map((h, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    style={{ width: 40, background: 'linear-gradient(to top, #6366f1, #818cf8)', borderRadius: '8px 8px 0 0' }}
                                />
                                <span style={{ fontSize: 12, color: '#94a3b8' }}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card" style={{ height: 400 }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: 18 }}>Fee Distribution</h3>
                    {/* Mock Donut Chart */}
                    <div style={{ position: 'relative', width: 200, height: 200, margin: '20px auto', borderRadius: '50%', background: 'conic-gradient(#6366f1 0% 60%, #10b981 60% 85%, #f59e0b 85% 100%)' }}>
                        <div style={{ position: 'absolute', inset: 30, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <span style={{ fontSize: 24, fontWeight: 700 }}>100%</span>
                            <span style={{ fontSize: 12, color: '#64748b' }}>Collection</span>
                        </div>
                    </div>
                    <div style={{ marginTop: 40 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }}></div> Tuition</span>
                            <span style={{ fontWeight: 600 }}>60%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div> Admission</span>
                            <span style={{ fontWeight: 600 }}>25%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}></div> Other</span>
                            <span style={{ fontWeight: 600 }}>15%</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FeeReports;
