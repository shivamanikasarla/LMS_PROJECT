import React, { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const ImportResourcesModal = ({ show, onClose, onImport }) => {
    const fileRef = useRef(null);
    const toast = useToast();

    if (!show) return null;

    const handleFileSelect = (file) => {
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            toast.error('Only CSV files are allowed.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be under 5MB.');
            return;
        }

        onImport(file);
    };

    const downloadTemplate = () => {
        const csvContent = `Title,Author,Category,Type,ISBN,TotalCopies,ShelfLocation,AccessUrl
Clean Code,Robert C. Martin,Software Engineering,PHYSICAL,9780132350884,5,A1-B2,
Spring Boot Guide,John Doe,Web Development,DIGITAL,,,,
`;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'library_import_template.csv';
        a.click();

        window.URL.revokeObjectURL(url);
    };

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">Bulk Import Resources</h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body">
                        <div
                            className="p-5 border border-2 border-dashed rounded text-center bg-light"
                            style={{ cursor: 'pointer' }}
                            onClick={() => fileRef.current.click()}
                        >
                            <Upload size={48} className="text-secondary mb-3" />
                            <p className="fw-medium mb-1">Upload CSV file</p>
                            <p className="small text-muted mb-0">
                                Supports Physical & Digital resources
                            </p>

                            <input
                                ref={fileRef}
                                type="file"
                                accept=".csv"
                                hidden
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                            />
                        </div>

                        <div className="mt-4 small text-muted">
                            <strong>Physical Book Columns:</strong>
                            <div>Title, Author, Category, Type, ISBN, TotalCopies, ShelfLocation</div>

                            <strong className="d-block mt-2">Digital Resource Columns:</strong>
                            <div>Title, Author, Category, Type, AccessUrl</div>
                        </div>

                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                className="btn btn-link text-decoration-none"
                                onClick={downloadTemplate}
                            >
                                <FileText size={14} className="me-1" />
                                Download CSV Template
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ImportResourcesModal;
