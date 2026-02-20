import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import communityService from '../../../services/communityService';
import { TOPIC_BOARDS, THREAD_STATUS } from '../constants';
import { ArrowLeft, MessageSquare, Send, CheckCircle, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

const ThreadDetail = () => {
    const { threadId } = useParams();
    const navigate = useNavigate();
    const [thread, setThread] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Mock current user role - in real app get from AuthContext
    const currentUserRole = "Instructor";

    useEffect(() => {
        loadThread();
    }, [threadId]);

    const loadThread = async () => {
        try {
            const data = await communityService.getThreadById(threadId);
            setThread(data);
        } catch (error) {
            console.error("Failed to load thread", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setSubmitting(true);
        try {
            const newReply = await communityService.createReply(threadId, { content: replyText });
            setThread(prev => ({
                ...prev,
                replies: [...prev.replies, newReply]
            }));
            setReplyText('');
        } catch (error) {
            console.error("Failed to post reply", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleMarkResolved = async (replyId) => {
        try {
            const updatedThread = await communityService.markAsResolved(threadId, replyId);
            setThread(updatedThread);
        } catch (error) {
            console.error("Failed to mark resolved", error);
        }
    };

    if (loading) return <div className="p-5 text-center">Loading discussion...</div>;
    if (!thread) return <div className="p-5 text-center">Discussion not found</div>;

    const board = TOPIC_BOARDS.find(b => b.id === thread.boardId) || {};

    return (
        <div className="thread-detail-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} /> Back to {board.name || 'Board'}
            </button>

            <div className={`thread-main-card status-${thread.status}`}>
                <div className="thread-header">
                    <div className="thread-meta-row">
                        <span className={`status-badge ${thread.status}`}>
                            {thread.status === THREAD_STATUS.RESOLVED && <><CheckCircle size={14} /> Resolved</>}
                            {thread.status === THREAD_STATUS.OPEN && <><Clock size={14} /> Open</>}
                            {thread.status === THREAD_STATUS.NEEDS_ATTENTION && <><AlertCircle size={14} /> Needs Attention</>}
                        </span>
                        <span className="thread-date">{new Date(thread.timestamp).toLocaleString()}</span>
                    </div>
                </div>

                <h1 className="thread-title">{thread.title}</h1>

                <div className="author-block">
                    <div className="avatar-placeholder">{thread.author?.charAt(0)}</div>
                    <div className="author-info">
                        <span className="author-name">{thread.author}</span>
                        <span className={`author-role role-${thread.authorRole?.toLowerCase()}`}>{thread.authorRole}</span>
                    </div>
                </div>

                <div className="thread-content">
                    {thread.content}
                </div>

                {thread.courseName && (
                    <div className="related-course">
                        <span>📚 Related to: <strong>{thread.courseName}</strong></span>
                    </div>
                )}
            </div>

            {/* Only show replies section if NOT an announcement */}
            {thread.boardId !== 'announcements' && (
                <div className="replies-section">
                    <h3 className="section-title">
                        {thread.replies?.length || 0} Replies
                    </h3>

                    <div className="replies-list">
                        {thread.replies && thread.replies.map((reply) => (
                            <div
                                key={reply.id}
                                className={`reply-card ${reply.isAnswer ? 'accepted-answer' : ''} ${reply.isVerified ? 'verified-reply' : ''}`}
                            >
                                {reply.isAnswer && (
                                    <div className="answer-badge">
                                        <CheckCircle size={16} /> Accepted Answer
                                    </div>
                                )}

                                <div className="reply-header">
                                    <div className="author-block sm">
                                        <div className="avatar-placeholder sm">{reply.author.charAt(0)}</div>
                                        <div className="author-info">
                                            <span className="author-name">
                                                {reply.author}
                                                {reply.isVerified && <ShieldCheck size={14} className="verified-icon" title="Verified Instructor" />}
                                            </span>
                                            <span className={`author-role role-${reply.authorRole?.toLowerCase()}`}>{reply.authorRole}</span>
                                        </div>
                                    </div>
                                    <span className="reply-date">{new Date(reply.timestamp).toLocaleDateString()}</span>
                                </div>

                                <div className="reply-content">
                                    {reply.content}
                                </div>

                                {/* Mark as Solution Button (Only for Instructors/Admins or Thread Author if open) */}
                                {thread.status !== THREAD_STATUS.RESOLVED && (currentUserRole === 'Instructor' || currentUserRole === 'Admin') && (
                                    <button
                                        className="mark-solution-btn"
                                        onClick={() => handleMarkResolved(reply.id)}
                                    >
                                        <CheckCircle size={14} /> Mark as Solution
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="reply-input-area">
                        <form onSubmit={handleReplySubmit}>
                            <textarea
                                className="reply-textarea"
                                placeholder="Type your reply here..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={4}
                            />
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="submit-reply-btn"
                                    disabled={submitting || !replyText.trim()}
                                >
                                    <Send size={16} /> Post Reply
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThreadDetail;
