const API_BASE = '/website/themes';
const SEO_BASE = '/website/seo';
const HEADER_BASE = '/website/header';
const SETTINGS_BASE = '/website/settings';

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
        const token = getAuthToken();
        const headers = {
            'Content-Type': 'text/plain',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${SEO_BASE}/${tenantThemeId}/robots`, {
            method: 'PUT',
            headers,
            body: robotsContent,
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || `HTTP ${response.status}`);
        }
        return response.text();
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

    // =========================================
    // CUSTOM HEADER — Save (creates a new tenant_header row)
    // Returns the headerId (Long)
    // =========================================
    saveCustomHeader: async (headerConfigJson) => {
        return fetchWithAuth(`${HEADER_BASE}/save`, {
            method: 'POST',
            body: typeof headerConfigJson === 'string' ? headerConfigJson : JSON.stringify(headerConfigJson),
        });
    },

    // =========================================
    // CUSTOM HEADER — List all saved headers
    // =========================================
    listCustomHeaders: async () => {
        return fetchWithAuth(`${HEADER_BASE}/list`);
    },

    // =========================================
    // CUSTOM HEADER — Apply a saved header to a theme
    // =========================================
    applyCustomHeader: async (tenantThemeId, headerId) => {
        return fetchWithAuth(`${HEADER_BASE}/apply?tenantThemeId=${tenantThemeId}&headerId=${headerId}`, {
            method: 'POST',
        });
    },

    // =========================================
    // CUSTOM HEADER — Revert to default header
    // =========================================
    revertHeaderToDefault: async (tenantThemeId) => {
        return fetchWithAuth(`${HEADER_BASE}/revert?tenantThemeId=${tenantThemeId}`, {
            method: 'POST',
        });
    },

    // =========================================
    // CUSTOM HEADER — Export as ZIP (html + css)
    // =========================================
    exportHeader: async (html, css) => {
        const token = getAuthToken();
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${HEADER_BASE}/export`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ html, css }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || `HTTP ${response.status}`);
        }
        return response.blob();
    },

    // =========================================
    // SETTINGS — Get all settings
    // =========================================
    getSettings: async () => {
        return fetchWithAuth(`${SETTINGS_BASE}`);
    },

    // =========================================
    // SETTINGS — Update site name
    // =========================================
    updateSiteName: async (siteName) => {
        const token = getAuthToken();
        const headers = { 'Content-Type': 'text/plain' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${SETTINGS_BASE}/site-name`, {
            method: 'PUT',
            headers,
            body: siteName,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    },

    // =========================================
    // SETTINGS — Upload logo
    // =========================================
    uploadLogo: async (file) => {
        const token = getAuthToken();
        const formData = new FormData();
        formData.append('file', file);

        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${SETTINGS_BASE}/logo`, {
            method: 'POST',
            headers,
            body: formData,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    },

    // =========================================
    // SETTINGS — Upload favicon
    // =========================================
    uploadFavicon: async (file) => {
        const token = getAuthToken();
        const formData = new FormData();
        formData.append('file', file);

        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${SETTINGS_BASE}/favicon`, {
            method: 'POST',
            headers,
            body: formData,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    },

    // =========================================
    // SETTINGS — Update footfall enabled
    // =========================================
    updateFootfall: async (enabled) => {
        return fetchWithAuth(`${SETTINGS_BASE}/footfall`, {
            method: 'PUT',
            body: JSON.stringify(enabled),
        });
    },

    // =========================================
    // SETTINGS — Update store theme
    // =========================================
    updateStoreTheme: async (viewType, storeConfigJson) => {
        return fetchWithAuth(`${SETTINGS_BASE}/store?viewType=${viewType}`, {
            method: 'PUT',
            body: storeConfigJson ? JSON.stringify(storeConfigJson) : undefined,
        });
    },
};
