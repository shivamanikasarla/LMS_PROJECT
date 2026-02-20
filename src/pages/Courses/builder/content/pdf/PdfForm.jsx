
import React, { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';

const PdfForm = ({ onSave, onCancel, initialData }) => {
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
                title: prev.title || file.name.replace(/\.pdf$/i, '')
            }));
        }
    };

    return (
        <form className="builder-form" onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">{initialData ? 'Edit Document' : 'Add Document'}</h3>
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
                    placeholder="e.g. Course Syllabus"
                />
            </div>

            {/* 2. DESCRIPTION */}
            <div className="form-group mb-3">
                <label className="form-label fw-bold">Description</label>
                <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this document..."
                    rows="3"
                />
            </div>

            {/* 3. SOURCE TYPE */}
            <div className="form-group mb-3">
                <div className="btn-group w-100" role="group">
                    <input
                        type="radio"
                        className="btn-check"
                        name="pdf-method"
                        id="pdf-upload"
                        checked={method === 'upload'}
                        onChange={() => setMethod('upload')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="pdf-upload">
                        <FiUploadCloud className="me-2" /> Upload PDF
                    </label>

                    <input
                        type="radio"
                        className="btn-check"
                        name="pdf-method"
                        id="pdf-url"
                        checked={method === 'url'}
                        onChange={() => setMethod('url')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="pdf-url">
                        <FiLink className="me-2" /> External URL
                    </label>
                </div>
            </div>

            {/* 4. CONTENT INPUT */}
            <div className="form-group mb-4">
                {method === 'url' ? (
                    <>
                        <label className="form-label">PDF URL</label>
                        <input
                            type="url"
                            className="form-control"
                            required={method === 'url'}
                            value={formData.url}
                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                            placeholder="https://example.com/document.pdf"
                        />
                    </>
                ) : (
                    <>
                        <label className="form-label">PDF File</label>
                        <div className="border rounded p-4 text-center bg-light">
                            <input
                                type="file"
                                id="pdf-upload-input"
                                accept="application/pdf"
                                className="d-none"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="pdf-upload-input" className="cursor-pointer text-primary">
                                <FiUploadCloud size={24} className="mb-2 d-block mx-auto" />
                                <span className="fw-bold">{formData.file ? formData.file.name : "Click to Select PDF File"}</span>
                            </label>
                        </div>
                    </>
                )}
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={method === 'upload' && !formData.file && !initialData?.fileName}>
                    {initialData ? 'Update Document' : 'Add Document'}
                </button>
            </div>
        </form>
    );
};

export default PdfForm;
