import axios from 'axios';

const API_BASE_URL = '/api/community';

// FALLBACK TOKEN (Same as feeService for consistency in dev)
const VALID_TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c2VySWQiOjEsInJvbGVOYW1lIjoiUk9MRV9BRE1JTiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwicGVybWlzc2lvbnMiOlsiQ09VUlNFX0NSRUFURSIsIkNPVVJTRV9VUERBVEUiLCJDT1VSU0VfREVMRVRFIiwiQ09VUlNFX1ZJRVciLCJUT1BJQ19DUkVBVEUiLCJUT1BJQ19VUERBVEUiLCJUT1BJQ19ERUxFVEUiLCJUT1BJQ19WSUVXIiwiQ09OVEVOVF9BREQiLCJDT05URU5UX1VQREFURSIsIkNPTlRFTlRfREVMRVRFIiwiQ09OVEVOVF9WSUVXIiwiQ09OVEVOVF9BQ0NFU1MiLCJNQU5BR0VfVVNFUlMiLCJNQU5BR0VfQ09VUlNFUyIsIlZJRVdfQ09OVEVOVCIsIlZJRVdfUFJPRklMRSIsIkJBVENIX0NSRUFURSIsIkJBVENIX1VQREFURSIsIkJBVENIX_ERUxFVEUiLCJTRVNTSU9OX1ZJRVciLCJTRVNTSU9OX0NPTlRFTlRfQ1JFQVRFIiwiU0VTU0lPTl9DT05URU5UX1VQREFURSIsIlNFU1NJT05fQ09OVEVOVF9ERUxFVEUiLCJTRVNTSU9OX0NPTlRFTlRfVklFVyIsIlNUVURFTlRfQkFUQ0hfQ1JFQVRFIiwiU1RVREVOVF9CQVRDSF9VUERBVEUiLCJTVFVERU5UX0JBVENIX0RFTEVURSIsIlNUVURFTlRfQkFUQ0hfVklFVyIsIk1BTkFHRV9QRVJNSVNTSU9OUyIsIlZJRVdfUEVSTUlTU0lPTlMiLCJCT09LX0NSRUFURSIsIkJPT0tfVklFVyIsIkJPT0tfVVBEQVRFIiwiQk9PS19ERUxFVEUiLCJCT09LX0NBVEVHT1JZX0NSRUFURSIsIkJPT0tfQ0FURUdPUllfVklFVyIsIkJPT0tfQ0FURUdPUllfVVBEQVRFIiwiQk9PS19DQVRFR09SWV9ERUxFVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9DUkVBVEUiLCJCT09LX1JFU0VSVkFUSU9OX1ZJRVciLCJCT09LX1JFU0VSVkFUSU9OX0RFTEVURSIsIkxJQlJBUllfU0VUVElOR19DUkVBVEUiLCJMSUJSQVJZX1NFVFRJTkdfVklFVyJdLCJpYXQiOjE3Njk3NTAwODgsImV4cCI6MTgwMTI4NjA4OH0.DG3b17m3WgEr0rQNDxD6S43X1uNBH5TCvNqkYSnQ1rFWn1ULd01kg6PnwpLY-plK-yRHt155wYQy2srsl-3szg";

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

// MOCK DATA GENERATOR (For implementation without backend)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data
let MOCK_POSTS = [
    {
        id: 1,
        title: "Welcome to the new Community Module!",
        content: "We are excited to launch this new space for discussions. Please be respectful and helpful.",
        author: "Admin User",
        authorRole: "Administrator",
        timestamp: new Date().toISOString(),
        category: "announcements",
        comments: []
    },
    {
        id: 2,
        title: "Doubt in React useEffect",
        content: "I'm having trouble understanding the dependency array in useEffect. Can someone explain?",
        author: "John Doe",
        authorRole: "Student",
        courseId: "react-101",
        courseName: "React Mastery",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        category: "doubts",
        comments: [
            {
                id: 101,
                content: "Think of it as 'run this effect only when these variables change'.",
                author: "Sarah Instructor",
                authorRole: "Instructor",
                timestamp: new Date(Date.now() - 43200000).toISOString()
            }
        ]
    }
];

// --- API FUNCTIONS ---

export const getChannels = async () => {
    // In a real app, this might fetch dynamic channels or be static
    return [
        { id: 'announcements', name: 'Announcements', description: 'Official updates from instructors', icon: '📢', roleReq: 'student' },
        { id: 'doubts', name: 'Doubt Resolution', description: 'Ask questions and get answers', icon: '❓', roleReq: 'student' },
        { id: 'discussion', name: 'General Discussion', description: 'Discuss learning topics together', icon: '💬', roleReq: 'student' }
    ];
};

export const getPosts = async (channelId, filters = {}) => {
    // try {
    //     const response = await apiClient.get(`/posts/${channelId}`, { params: filters });
    //     return response.data;
    // } catch (error) {
    //     console.warn("Backend not ready, using mock data");
    await delay(500);
    let posts = MOCK_POSTS.filter(p => p.category === channelId);

    // Apply filters
    if (filters.search) {
        const lowerSearch = filters.search.toLowerCase();
        posts = posts.filter(p =>
            p.title.toLowerCase().includes(lowerSearch) ||
            p.content.toLowerCase().includes(lowerSearch)
        );
    }

    return posts;
    // }
};

export const getPostById = async (postId) => {
    // try {
    //     const response = await apiClient.get(`/post/${postId}`);
    //     return response.data;
    // } catch (error) {
    await delay(300);
    return MOCK_POSTS.find(p => p.id === parseInt(postId));
    // }
};

export const createPost = async (postData) => {
    // try {
    //     const response = await apiClient.post('/posts', postData);
    //     return response.data;
    // } catch (error) {
    await delay(500);
    const newPost = {
        id: MOCK_POSTS.length + 1,
        ...postData,
        author: "Current User", // Replace with actual user info from context
        authorRole: "Student",
        timestamp: new Date().toISOString(),
        comments: []
    };
    MOCK_POSTS.unshift(newPost);
    return newPost;
    // }
};

export const createComment = async (postId, commentData) => {
    // try {
    //     const response = await apiClient.post(`/posts/${postId}/comments`, commentData);
    //     return response.data;
    // } catch (error) {
    await delay(500);
    const post = MOCK_POSTS.find(p => p.id === parseInt(postId));
    if (post) {
        const newComment = {
            id: Math.floor(Math.random() * 10000),
            content: commentData.content,
            author: "Current User",
            authorRole: "Student",
            timestamp: new Date().toISOString()
        };
        post.comments.push(newComment);
        return newComment;
    }
    throw new Error("Post not found");
    // }
};

export default {
    getChannels,
    getPosts,
    getPostById,
    createPost,
    createComment
};
