import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import communityService from '../../../services/communityService';
import CreatePostModal from '../components/CreatePostModal';
import { mockChannels } from '../constants';
import { Search, Plus, MessageSquare } from 'lucide-react';

const ChannelFeed = () => {
    const { channelId } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUnanswered, setShowUnanswered] = useState(false);

    const currentChannel = mockChannels.find(c => c.id === channelId) || mockChannels[0];

    useEffect(() => {
        loadPosts();
        // Reset filter when changing channel
        setShowUnanswered(false);
    }, [channelId]);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await communityService.getPosts(channelId, { search: searchQuery });
            setPosts(data);
        } catch (error) {
            console.error("Failed to load posts", error);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when search changes (debounce could be added for better perf)
    useEffect(() => {
        const timer = setTimeout(() => {
            loadPosts();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleCreatePost = async (postData) => {
        try {
            const newPost = await communityService.createPost(postData);
            setPosts([newPost, ...posts]);
            setShowModal(false);
        } catch (error) {
            console.error("Failed to create post", error);
        }
    };

    // Derived state for filtered posts
    const displayedPosts = showUnanswered
        ? posts.filter(post => !post.comments || post.comments.length === 0)
        : posts;

    if (loading && posts.length === 0) {
        return <div className="p-5 text-center">Loading discussions...</div>;
    }

    return (
        <>
            <div className="feed-header">
                <div className="feed-title">
                    <h2>{currentChannel.name}</h2>
                    <p>{currentChannel.description}</p>
                </div>

                <div className="feed-filters">
                    {/* Unanswered Filter Toggle */}
                    <button
                        className={`filter-toggle-btn ${showUnanswered ? 'active' : ''}`}
                        onClick={() => setShowUnanswered(!showUnanswered)}
                        title="Show questions with zero responses"
                    >
                        <MessageSquare size={16} />
                        {showUnanswered ? 'All Posts' : 'Unanswered Only'}
                    </button>

                    <div className="position-relative">
                        {/* Simple search input wrapper */}
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button className="create-post-btn" onClick={() => setShowModal(true)}>
                        <Plus size={18} /> New Post
                    </button>
                </div>
            </div>

            <div className="feed-content">
                {displayedPosts.length === 0 ? (
                    <div className="text-center text-muted mt-5">
                        <MessageSquare size={48} className="mb-3 opacity-25" />
                        <p>
                            {showUnanswered
                                ? "Great job! All questions have been answered."
                                : "No posts yet. Be the first to start the conversation!"}
                        </p>
                    </div>
                ) : (
                    displayedPosts.map(post => (
                        <div key={post.id} className="post-card" onClick={() => navigate(`../post/${post.id}`)}>
                            <div className="post-header">
                                <div className="post-meta">
                                    <div className="avatar-placeholder">
                                        {post.author.charAt(0)}
                                    </div>
                                    <div className="author-info">
                                        <span className="author-name">{post.author}</span>
                                        <span className={`author-role role-${post.authorRole.toLowerCase()}`}>
                                            {post.authorRole}
                                        </span>
                                    </div>
                                </div>
                                <span className="post-time">
                                    {new Date(post.timestamp).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="post-title">{post.title}</h3>
                            <p className="post-preview">{post.content}</p>

                            <div className="post-footer">
                                <div className="post-stat">
                                    <MessageSquare size={16} className={(!post.comments || post.comments.length === 0) ? "text-danger" : ""} />
                                    <span className={(!post.comments || post.comments.length === 0) ? "text-danger fw-medium" : ""}>
                                        {post.comments ? post.comments.length : 0} Comments
                                    </span>
                                </div>
                                {post.courseName && (
                                    <div className="post-stat">
                                        <span>📚 {post.courseName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <CreatePostModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleCreatePost}
                channelId={channelId}
            />
        </>
    );
};

export default ChannelFeed;
