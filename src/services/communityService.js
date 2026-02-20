import axios from 'axios';
import { TOPIC_BOARDS, THREAD_STATUS } from '../pages/Community/constants';

const API_BASE_URL = '/api/community';

// FALLBACK TOKEN
const VALID_TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c2VySWQiOjEsInJvbGVOYW1lIjoiUk9MRV9BRE1JTiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwicGVybWlzc2lvbnMiOlsiQ09VUlNFX0NSRUFURSIsIkNPVVJTRV9VUERBVEUiLCJDT1VSU0VfREVMRVRFIiwiQ09VUlNFX1ZJRVciLCJUT1BJQ19DUkVBVEUiLCJUT1BJQ19VUERBVEUiLCJUT1BJQ19ERUxFVEUiLCJUT1BJQ19WSUVXIiwiQ09OVEVOVF9BREQiLCJDT05URU5UX1VQREFURSIsIkNPTlRFTlRfREVMRVRFIiwiQ09OVEVOVF9WSUVXIiwiQ09OVEVOVF9BQ0NFU1MiLCJNQU5BR0VfVVNFUlMiLCJNQU5BR0VfQ09VUlNFUyIsIlZJRVdfQ09OVEVOVCIsIlZJRVdfUFJPRklMRSIsIkJBVENIX0NSRUFURSIsIkJBVENIX1VQREFURSIsIkJBVENIX_ERUxFVEUiLCJTRVNTSU9OX1ZJRVciLCJTRVNTSU9OX0NPTlRFTlRfQ1JFQVRFIiwiU1RVREVOVF9CQVRDSF9VUERBVEUiLCJTVFVERU5UX0JBVENIX0RFTEVURSIsIlNUVURFTlRfQkFUQ0hfVklFVyIsIk1BTkFHRV9QRVJNSVNTSU9OUyIsIlZJRVdfUEVSTUlTU0lPTlMiLCJCT09LX0NSRUFURSIsIkJPT0tfVklFVyIsIkJPT0tfVVBEQVRFIiwiQk9PS19ERUxFVEUiLCJCT09LX0NBVEVHT1JZX0NSRUFURSIsIkJPT0tfQ0FURUdPUllfVklFVyIsIkJPT0tfQ0FURUdPUllfVVBEQVRFIiwiQk9PS19DQVRFR09SWV9ERUxFVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9DUkVBVEUiLCJCT09LX1JFU0VSVkFUSU9OX1ZJRVciLCJCT09LX1JFU0VSVkFUSU9OX0RFTEVURSIsIkxJQlJBUllfU0VUVElOR19DUkVBVEUiLCJMSUJSQVJZX1NFVFRJTkdfVklFVyJdLCJpYXQiOjE3Njk3NTAwODgsImV4cCI6MTgwMTI4NjA4OH0.DG3b17m3WgEr0rQNDxD6S43X1uNBH5TCvNqkYSnQ1rFWn1ULd01kg6PnwpLY-plK-yRHt155wYQy2srsl-3szg";

