import React, { useState, useEffect, createContext, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid, FiTruck, FiUsers, FiMap, FiUserCheck,
    FiActivity, FiMapPin, FiCheckSquare, FiTool, FiDroplet, FiBarChart2,
    FiSun, FiMoon
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
import './Transport.css';

import { TransportThemeProvider, useTransportTheme } from "./TransportContext.jsx";

const TransportContent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const { isDark, toggleTheme, colors } = useTransportTheme();

    // Sync URL with Active Tab
    useEffect(() => {
        const path = location.pathname;
        if (path === '/transport' || path === '/transport/') {
            setActiveTab('dashboard');
        } else if (path.includes('/transport/live')) {
            setActiveTab('live');
        } else if (path.includes('/transport/vehicles')) {
            setActiveTab('vehicles');
        } else if (path.includes('/transport/drivers')) {
            setActiveTab('drivers');
        } else if (path.includes('/transport/routes')) {
            setActiveTab('routes');
        } else if (path.includes('/transport/student-mapping')) {
            setActiveTab('students');
        } else if (path.includes('/transport/attendance')) {
            setActiveTab('attendance');
        } else if (path.includes('/transport/fees')) {
            setActiveTab('fees');
        } else if (path.includes('/transport/maintenance')) {
            setActiveTab('maintenance');
        } else if (path.includes('/transport/fuel')) {
            setActiveTab('fuel');
        } else if (path.includes('/transport/reports')) {
            setActiveTab('reports');
        }
    }, [location.pathname]);

    return (
        <div
            className={`transport-module ${isDark ? 'dark-mode' : 'light-mode'}`}
            style={{
                maxWidth: '1600px',
                margin: '-24px auto 0',
                minHeight: '100vh',
                transition: 'all 0.3s ease'
            }}
        >
            {/* Header */}
            <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.text, margin: 0 }}>Transport Management</h1>
                        <span style={{
                            background: isDark ? 'rgba(52, 211, 153, 0.15)' : '#ecfdf5',
                            color: isDark ? '#34d399' : '#10b981',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <span style={{
                                width: '8px', height: '8px',
                                background: isDark ? '#34d399' : '#10b981',
                                borderRadius: '50%',
                                display: 'block',
                                animation: 'pulse 2s infinite'
                            }}></span>
                            System Operational
                        </span>
                    </div>
                    <div style={{ color: colors.textSecondary, fontSize: '14px', marginTop: '4px' }}>
                        Manage fleet, routes, drivers, and student transport safety in real-time
                    </div>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        background: isDark ? '#334155' : 'white',
                        border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                        color: isDark ? '#fbbf24' : '#64748b',
                        padding: '10px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s ease'
                    }}
                    title="Toggle Dark Mode"
                >
                    {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>
            </header>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
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

const Transport = () => {
    return (
        <TransportThemeProvider>
            <TransportContent />
        </TransportThemeProvider>
    );
};

export default Transport;
