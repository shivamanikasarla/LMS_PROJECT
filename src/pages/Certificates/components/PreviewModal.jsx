import React from 'react';
import { FaDownload } from 'react-icons/fa';
import CertificateRenderer from './CertificateRenderer';

const PreviewModal = ({ previewCert, onClose }) => {
    if (!previewCert) return null;

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center animate-fade-in" style={{ zIndex: 1050, backdropFilter: 'blur(5px)' }}>
            <div className="bg-white rounded-4 shadow-lg overflow-hidden position-relative d-flex flex-column" style={{ width: '90%', maxWidth: '1000px', maxHeight: '90vh' }}>

                {/* Header */}
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top">
                    <div>
                        <h5 className="mb-0 fw-bold">Certificate Preview</h5>
                        <small className="text-muted">ID: {previewCert.data.certificateId}</small>
                    </div>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                {/* Content */}
                <div className="p-4 bg-light overflow-auto d-flex justify-content-center align-items-center flex-grow-1">
                    <div style={{ width: '100%', maxWidth: '800px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <CertificateRenderer template={previewCert.template} data={previewCert.data} />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 border-top bg-white text-end d-flex justify-content-end gap-2">
                    <button className="btn btn-light border" onClick={onClose}>Close</button>
                    <button className="btn btn-primary" onClick={() => window.print()}><FaDownload className="me-2" /> Download / Print</button>
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
