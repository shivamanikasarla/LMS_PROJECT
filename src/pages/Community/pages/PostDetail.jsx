import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import communityService from '../../../services/communityService';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';

const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadPost();
    }, [postId]);

    const loadPost = async () => {
        try {
            const data = await communityService.getPostById(postId);
            setPost(data);
        } catch (error) {
            console.error("Failed to load post", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setSubmitting(true);
        try {
            const newComment = await communityService.createComment(postId, { content: commentText });
            setPost(prev => ({
                ...prev,
                comments: [...prev.comments, newComment]
            }));
            setCommentText('');
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-5 text-center">Loading post...</div>;
    if (!post) return <div className="p-5 text-center">Post not found</div>;

    return (
        <div className="post-detail-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} /> Back to discussions
            </button>

            <div className="full-post">
                <div className="post-header">
                    <div className="post-meta">
                        <div className="avatar-placeholder">
                            {post.author?.charAt(0) || '?'}
                        </div>
                        <div className="author-info">
                            <span className="author-name">{post.author}</span>
                            <span className={`author-role role-${post.authorRole?.toLowerCase()}`}>
                                {post.authorRole}
                            </span>
                        </div>
                    </div>
                    <span className="post-time">
                        {new Date(post.timestamp).toLocaleString()}
                    </span>
                </div>

                <h1 className="post-title" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{post.title}</h1>
                <div className="post-content">
                    {post.content}
                </div>

                {post.courseName && (
                    <div className="mt-3 text-muted">
                        <small>Related to: {post.courseName}</small>
                    </div>
                )}
            </div>

            <div className="comments-section">
                <h3 className="comments-header">
                    Responses ({post.comments?.length || 0})
                </h3>

                {post.comments && post.comments.map((comment) => (
                    <div
                        key={comment.id}
                        className={`comment-card ${['Instructor', 'Admin'].includes(comment.authorRole) ? 'instructor-response' : ''}`}
                    >
                        <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>
                            {comment.author.charAt(0)}
                        </div>
                        <div className="comment-content">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <div className="d-flex align-items-center">
                                    <span className="fw-bold me-2">{comment.author}</span>
                                    <span className={`author-role role-${comment.authorRole?.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                                        {comment.authorRole}
                                    </span>

                                    {/* Instructor Answer Badge */}
                                    {['Instructor', 'Admin'].includes(comment.authorRole) && (
                                        <span className="instructor-badge">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            Instructor Answer
                                        </span>
                                    )}
                                </div>
                                <small className="text-muted">{new Date(comment.timestamp).toLocaleDateString()}</small>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                        </div>
                    </div>
                ))}

                <div className="add-comment-box mt-4">
                    <form onSubmit={handleCommentSubmit} className="position-relative">
                        <textarea
                            className="form-control"
                            placeholder="Write a helpful response..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            rows={3}
                            style={{ paddingRight: '50px' }}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary position-absolute bottom-0 end-0 m-2 rounded-circle p-2 d-flex align-items-center justify-content-center"
                            style={{ width: 36, height: 36 }}
                            disabled={submitting || !commentText.trim()}
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