const getAuthToken = () => {
    return localStorage.getItem('authToken') || import.meta.env.VITE_DEV_AUTH_TOKEN || VALID_TOKEN;
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// MOCK DATA GENERATOR
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data - Enhanced for Discussion Hub
let MOCK_THREADS = [
    {
        id: 1,
        title: "Welcome to the Discussion Hub!",
        content: "This is your new space for structured learning discussions. Check out the topic boards!",
        author: "Admin User",
        authorRole: "Administrator",
        timestamp: new Date().toISOString(),
        boardId: "announcements",
        status: THREAD_STATUS.OPEN,
        isPinned: true,
        replies: []
    },
    {
        id: 2,
        title: "Understanding useEffect dependency array",
        content: "I'm confused about when to include functions in the dependency array. Any tips?",
        author: "John Student",
        authorRole: "Student",
        courseId: "react-101",
        courseName: "React Mastery",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        boardId: "doubts",
        status: THREAD_STATUS.RESOLVED,
        isPinned: false,
        replies: [
            {
                id: 101,
                content: "If your effect uses a function that changes on every render, you'll get an infinite loop unless you wrap that function in useCallback.",
                author: "Sarah Instructor",
                authorRole: "Instructor",
                timestamp: new Date(Date.now() - 43200000).toISOString(),
                isVerified: true,
                isAnswer: true
            }
        ]
    },
    {
        id: 3,
        title: "Best resources for advanced CSS animations?",
        content: "Looking for some good tutorials or docs on complex keyframe animations.",
        author: "Mike Design",
        authorRole: "Student",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        boardId: "resources",
        status: THREAD_STATUS.OPEN,
        isPinned: false,
        replies: [
            {
                id: 102,
                content: "Check out Kevin Powell on YouTube, he's great!",
                author: "Jane Peer",
                authorRole: "Student",
                timestamp: new Date(Date.now() - 100000).toISOString(),
                isVerified: false,
                isAnswer: false
            }
        ]
    }
];

// --- API FUNCTIONS ---

export const getBoards = async () => {
    return TOPIC_BOARDS;
};

export const getThreads = async (boardId, filters = {}) => {
    // try {
    //     const response = await apiClient.get(`/threads/${boardId}`, { params: filters });
    //     return response.data;
    // } catch (error) {
    await delay(500);
    let threads = MOCK_THREADS.filter(t => t.boardId === boardId);

    // Apply filters
    if (filters.search) {
        const lowerSearch = filters.search.toLowerCase();
        threads = threads.filter(t =>
            t.title.toLowerCase().includes(lowerSearch) ||
            t.content.toLowerCase().includes(lowerSearch)
        );
    }

    if (filters.status) {
        threads = threads.filter(t => t.status === filters.status);
    }

    if (filters.courseId) {
        threads = threads.filter(t => t.courseId === filters.courseId);
    }

    // Sort: Pinned first, then by date (newest first)
    threads.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return threads;
    // }
};

export const getThreadById = async (threadId) => {
    // try {
    //     const response = await apiClient.get(`/thread/${threadId}`);
    //     return response.data;
    // } catch (error) {
    await delay(300);
    return MOCK_THREADS.find(t => t.id === parseInt(threadId));
    // }
};

export const createThread = async (threadData) => {
    // try {
    //     const response = await apiClient.post('/threads', threadData);
    //     return response.data;
    // } catch (error) {
    await delay(500);
    const newThread = {
        id: MOCK_THREADS.length + 1,
        ...threadData,
        author: "Current User", // Replace with context
        authorRole: "Student", // Replace with context
        timestamp: new Date().toISOString(),
        status: THREAD_STATUS.OPEN,
        isPinned: false,
        replies: []
    };
    MOCK_THREADS.unshift(newThread);
    return newThread;
    // }
};

export const createReply = async (threadId, replyData) => {
    // try {
    //     const response = await apiClient.post(`/threads/${threadId}/replies`, replyData);
    //     return response.data;
    // } catch (error) {
    await delay(500);
    const thread = MOCK_THREADS.find(t => t.id === parseInt(threadId));
    if (thread) {
        const newReply = {
            id: Math.floor(Math.random() * 10000),
            content: replyData.content,
            author: "Current User", // Replace with context
            authorRole: "Instructor", // Replace with context (Simulating instructor for demo)
            timestamp: new Date().toISOString(),
            isVerified: true, // Simulating instructor
            isAnswer: false
        };
        thread.replies.push(newReply);
        return newReply;
    }
    throw new Error("Thread not found");
    // }
};

export const markAsResolved = async (threadId, replyId) => {
    // try {
    //     const response = await apiClient.put(`/threads/${threadId}/resolve`, { replyId });
    //     return response.data;
    // } catch (error) {
    await delay(300);
    const thread = MOCK_THREADS.find(t => t.id === parseInt(threadId));
    if (thread) {
        thread.status = THREAD_STATUS.RESOLVED;
        // Mark specific reply as the answer
        if (replyId) {
            thread.replies.forEach(r => {
                if (r.id === replyId) r.isAnswer = true;
                else r.isAnswer = false;
            });
        }
        return thread;
    }
    throw new Error("Thread not found");
    // }
};

export default {
    getBoards,
    getThreads,
    getThreadById,
    createThread,
    createReply,
    markAsResolved
};
