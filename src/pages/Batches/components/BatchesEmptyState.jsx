import React from 'react';
import { FiPlus, FiLayers } from 'react-icons/fi';

const BatchesEmptyState = ({ onCreate }) => {
    return (
        <div className="empty-state-container">
            <div className="empty-content">
                <div className="empty-icon-box">
                    <FiLayers size={48} color="#94a3b8" />
                </div>

                <h2>No Batches Found</h2>

                <p>
                    Create your first batch by linking it to a course and setting the
                    schedule, pricing, and access duration.
                </p>

                <div className="empty-actions">
                    <button className="btn-primary-add" onClick={onCreate}>
                        <FiPlus size={18} /> Create First Batch
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BatchesEmptyState;
