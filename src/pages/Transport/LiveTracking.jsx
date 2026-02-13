import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMapPin, FiNavigation, FiClock, FiAlertTriangle,
    FiCheckCircle, FiMaximize2, FiList, FiTruck, FiPlay, FiWifiOff
} from 'react-icons/fi';
import TransportService from '../../services/transportService';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Fix Leaflet Marker Icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Bus Icon
const busIcon = new L.DivIcon({
    className: 'custom-bus-icon',
    html: `<div style="background-color: #4f46e5; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
             <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style="color: white;"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

const LiveTracking = () => {
    // --- Debug State ---
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
    };

    // --- State ---
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const stompClientRef = useRef(null);

    // Initial Center (Hyderabad approx)
    const defaultCenter = [17.3850, 78.4867];

    // --- Mock Data Init & WebSocket ---
    useEffect(() => {
        const fetchInitialVehicles = async () => {
            try {
                const data = await TransportService.Vehicle.getAllVehicles();
                const initVehicles = data.map(v => ({
                    id: v.id,
                    number: v.vehicleNumber,
                    route: v.route ? v.route.routeCode : 'Unassigned',
                    lat: 17.3850, // Default center
                    lng: 78.4867,
                    speed: 0,
                    status: 'OFFLINE',
                    lastUpdate: 'Waiting...',
                    hasData: false // Flag to hide marker until data arrives
                }));
                setVehicles(initVehicles);
                addLog(`Loaded ${initVehicles.length} vehicles. Fetching last locations...`);

                // Fetch real last known locations
                initVehicles.forEach(async (v) => {
                    try {
                        const loc = await TransportService.Tracking.getLatestLocation(v.id);
                        if (loc) {
                            setVehicles(prev => prev.map(pv =>
                                pv.id === v.id ? {
                                    ...pv,
                                    lat: loc.latitude,
                                    lng: loc.longitude,
                                    speed: loc.speed,
                                    status: loc.status || 'IDLE',
                                    lastUpdate: new Date(loc.timestamp).toLocaleTimeString(),
                                    hasData: true
                                } : pv
                            ));
                        }
                    } catch (e) {
                        // No history found, keep as OFFLINE/Waiting
                    }
                });

            } catch (err) {
                console.error("Failed to fetch vehicles for tracking", err);
                addLog("Failed to fetch initial vehicle list.");
            }
        };

        fetchInitialVehicles();
        connectWebSocket();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    const connectWebSocket = () => {
        // Use relative URL to leverage Vite Proxy (configured in vite.config.js)
        const socketUrl = '/gps-websocket';
        addLog(`Connecting to WS: ${socketUrl} (via Proxy)`);

        try {
            const client = new Client({
                webSocketFactory: () => new SockJS(socketUrl),
                debug: (str) => {
                    // console.log(str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: (frame) => {
                    addLog("✅ Connected to WebSocket");
                    setIsConnected(true);

                    // Subscribe to vehicles 1-20
                    for (let i = 1; i <= 20; i++) {
                        client.subscribe(`/topic/vehicle/${i}`, (message) => {
                            handleGpsUpdate(JSON.parse(message.body));
                        });
                    }
                },
                onStompError: (frame) => {
                    addLog(`❌ Broker Error: ${frame.headers['message']}`);
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
                onWebSocketClose: () => {
                    // Only log if previously connected to avoid spam on initial fail loop
                    if (isConnected) {
                        addLog("⚠️ WebSocket Closed");
                        setIsConnected(false);
                    }
                }
            });

            client.activate();
            stompClientRef.current = client;

        } catch (e) {
            addLog(`Connection Exception: ${e.message}`);
            console.error(e);
        }
    };

    const handleGpsUpdate = (data) => {
        // Support both old Entity structure (data.vehicle.id) and new DTO structure (data.vehicleId)
        const vehicleId = data.vehicleId || data.vehicle?.id;

        if (!vehicleId) {
            console.warn("Received GPS update without vehicle ID:", data);
            return;
        }

        addLog(`Update V-${vehicleId}: [${data.latitude}, ${data.longitude}]`);

        setVehicles(prev => prev.map(v => {
            if (v.id === vehicleId) {
                return {
                    ...v,
                    lat: data.latitude,
                    lng: data.longitude,
                    speed: data.speed,
                    status: data.status,
                    lastUpdate: new Date(data.timestamp).toLocaleTimeString(),
                    hasData: true
                };
            }
            return v;
        }));
    };

    const simulateMovement = async () => {
        // Pick a random vehicle (e.g., first one or ID 1)
        if (vehicles.length === 0) return;
        const target = vehicles[0];

        // Move it slightly
        const newLat = target.lat + 0.001;
        const newLng = target.lng + 0.001;

        addLog(`Sending Sim Update for V-${target.id}...`);

        // Optimistic Update
        setVehicles(prev => prev.map(v => v.id === target.id ? { ...v, lat: newLat, lng: newLng, speed: 35, status: 'MOVING' } : v));

        try {
            await TransportService.Tracking.sendGpsData(target.id, newLat, newLng, 35);
            addLog("Sim data sent to backend.");
            // Note: The websocket should receive this and update the UI automatically!
        } catch (e) {
            addLog("Failed to send sim data to backend.");
            console.error(e);
        }
    };

    // --- Render Helpers ---
    const getStatusColor = (status) => {
        const s = status?.toUpperCase();
        if (s === 'ACTIVE' || s === 'MOVING') return '#10b981';
        if (s === 'IDLE' || s === 'STOPPED') return '#f59e0b';
        if (s === 'OFFLINE') return '#94a3b8';
        return '#64748b';
    };

    // Component to auto-center map
    const MapRecenter = ({ lat, lng }) => {
        const map = useMap();
        useEffect(() => {
            if (lat && lng) {
                map.flyTo([lat, lng], 15);
            }
        }, [lat, lng, map]);
        return null;
    };

    return (
        <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 140px)', minHeight: '600px', position: 'relative' }}>

            {/* Map Container */}
            <div className="glass-card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', zIndex: 1000 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: '16px' }}>
                            <FiNavigation color="#4f46e5" /> Live Fleet Tracking
                        </h3>
                        {isConnected ?
                            <span style={{ fontSize: '12px', color: '#10b981', background: '#ecfdf5', padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 1s infinite' }} /> Connected
                            </span>
                            :
                            <span style={{ fontSize: '12px', color: '#ef4444', background: '#fef2f2', padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <FiWifiOff size={10} /> Disconnected
                            </span>
                        }
                    </div>
                    <button onClick={simulateMovement} style={{ fontSize: '12px', padding: '6px 12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FiPlay size={12} /> Simulate Move
                    </button>
                </div>

                <div style={{ flex: 1, position: 'relative' }}>
                    <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {vehicles.filter(v => v.hasData).map(v => (
                            <Marker key={v.id} position={[v.lat, v.lng]} icon={busIcon} eventHandlers={{ click: () => setSelectedVehicle(v) }}>
                                <Popup>
                                    <div style={{ minWidth: '150px' }}>
                                        <strong style={{ display: 'block', marginBottom: '4px' }}>{v.number}</strong>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>Route: {v.route}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>Speed: {Math.round(v.speed)} km/h</div>
                                        <div style={{ marginTop: '4px', fontSize: '12px', fontWeight: 'bold', color: getStatusColor(v.status) }}>
                                            {v.status}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {selectedVehicle && <MapRecenter lat={selectedVehicle.lat} lng={selectedVehicle.lng} />}
                    </MapContainer>

                    {/* Debug Overlay */}
                    <div style={{
                        position: 'absolute', bottom: 10, left: 10, right: 10,
                        background: 'rgba(0,0,0,0.8)', borderRadius: '8px',
                        padding: '10px', color: '#34d399', fontFamily: 'monospace',
                        fontSize: '11px', maxHeight: '120px', overflowY: 'auto',
                        zIndex: 2000, pointerEvents: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ borderBottom: '1px solid #333', paddingBottom: '4px', marginBottom: '4px', color: '#fff', fontWeight: 'bold' }}>
                            Connection Status: {isConnected ? 'ONLINE' : 'OFFLINE'}
                        </div>
                        {logs.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </div>
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
                            <h4 style={{ margin: 0 }}>Vehicles ({vehicles.length})</h4>
                            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiList /></button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {vehicles.map(vehicle => (
                                <div
                                    key={vehicle.id}
                                    onClick={() => setSelectedVehicle(vehicle)}
                                    style={{
                                        padding: '12px', borderRadius: '8px',
                                        background: selectedVehicle?.id === vehicle.id ? '#eff6ff' : 'white',
                                        border: selectedVehicle?.id === vehicle.id ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
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
                                        <span><FiClock size={10} style={{ marginRight: 4 }} />{vehicle.lastUpdate}</span>
                                        <span>{Math.round(vehicle.speed)} km/h</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="glass-card"
                    style={{ position: 'absolute', right: 24, top: 24, padding: '12px', cursor: 'pointer', border: 'none', zIndex: 1000 }}
                >
                    <FiList size={20} color="#475569" />
                </button>
            )}
        </div>
    );
};

export default LiveTracking;
