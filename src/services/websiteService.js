import axios from 'axios';

const API_BASE = '/website/themes';
const SEO_BASE = '/website/seo';
const HEADER_BASE = '/website/header';
const SETTINGS_BASE = '/website/settings';

// Helper to get auth token
const VALID_TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c2VySWQiOjEsInJvbGVOYW1lIjoiUk9MRV9BRE1JTiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwicGVybWlzc2lvbnMiOlsiQ09VUlNFX0NSRUFURSIsIkNPVVJTRV9VUERBVEUiLCJDT1VSU0VfREVMRVRFIiwiQ09VUlNFX1ZJRVciLCJUT1BJQ19DUkVBVEUiLCJUT1BJQ19VUERBVEUiLCJUT1BJQ19ERUxFVEUiLCJUT1BJQ19WSUVXIiwiQ09OVEVOVF9BREQiLCJDT05URU5UX1VQREFURSIsIkNPTlRFTlRfREVMRVRFIiwiQ09OVEVOVF9WSUVXIiwiQ09OVEVOVF9BQ0NFU1MiLCJNQU5BR0VfVVNFUlMiLCJNQU5BR0VfQ09VUlNFUyIsIlZJRVdfQ09OVEVOVCIsIlZJRVdfUFJPRklMRSIsIkJBVENIX0NSRUFURSIsIkJBVENIX1VQREFURSIsIkJBVENIX0RFTEVURSIsIkJBVENIX1ZJRVciLCJTRVNTSU9OX0NSRUFURSIsIlNFU1NJT05fVVBEQVRFIiwiU0VTU0lPTl9ERUxFVEUiLCJTRVNTSU9OX1ZJRVciLCJTRVNTSU9OX0NPTlRFTlRfQ1JFQVRFIiwiU0VTU0lPTl9DT05URU5UX1VQREFURSIsIlNFU1NJT05fQ09OVEVOVF9ERUxFVEUiLCJTRVNTSU9OX0NPTlRFTlRfVklFVyIsIlNUVURFTlRfQkFUQ0hfQ1JFQVRFIiwiU1RVREVOVF9CQVRDSF9VUERBVEUiLCJTVFVERU5UX0JBVENIX0RFTEVURSIsIlNUVURFTlRfQkFUQ0hfVklFVyIsIk1BTkFHRV9QRVJNSVNTSU9OUyIsIlZJRVdfUEVSTUlTU0lPTlMiLCJCT09LX0NSRUFURSIsIkJPT0tfVklFVyIsIkJPT0tfVVBEQVRFIiwiQk9PS19ERUxFVEUiLCJCT09LX0NBVEVHT1JZX0NSRUFURSIsIkJPT0tfQ0FURUdPUllfVklFVyIsIkJPT0tfQ0FURUdPUllfVVBEQVRFIiwiQ09PS19DQVRFR09SWV9ERUxFVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9DUkVBVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9VUERBVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9WSUVXIiwiQk9PS19SRVNFUlZBVElPTl9DUkVBVEUiLCJCT09LX1JFU0VSVkFUSU9OX1ZJRVciLCJCT09LX1JFU0VSVkFUSU9OX0RFTEVURSIsIkxJQlJBUllfU0VUVElOR19DUkVBVEUiLCJMSUJSQVJZX1NFVFRJTkdfVklFVyJdLCJhdXRob3JpdGllcyI6WyJST0xFX0FETUlOIiwiQ09VUlNFX0NSRUFURSIsIkNPVVJTRV9VUERBVEUiLCJDT1VSU0VfREVMRVRFIiwiQ09VUlNFX1ZJRVciLCJUT1BJQ19DUkVBVEUiLCJUT1BJQ19VUERBVEUiLCJUT1BJQ19ERUxFVEUiLCJUT1BJQ19WSUVXIiwiQ09OVEVOVF9BREQiLCJDT05URU5UX1VQREFURSIsIkNPTlRFTlRfREVMRVRFIiwiQ09OVEVOVF9WSUVXIiwiQ09OVEVOVF9BQ0NFU1MiLCJNQU5BR0VfVVNFUlMiLCJNQU5BR0VfQ09VUlNFUyIsIlZJRVdfQ09OVEVOVCIsIlZJRVdfUFJPRklMRSIsIkJBVENIX0NSRUFURSIsIkJBVENIX1VQREFURSIsIkJBVENIX0RFTEVURSIsIkJBVENIX1ZJRVciLCJTRVNTSU9OX0NSRUFURSIsIlNFU1NJT05fVVBEQVRFIiwiU0VTU0lPTl9ERUxFVEUiLCJTRVNTSU9OX1ZJRVciLCJTRVNTSU9OX0NPTlRFTlRfQ1JFQVRFIiwiU0VTU0lPTl9DT05URU5UX1VQREFURSIsIlNFU1NJT05fQ09OVEVOVF9ERUxFVEUiLCJTRVNTSU9OX0NPTlRFTlRfVklFVyIsIlNUVURFTlRfQkFUQ0hfQ1JFQVRFIiwiU1RVREVOVF9CQVRDSF9VUERBVEUiLCJTVFVERU5UX0JBVENIX0RFTEVURSIsIlNUVURFTlRfQkFUQ0hfVklFVyIsIk1BTkFHRV9QRVJNSVNTSU9OUyIsIlZJRVdfUEVSTUlTU0lPTlMiLCJCT09LX0NSRUFURSIsIkJPT0tfVklFVyIsIkJPT0tfVVBEQVRFIiwiQk9PS19ERUxFVEUiLCJCT09LX0NBVEVHT1JZX0NSRUFURSIsIkJPT0tfQ0FURUdPUllfVklFVyIsIkJPT0tfQ0FURUdPUllfVVBEQVRFIiwiQ09PS19DQVRFR09SWV9ERUxFVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9DUkVBVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9VUERBVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9WSUVXIiwiQk9PS19SRVNFUlZBVElPTl9DUkVBVEUiLCJCT09LX1JFU0VSVkFUSU9OX1ZJRVciLCJCT09LX1JFU0VSVkFUSU9OX0RFTEVURSIsIkxJQlJBUllfU0VUVElOR19DUkVBVEUiLCJMSUJSQVJZX1NFVFRJTkdfVklFVyJdLCJhdXRob3JpdGllcyI6WyJST0xFX0FETUlOIiwiQ09VUlNFX0NSRUFURSIsIkNPVVJTRV9VUERBVEUiLCJDT1VSU0VfREVMRVRFIiwiQ09VUlNFX1ZJRVciLCJUT1BJQ19DUkVBVEUiLCJUT1BJQ19VUERBVEUiLCJUT1BJQ19ERUxFVEUiLCJUT1BJQ19WSUVXIiwiQ09OVEVOVF9BREQiLCJDT05URU5UX1VQREFURSIsIkNPTlRFTlRfREVMRVRFIiwiQ09OVEVOVF9WSUVXIiwiQ09OVEVOVF9BQ0NFU1MiLCJNQU5BR0VfVVNFUlMiLCJNQU5BR0VfQ09VUlNFUyIsIlZJRVdfQ09OVEVOVCIsIlZJRVdfUFJPRklMRSIsIkJBVENIX0NSRUFURSIsIkJBVENIX1VQREFURSIsIkJBVENIX0RFTEVURSIsIkJBVENIX1ZJRVciLCJTRVNTSU9OX0NSRUFURSIsIlNFU1NJT05fVVBEQVRFIiwiU0VTU0lPTl9ERUxFVEUiLCJTRVNTSU9OX1ZJRVciLCJTRVNTSU9OX0NPTlRFTlRfQ1JFQVRFIiwiU0VTU0lPTl9DT05URU5UX1VQREFURSIsIlNFU1NJT05fQ09OVEVOVF9ERUxFVEUiLCJTRVNTSU9OX0NPTlRFTlRfVklFVyIsIlNUVURFTlRfQkFUQ0hfQ1JFQVRFIiwiU1RVREVOVF9CQVRDSF9VUERBVEUiLCJTVFVERU5UX0JBVENIX0RFTEVURSIsIlNUVURFTlRfQkFUQ0hfVklFVyIsIk1BTkFHRV9QRVJNSVNTSU9OUyIsIlZJRVdfUEVSTUlTU0lPTlMiLCJCT09LX0NSRUFURSIsIkJPT0tfVklFVyIsIkJPT0tfVVBEQVRFIiwiQk9PS19ERUxFVEUiLCJCT09LX0NBVEVHT1JZX0NSRUFURSIsIkJPT0tfQ0FURUdPUllfVklFVyIsIkJPT0tfQ0FURUdPUllfVVBEQVRFIiwiQ09PS19DQVRFR09SWV9ERUxFVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9DUkVBVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9VUERBVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9WSUVXIiwiQ09PS19SRVNFUlZBVElPTl9DUkVBVEUiLCJCT09LX1JFU0VSVkFUSU9OX1ZJRVciLCJCT09LX1JFU0VSVkFUSU9OX0RFTEVURSIsIkxJQlJBUllfU0VUVElOR19DUkVBVEUiLCJMSUJSQVJZX1NFVFRJTkdfVklFVyJdLCJpYXQiOjE3Njk3NTAwODgsImV4cCI6MTgwMTI4NjA4OH0.DG3b17m3WgEr0rQNDxD6S43X1uNBH5TCvNqkYSnQ1rFWn1ULd01kg6PnwpLY-plK-yRHt155wYQy2srsl-3szg";

