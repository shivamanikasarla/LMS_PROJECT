import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FiArrowLeft, FiUploadCloud, FiInbox, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { sessionService } from './services/sessionService';
import { batchService } from './services/batchService';
import './styles/CreateClass.css';

const CreateClass = () => {
    const { id: batchId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Form state
    const [title, setTitle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [hours, setHours] = useState(1);
    const [minutes, setMinutes] = useState(0);
    const [sessionType, setSessionType] = useState('Online');
    const [meetingLink, setMeetingLink] = useState('');

    // Course ID state
    const [courseId, setCourseId] = useState(null);

    // List state (Real Data)
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    /* ------------------ LOAD CLASSES ------------------ */
    useEffect(() => {
        if (batchId) {
            // Fetch Batch Details to get Course ID
            batchService.getBatchById(batchId)
                .then(data => {
                    if (data && data.courseId) setCourseId(data.courseId);
                })
                .catch(err => console.error("Failed to load batch details", err));

            loadSessions();
        }
    }, [batchId]);

    // Check for edit mode query param
    useEffect(() => {
        const state = location.state?.session;
        if (state) {
            handleEdit(state);
        }
    }, [location.state]);

    const loadSessions = async () => {
        setLoading(true);
        try {
            const data = await sessionService.getSessionsByBatchId(batchId);
            // Sort by date desc
            data.sort((a, b) => new Date(b.startDate + 'T' + b.startTime) - new Date(a.startDate + 'T' + a.startTime));
            setSessions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* ------------------ CREATE / EDIT CLASS ------------------ */
    const handleCreate = async (e) => {
        e.preventDefault();

        if (!title.trim() || !dateTime) {
            alert('Title and Date/Time are required');
            return;
        }

        if (!courseId) {
            alert("Course information is missing. Please try reloading the page.");
            return;
        }

        const dateObj = new Date(dateTime);
        const startDate = dateObj.toISOString().split('T')[0];
        // Send HH:MM:00 for LocalTime compatibility
        const startTime = dateObj.toTimeString().split(' ')[0];
        const durationMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0) || 60;

        const days = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        const sessionData = {
            batchId: Number(batchId),
            courseId: Number(courseId), // Pass courseId strictly
            sessionName: title,
            startDate,
            startTime,
            durationMinutes,
            days, // "Monday", etc.
            sessionType,
            meetingLink,
            status: isEditing ? undefined : "Upcoming"
        };

        try {
            if (isEditing) {
                // Keep existing ID and potentially status
                await sessionService.updateSession(editId, sessionData);
            } else {
                await sessionService.createSession(sessionData);
            }

            resetForm();
            loadSessions();
            // Clear navigation state if we were editing
            if (isEditing) {
                navigate(location.pathname, { replace: true, state: {} });
            }

        } catch (err) {
            console.error("Save failed", err);
            alert("Failed to save session");
        }
    };

    const handleEdit = (session) => {
        setIsEditing(true);
        setEditId(session.sessionId);
        setTitle(session.sessionName);

        // Reconstruct datetime for input
        // session.startDate = "YYYY-MM-DD", session.startTime = "HH:MM"
        // input type datetime-local needs "YYYY-MM-DDTHH:MM"
        if (session.startDate && session.startTime) {
            setDateTime(`${session.startDate}T${session.startTime}`);
        }

        const h = Math.floor((session.durationMinutes || 60) / 60);
        const m = (session.durationMinutes || 60) % 60;
        setHours(h);
        setMinutes(m);
        setSessionType(session.sessionType || 'Online');
        setMeetingLink(session.meetingLink || '');
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setTitle('');
        setDateTime('');
        setHours(1);
        setMinutes(0);
        setSessionType('Online');
        setMeetingLink('');
    };

    // Simple Card Component for Preview
    const PreviewCard = ({ session }) => {
        const getColor = (s) => {
            if (s === 'Running' || s === 'Ongoing') return '#22c55e';
            if (s === 'Upcoming') return '#3b82f6';
            return '#64748b';
        };

        return (
            <div style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                borderLeft: `4px solid ${getColor(session.status)}`,
                marginBottom: '10px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{session.sessionName}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: '#f1f5f9',
                            color: getColor(session.status),
                            fontWeight: 'bold'
                        }}>{session.status || 'Upcoming'}</span>
                        {session.status === 'Upcoming' && (
                            <button
                                onClick={() => handleEdit(session)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#3b82f6',
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                    {session.startDate} {session.startTime} • {session.durationMinutes} mins
                </div>
                {session.meetingLink && (
                    <a href={session.meetingLink} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#3b82f6', display: 'block', marginTop: '4px' }}>
                        Join Link
                    </a>
                )}
            </div>
        );
    };

    return (
        <div className="classes-page">
            <header className="classes-header">
                <button className="link-back" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                </button>
                <h2>Create & Manage Classes</h2>
            </header>

            <div className="create-class-split-layout">
                {/* Left Column: Form */}
                <div className="form-column">
                    <form className="class-form" onSubmit={handleCreate}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{isEditing ? 'Edit Class' : 'Schedule New Class'}</h3>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{ fontSize: '12px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        <label>
                            Class Title *
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g., Intro to React Patterns"
                            />
                        </label>

                        <div className="form-row-split" style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{ flex: 1 }}>
                                Start Date & Time *
                                <input
                                    type="datetime-local"
                                    value={dateTime}
                                    onChange={e => setDateTime(e.target.value)}
                                />
                            </label>

                            <label style={{ flex: 1 }}>
                                Session Type
                                <select value={sessionType} onChange={e => setSessionType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '8px' }}>
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </label>
                        </div>

                        <label>
                            Meeting Link (if Online/Hybrid)
                            <input
                                type="url"
                                value={meetingLink}
                                onChange={e => setMeetingLink(e.target.value)}
                                placeholder="https://zoom.us/..."
                            />
                        </label>

                        <label>Duration</label>
                        <div className="duration-row">
                            <input
                                type="number"
                                min="0"
                                value={hours}
                                onChange={e => setHours(e.target.value)}
                            />
                            <span>Hours</span>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={minutes}
                                onChange={e => setMinutes(e.target.value)}
                            />
                            <span>Minutes</span>
                        </div>

                        <button type="submit" className="btn primary">
                            <FiUploadCloud /> {isEditing ? 'Update Class' : 'Schedule Class'}
                        </button>
                    </form>
                </div>

                {/* Right Column: Preview List */}
                <div className="list-column">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Existing Sessions</h3>
                        <button onClick={loadSessions} className="btn-icon-plain"><FiRefreshCw /></button>
                    </div>

                    <div className="class-list">
                        <AnimatePresence mode='popLayout'>
                            {sessions.length > 0 ? (
                                <div className="class-grid">
                                    {sessions.map(s => (
                                        <motion.div
                                            key={s.sessionId}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <PreviewCard session={s} />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-preview">
                                    <FiInbox />
                                    <h3>No classes scheduled yet.</h3>
                                    <p>Use the form on the left to create your first class session.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateClass;
