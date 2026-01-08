import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiUploadCloud, FiInbox } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/CreateClass.css';

// Reusing existing card styles/components structure for consistency,
// but simplifying for this standalone view as requested.

const CreateClass = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Form state
    const [title, setTitle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [hours, setHours] = useState(1);
    const [minutes, setMinutes] = useState(0);
    const [description, setDescription] = useState('');
    const [batchLimit, setBatchLimit] = useState(100);

    // List state (Mocking session storage / local state for this view)
    const [sessions, setSessions] = useState([]);
    const [filter, setFilter] = useState('all');

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    /* ------------------ LOAD CLASSES ------------------ */
    useEffect(() => {
        loadSessions();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const f = params.get('filter');
        if (f && ['UPCOMING', 'ONGOING', 'COMPLETED', 'all'].includes(f)) {
            setFilter(f);
        }
    }, [location.search]);

    const loadSessions = () => {
        // In a real app, this would fetch from API based on batch ID or similar.
        // Doing a simple mock load here or reading from sessionStorage as per your code.
        const now = new Date();
        const data = Object.keys(sessionStorage)
            .filter(k => k.startsWith('class-session-'))
            .map(k => {
                try {
                    const s = JSON.parse(sessionStorage.getItem(k));
                    if (!s?.dateTime) return null;

                    const start = new Date(s.dateTime);
                    const end = new Date(start.getTime() + s.duration * 60000);

                    let status = 'UPCOMING';
                    if (now >= start && now <= end) status = 'ONGOING';
                    else if (now > end) status = 'COMPLETED';

                    // Update status if changed (optional side effect)
                    if (s.status !== status) {
                        s.status = status;
                        // Avoid writing back during render in strict mode ideally, but ok for demo
                    }
                    return { ...s, status };
                } catch (e) {
                    return null;
                }
            })
            .filter(Boolean)
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        setSessions(data);
    };

    /* ------------------ CREATE / EDIT CLASS ------------------ */
    const handleCreate = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Class title required');
            return;
        }

        const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0) || 60;
        const now = new Date();
        const start = dateTime ? new Date(dateTime) : new Date(now.getTime() + 10 * 60000);
        const end = new Date(start.getTime() + totalMinutes * 60000);

        let status = 'UPCOMING';
        if (now >= start && now <= end) status = 'ONGOING';
        else if (now > end) status = 'COMPLETED';

        const sessionData = {
            id: isEditing ? editId : Date.now().toString(),
            title,
            dateTime: start.toISOString(),
            duration: totalMinutes,
            description,
            batchLimit,
            status,
            instructor: "You (Admin)" // Mock
        };

        // Persist
        sessionStorage.setItem(`class-session-${sessionData.id}`, JSON.stringify(sessionData));

        // Reset form
        resetForm();

        // Refresh list
        loadSessions();
    };

    const handleEdit = (session) => {
        setIsEditing(true);
        setEditId(session.id);
        setTitle(session.title);
        // Format dateTime for input[type="datetime-local"] (YYYY-MM-DDTHH:mm)
        const dt = new Date(session.dateTime);
        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
        setDateTime(dt.toISOString().slice(0, 16));

        const h = Math.floor(session.duration / 60);
        const m = session.duration % 60;
        setHours(h);
        setMinutes(m);
        setDescription(session.description || '');
        setBatchLimit(session.batchLimit || 100);
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setTitle('');
        setDateTime('');
        setHours(1);
        setMinutes(0);
        setDescription('');
        setBatchLimit(100);
    };

    const visible = filter === 'all' ? sessions : sessions.filter(s => s.status === filter);

    // Simple Card Component for Preview
    const PreviewCard = ({ session }) => {
        const getColor = (s) => {
            if (s === 'ONGOING') return '#22c55e';
            if (s === 'UPCOMING') return '#3b82f6';
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
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{session.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: '#f1f5f9',
                            color: getColor(session.status),
                            fontWeight: 'bold'
                        }}>{session.status}</span>
                        {session.status === 'UPCOMING' && (
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
                    {new Date(session.dateTime).toLocaleString()} • {session.duration} mins
                </div>
                {session.description && (
                    <p style={{ fontSize: '13px', color: '#334155', marginTop: '8px' }}>{session.description}</p>
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

                        <label>
                            Start Date & Time *
                            <input
                                type="datetime-local"
                                value={dateTime}
                                onChange={e => setDateTime(e.target.value)}
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

                        <label>
                            Description
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="What will be covered in this session?"
                            />
                        </label>

                        <label>
                            Student Limit
                            <input
                                type="number"
                                min="1"
                                value={batchLimit}
                                onChange={e => setBatchLimit(e.target.value)}
                            />
                        </label>

                        <button type="submit" className="btn primary">
                            <FiUploadCloud /> {isEditing ? 'Update Class' : 'Schedule Class'}
                        </button>
                    </form>
                </div>

                {/* Right Column: Preview List */}
                <div className="list-column">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Your Sessions</h3>
                        {/* Adding rudimentary filter toggles if needed, or just showing all sorted */}
                    </div>

                    <div className="class-list">
                        <AnimatePresence mode='popLayout'>
                            {visible.length > 0 ? (
                                <div className="class-grid">
                                    {visible.map(s => (
                                        <motion.div
                                            key={s.id}
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
