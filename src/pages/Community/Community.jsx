import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Hash, ChevronDown, ChevronRight, Settings, Search, Send, Edit2, X, Plus, Bookmark, AtSign, Loader2 } from 'lucide-react';
import './Community.css';
import communityService from '../../services/communityService';

const Community = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [spaces, setSpaces] = useState([]);
    const [channels, setChannels] = useState({}); // spaceId -> channels[]
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [expandedSpaces, setExpandedSpaces] = useState([]);

    const [message, setMessage] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Channel editing/creation state
    const [showEditChannelModal, setShowEditChannelModal] = useState(false);
    const [editingChannel, setEditingChannel] = useState(null);
    const [editChannelName, setEditChannelName] = useState('');
    const [editChannelDescription, setEditChannelDescription] = useState('');
    const [channelAdminOnly, setChannelAdminOnly] = useState(false);

    // Group/Course creation state
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    // Announcement creation state
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');

    // Mentions state
    const [mentionState, setMentionState] = useState({ isOpen: false, query: '', startIndex: -1 });
    const mockUsers = [
        { id: 1, name: 'Santhosh', avatar: 'S' },
        { id: 2, name: 'Admin', avatar: 'A' },
        { id: 3, name: 'Instructor', avatar: 'I' }
    ];

    // Bookmark state
    const [bookmarkedIds, setBookmarkedIds] = useState([]);

    // User Context (Using the user provided Mock for now)
    const currentUser = { id: 1, name: 'Santhosh', role: 'ROLE_SUPER_ADMIN', avatar: 'S' };

    // Fetch Spaces on Mount
    useEffect(() => {
        const fetchSpaces = async () => {
            setLoading(true);
            try {
                const data = await communityService.getSpaces();
                setSpaces(data);
                if (data.length > 0) {
                    setExpandedSpaces([data[0].spaceId]);
                    fetchChannels(data[0].spaceId);
                }
            } catch (err) {
                console.error("Failed to fetch spaces", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSpaces();
        
        // Also fetch bookmarked IDs for consistent UI
        const fetchBookmarks = async () => {
            try {
                const data = await communityService.getBookmarks(currentUser.id);
                setBookmarkedIds(data.map(b => b.threadId));
            } catch (err) {
                console.error("Failed to fetch user bookmarks", err);
            }
        };
        fetchBookmarks();
    }, []);

    // Fetch Channels function
    const fetchChannels = async (spaceId) => {
        try {
            const data = await communityService.getChannels(spaceId);
            setChannels(prev => ({ ...prev, [spaceId]: data }));
        } catch (err) {
            console.error("Failed to fetch channels", err);
        }
    };

    // Main Message Fetching Logic
    useEffect(() => {
        if (!selectedChannel) return;

        const fetchData = async () => {
            setMessages([]);
            setLoading(true);
            try {
                let data = [];
                if (selectedChannel.id === 'bookmarks') {
                    // Fetch bookmarks for current user
                    const bookmarks = await communityService.getBookmarks(currentUser.id);
                    // Since bookmarks probably return Bookmark objects, we need to fetch the threads or map them
                    // For now, assume the backend might return thread details nested or we map them if available
                    data = bookmarks.map(b => b.thread || b); // Fallback to bookmark object if thread not nested
                } else if (selectedChannel.id === 'mentions') {
                    // Fetch mentions for current user
                    data = await communityService.getMentions(currentUser.id);
                } else if (selectedChannel.channelId) {
                    // Fetch regular channel threads
                    data = await communityService.getThreads(selectedChannel.channelId);
                }

                // Format messages consistently
                const formatted = data.map(t => ({
                    id: t.threadId || t.id,
                    author: t.authorName || 'User',
                    role: t.authorRole || 'Member',
                    content: t.content || '',
                    title: t.title || null,
                    timestamp: t.createdAt ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
                    avatar: (t.authorName || 'U').charAt(0),
                    channelId: t.channelId || selectedChannel.channelId
                }));
                setMessages(formatted);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedChannel]);

    const toggleSpace = (spaceId) => {
        if (expandedSpaces.includes(spaceId)) {
            setExpandedSpaces(expandedSpaces.filter(id => id !== spaceId));
        } else {
            setExpandedSpaces([...expandedSpaces, spaceId]);
            if (!channels[spaceId]) {
                fetchChannels(spaceId);
            }
        }
    };

    const handleCreateGroup = async () => {
        if (newGroupName.trim()) {
            try {
                const newSpace = await communityService.createSpace({
                    spaceName: newGroupName.trim(),
                    courseId: "GENERIC"
                });
                setSpaces([...spaces, newSpace]);
                setNewGroupName('');
                setShowCreateGroupModal(false);
            } catch (err) {
                console.error("Failed to create space", err);
            }
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() && selectedChannel && selectedChannel.channelId) {
            try {
                const newThread = await communityService.createThread({
                    channelId: selectedChannel.channelId,
                    title: null,
                    content: message,
                    authorId: currentUser.id,
                    authorName: currentUser.name,
                    authorRole: currentUser.role
                });
                
                // Handle mentions
                const mentions = message.match(/@(\w+)/g);
                if (mentions) {
                    mentions.forEach(async (m) => {
                        const userName = m.substring(1);
                        const user = mockUsers.find(u => u.name.toLowerCase() === userName.toLowerCase());
                        if (user) {
                            await communityService.mentionUser(newThread.threadId, user.id);
                        }
                    });
                }

                setMessages(prev => [...prev, {
                    id: newThread.threadId,
                    author: newThread.authorName,
                    role: newThread.authorRole,
                    content: newThread.content,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatar: newThread.authorName?.charAt(0) || '?',
                    channelId: newThread.channelId
                }]);
                setMessage('');
            } catch (err) {
                console.error("Failed to send message", err);
            }
        }
    };

    const handleCreateAnnouncement = async () => {
        if (announcementTitle.trim() && announcementContent.trim() && selectedChannel?.channelId) {
            try {
                const newThread = await communityService.createThread({
                    channelId: selectedChannel.channelId,
                    title: announcementTitle,
                    content: announcementContent,
                    authorId: currentUser.id,
                    authorName: currentUser.name,
                    authorRole: currentUser.role
                });

                // Handle mentions in announcement
                const mentions = announcementContent.match(/@(\w+)/g);
                if (mentions) {
                    mentions.forEach(async (m) => {
                        const userName = m.substring(1);
                        const user = mockUsers.find(u => u.name.toLowerCase() === userName.toLowerCase());
                        if (user) {
                            await communityService.mentionUser(newThread.threadId, user.id);
                        }
                    });
                }

                setMessages(prev => [...prev, {
                    id: newThread.threadId,
                    author: newThread.authorName,
                    role: newThread.authorRole,
                    content: newThread.content,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatar: newThread.authorName?.charAt(0) || '?',
                    title: newThread.title,
                    channelId: newThread.channelId
                }]);
                setAnnouncementTitle('');
                setAnnouncementContent('');
                setShowAnnouncementModal(false);
            } catch (err) {
                console.error("Failed to post announcement", err);
            }
        }
    };

    const handleSaveChannel = async () => {
        if (editChannelName.trim()) {
            try {
                if (editingChannel?.channelId) {
                    await communityService.updateChannel(editingChannel.channelId, {
                        channelName: editChannelName.trim(),
                        description: editChannelDescription.trim(),
                        adminsOnly: channelAdminOnly
                    });
                } else {
                    await communityService.createChannel({
                        spaceId: editingChannel.spaceId,
                        channelName: editChannelName.trim(),
                        description: editChannelDescription.trim(),
                        adminsOnly: channelAdminOnly
                    });
                }
                fetchChannels(editingChannel.spaceId);
                handleCloseChannelModal();
            } catch (err) {
                console.error("Failed to save channel", err);
            }
        }
    };

    const handleCloseChannelModal = () => {
        setShowEditChannelModal(false);
        setEditingChannel(null);
        setEditChannelName('');
        setEditChannelDescription('');
        setChannelAdminOnly(false);
    };

    const toggleBookmark = async (threadId) => {
        try {
            await communityService.bookmarkItem({ threadId, userId: currentUser.id });
            setBookmarkedIds(prev => 
                prev.includes(threadId) ? prev.filter(id => id !== threadId) : [...prev, threadId]
            );
        } catch (err) {
            console.error("Failed to bookmark", err);
        }
    };

    const handleMessageChange = (e) => {
        const val = e.target.value;
        setMessage(val);
        const lastAt = val.lastIndexOf('@');
        if (lastAt !== -1) {
            const query = val.substring(lastAt + 1);
            if (!query.includes(' ')) {
                setMentionState({ isOpen: true, query, startIndex: lastAt });
                return;
            }
        }
        setMentionState({ isOpen: false, query: '', startIndex: -1 });
    };

    const insertMention = (userName) => {
        const newText = message.substring(0, mentionState.startIndex) + `@${userName} `;
        setMessage(newText);
        setMentionState({ isOpen: false, query: '', startIndex: -1 });
    };

    const renderMessageContent = (content) => {
        if (!content) return null;
        const parts = content.split(/(\s+)/);
        return parts.map((part, index) => {
            if (part.startsWith('@')) {
                return <span key={index} className="mention">{part}</span>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="community-chat-container">
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h2>Community</h2>
                </div>

                <div className="chat-sidebar-content">
                    <div className="sidebar-section">
                        <div className="section-title">For you</div>
                        <div className="course-group">
                            <div 
                                className={`channel-item ${selectedChannel?.id === 'mentions' ? 'active' : ''}`} 
                                onClick={() => { setSelectedChannel({id: 'mentions', name: 'Mentions', description: 'Threads where you were mentioned', isSystem: true}); setShowSettings(false); }}
                            >
                                <AtSign size={16} />
                                <span>Mentions</span>
                            </div>
                            <div 
                                className={`channel-item ${selectedChannel?.id === 'bookmarks' ? 'active' : ''}`} 
                                onClick={() => { setSelectedChannel({id: 'bookmarks', name: 'Bookmarks', description: 'Your saved threads', isSystem: true}); setShowSettings(false); }}
                            >
                                <Bookmark size={16} />
                                <span>Bookmarks</span>
                            </div>
                            <div 
                                className={`channel-item ${showSettings ? 'active' : ''}`} 
                                onClick={() => { setShowSettings(true); setSelectedChannel(null); }}
                            >
                                <Settings size={16} />
                                <span>Community settings</span>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            All Clubs & Spaces
                            <Plus
                                size={16}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowCreateGroupModal(true)}
                                title="Add New Space"
                            />
                        </div>

                        {loading && !selectedChannel && <div className="loading-sidebar"><Loader2 className="animate-spin" size={16} /></div>}

                        {spaces.map(space => (
                            <div key={space.spaceId} className="course-group">
                                <div className="course-header" onClick={() => toggleSpace(space.spaceId)}>
                                    {expandedSpaces.includes(space.spaceId) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    <span>{space.spaceName}</span>
                                </div>

                                {expandedSpaces.includes(space.spaceId) && (
                                    <div className="channels-list">
                                        {channels[space.spaceId]?.map(channel => (
                                            <div
                                                key={channel.channelId}
                                                className={`channel-item ${selectedChannel?.channelId === channel.channelId ? 'active' : ''}`}
                                                onClick={() => {
                                                    setSelectedChannel({ ...channel, spaceId: space.spaceId, spaceName: space.spaceName });
                                                    setShowSettings(false);
                                                }}
                                            >
                                                <Hash size={16} />
                                                <span>{channel.channelName}</span>
                                            </div>
                                        ))}
                                        <div
                                            className="add-channel-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingChannel({ spaceId: space.spaceId, channelId: null });
                                                setShowEditChannelModal(true);
                                            }}
                                        >
                                            <Plus size={14} /> Add new channel
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="chat-main">
                {showSettings ? (
                    <div className="settings-view">
                        <div className="settings-header">
                            <div>
                                <h2>Community settings</h2>
                                <p>Manage your clubs and channels</p>
                            </div>
                        </div>

                        <div className="settings-content">
                            <div className="settings-search">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search spaces..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="settings-courses-list">
                                {spaces.filter(space =>
                                    space.spaceName.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map(space => (
                                    <div key={space.spaceId} className="settings-course-item">
                                        <div className="settings-course-header">
                                            <div className="course-name-section" onClick={() => toggleSpace(space.spaceId)}>
                                                <span>{space.spaceName}</span>
                                                <ChevronDown size={20} className={expandedSpaces.includes(space.spaceId) ? 'expanded' : ''} />
                                            </div>
                                        </div>

                                        {expandedSpaces.includes(space.spaceId) && (
                                            <div className="settings-channels-list">
                                                {channels[space.spaceId]?.map(channel => (
                                                    <div key={channel.channelId} className="settings-channel-item">
                                                        <div className="channel-info">
                                                            <Hash size={16} />
                                                            <span>{channel.channelName}</span>
                                                        </div>
                                                        <Edit2
                                                            size={16}
                                                            className="channel-edit-icon"
                                                            onClick={() => {
                                                                setEditingChannel({ spaceId: space.spaceId, channelId: channel.channelId });
                                                                setEditChannelName(channel.channelName);
                                                                setEditChannelDescription(channel.description);
                                                                setChannelAdminOnly(channel.adminsOnly);
                                                                setShowEditChannelModal(true);
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                                <div className="new-channel-btn" onClick={() => {
                                                    setEditingChannel({ spaceId: space.spaceId, channelId: null });
                                                    setShowEditChannelModal(true);
                                                }}>
                                                    <span><Plus size={16} /> New channel</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : selectedChannel ? (
                    <>
                        <div className="chat-header">
                            <div className="channel-info">
                                <Hash size={20} />
                                <h3>{selectedChannel.channelName || selectedChannel.name}</h3>
                                {selectedChannel.description && <span className="channel-description">{selectedChannel.description}</span>}
                            </div>
                        </div>

                        <div className="messages-area">
                            {loading ? (
                                <div className="loading-state">
                                    <Loader2 className="animate-spin" size={40} />
                                    <p>Loading messages...</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {messages.length === 0 ? (
                                        <motion.div 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                                            className="empty-channel-state"
                                        >
                                            {selectedChannel.id === 'bookmarks' ? (
                                                <><Bookmark size={48} /><h3>No bookmarks yet</h3></>
                                            ) : selectedChannel.id === 'mentions' ? (
                                                <><AtSign size={48} /><h3>No mentions yet</h3></>
                                            ) : (
                                                <><Hash size={48} /><h3>Start the conversation</h3></>
                                            )}
                                        </motion.div>
                                    ) : (
                                        messages.map(msg => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`message-item ${msg.title ? 'announcement-message' : ''} ${msg.author === currentUser.name ? 'my-message' : ''}`}
                                            >
                                                <div className="message-avatar">{msg.title ? '📢' : msg.avatar}</div>
                                                <div className="message-content">
                                                    <div className="message-header">
                                                        <div className="user-meta">
                                                            <span className="message-author">{msg.author}</span>
                                                            <span className="message-role">{msg.role}</span>
                                                            <span className="message-time">{msg.timestamp}</span>
                                                        </div>
                                                        <Bookmark 
                                                            size={16} 
                                                            className={`bookmark-icon ${bookmarkedIds.includes(msg.id) ? 'bookmarked' : ''}`}
                                                            onClick={() => toggleBookmark(msg.id)}
                                                        />
                                                    </div>
                                                    {msg.title && <div className="announcement-title">{msg.title}</div>}
                                                    <div className="message-text">{renderMessageContent(msg.content)}</div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            )}
                        </div>

                        {!selectedChannel.isSystem && (
                            <div className="message-input-area">
                                {selectedChannel.channelName?.toLowerCase().includes('announcement') ? (
                                    <button className="post-announcement-btn" onClick={() => setShowAnnouncementModal(true)}>
                                        📢 Post an Announcement
                                    </button>
                                ) : (
                                    <form onSubmit={handleSendMessage} className="message-form">
                                        {mentionState.isOpen && (
                                            <div className="mention-dropdown">
                                                {mockUsers
                                                    .filter(u => u.name.toLowerCase().includes(mentionState.query.toLowerCase()))
                                                    .map(u => (
                                                        <div key={u.id} className="mention-item" onClick={() => insertMention(u.name)}>
                                                            <div className="mention-avatar">{u.avatar}</div>
                                                            <span>{u.name}</span>
                                                        </div>
                                                ))}
                                            </div>
                                        )}
                                        <input
                                            type="text"
                                            placeholder={`Message #${selectedChannel.channelName}`}
                                            value={message}
                                            onChange={handleMessageChange}
                                        />
                                        <button type="submit" className="send-btn" disabled={!message.trim()}>
                                            <Send size={20} />
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-channel-selected">
                        <Hash size={64} />
                        <h2>Welcome to Community</h2>
                        <p>Select a channel or club from the sidebar to join the discussion</p>
                    </div>
                )}
            </div>

            {/* MODALS */}
            {showEditChannelModal && (
                <div className="modal-overlay" onClick={handleCloseChannelModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingChannel?.channelId ? 'Edit Channel' : 'Create Channel'}</h2>
                            <X size={24} onClick={handleCloseChannelModal} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Channel Name</label>
                                <input type="text" value={editChannelName} onChange={(e) => setEditChannelName(e.target.value)} placeholder="e.g. general" />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={editChannelDescription} onChange={(e) => setEditChannelDescription(e.target.value)} rows={3} placeholder="What is this channel about?" />
                            </div>
                            <div className="form-group-toggle">
                                <label>Admins only can post</label>
                                <input type="checkbox" checked={channelAdminOnly} onChange={(e) => setChannelAdminOnly(e.target.checked)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={handleCloseChannelModal}>Cancel</button>
                            <button className="btn-primary" onClick={handleSaveChannel}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateGroupModal && (
                <div className="modal-overlay" onClick={() => setShowCreateGroupModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Club</h2>
                            <X size={24} onClick={() => setShowCreateGroupModal(false)} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Club Name</label>
                                <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="e.g. Science Club" autoFocus />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowCreateGroupModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleCreateGroup}>Create</button>
                        </div>
                    </div>
                </div>
            )}

            {showAnnouncementModal && (
                <div className="modal-overlay" onClick={() => setShowAnnouncementModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>New Announcement</h2>
                            <X size={24} onClick={() => setShowAnnouncementModal(false)} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Announcement Title</label>
                                <input type="text" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} placeholder="e.g. Welcome Everyone!" />
                            </div>
                            <div className="form-group">
                                <label>Message Content</label>
                                <textarea value={announcementContent} onChange={(e) => setAnnouncementContent(e.target.value)} rows={5} placeholder="Write your announcement..." />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowAnnouncementModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleCreateAnnouncement}>Post Announcement</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
