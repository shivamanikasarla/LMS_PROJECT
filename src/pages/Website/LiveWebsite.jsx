import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { websiteService } from '../../services/websiteService';
import { toast } from 'react-toastify';

const BASE_GP_STYLES = `
  /* ─── Graphy-style component CSS ─── */
  .row { display: flex; width: 100%; min-height: 50px; flex-wrap: wrap; }
  .cell { flex: 1; min-height: 50px; position: relative; }
  
  /* Tabs */
  .gp-tabs { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 20px; background: #fff; }
  .gp-tabs-header { display: flex; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
  .gp-tab-btn { padding: 12px 24px; border: none; background: transparent; cursor: pointer; font-size: 14px; font-weight: 600; color: #64748b; border-bottom: 2px solid transparent; transition: all 0.2s; }
  .gp-tab-btn.active { color: #4f46e5; border-bottom-color: #4f46e5; background: #fff; }
  .gp-tab-content-wrapper { position: relative; }
  .gp-tab-pane { display: none; padding: 20px; }
  .gp-tab-pane.active { display: block; }

  /* Slider */
  .gp-slider { position: relative; border-radius: 8px; overflow: hidden; margin-bottom: 20px; }
  .gp-slide { display: none; min-height: 200px; padding: 40px; text-align: center; align-items: center; justify-content: center; background: #f8fafc; }
  .gp-slide.active { display: flex; }
  .gp-slider-nav { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 15px; background: rgba(0,0,0,0.03); }
  .gp-slider-arrow { background: #fff; border: 1px solid #e2e8f0; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .gp-slider-dots { display: flex; gap: 8px; }
  .gp-slider-dots .dot { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; cursor: pointer; }
  .gp-slider-dots .dot.active { background: #4f46e5; }

  /* Buttons */
  .gp-btn { padding: 12px 30px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-block; text-decoration: none; border: none; }
  .gp-btn-primary { background: #4f46e5; color: #fff; }
  .gp-btn-outline { background: transparent; color: #4f46e5; border: 2px solid #4f46e5; }

  /* Video / Map / Iframe */
  .gp-video, .gp-map, .gp-iframe { border-radius: 8px; overflow: hidden; margin-bottom: 20px; background: #000; position: relative; }
  .gp-video-inner { position: relative; padding-bottom: 56.25%; height: 0; }
  .gp-video-inner iframe, .gp-map iframe, .gp-iframe iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }

  /* Search */
  .gp-search { display: flex; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background: #fff; max-width: 500px; }
  .gp-search-input { flex: 1; padding: 12px 20px; border: none; outline: none; font-size: 15px; }
  .gp-search-btn { padding: 12px 25px; border: none; background: #4f46e5; color: #fff; cursor: pointer; font-weight: 600; }

  /* Typography */
  .gp-text { line-height: 1.8; color: #334155; font-size: 16px; margin-bottom: 15px; }
  .gp-quote { border-left: 4px solid #4f46e5; padding: 20px 30px; margin: 20px 0; background: #f8fafc; border-radius: 0 10px 10px 0; }
  .gp-quote-text { font-size: 18px; color: #475569; font-style: italic; }
  .gp-quote-author { margin-top: 10px; font-size: 14px; color: #94a3b8; }
`;

// Helper to handle double-stringified JSON or plain objects
const smartParse = (data) => {
    if (!data) return null;
    if (typeof data === 'object') return data;
    try {
        const parsed = JSON.parse(data);
        if (typeof parsed === 'string') {
            try { return JSON.parse(parsed); } catch (e) { return parsed; }
        }
        return parsed;
    } catch (e) {
        return data; // Return original if not JSON string
    }
};

