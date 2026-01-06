import React from "react";
import {
    FiImage,
    FiInfo,
    FiUsers,
    FiLayers,
    FiMoreVertical,
    FiEdit2,
    FiTrash2,
    FiShare2
} from "react-icons/fi";

const CourseCard = ({
    course,
    index,
    onEdit,
    onDelete,
    onManageContent,
    onViewLearners,
    onShowDetails,
    onShare
}) => {
    return (
        <div className="card shadow-sm h-100">

            {/* Image */}
            {course.img ? (
                <img
                    src={course.img}
                    className="card-img-top"
                    alt={course.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                />
            ) : (
                <div className="d-flex align-items-center justify-content-center bg-light"
                    style={{ height: 160 }}>
                    <FiImage size={36} className="text-secondary" />
                </div>
            )}

            <div className="card-body d-flex flex-column">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-2">

                    <div className="d-flex align-items-center gap-2">
                        <h6 className="mb-0 fw-semibold">{course.name}</h6>

                        {/* Info */}
                        <FiInfo
                            className="text-secondary"
                            title="View Course Details"
                            style={{ cursor: "pointer" }}
                            onClick={() => onShowDetails(course)}
                        />
                    </div>

                    {/* Dropdown */}
                    <div className="dropdown">
                        <button
                            className="btn btn-sm btn-light"
                            data-bs-toggle="dropdown"
                        >
                            <FiMoreVertical />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => onShare(course)}
                                >
                                    <FiShare2 className="me-2" /> Share
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => onEdit(index)}
                                >
                                    <FiEdit2 className="me-2" /> Edit
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={() => onDelete(index)}
                                >
                                    <FiTrash2 className="me-2" /> Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Learners count */}
                <div className="d-flex align-items-center text-muted mb-2">
                    <FiUsers className="me-1" />
                    <small>{course.learnersCount || 0} learners</small>
                </div>

                {/* Description */}
                <p className="text-muted small flex-grow-1">
                    {course.desc?.length > 80
                        ? course.desc.slice(0, 80) + "..."
                        : course.desc}
                </p>

                {/* Actions */}
                <div className="d-flex gap-2 mt-3">
                    <button
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => onManageContent(course.id)}
                    >
                        <FiLayers className="me-1" /> Course Content
                    </button>

                    <button
                        className="btn btn-outline-secondary btn-sm w-100"
                        onClick={() => onViewLearners(course.id)}
                    >
                        <FiUsers className="me-1" /> Learners
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
