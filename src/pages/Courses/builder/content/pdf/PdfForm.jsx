
import React, { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';

const PdfForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we would typically upload the file to a server
        // For now, we simulate the upload by storing the file name
        onSave({
            ...formData,
            fileName: formData.file ? formData.file.name : 'No file selected'
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, file }));
            if (!formData.title) {
                setFormData(prev => ({ ...prev, title: file.name.replace(/\.pdf$/i, '') }));
            }
        }
    };

    return (
        <form className="builder-form" onSubmit={handleSubmit}>
            <h3>Upload PDF Document</h3>

            <div className="form-group">
                <label>Document Title</label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Course Syllabus"
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description..."
                    rows="3"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                />
            </div>

            <div className="form-group">
                <label>PDF File</label>
                <div className="file-upload-box">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        id="pdf-upload"
                        className="file-input-hidden"
                    />
                    <label htmlFor="pdf-upload" className="file-drop-area">
                        <FiUploadCloud size={32} />
                        <span>{formData.file ? formData.file.name : 'Click to Browse or Drag PDF Here'}</span>
                    </label>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-text" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={!formData.file}>Upload PDF</button>
            </div>
        </form>
    );
};

export default PdfForm;
