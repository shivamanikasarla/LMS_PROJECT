import { authFetch } from '../utils/apiUtils';

/**
 * webinarService.js
 * Handles all backend API calls for the Webinar module.
 * Replaces the previous sessionStorage implementation.
 */

const BASE_URL = '/api/webinars';

export const webinarService = {
    /**
     * Fetch all webinars from the backend.
     * Optional: filter by type ('live', 'upcoming', 'recorded')
     */
    getAllWebinars: async (filter = 'all') => {
        try {
            const url = filter === 'all' ? BASE_URL : `${BASE_URL}?type=${filter}`;
            const response = await authFetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch webinars: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('webinarService.getAllWebinars error:', error);
            throw error;
        }
    },

    /**
     * Get a single webinar by ID.
     */
    getWebinarById: async (id) => {
        try {
            const response = await authFetch(`${BASE_URL}/${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch webinar details: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`webinarService.getWebinarById(${id}) error:`, error);
            throw error;
        }
    },

    /**
     * Create a new webinar.
     */
    createWebinar: async (webinarData) => {
        try {
            console.log('webinarService.createWebinar sending payload:', JSON.stringify(webinarData, null, 2));
            const response = await authFetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webinarData),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('webinarService.createWebinar error response:', errorData);
                throw new Error(errorData.message || `Failed to create webinar: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('webinarService.createWebinar error:', error);
            throw error;
        }
    },

    /**
     * Delete a webinar by ID.
     */
    deleteWebinar: async (id) => {
        try {
            const response = await authFetch(`${BASE_URL}/${id}/cancel`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Failed to delete webinar: ${response.statusText}`);
            }
            return true;
        } catch (error) {
            console.error(`webinarService.deleteWebinar(${id}) error:`, error);
            throw error;
        }
    },

    /**
     * Update a webinar (e.g., status changes).
     */
    updateWebinar: async (id, webinarData) => {
        try {
            const response = await authFetch(`${BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webinarData),
            });
            if (!response.ok) {
                throw new Error(`Failed to update webinar: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`webinarService.updateWebinar(${id}) error:`, error);
            throw error;
        }
    }
};
