
import React, { useState } from 'react';
import { FiUploadCloud, FiLink, FiVideo } from 'react-icons/fi';

const VideoForm = ({ onSave, onCancel, initialData }) => {
    const [method, setMethod] = useState(initialData?.method || 'upload'); // 'upload' | 'url'
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
            fileName: formData.file ? formData.file.name : (initialData?.fileName || null),
            method
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, file });
        }
    };

    return (
        <form className="builder-form" onSubmit={handleSubmit}>
            <h3>{initialData ? 'Edit Video Content' : 'Add Video Content'}</h3>

            {/* ... fields ... */}

            <div className="form-group">
                <label>Video Title</label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Introduction to React"
                />
            </div>

            <div className="form-group">
                <label>Source Type</label>
                <div className="source-type-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <button
                        type="button"
                        className={`btn-tab ${method === 'upload' ? 'active' : ''}`}
                        onClick={() => setMethod('upload')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: method === 'upload' ? '#eff6ff' : '#fff', color: method === 'upload' ? '#2563eb' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <FiUploadCloud style={{ marginRight: '8px' }} /> Upload
                    </button>
                    <button
                        type="button"
                        className={`btn-tab ${method === 'url' ? 'active' : ''}`}
                        onClick={() => setMethod('url')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: method === 'url' ? '#eff6ff' : '#fff', color: method === 'url' ? '#2563eb' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <FiLink style={{ marginRight: '8px' }} /> URL
                    </button>
                </div>
            </div>

            {method === 'url' ? (
                <div className="form-group">
                    <label>Video URL (YouTube/Vimeo/S3)</label>
                    <input
                        type="url"
                        required={method === 'url'}
                        value={formData.url}
                        onChange={e => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://..."
                    />
                </div>
            ) : (
                <div className="form-group">
                    <label>Video File (MP4, WebM)</label>
                    <div className="file-upload-box">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            id="video-upload"
                            className="file-input-hidden"
                        />
                        <label htmlFor="video-upload" className="file-drop-area">
                            <FiVideo size={32} />
                            <span>{formData.file ? formData.file.name : (initialData?.fileName || 'Click to Browse or Drag Video')}</span>
                        </label>
                    </div>
                </div>
            )}

            <div className="form-group">
                <label>Description</label>
                <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter video description..."
                    rows="3"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                />
            </div>

            <div className="form-actions">
                <button type="button" className="btn-text" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={method === 'upload' && !formData.file && !initialData?.fileName}>
                    {initialData ? 'Update Video' : 'Add Video'}
                </button>
            </div>
        </form>
    );
};

export default VideoForm;
