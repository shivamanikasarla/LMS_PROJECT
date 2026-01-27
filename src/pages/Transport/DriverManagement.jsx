import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUser, FiPlus, FiSearch, FiEdit2, FiTrash2,
    FiPhone, FiCheckCircle, FiXCircle, FiTruck, FiMapPin, FiX
} from 'react-icons/fi';
import TransportService from '../../services/transportService';

const DriverManagement = () => {
    // --- State ---
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [routes, setRoutes] = useState([]); // For assignment
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [loading, setLoading] = useState(false);

    // Initial Form State matching Backend Entity
    const initialFormState = {
        fullName: '',
        contactNumber: '',
        licenseNumber: '',
        licenseExpiryDate: '',
        role: 'DRIVER',
        experienceCategory: 'SCHOOLBUS',
        backgroundVerified: false,
        shift: 'MORNING',
        experienceYears: '',
        licenseValidityStatus: 'VALID',
        verificationStatus: 'PENDING',
        active: true,
        vehicle: null, // { vehicleId: ... } or null
        route: null    // { routeId: ... } or null
    };

    const [formData, setFormData] = useState(initialFormState);

    // --- Fetch Data ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const [driversData, vehiclesData, routesData] = await Promise.all([
                TransportService.Driver.getAllDrivers(),
                TransportService.Vehicle.getAllVehicles(),
                TransportService.Route.getAllRoutes()
            ]);
            setDrivers(driversData || []);
            setVehicles(vehiclesData || []);
            setRoutes(routesData || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            // alert('Error fetching data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Handlers ---
    const handleOpenModal = (driver = null) => {
        if (driver) {
            setEditingDriver(driver);
            setFormData({
                ...driver,
                vehicle: driver.vehicle ? driver.vehicle.id : '', // Use 'id' matching backend/other components
                route: driver.route ? driver.route.id : ''        // Use 'id' matching backend/other components
            });
        } else {
            setEditingDriver(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDriver(null);
    };

    const handleDelete = async (driverId) => {
        if (window.confirm('Are you sure you want to delete this driver?')) {
            try {
                await TransportService.Driver.deleteDriver(driverId);
                setDrivers(drivers.filter(d => d.driverId !== driverId));
            } catch (error) {
                console.error('Error deleting driver:', error);
                alert('Failed to delete driver');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare payload
            const payload = {
                ...formData,
                // Use 'id' for relationships as observed in other components
                vehicle: formData.vehicle ? { id: formData.vehicle } : null,
                route: formData.route ? { id: formData.route } : null,
                experienceYears: parseInt(formData.experienceYears) || 0
            };

            if (editingDriver) {
                const updated = await TransportService.Driver.updateDriver(editingDriver.driverId, payload);
                setDrivers(drivers.map(d => d.driverId === editingDriver.driverId ? updated : d));
            } else {
                const created = await TransportService.Driver.addDriver(payload);
                setDrivers([...drivers, created]);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving driver:', error);
            alert('Failed to save driver: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Helpers ---
    const getLicenseStatusColor = (status) => {
        switch (status) {
            case 'VALID': return '#10b981';
            case 'EXPIRINGSOON': return '#f59e0b';
            case 'EXPIRED': return '#ef4444';
            default: return '#64748b';
        }
    };

    const filteredDrivers = drivers.filter(d =>
        (d.fullName && d.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.licenseNumber && d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header / Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, flex: 1, maxWidth: '400px' }}>
                    <FiSearch color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search by name or license..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={fetchData} className="btn-secondary" style={{ padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: '#e2e8f0' }}>
                        <FiRefreshCw />
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary"
                        style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: '600'
                        }}
                    >
                        <FiPlus /> Add Driver
                    </button>
                </div>
            </div>

            {/* Drivers List */}
            <div className="table-container glass-card" style={{ overflowX: 'auto' }}>
                <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '16px' }}>Driver Info</th>
                            <th style={{ padding: '16px' }}>License Details</th>
                            <th style={{ padding: '16px' }}>Assignment & Shift</th>
                            <th style={{ padding: '16px' }}>Status</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredDrivers.length > 0 ? (
                                filteredDrivers.map(driver => (
                                    <motion.tr
                                        key={driver.driverId}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        style={{ borderBottom: '1px solid #f1f5f9' }}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: 'bold' }}>
                                                    {driver.fullName ? driver.fullName.charAt(0) : '?'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{driver.fullName}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <FiPhone size={10} /> {driver.contactNumber}
                                                    </div>
                                                    <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#64748b' }}>
                                                        {driver.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: '500', color: '#334155' }}>{driver.licenseNumber}</div>
                                            <div style={{ fontSize: '12px', color: getLicenseStatusColor(driver.licenseValidityStatus), fontWeight: '500' }}>
                                                {driver.licenseValidityStatus}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Exp: {driver.licenseExpiryDate}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <FiTruck size={12} color="#64748b" />
                                                {driver.vehicle ? (
                                                    <span style={{ fontWeight: '500' }}>{driver.vehicle.vehicleNumber}</span>
                                                ) : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No Vehicle</span>}
                                            </div>
                                            <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                                <FiMapPin size={12} color="#64748b" />
                                                {driver.route ? (
                                                    <span>{driver.route.routeName}</span>
                                                ) : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No Route</span>}
                                            </div>
                                            <div style={{ fontSize: '11px', marginTop: 4, color: '#6366f1', fontWeight: '500' }}>
                                                Shift: {driver.shift}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                <span style={{
                                                    fontSize: '11px', fontWeight: '600',
                                                    color: driver.verificationStatus === 'VERIFIED' ? '#10b981' : '#f59e0b',
                                                    background: driver.verificationStatus === 'VERIFIED' ? '#ecfdf5' : '#fffbeb',
                                                    padding: '2px 8px', borderRadius: 10, alignSelf: 'flex-start'
                                                }}>
                                                    {driver.verificationStatus}
                                                </span>
                                                {driver.backgroundVerified && (
                                                    <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <FiCheckCircle size={10} /> BG Verified
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                <button onClick={() => handleOpenModal(driver)} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: 6, cursor: 'pointer', color: '#475569' }}>
                                                    <FiEdit2 />
                                                </button>
                                                <button onClick={() => handleDelete(driver.driverId)} style={{ border: 'none', background: '#fef2f2', padding: 8, borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}>
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No drivers found.</td>
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
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
                            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                width: '100%', maxWidth: '700px', background: 'white', borderRadius: '16px',
                                padding: '24px', zIndex: 51, maxHeight: '90vh', overflowY: 'auto'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0 }}>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
                                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <FormInput label="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} required />
                                <FormInput label="Contact Number" value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} required />

                                <FormInput label="License Number" value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })} required />
                                <FormInput label="Expiry Date" type="date" value={formData.licenseExpiryDate} onChange={e => setFormData({ ...formData, licenseExpiryDate: e.target.value })} required />

                                <FormSelect label="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="DRIVER">Driver</option>
                                    <option value="CONDUCTOR">Conductor</option>
                                    <option value="HELPER">Helper</option>
                                </FormSelect>

                                <FormSelect label="Shift" value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value })}>
                                    <option value="MORNING">Morning</option>
                                    <option value="EVENING">Evening</option>
                                    <option value="BOTH">Both</option>
                                </FormSelect>

                                <FormInput label="Experience (Years)" type="number" value={formData.experienceYears} onChange={e => setFormData({ ...formData, experienceYears: e.target.value })} required />

                                <FormSelect label="Exp. Category" value={formData.experienceCategory} onChange={e => setFormData({ ...formData, experienceCategory: e.target.value })}>
                                    <option value="SCHOOLBUS">School Bus</option>
                                    <option value="HEAVYVEHICLE">Heavy Vehicle</option>
                                    <option value="LIGHTVEHICLE">Light Vehicle</option>
                                    <option value="BOTHSCHOOLBUSANDHEAVYVEHICLE">Both (School & Heavy)</option>
                                </FormSelect>

                                <FormSelect label="License Status" value={formData.licenseValidityStatus} onChange={e => setFormData({ ...formData, licenseValidityStatus: e.target.value })}>
                                    <option value="VALID">Valid</option>
                                    <option value="EXPIRINGSOON">Expiring Soon</option>
                                    <option value="EXPIRED">Expired</option>
                                </FormSelect>

                                <FormSelect label="Verification Status" value={formData.verificationStatus} onChange={e => setFormData({ ...formData, verificationStatus: e.target.value })}>
                                    <option value="PENDING">Pending</option>
                                    <option value="VERIFIED">Verified</option>
                                    <option value="SUSPENDED">Suspended</option>
                                    <option value="REJECTED">Rejected</option>
                                </FormSelect>

                                {/* Assignments */}
                                <FormSelect label="Assign Vehicle (Optional)" value={formData.vehicle || ''} onChange={e => setFormData({ ...formData, vehicle: e.target.value || null })}>
                                    <option value="">-- No Vehicle --</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.vehicleNumber} ({v.vehicletype})</option>
                                    ))}
                                </FormSelect>

                                <FormSelect label="Assign Route (Optional)" value={formData.route || ''} onChange={e => setFormData({ ...formData, route: e.target.value || null })}>
                                    <option value="">-- No Route --</option>
                                    {routes.map(r => (
                                        <option key={r.id} value={r.id}>{r.routeName} ({r.routeCode})</option>
                                    ))}
                                </FormSelect>

                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: 20, alignItems: 'center', background: '#f8fafc', padding: 12, borderRadius: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input type="checkbox" checked={formData.backgroundVerified} onChange={e => setFormData({ ...formData, backgroundVerified: e.target.checked })} style={{ width: 16, height: 16 }} />
                                        <label style={{ fontSize: 13, fontWeight: 500 }}>Background Verified</label>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input type="checkbox" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })} style={{ width: 16, height: 16 }} />
                                        <label style={{ fontSize: 13, fontWeight: 500 }}>Active Driver</label>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="btn-primary" style={{ gridColumn: 'span 2', marginTop: 10, padding: 12, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                                    {loading ? 'Saving...' : (editingDriver ? 'Update Driver' : 'Create Driver')}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const FormInput = ({ label, type = "text", value, onChange, placeholder, required }) => (
    <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>{label} {required && '*'}</label>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
    </div>
);

const FormSelect = ({ label, value, onChange, children }) => (
    <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>{label}</label>
        <select value={value} onChange={onChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {children}
        </select>
    </div>
);

const FiRefreshCw = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;

export default DriverManagement;
