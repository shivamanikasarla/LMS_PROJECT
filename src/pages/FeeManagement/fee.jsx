import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid, FiList, FiUsers, FiPieChart, FiTrendingUp,
    FiMoreVertical, FiFilter, FiDownload, FiPlus, FiSearch, FiCalendar,
    FiSettings, FiCreditCard, FiActivity, FiLayers, FiRefreshCcw,
    FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import './FeeManagement.css';
import FeePayments from './FeePayments';
import FeeRefunds from './FeeRefunds';
import FeeSettings from './FeeSettings';
import FeeBatches from './FeeBatches';

import { FaRupeeSign } from 'react-icons/fa';

// --- FeeDashboard Component ---
const FeeDashboard = () => {
    const kpiData = [
        { title: "Total Collection", value: "₹24,50,000", icon: <FaRupeeSign />, color: "linear-gradient(135deg, #10b981 0%, #059669 100%)", subtitle: "This Year" },
        { title: "Pending Amount", value: "₹4,20,500", icon: <FiAlertCircle />, color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", subtitle: "125 Students" },
        { title: "Overdue Amount", value: "₹1,15,000", icon: <FiActivity />, color: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", subtitle: "Action Required" },
        { title: "Monthly Revenue", value: "₹3,40,000", icon: <FiTrendingUp />, color: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", subtitle: "Jan 2026" },
    ];


    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeActionId, setActiveActionId] = useState(null);
    const [transactionFilter, setTransactionFilter] = useState('All');
    const [showTransactionFilterMenu, setShowTransactionFilterMenu] = useState(false);

    // Dynamic Filters State
    const [courseFilter, setCourseFilter] = useState('All Courses');
    const [batchFilter, setBatchFilter] = useState('All Batches');
    const [availableCourses, setAvailableCourses] = useState([]);
    const [availableBatches, setAvailableBatches] = useState([]);

    React.useEffect(() => {
        const handleClickOutside = () => setActiveActionId(null);
        window.addEventListener('click', handleClickOutside);

        // Load Filters Data
        const batches = JSON.parse(localStorage.getItem('lms_fee_data') || '[]');
        const uniqueCourses = [...new Set(batches.map(b => b.course))];
        setAvailableCourses(uniqueCourses);
        setAvailableBatches(batches);

        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const transactionData = [
        { id: 1, name: "Student Name 1", studentId: "2026001", type: "Tuition Fee", date: "Jan 06, 2026", amount: "₹12,000", status: "Pending" },
        { id: 2, name: "Student Name 2", studentId: "2026002", type: "Tuition Fee", date: "Jan 07, 2026", amount: "₹12,000", status: "Paid" },
        { id: 3, name: "Student Name 3", studentId: "2026003", type: "Tuition Fee", date: "Jan 08, 2026", amount: "₹12,000", status: "Pending" },
        { id: 4, name: "Student Name 4", studentId: "2026004", type: "Tuition Fee", date: "Jan 09, 2026", amount: "₹12,000", status: "Paid" },
        { id: 5, name: "Student Name 5", studentId: "2026005", type: "Tuition Fee", date: "Jan 10, 2026", amount: "₹12,000", status: "Pending" },
    ];

    const filteredTransactions = transactionData.filter(txn => {
        // 1. Check Search
        const matchesSearch = txn.name.toLowerCase().includes(searchTerm.toLowerCase()) || txn.studentId.includes(searchTerm);
        // 2. Check Filter
        const matchesFilter = transactionFilter === 'All' ? true : txn.status === transactionFilter;

        return matchesSearch && matchesFilter;
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Filters Row */}
            {/* Filters Row */}
            <div className="controls-row">
                <select
                    className="form-select"
                    style={{ maxWidth: 200 }}
                    value={courseFilter}
                    onChange={(e) => {
                        setCourseFilter(e.target.value);
                        setBatchFilter('All Batches'); // Reset batch when course changes
                    }}
                >
                    <option>All Courses</option>
                    {availableCourses.map(c => <option key={c}>{c}</option>)}
                </select>
                <select
                    className="form-select"
                    style={{ maxWidth: 200 }}
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                >
                    <option>All Batches</option>
                    {availableBatches
                        .filter(b => courseFilter === 'All Courses' || b.course === courseFilter)
                        .map(b => <option key={b.id} value={b.name}>{b.name}</option>)
                    }
                </select>
                <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 300 }}>
                    <FiSearch color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search student..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn-primary" onClick={() => navigate('/fee/create')}>
                    <FiPlus /> Create Fee Structure
                </button>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid">
                {kpiData.map((kpi, index) => (
                    <motion.div
                        key={index}
                        className="glass-card stat-item"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="stat-header">
                            <div className="stat-icon" style={{ background: kpi.color }}>{kpi.icon}</div>
                        </div>
                        <div className="stat-value">{kpi.value}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="stat-label">{kpi.title}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{kpi.subtitle}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section Placeholder */}
            <div className="charts-grid" style={{ marginBottom: 32 }}>
                <div className="glass-card" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Monthly Collection</h3>
                        <select className="form-select" style={{ padding: '4px 8px', fontSize: 12 }}>
                            <option>2026</option>
                            <option>2025</option>
                        </select>
                    </div>

                    <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end', gap: 12, paddingBottom: 12 }}>
                        {[
                            { m: 'Jan', h: 35 }, { m: 'Feb', h: 55 }, { m: 'Mar', h: 45 },
                            { m: 'Apr', h: 70 }, { m: 'May', h: 65 }, { m: 'Jun', h: 85 },
                            { m: 'Jul', h: 60 }, { m: 'Aug', h: 75 }, { m: 'Sep', h: 50 },
                            { m: 'Oct', h: 60 }, { m: 'Nov', h: 80 }, { m: 'Dec', h: 90 }
                        ].map((item, i) => (
                            <div key={i} className="bar-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end', cursor: 'pointer' }}>
                                <div style={{
                                    fontSize: 10, fontWeight: 600, color: '#64748b',
                                    opacity: 0, transform: 'translateY(10px)', transition: '0.2s'
                                }} className="bar-value">
                                    {item.h}k
                                </div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${item.h}%` }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bar-fill"
                                    style={{
                                        width: '100%',
                                        background: i === 11 ? 'var(--primary-gradient)' : '#e2e8f0',
                                        borderRadius: 6,
                                        minHeight: 4
                                    }}
                                />
                                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{item.m}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-card" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <h3 style={{ alignSelf: 'flex-start', margin: '0 0 20px 0', fontSize: '18px' }}>Course Revenue Distribution</h3>

                    {(() => {
                        // 1. Calculate Data Dynamically
                        const batches = JSON.parse(localStorage.getItem('lms_fee_data') || '[]');
                        const revenueData = batches.map(b => ({
                            name: b.name,
                            value: (b.studentList || []).reduce((sum, s) => sum + (s.paidAmount || 0), 0)
                        })).filter(d => d.value > 0);

                        const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.value, 0);

                        // Colors Palette
                        const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

                        // If no revenue
                        if (totalRevenue === 0) {
                            return (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
                                    No revenue data available
                                </div>
                            );
                        }

                        // 2. Build Gradient String
                        let currentDeg = 0;
                        const gradientParts = revenueData.map((item, index) => {
                            const percent = (item.value / totalRevenue) * 100;
                            const start = currentDeg;
                            currentDeg += percent;
                            const color = COLORS[index % COLORS.length];
                            return `${color} ${start}% ${currentDeg}%`;
                        });
                        const gradientString = `conic-gradient(${gradientParts.join(', ')})`;

                        return (
                            <>
                                {/* Pie Chart */}
                                <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: gradientString, position: 'relative' }}>
                                    <div style={{ position: 'absolute', inset: 30, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total</span>
                                        <span style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                                            {(totalRevenue / 1000).toFixed(1)}K
                                        </span>
                                        <span style={{ fontSize: 10, color: '#94a3b8' }}>INR</span>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div style={{ width: '100%', marginTop: 24, paddingRight: 8, maxHeight: 100, overflowY: 'auto' }}>
                                    {revenueData.map((item, index) => (
                                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, alignItems: 'center' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ width: 10, height: 10, background: COLORS[index % COLORS.length], borderRadius: '50%' }}></span>
                                                <span style={{ color: '#334155', fontWeight: 500 }}>{item.name}</span>
                                            </span>
                                            <span style={{ fontWeight: 600, color: '#64748b' }}>
                                                {((item.value / totalRevenue) * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>

            {/* Recent Table */}
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3>Recent Transactions</h3>
                    <div style={{ position: 'relative' }}>
                        <button
                            className={`btn-icon ${transactionFilter !== 'All' ? 'active-filter' : ''}`}
                            onClick={() => setShowTransactionFilterMenu(!showTransactionFilterMenu)}
                            style={{
                                position: 'relative',
                                border: transactionFilter !== 'All' ? '1px solid #6366f1' : undefined,
                                color: transactionFilter !== 'All' ? '#6366f1' : undefined
                            }}
                        >
                            <FiFilter />
                        </button>
                        {showTransactionFilterMenu && (
                            <div className="dropdown-menu show" style={{
                                position: 'absolute', right: 0, top: '120%',
                                minWidth: 150, zIndex: 10,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                            }}>
                                {['All', 'Paid', 'Pending'].map(status => (
                                    <button
                                        key={status}
                                        className="dropdown-item"
                                        style={{
                                            justifyContent: 'flex-start',
                                            background: transactionFilter === status ? '#f1f5f9' : 'transparent',
                                            fontWeight: transactionFilter === status ? 600 : 400
                                        }}
                                        onClick={() => {
                                            setTransactionFilter(status);
                                            setShowTransactionFilterMenu(false);
                                        }}
                                    >
                                        {status}
                                        {transactionFilter === status && <FiCheckCircle size={12} style={{ marginLeft: 'auto', color: '#6366f1' }} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="table-container">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Fee Type</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map(txn => (
                                    <tr key={txn.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 12 }}>
                                                    {txn.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{txn.name}</div>
                                                    <div style={{ fontSize: 11, color: '#94a3b8' }}>ID: {txn.studentId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{txn.type}</td>
                                        <td>{txn.date}</td>
                                        <td>{txn.amount}</td>
                                        <td>
                                            <span className={`status-badge ${txn.status === 'Paid' ? 'paid' : 'pending'}`}>
                                                {txn.status === 'Paid' ? <FiCheckCircle /> : <FiAlertCircle />}
                                                {txn.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                                                <button
                                                    className="btn-icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveActionId(activeActionId === txn.id ? null : txn.id);
                                                    }}
                                                >
                                                    <FiMoreVertical />
                                                </button>
                                                {activeActionId === txn.id && (
                                                    <div className="dropdown-menu show" style={{
                                                        position: 'absolute', right: 0, top: '100%',
                                                        minWidth: 160, zIndex: 10, marginTop: 4,
                                                        background: 'white', borderRadius: 8,
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                                        padding: '8px 0', border: '1px solid #e2e8f0'
                                                    }}>
                                                        <button
                                                            className="dropdown-item"
                                                            style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 13 }}
                                                            onClick={() => alert(`View Receipt for ${txn.name}`)}
                                                            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                                            onMouseLeave={(e) => e.target.style.background = 'none'}
                                                        >
                                                            <FiCheckCircle size={14} /> View Receipt
                                                        </button>
                                                        <button
                                                            className="dropdown-item"
                                                            style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 13 }}
                                                            onClick={() => alert(`Downloading Invoice for ${txn.studentId}...`)}
                                                            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                                            onMouseLeave={(e) => e.target.style.background = 'none'}
                                                        >
                                                            <FiDownload size={14} /> Download Invoice
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                                        No transactions found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Layout ---

const FeeManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.defaultTab || 'dashboard');

    React.useEffect(() => {
        if (location.state && location.state.defaultTab) {
            setActiveTab(location.state.defaultTab);
        }
    }, [location]);

    const tabs = [
        { id: 'dashboard', label: 'Overview', icon: <FiGrid /> },
        { id: 'batches', label: 'Batches', icon: <FiLayers /> },
        { id: 'payments', label: 'Payments', icon: <FiCreditCard /> },
        { id: 'refunds', label: 'Refunds', icon: <FiRefreshCcw /> },
        { id: 'settings', label: 'Settings', icon: <FiSettings /> },
    ];

    return (
        <div className="fee-container">
            {/* Header */}
            <header className="fee-header">
                <div>
                    <div className="fee-title">
                        <h1>Fee Management</h1>
                    </div>
                    <div className="fee-subtitle">Manage student fees, batches, and payments</div>
                </div>


            </header>

            {/* Navigation */}
            <nav className="nav-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </nav>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && <FeeDashboard />}
                    {activeTab === 'batches' && <FeeBatches />}
                    {activeTab === 'payments' && <FeePayments setActiveTab={setActiveTab} />}
                    {activeTab === 'refunds' && <FeeRefunds />}
                    {activeTab === 'settings' && <FeeSettings />}


                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FeeManagement;