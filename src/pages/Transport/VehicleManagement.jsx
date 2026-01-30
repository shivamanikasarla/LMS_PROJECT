import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiTruck, FiPlus, FiSearch, FiEdit2, FiTrash2,
    FiAlertCircle, FiCheckCircle, FiTool, FiX
} from 'react-icons/fi';
import TransportService from '../../services/transportService';

const VehicleManagement = () => {
    // --- State ---
    const [vehicles, setVehicles] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        vehicletype: 'BUS',
        capacity: '',
        occupiedSeats: '',
        gpsEnabled: false,
        route: null,  // Will be route object with just id
        vehicleStatus: 'ACTIVE'
    });

    // --- Fetch Vehicles from Backend ---
    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const data = await TransportService.Vehicle.getAllVehicles();
            setVehicles(data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            console.error('Error details:', error);

            // Check if it's a JSON parsing error
            if (error.message.includes('JSON')) {
                alert(
                    'Backend Response Error!\n\n' +
                    'The backend is returning invalid JSON. This is likely due to circular references in the Vehicle-RouteWay relationship.\n\n' +
                    'Ask your backend developer to add @JsonIgnore to the "vehicles" field in RouteWay model.\n\n' +
                    'Error: ' + error.message
                );
            } else {
                alert('Failed to fetch vehicles: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Fetch Routes from Backend ---
    const fetchRoutes = async () => {
        try {
            console.log('🔄 Fetching routes from backend...');
            const data = await TransportService.Route.getAllRoutes();
            console.log('✅ Routes fetched:', data);
            setRoutes(data);
        } catch (error) {
            console.error('❌ Error fetching routes:', error);
            console.error('Error details:', error.message);
            // Don't alert for routes, just log - vehicles can work without routes
        }
    };

    // Load vehicles and routes on mount
    useEffect(() => {
        fetchVehicles();
        fetchRoutes();
    }, []);

    // --- Handlers ---
    const handleOpenModal = (vehicle = null) => {
        if (vehicle) {
            setEditingVehicle(vehicle);
            setFormData({
                ...vehicle,
                route: vehicle.route ? vehicle.route.routeCode : null  // Extract routeCode
            });
        } else {
            setEditingVehicle(null);
            setFormData({
                vehicleNumber: '',
                vehicletype: 'BUS',
                capacity: '',
                occupiedSeats: '',
                gpsEnabled: false,
                route: null,
                vehicleStatus: 'ACTIVE'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVehicle(null);
    };

    const handleDelete = async (vehicleNumber) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await TransportService.Vehicle.deleteVehicle(vehicleNumber);
                setVehicles(vehicles.filter(v => v.vehicleNumber !== vehicleNumber));
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                alert('Failed to delete vehicle: ' + error.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Maintenance vehicles cannot have active routes
        if (formData.vehicleStatus === 'MAINTENANCE' && formData.route) {
            alert('Maintenance vehicles cannot be assigned to a route.');
            return;
        }

        try {
            setLoading(true);

            // Prepare payload - convert route id to routeCode object format expected by backend
            const payload = {
                ...formData,
                route: formData.route ? { routeCode: parseInt(formData.route) } : null
            };

            if (editingVehicle) {
                // Update existing vehicle
                const updatedVehicle = await TransportService.Vehicle.updateVehicle(
                    editingVehicle.vehicleNumber,
                    payload
                );
                setVehicles(vehicles.map(v =>
                    v.vehicleNumber === editingVehicle.vehicleNumber ? updatedVehicle : v
                ));
                handleCloseModal();
            } else {
                // Create new vehicle
                const newVehicle = await TransportService.Vehicle.addVehicle(payload);
                setVehicles([...vehicles, newVehicle]);
                handleCloseModal();
                // Refresh list to ensure relationships are loaded
                fetchVehicles();
            }
        } catch (error) {
            console.error('Error saving vehicle:', error);
            alert('Failed to save vehicle: ' + error.message);
        } finally {
            setLoading(false);
        }
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
        (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.vehicletype && v.vehicletype.toLowerCase().includes(searchTerm.toLowerCase()))
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
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={fetchVehicles}
                        disabled={loading}
                        style={{
                            background: loading ? '#94a3b8' : '#10b981',
                            color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: '600',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        <FiTool /> {loading ? 'Loading...' : 'Refresh'}
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
                        <FiPlus /> Add Vehicle
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && vehicles.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <div>Loading vehicles...</div>
                </div>
            )}
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
                                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{vehicle.vehicleNumber}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{vehicle.vehicletype}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: '#334155' }}>
                                            {vehicle.occupiedSeats || 0} / {vehicle.capacity} Seats
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            {vehicle.gpsEnabled ? (
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
                                                    {vehicle.route.routeName} {vehicle.route.routeCode ? `(R-${vehicle.route.routeCode})` : ''}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>Unassigned</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                background: `${getStatusColor(vehicle.vehicleStatus)}15`,
                                                color: getStatusColor(vehicle.vehicleStatus),
                                                padding: '4px 12px', borderRadius: '20px',
                                                fontSize: '12px', fontWeight: '600',
                                                display: 'inline-flex', alignItems: 'center', gap: 6
                                            }}>
                                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                                                {vehicle.vehicleStatus}
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
                                                    onClick={() => handleDelete(vehicle.vehicleNumber)}
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
                                position: 'fixed', top: '55%', left: '50%',
                                width: '100%', maxWidth: '500px', background: 'white', borderRadius: '16px',
                                padding: '24px', zIndex: 51, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ margin: 0, fontSize: '20px' }}>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <FormInput label="Vehicle Number" value={formData.vehicleNumber} onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value })} required placeholder="e.g. KA-01-AB-1234" />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Type</label>
                                        <select
                                            className="form-select" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                            value={formData.vehicletype}
                                            onChange={e => setFormData({ ...formData, vehicletype: e.target.value })}
                                        >
                                            <option value="BUS">Bus</option>
                                            <option value="VAN">Van</option>
                                            <option value="CAB">Cab</option>
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
                                            value={formData.vehicleStatus}
                                            onChange={e => setFormData({ ...formData, vehicleStatus: e.target.value })}
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="MAINTENANCE">Maintenance</option>
                                            <option value="INACTIVE">Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Route Assignment</label>
                                        <select
                                            className="form-select"
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                            value={formData.route || ''}
                                            onChange={e => setFormData({ ...formData, route: e.target.value ? parseInt(e.target.value) : null })}
                                        >
                                            <option value="">No Route (Unassigned)</option>
                                            {routes.map(route => (
                                                <option key={route.id} value={route.routeCode}>
                                                    {route.routeCode ? `R-${route.routeCode}` : ''} {route.routeName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <input
                                        type="checkbox"
                                        id="gps-toggle"
                                        checked={formData.gpsEnabled}
                                        onChange={e => setFormData({ ...formData, gpsEnabled: e.target.checked })}
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
