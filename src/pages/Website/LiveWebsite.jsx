import React, { useState, useEffect } from 'react';
import { websiteService } from '../../services/websiteService';
import { toast } from 'react-toastify';

const LiveWebsite = () => {
    const [themeConfig, setThemeConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveTheme = async () => {
            try {
                const config = await websiteService.getLiveTheme();
                setThemeConfig(config);
            } catch (error) {
                console.error("Failed to load live theme:", error);

                // If it's a 404, it might mean no live theme is published yet
                if (error.message.includes("404")) {
                    toast.info("No live website published yet.");
                } else {
                    toast.error("Failed to load website.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLiveTheme();
    }, []);

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8fafc'
            }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading Website...</span>
                </div>
            </div>
        );
    }

    if (!themeConfig) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                color: '#64748b'
            }}>
                <h1 className="display-4 fw-bold mb-3">Welcome to Our Academy</h1>
                <p className="lead">We are currently setting up our new website.</p>
                <p className="text-muted small">Please check back soon!</p>
            </div>
        );
    }

    // Basic Renderer based on Config
    // This assumes the backend returns the ENTIRE theme configuration object
    // If the structure is unknown, we just dump it for now to help debugging
    return (
        <div className="live-website-container">
            {/* Debugging Header */}
            <div style={{ background: '#333', color: '#fff', padding: '10px', fontSize: '12px', textAlign: 'center' }}>
                LIVE PREVIEW MODE — Theme: {themeConfig.name || 'Unknown'} (ID: {themeConfig.tenantThemeId})
            </div>

            <div className="container mt-5">
                <pre style={{ background: '#f1f1f1', padding: '20px', borderRadius: '8px', overflow: 'auto' }}>
                    {JSON.stringify(themeConfig, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default LiveWebsite;
