const STORAGE_KEYS = {
    STUDENT_BATCHES: 'lms_student_batches',
    USERS: 'lms_mock_users'
};

const getStorage = (key, defaultVal = []) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch {
        return defaultVal;
    }
};

const setStorage = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
};

export const API_BASE_URL_SB = "/api/student-batches";
export const API_BASE_URL_TRANSFER = "/api/student-batch-transfers";
export const API_BASE_URL_USERS = "/api/users";

const MOCK_USERS_DATA = [
    { userId: 101, name: "John Doe", email: "john@example.com", role: "Student" },
    { userId: 102, name: "Sarah Smith", email: "sarah@example.com", role: "Instructor" },
    { userId: 103, name: "Michael Brown", email: "mike@example.com", role: "Admin" },
    { userId: 104, name: "Emma Wilson", email: "emma@example.com", role: "Student" },
    { userId: 105, name: "James Bond", email: "james@agent.com", role: "Instructor" }
];

const getAuthHeader = () => {
    const token = localStorage.getItem("authToken") || import.meta.env.VITE_DEV_AUTH_TOKEN;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const enrollmentService = {
    // ================= STUDENT BATCH (HYBRID: REAL + MOCK FALLBACK) =================

    // Get students in a specific batch
    // Get students in a specific batch
    getStudentsByBatch: async (batchId) => {
        let apiStudents = [];
        try {
            const res = await fetch(`${API_BASE_URL_SB}/batch/${batchId}`, {
                headers: { ...getAuthHeader(), "Cache-Control": "no-cache" }
            });
            if (res.ok) {
                apiStudents = await res.json();
            }
        } catch (error) {
            console.warn("API failed, using local storage fallback for getStudents", error);
        }

        // Merge with Local Storage Fallback
        // This ensures if the API didn't save the POST (but returned 200 OK for GET), we still see the local record.
        const sb = getStorage(STORAGE_KEYS.STUDENT_BATCHES);
        const localStudents = sb.filter(r => String(r.batchId) === String(batchId));

        if (apiStudents.length === 0 && localStudents.length > 0) {
            return localStudents;
        }

        // Deduplicate: Add local students only if they are NOT in API results
        const apiStudentIds = new Set(apiStudents.map(s => String(s.studentId)));
        const uniqueLocal = localStudents.filter(s => !apiStudentIds.has(String(s.studentId)));

        return [...apiStudents, ...uniqueLocal];
    },

    // Add student to a batch (Enroll)
    addStudentToBatch: async (enrollmentData) => {
        try {
            const res = await fetch(`${API_BASE_URL_SB}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
                body: JSON.stringify(enrollmentData),
            });
            if (res.ok) return await res.json();
        } catch (error) {
            console.warn("API failed, using local storage fallback for addStudent", error);
        }

        // Fallback
        const sb = getStorage(STORAGE_KEYS.STUDENT_BATCHES);
        const exists = sb.find(r => String(r.batchId) === String(enrollmentData.batchId) && String(r.studentId) === String(enrollmentData.studentId));
        if (exists) return exists;

        const newRecord = { ...enrollmentData, studentBatchId: Date.now() };
        sb.push(newRecord);
        setStorage(STORAGE_KEYS.STUDENT_BATCHES, sb);
        return newRecord;
    },

    // Remove student from batch (Unenroll)
    removeStudentFromBatch: async (studentBatchId) => {
        try {
            const res = await fetch(`${API_BASE_URL_SB}/${studentBatchId}`, {
                method: "DELETE",
                headers: getAuthHeader(),
            });
            if (res.ok) return true;
        } catch (error) {
            console.warn("API failed, using local storage fallback for removeStudent", error);
        }

        // Fallback
        let sb = getStorage(STORAGE_KEYS.STUDENT_BATCHES);
        sb = sb.filter(r => String(r.studentBatchId) !== String(studentBatchId));
        setStorage(STORAGE_KEYS.STUDENT_BATCHES, sb);
        return true;
    },

    // Get all enrollments (for User List batch info)
    getAllEnrollments: async () => {
        let apiData = [];
        try {
            const res = await fetch(`${API_BASE_URL_SB}`, {
                headers: { ...getAuthHeader(), "Cache-Control": "no-cache" }
            });
            if (res.ok) {
                apiData = await res.json();
            }
        } catch (error) {
            console.warn("API failed for getAllEnrollments, using storage", error);
        }

        const localData = getStorage(STORAGE_KEYS.STUDENT_BATCHES);

        if (apiData.length === 0 && localData.length > 0) return localData;

        // Deduplicate using combination of studentId and batchId
        // This ensures locally added enrollments appear in User List immediately
        const apiKeys = new Set(apiData.map(e => `${e.studentId}-${e.batchId}`));
        const uniqueLocal = localData.filter(e => !apiKeys.has(`${e.studentId}-${e.batchId}`));

        return [...apiData, ...uniqueLocal];
    },

    // ================= TRANSFERS =================

    transferStudent: async (transferData) => {
        try {
            const res = await fetch(`${API_BASE_URL_TRANSFER}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
                body: JSON.stringify(transferData),
            });
            if (res.ok) return await res.json();
        } catch (error) {
            console.warn("API failed, using local storage fallback for transfer", error);
        }

        // Fallback Logic: Just return success, assuming explicit add/remove will handle the move.
        // If we wanted to log, we'd add to a mock log table, but for now we skip.
        console.log("Mock Transfer Logged:", transferData);
        return { success: true, mock: true };
    },

    // ================= USERS =================

    getAllUsers: async () => {
        // Fetch STUDENTS specifically to ensure we get studentId and linked user data
        try {
            const { userService } = await import('../../Users/services/userService');
            const students = await userService.getAllStudents();

            // Map Student Entity structure to flat User structure for BatchBuilder compatibility
            // Student Entity: { studentId: 1, user: { userId: 10, firstName: '...' } }
            // Target: { userId: 1, studentId: 1, name: '...', email: '...', role: 'Student' }

            return students.map(s => ({
                userId: s.user?.userId,
                studentId: s.studentId, // Critical for Enrollments
                firstName: s.user?.firstName,
                lastName: s.user?.lastName,
                email: s.user?.email,
                role: 'Student', // Explicitly Student
                name: `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.trim()
            }));

        } catch (e) {
            console.error("Failed to fetch students via userService", e);
            return [];
        }
    },

    getInstructors: async () => {
        const users = await enrollmentService.getAllUsers();
        return users.filter(u =>
            u.role === 'Instructor' ||
            u.role === 'INSTRUCTOR' ||
            u.role?.name === 'Instructor'
        );
    }
};
