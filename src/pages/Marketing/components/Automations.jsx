import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiPower, FiMail, FiMessageSquare, FiSmartphone } from 'react-icons/fi';
import FilterBar from './FilterBar';

const Automations = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [filters, setFilters] = useState({});

    const [templates, setTemplates] = useState([
        { id: 1, name: 'Welcome Email', channel: 'Email', trigger: 'Signup', status: 'Active' },
        { id: 2, name: 'Abandoned Cart SMS', channel: 'SMS', trigger: 'Abandoned', status: 'Active' },
        { id: 3, name: 'Course Completion WhatsApp', channel: 'WhatsApp', trigger: 'Completion', status: 'Disabled' },
    ]);

    const getChannelIcon = (channel) => {
        switch (channel) {
            case 'Email': return <FiMail className="text-primary" />;
            case 'SMS': return <FiSmartphone className="text-info" />;
            case 'WhatsApp': return <FiMessageSquare className="text-success" />;
            default: return <FiMail />;
        }
    };

    return (
        <>
            <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                statusOptions={['Active', 'Paused', 'Draft']}
            />
            <div className="table-responsive bg-white rounded shadow-sm border">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Communication Templates</h5>
                    <button className="btn btn-primary btn-sm" onClick={() => { setEditingTemplate(null); setShowModal(true); }}>
                        <FiPlus /> New Template
                    </button>
                </div>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Template Name</th>
                            <th>Channel</th>
                            <th>Trigger Event</th>
                            <th>Status</th>
                            <th className="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {templates.map(t => (
                            <tr key={t.id}>
                                <td className="ps-4 fw-bold text-dark">{t.name}</td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        {getChannelIcon(t.channel)}
                                        <span>{t.channel}</span>
                                    </div>
                                </td>
                                <td><span className="badge bg-light text-dark border">{t.trigger}</span></td>
                                <td>
                                    <span className={`badge ${t.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="text-end pe-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            className={`btn btn-sm ${t.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                            title={t.status === 'Active' ? 'Disable' : 'Enable'}
                                            onClick={() => {
                                                const newStatus = t.status === 'Active' ? 'Disabled' : 'Active';
                                                setTemplates(templates.map(temp => temp.id === t.id ? { ...temp, status: newStatus } : temp));
                                            }}
                                        >
                                            <FiPower />
                                        </button>
                                        <button className="btn btn-sm btn-outline-secondary" title="Edit" onClick={() => { setEditingTemplate(t); setShowModal(true); }}>
                                            <FiEdit />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            title="Delete"
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this template?')) {
                                                    setTemplates(templates.filter(temp => temp.id !== t.id));
                                                }
                                            }}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CREATE/EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 500 }}>
                        <h4 className="mb-4" style={{ marginTop: 0 }}>{editingTemplate ? 'Edit Template' : 'New Template'}</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const templateData = {
                                id: editingTemplate ? editingTemplate.id : templates.length + 1,
                                name: formData.get('name'),
                                channel: formData.get('channel'),
                                trigger: formData.get('trigger'),
                                status: editingTemplate ? editingTemplate.status : 'Active'
                            };

                            if (editingTemplate) {
                                setTemplates(templates.map(t => t.id === editingTemplate.id ? templateData : t));
                            } else {
                                setTemplates([...templates, templateData]);
                            }
                            setShowModal(false);
                        }}>
                            <div className="mb-3">
                                <label className="form-label">Template Name</label>
                                <input type="text" name="name" className="form-control" defaultValue={editingTemplate?.name} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Channel</label>
                                <select name="channel" className="form-select" defaultValue={editingTemplate?.channel || 'Email'}>
                                    <option value="Email">Email</option>
                                    <option value="SMS">SMS</option>
                                    <option value="WhatsApp">WhatsApp</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Trigger Event</label>
                                <select name="trigger" className="form-select" defaultValue={editingTemplate?.trigger || 'Signup'}>
                                    <option value="Signup">User Signup</option>
                                    <option value="Abandoned">Abandoned Cart</option>
                                    <option value="Purchase">Course Purchase</option>
                                    <option value="Completion">Course Completion</option>
                                    <option value="Inactivity">User Inactivity (7 days)</option>
                                </select>
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Template</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Automations;
