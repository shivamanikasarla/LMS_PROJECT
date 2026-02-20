import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiMove, FiCheckCircle, FiSettings } from 'react-icons/fi';

const FunnelSettings = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingStage, setEditingStage] = useState(null);

    const [stages, setStages] = useState([
        { id: 1, name: 'Visitor', order: 1, isFinal: false, isSuccess: false, autoTransitionEvent: 'Page Visit', usersCount: 15400, allowedPreviousStages: [] },
        { id: 2, name: 'Lead', order: 2, isFinal: false, isSuccess: false, autoTransitionEvent: 'Signup', usersCount: 3200, allowedPreviousStages: ['Visitor'] },
        { id: 3, name: 'Trial User', order: 3, isFinal: false, isSuccess: false, autoTransitionEvent: 'Manual', usersCount: 850, allowedPreviousStages: ['Lead'] },
        { id: 4, name: 'Enrolled', order: 4, isFinal: true, isSuccess: true, autoTransitionEvent: 'Purchase', usersCount: 420, allowedPreviousStages: ['Trial User', 'Lead'] },
        { id: 5, name: 'Dropped', order: 5, isFinal: true, isSuccess: false, autoTransitionEvent: 'Manual', usersCount: 1200, allowedPreviousStages: ['Lead', 'Trial User'] },
    ]);

    const handleDelete = (stage) => {
        if (stage.usersCount > 0) {
            alert(`Cannot delete stage "${stage.name}" because it contains ${stage.usersCount} records. Please migrate users first.`);
            return;
        }
        if (window.confirm('Are you sure you want to delete this stage?')) {
            setStages(stages.filter(s => s.id !== stage.id));
        }
    };

    return (
        <>
            <div className="table-responsive bg-white rounded shadow-sm border">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <FiSettings />
                        <h5 className="mb-0">Funnel Configuration</h5>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => { setEditingStage(null); setShowModal(true); }}>
                        <FiPlus /> New Stage
                    </button>
                </div>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Order</th>
                            <th>Stage Name</th>
                            <th>Behavior</th>
                            <th>Trigger</th>
                            <th>Previous Steps</th>
                            <th className="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stages.sort((a, b) => a.order - b.order).map(stage => (
                            <tr key={stage.id}>
                                <td className="ps-4 text-muted">
                                    <div className="d-flex align-items-center gap-2">
                                        <FiMove /> {stage.order}
                                    </div>
                                </td>
                                <td className="fw-bold text-dark">
                                    {stage.name}
                                    <div className="small text-muted fw-normal">{stage.usersCount.toLocaleString()} users</div>
                                </td>
                                <td>
                                    {stage.isFinal ? (
                                        stage.isSuccess ? (
                                            <span className="badge bg-success bg-opacity-10 text-success border border-success">
                                                <FiCheckCircle className="me-1" /> Success
                                            </span>
                                        ) : (
                                            <span className="badge bg-danger bg-opacity-10 text-danger border border-danger">
                                                Lost / Failure
                                            </span>
                                        )
                                    ) : (
                                        <span className="badge bg-light text-dark border">In-Progress</span>
                                    )}
                                </td>
                                <td>
                                    <code className="text-primary bg-light px-2 py-1 rounded">{stage.autoTransitionEvent}</code>
                                </td>
                                <td>
                                    <small className="text-muted">
                                        {stage.allowedPreviousStages.length > 0 ? stage.allowedPreviousStages.join(', ') : '(Any)'}
                                    </small>
                                </td>
                                <td className="text-end pe-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button className="btn btn-sm btn-outline-secondary" title="Edit" onClick={() => { setEditingStage(stage); setShowModal(true); }}>
                                            <FiEdit />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            title="Delete"
                                            onClick={() => handleDelete(stage)}
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
                        <h4 className="mb-4" style={{ marginTop: 0 }}>{editingStage ? 'Edit Stage' : 'New Funnel Stage'}</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const isFinal = formData.get('isFinal') === 'on';
                            const isSuccess = formData.get('isSuccess') === 'on';
                            // Simple mock for multi-select
                            const allowedString = formData.get('allowedPreviousStages');
                            const allowedPreviousStages = allowedString ? allowedString.split(',').map(s => s.trim()) : [];

                            const stageData = {
                                id: editingStage ? editingStage.id : stages.length + 1,
                                name: formData.get('name'),
                                order: parseInt(formData.get('order')),
                                isFinal,
                                isSuccess,
                                autoTransitionEvent: formData.get('autoTransitionEvent'),
                                usersCount: editingStage ? editingStage.usersCount : 0,
                                allowedPreviousStages
                            };

                            if (editingStage) {
                                setStages(stages.map(s => s.id === editingStage.id ? stageData : s));
                            } else {
                                setStages([...stages, stageData]);
                            }
                            setShowModal(false);
                        }}>
                            <div className="row">
                                <div className="col-8 mb-3">
                                    <label className="form-label">Stage Name</label>
                                    <input type="text" name="name" className="form-control" defaultValue={editingStage?.name} placeholder="e.g. Visitor" required />
                                </div>
                                <div className="col-4 mb-3">
                                    <label className="form-label">Order</label>
                                    <input type="number" name="order" className="form-control" defaultValue={editingStage?.order || stages.length + 1} required />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Allowed Previous Stages</label>
                                <input
                                    type="text"
                                    name="allowedPreviousStages"
                                    className="form-control"
                                    defaultValue={editingStage?.allowedPreviousStages.join(', ')}
                                    placeholder="e.g. Lead, Trial User"
                                />
                                <div className="form-text small">Comma-separated names of stages allowed to transition here.</div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Transition Trigger</label>
                                <select name="autoTransitionEvent" className="form-select" defaultValue={editingStage?.autoTransitionEvent || 'Manual'}>
                                    <option value="Manual">Manual (Admin/Sales Moves)</option>
                                    <option value="Page Visit">Page Visit (Landing)</option>
                                    <option value="Signup">Signup (Registration)</option>
                                    <option value="Purchase">Purchase (Enrollment)</option>
                                    <option value="Course Complete">Course Complete</option>
                                </select>
                            </div>

                            <div className="mb-4 p-3 bg-light rounded">
                                <label className="form-label d-block mb-3 fw-bold">Stage Properties</label>

                                <div className="form-check form-switch mb-3">
                                    <input className="form-check-input" type="checkbox" name="isFinal" id="isFinalCheck" defaultChecked={editingStage?.isFinal} />
                                    <label className="form-check-label" htmlFor="isFinalCheck">
                                        Is Final Stage?
                                        <span className="text-muted d-block small" style={{ fontSize: '0.85em' }}>User stops moving after this (e.g. Purchase or Lost).</span>
                                    </label>
                                </div>

                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" name="isSuccess" id="isSuccessCheck" defaultChecked={editingStage?.isSuccess} />
                                    <label className="form-check-label" htmlFor="isSuccessCheck">
                                        Is Success Outcome?
                                        <span className="text-muted d-block small" style={{ fontSize: '0.85em' }}>Counts as a "Conversion" in analytics.</span>
                                    </label>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Configuration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default FunnelSettings;
