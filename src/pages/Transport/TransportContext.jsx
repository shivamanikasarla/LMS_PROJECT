import React, { createContext, useContext, useState, useEffect } from 'react';

const TransportContext = createContext();

export const useTransportTheme = () => {
    const context = useContext(TransportContext);
    if (!context) {
        throw new Error('useTransportTheme must be used within a TransportThemeProvider');
    }
    return context;
};

export const TransportThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    // Initial theme check
    useEffect(() => {
        const storedTheme = localStorage.getItem('transport-theme');
        if (storedTheme === 'dark') {
            setIsDark(true);
        } else if (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true);
        }
    }, []);

    // Toggle theme function
    const toggleTheme = () => {
        setIsDark(prev => {
            const newTheme = !prev;
            localStorage.setItem('transport-theme', newTheme ? 'dark' : 'light');
            return newTheme;
        });
    };

    // Define colors based on theme
    const colors = {
        background: isDark ? '#0f172a' : '#f8fafc',
        surface: isDark ? '#1e293b' : '#ffffff',
        text: isDark ? '#f1f5f9' : '#1e293b',
        textSecondary: isDark ? '#94a3b8' : '#64748b',
        primary: '#6366f1',
        primaryLight: '#e0e7ff',
        border: isDark ? '#334155' : '#e2e8f0',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    const value = {
        isDark,
        toggleTheme,
        colors
    };

    return (
        <TransportContext.Provider value={value}>
            {children}
        </TransportContext.Provider>
    );
};
