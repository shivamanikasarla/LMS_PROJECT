import React, { useState } from 'react';
import { FiUsers, FiPlus, FiTag, FiPhone, FiMail, FiMapPin, FiCheckCircle, FiClock } from 'react-icons/fi';
import FilterBar from './FilterBar';

const Leads = () => {
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showLeadDetailModal, setShowLeadDetailModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [filters, setFilters] = useState({});

    const [leads, setLeads] = useState([
        {
            id: 1,
            name: 'Alice Smith',
            email: 'alice@example.com',
            phone: '+1 234-567-8900',
            source: 'Google Ads',
            campaign: 'Summer Bootcamp Sale',
            status: 'New',
            assignedTo: 'John Doe',
            createdDate: '2024-03-10',
            lastActivity: '2024-03-12',
            notes: 'Interested in React but wants a discount.',
            activityHistory: [
                { id: 101, type: 'Call', description: 'Discussed course curriculum', by: 'John Doe', timestamp: '2024-03-12 10:30 AM' },
                { id: 102, type: 'Email', description: 'Sent brochure pdf', by: 'System', timestamp: '2024-03-11 02:15 PM' },
                { id: 103, type: 'Visit', description: 'Visited booth at TechFair', by: 'Sarah Lee', timestamp: '2024-03-10 09:00 AM' }
            ]
        },
        {
            id: 2,
            name: 'Bob Jones',
            email: 'bob@example.com',
            phone: '+1 987-654-3210',
            source: 'Affiliate',
            campaign: 'Partner Promo',
            status: 'Contacted',
            assignedTo: 'Sarah Lee',
            createdDate: '2024-03-09',
            lastActivity: '2024-03-11',
            notes: 'Called twice, no answer.',
            activityHistory: [
                { id: 201, type: 'Call', description: 'No answer, left voicemail', by: 'Sarah Lee', timestamp: '2024-03-11 11:00 AM' }
            ]
        },
        {
            id: 3,
            name: 'Charlie Day',
            email: 'charlie@example.com',
            phone: '+1 112-233-4455',
            source: 'Direct',
            campaign: 'Organic Search',
            status: 'Converted',
            assignedTo: 'Mike Ross',
            createdDate: '2024-03-08',
            lastActivity: '2024-03-10',
            notes: 'Enrolled in Full Stack course.'
        },
        {
            id: 4,
            name: 'Diana Prince',
            email: 'diana@example.com',
            phone: '+1 555-019-2834',
            source: 'Facebook',
            campaign: 'Winter Special',
            status: 'Dropped',
            assignedTo: 'Unassigned',
            createdDate: '2024-03-05',
            lastActivity: '2024-03-06',
            notes: 'Budget constraints.'
        },
    ]);

    return (
        <>
            <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                statusOptions={['New', 'Contacted', 'Qualified', 'Converted', 'Dropped']}
            />
            <div className="table-responsive bg-white rounded shadow-sm border">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Lead Management</h5>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowLeadModal(true)}><FiPlus /> Add Lead</button>
                </div>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Lead Info</th>
                            <th>Source / Campaign</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                            <th>Last Activity</th>
                            <th className="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(l => (
                            <tr key={l.id}>
                                <td className="ps-4">
                                    <div className="fw-bold text-dark">{l.name}</div>
                                    <div className="small text-muted">{l.email}</div>
                                    <div className="small text-muted">{l.phone}</div>
                                </td>
                                <td>
                                    <div className="badge bg-light text-dark border mb-1">{l.source}</div>
                                    <div className="small text-muted">{l.campaign}</div>
                                </td>
                                <td>
                                    <select
                                        className={`form-select form-select-sm border-0 fw-bold ${l.status === 'New' ? 'text-primary bg-primary bg-opacity-10' :
                                            l.status === 'Converted' ? 'text-success bg-success bg-opacity-10' :
                                                l.status === 'Contacted' ? 'text-warning bg-warning bg-opacity-10' :
                                                    'text-secondary bg-secondary bg-opacity-10'
                                            }`}
                                        style={{ width: 'auto', boxShadow: 'none' }}
                                        value={l.status}
                                        onChange={(e) => {
                                            const updatedLeads = leads.map(lead => lead.id === l.id ? { ...lead, status: e.target.value } : lead);
                                            setLeads(updatedLeads);
                                        }}
                                    >
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Converted">Converted</option>
                                        <option value="Dropped">Dropped</option>
                                    </select>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="avatar-circle small bg-secondary text-white d-flex align-items-center justify-content-center rounded-circle" style={{ width: 24, height: 24, fontSize: 10 }}>
                                            {l.assignedTo.charAt(0)}
                                        </div>
                                        <span className="small">{l.assignedTo}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="small text-dark">{l.lastActivity}</div>
                                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Created: {l.createdDate}</div>
                                </td>
                                <td className="text-end pe-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button className="btn btn-sm btn-outline-primary" title="View Details" onClick={() => { setSelectedLead(l); setShowLeadDetailModal(true); }}>
                                            <FiUsers />
                                        </button>
                                        <button className="btn btn-sm btn-outline-secondary" title="Assign User" onClick={() => { setSelectedLead(l); setShowAssignModal(true); }}>
                                            <FiPlus />
                                        </button>
                                        <button className="btn btn-sm btn-outline-info" title="Add Note" onClick={() => { setSelectedLead(l); setShowNoteModal(true); }}>
                                            <FiTag />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* LEAD MODAL (Create) */}
            {showLeadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 500 }}>
                        <h4 className="mb-4" style={{ marginTop: 0 }}>Add New Lead</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newLead = {
                                id: leads.length + 1,
                                name: formData.get('name'),
                                email: formData.get('email'),
                                phone: formData.get('phone'),
                                source: formData.get('source'),
                                campaign: formData.get('campaign'),
                                status: 'New',
                                assignedTo: formData.get('assignedTo') || 'Unassigned',
                                createdDate: new Date().toISOString().split('T')[0],
                                lastActivity: new Date().toISOString().split('T')[0],
                                notes: formData.get('notes')
                            };
                            setLeads([newLead, ...leads]);
                            setShowLeadModal(false);
                        }}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input type="text" name="name" className="form-control" required />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" name="email" className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Phone</label>
                                    <input type="text" name="phone" className="form-control" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Source</label>
                                    <select name="source" className="form-select">
                                        <option value="Google">Google</option>
                                        <option value="Affiliate">Affiliate</option>
                                        <option value="Email">Email</option>
                                        <option value="Direct">Direct</option>
                                        <option value="Social">Social</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Campaign</label>
                                    <input type="text" name="campaign" className="form-control" placeholder="Optional" />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Assigned To</label>
                                <select name="assignedTo" className="form-select">
                                    <option value="John Doe">John Doe</option>
                                    <option value="Sarah Lee">Sarah Lee</option>
                                    <option value="Mike Ross">Mike Ross</option>
                                    <option value="Unassigned">Unassigned</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Initial Note</label>
                                <textarea name="notes" className="form-control" rows="2"></textarea>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowLeadModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Lead</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* VIEW LEAD DETAILS MODAL */}
            {showLeadDetailModal && selectedLead && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 600 }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="mb-0">Lead Details</h4>
                            <button className="btn-close" onClick={() => setShowLeadDetailModal(false)}></button>
                        </div>
                        <div className="row g-0">
                            <div className="col-md-7 border-end pe-4">
                                <h6 className="text-uppercase text-muted small fw-bold mb-3">Profile Information</h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="text-muted small">Full Name</label>
                                        <div className="fw-bold">{selectedLead.name}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small">Status</label>
                                        <div>
                                            <span className={`badge ${selectedLead.status === 'New' ? 'bg-primary' : selectedLead.status === 'Converted' ? 'bg-success' : 'bg-secondary'}`}>
                                                {selectedLead.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small">Email</label>
                                        <div>{selectedLead.email}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small">Phone</label>
                                        <div>{selectedLead.phone}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small">Source</label>
                                        <div>{selectedLead.source}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small">Campaign</label>
                                        <div>{selectedLead.campaign}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small">Assigned To</label>
                                        <div>{selectedLead.assignedTo}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small">Last Activity</label>
                                        <div>{selectedLead.lastActivity}</div>
                                    </div>
                                    <div className="col-12">
                                        <label className="text-muted small">Latest Note</label>
                                        <div className="p-3 bg-light rounded border">{selectedLead.notes}</div>
                                    </div>
                                    <div className="p-3 bg-light rounded border">{selectedLead.notes}</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5 ps-4">
                            <h6 className="text-uppercase text-muted small fw-bold mb-3">Activity Timeline</h6>
                            <div className="timeline-container" style={{ position: 'relative', paddingLeft: 20 }}>
                                <div className="timeline-line" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: '#e9ecef' }}></div>
                                {selectedLead.activityHistory && selectedLead.activityHistory.map((activity, index) => (
                                    <div key={activity.id || index} className="timeline-item mb-4 position-relative">
                                        <div
                                            className="timeline-dot shadow-sm"
                                            style={{
                                                position: 'absolute', left: -25, top: 0,
                                                width: 12, height: 12, borderRadius: '50%',
                                                background: activity.type === 'Call' ? '#3b82f6' : activity.type === 'Email' ? '#10b981' : '#f59e0b',
                                                border: '2px solid #fff'
                                            }}
                                        ></div>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <span className={`badge ${activity.type === 'Call' ? 'bg-primary' : activity.type === 'Email' ? 'bg-success' : 'bg-warning'} bg-opacity-10 text-dark border`}>
                                                {activity.type === 'Call' && <FiPhone className="me-1" />}
                                                {activity.type === 'Email' && <FiMail className="me-1" />}
                                                {activity.type === 'Visit' && <FiMapPin className="me-1" />}
                                                {activity.type}
                                            </span>
                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>{activity.timestamp}</small>
                                        </div>
                                        <div className="small text-dark fw-bold">{activity.description}</div>
                                        <div className="small text-muted fst-italic mt-1">by {activity.by}</div>
                                    </div>
                                ))}
                                {!selectedLead.activityHistory && <div className="text-muted small fst-italic">No activity recorded.</div>}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button className="btn btn-secondary" onClick={() => setShowLeadDetailModal(false)}>Close</button>
                        <button className="btn btn-primary" onClick={() => { setShowLeadDetailModal(false); setShowNoteModal(true); }}>Add Note</button>
                    </div>
                </div>
            )}

            {/* ASSIGN USER MODAL */}
            {
                showAssignModal && selectedLead && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div className="bg-white rounded-lg p-6 w-full max-w-sm" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 400 }}>
                            <h5 className="mb-3">Assign Lead</h5>
                            <p className="text-muted small mb-4">Assign <strong>{selectedLead.name}</strong> to a team member.</p>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const update = { ...selectedLead, assignedTo: formData.get('assignedTo') };
                                setLeads(leads.map(l => l.id === selectedLead.id ? update : l));
                                setShowAssignModal(false);
                            }}>
                                <div className="mb-4">
                                    <label className="form-label">Select User</label>
                                    <select name="assignedTo" className="form-select" defaultValue={selectedLead.assignedTo}>
                                        <option value="John Doe">John Doe</option>
                                        <option value="Sarah Lee">Sarah Lee</option>
                                        <option value="Mike Ross">Mike Ross</option>
                                        <option value="Unassigned">Unassigned</option>
                                    </select>
                                </div>
                                <div className="d-flex justify-content-end gap-2">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Assign</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* ADD NOTE MODAL */}
            {
                showNoteModal && selectedLead && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div className="bg-white rounded-lg p-6 w-full max-w-sm" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 400 }}>
                            <h5 className="mb-3">Add Note</h5>
                            <p className="text-muted small mb-4">Adding note for <strong>{selectedLead.name}</strong></p>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const update = { ...selectedLead, notes: formData.get('note'), lastActivity: new Date().toISOString().split('T')[0] };
                                setLeads(leads.map(l => l.id === selectedLead.id ? update : l));
                                setShowNoteModal(false);
                            }}>
                                <div className="mb-4">
                                    <textarea name="note" className="form-control" rows="4" placeholder="Enter note details..." required></textarea>
                                </div>
                                <div className="d-flex justify-content-end gap-2">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowNoteModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Note</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Leads;
