import React, { useState } from 'react';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';

const ReturnModal = ({ isOpen, loading, data, processing, onConfirm, onClose }) => {
    const [waiveFine, setWaiveFine] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Return Book</h5>
                        <button className="btn-close" onClick={onClose} disabled={processing} />
                    </div>

                    <div className="modal-body">
                        {loading && <div className="text-center py-4">Loading return details...</div>}

                        {!loading && data && (
                            <div>
                                {/* Book & Member Summary */}
                                <div className="card bg-light border-0 mb-3">
                                    <div className="card-body">
                                        <h6 className="fw-bold mb-1">{data.issue.resourceTitle || 'Unknown Title'}</h6>
                                        <div className="small text-muted mb-2">Barcode: {data.issue.barcode}</div>
                                        <div className="d-flex align-items-center">
                                            <div className="badge bg-secondary me-2">Borrowed by User {data.issue.userId}</div>
                                            {/* Note: In real app, name is typically populated in issue or fetched */}
                                        </div>
                                    </div>
                                </div>

                                {/* Overdue / Fine Section */}
                                <div className="row g-3">
                                    <div className="col-6">
                                        <div className={`p-3 border rounded text-center ${data.overdueDays > 0 ? 'bg-danger-subtle text-danger border-danger' : 'bg-success-subtle text-success border-success'}`}>
                                            <div className="small text-uppercase fw-bold mb-1">Overdue Days</div>
                                            <div className="h4 mb-0 d-flex align-items-center justify-content-center">
                                                <Clock size={18} className="me-2" />
                                                {data.overdueDays}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-3 border rounded text-center bg-light">
                                            <div className="small text-uppercase fw-bold mb-1 text-muted">Fine Amount</div>
                                            <div className="h4 mb-0 d-flex align-items-center justify-content-center">
                                                <DollarSign size={18} className="me-1" />
                                                {data.fineAmount}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Waive Logic */}
                                {data.fineAmount > 0 && (
                                    <div className="form-check mt-4 p-3 border rounded">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="waiveCheck"
                                            checked={waiveFine}
                                            onChange={(e) => setWaiveFine(e.target.checked)}
                                        />
                                        <label className="form-check-label fw-medium" htmlFor="waiveCheck">
                                            Waive this fine?
                                            <div className="small text-muted fw-normal">
                                                Admin override to set fine to 0 upon return.
                                            </div>
                                        </label>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-light" onClick={onClose} disabled={processing}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary d-flex align-items-center"
                            onClick={() => onConfirm(waiveFine)}
                            disabled={loading || processing}
                        >
                            {processing ? 'Processing...' : (
                                <>
                                    <CheckCircle size={16} className="me-2" />
                                    Confirm Return
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnModal;
