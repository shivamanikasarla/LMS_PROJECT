import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMapPin, FiNavigation, FiClock, FiAlertTriangle,
    FiCheckCircle, FiMaximize2, FiList, FiTruck
} from 'react-icons/fi';
import TransportService from '../../services/transportService';

const LiveTracking = () => {
    // --- State ---
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Mock Grid Map Dimensions
    const mapWidth = 800;
    const mapHeight = 500;

    // --- Mock Data Init ---
    useEffect(() => {
        const fetchInitialVehicles = async () => {
            try {
                const data = await TransportService.Vehicle.getAllVehicles();
                // Filter only active/moving/gps enabled if needed?
                // For now map all, give random pos if no WS data yet
                const initVehicles = data.map(v => ({
                    id: v.id || v.vehicleNumber,
                    number: v.vehicleNumber,
                    route: v.route ? v.route.routeCode : 'Unassigned',
                    type: v.vehicletype || 'Bus',
                    x: Math.random() * 80 + 10, // Mock init pos
                    y: Math.random() * 80 + 10,
                    speed: 0,
                    status: 'Offline', // Start offline, WS will update
                    lastUpdate: 'Waiting for signal...',
                    eta: '-'
                }));
                setVehicles(initVehicles);
            } catch (err) {
                console.error("Failed to fetch vehicles for tracking", err);
            }
        };

        fetchInitialVehicles();
    }, []);

    // --- WebSocket Live Tracking ---
    useEffect(() => {
        const socket = new WebSocket("ws://192.168.1.4:9191/ws/live-tracking");

        socket.onopen = () => {
            console.log("✅ WebSocket connected");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // Extract vehicle ID safely (handle DTO flat format or Entity nested format)
                const incomingVehicleId = data.vehicleId || data.vehicle?.id;

                // Map Backend Enum (ACTIVE, STOPPED, etc.) to Frontend UI Status
                let mappedStatus = data.status;
                if (data.status === 'ACTIVE') mappedStatus = 'Moving';
                if (data.status === 'IDLE') mappedStatus = 'Stopped';
                if (data.status === 'OFFLINE') mappedStatus = 'Offline';
                if (data.status === 'STOPPED') mappedStatus = 'Stopped';

                // Map Latitude/Longitude to X/Y for the demo grid (Assuming usage of X/Y or raw lat/long as % for demo)
                // If backend sends specific 'x' and 'y' for the map, prefer those. 
                // Otherwise fall back to lat/long (which might need scaling in a real app, but passing as-is for now).
                const newX = data.x !== undefined ? data.x : (data.latitude || 0);
                const newY = data.y !== undefined ? data.y : (data.longitude || 0);

                setVehicles(prev =>
                    prev.map(v =>
                        Number(v.id) === Number(incomingVehicleId)
                            ? {
                                ...v,
                                x: newX,
                                y: newY,
                                speed: data.speed,
                                status: mappedStatus,
                                lastUpdate: 'Just now'
                            }
                            : v
                    )
                );
            } catch (err) {
                console.warn("⚠️ Ignored non-JSON WebSocket message:", event.data);
            }
        };

        socket.onerror = (err) => {
            console.error("❌ WebSocket error", err);
        };

        socket.onclose = () => {
            console.log(" WebSocket disconnected");
        };

        return () => {
            socket.close();
        };
    }, []);

    const getStatusColor = (status) => {
        // Handle both Frontend 'Moving' and Backend 'ACTIVE' formats
        const s = status?.toUpperCase();
        if (s === 'MOVING' || s === 'ACTIVE') return '#1bce72ff';
        if (s === 'STOPPED' || s === 'IDLE') return '#f59e0b';
        if (s === 'OFFLINE') return '#94a3b8';
        if (s === 'ALERT') return '#ef4444';
        return '#10b981';
    };

    return (
        <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 200px)', minHeight: '600px' }}>

            {/* Map Area */}
            <div className="glass-card" style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiNavigation color="#6366f1" /> Live Fleet Tracking
                    </h3>
                    <div style={{ display: 'flex', gap: 12, fontSize: '13px', color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Moving</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} /> Stopped</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> Alert</span>
                    </div>
                </div>

                {/* Simulated Map Background */}
                <div style={{ flex: 1, position: 'relative', background: '#eef2f6', overflow: 'hidden' }}>

                    {/* Grid Lines for Map effect */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        opacity: 0.5
                    }} />

                    {/* Simulated Roads (SVG) */}
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        <path d="M100,200 Q400,100 700,300 T900,500" fill="none" stroke="white" strokeWidth="12" />
                        <path d="M100,500 Q300,400 500,500 T900,200" fill="none" stroke="white" strokeWidth="12" />

                        <path d="M100,200 Q400,100 700,300 T900,500" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeDasharray="10,10" />
                        <path d="M100,500 Q300,400 500,500 T900,200" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeDasharray="10,10" />
                    </svg>

                    {/* Vehicle Markers */}
                    <AnimatePresence>
                        {vehicles.map(vehicle => (
                            <motion.div
                                key={vehicle.id}
                                layoutId={`vehicle-${vehicle.id}`}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1, scale: 1,
                                    left: `${vehicle.x}%`,
                                    top: `${vehicle.y}%`
                                }}
                                transition={{ type: "spring", stiffness: 50, damping: 20 }} // Smooth movement
                                style={{
                                    position: 'absolute',
                                    transform: 'translate(-50%, -50%)',
                                    cursor: 'pointer',
                                    zIndex: 20
                                }}
                                onClick={() => setSelectedVehicle(vehicle)}
                            >
                                {/* Marker Pulse */}
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute', inset: -8, borderRadius: '50%',
                                        background: getStatusColor(vehicle.status), opacity: 0.2,
                                        animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                                    }} />

                                    {/* Vehicle Icon */}
                                    <div style={{
                                        width: 40, height: 40, background: 'white', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                        border: `2px solid ${getStatusColor(vehicle.status)}`,
                                        color: '#1e293b'
                                    }}>
                                        <FiTruck size={18} />
                                    </div>

                                    {/* Label tooltip */}
                                    <div style={{
                                        position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
                                        background: 'rgba(30, 41, 59, 0.9)', color: 'white',
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '11px',
                                        whiteSpace: 'nowrap', pointerEvents: 'none'
                                    }}>
                                        {vehicle.route}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Floating Controls */}
                <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button style={{ width: 40, height: 40, borderRadius: 8, background: 'white', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiNavigation color="#334155" />
                    </button>
                    <button style={{ width: 40, height: 40, borderRadius: 8, background: 'white', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiMaximize2 color="#334155" />
                    </button>
                </div>
            </div>

            {/* Sidebar List */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="glass-card"
                        style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0 }}>Active Fleet ({vehicles.length})</h4>
                            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiList /></button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                            {vehicles.map(vehicle => (
                                <div
                                    key={vehicle.id}
                                    onClick={() => setSelectedVehicle(vehicle)}
                                    style={{
                                        padding: '12px', marginBottom: '12px', borderRadius: '12px',
                                        background: selectedVehicle?.id === vehicle.id ? '#eff6ff' : 'white',
                                        border: selectedVehicle?.id === vehicle.id ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>{vehicle.number}</span>
                                        <span style={{
                                            fontSize: '11px', fontWeight: '600',
                                            padding: '2px 8px', borderRadius: '12px',
                                            background: getStatusColor(vehicle.status) + '20',
                                            color: getStatusColor(vehicle.status)
                                        }}>
                                            {vehicle.status}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: '4px' }}>
                                        <FiMapPin size={12} /> {vehicle.route}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                                        <span><FiClock size={10} style={{ marginRight: 4 }} />ETA: {vehicle.eta}</span>
                                        <span>Speed: {vehicle.speed} km/h</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Selected Vehicle Detail View */}
                        {selectedVehicle && (
                            <div style={{ padding: '16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>SELECTED VEHICLE</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontWeight: 'bold' }}>{selectedVehicle.number}</div>
                                    <button
                                        onClick={() => setSelectedVehicle(null)}
                                        style={{ fontSize: '11px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Close
                                    </button>
                                </div>
                                <div style={{ marginTop: '8px', fontSize: '13px', color: '#334155' }}>
                                    <div>Route: <strong>{selectedVehicle.route}</strong></div>
                                    <div>Driver: Ramesh Kumar (Simulated)</div>
                                    <div>Next Stop: Central Station</div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {!sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="glass-card"
                    style={{ position: 'absolute', right: 24, top: 100, padding: '12px', cursor: 'pointer', border: 'none', zIndex: 30 }}
                >
                    <FiList size={20} color="#475569" />
                </button>
            )}
        </div>
    );
};

export default LiveTracking;
