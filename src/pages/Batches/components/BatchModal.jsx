import React from 'react';
import { FiX } from "react-icons/fi";

const BatchModal = ({
    isOpen,
    onClose,
    formData,
    handleInputChange,
    handleSave,
    isEdit,
    courses = [],
    instructors = []
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-fixed">
            <div className="modal-box premium-modal">
                <div className="modal-head">
                    <h2>{isEdit ? 'Edit Batch' : 'Create New Batch'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <p className="modal-subtitle">
                        Configure batch schedule and pricing.
                    </p>

                    <div className="form-group-grid">

                        {/* Course */}
                        <div className="form-field full-width">
                            <label>Course <span className="req">*</span></label>
                            <select
                                className="form-select"
                                name="courseId"
                                value={formData.courseId}
                                onChange={handleInputChange}
                                disabled={isEdit}
                            >
                                <option value="">Select a course</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                            {isEdit && (
                                <span className="helper-text">
                                    Course cannot be changed after creation.
                                </span>
                            )}
                        </div>

                        {/* Batch Name */}
                        <div className="form-field full-width">
                            <label>Batch Name <span className="req">*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. React Morning Batch A"
                            />
                        </div>

                        {/* Instructor */}
                        <div className="form-field full-width">
                            <label>Assigned Instructor</label>
                            <select
                                className="form-select"
                                name="instructorId"
                                value={formData.instructorId}
                                onChange={handleInputChange}
                            >
                                <option value="">Select an instructor</option>
                                {instructors.map(inst => (
                                    <option key={inst.id} value={inst.id}>
                                        {inst.name} ({inst.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Dates */}
                        <div className="form-row-split">
                            <div className="form-field">
                                <label>Start Date <span className="req">*</span></label>
                                <input
                                    type="date"
                                    className="form-input"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-field">
                                <label>End Date <span className="req">*</span></label>
                                <input
                                    type="date"
                                    className="form-input"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Class Frequency & Mode */}
                        <div className="form-row-split">
                            <div className="form-field">
                                <label>Classes / Week</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    name="classesPerWeek"
                                    value={formData.classesPerWeek || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-field">
                                <label>Mode</label>
                                <select
                                    className="form-select"
                                    name="mode"
                                    value={formData.mode || 'Online'}
                                    onChange={handleInputChange}
                                >
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                    <option value="Both">Hybrid</option>
                                </select>
                            </div>
                        </div>

                        {/* Validity & Batch Limit */}
                        <div className="form-row-split">
                            <div className="form-field">
                                <label>Batch Limit (Max Students)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    name="maxStudents"
                                    value={formData.maxStudents || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 50"
                                />
                            </div>

                            <div className="form-field">
                                <label>Access Validity</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="validity"
                                    value={formData.validity || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 6 Months"
                                />
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="form-field full-width">
                            <label>Pricing</label>
                            <div className="pricing-options">
                                <label className={`pricing-radio-card ${formData.pricingType === 'free' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="pricingType"
                                        value="free"
                                        checked={formData.pricingType === 'free'}
                                        onChange={handleInputChange}
                                    />
                                    Free
                                </label>

                                <label className={`pricing-radio-card ${formData.pricingType === 'paid' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="pricingType"
                                        value="paid"
                                        checked={formData.pricingType === 'paid'}
                                        onChange={handleInputChange}
                                    />
                                    Paid
                                </label>
                            </div>
                        </div>

                        {formData.pricingType === 'paid' && (
                            <div className="form-field full-width">
                                <label>Price (₹) <span className="req">*</span></label>
                                <input
                                    type="number"
                                    className="form-input"
                                    name="price"
                                    value={formData.price || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSave}>
                        {isEdit ? 'Update Batch' : 'Create Batch'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BatchModal;
