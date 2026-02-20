export const API_BASE_URL = "/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("authToken") || import.meta.env.VITE_DEV_AUTH_TOKEN;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const attendanceService = {
    // Get stats for a batch
    getAttendanceStats: async (batchId) => {
        const res = await fetch(`${API_BASE_URL}/attendance/stats/${batchId}`, {
            headers: { ...getAuthHeader(), "Cache-Control": "no-cache" }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    // Get attendance history for a batch
    getAttendanceHistory: async (batchId) => {
        const res = await fetch(`${API_BASE_URL}/attendance/history/${batchId}`, {
            headers: { ...getAuthHeader(), "Cache-Control": "no-cache" }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }
};
