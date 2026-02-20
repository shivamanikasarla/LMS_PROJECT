import React, { useState, useEffect } from 'react';
import { FiX, FiFileText, FiVideo, FiTrash2, FiExternalLink, FiPlus, FiSave, FiUploadCloud, FiImage, FiLink } from 'react-icons/fi';
import { sessionService } from '../services/sessionService';

const SessionContentModal = ({ session, onClose }) => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Upload State
    const [files, setFiles] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (session) {
            loadContents();
        }
    }, [session]);

    const loadContents = async () => {
        setLoading(true);
        try {
            const data = await sessionService.getSessionContents(session.sessionId);
            setContents(data || []);
        } catch (error) {
            console.error("Failed to load content", error);
        } finally {
            setLoading(false);
        }
    };

    const inferType = (filename) => {
        if (!filename) return 'LINK';
        const lower = filename.toLowerCase();
        if (lower.match(/\.(mp4|mov|avi|mkv|webm)|youtube\.com|youtu\.be|vimeo\.com/)) return 'VIDEO';
        if (lower.match(/\.pdf/)) return 'PDF';
        if (lower.match(/\.(jpg|jpeg|png|gif|webp)/)) return 'IMAGE';
        return 'FILE';
    };

    const handleView = async (item) => {
        if (item.fileUrl && (item.fileUrl.startsWith('http') || item.fileUrl.startsWith('https'))) {
            window.open(item.fileUrl, '_blank');
            return;
        }
        try {
            const blob = await sessionService.previewSessionContent(item.sessionContentId);
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error("Failed to view content", error);
            alert("Could not view content.");
        }
    };

    const handleUpload = async () => {
        if (!files || files.length === 0) {
            alert("Please select files first.");
            return;
        }

        setUploading(true);
        try {
            const uploads = Array.from(files).map(async (file) => {
                // 1. Create Metadata (POST)
                const type = inferType(file.name);
                const metadata = {
                    title: file.name,
                    description: '',
                    contentType: type,
                    fileUrl: ''
                };
                const created = await sessionService.createSessionContent(session.sessionId, metadata);

                // 2. Upload File (PUT)
                await sessionService.uploadSessionContentFile(created.sessionContentId, file);
            });

            await Promise.all(uploads);

            setFiles(null);
            setIsAdding(false);
            loadContents();
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload files. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (contentId) => {
        if (!window.confirm("Delete this content?")) return;
        try {
            await sessionService.deleteSessionContent(contentId);
            setContents(prev => prev.filter(c => c.sessionContentId !== contentId));
        } catch (error) {
            alert("Failed to delete content");
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'VIDEO': return <FiVideo size={20} />;
            case 'IMAGE': return <FiImage size={20} />;
            case 'LINK': return <FiLink size={20} />;
            default: return <FiFileText size={20} />;
        }
    };

    if (!session) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-large" style={{ maxWidth: '700px' }}>
                <div className="modal-header">
                    <div className="d-flex flex-column">
                        <h3>Session Content</h3>
                        <small className="text-muted">{session.sessionName} ({session.startDate})</small>
                    </div>
                    <button className="btn-close" onClick={onClose}><FiX /></button>
                </div>

                <div className="modal-body">
                    {/* Content List */}
                    <div className="content-list mb-4">
                        <h4 className="mb-3">Resources & Recordings</h4>
                        {loading ? (
                            <div className="p-3 text-center">Loading...</div>
                        ) : contents.length === 0 ? (
                            <div className="p-4 text-center border rounded bg-light text-muted">
                                No content uploaded yet.
                            </div>
                        ) : (
                            <div className="list-group">
                                {contents.map(item => (
                                    <div key={item.sessionContentId} className="list-group-item d-flex justify-content-between align-items-center mb-2 p-3 border rounded hover-shadow">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className={`p-2 rounded-circle ${item.contentType === 'VIDEO' ? 'bg-primary-light text-primary' : 'bg-light text-secondary'}`}>
                                                {getIcon(item.contentType)}
                                            </div>
                                            <div>
                                                <h5 className="m-0 text-dark fw-bold">{item.title}</h5>
                                                {item.description && <small className="text-muted d-block">{item.description}</small>}
                                                <span className="badge bg-light text-dark border mt-1" style={{ fontSize: '0.7rem' }}>
                                                    {item.contentType}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                                onClick={() => handleView(item)}
                                            >
                                                <FiExternalLink /> View
                                            </button>
                                            <button
                                                className="btn-icon-plain text-danger"
                                                onClick={() => handleDelete(item.sessionContentId)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add New Section */}
                    <div className="add-content-section mt-4 pt-3 border-top">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="m-0">Upload content</h4>
                            {!isAdding && (
                                <button className="btn-secondary btn-sm" onClick={() => setIsAdding(true)}>
                                    <FiPlus /> Add Files
                                </button>
                            )}
                        </div>

                        {isAdding && (
                            <div className="bg-light p-4 rounded border text-center">
                                <div className="mb-3">
                                    <FiUploadCloud size={40} className="text-muted mb-2" />
                                    <h5>Select files to upload</h5>
                                    <p className="text-muted small">Documents, Videos, Images</p>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    className="form-control mb-3"
                                    onChange={e => setFiles(e.target.files)}
                                />

                                {files && files.length > 0 && (
                                    <div className="text-start mb-3">
                                        <strong>Selected:</strong>
                                        <ul className="small text-muted">
                                            {Array.from(files).map((f, i) => <li key={i}>{f.name}</li>)}
                                        </ul>
                                    </div>
                                )}

                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        className="btn-secondary"
                                        onClick={() => { setIsAdding(false); setFiles(null); }}
                                        disabled={uploading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn-primary"
                                        onClick={handleUpload}
                                        disabled={!files || uploading}
                                    >
                                        {uploading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <FiUploadCloud /> Upload {files?.length > 0 ? `(${files.length})` : ''}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionContentModal;
