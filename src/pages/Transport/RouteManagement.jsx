import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMap, FiPlus, FiSearch, FiEdit2, FiTrash2,
    FiMapPin, FiTruck, FiUsers, FiClock, FiX
} from 'react-icons/fi';

const RouteManagement = () => {
    // --- State ---
    const [routes, setRoutes] = useState(() => {
        const saved = localStorage.getItem('lms_transport_routes');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Route 01: North City', code: 'R-01', vehicle: 'KA-01-AB-1234', capacity: 50, enrolled: 42, distance: '15 km', time: '45 mins', stops: ['Central Station', 'Market Road', 'North Avenue', 'College Campus'] },
            { id: 2, name: 'Route 02: South City', code: 'R-02', vehicle: 'KA-05-XY-9876', capacity: 20, enrolled: 18, distance: '12 km', time: '40 mins', stops: ['South Park', 'Mall Road', 'Tech Park', 'College Campus'] },
        ];
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);
    const [formData, setFormData] = useState({
        name: '', code: '', vehicle: '', capacity: '', distance: '', time: '', stops: ['']
    });

    // --- Persist Data ---
    useEffect(() => {
        localStorage.setItem('lms_transport_routes', JSON.stringify(routes));
    }, [routes]);

    // --- Handlers ---
    const handleOpenModal = (route = null) => {
        if (route) {
            setEditingRoute(route);
            setFormData(route);
        } else {
            setEditingRoute(null);
            setFormData({
                name: '', code: '', vehicle: '', capacity: '', enrolled: 0, distance: '', time: '', stops: ['']
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRoute(null);
    };

    const handleDelete = (id) => {
        const route = routes.find(r => r.id === id);
        if (route.enrolled > 0) {
            alert('Cannot delete a route with enrolled students!');
            return;
        }
        if (window.confirm('Are you sure you want to delete this route?')) {
            setRoutes(routes.filter(r => r.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Filter empty stops
        const validStops = formData.stops.filter(stop => stop.trim() !== '');

        const finalData = { ...formData, stops: validStops };

        if (editingRoute) {
            setRoutes(routes.map(r => r.id === editingRoute.id ? { ...finalData, id: r.id } : r));
        } else {
            setRoutes([...routes, { ...finalData, id: Date.now(), enrolled: 0 }]); // New routes start with 0 enrolled
        }
        handleCloseModal();
    };

    const handleStopChange = (index, value) => {
        const newStops = [...formData.stops];
        newStops[index] = value;
        setFormData({ ...formData, stops: newStops });
    };

    const addStop = () => {
        setFormData({ ...formData, stops: [...formData.stops, ''] });
    };

    const removeStop = (index) => {
        const newStops = formData.stops.filter((_, i) => i !== index);
        setFormData({ ...formData, stops: newStops });
    };

    const filteredRoutes = routes.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header / Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, flex: 1, maxWidth: '400px' }}>
                    <FiSearch color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search routes by name or code..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: '600'
                    }}
                >
                    <FiPlus /> Create Route
                </button>
            </div>

            {/* Routes Grid - Only 2 cards per row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px', maxWidth: '100%' }}>
                <AnimatePresence>
                    {filteredRoutes.map(route => {
                        const occupancy = (route.enrolled / route.capacity) * 100;
                        const startPoint = route.stops[0] || 'Not Set';
                        const endPoint = route.stops[route.stops.length - 1] || 'Not Set';
                        return (
                            <motion.div
                                key={route.id}
                                className="glass-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '280px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#6366f1', background: '#e0e7ff', padding: '4px 12px', borderRadius: '6px' }}>{route.code}</span>
                                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>{route.name}</h3>
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#64748b', marginTop: '8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <FiTruck size={14} /> {route.vehicle || 'No Vehicle Assigned'}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button onClick={() => handleOpenModal(route)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', padding: '8px', borderRadius: '8px' }}><FiEdit2 size={16} /></button>
                                        <button onClick={() => handleDelete(route.id)} style={{ background: '#fef2f2', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '8px', borderRadius: '8px' }}><FiTrash2 size={16} /></button>
                                    </div>
                                </div>

                                {/* Pickup → Drop Point */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px 20px',
                                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                    borderRadius: '12px',
                                    border: '1px solid #bae6fd',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)' }} />
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f766e' }}>{startPoint}</span>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ height: '3px', flex: 1, background: 'linear-gradient(90deg, #10b981, #6366f1)', borderRadius: '3px' }} />
                                        <span style={{ margin: '0 12px', fontSize: '20px', color: '#6366f1', fontWeight: 'bold' }}>→</span>
                                        <div style={{ height: '3px', flex: 1, background: 'linear-gradient(90deg, #6366f1, #ef4444)', borderRadius: '3px' }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#b91c1c' }}>{endPoint}</span>
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.2)' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiClock /> {route.time}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiMap /> {route.distance}</div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                        <span style={{ color: '#64748b' }}>Occupancy ({route.enrolled}/{route.capacity})</span>
                                        <span style={{ fontWeight: '600', color: occupancy > 90 ? '#ef4444' : '#10b981' }}>{occupancy.toFixed(0)}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${occupancy}%` }}
                                            style={{ height: '100%', background: occupancy > 90 ? '#ef4444' : '#10b981', borderRadius: '4px' }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: '-50%' }}
                            animate={{ opacity: 1, scale: 1, x: '-50%' }}
                            exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                            style={{
                                position: 'fixed', top: '80px', left: '50%',
                                width: 'calc(100% - 32px)', maxWidth: '480px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
                                background: 'white', borderRadius: '16px', padding: '20px', zIndex: 51,
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ margin: 0 }}>{editingRoute ? 'Edit Route' : 'Create New Route'}</h3>
                                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <FormInput label="Route Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. North City Route" />
                                    <FormInput label="Route Code" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} required placeholder="e.g. R-01" />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <FormInput label="Est. Distance" value={formData.distance} onChange={e => setFormData({ ...formData, distance: e.target.value })} placeholder="e.g. 15 km" />
                                    <FormInput label="Est. Time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} placeholder="e.g. 45 mins" />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <FormInput label="Vehicle Assignment" value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })} placeholder="e.g. KA-01-AB-1234" />
                                    <FormInput label="Total Capacity" type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || '' })} required />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Route Stops</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {formData.stops.map((stop, index) => (
                                            <div key={index} style={{ display: 'flex', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    value={stop}
                                                    onChange={e => handleStopChange(index, e.target.value)}
                                                    placeholder={`Stop #${index + 1}`}
                                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                                    required
                                                />
                                                {formData.stops.length > 1 && (
                                                    <button type="button" onClick={() => removeStop(index)} style={{ border: 'none', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', width: '40px', cursor: 'pointer' }}>
                                                        <FiTrash2 />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={addStop} style={{ padding: '8px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#4f46e5', fontWeight: '500', cursor: 'pointer', marginTop: '4px' }}>
                                            + Add Stop
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: '16px', padding: '12px', background: '#4f46e5', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                                    {editingRoute ? 'Update Route' : 'Create Route'}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const FormInput = ({ label, type = "text", value, onChange, placeholder, required = false }) => (
    <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>{label} {required && <span style={{ color: '#ef4444' }}>*</span>}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', transition: 'border 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
    </div>
);

export default RouteManagement;
