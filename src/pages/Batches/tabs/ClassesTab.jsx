import React, { useState, useEffect } from 'react';
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
import { sessionService } from '../services/sessionService';
import SessionContentModal from '../components/SessionContentModal';
import '../styles/BatchBuilder.css';

/* ---------------- HELPERS ---------------- */

const getStatus = (session) => {
    // If backend provides status, use it
    if (session.status) return session.status;

    // Fallback logic
    const now = new Date();
    const start = new Date(`${session.startDate}T${session.startTime}`);
    const end = new Date(start.getTime() + (session.durationMinutes || 60) * 60000);

    if (now >= start && now <= end) return 'Running'; // Updated from 'Ongoing' based on entity comment (Upcoming / Running / Completed)
    if (now > end) return 'Completed';
    return 'Upcoming';
};

const getStatusColor = (status) => {
    if (status === 'Running' || status === 'Ongoing') return '#22c55e';
    if (status === 'Upcoming') return '#3b82f6';
    return '#64748b';
};

/* ---------------- CARD COMPONENT ---------------- */

const ClassCard = ({ session, onDelete, onEdit, onViewContent, instructorName }) => {
    const status = getStatus(session);
    // Calculated end time for display
    const getEndTime = () => {
        if (!session.startDate || !session.startTime) return '';
        const start = new Date(`2000-01-01T${session.startTime}`); // Dummy date
        const end = new Date(start.getTime() + (session.durationMinutes || 60) * 60000);
        return end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className={`class-card ${status.includes('Run') ? 'highlighted' : ''}`}>
            <div
                className="class-status-stripe"
                style={{ backgroundColor: getStatusColor(status) }}
            />

            <div className="class-content">
                <div className="class-header">
                    <h4 className="class-title">{session.sessionName}</h4>

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
                            onClick={() => onDelete(session.sessionId)}
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                </div>

                <div className="class-meta">
                    <div className="meta-item">
                        <FiCalendar /> {session.startDate}
                    </div>
                    <div className="meta-item">
                        <FiClock /> {session.startTime} - {getEndTime()} ({session.durationMinutes}m)
                    </div>
                </div>

                <div className="class-footer">
                    <div className="instructor-info">
                        <div className="avatar-mini">
                            {(instructorName || 'I').charAt(0).toUpperCase()}
                        </div>
                        <span>{instructorName || 'Instructor'}</span>
                    </div>

                    {(status === 'Running' || status === 'Ongoing') && (
                        <button className="btn-join" onClick={() => session.meetingLink && window.open(session.meetingLink, '_blank')}>
                            <FiVideo /> Join Now
                        </button>
                    )}

                    {status === 'Completed' && (
                        <button
                            className="btn-view-recording"
                            onClick={() => onViewContent && onViewContent(session)}
                        >
                            <FiPlayCircle /> Class Content
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ---------------- MAIN TAB ---------------- */

const ClassesTab = ({ batchId, instructorName }) => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [filter, setFilter] = useState('upcoming');
    const [loading, setLoading] = useState(true);
    const [activeContentSession, setActiveContentSession] = useState(null);

    useEffect(() => {
        loadSessions();
    }, [batchId]);

    const loadSessions = async () => {
        setLoading(true);
        try {
            const data = await sessionService.getSessionsByBatchId(batchId);
            // Sort by date/time?
            data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            setClasses(data);
        } catch (error) {
            console.error("Failed to load sessions", error);
        } finally {
            setLoading(false);
        }
    };

    /* -------- ACTIONS -------- */
    const handleDeleteClass = async (id) => {
        const ok = window.confirm('Delete this class?');
        if (!ok) return;
        try {
            await sessionService.deleteSession(id);
            setClasses(prev => prev.filter(c => c.sessionId !== id));
        } catch (error) {
            alert("Failed to delete session");
        }
    };

    const handleEditClass = (session) => {
        navigate(`/batches/${batchId}/create-class?edit=${session.sessionId}`, { state: { session } });
    };

    const handleViewContent = (session) => {
        setActiveContentSession(session);
    };

    /* -------- FILTERED DATA -------- */
    const upcoming = classes.filter(
        c => getStatus(c) === 'Upcoming'
    );
    const ongoing = classes.filter(
        c => getStatus(c) === 'Running' || getStatus(c) === 'Ongoing'
    );
    const completed = classes.filter(
        c => getStatus(c) === 'Completed'
    );

    if (loading) return <div>Loading sessions...</div>;

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
                                key={c.sessionId}
                                session={c}
                                onDelete={handleDeleteClass}
                                instructorName={instructorName}
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
                                key={c.sessionId}
                                session={c}
                                onDelete={handleDeleteClass}
                                onEdit={handleEditClass}
                                instructorName={instructorName}
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
                                key={c.sessionId}
                                session={c}
                                onDelete={handleDeleteClass}
                                onViewContent={handleViewContent}
                                instructorName={instructorName}
                            />
                        )) : (
                            <div className="empty-section">No completed classes.</div>
                        )}
                    </div>
                </section>
            )}

            {activeContentSession && (
                <SessionContentModal
                    session={activeContentSession}
                    onClose={() => setActiveContentSession(null)}
                />
            )}
        </div>
    );
};

export default ClassesTab;
