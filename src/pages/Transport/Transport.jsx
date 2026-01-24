import React, { useState, useEffect, createContext, useContext } from 'react';
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
import './Transport.css';

// Create Dark Mode Context
export const TransportThemeContext = createContext();

export const useTransportTheme = () => useContext(TransportThemeContext);

const Transport = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Listen to global theme from sidebar (data-theme attribute on body)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    // Listen for theme changes from sidebar
    useEffect(() => {
        const checkTheme = () => {
            const theme = document.body.getAttribute('data-theme');
            setIsDarkMode(theme === 'dark');
        };

        // Initial check
        checkTheme();

        // Create observer to watch for attribute changes on body
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    checkTheme();
                }
            });
        });

        observer.observe(document.body, { attributes: true });

        // Also listen for storage changes
        const handleStorageChange = (e) => {
            if (e.key === 'theme') {
                setIsDarkMode(e.newValue === 'dark');
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            observer.disconnect();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

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

    // Theme colors
    const theme = {
        isDark: isDarkMode,
        colors: isDarkMode ? {
            bg: '#0f172a',
            surface: '#1e293b',
            card: '#1e293b',
            cardHover: '#334155',
            text: '#f1f5f9',
            textSecondary: '#94a3b8',
            textMuted: '#64748b',
            border: '#334155',
            primary: '#818cf8',
            primaryBg: 'rgba(129, 140, 248, 0.15)',
            success: '#34d399',
            successBg: 'rgba(52, 211, 153, 0.15)',
            warning: '#fbbf24',
            warningBg: 'rgba(251, 191, 36, 0.15)',
            danger: '#f87171',
            dangerBg: 'rgba(248, 113, 113, 0.15)',
            inputBg: '#0f172a',
            inputBorder: '#475569',
            tableHeader: '#1e293b',
            tableRow: '#0f172a',
            tableRowAlt: '#1e293b',
            modalBg: '#1e293b',
            shadow: 'rgba(0, 0, 0, 0.5)',
        } : {
            bg: '#f8fafc',
            surface: '#ffffff',
            card: '#ffffff',
            cardHover: '#f1f5f9',
            text: '#1e293b',
            textSecondary: '#475569',
            textMuted: '#64748b',
            border: '#e2e8f0',
            primary: '#6366f1',
            primaryBg: 'rgba(99, 102, 241, 0.1)',
            success: '#10b981',
            successBg: '#ecfdf5',
            warning: '#f59e0b',
            warningBg: '#fff7ed',
            danger: '#ef4444',
            dangerBg: '#fef2f2',
            inputBg: '#ffffff',
            inputBorder: '#e2e8f0',
            tableHeader: '#f8fafc',
            tableRow: '#ffffff',
            tableRowAlt: '#f8fafc',
            modalBg: '#ffffff',
            shadow: 'rgba(0, 0, 0, 0.1)',
        }
    };

    return (
        <TransportThemeContext.Provider value={theme}>
            <div
                className={`transport-module ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                style={{
                    padding: '24px',
                    maxWidth: '1600px',
                    margin: '0 auto',
                    minHeight: '100vh',
                    background: theme.colors.bg,
                    transition: 'all 0.3s ease'
                }}
            >
                {/* Header */}
                <header style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', color: theme.colors.text, margin: 0 }}>Transport Management</h1>
                        <span style={{
                            background: theme.colors.successBg,
                            color: theme.colors.success,
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
                                background: theme.colors.success,
                                borderRadius: '50%',
                                display: 'block',
                                animation: 'pulse 2s infinite'
                            }}></span>
                            System Operational
                        </span>
                    </div>
                    <div style={{ color: theme.colors.textMuted, fontSize: '14px', marginTop: '4px' }}>
                        Manage fleet, routes, drivers, and student transport safety in real-time
                    </div>
                </header>

                {/* Navigation */}
                <nav className="hide-scrollbar" style={{
                    display: 'flex',
                    gap: '4px',
                    borderBottom: `1px solid ${theme.colors.border}`,
                    marginBottom: '24px',
                    overflowX: 'auto',
                    paddingBottom: '2px'
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
                                color: activeTab === tab.id ? theme.colors.primary : theme.colors.textMuted,
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
        </TransportThemeContext.Provider>
    );
};

export default Transport;
