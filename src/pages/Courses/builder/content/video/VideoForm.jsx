
import React, { useState } from 'react';
import { FiUploadCloud, FiLink, FiVideo } from 'react-icons/fi';

const VideoForm = ({ onSave, onCancel, initialData }) => {
    // Determine initial method based on whether there's a file or url
    const [method, setMethod] = useState(initialData?.method || (initialData?.url ? 'url' : 'upload'));
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        url: initialData?.url || '',
        description: initialData?.description || '',
        file: initialData?.file || null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            // If using URL method, ensure file is null so logic knows
            file: method === 'upload' ? formData.file : null,
            fileName: method === 'upload' && formData.file ? formData.file.name : null,
            method
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                file,
                // Auto-fill title if empty
                title: prev.title || file.name.replace(/\.[^/.]+$/, "")
            }));
        }
    };

    return (
        <form className="builder-form" onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">{initialData ? 'Edit Content' : 'Add Content'}</h3>
            </div>

            {/* 1. TITLE */}
            <div className="form-group mb-3">
                <label className="form-label fw-bold">Title</label>
                <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Introduction to the Course"
                />
            </div>

            {/* 2. DESCRIPTION */}
            <div className="form-group mb-3">
                <label className="form-label fw-bold">Description</label>
                <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this content..."
                    rows="3"
                />
            </div>

            {/* 3. CONTENT TYPE / SOURCE */}
            <div className="form-group mb-3">
                <label className="form-label fw-bold">Content Type / Source</label>
                <div className="btn-group w-100" role="group">
                    <input
                        type="radio"
                        className="btn-check"
                        name="method"
                        id="method-upload"
                        checked={method === 'upload'}
                        onChange={() => setMethod('upload')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="method-upload">
                        <FiUploadCloud className="me-2" /> Upload Video
                    </label>

                    <input
                        type="radio"
                        className="btn-check"
                        name="method"
                        id="method-url"
                        checked={method === 'url'}
                        onChange={() => setMethod('url')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="method-url">
                        <FiLink className="me-2" /> External URL
                    </label>
                </div>
            </div>

            {/* 4. FILE OR URL INPUT */}
            <div className="form-group mb-4">
                {method === 'url' ? (
                    <>
                        <label className="form-label">Video URL</label>
                        <input
                            type="url"
                            className="form-control"
                            required={method === 'url'}
                            value={formData.url}
                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                            placeholder="https://youtube.com/..."
                        />
                    </>
                ) : (
                    <>
                        <label className="form-label">Video File</label>
                        <div className="border rounded p-4 text-center bg-light">
                            <input
                                type="file"
                                id="video-upload"
                                accept="video/*"
                                className="d-none"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="video-upload" className="cursor-pointer text-primary">
                                <FiVideo size={24} className="mb-2 d-block mx-auto" />
                                <span className="fw-bold">{formData.file ? formData.file.name : "Click to Select Video File"}</span>
                            </label>
                        </div>
                    </>
                )}
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={method === 'upload' && !formData.file && !initialData?.fileName}>
                    {initialData ? 'Update Content' : 'Add Content'}
                </button>
            </div>
        </form>
    );
};

export default VideoForm;
