import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiDroplet, FiPlus, FiSearch, FiEdit2, FiTrash2,
    FiCalendar, FiTruck, FiTrendingUp, FiX, FiActivity
} from 'react-icons/fi';
import TransportService from '../../services/transportService';

const FuelTracking = () => {
    // --- State ---
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState(null);
    const [formData, setFormData] = useState({
        vehicleId: '', date: '', quantity: '', cost: '', odo: '', station: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [logsData, vehiclesData] = await Promise.all([
                TransportService.Fuel.getFuelLogs().catch(() => []), // Fail gracefully if endpoint missing
                TransportService.Vehicle.getAllVehicles()
            ]);
            setLogs(logsData || []);
            setVehicles(vehiclesData || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers ---
    const handleOpenModal = (log = null) => {
        if (log) {
            setEditingLog(log);
            setFormData(log);
        } else {
            setEditingLog(null);
            setFormData({ vehicleId: '', date: '', quantity: '', cost: '', odo: '', station: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLog(null);
    };

    const handleDelete = async (id) => {
        // Warning: Backend delete not implemented in Service yet? Checked service file, only get/add.
        // If backend support missing, alert user.
        alert('Delete functionality not currently supported via API.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingLog) {
                // Update not supported in service yet? Checked service, only get/add.
                alert('Update functionality not currently supported via API.');
            } else {
                const newLog = await TransportService.Fuel.addFuelLog(formData);
                setLogs([...logs, newLog]);
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error saving log:', error);
            alert('Failed to save log');
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(l =>
        l.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.station.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const totalCost = filteredLogs.reduce((acc, curr) => acc + (parseInt(curr.cost) || 0), 0);
    const totalFuel = filteredLogs.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 0), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}><FiDroplet /></div>
                    <div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>Total Fuel Consumed</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>{totalFuel} L</div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#fff7ed', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}><FiActivity /></div>
                    <div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>Total Fuel Cost</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>₹{totalCost.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, width: '300px' }}>
                    <FiSearch color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search by Vehicle or Station..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary"
                    style={{
                        background: '#10b981', color: 'white', padding: '10px 20px', borderRadius: '8px',
                        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: '600'
                    }}
                >
                    <FiPlus /> Add Fuel Log
                </button>
            </div>

            {/* List */}
            <div className="glass-card table-container">
                <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '16px' }}>Vehicle</th>
                            <th style={{ padding: '16px' }}>Date</th>
                            <th style={{ padding: '16px' }}>Reading (Odo)</th>
                            <th style={{ padding: '16px' }}>Quantity & Cost</th>
                            <th style={{ padding: '16px' }}>Station</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredLogs.map(log => (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ borderBottom: '1px solid #f1f5f9' }}
                                >
                                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#1e293b' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <FiTruck color="#64748b" />
                                            {(() => {
                                                const v = vehicles.find(veh => veh.id.toString() === log.vehicleId.toString() || veh.vehicleNumber === log.vehicleId);
                                                return v ? v.vehicleNumber : log.vehicleId;
                                            })()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', color: '#334155' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiCalendar size={12} /> {log.date}</div>
                                    </td>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', color: '#475569' }}>
                                        {parseInt(log.odo).toLocaleString()} km
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>₹{parseInt(log.cost).toLocaleString()}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{log.quantity} Liters</div>
                                    </td>
                                    <td style={{ padding: '16px', color: '#334155' }}>{log.station}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                            <button onClick={() => handleOpenModal(log)} style={{ border: 'none', background: '#f1f5f9', padding: 8, borderRadius: 6, cursor: 'pointer', color: '#475569' }}><FiEdit2 /></button>
                                            <button onClick={() => handleDelete(log.id)} style={{ border: 'none', background: '#fef2f2', padding: 8, borderRadius: 6, cursor: 'pointer', color: '#ef4444' }}><FiTrash2 /></button>
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
                                <h3 style={{ margin: 0 }}>Fuel Entry</h3>
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
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Date</label>
                                        <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Odometer</label>
                                        <input type="number" value={formData.odo} onChange={e => setFormData({ ...formData, odo: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. 15000" />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Quantity (Litres)</label>
                                        <input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Total Cost (₹)</label>
                                        <input type="number" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>Station Name</label>
                                    <input type="text" value={formData.station} onChange={e => setFormData({ ...formData, station: e.target.value })} placeholder="e.g. Indian Oil, MG Road" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                </div>
                                <button type="submit" className="btn-primary" style={{ padding: '12px', borderRadius: '8px', background: '#10b981', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                                    Save Log
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FuelTracking;
