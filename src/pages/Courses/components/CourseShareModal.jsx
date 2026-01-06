
import React from 'react';
import { FiX, FiShare2, FiCopy } from 'react-icons/fi';
import { QRCodeCanvas } from 'qrcode.react';

const CourseShareModal = ({ isOpen, onClose, course }) => {
    if (!isOpen || !course) return null;

    const shareUrl = `${window.location.origin}/course-overview/${course.id || 'preview'}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('URL copied to clipboard!');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '400px', textAlign: 'center' }}>
                <div className="modal-header">
                    <h2>Share Course</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX size={20} />
                    </button>
                </div>

                <div className="share-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                    <div className="qr-container" style={{ padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <QRCodeCanvas value={shareUrl} size={200} />
                    </div>

                    <div className="share-url-box" style={{ width: '100%', display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            style={{
                                flex: 1,
                                padding: '10px 12px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                background: '#f1f5f9',
                                color: '#475569',
                                fontSize: '13px'
                            }}
                        />
                        <button
                            onClick={handleCopy}
                            style={{
                                background: '#0f172a',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                width: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <FiCopy size={16} />
                        </button>
                    </div>

                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                        Scan QR code or copy URL to share this course.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CourseShareModal;
