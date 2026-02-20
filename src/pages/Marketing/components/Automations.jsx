import React, { useState } from 'react';
import { FiZap, FiPlus, FiTrash2, FiPlay, FiPause, FiSettings } from 'react-icons/fi';

const Automations = ({ role = 'MANAGER' }) => {
    const isManager = role === 'MANAGER' || role === 'ADMIN';
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [rules, setRules] = useState([
        {
            id: 1,
            name: 'Welcome New User',
            trigger: 'User Sign Up',
            condition: 'None',
            action: 'Send "Welcome Series" Email',
            status: 'Active',
            stats: { runs: 1250, converted: 45 }
        },
        {
            id: 2,
            name: 'Abandon Cart Recovery',
            trigger: 'Cart Abandoned',
            condition: 'Cart Value > $50',
            action: 'Send "Cart Reminder" Email',
            status: 'Active',
            stats: { runs: 340, converted: 12 }
        },
        {
            id: 3,
            name: 'High Value Customer',
            trigger: 'Course Purchased',
            condition: 'Total Spend > $500',
            action: 'Assign Tag "VIP"',
            status: 'Paused',
            stats: { runs: 15, converted: 0 }
        }
    ]);

    if (!isManager) {
        return <div className="p-4 text-center text-muted">You do not have permission to manage automations.</div>;
    }

    return (
        <div className="automations-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1 d-flex align-items-center gap-2">
                        <FiZap className="text-warning" /> Automation Rules
                    </h5>
                    <p className="text-muted small mb-0">Define "If This, Then That" logic for your marketing flows.</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
                    <FiPlus /> New Rule
                </button>
            </div>

            <div className="row g-4">
                {rules.map(rule => (
                    <div key={rule.id} className="col-lg-12">
                        <div className="bg-white p-3 rounded border shadow-sm d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <div className={`p-2 rounded-circle ${rule.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                                    <FiZap size={20} />
                                </div>
                                <div>
                                    <h6 className="mb-1 fw-bold">{rule.name}</h6>
                                    <div className="d-flex align-items-center gap-2 small text-muted">
                                        <span className="badge bg-light text-dark border">IF</span> {rule.trigger}
                                        {rule.condition !== 'None' && (
                                            <>
                                                <span className="badge bg-light text-dark border">AND</span> {rule.condition}
                                            </>
                                        )}
                                        <span className="badge bg-light text-dark border">THEN</span> {rule.action}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-4">
                                <div className="text-center px-3 border-end">
                                    <div className="h5 mb-0">{rule.stats.runs}</div>
                                    <div className="small text-muted">Runs</div>
                                </div>
                                <div className="text-center px-3 border-end">
                                    <div className="h5 mb-0 text-success">{rule.stats.converted}</div>
                                    <div className="small text-muted">Conv.</div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        className={`btn btn-sm ${rule.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                        title={rule.status === 'Active' ? 'Pause' : 'Activate'}
                                        onClick={() => {
                                            const newStatus = rule.status === 'Active' ? 'Paused' : 'Active';
                                            setRules(rules.map(r => r.id === rule.id ? { ...r, status: newStatus } : r));
                                        }}
                                    >
                                        {rule.status === 'Active' ? <FiPause /> : <FiPlay />}
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" title="Delete">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE RULE MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 600 }}>
                        <h4 className="mb-4" style={{ marginTop: 0 }}>Create Automation Rule</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newRule = {
                                id: rules.length + 1,
                                name: formData.get('name'),
                                trigger: formData.get('trigger'),
                                condition: formData.get('condition') || 'None',
                                action: formData.get('action'),
                                status: 'Active',
                                stats: { runs: 0, converted: 0 }
                            };
                            setRules([...rules, newRule]);
                            setShowCreateModal(false);
                        }}>
                            <div className="mb-3">
                                <label className="form-label">Rule Name</label>
                                <input type="text" name="name" className="form-control" placeholder="e.g. Vantablack Promo" required />
                            </div>

                            <div className="mb-3 p-3 bg-light rounded border">
                                <label className="form-label text-uppercase small fw-bold text-muted">Trigger (When this happens...)</label>
                                <select name="trigger" className="form-select">
                                    <option value="User Sign Up">User Sign Up</option>
                                    <option value="Course Purchased">Course Purchased</option>
                                    <option value="Cart Abandoned">Cart Abandoned</option>
                                    <option value="Lead Qualified">Lead Qualified</option>
                                </select>
                            </div>

                            <div className="mb-3 p-3 bg-light rounded border">
                                <label className="form-label text-uppercase small fw-bold text-muted">Condition (And this is true...)</label>
                                <div className="input-group">
                                    <select name="conditionType" className="form-select" style={{ maxWidth: 120 }}>
                                        <option value="None">None</option>
                                        <option value="Amount">Amount</option>
                                        <option value="Category">Category</option>
                                    </select>
                                    <select name="operator" className="form-select" style={{ maxWidth: 100 }}>
                                        <option value=">">&gt;</option>
                                        <option value="equals">=</option>
                                    </select>
                                    <input type="text" name="conditionValue" className="form-control" placeholder="Value (e.g. 50)" />
                                </div>
                                <input type="hidden" name="condition" value="User choice simulated" />
                            </div>

                            <div className="mb-3 p-3 bg-light rounded border">
                                <label className="form-label text-uppercase small fw-bold text-muted">Action (Do this...)</label>
                                <select name="action" className="form-select">
                                    <option value="Send Email">Send Email (Template)</option>
                                    <option value="Assign Tag">Assign Tag</option>
                                    <option value="Notify Admin">Notify Admin</option>
                                    <option value="Issue Coupon">Issue Coupon</option>
                                </select>
                                <div className="form-text text-warning mt-2">
                                    <FiSettings className="me-1" /> Note: Email content is managed in Templates, not here.
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Rule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Automations;
