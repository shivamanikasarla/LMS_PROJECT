export const TOPIC_BOARDS = [
    {
        id: 'announcements',
        name: 'Announcements',
        description: 'Official updates, news, and important notices.',
        icon: '📢',
        color: '#6366f1', // Indigo
        accessLevel: 'read-only', // Students can only read
        allowedPosters: ['admin', 'instructor'] // Admins and instructors can post announcements
    },
    {
        id: 'doubts',
        name: 'Questions & Doubts',
        description: 'Get help from instructors and peers. Mark answers as resolved.',
        icon: '❓',
        color: '#ef4444', // Red
        accessLevel: 'public',
        allowedPosters: ['all']
    },
    {
        id: 'discussions',
        name: 'Peer Discussions',
        description: 'Collaborate, share ideas, and discuss topics freely.',
        icon: '💬',
        color: '#10b981', // Emerald
        accessLevel: 'public',
        allowedPosters: ['all']
    },
    {
        id: 'resources',
        name: 'Resources & Notes',
        description: 'Share study materials, links, and helpful notes.',
        icon: '📚',
        color: '#f59e0b', // Amber
        accessLevel: 'public',
        allowedPosters: ['all']
    }
];

export const THREAD_STATUS = {
    OPEN: 'open',
    RESOLVED: 'resolved',
    NEEDS_ATTENTION: 'needs_attention'
};
