import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUsers, FiPlus, FiSearch, FiEdit2, FiTrash2,
    FiCheckCircle, FiAlertTriangle, FiX, FiShield,
    FiCalendar, FiPhone, FiActivity // Added missing imports
} from 'react-icons/fi';

const DriverManagement = () => {
    // --- State ---
    const [drivers, setDrivers] = useState(() => {
        const saved = localStorage.getItem('lms_transport_drivers');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Ramesh Kumar', contact: '9876543210', license: 'KA2001000123', expiry: '2026-12-31', experience: '5 Years', assignedVehicle: 'KA-01-AB-1234', shift: 'Morning', verification: { police: true, medical: true } },
            { id: 2, name: 'Suresh Singh', contact: '8765432109', license: 'KA2005000456', expiry: '2025-02-15', experience: '8 Years', assignedVehicle: 'KA-05-XY-9876', shift: 'Evening', verification: { police: true, medical: false } }, // Expiring soon
            { id: 3, name: 'Mahesh Babu', contact: '7654321098', license: 'KA2010000789', expiry: '2024-01-01', experience: '3 Years', assignedVehicle: '', shift: 'Morning', verification: { police: false, medical: false } }, // Expired
        ];
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [formData, setFormData] = useState({
        name: '', contact: '', license: '', expiry: '', experience: '', assignedVehicle: '', shift: 'Morning', verification: { police: false, medical: false }
    });

    // --- Persist Data ---
    useEffect(() => {
        localStorage.setItem('lms_transport_drivers', JSON.stringify(drivers));
    }, [drivers]);

    // --- Helpers ---
    const getLicenseStatus = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { status: 'Expired', color: '#ef4444', label: 'Expired' };
        if (diffDays < 30) return { status: 'Expiring', color: '#f59e0b', label: `Expires in ${diffDays}d` };
        return { status: 'Valid', color: '#10b981', label: 'Valid' };
    };

    // --- Handlers ---
    const handleOpenModal = (driver = null) => {
        if (driver) {
            setEditingDriver(driver);
            setFormData(driver);
        } else {
            setEditingDriver(null);
            setFormData({
                name: '', contact: '', license: '', expiry: '', experience: '', assignedVehicle: '', shift: 'Morning',
                verification: { police: false, medical: false }
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDriver(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this driver?')) {
            setDrivers(drivers.filter(d => d.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Auto-block assignment if license expired
        const licenseStatus = getLicenseStatus(formData.expiry);
        if (licenseStatus.status === 'Expired' && formData.assignedVehicle) {
            alert('Cannot assign vehicle to a driver with expired license!');
            return;
        }

        if (editingDriver) {
            setDrivers(drivers.map(d => d.id === editingDriver.id ? { ...formData, id: d.id } : d));
        } else {
            setDrivers([...drivers, { ...formData, id: Date.now() }]);
        }
        handleCloseModal();
    };


    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.license.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header / Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, flex: 1, maxWidth: '400px' }}>
                    <FiSearch color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search driver by name or license..."
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
                    <FiPlus /> Add Driver
                </button>
            </div>

            {/* Drivers List */}
            <div className="table-container glass-card" style={{ overflowX: 'auto' }}>
                <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '16px' }}>Driver Details</th>
                            <th style={{ padding: '16px' }}>License Info</th>
                            <th style={{ padding: '16px' }}>Shift & Vehicle</th>
                            <th style={{ padding: '16px' }}>Verification</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredDrivers.length > 0 ? (
                                filteredDrivers.map(driver => {
                                    const licenseStatus = getLicenseStatus(driver.expiry);
                                    return (
                                        <motion.tr
                                            key={driver.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            style={{ borderBottom: '1px solid #f1f5f9' }}
                                        >
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: 'bold' }}>
                                                        {driver.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{driver.name}</div>
                                                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <FiPhone size={10} /> {driver.contact}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ fontWeight: '500', color: '#334155' }}>{driver.license}</div>
                                                <span style={{
                                                    fontSize: '11px', fontWeight: '600', color: licenseStatus.color,
                                                    display: 'flex', alignItems: 'center', gap: 4
                                                }}>
                                                    {licenseStatus.status === 'Valid' ? <FiCheckCircle size={10} /> : <FiAlertTriangle size={10} />}
                                                    {licenseStatus.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ fontSize: '13px', color: '#334155' }}>
                                                    <span style={{ fontWeight: '600' }}>Shift:</span> {driver.shift}
                                                </div>
                                                {driver.assignedVehicle ? (
                                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                                                        Vehicle: {driver.assignedVehicle}
                                                    </div>
                                                ) : (
                                                    <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Unassigned</div>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <div
                                                        title="Police Verification"
                                                        style={{
                                                            padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600',
                                                            background: driver.verification.police ? '#ecfdf5' : '#fef2f2',
                                                            color: driver.verification.police ? '#10b981' : '#ef4444',
                                                            display: 'flex', alignItems: 'center', gap: 4
                                                        }}
                                                    >
                                                        <FiShield size={12} /> Police
                                                    </div>
                                                    <div
                                                        title="Medical Check"
                                                        style={{
                                                            padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600',
                                                            background: driver.verification.medical ? '#ecfdf5' : '#fef2f2',
                                                            color: driver.verification.medical ? '#10b981' : '#ef4444',
                                                            display: 'flex', alignItems: 'center', gap: 4
                                                        }}
                                                    >
                                                        <FiActivity size={12} /> Medical
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                    <button
                                                        onClick={() => handleOpenModal(driver)}
                                                        style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: 6, cursor: 'pointer', color: '#475569' }}
                                                    >
                                                        <FiEdit2 />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(driver.id)}
                                                        style={{ border: 'none', background: '#fef2f2', padding: 8, borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                        No drivers found matching your search.
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
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                width: '100%', maxWidth: '600px', background: 'white', borderRadius: '16px',
                                padding: '24px', zIndex: 51, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ margin: 0, fontSize: '20px' }}>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
                                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <FormInput label="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Ramesh Kumar" />
                                    <FormInput label="Contact Number" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} required placeholder="e.g. 9876543210" />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <FormInput label="License Number" value={formData.license} onChange={e => setFormData({ ...formData, license: e.target.value })} required placeholder="DL-XXXXX" />
                                    <FormInput label="Expiry Date" type="date" value={formData.expiry} onChange={e => setFormData({ ...formData, expiry: e.target.value })} required />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Shift</label>
                                        <select
                                            className="form-select" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                            value={formData.shift}
                                            onChange={e => setFormData({ ...formData, shift: e.target.value })}
                                        >
                                            <option>Morning</option>
                                            <option>Evening</option>
                                            <option>Both</option>
                                        </select>
                                    </div>
                                    <FormInput label="Assigned Vehicle" value={formData.assignedVehicle} onChange={e => setFormData({ ...formData, assignedVehicle: e.target.value })} placeholder="e.g. KA-01 (Optional)" />
                                </div>

                                <div style={{ marginTop: '8px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>Verifications</label>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', flex: 1 }}>
                                            <input
                                                type="checkbox" id="police-chk"
                                                checked={formData.verification.police}
                                                onChange={e => setFormData({ ...formData, verification: { ...formData.verification, police: e.target.checked } })}
                                                style={{ width: 16, height: 16 }}
                                            />
                                            <label htmlFor="police-chk" style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}>Police Verification</label>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', flex: 1 }}>
                                            <input
                                                type="checkbox" id="medical-chk"
                                                checked={formData.verification.medical}
                                                onChange={e => setFormData({ ...formData, verification: { ...formData.verification, medical: e.target.checked } })}
                                                style={{ width: 16, height: 16 }}
                                            />
                                            <label htmlFor="medical-chk" style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}>Medical Check</label>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: '16px', padding: '12px', background: '#4f46e5', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                                    {editingDriver ? 'Update Driver' : 'Add Driver'}
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

export default DriverManagement;