const getAuthToken = () => {
    return localStorage.getItem('authToken') || import.meta.env.VITE_DEV_AUTH_TOKEN || VALID_TOKEN;
};

// Use Axios for consistency with other working services
const apiClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

apiClient.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Helper for authenticated requests (JSON responses)
const fetchWithAuth = async (url, options = {}) => {
    try {
        console.log(`🌐 fetchWithAuth [${options.method || 'GET'}] ${url}`);
        const response = await apiClient({
            url,
            method: options.method || 'GET',
            data: options.body ? JSON.parse(options.body) : undefined, // Axios uses 'data' for body, and expects JS object for JSON
            ...options, // Spread remaining options, but be careful if they conflict with axios config
            headers: {
                ...apiClient.defaults.headers, // Include default headers
                ...options.headers // Override with specific options headers
            }
        });
        console.log(`📡 response status: ${response.status} for ${url}`);
        return response.data; // Axios automatically parses JSON
    } catch (error) {
        console.error(`📡 websiteService API Error [${options.method || 'GET'}] ${url}:`, error.response?.status, error.response?.data);
        throw new Error(error.response?.data?.message || error.response?.data || `HTTP ${error.response?.status || 'Unknown'}`);
    }
};

// Helper for authenticated requests returning plain text
const fetchWithAuthText = async (url, options = {}) => {
    try {
        const response = await apiClient({
            url,
            method: options.method || 'GET',
            responseType: 'text', // Explicitly request text response
            data: options.body, // Axios uses 'data' for body
            ...options,
            headers: {
                ...apiClient.defaults.headers,
                'Content-Type': options.headers?.['Content-Type'] || 'application/json', // Ensure Content-Type is set if not provided
                ...options.headers
            }
        });
        return response.data;
    } catch (error) {
        console.error(`📡 websiteService API Error (text) [${options.method || 'GET'}] ${url}:`, error.response?.status, error.response?.data);
        throw new Error(error.response?.data?.message || error.response?.data || `HTTP ${error.response?.status || 'Unknown'}`);
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
    // Get all pages for a specific tenant theme
    // =========================================
    getThemePages: async (tenantThemeId) => {
        return fetchWithAuth(`${API_BASE}/${tenantThemeId}/pages`);
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

    // =========================================
    // CUSTOM PAGES / BUILDER LOGIC (Scratch built)
    // =========================================
    CUSTOM_PAGE_BASE: '/website/custom-page',

    searchCustomPages: async (keyword = '') => {
        return fetchWithAuth(`/website/custom-page/search?q=${keyword}`);
    },

    getCustomPage: async (pageId) => {
        try {
            // Try fetching full page details
            return await fetchWithAuth(`/website/custom-page/${pageId}`);
        } catch (e) {
            console.warn(`Detail fetch failed for ${pageId}, trying /sections...`);
            // Fallback to fetching sections directly
            const sections = await fetchWithAuth(`/website/custom-page/${pageId}/sections`);
            return { sections };
        }
    },

    createCustomPage: async (title, slug) => {
        return fetchWithAuth(`/website/custom-page`, {
            method: 'POST',
            body: JSON.stringify({ title, slug })
        });
    },

    updateCustomPageMetadata: async (pageId, metaTitle, metaDescription) => {
        return fetchWithAuth(`/website/custom-page/${pageId}/metadata`, {
            method: 'PUT',
            body: JSON.stringify({ metaTitle, metaDescription })
        });
    },

    deleteCustomPage: async (pageId) => {
        return fetchWithAuth(`/website/custom-page/${pageId}`, {
            method: 'DELETE'
        });
    },

    publishCustomPage: async (pageId) => {
        return fetchWithAuth(`/website/custom-page/${pageId}/publish`, {
            method: 'POST'
        });
    },

    unpublishCustomPage: async (pageId) => {
        return fetchWithAuth(`/website/custom-page/${pageId}/unpublish`, {
            method: 'POST'
        });
    },

    copyCustomPage: async (pageId) => {
        return fetchWithAuth(`/website/custom-page/${pageId}/copy`, {
            method: 'POST'
        });
    },

    resetCustomPage: async (pageId) => {
        return fetchWithAuth(`/website/custom-page/${pageId}/reset`, {
            method: 'POST'
        });
    },

    // Custom Page Sections
    addCustomPageSection: async (pageId, sectionType, config = '{}') => {
        return fetchWithAuth(`/website/custom-page/${pageId}/sections`, {
            method: 'POST',
            body: JSON.stringify({ sectionType, config })
        });
    },

    updateCustomPageSection: async (sectionId, config) => {
        return fetchWithAuth(`/website/custom-page/sections/${sectionId}`, {
            method: 'PUT',
            body: JSON.stringify({ config })
        });
    },

    reorderCustomPageSections: async (pageId, orderedIds) => {
        return fetchWithAuth(`/website/custom-page/${pageId}/sections/order`, {
            method: 'PUT',
            body: JSON.stringify(orderedIds)
        });
    },

    deleteCustomPageSection: async (sectionId) => {
        return fetchWithAuth(`/website/custom-page/sections/${sectionId}`, {
            method: 'DELETE'
        });
    },
};
