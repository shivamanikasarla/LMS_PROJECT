import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import communityService from '../../../services/communityService';
import CreateThreadModal from '../components/CreatePostModal';
import { TOPIC_BOARDS, THREAD_STATUS } from '../constants';
import { Search, Plus, MessageSquare, AlertCircle, CheckCircle, Clock, ArrowLeft, BookOpen } from 'lucide-react';

const TopicBoard = () => {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, open, resolved, needs_attention
    const [courseFilter, setCourseFilter] = useState('all'); // For filtering by course
    const [courseStatusFilter, setCourseStatusFilter] = useState({}); // For per-course status filtering
    const [selectedCourse, setSelectedCourse] = useState(null); // For course-based view in doubts

    // Mock current user role - in real app, get from AuthContext
    const currentUserRole = "Admin"; // Change to "Student", "Instructor", or "Admin" to test

    const currentBoard = TOPIC_BOARDS.find(b => b.id === boardId) || TOPIC_BOARDS[0];

    // Extract unique courses from threads for filter dropdown
    const availableCourses = [...new Set(threads.map(t => t.courseName).filter(Boolean))];

    // Check if current user can post to this board
    const canPost = () => {
        const { allowedPosters } = currentBoard;
        if (allowedPosters.includes('all')) return true;
        if (allowedPosters.includes(currentUserRole.toLowerCase())) return true;
        return false;
    };

    useEffect(() => {
        loadThreads();
    }, [boardId, statusFilter, courseFilter]);

    const loadThreads = async () => {
        setLoading(true);
        try {
            const filters = { search: searchQuery };
            if (statusFilter !== 'all') filters.status = statusFilter;
            if (courseFilter !== 'all') filters.courseName = courseFilter;

            const data = await communityService.getThreads(boardId || currentBoard.id, filters);
            setThreads(data);
        } catch (error) {
            console.error("Failed to load threads", error);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when search changes
    useEffect(() => {
        const timer = setTimeout(() => {
            loadThreads();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleCreateThread = async (threadData) => {
        try {
            const newThread = await communityService.createThread({
                ...threadData,
                boardId: boardId || currentBoard.id
            });
            setThreads([newThread, ...threads]);
            setShowModal(false);
        } catch (error) {
            console.error("Failed to create thread", error);
        }
    };

    const getStatusBadge = (status) => {
        // Announcements should not have a status badge
        if (boardId === 'announcements') return null;

        switch (status) {
            case THREAD_STATUS.RESOLVED:
                return (
                    <span className="status-badge resolved">
                        <CheckCircle size={14} /> Resolved
                    </span>
                );
            case THREAD_STATUS.NEEDS_ATTENTION:
                return (
                    <span className="status-badge attention">
                        <AlertCircle size={14} /> Needs Attention
                    </span>
                );
            default:
                return (
                    <span className="status-badge open">
                        <Clock size={14} /> Open
                    </span>
                );
        }
    };

    if (!currentBoard) return <div>Board not found</div>;

    return (
        <div className="board-container">
            <div className="board-header">
                <div className="board-title-section">
                    <h2>{currentBoard.name}</h2>
                    <p>{currentBoard.description}</p>
                </div>

                <div className="board-actions">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search discussions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search size={18} className="search-icon" />
                    </div>

                    {/* Course Filter - Don't show in doubts board (uses course cards instead) */}
                    {boardId !== 'doubts' && boardId === 'doubts' && availableCourses.length > 0 && (
                        <select
                            className="course-filter-dropdown"
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                        >
                            <option value="all">All Courses</option>
                            {availableCourses.map(course => (
                                <option key={course} value={course}>{course}</option>
                            ))}
                        </select>
                    )}

                    {/* Show 'New Question' button only when inside a course in doubts board */}
                    {canPost() && (boardId !== 'doubts' || (boardId === 'doubts' && selectedCourse)) && (
                        <button className="create-thread-btn" onClick={() => setShowModal(true)}>
                            <Plus size={18} />
                            {boardId === 'doubts' ? 'New Question' : boardId === 'announcements' ? 'New Announcement' : 'New Discussion'}
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Buttons - Only show for boards that use status filtering */}
            {boardId !== 'announcements' && boardId !== 'doubts' && (
                <div className="board-filters">
                    <button
                        className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-tab ${statusFilter === THREAD_STATUS.OPEN ? 'active' : ''}`}
                        onClick={() => setStatusFilter(THREAD_STATUS.OPEN)}
                    >
                        Open
                    </button>
                    <button
                        className={`filter-tab ${statusFilter === THREAD_STATUS.RESOLVED ? 'active' : ''}`}
                        onClick={() => setStatusFilter(THREAD_STATUS.RESOLVED)}
                    >
                        Resolved
                    </button>
                </div>
            )}


            <div className="threads-list">
                {loading ? (
                    <div className="loading-state">Loading discussions...</div>
                ) : boardId === 'doubts' ? (
                    // Course-based view for Questions & Doubts
                    selectedCourse ? (
                        // Inside a course - show questions for that course
                        <div className="course-discussion-view">
                            <button className="back-to-courses-btn" onClick={() => setSelectedCourse(null)}>
                                <ArrowLeft size={18} /> Back to Courses
                            </button>
                            <div className="course-header-box">
                                <BookOpen size={32} />
                                <div>
                                    <h2>{selectedCourse}</h2>
                                    <p>Ask questions and discuss topics related to this course</p>
                                </div>
                            </div>
                            <div className="course-questions-list">
                                {threads.filter(t => t.courseName === selectedCourse).length === 0 ? (
                                    <div className="empty-state">
                                        <MessageSquare size={48} />
                                        <p>No questions yet. Be the first to ask!</p>
                                    </div>
                                ) : (
                                    threads.filter(t => t.courseName === selectedCourse).map(thread => (
                                        <div key={thread.id} className={`thread-row-simple ${thread.isPinned ? 'pinned' : ''}`} onClick={() => navigate(`/community/thread/${thread.id}`)}>
                                            <div className="thread-simple-content">
                                                <h3 className="thread-title-simple">
                                                    {thread.isPinned && <span className="pinned-icon">📌</span>}
                                                    {thread.title}
                                                </h3>
                                                <p className="thread-description">{thread.content.substring(0, 150)}...</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        // Course selection view
                        availableCourses.length === 0 ? (
                            <div className="empty-state">
                                <BookOpen size={48} />
                                <p>No courses available yet.</p>
                            </div>
                        ) : (
                            <div className="courses-grid">
                                {availableCourses.map(course => {
                                    const courseThreadsCount = threads.filter(t => t.courseName === course).length;
                                    return (
                                        <div key={course} className="course-card" onClick={() => setSelectedCourse(course)}>
                                            <div className="course-card-icon">
                                                <BookOpen size={32} />
                                            </div>
                                            <div className="course-card-content">
                                                <h3>{course}</h3>
                                                <p className="course-stats">
                                                    <MessageSquare size={16} />
                                                    {courseThreadsCount} {courseThreadsCount === 1 ? 'question' : 'questions'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )
                ) : threads.length === 0 ? (
                    <div className="empty-state">
                        <MessageSquare size={48} />
                        <p>No discussions found in this board.</p>
                        {statusFilter !== 'all' && <button className="btn-link" onClick={() => setStatusFilter('all')}>Clear Filters</button>}
                    </div>
                ) : (
                    threads.map(thread => (
                        <div key={thread.id} className={`thread-row ${thread.isPinned ? 'pinned' : ''}`} onClick={() => navigate(`/community/thread/${thread.id}`)}>
                            <div className="thread-status">
                                {getStatusBadge(thread.status)}
                            </div>
                            <div className="thread-main">
                                <h3 className="thread-title">
                                    {thread.isPinned && <span className="pinned-badge">Pinned</span>}
                                    {thread.title}
                                </h3>
                                <p className="thread-preview">{thread.content.substring(0, 120)}...</p>
                                <div className="thread-meta">
                                    <span className="author">By {thread.author}</span>
                                    <span className="separator">•</span>
                                    <span className="date">{new Date(thread.timestamp).toLocaleDateString()}</span>
                                    {thread.courseName && (
                                        <>
                                            <span className="separator">•</span>
                                            <span className="course-tag">{thread.courseName}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="thread-stats">
                                <div className="stat-item">
                                    <MessageSquare size={16} />
                                    <span>{thread.replies ? thread.replies.length : 0}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <CreateThreadModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleCreateThread}
                boardId={boardId}
                defaultCourse={selectedCourse}
            />
        </div>
    );
};

export default TopicBoard;
