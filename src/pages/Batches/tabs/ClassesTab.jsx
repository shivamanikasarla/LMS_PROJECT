import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiCalendar,
    FiClock,
    FiVideo,
    FiMoreVertical,
    FiPlus,
    FiCheckCircle,
    FiPlayCircle,
    FiTrash2,
    FiEdit3
} from 'react-icons/fi';
import '../styles/BatchBuilder.css';

/* ---------------- MOCK DATA ---------------- */

const INITIAL_CLASSES = [
    {
        id: 101,
        title: 'Introduction to React Hooks',
        date: '2026-01-05',
        startTime: '10:00',
        endTime: '12:00',
        instructor: 'Sarah Smith'
    },
    {
        id: 102,
        title: 'Advanced Component Patterns',
        date: '2026-01-08',
        startTime: '09:00',
        endTime: '11:00',
        instructor: 'Sarah Smith'
    },
    {
        id: 103,
        title: 'Performance Optimization',
        date: '2026-01-12',
        startTime: '10:00',
        endTime: '12:00',
        instructor: 'Sarah Smith'
    }
];

/* ---------------- HELPERS ---------------- */

const getStatus = (date, startTime, endTime) => {
    const now = new Date();
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (now >= start && now <= end) return 'Ongoing';
    if (now > end) return 'Completed';
    return 'Upcoming';
};

const getStatusColor = (status) => {
    if (status === 'Ongoing') return '#22c55e';
    if (status === 'Upcoming') return '#3b82f6';
    return '#64748b';
};

/* ---------------- CARD COMPONENT ---------------- */

const ClassCard = ({ session, onDelete, onEdit }) => {
    const status = getStatus(session.date, session.startTime, session.endTime);

    return (
        <div className={`class-card ${status === 'Ongoing' ? 'highlighted' : ''}`}>
            <div
                className="class-status-stripe"
                style={{ backgroundColor: getStatusColor(status) }}
            />

            <div className="class-content">
                <div className="class-header">
                    <h4 className="class-title">{session.title}</h4>

                    <div className="card-actions">
                        {status === 'Upcoming' && (
                            <button
                                className="btn-icon-plain"
                                title="Edit class"
                                onClick={() => onEdit && onEdit(session)}
                            >
                                <FiEdit3 />
                            </button>
                        )}
                        <button
                            className="btn-icon-plain"
                            title="Delete class"
                            onClick={() => onDelete(session.id)}
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                </div>

                <div className="class-meta">
                    <div className="meta-item">
                        <FiCalendar /> {session.date}
                    </div>
                    <div className="meta-item">
                        <FiClock /> {session.startTime} - {session.endTime}
                    </div>
                </div>

                <div className="class-footer">
                    <div className="instructor-info">
                        <div className="avatar-mini">
                            {session.instructor.charAt(0)}
                        </div>
                        <span>{session.instructor}</span>
                    </div>

                    {status === 'Ongoing' && (
                        <button className="btn-join">
                            <FiVideo /> Join Now
                        </button>
                    )}

                    {status === 'Completed' && (
                        <button className="btn-view-recording">
                            <FiPlayCircle /> Watch Recording
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ---------------- MAIN TAB ---------------- */

const ClassesTab = ({ batchId }) => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState(INITIAL_CLASSES);
    const [filter, setFilter] = useState('upcoming');

    /* -------- ACTIONS -------- */
    const handleDeleteClass = (id) => {
        const ok = window.confirm('Delete this class?');
        if (!ok) return;

        setClasses(prev => prev.filter(c => c.id !== id));
    };

    const handleEditClass = (session) => {
        // Navigate to Create Class page with edit mode
        // passing session data if needed, or just ID
        navigate(`/batches/${batchId}/create-class?edit=${session.id}`, { state: { session } });
    };

    /* -------- FILTERED DATA -------- */
    const upcoming = classes.filter(
        c => getStatus(c.date, c.startTime, c.endTime) === 'Upcoming'
    );
    const ongoing = classes.filter(
        c => getStatus(c.date, c.startTime, c.endTime) === 'Ongoing'
    );
    const completed = classes.filter(
        c => getStatus(c.date, c.startTime, c.endTime) === 'Completed'
    );

    return (
        <div className="classes-tab-container">
            {/* HEADER */}
            <div className="tab-header-actions">
                <div className="filter-tabs">
                    <button
                        className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`filter-btn ${filter === 'ongoing' ? 'active' : ''}`}
                        onClick={() => setFilter('ongoing')}
                    >
                        Ongoing
                    </button>
                    <button
                        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                    </button>
                </div>

                <button
                    className="btn-primary-add"
                    onClick={() => navigate(`/batches/${batchId}/create-class`)}
                >
                    <FiPlus /> Schedule Class
                </button>
            </div>

            {/* ONGOING */}
            {filter === 'ongoing' && (
                <section className="classes-section">
                    <div className="section-title">
                        <FiPlayCircle />
                        <h4>Happening Now</h4>
                    </div>

                    <div className="classes-grid">
                        {ongoing.length ? ongoing.map(c => (
                            <ClassCard
                                key={c.id}
                                session={c}
                                onDelete={handleDeleteClass}
                            />
                        )) : (
                            <div className="empty-section">No ongoing classes.</div>
                        )}
                    </div>
                </section>
            )}

            {/* UPCOMING */}
            {filter === 'upcoming' && (
                <section className="classes-section">
                    <div className="section-title">
                        <h4>Upcoming Classes</h4>
                    </div>

                    <div className="classes-grid">
                        {upcoming.length ? upcoming.map(c => (
                            <ClassCard
                                key={c.id}
                                session={c}
                                onDelete={handleDeleteClass}
                                onEdit={handleEditClass}
                            />
                        )) : (
                            <div className="empty-section">No upcoming classes.</div>
                        )}
                    </div>
                </section>
            )}

            {/* COMPLETED */}
            {filter === 'completed' && (
                <section className="classes-section">
                    <div className="section-title">
                        <h4>Completed Classes</h4>
                    </div>

                    <div className="classes-grid">
                        {completed.length ? completed.map(c => (
                            <ClassCard
                                key={c.id}
                                session={c}
                                onDelete={handleDeleteClass}
                            />
                        )) : (
                            <div className="empty-section">No completed classes.</div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ClassesTab;
