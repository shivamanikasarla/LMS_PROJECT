import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid, FiTruck, FiUsers, FiMap, FiUserCheck, FiDollarSign,
    FiActivity, FiMapPin, FiCheckSquare, FiTool, FiDroplet, FiBarChart2
} from 'react-icons/fi';

import TransportDashboard from './TransportDashboard';
import VehicleManagement from './VehicleManagement';
import DriverManagement from './DriverManagement';
import RouteManagement from './RouteManagement';
import StudentMapping from './StudentMapping';
import TransportAttendance from './TransportAttendance';
import TransportFees from './TransportFees';
import LiveTracking from './LiveTracking';
import VehicleMaintenance from './VehicleMaintenance';
import FuelTracking from './FuelTracking';
import TransportReports from './TransportReports';

const Transport = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Overview', icon: <FiGrid /> },
        { id: 'live', label: 'Live Tracking', icon: <FiActivity /> },
        { id: 'vehicles', label: 'Vehicles', icon: <FiTruck /> },
        { id: 'drivers', label: 'Drivers', icon: <FiUsers /> },
        { id: 'routes', label: 'Routes', icon: <FiMap /> },
        { id: 'students', label: 'Students', icon: <FiUserCheck /> },
        { id: 'attendance', label: 'Attendance', icon: <FiCheckSquare /> },
        { id: 'fees', label: 'Fees', icon: <FiDollarSign /> },
        { id: 'maintenance', label: 'Maintenance', icon: <FiTool /> },
        { id: 'fuel', label: 'Fuel', icon: <FiDroplet /> },
        { id: 'reports', label: 'Reports', icon: <FiBarChart2 /> },
    ];

    return (
        <div className="fee-container" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
            {/* Header */}
            <header className="fee-header" style={{ marginBottom: '24px' }}>
                <div>
                    <div className="fee-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>Transport Management</h1>
                        <span className="live-badge" style={{
                            background: '#ecfdf5', color: '#10b981', padding: '4px 12px',
                            borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <span className="pulsing-dot" style={{
                                width: '8px', height: '8px', background: '#10b981', borderRadius: '50%',
                                display: 'block'
                            }}></span>
                            System Operational
                        </span>
                    </div>
                    <div className="fee-subtitle" style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                        Manage fleet, routes, drivers, and student transport safety in real-time
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="nav-tabs hide-scrollbar" style={{
                display: 'flex', gap: '4px', borderBottom: '1px solid #e2e8f0',
                marginBottom: '24px', overflowX: 'auto', paddingBottom: '2px'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px 20px',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                            color: activeTab === tab.id ? '#6366f1' : '#64748b',
                            fontWeight: activeTab === tab.id ? '600' : '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </nav>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && <TransportDashboard />}
                    {activeTab === 'live' && <LiveTracking />}
                    {activeTab === 'vehicles' && <VehicleManagement />}
                    {activeTab === 'drivers' && <DriverManagement />}
                    {activeTab === 'routes' && <RouteManagement />}
                    {activeTab === 'students' && <StudentMapping />}
                    {activeTab === 'attendance' && <TransportAttendance />}
                    {activeTab === 'fees' && <TransportFees />}
                    {activeTab === 'maintenance' && <VehicleMaintenance />}
                    {activeTab === 'fuel' && <FuelTracking />}
                    {activeTab === 'reports' && <TransportReports />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Transport;
