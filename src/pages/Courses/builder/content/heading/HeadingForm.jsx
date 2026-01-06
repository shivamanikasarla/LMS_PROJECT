
import React, { useState } from 'react';

const HeadingForm = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        subtext: initialData?.subtext || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            type: 'heading'
        });
    };

    return (
        <form className="builder-form" onSubmit={handleSubmit}>
            <h3>{initialData ? 'Edit Section Heading' : 'Add Section Heading'}</h3>

            <div className="form-group">
                <label>Heading Text</label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Part 1: Fundamentals"
                    autoFocus
                />
            </div>

            <div className="form-group">
                <label>Subtext (Optional)</label>
                <input
                    type="text"
                    value={formData.subtext}
                    onChange={e => setFormData({ ...formData, subtext: e.target.value })}
                    placeholder="e.g. In this section we cover..."
                />
            </div>

            <div className="form-actions">
                <button type="button" className="btn-text" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn-primary">
                    {initialData ? 'Update Heading' : 'Add Heading'}
                </button>
            </div>
        </form>
    );
};

export default HeadingForm;
