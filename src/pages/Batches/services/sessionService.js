export const API_BASE_URL = "/api/sessions";
export const API_BASE_URL_CONTENT = "/api/session-contents";
export const API_BASE_URL_UPLOAD = "/api/upload";

const getAuthHeader = () => {
    const token = localStorage.getItem("authToken") || import.meta.env.VITE_DEV_AUTH_TOKEN;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const sessionService = {
    // ================= SESSIONS (REAL BACKEND) =================

    getSessionsByBatchId: async (batchId) => {
        const res = await fetch(`${API_BASE_URL}/batch/${batchId}`, {
            headers: { ...getAuthHeader(), "Cache-Control": "no-cache" }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    getSessionById: async (sessionId) => {
        const res = await fetch(`${API_BASE_URL}/${sessionId}`, {
            headers: { ...getAuthHeader(), "Cache-Control": "no-cache" }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    createSession: async (sessionData) => {
        // MATCHING BACKEND: POST /api/sessions/batch/{batchId}
        const { batchId, ...payload } = sessionData;

        if (!batchId) throw new Error("Batch ID is required to create a session");

        const res = await fetch(`${API_BASE_URL}/batch/${batchId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    updateSession: async (sessionId, sessionData) => {
        // MATCHING BACKEND: PUT /api/sessions/{sessionId}
        const res = await fetch(`${API_BASE_URL}/${sessionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify(sessionData),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    deleteSession: async (sessionId) => {
        const res = await fetch(`${API_BASE_URL}/${sessionId}`, {
            method: "DELETE",
            headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error(await res.text());
        return true;
    },

    // ================= CONTENT (VIDEO/PDF) =================
    getSessionContents: async (sessionId) => {
        const res = await fetch(`${API_BASE_URL_CONTENT}/session/${sessionId}`, {
            headers: { ...getAuthHeader(), "Cache-Control": "no-cache" }
        });
        if (!res.ok) {
            // Fallback: If 404, return empty
            if (res.status === 404) return [];
            throw new Error(await res.text());
        }
        return res.json();
    },

    createSessionContent: async (sessionId, contentData) => {
        const res = await fetch(`${API_BASE_URL_CONTENT}/session/${sessionId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify(contentData),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    deleteSessionContent: async (contentId) => {
        const res = await fetch(`${API_BASE_URL_CONTENT}/${contentId}`, {
            method: "DELETE",
            headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error(await res.text());
        return true;
    },

    // ================= UPLOAD (Multipart PUT) =================
    uploadSessionContentFile: async (contentId, file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE_URL_CONTENT}/${contentId}/upload`, {
            method: "PUT",
            headers: getAuthHeader(),
            body: formData,
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    // ================= PREVIEW (BLOB) =================
    previewSessionContent: async (contentId) => {
        const res = await fetch(`${API_BASE_URL_CONTENT}/preview/${contentId}`, {
            headers: getAuthHeader()
        });
        if (!res.ok) throw new Error(await res.text());
        return res.blob();
    }
};
