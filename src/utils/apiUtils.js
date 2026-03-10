// src/utils/apiUtils.js

const VALID_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzYW50b3NoY2hhdml0aGluaTIwMDRAZ21haWwuY29tIiwidXNlcklkIjoxLCJyb2xlcyI6WyJST0xFX1NVUEVSX0FETUlOIl0sInBlcm1pc3Npb25zIjpbIioiXSwidGVuYW50RGIiOiJsbXNfdGVuYW50XzE3NzA3MDExMDEwODYiLCJpYXQiOjE3NzI3NzY1NTR9.nml_BxtN6jPhrJNdoJp0zYlqwIbmuhstuZLci5DtQz14sxgnG9o_dVP0thA29i7EM6pK1fSL3sGNQgJlxZe4lg";

export const getAuthToken = () => {
    return localStorage.getItem('authToken') || import.meta.env.VITE_DEV_AUTH_TOKEN || VALID_TOKEN;
};

export const authFetch = async (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    return response;
};