const LiveWebsite = () => {
    const { slug } = useParams();
    const [pageContent, setPageContent] = useState(null);
    const [renderSections, setRenderSections] = useState([]);
    const [headerData, setHeaderData] = useState(null);
    const [footerData, setFooterData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let currentPage = null;
                let tenantId = null;

                if (slug) {
                    console.log(`🔍 Fetching custom page for slug: ${slug}`);
                    currentPage = await websiteService.getPublicPage(slug);
                    tenantId = currentPage?.tenantThemeId;
                } else {
                    console.log("🌐 Fetching global live theme");
                    currentPage = await websiteService.getLiveTheme();
                    tenantId = currentPage?.tenantThemeId || currentPage?.id;
                }
                setPageContent(currentPage);

                // Resolve Sections
                const resolveSections = (data) => {
                    if (!data) return [];
                    let secs = data.sections;
                    if (!secs && (data.pages || data.data?.pages)) {
                        const pages = data.pages || data.data?.pages || [];
                        const findSlug = slug || 'home';
                        const targetPage = pages.find(p =>
                            p.slug === findSlug ||
                            p.slug === `/${findSlug}` ||
                            (findSlug === 'home' && (p.isHome || p.slug === 'index' || p.slug === '/'))
                        ) || pages[0];
                        secs = targetPage?.sections;
                    }
                    return secs || [];
                };

                setRenderSections(resolveSections(currentPage));

                // Fetch Header and Footer
                if (tenantId) {
                    try {
                        let hData = await websiteService.getHeader(tenantId);
                        hData = Array.isArray(hData) ? hData[0] : hData;
                        if (hData) setHeaderData(smartParse(hData));
                    } catch (e) { console.warn("Header not found:", e); }

                    try {
                        let fData = await websiteService.getFooter(tenantId);
                        fData = Array.isArray(fData) ? fData[0] : fData;
                        if (fData) setFooterData(smartParse(fData));
                    } catch (e) { console.warn("Footer not found:", e); }
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

    // Compute combined CSS from all sections + header/footer
    const combinedCSS = useMemo(() => {
        let css = BASE_GP_STYLES;
        if (renderSections && renderSections.length > 0) {
            css += renderSections
                .map(sec => {
                    const config = smartParse(sec.sectionConfig);
                    return (typeof config?.css === 'string' ? config.css : '');
                })
                .filter(Boolean)
                .join('\n');
        }

        // Robust Header/Footer CSS detection
        const hConfig = headerData?.config || headerData?.configuration || {};
        const hCustom = headerData?.custom || {};
        const hCss = hConfig.customCss || hCustom.css || '';
        if (hCss) css += '\n' + hCss;

        const fConfig = footerData?.config || footerData?.configuration || {};
        const fCustom = footerData?.custom || {};
        const fCss = fConfig.customCss || fCustom.css || '';
        if (fCss) css += '\n' + fCss;

        return css;
    }, [renderSections, headerData, footerData]);

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

    const renderHeader = () => {
        if (!headerData) return null;
        const config = headerData.config || {};
        const custom = headerData.custom || {};

        const isCustom = config.customHeader === 'yes' || !!custom.html;
        const html = config.customHtml || custom.html;

        if (isCustom && html) {
            return <div className="live-header-wrapper" dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return null;
    };

    const renderFooter = () => {
        if (!footerData) return null;
        const config = footerData.config || {};
        const custom = footerData.custom || {};

        const isCustom = config.customFooter === 'yes' || !!custom.html;
        const html = config.customHtml || custom.html;

        if (isCustom && html) {
            return <div className="live-footer-wrapper" dangerouslySetInnerHTML={{ __html: html }} />;
        }

        // Fallback to basic footer
        return (
            <footer style={{ backgroundColor: config.bgColor || '#1a1f3c', color: config.textColor || '#fff', padding: '40px 20px' }}>
                <div className="container text-center">
                    <p className="fw-bold">{config.title || 'GET IN TOUCH'}</p>
                    <p>{config.address}</p>
                    <p className="mt-3 opacity-75 text-xs">{config.copyright}</p>
                </div>
            </footer>
        );
    };

    // Main Render Flow
    return (
        <div className="live-website-render">
            {/* Essential External Assets */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />

            <style>{combinedCSS}</style>
            {renderHeader()}
            <main>
                {renderSections.length > 0 ? (
                    renderSections.map((sec, idx) => {
                        const config = smartParse(sec.sectionConfig);
                        const html = config?.html || '';
                        return (
                            <div
                                key={idx}
                                dangerouslySetInnerHTML={{ __html: html }}
                            />
                        );
                    })
                ) : (
                    <div style={{ padding: '100px 20px', textAlign: 'center', color: '#64748b' }}>
                        <p>Welcome to our website!</p>
                        <p className="small">Page content is being prepared.</p>
                    </div>
                )}
            </main>
            {renderFooter()}

            {/* Inline script to handle interactive elements like Tabs/Sliders */}
            <script dangerouslySetInnerHTML={{
                __html: `
                (function() {
                    function initInteractions() {
                        // Tabs
                        document.querySelectorAll('.gp-tab-btn').forEach(btn => {
                            btn.onclick = function() {
                                var container = this.closest('.gp-tabs');
                                if (!container) return;
                                var btns = container.querySelectorAll('.gp-tab-btn');
                                var panes = container.querySelectorAll('.gp-tab-pane');
                                var idx = Array.from(btns).indexOf(this);
                                btns.forEach(b => b.classList.remove('active'));
                                panes.forEach(p => p.classList.remove('active'));
                                this.classList.add('active');
                                if (panes[idx]) panes[idx].classList.add('active');
                            };
                        });

                        // Sliders
                        document.querySelectorAll('.gp-slider-arrow, .dot').forEach(el => {
                            el.onclick = function() {
                                var slider = this.closest('.gp-slider');
                                if (!slider) return;
                                var slides = slider.querySelectorAll('.gp-slide');
                                var dots = slider.querySelectorAll('.dot');
                                var current = Array.from(slides).findIndex(s => s.classList.contains('active'));
                                if (current === -1) current = 0;
                                var next = current;
                                if (this.classList.contains('prev')) next = (current - 1 + slides.length) % slides.length;
                                else if (this.classList.contains('next')) next = (current + 1) % slides.length;
                                else if (this.classList.contains('dot')) next = Array.from(dots).indexOf(this);
                                slides.forEach((s, i) => s.classList.toggle('active', i === next));
                                dots.forEach((d, i) => d.classList.toggle('active', i === next));
                            };
                        });
                    }
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', initInteractions);
                    } else {
                        initInteractions();
                    }
                    // Re-run after a delay to catch dynamically loaded content
                    setTimeout(initInteractions, 1000);
                    setTimeout(initInteractions, 3000);
                })();
            ` }} />
        </div>
    );
};

export default LiveWebsite;
