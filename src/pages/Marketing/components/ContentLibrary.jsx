import React, { useState } from 'react';
import { FiFolder, FiImage, FiFileText, FiLink, FiVideo, FiUpload, FiTrash2, FiEye } from 'react-icons/fi';

const ContentLibrary = ({ role = 'MANAGER' }) => {
    // Manager has full access, Executive has View/Use access (or limited upload)
    const isManager = role === 'MANAGER' || role === 'ADMIN';
    const canManage = isManager; // Strict interpretation: only Manager manages global assets

    const [activeTab, setActiveTab] = useState('templates');
    const [assets, setAssets] = useState({
        templates: [
            { id: 1, name: 'Welcome Series #1', type: 'Email', addedBy: 'Admin', date: '2024-01-10' },
            { id: 2, name: 'Webinar Invite', type: 'Email', addedBy: 'Manager', date: '2024-02-15' },
        ],
        banners: [
            { id: 1, name: 'Summer Sale 1080x1080', type: 'Image', addedBy: 'Admin', date: '2024-03-01' },
            { id: 2, name: 'Course Cover Art', type: 'Image', addedBy: 'Manager', date: '2024-03-05' },
        ],
        videos: [
            { id: 1, name: 'Course Trailer', type: 'Video', addedBy: 'Admin', date: '2024-01-20' },
        ],
        links: [
            { id: 1, name: 'Landing Page - React', type: 'Link', addedBy: 'Manager', date: '2024-02-10', url: 'https://lms.com/react' },
        ]
    });

    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleDelete = (category, id) => {
        if (!canManage) return;
        setAssets({
            ...assets,
            [category]: assets[category].filter(a => a.id !== id)
        });
    };

    const renderAssetList = (category, icon) => {
        const items = assets[category];

        return (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-muted text-uppercase small fw-bold mb-0">{category} ({items.length})</h6>
                    {canManage && (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setShowUploadModal(true)}>
                            <FiUpload /> Upload {category}
                        </button>
                    )}
                </div>

                {items.length === 0 && <div className="text-center p-4 text-muted border rounded bg-light">No {category} found.</div>}

                <div className="row g-3">
                    {items.map(item => (
                        <div key={item.id} className="col-md-6 col-lg-4">
                            <div className="p-3 border rounded bg-white shadow-sm h-100 d-flex flex-column">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="p-2 bg-light rounded text-primary">
                                        {icon}
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="fw-bold text-truncate" title={item.name}>{item.name}</div>
                                        <div className="text-muted small">Added by {item.addedBy}</div>
                                    </div>
                                </div>
                                <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{item.date}</div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-light text-primary" title="Preview">
                                            <FiEye />
                                        </button>
                                        {canManage && (
                                            <button className="btn btn-sm btn-light text-danger" title="Delete" onClick={() => handleDelete(category, item.id)}>
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="content-library">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1 d-flex align-items-center gap-2">
                        <FiFolder className="text-warning" /> Content Library
                    </h5>
                    <p className="text-muted small mb-0">Manage reusable assets for campaigns.</p>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-transparent border-bottom-0 pb-0">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>
                                <FiFileText className="me-2" /> Email Templates
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'banners' ? 'active' : ''}`} onClick={() => setActiveTab('banners')}>
                                <FiImage className="me-2" /> Banners
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>
                                <FiVideo className="me-2" /> Videos
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'links' ? 'active' : ''}`} onClick={() => setActiveTab('links')}>
                                <FiLink className="me-2" /> Links
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body bg-light">
                    {activeTab === 'templates' && renderAssetList('templates', <FiFileText size={20} />)}
                    {activeTab === 'banners' && renderAssetList('banners', <FiImage size={20} />)}
                    {activeTab === 'videos' && renderAssetList('videos', <FiVideo size={20} />)}
                    {activeTab === 'links' && renderAssetList('links', <FiLink size={20} />)}
                </div>
            </div>

            {/* UPLOAD MODAL (Manager Only) */}
            {showUploadModal && canManage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="bg-white rounded p-4 w-100 max-w-sm m-auto" style={{ maxWidth: '400px' }}>
                        <h5 className="mb-3">Upload Asset</h5>
                        <p className="small text-muted">Mock upload logic for prototypes.</p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const name = formData.get('name');
                            if (!name) return;

                            const newItem = {
                                id: Date.now(),
                                name: name,
                                type: 'File',
                                addedBy: 'Manager',
                                date: new Date().toISOString().split('T')[0]
                            };

                            setAssets({
                                ...assets,
                                [activeTab]: [...assets[activeTab], newItem]
                            });
                            setShowUploadModal(false);
                        }}>
                            <div className="mb-3">
                                <label className="form-label">Asset Name</label>
                                <input type="text" name="name" className="form-control" required autoFocus />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">File / URL</label>
                                <input type="file" className="form-control" disabled />
                                <div className="form-text">File upload disabled in mock mode.</div>
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentLibrary;
