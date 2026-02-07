import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, ChevronDown, ChevronRight, Settings, Search, Send, Edit2, X } from 'lucide-react';
import './Community.css';

const Community = () => {
    const navigate = useNavigate();
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [expandedCourses, setExpandedCourses] = useState(['react-course']); // Track which courses are expanded
    const [message, setMessage] = useState('');
    const [showSettings, setShowSettings] = useState(false); // Settings view toggle
    const [settingsExpandedCourses, setSettingsExpandedCourses] = useState([]); // Track expanded courses in settings
    const [searchQuery, setSearchQuery] = useState('');
    const [editingCourse, setEditingCourse] = useState(null); // Track which course is being edited
    const [editCourseName, setEditCourseName] = useState(''); // Store the editing course name

    // Channel editing state
    const [showEditChannelModal, setShowEditChannelModal] = useState(false);
    const [editingChannel, setEditingChannel] = useState(null);
    const [editChannelName, setEditChannelName] = useState('');
    const [editChannelDescription, setEditChannelDescription] = useState('');
    const [channelAdminOnly, setChannelAdminOnly] = useState(false);

    // Mock data - courses as "clubs" with channels
    const [courses, setCourses] = useState([
        {
            id: 'react-course',
            name: 'React Course',
            channels: [
                { id: 'announcements', name: 'announcements', description: 'Course updates' },
                { id: 'discussions', name: 'discussions', description: 'General discussions' },
                { id: 'question-answer', name: 'question-answer', description: 'Ask questions' }
            ]
        },
        {
            id: 'python-basics',
            name: 'Python Basics',
            channels: [
                { id: 'announcements', name: 'announcements', description: 'Course updates' },
                { id: 'discussions', name: 'discussions', description: 'General discussions' },
                { id: 'question-answer', name: 'question-answer', description: 'Ask questions' }
            ]
        },
        {
            id: 'nodejs-advanced',
            name: 'Node.js Advanced',
            channels: [
                { id: 'announcements', name: 'announcements', description: 'Course updates' },
                { id: 'discussions', name: 'discussions', description: 'General discussions' },
                { id: 'question-answer', name: 'question-answer', description: 'Ask questions' }
            ]
        }
    ]);

    // Mock messages
    const [messages, setMessages] = useState([

        {
            id: 3,
            author: 'Admin User',
            role: 'Admin',
            content: 'The new React course module has been released! Check it out.',
            timestamp: '09:00 AM',
            avatar: 'AD',
            title: 'New Content Release', // Example announcement
            channelId: 'announcements',
            courseId: 'react-course' // Assuming this belongs to announcements in React Course
        }
    ]);

    // Announcement creation state
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');


    const toggleCourse = (courseId) => {
        if (expandedCourses.includes(courseId)) {
            setExpandedCourses(expandedCourses.filter(id => id !== courseId));
        } else {
            setExpandedCourses([...expandedCourses, courseId]);
        }
    };

    const toggleSettingsCourse = (courseId) => {
        if (settingsExpandedCourses.includes(courseId)) {
            setSettingsExpandedCourses(settingsExpandedCourses.filter(id => id !== courseId));
        } else {
            setSettingsExpandedCourses([...settingsExpandedCourses, courseId]);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && selectedChannel) {
            setMessages([...messages, {
                id: messages.length + 1,
                author: 'John Doe', // Assume current user
                role: 'Student',
                content: message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: 'JD',
                title: null,
                channelId: selectedChannel.id,
                courseId: selectedChannel.courseId
            }]);
            setMessage('');
        }
    };

    const handleCreateAnnouncement = () => {
        if (announcementTitle.trim() && announcementContent.trim() && selectedChannel) {
            setMessages([...messages, {
                id: messages.length + 1,
                author: 'John Doe', // Assume admin for this demo
                role: 'Admin',
                content: announcementContent,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: 'JD',
                title: announcementTitle,
                channelId: selectedChannel.id,
                courseId: selectedChannel.courseId
            }]);
            setAnnouncementTitle('');
            setAnnouncementContent('');
            setShowAnnouncementModal(false);
        }
    };

    const handleEditCourse = (courseId, currentName) => {
        setEditingCourse(courseId);
        setEditCourseName(currentName);
    };

    const handleSaveCourseName = (courseId) => {
        if (editCourseName.trim()) {
            setCourses(courses.map(course =>
                course.id === courseId
                    ? { ...course, name: editCourseName.trim() }
                    : course
            ));
        }
        setEditingCourse(null);
        setEditCourseName('');
    };

    const handleCancelEdit = () => {
        setEditingCourse(null);
        setEditCourseName('');
    };

    const handleEditChannel = (courseId, channel) => {
        setEditingChannel({ courseId, channelId: channel.id });
        setEditChannelName(channel.name);
        setEditChannelDescription(channel.description);
        setChannelAdminOnly(channel.id === 'announcements'); // Announcements are admin-only by default
        setShowEditChannelModal(true);
    };

    const handleSaveChannel = () => {
        if (editChannelName.trim()) {
            setCourses(courses.map(course => {
                if (course.id === editingChannel.courseId) {
                    return {
                        ...course,
                        channels: course.channels.map(ch =>
                            ch.id === editingChannel.channelId
                                ? { ...ch, name: editChannelName.trim(), description: editChannelDescription.trim() }
                                : ch
                        )
                    };
                }
                return course;
            }));
        }
        handleCloseChannelModal();
    };

    const handleCloseChannelModal = () => {
        setShowEditChannelModal(false);
        setEditingChannel(null);
        setEditChannelName('');
        setEditChannelDescription('');
        setChannelAdminOnly(false);
    };

    return (
        <div className="community-chat-container">
            {/* Sidebar */}
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h2>Community</h2>
                    <Settings size={20} className="settings-icon" onClick={() => setShowSettings(!showSettings)} />
                </div>

                <div className="chat-sidebar-content">
                    {/* All Channels Section */}
                    <div className="sidebar-section">
                        <div className="section-title">All channels</div>

                        {courses.map(course => (
                            <div key={course.id} className="course-group">
                                <div className="course-header" onClick={() => toggleCourse(course.id)}>
                                    {expandedCourses.includes(course.id) ? (
                                        <ChevronDown size={16} />
                                    ) : (
                                        <ChevronRight size={16} />
                                    )}
                                    <span>{course.name}</span>
                                </div>

                                {expandedCourses.includes(course.id) && (
                                    <div className="channels-list">
                                        {course.channels.map(channel => (
                                            <div
                                                key={channel.id}
                                                className={`channel-item ${selectedChannel?.id === channel.id && selectedChannel?.courseId === course.id ? 'active' : ''}`}
                                                onClick={() => {
                                                    setSelectedChannel({ ...channel, courseId: course.id, courseName: course.name });
                                                    setShowSettings(false); // Close settings when channel is selected
                                                }}
                                            >
                                                <Hash size={16} />
                                                <span>{channel.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="chat-main">
                {showSettings ? (
                    /* Settings View */
                    <div className="settings-view">
                        <div className="settings-header">
                            <div>
                                <h2>Community settings</h2>
                                <p>Edit your club and channel settings</p>
                            </div>
                        </div>

                        <div className="settings-content">
                            <div className="settings-search">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search for a club"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="settings-courses-list">
                                {courses.filter(course =>
                                    course.name.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map(course => (
                                    <div key={course.id} className="settings-course-item">
                                        <div className="settings-course-header">
                                            <div className="course-name-section" onClick={() => toggleSettingsCourse(course.id)}>
                                                {editingCourse === course.id ? (
                                                    <input
                                                        type="text"
                                                        className="course-name-input"
                                                        value={editCourseName}
                                                        onChange={(e) => setEditCourseName(e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span>{course.name}</span>
                                                )}
                                                <ChevronDown
                                                    size={20}
                                                    className={settingsExpandedCourses.includes(course.id) ? 'expanded' : ''}
                                                />
                                            </div>
                                            <div className="course-actions">
                                                {editingCourse === course.id ? (
                                                    <>
                                                        <button
                                                            className="save-btn"
                                                            onClick={() => handleSaveCourseName(course.id)}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="cancel-btn"
                                                            onClick={handleCancelEdit}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <Edit2
                                                        size={18}
                                                        className="edit-icon"
                                                        onClick={() => handleEditCourse(course.id, course.name)}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {settingsExpandedCourses.includes(course.id) && (
                                            <div className="settings-channels-list">
                                                {course.channels.map(channel => (
                                                    <div key={channel.id} className="settings-channel-item">
                                                        <div className="channel-info">
                                                            <Hash size={16} />
                                                            <span>{channel.name}</span>
                                                        </div>
                                                        <Edit2
                                                            size={16}
                                                            className="channel-edit-icon"
                                                            onClick={() => handleEditChannel(course.id, channel)}
                                                        />
                                                    </div>
                                                ))}
                                                <div className="new-channel-btn">
                                                    <span>+ New channel</span>
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
                        {/* Channel Header */}
                        <div className="chat-header">
                            <div className="channel-info">
                                <Hash size={20} />
                                <h3>{selectedChannel.name}</h3>
                                <span className="channel-description">{selectedChannel.description}</span>
                            </div>
                            <div className="chat-actions">
                                <Search size={20} />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="messages-area">
                            {messages.filter(msg => msg.channelId === selectedChannel.id && msg.courseId === selectedChannel.courseId).map(msg => (
                                <div key={msg.id} className={`message-item ${msg.title ? 'announcement-message' : ''}`}>
                                    <div className="message-avatar">{msg.title ? '📢' : msg.avatar}</div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="message-author">{msg.author}</span>
                                            <span className="message-role">{msg.role}</span>
                                            <span className="message-time">{msg.timestamp}</span>
                                        </div>
                                        {msg.title && <div className="announcement-title">{msg.title}</div>}
                                        <div className="message-text">{msg.content}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="message-input-area">
                            {selectedChannel.id === 'announcements' ? (
                                <button className="post-announcement-btn" onClick={() => setShowAnnouncementModal(true)}>
                                    📢 Post an Announcement
                                </button>
                            ) : (
                                <form onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        placeholder={`Message #${selectedChannel.name}`}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <button type="submit" className="send-btn">
                                        <Send size={20} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="no-channel-selected">
                        <Hash size={64} />
                        <h2>Welcome to Community</h2>
                        <p>Select a channel from the sidebar to start chatting</p>
                    </div>
                )}
            </div>

            {/* Edit Channel Modal */}
            {showEditChannelModal && (
                <div className="modal-overlay" onClick={handleCloseChannelModal}>
                    <div className="modal-content edit-channel-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit #{editChannelName}</h2>
                            <X size={24} className="close-icon" onClick={handleCloseChannelModal} />
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Channel name</label>
                                <input
                                    type="text"
                                    className="channel-name-input-modal"
                                    value={`#${editChannelName}`}
                                    onChange={(e) => setEditChannelName(e.target.value.replace('#', ''))}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="channel-description-textarea"
                                    value={editChannelDescription}
                                    onChange={(e) => setEditChannelDescription(e.target.value)}
                                    rows={4}
                                    placeholder="Enter channel description..."
                                />
                            </div>

                            <div className="form-group-toggle">
                                <span>Allow only admins to send messages</span>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={channelAdminOnly}
                                        onChange={(e) => setChannelAdminOnly(e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-cancel-btn" onClick={handleCloseChannelModal}>
                                Cancel
                            </button>
                            <button className="modal-save-btn" onClick={handleSaveChannel}>
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Announcement Modal */}
            {showAnnouncementModal && (
                <div className="modal-overlay" onClick={() => setShowAnnouncementModal(false)}>
                    <div className="modal-content announcement-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📢 New Announcement</h2>
                            <X size={24} className="close-icon" onClick={() => setShowAnnouncementModal(false)} />
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="channel-name-input-modal"
                                    value={announcementTitle}
                                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                                    placeholder="Announcement Title"
                                />
                            </div>

                            <div className="form-group">
                                <label>Content</label>
                                <textarea
                                    className="channel-description-textarea"
                                    value={announcementContent}
                                    onChange={(e) => setAnnouncementContent(e.target.value)}
                                    rows={6}
                                    placeholder="Write your announcement here..."
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-cancel-btn" onClick={() => setShowAnnouncementModal(false)}>
                                Cancel
                            </button>
                            <button className="modal-save-btn" onClick={handleCreateAnnouncement}>
                                Post Announcement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
