import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiTool, FiPlus, FiSearch, FiEdit2, FiTrash2,
    FiCalendar, FiAlertCircle, FiCheckCircle, FiX
} from 'react-icons/fi';
import TransportService from '../../services/transportService';

const VehicleMaintenance = () => {
    // --- State ---
    const [records, setRecords] = useState([]);

    const [vehicles, setVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({
        vehicleId: '', type: 'Service', date: '', cost: '', description: '', status: 'Pending', nextDue: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [recordsData, vehiclesData] = await Promise.all([
                TransportService.Maintenance.getAllMaintenance().catch(() => []),
                TransportService.Vehicle.getAllVehicles()
            ]);
            setRecords(recordsData || []);
            setVehicles(vehiclesData || []);
        } catch (error) {
            console.error("Failed to load maintenance data", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers ---
    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            // Ensure we map back to the ID for the dropdown
            const v = vehicles.find(v => v.vehicleNumber === record.vehicleId);
            // Note: If backend sends ID in vehicleId field, this is easy. If it sends Number, we might need to find ID.
            // Based on Fuel Log, we are sending ID. Let's assume we send/receive ID or consistent string.
            // For now, let's trust the record.vehicleId matches the Select value logic.

            setFormData({
                ...record,
                // Status mapping if needed (backend: InProgress -> frontend display: "In Progress"?) 
                // We will use raw enums for simplicity to ensure match.
            });
        } else {
            setEditingRecord(null);
            setFormData({ vehicleId: '', type: 'Service', date: '', cost: '', description: '', status: 'Pending', nextDue: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        setLoading(true);
        try {
            await TransportService.Maintenance.deleteMaintenance(id);
            setRecords(records.filter(r => r.id !== id));
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Failed to delete record");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingRecord) {
                const updated = await TransportService.Maintenance.updateMaintenance(editingRecord.id, formData);
                setRecords(records.map(r => r.id === editingRecord.id ? updated : r));
            } else {
                const newRecord = await TransportService.Maintenance.addMaintenance(formData);
                setRecords([...records, newRecord]);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save record");
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = records.filter(r =>
        (r.vehicleId && r.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.type && r.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getTotalCost = () => filteredRecords.reduce((acc, curr) => acc + (parseInt(curr.cost) || 0), 0);

    // Helper to display vehicle number if ID is stored
    const getVehicleDisplay = (idStr) => {
        const v = vehicles.find(veh => veh.id.toString() === idStr.toString() || veh.vehicleNumber === idStr);
        return v ? v.vehicleNumber : idStr;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, width: '300px' }}>
                        <FiSearch color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search by Vehicle or Type..."
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>
                        Total Expense: <span style={{ color: '#1e293b' }}>₹{getTotalCost().toLocaleString()}</span>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary"
                    style={{
                        background: '#4f46e5', color: 'white', padding: '10px 20px', borderRadius: '8px',
                        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: '600'
                    }}
                >
                    <FiPlus /> Log Maintenance
                </button>
            </div>

            {/* List */}
            <div className="glass-card table-container">
                <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '16px' }}>Vehicle</th>
                            <th style={{ padding: '16px' }}>Type & Date</th>
                            <th style={{ padding: '16px' }}>Description</th>
                            <th style={{ padding: '16px' }}>Cost</th>
                            <th style={{ padding: '16px' }}>Status</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredRecords.map(record => (
                                <motion.tr
                                    key={record.id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ borderBottom: '1px solid #f1f5f9' }}
                                >
                                    <td style={{ padding: '16px', fontWeight: '600', color: '#1e293b' }}>
                                        {getVehicleDisplay(record.vehicleId)}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '500', color: '#334155' }}>{record.type}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <FiCalendar size={10} /> {record.date}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', color: '#475569', maxWidth: '300px' }}>
                                        {record.description}
                                        {record.nextDue && <div style={{ fontSize: '11px', color: '#6366f1', marginTop: '4px' }}>Next Due: {record.nextDue}</div>}
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: '600', color: '#334155' }}>
                                        ₹{parseInt(record.cost || 0).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                            background: record.status === 'Completed' ? '#ecfdf5' : '#fff7ed',
                                            color: record.status === 'Completed' ? '#10b981' : '#f59e0b',
                                            display: 'inline-flex', alignItems: 'center', gap: 6
                                        }}>
                                            {record.status === 'Completed' ? <FiCheckCircle size={12} /> : <FiAlertCircle size={12} />}
                                            {record.status === 'InProgress' ? 'In Progress' : record.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                            <button onClick={() => handleOpenModal(record)} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: 6, cursor: 'pointer', color: '#475569' }}><FiEdit2 /></button>
                                            <button onClick={() => handleDelete(record.id)} style={{ border: 'none', background: '#fef2f2', padding: 8, borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }} />
                        <motion.div
                            initial={{ opacity: 0, x: '-50%', y: '-20px' }}
                            animate={{ opacity: 1, x: '-50%', y: '0px' }}
                            exit={{ opacity: 0, x: '-50%', y: '-20px' }}
                            className="hide-scrollbar"
                            style={{
                                position: 'fixed', top: '100px', left: '50%',
                                width: '100%', maxWidth: '500px',
                                maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
                                background: 'white', borderRadius: '16px', padding: '24px',
                                zIndex: 60, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', marginBottom: '20px',
                                position: 'sticky', top: '-24px', background: 'white', zIndex: 10,
                                paddingTop: '0', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9'
                            }}>
                                <h3 style={{ margin: 0 }}>{editingRecord ? 'Edit Maintenance' : 'Log Maintenance'}</h3>
                                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><FiX size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Vehicle</label>
                                    <select className="form-select" value={formData.vehicleId} onChange={e => setFormData({ ...formData, vehicleId: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <option value="">-- Select Vehicle --</option>
                                        {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleNumber} ({v.vehicletype})</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Type</label>
                                        <select className="form-select" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                            <option value="Service">Service</option>
                                            <option value="Repair">Repair</option>
                                            <option value="Inspection">Inspection</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Status</label>
                                        <select className="form-select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                            <option value="Pending">Pending</option>
                                            <option value="InProgress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Date</label>
                                        <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Cost (₹)</label>
                                        <input type="number" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} required placeholder="0" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Next Due Date (Optional)</label>
                                    <input type="date" value={formData.nextDue} onChange={e => setFormData({ ...formData, nextDue: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                </div>
                                <button type="submit" className="btn-primary" style={{ padding: '12px', borderRadius: '8px', background: '#4f46e5', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                                    {editingRecord ? 'Update Record' : 'Save Record'}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VehicleMaintenance;
