import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiShield, FiCheck, FiX } from 'react-icons/fi';

const RolePermissions = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const [roles, setRoles] = useState([
        {
            id: 1,
            name: 'Marketing Manager',
            modules: ['Overview', 'Campaigns', 'Coupons', 'Leads', 'Analytics', 'Automation', 'Settings'],
            permissions: { read: true, write: true, export: true }
        },
        {
            id: 2,
            name: 'Content Creator',
            modules: ['Campaigns', 'Automation'],
            permissions: { read: true, write: true, export: false }
        },
        {
            id: 3,
            name: 'Analyst',
            modules: ['Overview', 'Analytics'],
            permissions: { read: true, write: false, export: true }
        },
        {
            id: 4,
            name: 'Intern',
            modules: ['Leads'],
            permissions: { read: true, write: false, export: false }
        }
    ]);

    const allModules = ['Overview', 'Campaigns', 'Coupons', 'Leads', 'Analytics', 'Automation', 'Settings'];

    return (
        <>
            <div className="table-responsive bg-white rounded shadow-sm border">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <FiShield />
                        <h5 className="mb-0">Roles & Permissions</h5>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => { setEditingRole(null); setShowModal(true); }}>
                        <FiPlus /> New Role
                    </button>
                </div>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Role Name</th>
                            <th>Accessible Modules</th>
                            <th>Permissions</th>
                            <th className="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(role => (
                            <tr key={role.id}>
                                <td className="ps-4 fw-bold text-dark">{role.name}</td>
                                <td>
                                    <div className="d-flex flex-wrap gap-1">
                                        {role.modules.map(mod => (
                                            <span key={mod} className="badge bg-light text-secondary border">{mod}</span>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <span className={`badge ${role.permissions.read ? 'bg-success' : 'bg-secondary'} bg-opacity-10 text-dark border d-flex align-items-center gap-1`}>
                                            {role.permissions.read ? <FiCheck className="text-success" /> : <FiX className="text-muted" />} Read
                                        </span>
                                        <span className={`badge ${role.permissions.write ? 'bg-success' : 'bg-secondary'} bg-opacity-10 text-dark border d-flex align-items-center gap-1`}>
                                            {role.permissions.write ? <FiCheck className="text-success" /> : <FiX className="text-muted" />} Write
                                        </span>
                                        <span className={`badge ${role.permissions.export ? 'bg-success' : 'bg-secondary'} bg-opacity-10 text-dark border d-flex align-items-center gap-1`}>
                                            {role.permissions.export ? <FiCheck className="text-success" /> : <FiX className="text-muted" />} Export
                                        </span>
                                    </div>
                                </td>
                                <td className="text-end pe-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button className="btn btn-sm btn-outline-secondary" title="Edit" onClick={() => { setEditingRole(role); setShowModal(true); }}>
                                            <FiEdit />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            title="Delete"
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this role?')) {
                                                    setRoles(roles.filter(r => r.id !== role.id));
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
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 600 }}>
                        <h4 className="mb-4" style={{ marginTop: 0 }}>{editingRole ? 'Edit Role' : 'New Role'}</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const selectedModules = allModules.filter(m => formData.get(`module_${m}`) === 'on');

                            const roleData = {
                                id: editingRole ? editingRole.id : roles.length + 1,
                                name: formData.get('name'),
                                modules: selectedModules,
                                permissions: {
                                    read: formData.get('perm_read') === 'on',
                                    write: formData.get('perm_write') === 'on',
                                    export: formData.get('perm_export') === 'on'
                                }
                            };

                            if (editingRole) {
                                setRoles(roles.map(r => r.id === editingRole.id ? roleData : r));
                            } else {
                                setRoles([...roles, roleData]);
                            }
                            setShowModal(false);
                        }}>
                            <div className="mb-3">
                                <label className="form-label">Role Name</label>
                                <input type="text" name="name" className="form-control" defaultValue={editingRole?.name} placeholder="e.g. Marketing Manager" required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label mb-2">Capabilities</label>
                                <div className="d-flex gap-3">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="perm_read" id="permRead" defaultChecked={editingRole?.permissions.read || true} />
                                        <label className="form-check-label" htmlFor="permRead">Read</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="perm_write" id="permWrite" defaultChecked={editingRole?.permissions.write} />
                                        <label className="form-check-label" htmlFor="permWrite">Write</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="perm_export" id="permExport" defaultChecked={editingRole?.permissions.export} />
                                        <label className="form-check-label" htmlFor="permExport">Export</label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label mb-2">Accessible Modules</label>
                                <div className="row g-2">
                                    {allModules.map(mod => (
                                        <div key={mod} className="col-md-4">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name={`module_${mod}`}
                                                    id={`mod_${mod}`}
                                                    defaultChecked={editingRole?.modules.includes(mod)}
                                                />
                                                <label className="form-check-label" htmlFor={`mod_${mod}`}>{mod}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Role</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default RolePermissions;
