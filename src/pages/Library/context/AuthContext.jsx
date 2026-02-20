import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../../services/authService';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

/* =========================
   ROLE → PERMISSION MAP
   ========================= */

const ROLE_PERMISSIONS = {
    // Admins have full access
    ADMIN: [
        'VIEW_DASHBOARD',
        'MANAGE_BOOKS', 'VIEW_BOOKS',
        'MANAGE_MEMBERS', 'VIEW_MEMBERS',
        'ISSUE_BOOKS', 'VIEW_ISSUES', 'RETURN_BOOKS',
        'VIEW_REPORTS',
        'SYSTEM_SETTINGS',
        'MANAGE_MARKETING_STRATEGY', // Added for Manager View
        'BATCH_CREATE', 'BATCH_VIEW', 'BATCH_UPDATE', 'BATCH_DELETE', // Batch Management
        'SESSION_CREATE', 'SESSION_VIEW', 'SESSION_UPDATE', 'SESSION_DELETE', // Session Management
        'COURSE_BATCH_STATS_VIEW', // Stats Management
        'STUDENT_BATCH_CREATE', 'STUDENT_BATCH_UPDATE', 'STUDENT_BATCH_DELETE', 'STUDENT_BATCH_VIEW', // Student Enrollment
        'STUDENT_BATCH_TRANSFER_CREATE', 'STUDENT_BATCH_TRANSFER_VIEW' // Transfers
    ],
    MARKETING_MANAGER: [
        'VIEW_MARKETING_DASHBOARD',
        'MANAGE_CAMPAIGNS_APPROVAL',
        'VIEW_GLOBAL_ANALYTICS',
        'CONFIGURE_MARKETING_SETTINGS'
    ],
    MARKETING_EXECUTIVE: [
        'VIEW_MARKETING_WORKSPACE',
        'CREATE_CAMPAIGN',
        'MANAGE_LEADS',
        'VIEW_MY_PERFORMANCE'
    ],
    // Librarians manage operations
    LIBRARIAN: [
        'VIEW_DASHBOARD',
        'MANAGE_BOOKS', 'VIEW_BOOKS',
        'VIEW_MEMBERS',
        'ISSUE_BOOKS', 'VIEW_ISSUES', 'RETURN_BOOKS'
    ],
    // Students/Faculty (MEMBERS) have read-only access to their own data & catalog
    MEMBER: [
        'VIEW_DASHBOARD',
        'VIEW_BOOKS',
        'VIEW_MY_ACCOUNT'
    ],
    STUDENT: [ // Mapping alias for MEMBER
        'VIEW_DASHBOARD',
        'VIEW_BOOKS',
        'VIEW_MY_ACCOUNT'
    ],
    FACULTY: [ // Mapping alias for MEMBER
        'VIEW_DASHBOARD',
        'VIEW_BOOKS',
        'VIEW_MY_ACCOUNT'
    ]
};

/* =========================
   AUTH PROVIDER
   ========================= */

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ---------- RESTORE SESSION ---------- */
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('auth_user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
                localStorage.removeItem('authToken');
                localStorage.removeItem('auth_user');
            }
        }
        setLoading(false);
    }, []);

    /* ---------- LOGIN ---------- */
    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await authService.login(email, password);

            // Handle different response structures
            const token = data.token || data.jwt || (typeof data === 'string' ? data : null);

            if (!token) throw new Error("No token received");

            const userData = {
                email: email,
                role: 'ADMIN', // Defaulting to Admin as requested for this view
                ...data.user // If backend sends user details
            };

            localStorage.setItem('authToken', token);
            localStorage.setItem('auth_user', JSON.stringify(userData));

            setUser(userData);
            return userData;
        } catch (error) {
            console.error("Login Error", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /* ---------- LOGOUT ---------- */
    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_user');
        window.location.href = '/';
    };

    /* ---------- PERMISSION CHECK ---------- */
    const hasPermission = (permission) => {
        if (!user || !user.role) return false;

        // Admin overrides all
        if (user.role === 'ADMIN') return true;

        const perms = ROLE_PERMISSIONS[user.role] || [];
        return perms.includes(permission);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                hasPermission
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
