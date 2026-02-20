import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({
    show,
    resourceType = 'RESOURCE', // PHYSICAL | DIGITAL | RESOURCE
    hasCopies = false,
    onCancel,
    onConfirm
}) => {
    if (!show) return null;

    const isPhysicalWithCopies = resourceType === 'PHYSICAL' && hasCopies;

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title text-danger d-flex align-items-center gap-2">
                            <AlertTriangle size={18} />
                            Delete Confirmation
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onCancel}
                        />
                    </div>

                    <div className="modal-body">
                        {isPhysicalWithCopies ? (
                            <>
                                <p className="fw-semibold text-danger mb-2">
                                    This physical book has active copies.
                                </p>
                                <p className="text-muted mb-0">
                                    Deleting it may break issue/return history.
                                    In real systems, books with copies are usually archived instead of deleted.
                                </p>
                            </>
                        ) : (
                            <p className="mb-0">
                                Are you sure you want to delete this resource?
                                This action <strong>cannot be undone</strong>.
                            </p>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-light"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn btn-danger"
                            onClick={onConfirm}
                        >
                            <Trash2 size={16} className="me-2" />
                            Delete
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
