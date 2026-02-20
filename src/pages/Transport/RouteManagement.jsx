import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMap, FiPlus, FiSearch, FiEdit2, FiTrash2,
    FiMapPin, FiTruck, FiUsers, FiClock, FiX, FiRefreshCw
} from 'react-icons/fi';
import TransportService from '../../services/transportService';

const RouteManagement = () => {
    // --- State ---
    const [routes, setRoutes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        routeName: '',
        routeCode: '',
        pickupPoints: [],
        dropPoints: [],
        distanceKm: '',
        estimatedTimeMinutes: '',
        active: true
    });
    const [newPickupPoint, setNewPickupPoint] = useState('');
    const [newDropPoint, setNewDropPoint] = useState('');

    // --- Fetch Routes from Backend ---
    const fetchRoutes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await TransportService.Route.getAllRoutes();
            setRoutes(data || []);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch routes:', err);
            alert('Failed to fetch routes: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load routes on mount
    useEffect(() => {
        fetchRoutes();
    }, []);

    // --- Handlers ---
    const handleOpenModal = (route = null) => {
        if (route) {
            setEditingRoute(route);
            setFormData({
                routeName: route.routeName || '',
                routeCode: route.routeCode || '',
                pickupPoints: route.pickupPoints || [],
                dropPoints: route.dropPoints || [],
                distanceKm: route.distanceKm || '',
                estimatedTimeMinutes: route.estimatedTimeMinutes || '',
                active: route.active !== undefined ? route.active : true
            });
        } else {
            setEditingRoute(null);
            setFormData({
                routeName: '',
                routeCode: '',
                pickupPoints: [],
                dropPoints: [],
                distanceKm: '',
                estimatedTimeMinutes: '',
                active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRoute(null);
    };

    const handleDelete = async (routeCode) => {
        if (window.confirm('Are you sure you want to delete this route?')) {
            try {
                setLoading(true);
                await TransportService.Route.deleteRoute(routeCode);
                setRoutes(routes.filter(r => r.routeCode !== routeCode));
            } catch (error) {
                console.error('Error deleting route:', error);
                alert('Failed to delete route: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.pickupPoints || formData.pickupPoints.length === 0) {
            alert('Please add at least one pickup point');
            return;
        }
        if (!formData.dropPoints || formData.dropPoints.length === 0) {
            alert('Please add at least one drop point');
            return;
        }

        try {
            setLoading(true);

            // Prepare payload matching backend RouteWay model
            const payload = {
                routeName: formData.routeName,
                routeCode: formData.routeCode,
                pickupPoints: formData.pickupPoints,
                dropPoints: formData.dropPoints,
                distanceKm: parseFloat(formData.distanceKm) || null,
                estimatedTimeMinutes: parseInt(formData.estimatedTimeMinutes) || null,
                active: formData.active
            };

            if (editingRoute) {
                // Update existing route
                const updated = await TransportService.Route.updateRoute(editingRoute.routeCode, payload);
                setRoutes(routes.map(r => r.routeCode === editingRoute.routeCode ? updated : r));
            } else {
                // Create new route
                const newRoute = await TransportService.Route.createRoute(payload);
                setRoutes([...routes, newRoute]);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving route:', error);
            alert('Failed to save route: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredRoutes = routes.filter(r =>
        (r.routeName && r.routeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.routeCode && r.routeCode.toString().toLowerCase().includes(searchTerm.toLowerCase()))
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
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={fetchRoutes}
                        disabled={loading}
                        style={{
                            background: loading ? '#94a3b8' : '#10b981',
                            color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: '600',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        <FiRefreshCw /> {loading ? 'Loading...' : 'Refresh'}
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        disabled={loading}
                        className="btn-primary"
                        style={{
                            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: '600',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        <FiPlus /> Create Route
                    </button>
                </div>
            </div>

            {/* Routes Grid - Only 2 cards per row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px', maxWidth: '100%' }}>
                <AnimatePresence>
                    {filteredRoutes.map(route => {
                        const vehiclesCount = (route.vehicles && route.vehicles.length) || 0;
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
                                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#6366f1', background: '#e0e7ff', padding: '4px 12px', borderRadius: '6px' }}>R-{route.routeCode}</span>
                                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>{route.routeName}</h3>
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#64748b', marginTop: '8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <FiTruck size={14} /> {vehiclesCount > 0 ? `${vehiclesCount} vehicle(s) assigned` : 'No vehicles assigned'}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button onClick={() => handleOpenModal(route)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', padding: '8px', borderRadius: '8px' }}><FiEdit2 size={16} /></button>
                                        <button onClick={() => handleDelete(route.routeCode)} style={{ background: '#fef2f2', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '8px', borderRadius: '8px' }}><FiTrash2 size={16} /></button>
                                    </div>
                                </div>

                                {/* Pickup Points */}
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        🚏 Pickup Points
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {(route.pickupPoints || [route.pickupPoint]).filter(Boolean).map((point, idx) => (
                                            <span key={idx} style={{ padding: '6px 12px', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '6px', fontSize: '12px', color: '#065f46', fontWeight: '500' }}>
                                                {point}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Drop Points */}
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        📍 Drop Points
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {(route.dropPoints || [route.dropPoint]).filter(Boolean).map((point, idx) => (
                                            <span key={idx} style={{ padding: '6px 12px', background: '#fef2f2', border: '1px solid #ef4444', borderRadius: '6px', fontSize: '12px', color: '#991b1b', fontWeight: '500' }}>
                                                {point}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiClock /> {route.estimatedTimeMinutes ? `${route.estimatedTimeMinutes} mins` : 'N/A'}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiMap /> {route.distanceKm ? `${route.distanceKm} km` : 'N/A'}</div>
                                </div>

                                <div style={{ background: route.active ? '#ecfdf5' : '#fef2f2', padding: '8px 12px', borderRadius: '6px', textAlign: 'center' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: route.active ? '#10b981' : '#ef4444' }}>
                                        {route.active ? '✅ Active' : '❌ Inactive'}
                                    </span>
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
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ margin: 0 }}>{editingRoute ? 'Edit Route' : 'Create New Route'}</h3>
                                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <FormInput
                                        label="Route Name"
                                        value={formData.routeName}
                                        onChange={e => setFormData({ ...formData, routeName: e.target.value })}
                                        required
                                        placeholder="e.g. North City Route"
                                    />
                                    <FormInput
                                        label="Route Code"
                                        type="number"
                                        value={formData.routeCode}
                                        onChange={e => setFormData({ ...formData, routeCode: e.target.value })}
                                        required
                                        placeholder="e.g. 101"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <FormInput
                                        label="Distance (km)"
                                        type="number"
                                        step="0.1"
                                        value={formData.distanceKm}
                                        onChange={e => setFormData({ ...formData, distanceKm: e.target.value })}
                                        placeholder="e.g. 15.5"
                                    />
                                    <FormInput
                                        label="Est. Time (minutes)"
                                        type="number"
                                        value={formData.estimatedTimeMinutes}
                                        onChange={e => setFormData({ ...formData, estimatedTimeMinutes: e.target.value })}
                                        placeholder="e.g. 45"
                                    />
                                </div>

                                {/* Pickup Points */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>
                                        🚏 Pickup Points <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <input
                                            type="text"
                                            value={newPickupPoint}
                                            onChange={e => setNewPickupPoint(e.target.value)}
                                            placeholder="Add pickup point..."
                                            style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            onKeyPress={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (newPickupPoint.trim()) {
                                                        setFormData({ ...formData, pickupPoints: [...(formData.pickupPoints || []), newPickupPoint.trim()] });
                                                        setNewPickupPoint('');
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (newPickupPoint.trim()) {
                                                    setFormData({ ...formData, pickupPoints: [...(formData.pickupPoints || []), newPickupPoint.trim()] });
                                                    setNewPickupPoint('');
                                                }
                                            }}
                                            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {(formData.pickupPoints || []).map((point, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '6px', fontSize: '13px', color: '#065f46' }}>
                                                {point}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, pickupPoints: formData.pickupPoints.filter((_, i) => i !== idx) })}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#10b981' }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Drop Points */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>
                                        📍 Drop Points <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <input
                                            type="text"
                                            value={newDropPoint}
                                            onChange={e => setNewDropPoint(e.target.value)}
                                            placeholder="Add drop point..."
                                            style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            onKeyPress={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (newDropPoint.trim()) {
                                                        setFormData({ ...formData, dropPoints: [...(formData.dropPoints || []), newDropPoint.trim()] });
                                                        setNewDropPoint('');
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (newDropPoint.trim()) {
                                                    setFormData({ ...formData, dropPoints: [...(formData.dropPoints || []), newDropPoint.trim()] });
                                                    setNewDropPoint('');
                                                }
                                            }}
                                            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {(formData.dropPoints || []).map((point, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#fef2f2', border: '1px solid #ef4444', borderRadius: '6px', fontSize: '13px', color: '#991b1b' }}>
                                                {point}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, dropPoints: formData.dropPoints.filter((_, i) => i !== idx) })}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#ef4444' }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Status Toggle */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <input
                                        type="checkbox"
                                        id="active-toggle"
                                        checked={formData.active}
                                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                        style={{ width: 18, height: 18 }}
                                    />
                                    <label htmlFor="active-toggle" style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>Route is Active</label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                    style={{
                                        marginTop: '16px',
                                        padding: '12px',
                                        background: loading ? '#94a3b8' : '#4f46e5',
                                        color: 'white',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: '600',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.6 : 1
                                    }}
                                >
                                    {loading ? 'Saving...' : (editingRoute ? 'Update Route' : 'Create Route')}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const FormInput = ({ label, type = "text", value, onChange, placeholder, required = false, step }) => (
    <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>{label} {required && <span style={{ color: '#ef4444' }}>*</span>}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            step={step}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', transition: 'border 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
    </div>
);

export default RouteManagement;
