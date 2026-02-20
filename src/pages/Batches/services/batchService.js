import { courseService } from '../../Courses/services/courseService';

export const API_BASE_URL = "/api/batches";

const getAuthHeader = () => {
    const token = localStorage.getItem("authToken") || import.meta.env.VITE_DEV_AUTH_TOKEN;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const batchService = {
    // ================= BATCHES (REAL BACKEND) =================

    // Aggregates batches from all courses since backend doesn't have getAllBatches endpoint
    getAllBatches: async () => {
        try {
            const courses = await courseService.getCourses();
            if (!courses || courses.length === 0) return [];

            const batchPromises = courses.map(c =>
                batchService.getBatchesByCourseId(c.courseId)
                    .catch(() => [])
            );

            const results = await Promise.all(batchPromises);
            return results.flat();
        } catch (error) {
            console.error("Failed to aggregate batches", error);
            return [];
        }
    },

    getBatchesByCourseId: async (courseId) => {
        const res = await fetch(`${API_BASE_URL}/course/${courseId}`, {
            headers: { ...getAuthHeader(), "Cache-Control": "no-cache" }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    // Statistics for a course's batches
    getCourseBatchStats: async (courseId) => {
        // MATCHING BACKEND: GET /api/course-batch-stats/course/{courseId}
        const res = await fetch(`/api/course-batch-stats/course/${courseId}`, {
            headers: { ...getAuthHeader(), "Cache-Control": "no-cache" }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    getBatchById: async (batchId) => {
        const res = await fetch(`${API_BASE_URL}/${batchId}`, {
            headers: { ...getAuthHeader(), "Cache-Control": "no-cache" }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    createBatch: async (batchData) => {
        // MATCHING BACKEND: POST /api/batches/course/{courseId}
        // We include courseId in body as well, just in case backend entity requires it
        const { courseId } = batchData;

        if (!courseId) throw new Error("Course ID is required to create a batch");

        const res = await fetch(`${API_BASE_URL}/course/${courseId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify(batchData),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    updateBatch: async (batchId, batchData) => {
        // MATCHING BACKEND: PUT /api/batches/{batchId}
        const res = await fetch(`${API_BASE_URL}/${batchId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify(batchData),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    deleteBatch: async (batchId) => {
        const res = await fetch(`${API_BASE_URL}/${batchId}`, {
            method: "DELETE",
            headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error(await res.text());
        return true;
    }
};
