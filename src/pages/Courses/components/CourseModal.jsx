import React, { useState } from "react";
import { FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";

const CourseModal = ({
    isOpen,
    onClose,
    formData,
    handleInputChange,
    handleImageChange,
    handleSave,
    isEdit,
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-fixed">
            <div className="modal-box">
                {/* Header */}
                <div className="modal-head">
                    <h2>{isEdit ? "Edit Course" : "Add New Course"}</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* BASIC DETAILS */}
                    <div className="form-section">
                        <div className="form-field">
                            <label>Course Name</label>
                            <input
                                type="text"
                                className="form-input"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Advanced React Patterns"
                            />
                        </div>

                        <div className="form-field">
                            <label>Description</label>
                            <textarea
                                className="form-input"
                                rows="3"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-field">
                            <label>What you'll learn</label>
                            <textarea
                                className="form-input"
                                rows="4"
                                name="overview"
                                value={formData.overview}
                                onChange={handleInputChange}
                                placeholder="Enter learning outcomes..."
                            />
                        </div>

                        <div className="form-field">
                            <label>Tools Covered</label>
                            <input
                                type="text"
                                className="form-input"
                                name="toolsCovered"
                                value={formData.toolsCovered || ""}
                                onChange={handleInputChange}
                                placeholder="VS Code, Git, Docker"
                            />
                        </div>

                        <div className="form-field">
                            <label>Cover Image</label>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                {formData.imgPreview && (
                                    <img
                                        src={formData.imgPreview}
                                        alt="Preview"
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 8,
                                            objectFit: "cover",
                                        }}
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ADVANCED TOGGLE */}
                    <button
                        type="button"
                        className="btn-text-acc"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#2563eb",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 10,
                        }}
                    >
                        {showAdvanced ? <FiChevronUp /> : <FiChevronDown />}
                        Advanced Settings
                    </button>

                    {/* ADVANCED SETTINGS */}
                    {showAdvanced && (
                        <div
                            className="advanced-options-grid"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 20,
                                background: "#f8fafc",
                                padding: 16,
                                borderRadius: 12,
                                border: "1px solid #e5e7eb",
                                marginTop: 12,
                            }}
                        >
                            {/* Validity */}
                            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                                <label>Show Course Validity</label>
                                <div style={{ display: "flex", gap: 16 }}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="showValidity"
                                            value="true"
                                            checked={formData.showValidity === true}
                                            onChange={handleInputChange}
                                        />{" "}
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="showValidity"
                                            value="false"
                                            checked={formData.showValidity === false}
                                            onChange={handleInputChange}
                                        />{" "}
                                        No
                                    </label>
                                </div>

                                {formData.showValidity && (
                                    <input
                                        type="text"
                                        className="form-input"
                                        name="validityDuration"
                                        value={formData.validityDuration || ""}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 365 Days"
                                        style={{ marginTop: 8 }}
                                    />
                                )}
                            </div>

                            {/* Platforms */}
                            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                                <label>Accessible On</label>
                                <div style={{ display: "flex", gap: 16 }}>
                                    {["Website", "Android App", "iOS App"].map((platform) => (
                                        <label key={platform}>
                                            <input
                                                type="checkbox"
                                                name="accessPlatforms"
                                                value={platform}
                                                checked={formData.accessPlatforms?.includes(platform)}
                                                onChange={handleInputChange}
                                            />{" "}
                                            {platform}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Offline */}
                            <div className="form-field">
                                <label>Offline Access (Mobile)</label>
                                <div style={{ display: "flex", gap: 16 }}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="allowOffline"
                                            value="true"
                                            checked={formData.allowOffline === true}
                                            onChange={handleInputChange}
                                        />{" "}
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="allowOffline"
                                            value="false"
                                            checked={formData.allowOffline === false}
                                            onChange={handleInputChange}
                                        />{" "}
                                        No
                                    </label>
                                </div>
                            </div>

                            {/* Content Access */}
                            <div className="form-field">
                                <label>Enable Course Content Access</label>
                                <div style={{ display: "flex", gap: 16 }}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="contentAccessEnabled"
                                            value="true"
                                            checked={formData.contentAccessEnabled === true}
                                            onChange={handleInputChange}
                                        />{" "}
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="contentAccessEnabled"
                                            value="false"
                                            checked={formData.contentAccessEnabled === false}
                                            onChange={handleInputChange}
                                        />{" "}
                                        No
                                    </label>
                                </div>
                            </div>

                            {/* Avatar */}
                            <div className="form-field">
                                <label>Show Instructor Avatar</label>
                                <div style={{ display: "flex", gap: 16 }}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="showAvatar"
                                            value="true"
                                            checked={formData.showAvatar === true}
                                            onChange={handleInputChange}
                                        />{" "}
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="showAvatar"
                                            value="false"
                                            checked={formData.showAvatar === false}
                                            onChange={handleInputChange}
                                        />{" "}
                                        No
                                    </label>
                                </div>
                            </div>

                            {/* Bookmark */}
                            <div className="form-field">
                                <label>Allow Bookmarking</label>
                                <div style={{ display: "flex", gap: 16 }}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="allowBookmark"
                                            value="true"
                                            checked={formData.allowBookmark === true}
                                            onChange={handleInputChange}
                                        />{" "}
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="allowBookmark"
                                            value="false"
                                            checked={formData.allowBookmark === false}
                                            onChange={handleInputChange}
                                        />{" "}
                                        No
                                    </label>
                                </div>
                            </div>

                            {/* Certificate */}
                            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                                <label>Certificate on Course Completion</label>
                                <div style={{ display: "flex", gap: 16 }}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="certificateEnabled"
                                            value="true"
                                            checked={formData.certificateEnabled === true}
                                            onChange={handleInputChange}
                                        />{" "}
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="certificateEnabled"
                                            value="false"
                                            checked={formData.certificateEnabled === false}
                                            onChange={handleInputChange}
                                        />{" "}
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="form-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handleSave}>
                        {isEdit ? "Update Course" : "Create Course"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseModal;
