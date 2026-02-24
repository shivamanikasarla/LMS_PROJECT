const API_BASE = '/website/themes';
const SEO_BASE = '/website/seo';

// Helper to get auth token
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Helper for authenticated requests (JSON responses)
const fetchWithAuth = async (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`🌐 fetchWithAuth [${options.method || 'GET'}] ${url}`);
    const response = await fetch(url, {
        ...options,
        headers,
    });
    console.log(`📡 response status: ${response.status} for ${url}`);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP ${response.status}`);
    }

    const text = await response.text();
    try {
        return text ? JSON.parse(text) : null;
    } catch (e) {
        return text;
    }
};

// Helper for authenticated requests returning plain text
const fetchWithAuthText = async (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
        ...options.headers,
    };
    if (!options.headers?.['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP ${response.status}`);
    }

    return response.text();
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

    // =========================================
    // HEADER CONFIG — Save
    // =========================================
    saveHeader: async (tenantThemeId, headerJson) => {
        return fetchWithAuth(`${API_BASE}/${tenantThemeId}/header`, {
            method: 'PUT',
            body: typeof headerJson === 'string' ? headerJson : JSON.stringify(headerJson),
        });
    },

    // =========================================
    // HEADER CONFIG — Get
    // =========================================
    getHeader: async (tenantThemeId) => {
        return fetchWithAuthText(`${API_BASE}/${tenantThemeId}/header`);
    },

    // =========================================
    // FOOTER CONFIG — Save
    // =========================================
    saveFooter: async (tenantThemeId, footerJson) => {
        return fetchWithAuth(`${API_BASE}/${tenantThemeId}/footer`, {
            method: 'PUT',
            body: typeof footerJson === 'string' ? footerJson : JSON.stringify(footerJson),
        });
    },

    // =========================================
    // FOOTER CONFIG — Get
    // =========================================
    getFooter: async (tenantThemeId) => {
        return fetchWithAuthText(`${API_BASE}/${tenantThemeId}/footer`);
    },

    // =========================================
    // SEO CONFIG — Save
    // =========================================
    saveSeo: async (tenantThemeId, seoJson) => {
        return fetchWithAuth(`${SEO_BASE}/${tenantThemeId}`, {
            method: 'PUT',
            body: typeof seoJson === 'string' ? seoJson : JSON.stringify(seoJson),
        });
    },

    // =========================================
    // SEO CONFIG — Get
    // =========================================
    getSeo: async (tenantThemeId) => {
        return fetchWithAuthText(`${SEO_BASE}/${tenantThemeId}`);
    },

    // =========================================
    // ROBOTS.TXT — Save
    // =========================================
    saveRobots: async (tenantThemeId, robotsContent) => {
        return fetchWithAuthText(`${SEO_BASE}/${tenantThemeId}/robots`, {
            method: 'PUT',
            body: JSON.stringify(robotsContent),
        });
    },

    // =========================================
    // ROBOTS.TXT — Get
    // =========================================
    getRobots: async (tenantThemeId) => {
        return fetchWithAuthText(`${SEO_BASE}/${tenantThemeId}/robots`);
    },

    // =========================================
    // SITEMAP — Upload
    // =========================================
    uploadSitemap: async (tenantThemeId, file) => {
        const token = getAuthToken();
        const formData = new FormData();
        formData.append('file', file);

        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${SEO_BASE}/${tenantThemeId}/sitemap`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || `HTTP ${response.status}`);
        }
        return response.text();
    },

    // =========================================
    // SITEMAP — Get (returns blob)
    // =========================================
    getSitemap: async (tenantThemeId) => {
        const token = getAuthToken();
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${SEO_BASE}/${tenantThemeId}/sitemap`, { headers });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.blob();
    },

    // =========================================
    // SITEMAP — Delete
    // =========================================
    deleteSitemap: async (tenantThemeId) => {
        return fetchWithAuth(`${SEO_BASE}/${tenantThemeId}/sitemap`, {
            method: 'DELETE',
        });
    },
};
