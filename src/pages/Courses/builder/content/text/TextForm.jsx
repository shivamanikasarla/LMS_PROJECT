
import React, { useState } from 'react';

const TextForm = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        content: initialData?.content || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form className="builder-form" onSubmit={handleSubmit}>
            <h3>{initialData ? 'Edit Text / HTML' : 'Add Text / HTML'}</h3>

            <div className="form-group">
                <label>Title (Internal use)</label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Welcome Message"
                />
            </div>

            <div className="form-group">
                <label>Content (HTML / Text)</label>
                <textarea
                    rows={10}
                    required
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    placeholder="<p>Write your content here...</p>"
                    style={{ fontFamily: 'monospace' }}
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    You can use standard HTML tags or paste embed codes.
                </p>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-text" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn-primary">
                    {initialData ? 'Update Text Content' : 'Add Text Content'}
                </button>
            </div>
        </form>
    );
};

export default TextForm;
