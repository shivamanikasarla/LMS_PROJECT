import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Dark Mode Context
export const TransportThemeContext = createContext();

export const useTransportTheme = () => useContext(TransportThemeContext);

export const TransportThemeProvider = ({ children }) => {
    // Initialize state from localStorage or system preference
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('transportTheme');
        return saved ? JSON.parse(saved) : false;
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('transportTheme', JSON.stringify(isDark));

        // Optional: Apply class to body if needed for global styles
        if (isDark) {
            document.body.classList.add('transport-dark');
        } else {
            document.body.classList.remove('transport-dark');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    const theme = {
        isDark,
        toggleTheme,
        colors: {
            bg: isDark ? '#0f172a' : '#f8fafc',
            card: isDark ? '#1e293b' : '#ffffff',
            text: isDark ? '#f1f5f9' : '#1e293b',
            textSecondary: isDark ? '#94a3b8' : '#64748b',
            border: isDark ? '#334155' : '#e2e8f0',
        }
    };

    return (
        <TransportThemeContext.Provider value={theme}>
            <div style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', padding: '24px', transition: 'background-color 0.3s ease' }}>
                {children}
            </div>
        </TransportThemeContext.Provider>
    );
};
