import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiTruck, FiPlus, FiSearch, FiEdit2, FiTrash2,
    FiAlertCircle, FiCheckCircle, FiTool, FiX
} from 'react-icons/fi';

const VehicleManagement = () => {
    // --- State ---
    const [vehicles, setVehicles] = useState(() => {
        const saved = localStorage.getItem('lms_transport_vehicles');
        return saved ? JSON.parse(saved) : [
            { id: 1, number: 'KA-01-AB-1234', type: 'Bus', capacity: 50, occupiedSeats: 45, gps: true, route: 'R-01', status: 'Active' },
            { id: 2, number: 'KA-05-XY-9876', type: 'Van', capacity: 20, occupiedSeats: 12, gps: true, route: 'R-04', status: 'Active' },
            { id: 3, number: 'KA-53-ZZ-5555', type: 'Bus', capacity: 45, occupiedSeats: 0, gps: false, route: '', status: 'Maintenance' },
        ];
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [formData, setFormData] = useState({
        number: '', type: 'Bus', capacity: '', occupiedSeats: '', gps: false, route: '', status: 'Active'
    });

    // --- Persist Data ---
    useEffect(() => {
        localStorage.setItem('lms_transport_vehicles', JSON.stringify(vehicles));
    }, [vehicles]);

    // --- Handlers ---
    const handleOpenModal = (vehicle = null) => {
        if (vehicle) {
            setEditingVehicle(vehicle);
            setFormData(vehicle);
        } else {
            setEditingVehicle(null);
            setFormData({ number: '', type: 'Bus', capacity: '', occupiedSeats: '', gps: false, route: '', status: 'Active' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVehicle(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            setVehicles(vehicles.filter(v => v.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation: Maintenance vehicles cannot have active routes
        if (formData.status === 'Maintenance' && formData.route) {
            alert('Maintenance vehicles cannot be assigned to a route.');
            return;
        }

        if (editingVehicle) {
            setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...formData, id: v.id } : v));
        } else {
            setVehicles([...vehicles, { ...formData, id: Date.now() }]);
        }
        handleCloseModal();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return '#10b981';
            case 'Maintenance': return '#f59e0b';
            case 'Inactive': return '#ef4444';
            default: return '#64748b';
        }
    };

    const filteredVehicles = vehicles.filter(v =>
        v.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header / Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, flex: 1, maxWidth: '400px' }}>
                    <FiSearch color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search by vehicle number or type..."
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
                    <FiPlus /> Add Vehicle
                </button>
            </div>

            {/* Vehicle List */}
            <div className="table-container glass-card" style={{ overflowX: 'auto' }}>
                <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '16px' }}>Vehicle Info</th>
                            <th style={{ padding: '16px' }}>Capacity</th>
                            <th style={{ padding: '16px' }}>GPS</th>
                            <th style={{ padding: '16px' }}>Route</th>
                            <th style={{ padding: '16px' }}>Status</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredVehicles.length > 0 ? (
                                filteredVehicles.map(vehicle => (
                                    <motion.tr
                                        key={vehicle.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        style={{ borderBottom: '1px solid #f1f5f9' }}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                                    <FiTruck />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{vehicle.number}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{vehicle.type}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: '#334155' }}>
                                            {vehicle.occupiedSeats || 0} / {vehicle.capacity} Seats
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            {vehicle.gps ? (
                                                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, fontSize: '13px' }}>
                                                    <FiCheckCircle /> Active
                                                </span>
                                            ) : (
                                                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, fontSize: '13px' }}>
                                                    <FiX /> Disabled
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            {vehicle.route ? (
                                                <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: 4, fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>
                                                    {vehicle.route}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>Unassigned</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                background: `${getStatusColor(vehicle.status)}15`,
                                                color: getStatusColor(vehicle.status),
                                                padding: '4px 12px', borderRadius: '20px',
                                                fontSize: '12px', fontWeight: '600',
                                                display: 'inline-flex', alignItems: 'center', gap: 6
                                            }}>
                                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                                                {vehicle.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                <button
                                                    onClick={() => handleOpenModal(vehicle)}
                                                    style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: 6, cursor: 'pointer', color: '#475569' }}
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(vehicle.id)}
                                                    style={{ border: 'none', background: '#fef2f2', padding: 8, borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                        No vehicles found matching your search.
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            style={{
                                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                                zIndex: 50, backdropFilter: 'blur(4px)'
                            }}
                        />
                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
                            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%',
                                width: '100%', maxWidth: '500px', background: 'white', borderRadius: '16px',
                                padding: '24px', zIndex: 51, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ margin: 0, fontSize: '20px' }}>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <FormInput label="Vehicle Number" value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} required placeholder="e.g. KA-01-AB-1234" />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Type</label>
                                        <select
                                            className="form-select" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option>Bus</option>
                                            <option>Van</option>
                                            <option>Cab</option>
                                        </select>
                                    </div>
                                    <FormInput label="Capacity" type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || '' })} required placeholder="e.g. 50" />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <FormInput
                                        label="Occupied Seats"
                                        type="number"
                                        value={formData.occupiedSeats}
                                        onChange={e => setFormData({ ...formData, occupiedSeats: parseInt(e.target.value) || '' })}
                                        placeholder="e.g. 25"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Status</label>
                                        <select
                                            className="form-select" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <FormInput label="Route Assignment" value={formData.route} onChange={e => setFormData({ ...formData, route: e.target.value })} placeholder="e.g. R-01 (Optional)" />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <input
                                        type="checkbox"
                                        id="gps-toggle"
                                        checked={formData.gps}
                                        onChange={e => setFormData({ ...formData, gps: e.target.checked })}
                                        style={{ width: 18, height: 18 }}
                                    />
                                    <label htmlFor="gps-toggle" style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>Enable GPS Tracking</label>
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: '8px', padding: '12px', background: '#4f46e5', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                                    {editingVehicle ? 'Update Vehicle' : 'Create Vehicle'}
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

export default VehicleManagement;
