import React from 'react';
import {
    FiCalendar,
    FiEdit2,
    FiTrash2,
    FiLayers
} from "react-icons/fi";
import { calculateProgress } from '../utils/batchUtils';
import { BATCH_STATUS } from '../constants/batchConstants';

const BatchCard = ({ batch, courses = [], onEdit, onDelete, onManageContent }) => {
    const course = courses.find(c => c.id === batch.courseId);

    const students = batch.students ?? 0;
    const maxStudents = batch.maxStudents ?? 0;
    const progress = maxStudents > 0 ? calculateProgress(students, maxStudents) : 0;

    const isFull = maxStudents > 0 && students >= maxStudents;
    const isCompleted = batch.status === BATCH_STATUS.COMPLETED;

    const getStatusColor = (status) => {
        switch (status) {
            case BATCH_STATUS.UPCOMING:
                return "blue";
            case BATCH_STATUS.ONGOING:
                return "green";
            case BATCH_STATUS.COMPLETED:
                return "gray";
            default:
                return "gray";
        }
    };

    return (
        <div className={`batch-card-premium ${isCompleted ? 'completed' : ''}`}>

            {/* Status */}
            <div className={`status-pill ${getStatusColor(batch.status)}`}>
                {batch.status}
            </div>

            <div className="card-content">
                <h3 className="batch-title">{batch.name}</h3>
                <p className="course-linked">
                    {course?.name || 'Unassigned Course'}
                </p>

                {/* Dates */}
                <div className="info-grid">
                    <div className="info-item">
                        <FiCalendar className="i-icon" />
                        <span>{batch.startDate} – {batch.endDate}</span>
                    </div>
                </div>

                {/* Capacity */}
                {maxStudents > 0 && (
                    <div className="capacity-section">
                        <div className="cap-header">
                            <span className="cap-label">Enrollment</span>
                            <span className={`cap-val ${isFull ? 'text-red' : ''}`}>
                                {students} / {maxStudents}
                            </span>
                        </div>

                        <div className="progress-track">
                            <div
                                className={`progress-fill ${isFull ? 'full' : ''}`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {isFull && <span className="warning-text">Admissions Closed</span>}
                    </div>
                )}
            </div>

            <div className="divider" />

            <div className="card-actions">


                <button
                    className="icon-action-btn manage"
                    onClick={() => onManageContent(batch.id)}
                >
                    <FiLayers /> Manage
                </button>

                <div className="vertical-sep" />

                <button
                    className="icon-action-btn edit"
                    onClick={() => onEdit(batch)}
                    disabled={isCompleted}
                >
                    <FiEdit2 /> Edit
                </button>

                <div className="vertical-sep" />

                <button
                    className="icon-action-btn delete"
                    onClick={() => onDelete(batch.id)}
                >
                    <FiTrash2 /> Delete
                </button>
            </div>
        </div>
    );
};

export default BatchCard;
