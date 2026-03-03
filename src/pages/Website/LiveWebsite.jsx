import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { websiteService } from '../../services/websiteService';
import { toast } from 'react-toastify';

const LiveWebsite = () => {
    const { slug } = useParams();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (slug) {
                    // Fetch a specific custom page by slug (Personalized Home / Custom Pages)
                    console.log(`🔍 Fetching custom page for slug: ${slug}`);
                    const data = await websiteService.getPublicPage(slug);
                    setPageContent(data);
                } else {
                    // Fetch the global live theme
                    console.log("🌐 Fetching global live theme");
                    const config = await websiteService.getLiveTheme();
                    setPageContent(config);
                }
            } catch (error) {
                console.error("Failed to load website content:", error);
                if (error.message.includes("404")) {
                    toast.info("This page doesn't exist yet.");
                } else {
                    toast.error("Failed to load website.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // Compute combined CSS from all sections
    const combinedCSS = useMemo(() => {
        if (!pageContent || !pageContent.sections) return '';
        return pageContent.sections
            .map(sec => {
                try {
                    const config = typeof sec.sectionConfig === 'string'
                        ? JSON.parse(sec.sectionConfig)
                        : sec.sectionConfig;
                    return config.css || '';
                } catch (e) {
                    return '';
                }
            })
            .join('\n');
    }, [pageContent]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading Website...</span>
                </div>
            </div>
        );
    }

    if (!pageContent) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', color: '#64748b' }}>
                <h1 className="display-4 fw-bold mb-3">Welcome to Our Academy</h1>
                <p className="lead">We are currently setting up our new website.</p>
                <p className="text-muted small">Please check back soon!</p>
            </div>
        );
    }

    // Render logic for Custom Pages (List of Sections)
    if (pageContent.sections && Array.isArray(pageContent.sections)) {
        return (
            <div className="live-website-render">
                <style>{combinedCSS}</style>
                {pageContent.sections.map((sec, idx) => {
                    let html = '';
                    try {
                        const config = typeof sec.sectionConfig === 'string'
                            ? JSON.parse(sec.sectionConfig)
                            : sec.sectionConfig;
                        html = config.html || '';
                    } catch (e) {
                        html = '';
                    }
                    return (
                        <div
                            key={idx}
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    );
                })}
            </div>
        );
    }

    // Fallback Renderer for legacy Theme Config
    return (
        <div className="live-website-container">
            <div style={{ background: '#333', color: '#fff', padding: '10px', fontSize: '12px', textAlign: 'center' }}>
                LIVE PREVIEW MODE — {pageContent.name || 'Theme View'}
            </div>
            <div className="container mt-5">
                <pre style={{ background: '#f1f1f1', padding: '20px', borderRadius: '8px', overflow: 'auto' }}>
                    {JSON.stringify(pageContent, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default LiveWebsite;
