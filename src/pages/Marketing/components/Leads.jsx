import React, { useState } from 'react';
import { FiUsers, FiPlus, FiTag, FiPhone, FiMail, FiMapPin, FiCheckCircle, FiClock, FiEye } from 'react-icons/fi';
import FilterBar from './FilterBar';

const Leads = ({ role = 'MANAGER' }) => {
    const isManager = role === 'MANAGER' || role === 'ADMIN';
    const currentUserName = 'Mike Ross'; // Mock Executive Name

    const [showLeadModal, setShowLeadModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showLeadDetailModal, setShowLeadDetailModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [filters, setFilters] = useState({});

    // Added conversionValue to mock data
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
            conversionValue: 0,
            createdDate: '2024-03-10',
            lastActivity: '2024-03-12',
            notes: 'Interested in React but wants a discount.',
            activityHistory: [
                { id: 101, type: 'Call', description: 'Discussed course curriculum', by: 'John Doe', timestamp: '2024-03-12 10:30 AM' },
                { id: 102, type: 'Email', description: 'Sent brochure pdf', by: 'System', timestamp: '2024-03-11 02:15 PM' }
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
            conversionValue: 0,
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
            conversionValue: 450,
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
            conversionValue: 0,
            createdDate: '2024-03-05',
            lastActivity: '2024-03-06',
            notes: 'Budget constraints.'
        },
        {
            id: 5,
            name: 'Evan Peters',
            email: 'evan@example.com',
            source: 'Email',
            campaign: 'Newsletter',
            status: 'New',
            assignedTo: 'Mike Ross',
            conversionValue: 0,
            createdDate: '2024-03-14',
            lastActivity: '2024-03-14',
            notes: 'Replied to newsletter.'
        }
    ]);

    // FILTER LOGIC
    const displayedLeads = leads.filter(l => {
        if (!isManager) {
            // Executive: See assigned to self or Unassigned (to pick up)
            return l.assignedTo === currentUserName || l.assignedTo === 'Unassigned';
        }
        return true; // Manager sees all
    });

    return (
        <>
            <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                statusOptions={['New', 'Contacted', 'Qualified', 'Converted', 'Dropped']}
            />
            <div className="table-responsive bg-white rounded shadow-sm border">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{isManager ? 'Leads Monitoring' : 'My Leads'}</h5>

                    {!isManager && (
                        <button className="btn btn-primary btn-sm" onClick={() => setShowLeadModal(true)}>
                            <FiPlus /> Add Lead
                        </button>
                    )}
                </div>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Lead Info</th>
                            <th>Source / Campaign</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            {isManager && <th>Conv. Value</th>}
                            <th>Last Activity</th>
                            <th className="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedLeads.map(l => (
                            <tr key={l.id}>
                                <td className="ps-4">
                                    <div className="fw-bold text-dark">{l.name}</div>
                                    <div className="small text-muted">{l.email}</div>
                                </td>
                                <td>
                                    <div className="badge bg-light text-dark border mb-1">{l.source}</div>
                                    <div className="small text-muted">{l.campaign || '-'}</div>
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
                                    {/* MANAGER / ADMIN: Read-Only Badge */}
                                    {isManager ? (
                                        <span className={`badge ${l.status === 'New' ? 'bg-primary' : l.status === 'Converted' ? 'bg-success' : 'bg-secondary'}`}>
                                            {l.status}
                                        </span>
                                    ) : (
                                        /* EXECUTIVE: Editable Dropdown */
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
                                    )}
                                </td>

                                {isManager && (
                                    <td>
                                        {l.conversionValue > 0 ? <span className="text-success fw-bold">${l.conversionValue}</span> : <span className="text-muted">-</span>}
                                    </td>
                                )}

                                <td>
                                    <div className="small text-dark">{l.lastActivity}</div>
                                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Created: {l.createdDate}</div>
                                </td>

                                <td className="text-end pe-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button className="btn btn-sm btn-outline-primary" title="View Details" onClick={() => { setSelectedLead(l); setShowLeadDetailModal(true); }}>
                                            <FiEye />
                                        </button>

                                        {!isManager && (
                                            <>
                                                <button className="btn btn-sm btn-outline-secondary" title="Assign User" onClick={() => { setSelectedLead(l); setShowAssignModal(true); }}>
                                                    <FiPlus />
                                                </button>
                                                <button className="btn btn-sm btn-outline-info" title="Add Note" onClick={() => { setSelectedLead(l); setShowNoteModal(true); }}>
                                                    <FiTag />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* LEAD MODAL (Create) - EXEC ONLY */}
            {showLeadModal && !isManager && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <h4 className="mb-4">Add New Lead</h4>
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
                                assignedTo: currentUserName, // Auto-assign to self
                                conversionValue: 0,
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
                                        <option value="Social">Social</option>
                                        <option value="Direct">Direct</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Campaign</label>
                                    <input type="text" name="campaign" className="form-control" placeholder="Optional" />
                                </div>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="mb-0">Lead Details</h4>
                            <button className="btn-close" onClick={() => setShowLeadDetailModal(false)}></button>
                        </div>
                        {/* Details Content reused mostly */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-6"><strong>Name:</strong> {selectedLead.name}</div>
                            <div className="col-md-6"><strong>Status:</strong> {selectedLead.status}</div>
                            <div className="col-md-6"><strong>Email:</strong> {selectedLead.email}</div>
                            <div className="col-md-6"><strong>Source:</strong> {selectedLead.source}</div>
                            <div className="col-12 p-3 bg-light border rounded">{selectedLead.notes || 'No notes.'}</div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-secondary" onClick={() => setShowLeadDetailModal(false)}>Close</button>
                            {!isManager && (
                                <button className="btn btn-primary" onClick={() => { setShowLeadDetailModal(false); setShowNoteModal(true); }}>Add Note</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ASSIGN USER MODAL (Exec only, though mostly they assign to self or unassigned in this mock) */}
            {showAssignModal && selectedLead && !isManager && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                        <h5 className="mb-3">Assign Lead</h5>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const update = { ...selectedLead, assignedTo: formData.get('assignedTo') };
                            setLeads(leads.map(l => l.id === selectedLead.id ? update : l));
                            setShowAssignModal(false);
                        }}>
                            <div className="mb-4">
                                <select name="assignedTo" className="form-select" defaultValue={selectedLead.assignedTo}>
                                    <option value="Mike Ross">Me (Mike Ross)</option>
                                    <option value="Unassigned">Unassigned</option>
                                    <option value="Sarah Lee">Sarah Lee</option>
                                    <option value="Counselor Team">Counselor Team (General)</option>
                                </select>
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Assign</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD NOTE MODAL (Exec only) */}
            {showNoteModal && selectedLead && !isManager && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                        <h5 className="mb-3">Add Note</h5>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const update = { ...selectedLead, notes: formData.get('note'), lastActivity: new Date().toISOString().split('T')[0] };
                            setLeads(leads.map(l => l.id === selectedLead.id ? update : l));
                            setShowNoteModal(false);
                        }}>
                            <textarea name="note" className="form-control mb-4" rows="3" placeholder="Note..." required></textarea>
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowNoteModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Note</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Leads;
