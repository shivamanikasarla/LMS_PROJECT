import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiTruck, FiUsers, FiMap, FiUserCheck, FiActivity,
    FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';
import { useTransportTheme } from './Transport';

const TransportDashboard = () => {
    const theme = useTransportTheme();
    const isDark = theme?.isDark || false;

    // Color helper
    const colors = {
        text: isDark ? '#1970c6ff' : '#1e293b',
        textSecondary: isDark ? '#e2e8f0' : '#334155',
        textMuted: isDark ? '#94a3b8' : '#64748b',
        cardBg: isDark ? '#1e293b' : '#ffffff',
        innerCircle: isDark ? '#0f172a' : '#ffffff',
    };

    // Simulated Real-time Data
    const [stats, setStats] = useState({
        totalVehicles: 12,
        activeDrivers: 10,
        activeRoutes: 8,
        studentsTransported: 345,
        systemStatus: 'Operational' // Operational, Delayed, Maintenance
    });

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const [vehicleStatus, setVehicleStatus] = useState({
        active: 8,
        maintenance: 2,
        inactive: 2
    });

    const [routeOccupancy, setRouteOccupancy] = useState([
        { route: 'R-01', capacity: 50, used: 42 },
        { route: 'R-02', capacity: 50, used: 48 },
        { route: 'R-03', capacity: 30, used: 25 },
        { route: 'R-04', capacity: 30, used: 10 },
        { route: 'R-05', capacity: 50, used: 35 },
    ]);

    // Simulate Live Updates
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                studentsTransported: prev.studentsTransported + (Math.random() > 0.5 ? 1 : -1)
            }));

            setRouteOccupancy(prev => prev.map(r => ({
                ...r,
                used: Math.max(0, Math.min(r.capacity, r.used + (Math.floor(Math.random() * 3) - 1)))
            })));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Helper for Pie Chart Gradient
    const getPieGradient = () => {
        const total = vehicleStatus.active + vehicleStatus.maintenance + vehicleStatus.inactive;
        const activePct = (vehicleStatus.active / total) * 100;
        const maintPct = (vehicleStatus.maintenance / total) * 100;

        return `conic-gradient(
            #10b981 0% ${activePct}%, 
            #f59e0b ${activePct}% ${activePct + maintPct}%, 
            #ef4444 ${activePct + maintPct}% 100%
        )`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Live Status Header */}
            <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: stats.systemStatus === 'Operational' ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5') : (isDark ? 'rgba(245, 158, 11, 0.15)' : '#fff7ed'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: stats.systemStatus === 'Operational' ? '#10b981' : '#f59e0b'
                    }}>
                        <FiActivity size={20} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '16px', color: colors.text }}>System Status: <span style={{ color: stats.systemStatus === 'Operational' ? '#10b981' : '#f59e0b' }}>{stats.systemStatus}</span></h3>
                        <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>Live updates enabled • Auto-refreshing every 5s</p>
                    </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: colors.textMuted }}>
                    {currentTime.toLocaleTimeString()}
                </div>
            </div>

            {/* KPI Grid */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                <KpiCard
                    title="Total Vehicles"
                    value={stats.totalVehicles}
                    icon={<FiTruck />}
                    color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                    trend="+2 this month"
                    isDark={isDark}
                />
                <KpiCard
                    title="Active Drivers"
                    value={stats.activeDrivers}
                    icon={<FiUsers />}
                    color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                    trend="Full attendance"
                    isDark={isDark}
                />
                <KpiCard
                    title="Active Routes"
                    value={stats.activeRoutes}
                    icon={<FiMap />}
                    color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    trend="All operational"
                    isDark={isDark}
                />
                <KpiCard
                    title="Students Transported"
                    value={stats.studentsTransported}
                    icon={<FiUserCheck />}
                    color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    trend="+12% vs last month"
                    isDark={isDark}
                />
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>

                {/* Route Occupancy Chart */}
                <div className="glass-card" style={{ padding: '24px', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: colors.text }}>Route Occupancy</h3>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '16px', justifyContent: 'space-around' }}>
                        {routeOccupancy.map((route, i) => {
                            const pct = (route.used / route.capacity) * 100;
                            return (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                                    <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', color: colors.textSecondary }}>{pct.toFixed(0)}%</div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${pct}%` }}
                                        style={{
                                            width: '100%', maxWidth: '40px',
                                            background: pct > 90 ? '#f30808ff' : pct > 70 ? '#f59e0b' : '#3b82f6',
                                            borderRadius: '8px 8px 0 0',
                                            minHeight: '4px'
                                        }}
                                    />
                                    <div style={{ marginTop: '8px', fontSize: '12px', color: colors.textMuted }}>{route.route}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Vehicle Status Pie Chart */}
                <div className="glass-card" style={{ padding: '24px', minHeight: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ alignSelf: 'flex-start', margin: '0 0 24px 0', fontSize: '18px', color: colors.text }}>Vehicle Status</h3>
                    <div style={{ position: 'relative', width: '200px', height: '200px', borderRadius: '50%', background: getPieGradient() }}>
                        <div style={{
                            position: 'absolute', inset: '30px', background: colors.innerCircle, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                            boxShadow: isDark ? 'inset 0 2px 5px rgba(0,0,0,0.2)' : 'inset 0 2px 5px rgba(0,0,0,0.05)'
                        }}>
                            <span style={{ fontSize: '32px', fontWeight: 'bold', color: colors.text }}>{stats.totalVehicles}</span>
                            <span style={{ fontSize: '12px', color: colors.textMuted, textTransform: 'uppercase' }}>Total Fleet</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', marginTop: '32px' }}>
                        <StatusLegend color="#10b981" label="Active" value={vehicleStatus.active} isDark={isDark} />
                        <StatusLegend color="#f59e0b" label="Maintenance" value={vehicleStatus.maintenance} isDark={isDark} />
                        <StatusLegend color="#ef4444" label="Inactive" value={vehicleStatus.inactive} isDark={isDark} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Sub-components
const KpiCard = ({ title, value, icon, color, trend, isDark }) => {
    const textColor = isDark ? '#f1f5f9' : '#1e293b';
    const mutedColor = isDark ? '#94a3b8' : '#64748b';

    return (
        <motion.div
            className="glass-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ y: -5 }}
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '12px', background: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    fontSize: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    {icon}
                </div>
            </div>
            <div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: textColor, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '13px', color: mutedColor, marginTop: '4px' }}>{title}</div>
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiActivity /> {trend}
            </div>
        </motion.div>
    );
};

const StatusLegend = ({ color, label, value, isDark }) => {
    const textColor = isDark ? '#f1f5f9' : '#334155';
    const mutedColor = isDark ? '#94a3b8' : '#94a3b8';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: textColor }}>{value}</span>
                <span style={{ fontSize: '11px', color: mutedColor }}>{label}</span>
            </div>
        </div>
    );
};

export default TransportDashboard;
