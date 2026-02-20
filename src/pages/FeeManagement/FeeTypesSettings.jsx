import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiList, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getAllFeeTypes, createFeeType, updateFeeType, deleteFeeType } from '../../services/feeService';

const FeeTypesSettings = () => {
    const [feeTypes, setFeeTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [newFeeType, setNewFeeType] = useState({ name: '', description: '' });
    const [editData, setEditData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchFeeTypes();
    }, []);

    const fetchFeeTypes = async () => {
        setLoading(true);
        try {
            const data = await getAllFeeTypes();
            setFeeTypes(data || []);
        } catch (error) {
            console.error("Error fetching fee types:", error);
            // alert("Failed to fetch fee types");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newFeeType.name.trim()) return;
        try {
            await createFeeType(newFeeType);
            setNewFeeType({ name: '', description: '' });
            fetchFeeTypes();
        } catch (error) {
            console.error("Error creating fee type:", error);
            alert("Failed to create fee type. Name must be unique.");
        }
    };

    const handleUpdate = async (id) => {
        if (!editData.name.trim()) return;
        try {
            await updateFeeType(id, editData);
            setEditingId(null);
            fetchFeeTypes();
        } catch (error) {
            console.error("Error updating fee type:", error);
            alert("Failed to update fee type.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this fee type? It will be deactivated.")) return;
        try {
            await deleteFeeType(id);
            fetchFeeTypes();
        } catch (error) {
            console.error("Error deleting fee type:", error);
            alert("Failed to delete fee type.");
        }
    };

    const startEdit = (type) => {
        setEditingId(type.id);
        setEditData({ name: type.name, description: type.description });
    };

    return (
        <div className="fee-types-container">
            <div className="section-title"><FiList /> Fee Types Management</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
                Define global fee categories (e.g., Tuition Fee, Exam Fee) to be used when creating standard fee structures.
            </p>

            <div className="glass-card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label className="form-label">Fee Type Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Lab Fee"
                            value={newFeeType.name}
                            onChange={(e) => setNewFeeType({ ...newFeeType, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                        <label className="form-label">Description</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Optional description..."
                            value={newFeeType.description}
                            onChange={(e) => setNewFeeType({ ...newFeeType, description: e.target.value })}
                        />
                    </div>
                    <button className="btn-primary" onClick={handleCreate} disabled={!newFeeType.name.trim()}>
                        <FiPlus /> Add Type
                    </button>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>Name</th>
                            <th style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>Description</th>
                            <th style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>Status</th>
                            <th style={{ padding: '12px 16px', fontSize: 13, color: '#64748b', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: 24, textAlign: 'center' }}>Loading...</td></tr>
                        ) : feeTypes.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>No fee types found. Add one above.</td></tr>
                        ) : (
                            feeTypes.map(type => (
                                <tr key={type.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        {editingId === type.id ? (
                                            <input
                                                className="form-input"
                                                autoFocus
                                                value={editData.name}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            />
                                        ) : (
                                            <span style={{ fontWeight: 500 }}>{type.name}</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {editingId === type.id ? (
                                            <input
                                                className="form-input"
                                                value={editData.description}
                                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                            />
                                        ) : (
                                            <span style={{ color: '#64748b', fontSize: 13 }}>{type.description || '-'}</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {type.isActive ? (
                                            <span className="status-badge paid" style={{ fontSize: 11 }}>Active</span>
                                        ) : (
                                            <span className="status-badge overdue" style={{ fontSize: 11 }}>Inactive</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                            {editingId === type.id ? (
                                                <>
                                                    <button onClick={() => handleUpdate(type.id)} className="btn-icon" style={{ color: '#16a34a', background: '#dcfce7' }}>
                                                        <FiCheck />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="btn-icon" style={{ color: '#64748b', background: '#f1f5f9' }}>
                                                        <FiX />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEdit(type)} className="btn-icon" style={{ color: '#3b82f6', background: '#eff6ff' }} disabled={!type.isActive}>
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                    {type.isActive && (
                                                        <button onClick={() => handleDelete(type.id)} className="btn-icon" style={{ color: '#ef4444', background: '#fee2e2' }}>
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeeTypesSettings;
