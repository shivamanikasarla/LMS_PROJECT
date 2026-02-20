import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, AlertCircle, Calendar, Globe, X } from 'lucide-react';
import { IssueService, ReservationService, BookService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
    const { user, login } = useAuth();
    const [myIssues, setMyIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showResModal, setShowResModal] = useState(false);
    const [showAccessModal, setShowAccessModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        loadMyData();
    }, [user]);

    const loadMyData = async () => {
        try {
            const allIssues = await IssueService.getAllIssues();
            const myData = allIssues.filter(i =>
                (i.userId === user.id || i.userId === user.memberId) &&
                i.status === 'ISSUED'
            );
            setMyIssues(myData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReservation = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await ReservationService.createReservation({
                userId: user.id,
                resourceId: selectedItem,
                status: 'PENDING',
                reservationDate: new Date().toISOString()
            });
            alert('Reservation requested successfully!');
            setShowResModal(false);
            setSelectedItem('');
        } catch (error) {
            alert('Failed to reserve: ' + error.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDigitalAccess = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            // Simulating digital access request
            await new Promise(r => setTimeout(r, 800));
            alert('Digital Access request submitted. Check your email for the link.');
            setShowAccessModal(false);
            setSelectedItem('');
        } catch (error) {
            alert('Request failed');
        } finally {
            setSubmitLoading(false);
        }
    };

    const calculateDaysLeft = (dueDate) => {
        const diff = new Date(dueDate) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Welcome back, {user?.name.split(' ')[0]}!</h2>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => login('ADMIN')}>
                    Switch to Admin View
                </button>
            </div>

            {/* STATS ROW */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100 bg-primary-subtle text-primary">
                        <div className="card-body d-flex align-items-center">
                            <div className="p-3 bg-white rounded-circle me-3">
                                <BookOpen size={24} className="text-primary" />
                            </div>
                            <div>
                                <h6 className="mb-0 text-uppercase fw-bold opacity-75">Books Borrowed</h6>
                                <h2 className="mb-0 fw-bold">{myIssues.length}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100 bg-danger-subtle text-danger">
                        <div className="card-body d-flex align-items-center">
                            <div className="p-3 bg-white rounded-circle me-3">
                                <AlertCircle size={24} className="text-danger" />
                            </div>
                            <div>
                                <h6 className="mb-0 text-uppercase fw-bold opacity-75">Fines Due</h6>
                                <h2 className="mb-0 fw-bold">$0</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body d-flex gap-3 p-4">
                            <button className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-2" onClick={() => setShowResModal(true)}>
                                <Calendar size={18} />
                                Request Reservation
                            </button>
                            <button className="btn btn-outline-dark d-flex align-items-center gap-2 px-4 py-2" onClick={() => setShowAccessModal(true)}>
                                <Globe size={18} />
                                Request Digital Access
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MY BOOKS LIST */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                    <h5 className="mb-0">My Active Issues</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Book Title</th>
                                    <th>Issued On</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                                )}
                                {!loading && myIssues.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-5 text-muted">You have no borrowed books.</td></tr>
                                )}
                                {myIssues.map(issue => {
                                    const daysLeft = calculateDaysLeft(issue.dueDate);
                                    const isOverdue = daysLeft < 0;

                                    return (
                                        <tr key={issue.id}>
                                            <td className="ps-4 fw-bold">{issue.resourceTitle}</td>
                                            <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <Clock size={14} className="me-2 text-muted" />
                                                    {new Date(issue.dueDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td>
                                                {isOverdue ? (
                                                    <span className="badge bg-danger">Overdue by {Math.abs(daysLeft)} days</span>
                                                ) : (
                                                    <span className="badge bg-success">{daysLeft} days left</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* RESERVATION MODAL */}
            {showResModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Request Book Reservation</h5>
                                <button className="btn-close" onClick={() => setShowResModal(false)}></button>
                            </div>
                            <form onSubmit={handleReservation}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Select Book</label>
                                        <select className="form-select" required value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
                                            <option value="">-- Choose a book --</option>
                                            <option value="b2">The Pragmatic Programmer (Currently Issued)</option>
                                            <option value="b1">Clean Code (Available)</option>
                                            <option value="b3">Design Patterns</option>
                                        </select>
                                        <div className="form-text">You will be notified when this book becomes available.</div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-light" onClick={() => setShowResModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                                        {submitLoading ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* DIGITAL ACCESS MODAL */}
            {showAccessModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Request Digital Access</h5>
                                <button className="btn-close" onClick={() => setShowAccessModal(false)}></button>
                            </div>
                            <form onSubmit={handleDigitalAccess}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Select Resource</label>
                                        <select className="form-select" required value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
                                            <option value="">-- Choose a resource --</option>
                                            <option value="d1">Advanced React Patterns (eBook)</option>
                                            <option value="d2">IEEE Trans. on Software Eng. (Journal)</option>
                                            <option value="d3"> ACM Digital Library</option>
                                        </select>
                                        <div className="form-text">Access link will be sent to your registered email.</div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Access Duration Needed</label>
                                        <select className="form-select">
                                            <option>24 Hours</option>
                                            <option>3 Days</option>
                                            <option>1 Week</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-light" onClick={() => setShowAccessModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-dark" disabled={submitLoading}>
                                        {submitLoading ? 'Processing...' : 'Get Access'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
