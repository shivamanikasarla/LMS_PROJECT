const API_BASE = '/website/themes';

// Helper to get auth token
const getAuthToken = () => {
    // text token provided by user for localhost:9090
    // return 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzYW50b3NoY2hhdml0aGluaTIwMDRAZ21haWwuY29tIiwidXNlcklkIjoxLCJyb2xlcyI6WyJST0xFX1NVUEVSX0FETUlOIl0sInBlcm1pc3Npb25zIjpbIioiXSwidGVuYW50RGIiOiJsbXNfdGVuYW50XzE3NzA3MDExMDEwODYiLCJpYXQiOjE3NzEzNzE4MDR9.qD0dEJFDkJideiH4gaGJlXjofObGbp7jKh1f5Vz1JlBozzpYmaUFxXeWN3iFSM-W-gSrBKNyHLCss-Gd_vKqog';
    return localStorage.getItem('authToken');
};

// Helper for authenticated requests
const fetchWithAuth = async (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('Fetching:', url);
    console.log('Headers:', headers);

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
    try {
        return text ? JSON.parse(text) : null;
    } catch (e) {
        // If response is not JSON (e.g. plain text success message), return it as is
        return text;
    }
};

export const websiteService = {
    // =========================================
    // Get available theme templates from master DB
    // =========================================
    getAvailableThemes: async () => {
        return fetchWithAuth(`${API_BASE}/templates`);
    },

    // =========================================
    // Apply a theme as DRAFT (creates tenant theme)
    // =========================================
    applyTheme: async (themeId) => {
        return fetchWithAuth(`${API_BASE}/apply/${themeId}`, {
            method: 'POST',
        });
    },

    // =========================================
    // Publish a draft theme to LIVE
    // =========================================
    publishTheme: async (tenantThemeId) => {
        return fetchWithAuth(`${API_BASE}/publish/${tenantThemeId}`, {
            method: 'POST',
        });
    },

    // =========================================
    // Delete a draft theme
    // =========================================
    deleteDraftTheme: async (tenantThemeId) => {
        return fetchWithAuth(`${API_BASE}/${tenantThemeId}`, {
            method: 'DELETE',
        });
    },

    // =========================================
    // Preview specific theme (get structure)
    // =========================================
    getThemeById: async (tenantThemeId) => {
        return fetchWithAuth(`${API_BASE}/${tenantThemeId}`);
    },

    // =========================================
    // Get live theme structure (public endpoint)
    // =========================================
    getLiveTheme: async () => {
        const response = await fetch(`${API_BASE}/live`);
        if (!response.ok) {
            throw new Error('Failed to fetch live theme');
        }
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    },

    // =========================================
    // Update section configuration
    // =========================================
    updateSection: async (sectionId, configJson) => {
        return fetchWithAuth(`${API_BASE}/section/${sectionId}`, {
            method: 'PUT',
            body: JSON.stringify(configJson),
        });
    },

    // =========================================
    // Reset section to default
    // =========================================
    resetSection: async (sectionId) => {
        return fetchWithAuth(`${API_BASE}/section/${sectionId}/reset`, {
            method: 'POST',
        });
    },

    // =========================================
    // Update page title
    // =========================================
    updatePageTitle: async (pageId, title) => {
        return fetchWithAuth(`${API_BASE}/page/${pageId}/title`, {
            method: 'PUT',
            body: JSON.stringify(title),
        });
    },
};
