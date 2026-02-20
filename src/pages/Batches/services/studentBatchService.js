
const API_BASE_URL = "/api/student-batches";

const getAuthHeader = () => {
    const token = localStorage.getItem("authToken") || import.meta.env.VITE_DEV_AUTH_TOKEN;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const studentBatchService = {
    // ================= ENROLL =================
    enrollStudent: async (enrollmentData) => {
        // enrollmentData should contain:
        // { studentId, studentName, studentEmail, courseId, batchId }

        const res = await fetch(`${API_BASE_URL}/enroll`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify(enrollmentData),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Failed to enroll student");
        }
        return res.json();
    },

    // ================= VIEW BY BATCH =================
    getStudentsByBatch: async (batchId) => {
        const res = await fetch(`${API_BASE_URL}/batch/${batchId}`, {
            headers: { ...getAuthHeader(), "Cache-Control": "no-cache" }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    // ================= VIEW OWN =================
    getStudentBatch: async (studentId) => {
        const res = await fetch(`${API_BASE_URL}/student/${studentId}`, {
            headers: { ...getAuthHeader(), "Cache-Control": "no-cache" }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    // ================= UPDATE =================
    updateEnrollment: async (studentBatchId, updatedData) => {
        const res = await fetch(`${API_BASE_URL}/${studentBatchId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify(updatedData),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }
};
