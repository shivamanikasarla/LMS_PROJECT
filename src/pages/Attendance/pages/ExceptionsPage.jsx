import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const ExceptionsPage = () => {
    return (
        <div className="fade-in">
            <div className="mb-4">
                <h4 className="fw-bold text-secondary">Attendance Exceptions</h4>
                <p className="text-muted small">Identify and resolve anomalies, missing records, and flagged entries.</p>
            </div>

            <div className="alert alert-info border-0 shadow-sm d-flex align-items-center gap-3 mb-4">
                <AlertCircle size={24} />
                <div>
                    <h6 className="fw-bold m-0">System Status</h6>
                    <p className="m-0 small">No critical anomalies detected in the last 24 hours.</p>
                </div>
            </div>

            {/* Placeholder Content */}
            <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                    <div className="d-inline-flex p-3 rounded-circle bg-light text-muted mb-3">
                        <CheckCircle size={32} />
                    </div>
                    <h5>All Clear</h5>
                    <p className="text-muted">No pending exceptions to review.</p>
                </div>
            </div>
        </div>
    );
};

export default ExceptionsPage;
