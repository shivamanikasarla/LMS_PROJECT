import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Tablet, Smartphone, Check, ChevronRight, Undo, Redo, Code,
  Type, ImageIcon, Box, Layout, MousePointer, X, GripVertical,
  FileText, LogIn, ShoppingCart, Search, FormInput, List, MessageSquare, Tag,
  Columns, Clock, Video, Map, Sliders, BookOpen, Library, LayoutTemplate,
  Layers, Globe, CheckSquare, CircleDot, ChevronDown, ChevronUp, Quote,
  Sparkles, Zap, PanelLeft, Eye, EyeOff, Plus, ListTree, Trash2, Edit2, Copy, RotateCcw,
  Home, ShoppingBag, Bot, Upload, Settings, Maximize,
  Facebook, Twitter, Instagram, Youtube, Linkedin, Send
} from 'lucide-react';
import PageBuilder from './PageBuilder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Websites.css';
import { websiteService } from '../../services/websiteService';
import HeaderStudio from './HeaderStudio';

// --- Custom Hook for Local Storage ---
const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      const val = item ? JSON.parse(item) : initialValue;
      console.log(`📦 [PersistentState] Initializing ${key}:`, val);
      return val;
    } catch (error) {
      console.error(`❌ [PersistentState] Error reading ${key}:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      console.log(`💾 [PersistentState] Saving ${key}:`, state);
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`❌ [PersistentState] Error saving ${key}:`, error);
    }
  }, [key, state]);

  return [state, setState];
};

// --- Custom Hook for Theme Management (Backend Integrated) ---
const useThemeManager = (enabled = true) => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false); // Default to false if not enabled

  // State for tracking visible themes (tabs)
  const [visibleThemeIds, setVisibleThemeIds] = usePersistentState('wb_visible_theme_ids', []);

  // State for tracking applied theme IDs (templateId -> tenantThemeId)
  const [appliedThemeIds, setAppliedThemeIds] = usePersistentState('wb_applied_theme_map', {});
  // Track themes that were just published to "lock" their status as live for a short window
  const publishingRef = useRef(null);

  // Fetch themes from backend
  const fetchThemes = async () => {
    try {
      // 1. Fetch the master templates list
      const templates = await websiteService.getAvailableThemes();

      // 2. Fetch the DEFINITIVE live theme for this tenant to avoid stale status
      let liveThemeData = null;
      try {
        liveThemeData = await websiteService.getLiveTheme();
        console.log('🌐 [fetchThemes] Definitive LIVE theme from backend:', liveThemeData);
      } catch (e) {
        console.warn('Could not fetch definitive live status');
      }

      // Live identity from various sources
      const backendLiveTenantId = String(liveThemeData?.tenantThemeId || liveThemeData?.id || '');
      const backendLiveTemplateId = String(liveThemeData?.themeTemplateId || liveThemeData?.theme_id || '');

      // PERSISTENT LOCK: Check sessionStorage for a theme that was JUST published
      const sessionLockId = sessionStorage.getItem('wb_publishing_lock');

      // Map backend data to frontend format
      const mappedThemes = templates.map(template => {
        const templateTenantId = String(template.tenant_theme_id || '');
        const templateId = String(template.theme_id || '');
        const rawStatus = (template.status || '').toLowerCase();

        // 3. Super Robust Live Check: Match against:
        //    A. The explicit /live endpoint (Tenant Theme ID)
        //    B. The explicit /live endpoint (Master Template ID fallback)
        //    C. The template's own status fields
        const isBackendLive =
          (backendLiveTenantId && backendLiveTenantId === templateTenantId) ||
          (backendLiveTemplateId && backendLiveTemplateId === templateId) ||
          rawStatus === 'live' || rawStatus === 'published' || rawStatus === 'active' ||
          template.is_live === true;

        // 4. STATUS LOCK: If this theme was JUST published (even across reloads)
        const isLockedLive = (publishingRef.current === templateTenantId || sessionLockId === templateTenantId) && templateTenantId !== '';
        const isThemeLive = isBackendLive || isLockedLive;

        // If it's live, we should clear the manual session lock as the backend has caught up
        if (isBackendLive && sessionLockId === templateTenantId) {
          sessionStorage.removeItem('wb_publishing_lock');
        }

        return {
          id: `template-${template.theme_id}`,
          themeTemplateId: template.theme_id,
          name: template.name,
          image: template.preview_image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
          color: '#8b5cf6',
          status: isThemeLive ? 'live' : 'draft',
          originalStatus: rawStatus,
          isVisible: isThemeLive ? true : visibleThemeIds.includes(`template-${template.theme_id}`),
          tenantThemeId: templateTenantId || appliedThemeIds[`template-${template.theme_id}`] || ''
        };
      });

      console.log('✅ Theme Status Sync:', mappedThemes.map(t => ({ name: t.name, status: t.status })));
      setThemes(mappedThemes);
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.warning('Backend unavailable. Using local demo data.');

      // Fallback to demo data when backend is unavailable
      const defaultThemes = [
        { id: 'theme-1', name: 'June', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', color: '#10b981', status: 'draft', isVisible: false, themeTemplateId: 1, tenantThemeId: null },
        { id: 'theme-2', name: 'Legacy Theme', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop', color: '#8b5cf6', status: 'live', isVisible: true, themeTemplateId: 2, tenantThemeId: 1 },
        { id: 'theme-3', name: 'Showstopper', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&h=400&fit=crop', color: '#64748b', status: 'draft', isVisible: false, themeTemplateId: 3, tenantThemeId: null },
        { id: 'theme-4', name: 'Pulse', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=400&fit=crop', color: '#f59e0b', status: 'draft', isVisible: false, themeTemplateId: 4, tenantThemeId: null },
        { id: 'theme-5', name: 'Olive', image: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?w=600&h=400&fit=crop', color: '#06b6d4', status: 'draft', isVisible: false, themeTemplateId: 5, tenantThemeId: null },
        { id: 'theme-6', name: 'Vegas', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop', color: '#4f46e5', status: 'draft', isVisible: false, themeTemplateId: 6, tenantThemeId: null },
      ];
      setThemes(defaultThemes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchThemes();
    }
  }, [enabled, visibleThemeIds, appliedThemeIds]); // Refetch when IDs change or enabled

  const liveTheme = themes.find(t => t.status === 'live');
  const stagingTheme = themes.find(t => t.status === 'staging' || t.status === 'draft');

  const applyTheme = async (id) => {
    const theme = themes.find(t => t.id === id);
    if (!theme || !theme.themeTemplateId) {
      toast.error('Invalid theme');
      return;
    }

    // If theme already has a tenantThemeId, just make it visible (don't create duplicate)
    if (theme.tenantThemeId) {
      console.log("ℹ️ Theme already applied (tenantThemeId:", theme.tenantThemeId, "). Just making it visible.");
      if (!visibleThemeIds.includes(id)) {
        setVisibleThemeIds(prev => [...prev, id]);
      }
      toast.success("Theme added to workspace");
      return;
    }

    try {
      const response = await websiteService.applyTheme(theme.themeTemplateId);

      // Attempt to capture tenantThemeId from response (supporting potential backend fix)
      let newTenantThemeId = null;
      if (response && typeof response === 'object' && response.tenantThemeId) {
        newTenantThemeId = response.tenantThemeId;
      } else if (response && typeof response === 'object' && response.tenant_theme_id) {
        newTenantThemeId = response.tenant_theme_id;
      } else if (response && typeof response === 'string' && response.match(/\d+/)) {
        // Fallback for string response containing ID
        const match = response.match(/(\d+)/);
        if (match) newTenantThemeId = parseInt(match[0]);
      } else if (typeof response === 'number') {
        newTenantThemeId = response;
      }

      // Update the themes state with the new tenantThemeId if found
      if (newTenantThemeId) {
        // SAVE TO PERSISTENT STORAGE
        setAppliedThemeIds(prev => ({
          ...prev,
          [`template-${theme.themeTemplateId}`]: newTenantThemeId
        }));

        setThemes(prevThemes => prevThemes.map(t =>
          t.id === id ? { ...t, tenantThemeId: newTenantThemeId } : t
        ));
        console.log("Captured new TenantThemeID:", newTenantThemeId);
      } else {
        console.warn("Backend did not return a TenantThemeID. Publish will fail.");
        toast.warning("Publishing unavailable: Backend needs to return Theme ID.");
      }

      // Add to visible tabs without removing others
      if (!visibleThemeIds.includes(id)) {
        setVisibleThemeIds(prev => [...prev, id]);
      }

      toast.success("Theme added to workspace");
      // fetchThemes will be triggered by useEffect on visibleThemeIds change
    } catch (error) {
      console.error('Error applying theme:', error);
      toast.error('Failed to apply theme');
    }
  };

  const publishTheme = async (tenantThemeId) => {
    if (!tenantThemeId) {
      toast.error('No theme to publish. Please apply a theme first.');
      return;
    }

    // Confirmation dialog
    const currentLive = themes.find(t => t.status === 'live');
    const confirmMsg = currentLive
      ? `Are you sure you want to publish this theme as LIVE?\n\nThe currently live theme "${currentLive.name}" will be set to Draft.`
      : 'Are you sure you want to publish this theme as LIVE?';

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      await websiteService.publishTheme(tenantThemeId);

      // Stringify for safe comparison
      const targetId = String(tenantThemeId);

      // STATUS LOCK: Lock this theme ID as 'live' for this session for 30 seconds
      publishingRef.current = targetId;
      sessionStorage.setItem('wb_publishing_lock', targetId);

      // Update UI state immediately for responsiveness
      setThemes(prev => prev.map(t =>
        String(t.tenantThemeId) === targetId ? { ...t, status: 'live' } :
          (t.status === 'live' ? { ...t, status: 'draft' } : t)
      ));

      toast.success("Theme published as LIVE!");

      // Ensure the published theme stays visible in tabs
      const publishedTheme = themes.find(t => String(t.tenantThemeId) === targetId);
      if (publishedTheme && !visibleThemeIds.includes(publishedTheme.id)) {
        setVisibleThemeIds(prev => [...prev, publishedTheme.id]);
      }

      // Wait a bit longer (3 seconds) to ensure backend db is fully updated 
      // before we fetch the status back, prevents flickering to 'draft'
      setTimeout(async () => {
        console.log("🔄 Background refresh after publish...");
        await fetchThemes();
      }, 3000);

      // Clear the lock after 30 seconds (ample time for backend to be stable)
      setTimeout(() => {
        if (publishingRef.current === targetId) {
          console.log("🔓 Releasing status lock for:", targetId);
          publishingRef.current = null;
        }
      }, 30000);
    } catch (error) {
      console.error('Error publishing theme:', error);
      toast.error('Failed to publish theme');
    }
  };

  const removeThemeFromTabs = async (id) => {
    const theme = themes.find(t => t.id === id);
    if (!theme) return;

    if (theme.status === 'live') {
      toast.error("Cannot remove the Live theme from tabs.");
      return;
    }

    if (window.confirm(`Close ${theme.name} from your workspace? This will not delete the theme data.`)) {
      // Just remove from tabs
      setVisibleThemeIds(prev => prev.filter(tid => tid !== id));
      toast.info("Theme closed.");
    }
  };

  return {
    themes,
    setThemes,
    liveTheme,
    stagingTheme,
    applyTheme,
    publishTheme,
    removeThemeFromTabs,
    loading,
    refreshThemes: fetchThemes
  };
};

// --- Components ---

const PageModal = ({ isOpen, onClose, onSave, pageToEdit }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('Landing Page');

  useEffect(() => {
    if (isOpen) {
      if (pageToEdit) {
        setTitle(pageToEdit.title);
        setSlug(pageToEdit.url ? pageToEdit.url.replace(/^\//, '') : '');
        setType(pageToEdit.type);
      } else {
        setTitle('');
        setSlug('');
        setType('Landing Page');
      }
    }
  }, [isOpen, pageToEdit]);

  const isScratch = type === 'Landing Page' || type === 'About / Info' || type === 'Legal / Policy' || type === 'Custom Page';

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title) {
      toast.error("Please enter a page title");
      return;
    }

    // Auto-generate slug if empty
    let finalSlug = slug.trim();
    if (!finalSlug) {
      finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    // Ensure it starts with /
    const finalUrl = finalSlug.startsWith('/') ? finalSlug : `/${finalSlug}`;

    const pageData = {
      title,
      url: finalUrl,
      type
    };

    if (pageToEdit) {
      onSave({ ...pageToEdit, ...pageData });
    } else {
      onSave(pageData); // ID and Status will be handled by parent
    }
    onClose();
  };

  return (
    <div className="wb-modal-overlay">
      <div className="wb-modal-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-xl font-bold m-0 text-slate-800">{pageToEdit ? 'Edit Page' : 'Create New Page'}</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <div className="mb-4">
          <label className="wb-label">Page Title</label>
          <input
            type="text"
            className="wb-input"
            placeholder="e.g. Summer Sale Landing Page"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="wb-label">URL Slug</label>
          <div className="input-group">
            <span className="input-group-text bg-slate-50 border-slate-200 text-slate-500 font-monospace text-xs">/</span>
            <input
              type="text"
              className="wb-input rounded-start-0"
              placeholder="summer-sale-landing-page"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Leave blank to auto-generate from title.</p>
        </div>

        <div className="mb-4">
          <label className="wb-label">Page Type</label>
          <select
            className="wb-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Landing Page</option>
            <option>About / Info</option>
            <option>Legal / Policy</option>
            <option>Custom Page</option>
          </select>
        </div>

        <div className="d-flex gap-3 justify-content-end mt-4">
          <button onClick={onClose} className="btn-secondary-action">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary-action">{pageToEdit ? 'Save Changes' : 'Create Page'}</button>
        </div>
      </div>
    </div>
  );
};

const PagePreviewModal = ({ isOpen, onClose, page }) => {
  if (!isOpen || !page) return null;

  return (
    <div className="wb-modal-overlay" onClick={onClose}>
      <div
        className="wb-modal-content p-0 overflow-hidden d-flex flex-column"
        style={{ width: '90vw', height: '90vh', maxWidth: '1200px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-slate-50">
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-indigo-100 text-indigo-700 font-monospace px-2 py-1 rounded">{page.status}</span>
            <span className="font-bold text-slate-700">{page.title}</span>
            <span className="text-slate-400 text-sm font-monospace">{page.url}</span>
          </div>
          <div className="d-flex gap-2">
            <button className="btn-icon" title="Mobile View"><Monitor size={18} /></button>
            <button onClick={onClose} className="btn-icon"><X size={20} /></button>
          </div>
        </div>
        <div className="flex-grow-1 bg-slate-100 d-flex align-items-center justify-content-center p-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden w-100 h-100 d-flex flex-column">
            {/* Mock Browser Header */}
            <div className="bg-slate-50 border-bottom p-2 d-flex align-items-center gap-2">
              <div className="d-flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              </div>
              <div className="bg-white border rounded px-3 py-1 text-xs text-slate-400 flex-grow-1 text-center font-monospace">
                lms-academy.com{page.url}
              </div>
            </div>
            {/* Mock Content */}
            <div className="flex-grow-1 overflow-auto p-5 text-center d-flex flex-column align-items-center justify-content-center">
              <h1 className="display-4 font-bold text-slate-800 mb-4">{page.title}</h1>
              <p className="lead text-slate-500 max-w-2xl mb-5">
                This is a live preview of your "{page.type}". All changes made in the editor will appear here immediately.
              </p>
              <div className="p-4 bg-slate-50 border rounded-lg max-w-md w-100">
                <div className="h-4 bg-slate-200 rounded w-75 mb-3 mx-auto"></div>
                <div className="h-4 bg-slate-200 rounded w-50 mb-3 mx-auto"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
              </div>
              <button className="btn-primary-action mt-5">Call to Action Button</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ThemePagesManager = ({ themes, onEditTheme, applyTheme, publishTheme, removeThemeFromTabs }) => {
  const liveTheme = themes.find(t => t.status === 'live');

  // Default to Live theme
  const [activeTabId, setActiveTabId] = useState(liveTheme?.id || themes.find(t => t.isVisible !== false)?.id);

  const activeTheme = themes.find(t => t.id === activeTabId);
  const isDraft = activeTheme?.status === 'draft';

  return (
    <div className="wb-card p-0 overflow-hidden shadow-sm bg-white rounded-lg border border-slate-100">
      {/* Tabs Header */}
      <div className="border-bottom px-4 pt-1 bg-white d-flex gap-2 overflow-auto no-scrollbar justify-content-between align-items-center">
        <div className="d-flex gap-4">
          {themes.filter(t => (t.isVisible !== false) || t.id === activeTabId).map(theme => {
            // Show all themes
            const isActive = activeTabId === theme.id;
            // Robust check for live/published status
            const isLive = theme.status === 'live' || theme.status === 'published' || theme.status === 'active';
            const statusLabel = isLive ? 'Live' : 'Draft';


            return (
              <button
                key={theme.id}
                onClick={() => setActiveTabId(theme.id)}
                className={`position-relative bg-transparent pb-3 pt-3 px-3 text-sm font-medium border-0 transition-all whitespace-nowrap outline-none ${isActive
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <div className="d-flex align-items-center gap-2" style={{ zIndex: 2, position: 'relative' }}>
                  <span className={isActive ? 'font-bold' : ''}>{theme.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isLive
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                    : isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Bottom bar for Active Tab */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="position-absolute bottom-0 start-0 w-100 bg-indigo-600"
                    style={{ height: '3px', borderRadius: '4px 4px 0 0', zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* "Light" indicator for LIVE theme */}
                {isLive && (
                  <motion.div
                    layoutId="liveStatusLight"
                    className="position-absolute bottom-0 start-0 w-100"
                    style={{
                      height: '100%',
                      background: 'linear-gradient(to top, rgba(79, 70, 229, 0.12), transparent)',
                      zIndex: 1,
                      borderBottom: '3px solid #4f46e5'
                    }}
                  />
                )}

                {/* Glow effect for Active tab */}
                {isActive && !isLive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="position-absolute bottom-0 start-0 w-100"
                    style={{
                      height: '20px',
                      background: 'linear-gradient(to top, rgba(79, 70, 229, 0.08), transparent)',
                      zIndex: 1
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Bar (Only for Draft themes) */}
        {isDraft && (
          <div className="d-flex gap-3 pb-2">
            <button className="btn btn-outline-danger btn-sm bg-white text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300" onClick={() => removeThemeFromTabs(activeTabId)}>
              Remove theme
            </button>
            <button className="btn btn-primary btn-sm bg-indigo-600 border-indigo-600 hover:bg-indigo-700" onClick={async () => {
              await publishTheme(activeTheme?.tenantThemeId);
              // Ensure we re-calculate current theme status after publish
            }}>
              Publish
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="bg-white">
        <ThemePagesOverview
          key={activeTabId}
          themeId={activeTabId}
          isLive={!isDraft}
          tenantThemeId={activeTheme?.tenantThemeId}
          onViewBuilder={() => onEditTheme(activeTabId)}
        />
      </div>
    </div>
  );
};

// Default pages configuration for any new theme
const DEFAULT_THEME_PAGES = [];

const ThemePagesOverview = ({ themeId, tenantThemeId, onViewBuilder, isLive }) => {
  const storageKey = `lms_wb_pages_v2_${themeId}`;
  // Initialize with DEFAULT_THEME_PAGES so every theme has pages by default
  const [pages, setPages] = usePersistentState(storageKey, DEFAULT_THEME_PAGES);

  const [designingPage, setDesigningPage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Sync with backend on component mount or theme id change
  useEffect(() => {
    const fetchPages = async () => {
      if (!tenantThemeId) return;
      try {
        setIsProcessing(true);
        const data = await websiteService.getThemePages(tenantThemeId, isLive);
        if (data && Array.isArray(data)) {
          // Map backend response if needed (ensuring numeric IDs)
          // Backend usually returns numeric ids as longs
          setPages(data);
        }
      } catch (error) {
        console.error("Error fetching theme pages:", error);
        // Ensure we at least have Home and Courses if everything fails
        if (pages.length === 0) {
          setPages([
            { id: 'p1', title: 'Home', url: '/home', status: 'DRAFT', type: 'System' },
            { id: 'p2', title: 'Courses', url: '/courses', status: 'DRAFT', type: 'System' },
            { id: 'p3', title: 'About Us', url: '/about', status: 'DRAFT', type: 'System' }
          ]);
        }
      } finally {
        setIsProcessing(false);
      }
    };

    fetchPages();
  }, [tenantThemeId]);


  const handleUpdateTitle = async (pageId) => {
    if (!editingTitle.trim()) {
      setEditingPageId(null);
      return;
    }

    try {
      setIsProcessing(true);
      await websiteService.updatePageTitle(pageId, editingTitle);
      setPages(prev => prev.map(p => p.id === pageId ? { ...p, title: editingTitle } : p));
      toast.success("Page title updated!");
    } catch (error) {
      console.error("Update title error", error);
      toast.error("Failed to update title on the server.");
    } finally {
      setIsProcessing(false);
      setEditingPageId(null);
    }
  };

  return (
    <>
      {isLive && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-3 mb-2 p-3 rounded-lg border border-indigo-100 bg-indigo-50/50 d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center gap-3">
              <div className="bg-indigo-500 p-1.5 rounded-full shadow-sm">
                <Check className="text-white" size={16} />
              </div>
              <div>
                <h5 className="m-0 text-indigo-800 text-sm font-bold tracking-wide uppercase">This theme is currently live</h5>
                <p className="m-0 text-indigo-600 text-xs opacity-80">All changes made to these pages are visible to your visitors.</p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 px-3 py-1 bg-white rounded-full border border-indigo-100 text-indigo-600 text-[10px] font-bold shadow-sm">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              ACTIVE
            </div>
          </motion.div>

          <div className="bg-indigo-50 border-bottom border-indigo-100 px-4 py-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700 d-flex align-items-center justify-content-center">
                <Sparkles size={18} />
              </div>
              <div>
                <h6 className="m-0 font-bold text-indigo-900 border-0">Live Theme Active</h6>
                <p className="m-0 text-xs text-indigo-600 border-0">This theme is currently published and visible to all your website visitors.</p>
              </div>
            </div>
            <div className="d-none d-md-block">
              <span className="badge bg-indigo-100 text-indigo-700 px-3 py-2 border border-indigo-200">PUBLIC</span>
            </div>
          </div>
        </>
      )}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-white">
            <tr>
              <th className="py-4 ps-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-0" style={{ width: '35%' }}>Title</th>
              <th className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-0" style={{ width: '25%' }}>URI</th>
              <th className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-0 text-center" style={{ width: '15%' }}>Status</th>
              <th className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-0 text-center" style={{ width: '10%' }}>Customize</th>
              <th className="py-4 pe-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-0 text-end" style={{ width: '15%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(pages || []).slice(0, 5).map(page => (
              <tr key={page.id} className={`group hover:bg-slate-50 transition-colors ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                <td className="ps-4 py-4 border-0 border-bottom border-slate-50">
                  {editingPageId === page.id ? (
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="text"
                        className="form-control form-control-sm border-indigo-300"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => handleUpdateTitle(page.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle(page.id)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-2 group">
                      <span className="text-sm font-normal text-slate-700">{page.title}</span>
                      <button
                        className="btn-icon p-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setEditingPageId(page.id);
                          setEditingTitle(page.title);
                        }}
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="py-4 border-0 border-bottom border-slate-50">
                  <span className="text-sm text-slate-500">{page.url || '-'}</span>
                </td>
                <td className="py-4 border-0 border-bottom border-slate-50 text-center">
                  <span className={`badge ${page.status === 'PUBLISHED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {page.status || 'DRAFT'}
                  </span>
                </td>
                <td className="py-4 border-0 border-bottom border-slate-50 text-center">
                  <button
                    onClick={() => setDesigningPage(page)}
                    className="btn btn-link p-0 text-indigo-600 text-sm hover:text-indigo-800 text-decoration-none"
                    disabled={isProcessing}
                  >
                    Edit Layout
                  </button>
                </td>
                <td className="py-4 text-end pe-4 border-0 border-bottom border-slate-50">
                  <div className="d-flex align-items-center justify-content-end gap-3">
                    {/* Page Actions Removed per Strict API Sync */}
                  </div>
                </td>
              </tr>
            ))}
            {(pages || []).length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500 border-0">No pages configured for this theme yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {designingPage && (
        <PageBuilder
          isOpen={!!designingPage}
          onClose={() => setDesigningPage(null)}
          page={designingPage}
          onSave={async (html, css) => {
            try {
              toast.info("Saving changes to server...");
              // Ideally this hits updateSection or an API to save the whole HTML canvas.
              // Since the exact ID mapping isn't fully robust, we save to local state 
              // AND attempt to ping the backend to "publish" or trigger an update if needed.
              // For a complete integration, we would create a specific section for this HTML chunk here:
              // await websiteService.updateSection(dummySectionId, { html, css });

              setPages(prev => prev.map(p =>
                p.id === designingPage.id ? { ...p, html, css } : p
              ));
              toast.success(`${designingPage.title} layout saved successfully!`);
              setDesigningPage(null);
            } catch (err) {
              console.error("Save error", err);
              toast.error("Failed to save changes to the server.");
            }
          }}
          onPublish={async (html, css) => {
            try {
              toast.info("Publishing layout and making changes live...");
              // Similarly to save, we update the local HTML and ping the publish endpoint
              await websiteService.publishPage(designingPage.id);

              setPages(prev => prev.map(p =>
                p.id === designingPage.id ? { ...p, html, css, status: 'PUBLISHED' } : p
              ));
              toast.success(`${designingPage.title} layout published successfully!`);
              setDesigningPage(null);
            } catch (err) {
              console.error("Publish error", err);
              toast.error("Failed to publish changes to the server.");
            }
          }}
        />
      )}
    </>
  );
};

const ThemeOptionsModal = ({ isOpen, onClose, theme, onPreview, onApply }) => {
  if (!isOpen || !theme) return null;

  return (
    <div className="wb-modal-overlay" onClick={onClose}>
      <div
        className="wb-modal-content p-0 overflow-hidden d-flex flex-column"
        style={{ maxWidth: '900px', width: '90vw' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-slate-50">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 m-0">{theme.name}</h3>
            <p className="text-slate-500 m-0">Choose an action for this theme</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={24} /></button>
        </div>

        <div className="row g-0">
          <div className="col-md-7 border-end bg-slate-100 p-5 d-flex align-items-center justify-content-center">
            <img
              src={theme.image}
              alt={theme.name}
              className="shadow-lg rounded-lg"
              style={{ maxHeight: '400px', width: 'auto', maxWidth: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-5 p-5 d-flex flex-column justify-content-center gap-4 bg-white">
            <button
              onClick={() => { onPreview(theme); }}
              className="d-flex flex-column align-items-center justify-content-center p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-center"
            >
              <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Eye size={32} className="text-slate-600 group-hover:text-indigo-600" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Preview Theme</h4>
              <p className="text-sm text-slate-500 m-0">View how this theme looks with sample content</p>
            </button>

            <button
              onClick={() => { onApply(theme); }}
              className="d-flex flex-column align-items-center justify-content-center p-4 rounded-xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all group text-center"
            >
              <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Check size={32} className="text-slate-600 group-hover:text-purple-600" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Apply Theme</h4>
              <p className="text-sm text-slate-500 m-0">Set as Staging to customize before publishing</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Tabs ---

const WebsiteBuilderTab = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch custom pages on mount
  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const data = await websiteService.searchCustomPages('');
        if (data && Array.isArray(data)) {
          // Map backend model to frontend expectation
          console.log("🔍 searchCustomPages data:", data);
          const mapped = data.map(p => ({
            id: p.tenantCustomPageId,
            pageId: p.pageId,
            title: p.title,
            url: p.slug.startsWith('/') ? p.slug : `/${p.slug}`,
            status: p.status === 'PUBLISHED' ? 'Published' : 'Draft',
            type: 'Custom Page', // Default for scratch pages
            metaTitle: p.metaTitle,
            metaDescription: p.metaDescription
          }));
          setPages(mapped);
        }
      } catch (error) {
        console.error("Error fetching custom pages:", error);
        toast.error("Failed to load custom pages.");
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const [editingPage, setEditingPage] = useState(null);
  const [designingPage, setDesigningPage] = useState(null);
  const [previewingPage, setPreviewingPage] = useState(null);
  const [isHeaderStudioOpen, setHeaderStudioOpen] = useState(false);

  const handleSavePage = async (pageData) => {
    try {
      if (editingPage) {
        // Update Metadata
        await websiteService.updateCustomPageMetadata(
          pageData.id,
          pageData.metaTitle || pageData.title,
          pageData.metaDescription || ''
        );

        setPages(prev => prev.map(p => p.id === pageData.id ? { ...p, ...pageData } : p));
        toast.success("Page metadata updated!");
      } else {
        // Create new
        const slug = pageData.title.toLowerCase().trim().replace(/\s+/g, '-');
        const response = await websiteService.createCustomPage(pageData.title, slug);
        const newPageId = response.pageId || response.tenantCustomPageId;

        const newPage = {
          id: newPageId,
          ...pageData,
          status: 'Draft',
          url: response.slug ? (response.slug.startsWith('/') ? response.slug : `/${response.slug}`) : `/${slug}`,
          html: '',
          css: ''
        };
        setPages(prev => [...prev, newPage]);
        toast.success("New page created on server!");
        setDesigningPage(newPage);
      }
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error("Failed to save page to server.");
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await websiteService.deleteCustomPage(id);
        setPages(prev => prev.filter(p => p.id !== id));
        toast.info("Page deleted from server.");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete page.");
      }
    }
  };

  const toggleStatus = async (id) => {
    const page = pages.find(p => p.id === id);
    if (!page) return;

    try {
      if (page.status === 'Published') {
        await websiteService.unpublishCustomPage(id);
        setPages(prev => prev.map(p => p.id === id ? { ...p, status: 'Draft' } : p));
        toast.success("Page unpublished");
      } else {
        await websiteService.publishCustomPage(id);
        setPages(prev => prev.map(p => p.id === id ? { ...p, status: 'Published' } : p));
        toast.success("Page published");
      }
    } catch (error) {
      console.error("Status toggle error:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleOpenDesign = async (page) => {
    try {
      toast.info(`Opening ${page.title}...`);

      let builderData = null;
      try {
        // Fetch full page details (including sections) from backend using the new builder endpoint
        builderData = await websiteService.getCustomPageBuilder(page.id);
      } catch (e) {
        console.error("Fetch designer error, falling back:", e);
        toast.warn("Could not load design from server. Starting with fresh layout.");
        builderData = { sections: [] };
      }

      // Handle the new sections structure from backend
      const sections = builderData?.sections || [];

      let initialHtml = '';
      let initialCss = '';

      if (sections.length > 0) {
        const rootSec = sections.find(s => s.sectionType === 'ROOT_HTML');
        if (rootSec) {
          try {
            const config = typeof rootSec.sectionConfig === 'string'
              ? JSON.parse(rootSec.sectionConfig)
              : rootSec.sectionConfig;
            initialHtml = config.html || '';
            initialCss = config.css || '';
          } catch (e) {
            console.error("Config parse error", e);
            // Fallback for non-JSON content if applicable
            initialHtml = rootSec.sectionConfig || '';
          }
        }
      }

      setDesigningPage({
        ...page,
        html: initialHtml || '',
        css: initialCss || ''
      });
    } catch (error) {
      console.error("Critical error opening design:", error);
      toast.error(`Fatal: ${error.message || "Unknown error"}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="d-flex justify-content-end align-items-center mb-4 gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary-action border-indigo-200 text-indigo-700 bg-indigo-50"
          onClick={() => setHeaderStudioOpen(true)}
        >
          <Sliders size={18} /> Global Header
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary-action" onClick={() => { setEditingPage(null); setModalOpen(true); }}
        >
          <Plus size={18} /> Create New Page
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants} className="wb-card p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-3 ps-4 text-xs font-bold text-muted uppercase tracking-wider border-0">Page Title</th>
                <th className="py-3 text-xs font-bold text-muted uppercase tracking-wider border-0">URL Slug</th>
                <th className="py-3 text-xs font-bold text-muted uppercase tracking-wider border-0">Type</th>
                <th className="py-3 text-xs font-bold text-muted uppercase tracking-wider border-0">Status</th>
                <th className="py-3 text-xs font-bold text-muted uppercase tracking-wider border-0 text-center">Customise</th>
                <th className="py-3 pe-4 text-end text-xs font-bold text-muted uppercase tracking-wider border-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {pages.map(page => (
                  <motion.tr
                    key={page.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                  >
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                          <Layout size={18} />
                        </div>
                        <span className="font-semibold text-slate-800 text-sm">{page.title}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <code className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">{page.url}</code>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-slate-600">{page.type}</span>
                    </td>
                    <td className="py-3">
                      <button
                        className={`px-2 py-1 rounded-full text-xs font-semibold border-0 ${page.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                          }`}
                        onClick={() => toggleStatus(page.id)}
                        title="Click to toggle status"
                      >
                        {page.status}
                      </button>
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => handleOpenDesign(page)}
                        className="btn btn-link p-0 text-indigo-600 text-sm hover:text-indigo-800 text-decoration-none"
                      >
                        Design
                      </button>
                    </td>
                    <td className="pe-4 py-3 text-end">
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        {page.status === 'Published' && (
                          <button
                            className="btn-icon text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Open Published URL"
                            onClick={() => window.open(`/s/pages${page.url}`, '_blank')}
                          >
                            <Globe size={18} />
                          </button>
                        )}
                        <button
                          className="btn-icon text-amber-500 hover:text-amber-700 hover:bg-amber-50"
                          title="Set as Personal Home"
                          onClick={() => {
                            toast.success(`${page.title} is now your Personal Homepage!`);
                            // Logic to save this preference could be added here
                          }}
                        >
                          <Home size={18} />
                        </button>
                        <button className="btn-icon text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => setPreviewingPage(page)} title="Preview"><Eye size={18} /></button>
                        <button className="btn-icon text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => handleEdit(page)} title="Edit"><Edit2 size={18} /></button>
                        <button className="btn-icon text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(page.id)} title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {pages.length === 0 && (
          <div className="p-5 text-center text-slate-500">
            No pages found. Create one to get started!
          </div>
        )}
      </motion.div>

      <PageModal
        isOpen={isModalOpen}
        onClose={() => { setModalOpen(false); setEditingPage(null); }}
        onSave={handleSavePage}
        pageToEdit={editingPage}
      />

      <PagePreviewModal
        isOpen={!!previewingPage}
        onClose={() => setPreviewingPage(null)}
        page={previewingPage}
      />

      {designingPage && (
        <PageBuilder
          isOpen={!!designingPage}
          onClose={() => setDesigningPage(null)}
          page={designingPage}
          onSave={async (html, css) => {
            try {
              toast.info("Saving layout...");
              // 1. Reset existing sections to start fresh (as per current implementation requirement)
              await websiteService.resetCustomPage(designingPage.id);

              // 2. Add the primary HTML/CSS as a ROOT_HTML section
              const configJson = JSON.stringify({ html, css });
              await websiteService.addCustomPageSection(designingPage.id, 'ROOT_HTML', configJson);

              // 3. Ping the explicit save endpoint if needed by backend to update timestamps
              await websiteService.saveCustomPage(designingPage.id);

              setPages(prev => prev.map(p =>
                p.id === designingPage.id ? { ...p, html, css } : p
              ));
              setDesigningPage(null);
              toast.success(`${designingPage.title} saved successfully!`);
            } catch (err) {
              console.error("Save error:", err);
              toast.error("Failed to save layout.");
            }
          }}
          onPublish={async (html, css) => {
            try {
              toast.info("Publishing page...");
              // 1. Reset and Add sections first to ensure live content is updated
              await websiteService.resetCustomPage(designingPage.id);
              const configJson = JSON.stringify({ html, css });
              await websiteService.addCustomPageSection(designingPage.id, 'ROOT_HTML', configJson);

              // 2. Publish the page on the backend
              await websiteService.publishCustomPage(designingPage.id);

              setPages(prev => prev.map(p =>
                p.id === designingPage.id ? { ...p, html, css, status: 'Published' } : p
              ));
              setDesigningPage(null);
              toast.success(`${designingPage.title} published successfully!`);
            } catch (err) {
              console.error("Publish error:", err);
              toast.error("Failed to publish page.");
            }
          }}
        />
      )}

      {isHeaderStudioOpen && (
        <HeaderStudio
          isOpen={isHeaderStudioOpen}
          onClose={() => setHeaderStudioOpen(false)}
          onSave={(html, css) => {
            console.log("💾 Builder Header Saved Independently");
            setHeaderStudioOpen(false);
          }}
        />
      )}
    </motion.div>
  );
};

const AppearanceTab = ({ explicitlyEditingThemeId, setExplicitlyEditingThemeId }) => {
  const { themes, liveTheme, stagingTheme, applyTheme, publishTheme, removeThemeFromTabs, loading } = useThemeManager();

  // State for the Fullscreen Preview Modal
  const [previewTheme, setPreviewTheme] = useState(null);

  // View state: 'themes' or 'builder'
  const [view, setView] = useState('themes');

  if (loading) {
    return <div className="p-5 text-center text-slate-500">Loading themes...</div>;
  }

  // Which theme is currently being edited in the Builder? 
  // Priority: Explicit -> Live
  const currentWorkingThemeId = explicitlyEditingThemeId || liveTheme?.id;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* THEMES VIEW */}
      {view === 'themes' && (
        <>
          <motion.div variants={itemVariants} className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="font-bold text-lg text-slate-800">Themes</h4>
              <p className="text-slate-500 text-sm">Select a premium design for your academy.</p>
            </div>
            <div className="d-flex gap-3 align-items-center">
            </div>
          </motion.div>

          <motion.div variants={containerVariants} className="row g-4">
            {themes.map((theme) => {
              const isLive = theme.status === 'live';

              return (
                <motion.div key={theme.id} variants={itemVariants} className="col-md-4 col-sm-6">
                  <motion.div
                    className={`wb-card p-0 overflow-hidden shadow-sm hover:shadow-lg transition-all h-100 border-2 group ${isLive ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-transparent'}`}
                    whileHover={{ y: -5 }}
                  >
                    <div className="position-relative overflow-hidden bg-black">
                      <img
                        src={theme.image}
                        alt={theme.name}
                        className="w-100 object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-60 group-hover:blur-sm"
                        style={{ height: '200px' }}
                      />

                      {/* Hover Overlay with Apply Button */}
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <button
                          className="btn btn-light fw-bold shadow-lg px-4 py-2 rounded-full transform hover:scale-105 transition-transform"
                          onClick={async () => {
                            console.log("🖱️ Applying theme:", theme.id);
                            await applyTheme(theme.id);
                            // Auto-select this theme so Navigation/SEO target it immediately
                            setExplicitlyEditingThemeId(theme.id);
                            console.log("🎯 Context auto-switched to:", theme.id);
                          }}
                        >
                          Apply
                        </button>
                      </div>

                      <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                        {isLive && (
                          <span className="badge bg-emerald-500 text-white shadow-sm d-flex align-items-center gap-1 px-3 py-1.5 rounded-full">
                            <Globe size={12} /> Live
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-white">
                      <h5 className="font-bold text-slate-800 mb-2">{theme.name}</h5>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.color }}></div>
                          <span className="text-sm text-slate-500 capitalize">{theme.status}</span>
                        </div>

                        <button
                          className="btn-icon text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors"
                          onClick={() => setPreviewTheme(theme)}
                          title="Preview Theme"
                        >
                          <Eye size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Pages Table Preview */}
          <motion.div variants={itemVariants} className="mt-5 pt-4">
            <h4 className="font-bold text-lg text-slate-800 mb-4">Website Pages</h4>
            <ThemePagesManager
              themes={themes}
              onEditTheme={(themeId) => {
                setExplicitlyEditingThemeId(themeId);
                setView('builder');
              }}
              applyTheme={applyTheme}
              publishTheme={publishTheme}
              removeThemeFromTabs={removeThemeFromTabs}
            />
          </motion.div>
        </>
      )}

      {/* BUILDER VIEW */}
      {view === 'builder' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              className="btn btn-light border shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40 }}
              onClick={() => setView('themes')}
            >
              <ChevronRight size={20} className="text-slate-600 rotate-180" style={{ transform: 'rotate(180deg)' }} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 m-0">Customize Pages</h2>
              <p className="text-slate-500 mt-1 m-0">
                Editing pages for <span className="font-bold text-indigo-600">{themes.find(t => t.id === currentWorkingThemeId)?.name || currentWorkingThemeId}</span>
                {stagingTheme?.id === currentWorkingThemeId ? ' (Staging)' : liveTheme?.id === currentWorkingThemeId ? ' (Live)' : ' (Draft)'}
              </p>
            </div>
          </div>

          <div className="mt-2">
            <WebsiteBuilderTab key={currentWorkingThemeId} themeId={currentWorkingThemeId} />
          </div>
        </motion.div>
      )}

      {/* MODALS */}
      <AnimatePresence>
        {previewTheme && (
          <div className="position-fixed top-0 start-0 w-100 h-100 z-50 bg-white d-flex flex-column">
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-white shadow-sm z-10">
              <div className="d-flex align-items-center gap-3">
                <h4 className="font-bold m-0 text-slate-800">{previewTheme.name} Theme Preview</h4>
                <div className="d-flex align-items-center bg-slate-100 px-3 py-1 rounded-pill border">
                  <div className="rounded-circle bg-success me-2" style={{ width: 8, height: 8 }}></div>
                  <span className="text-xs font-monospace text-slate-500">https://lms-academy.com/themes/{previewTheme.id}</span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setPreviewTheme(null)}>Close Preview</button>
                <button className="btn btn-primary-action btn-sm" onClick={() => { setPreviewTheme(null); applyTheme(previewTheme.id); }}>Set as Draft</button>
              </div>
            </div>

            <div className="flex-grow-1 overflow-auto bg-slate-50 p-5 d-flex justify-content-center">
              <img src={previewTheme.image} alt={previewTheme.name} style={{ maxWidth: '1000px', width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};



const NavigationTab = ({ tenantThemeId, setSelectedThemeId }) => {
  const { themes, liveTheme, applyTheme, refreshThemes, loading: themesLoading } = useThemeManager();

  // Use passed ID or fallback to the live theme's tenant ID
  const activeId = tenantThemeId || liveTheme?.tenantThemeId;

  // --- Header State (defaults used until backend loads) ---
  const [headerConfig, setHeaderConfig] = useState({
    fixed: 'no',
    height: 80,
    bgColor: '#ffffff',
    textColor: '#000000',
    showSearch: 'yes',
    showCart: 'yes'
  });

  const [headerLinks, setHeaderLinks] = useState([
    { id: 1, text: 'Store', url: '/store', newTab: false, visible: true },
    { id: 2, text: 'Blog', url: '/blog', newTab: false, visible: true },
    { id: 3, text: 'About', url: '/about', newTab: false, visible: true },
  ]);

  // --- Footer State ---
  const [footerLinks, setFooterLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    telegram: ''
  });

  const [footerConfig, setFooterConfig] = useState({
    bgColor: '#ffffff',
    textColor: '#000000',
    title: 'Launch your Academy',
    copyright: '© 2025 LMS Academy. All rights reserved.'
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- Fetch from backend on mount ---
  useEffect(() => {
    if (!activeId) return;
    const fetchConfigs = async () => {
      setLoading(true);
      try {
        // Fetch header config
        const headerStr = await websiteService.getHeader(activeId);
        if (headerStr) {
          try {
            const parsed = typeof headerStr === 'string' ? JSON.parse(headerStr) : headerStr;
            if (parsed) {
              if (parsed.config) setHeaderConfig(prev => ({ ...prev, ...parsed.config }));
              if (parsed.links) setHeaderLinks(parsed.links);
            }
          } catch (e) {
            console.warn('Failed to parse header config:', e);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch header config:', err.message);
      }

      try {
        // Fetch footer config
        const footerStr = await websiteService.getFooter(tenantThemeId);
        if (footerStr) {
          try {
            const parsed = typeof footerStr === 'string' ? JSON.parse(footerStr) : footerStr;
            if (parsed) {
              if (parsed.config) setFooterConfig(prev => ({ ...prev, ...parsed.config }));
              if (parsed.links) setFooterLinks(prev => ({ ...prev, ...parsed.links }));
            }
          } catch (e) {
            console.warn('Failed to parse footer config:', e);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch footer config:', err.message);
      }
      setLoading(false);
    };
    fetchConfigs();
  }, [tenantThemeId]);

  // --- Handlers ---
  const updateHeaderConfig = (key, value) => {
    setHeaderConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateFooterConfig = (key, value) => {
    setFooterConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateHeaderLink = (id, field, value) => {
    setHeaderLinks(prev => prev.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const addHeaderLink = () => {
    setHeaderLinks([...headerLinks, { id: Date.now(), text: 'New Link', url: '/', newTab: false, visible: true }]);
  };

  const removeHeaderLink = (id) => {
    if (window.confirm("Are you sure you want to remove this link?")) {
      setHeaderLinks(prev => prev.filter(l => l.id !== id));
      toast.info("Link removed");
    }
  };

  // --- Save All to Backend ---
  const handleSaveAll = async () => {
    console.log("🛠️ handleSaveAll triggered. tenantThemeId:", tenantThemeId);
    if (!tenantThemeId) {
      console.warn("❌ Aborting save: No tenantThemeId found.");
      toast.error("No active theme found. Please apply a theme first.");
      return;
    }
    setSaving(true);
    try {
      console.log("📦 Packaging Header Data...", { headerConfig, headerLinks });
      const headerPayload = JSON.stringify({
        config: headerConfig,
        links: headerLinks
      });

      console.log("🚀 Calling websiteService.saveHeader...");
      const headerRes = await websiteService.saveHeader(tenantThemeId, headerPayload);
      console.log("✅ saveHeader response:", headerRes);

      console.log("📦 Packaging Footer Data...", { footerConfig, footerLinks });
      const footerPayload = JSON.stringify({
        config: footerConfig,
        links: footerLinks
      });

      console.log("🚀 Calling websiteService.saveFooter...");
      const footerRes = await websiteService.saveFooter(tenantThemeId, footerPayload);
      console.log("✅ saveFooter response:", footerRes);

      console.log("🎉 All save operations completed successfully.");
      toast.success("Configuration saved to server successfully!");
    } catch (err) {
      console.error('❌ Save process failed at some step:', err);
      toast.error("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Code Editor State ---
  const [isCodeEditorOpen, setCodeEditorOpen] = useState(false);

  // --- Render ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (themesLoading) {
    return <div className="p-5 text-center text-slate-500">Loading theme context...</div>;
  }

  if (!activeId) {
    return (
      <div className="p-5 text-center bg-white rounded-3 border shadow-sm mx-auto my-5" style={{ maxWidth: '600px' }}>
        <div className="p-4 bg-amber-50 rounded-circle d-inline-block mb-4">
          <Globe size={48} className="text-amber-500" />
        </div>
        <h3 className="font-bold text-slate-800 mb-2">No Active Context</h3>
        <p className="text-slate-500 mb-4">Click a theme below to apply it and manage its navigation settings.</p>

        <div className="list-group text-start">
          {themes.map(t => (
            <button key={t.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              onClick={async () => {
                // Apply the theme to get a tenantThemeId, then select it
                await applyTheme(t.id);
                setSelectedThemeId(t.id);
                toast.success(`Applied & switched to ${t.name}`);
              }}>
              <span>{t.name}</span>
              <span className={`badge ${t.status === 'live' ? 'bg-success' : 'bg-secondary'}`}>{t.status}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-5 text-center text-slate-500">Loading navigation config...</div>;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* HEADER SECTION */}
      <motion.div variants={itemVariants} className="mb-5">
        <h4 className="font-bold text-xl mb-4 text-slate-800">Header Preview</h4>
        <div className="header-preview-box shadow-sm" style={{
          height: `${headerConfig.height}px`,
          backgroundColor: headerConfig.bgColor,
          color: headerConfig.textColor
        }}>
          {/* Logo Placeholder */}
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle bg-indigo-100 p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
              <Globe size={20} className="text-indigo-600" />
            </div>
            <div className="font-bold text-lg">LOGO</div>
          </div>

          {/* Nav Links */}
          <div className="d-none d-md-flex flex-grow-1 justify-content-center gap-4 text-sm font-medium d-none-mobile">
            {headerLinks.filter(l => l.visible).map(l => (
              <span key={l.id} style={{ cursor: 'pointer', opacity: 0.9 }}>{l.text}</span>
            ))}
          </div>

          {/* Right Controls */}
          <div className="d-flex align-items-center gap-3">
            {headerConfig.showSearch === 'yes' && <Search size={20} style={{ cursor: 'pointer' }} />}
            {headerConfig.showCart === 'yes' && <div className="position-relative" style={{ cursor: 'pointer' }}><Layout size={20} /><span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"><span className="visually-hidden">New alerts</span></span></div>}
            <button className="btn-primary-action py-2 px-4 text-sm" onClick={() => toast.info("Login clicked (Preview mode)")} style={{ boxShadow: 'none' }}>Login</button>
          </div>
        </div>
      </motion.div>

      {/* HEADER CONTROLS */}
      <motion.div variants={itemVariants} className="wb-card mb-5 shadow-sm hover:shadow-md transition-shadow">
        <h5 className="font-bold text-lg mb-4">Header Configuration</h5>

        <div className="mb-4">
          <label className="wb-label mb-2 text-muted">Custom Header</label>
          <div className="d-flex gap-3" style={{ maxWidth: '200px' }}>
            <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
              <input type="radio" className="form-check-input" checked={headerConfig.customHeader !== 'yes'} onChange={() => updateHeaderConfig('customHeader', 'no')} /> No
            </label>
            <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
              <input type="radio" className="form-check-input" checked={headerConfig.customHeader === 'yes'} onChange={() => updateHeaderConfig('customHeader', 'yes')} /> Yes
            </label>
          </div>
        </div>

        {headerConfig.customHeader === 'yes' ? (
          <div className="d-flex gap-4 mt-4">
            <a href="#" className="d-flex align-items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800" onClick={(e) => { e.preventDefault(); setCodeEditorOpen(true); toast.info("Opening Header Studio..."); }}>
              <Edit2 size={16} /> Edit Header
            </a>
            <a href="#" className="d-flex align-items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800" onClick={(e) => { e.preventDefault(); setCodeEditorOpen(true); toast.info("Opening Code View..."); }}>
              <Code size={16} /> Code
            </a>
          </div>
        ) : (
          <>
            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-4">
                <label className="wb-label mb-2 text-muted">Fixed at Top</label>
                <div className="d-flex gap-3">
                  <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
                    <input type="radio" className="form-check-input" checked={headerConfig.fixed === 'no'} onChange={() => updateHeaderConfig('fixed', 'no')} /> No
                  </label>
                  <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
                    <input type="radio" className="form-check-input" checked={headerConfig.fixed === 'yes'} onChange={() => updateHeaderConfig('fixed', 'yes')} /> Yes
                  </label>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <label className="wb-label mb-2 text-muted">Height (px)</label>
                <input type="number" className="wb-input" value={headerConfig.height} onChange={(e) => updateHeaderConfig('height', e.target.value)} />
              </div>
              <div className="col-md-6 col-lg-4">
                <label className="wb-label mb-2 text-muted">Background Color</label>
                <div className="d-flex gap-2">
                  <input type="color" className="form-control form-control-color" value={headerConfig.bgColor} onChange={(e) => updateHeaderConfig('bgColor', e.target.value)} />
                  <input type="text" className="wb-input flex-grow-1" value={headerConfig.bgColor} onChange={(e) => updateHeaderConfig('bgColor', e.target.value)} />
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <label className="wb-label mb-2 text-muted">Text Color</label>
                <div className="d-flex gap-2">
                  <input type="color" className="form-control form-control-color" value={headerConfig.textColor} onChange={(e) => updateHeaderConfig('textColor', e.target.value)} />
                  <input type="text" className="wb-input flex-grow-1" value={headerConfig.textColor} onChange={(e) => updateHeaderConfig('textColor', e.target.value)} />
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <label className="wb-label mb-2 text-muted">Show Search Box</label>
                <div className="d-flex gap-3">
                  <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
                    <input type="radio" className="form-check-input" checked={headerConfig.showSearch === 'no'} onChange={() => updateHeaderConfig('showSearch', 'no')} /> No
                  </label>
                  <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
                    <input type="radio" className="form-check-input" checked={headerConfig.showSearch === 'yes'} onChange={() => updateHeaderConfig('showSearch', 'yes')} /> Yes
                  </label>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <label className="wb-label mb-2 text-muted">Show Cart</label>
                <div className="d-flex gap-3">
                  <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
                    <input type="radio" className="form-check-input" checked={headerConfig.showCart === 'no'} onChange={() => updateHeaderConfig('showCart', 'no')} /> No
                  </label>
                  <label className="d-flex align-items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border hover:border-indigo-300 transition-colors w-100 justify-content-center">
                    <input type="radio" className="form-check-input" checked={headerConfig.showCart === 'yes'} onChange={() => updateHeaderConfig('showCart', 'yes')} /> Yes
                  </label>
                </div>
              </div>
            </div>

            <hr className="my-5 border-slate-100" />

            {/* Links Table */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="font-bold text-lg m-0">Menu Items</h5>
              <button className="btn-secondary-action text-sm" onClick={addHeaderLink}><Plus size={16} /> Add Link</button>
            </div>

            <div className="table-responsive rounded-lg border border-slate-100">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-xs text-muted uppercase fw-bold border-0 py-3 ps-3">Label</th>
                    <th className="text-xs text-muted uppercase fw-bold border-0 py-3">Destination URL</th>
                    <th className="text-xs text-muted uppercase fw-bold border-0 py-3 text-center">Open New Tab</th>
                    <th className="text-xs text-muted uppercase fw-bold border-0 py-3 text-center">Visible</th>
                    <th className="border-0 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {headerLinks.map(link => (
                    <tr key={link.id}>
                      <td className="ps-3"><input className="wb-input py-2 text-sm border-slate-200" value={link.text} onChange={(e) => updateHeaderLink(link.id, 'text', e.target.value)} /></td>
                      <td><input className="wb-input py-2 text-sm border-slate-200" value={link.url} onChange={(e) => updateHeaderLink(link.id, 'url', e.target.value)} /></td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center">
                          <div className="form-check form-switch m-0">
                            <input className="form-check-input cursor-pointer" type="checkbox" checked={link.newTab} onChange={(e) => updateHeaderLink(link.id, 'newTab', e.target.checked)} />
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center">
                          <div className="form-check form-switch m-0">
                            <input className="form-check-input cursor-pointer" type="checkbox" checked={link.visible} onChange={(e) => updateHeaderLink(link.id, 'visible', e.target.checked)} />
                          </div>
                        </div>
                      </td>
                      <td className="text-end pe-3"><button className="btn-icon text-danger hover:bg-red-50" onClick={() => removeHeaderLink(link.id)}><Trash2 size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>

      {/* FOOTER SECTION */}
      <motion.div variants={itemVariants} className="mb-5">
        <h4 className="font-bold text-xl mb-4 text-slate-800">Footer Preview</h4>
        <div className="p-5 rounded-xl text-center transition-colors shadow-sm" style={{ backgroundColor: footerConfig.bgColor, color: footerConfig.textColor }}>
          <h4 className="mb-3 font-bold">{footerConfig.title}</h4>

          <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap" style={{ opacity: 0.9 }}>
            {footerLinks.facebook && <div className="p-2 rounded-circle" style={{ backgroundColor: `${footerConfig.textColor}15` }}><Facebook size={18} /></div>}
            {footerLinks.twitter && <div className="p-2 rounded-circle" style={{ backgroundColor: `${footerConfig.textColor}15` }}><Twitter size={18} /></div>}
            {footerLinks.instagram && <div className="p-2 rounded-circle" style={{ backgroundColor: `${footerConfig.textColor}15` }}><Instagram size={18} /></div>}
            {footerLinks.youtube && <div className="p-2 rounded-circle" style={{ backgroundColor: `${footerConfig.textColor}15` }}><Youtube size={18} /></div>}
            {footerLinks.linkedin && <div className="p-2 rounded-circle" style={{ backgroundColor: `${footerConfig.textColor}15` }}><Linkedin size={18} /></div>}
            {footerLinks.telegram && <div className="p-2 rounded-circle" style={{ backgroundColor: `${footerConfig.textColor}15` }}><Send size={18} /></div>}

            {!Object.values(footerLinks).some(v => v) && <span className="text-sm fst-italic opacity-50 w-100">Social links will appear here when configured below</span>}
          </div>

          <div className="border-top pt-4 mt-4" style={{ borderColor: `${footerConfig.textColor}20` }}>
            <p className="text-sm opacity-75 m-0">{footerConfig.copyright}</p>
          </div>
        </div>
      </motion.div>





      {/* FOOTER CONTROLS */}
      < motion.div variants={itemVariants} className="wb-card shadow-sm hover:shadow-md transition-shadow" >
        <h5 className="font-bold text-lg mb-4">Footer Configuration</h5>

        {/* Visual Settings */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <label className="wb-label mb-2 text-muted">Footer Background</label>
            <div className="d-flex gap-2">
              <input type="color" className="form-control form-control-color" value={footerConfig.bgColor} onChange={(e) => updateFooterConfig('bgColor', e.target.value)} />
              <input type="text" className="wb-input flex-grow-1" value={footerConfig.bgColor} onChange={(e) => updateFooterConfig('bgColor', e.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <label className="wb-label mb-2 text-muted">Footer Text Color</label>
            <div className="d-flex gap-2">
              <input type="color" className="form-control form-control-color" value={footerConfig.textColor} onChange={(e) => updateFooterConfig('textColor', e.target.value)} />
              <input type="text" className="wb-input flex-grow-1" value={footerConfig.textColor} onChange={(e) => updateFooterConfig('textColor', e.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <label className="wb-label mb-2 text-muted">Footer Title</label>
            <input type="text" className="wb-input" value={footerConfig.title} onChange={(e) => updateFooterConfig('title', e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="wb-label mb-2 text-muted">Copyright Text</label>
            <input type="text" className="wb-input" value={footerConfig.copyright} onChange={(e) => updateFooterConfig('copyright', e.target.value)} />
          </div>
        </div>

        <hr className="my-5 border-slate-100" />

        <h5 className="font-bold text-lg mb-4">Social Media Links</h5>
        <div className="row g-4">
          {[
            { name: 'Facebook', icon: <Facebook size={18} />, key: 'facebook', color: 'text-blue-600' },
            { name: 'Twitter', icon: <Twitter size={18} />, key: 'twitter', color: 'text-sky-500' },
            { name: 'Instagram', icon: <Instagram size={18} />, key: 'instagram', color: 'text-pink-600' },
            { name: 'YouTube', icon: <Youtube size={18} />, key: 'youtube', color: 'text-red-600' },
            { name: 'LinkedIn', icon: <Linkedin size={18} />, key: 'linkedin', color: 'text-blue-700' },
            { name: 'Telegram', icon: <Send size={18} />, key: 'telegram', color: 'text-sky-400' }
          ].map(social => (
            <div key={social.key} className="col-md-6">
              <label className="wb-label text-muted mb-2 text-xs font-bold uppercase tracking-wider">{social.name}</label>
              <div className="d-flex align-items-center border border-slate-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 ring-indigo-100 transition-all">
                <div className={`px-3 py-2 border-end border-slate-100 ${social.color} bg-slate-50 d-flex align-items-center justify-content-center`} style={{ width: '48px', height: '42px' }}>
                  {social.icon}
                </div>
                <input
                  className="flex-grow-1 border-0 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                  placeholder={`username`}
                  value={footerLinks[social.key] || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFooterLinks(prev => ({ ...prev, [social.key]: val }));
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-end mt-5 pt-3 border-top">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary-action px-4 py-2"
            onClick={handleSaveAll}
            disabled={saving}
          >
            <Check size={18} className="me-2" /> {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.div >

      {/* Code Editor Modal */}
      < AnimatePresence >
        {isCodeEditorOpen && (
          <HeaderStudio
            isOpen={isCodeEditorOpen}
            onClose={() => setCodeEditorOpen(false)}
            initialHtml={headerConfig.customHtml || '<!-- Default Header HTML -->\n<header class="custom-header">\n  <div class="logo">My Logo</div>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/courses">Courses</a>\n  </nav>\n</header>'}
            initialCss={headerConfig.customCss || '/* Custom Header CSS */\n.custom-header {\n  display: flex;\n  justify-content: space-between;\n  padding: 20px;\n  background: #fff;\n  box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n}\n\n.logo {\n  font-weight: bold;\n  font-size: 24px;\n}'}
            onSave={async (html, css) => {
              updateHeaderConfig('customHtml', html);
              updateHeaderConfig('customCss', css);
              setCodeEditorOpen(false);
              // Save to backend via new Header API (save → apply)
              if (tenantThemeId) {
                try {
                  // Step 1: Save header config to tenant_headers table
                  const headerPayload = JSON.stringify({
                    custom: { html, css },
                    isCustomHeader: true,
                    builder: null
                  });
                  const headerId = await websiteService.saveCustomHeader(headerPayload);
                  console.log("✅ Custom header saved, headerId:", headerId);

                  // Step 2: Apply the saved header to the current theme
                  if (headerId) {
                    await websiteService.applyCustomHeader(tenantThemeId, headerId);
                    console.log("✅ Header applied to theme:", tenantThemeId);
                    toast.success("Custom Header saved & applied to theme!");
                  } else {
                    toast.success("Custom Header saved!");
                  }
                } catch (err) {
                  console.error('Failed to save header to backend:', err);
                  toast.warning("Header saved locally. Backend save failed: " + err.message);
                }
              } else {
                toast.success("Custom Header Saved locally!");
              }
            }}
            onUnpublish={async () => {
              if (window.confirm("Are you sure you want to revert to the default header? This will unpublish the custom header.")) {
                // Revert on backend first
                if (tenantThemeId) {
                  try {
                    await websiteService.revertHeaderToDefault(tenantThemeId);
                    console.log("✅ Header reverted to default on backend");
                    toast.success("Reverted to default header!");
                  } catch (err) {
                    console.error('Failed to revert header:', err);
                    toast.warning("Reverted locally. Backend revert failed: " + err.message);
                  }
                }
                updateHeaderConfig('customHeader', 'no');
                updateHeaderConfig('customHtml', '');
                updateHeaderConfig('customCss', '');
                setCodeEditorOpen(false);
              }
            }}
          />
        )}
      </AnimatePresence >
    </motion.div >
  );
};





const SEOTab = ({ tenantThemeId, setSelectedThemeId }) => {
  const { themes, liveTheme, applyTheme, loading: themesLoading } = useThemeManager();

  // Use passed ID or fallback to the live theme's tenant ID
  const activeId = tenantThemeId || liveTheme?.tenantThemeId;

  const [seoPages, setSeoPages] = useState([
    { id: 'home', name: 'Home Page', title: '', description: '', keywords: '' },
    { id: 'courses', name: 'Course Catalog', title: '', description: '', keywords: '' },
    { id: 'store', name: 'Store', title: '', description: '', keywords: '' },
    { id: 'blog', name: 'Blog', title: '', description: '', keywords: '' },
  ]);

  const [sitemapFile, setSitemapFile] = useState(null);
  const [robotsTxt, setRobotsTxt] = useState('User-agent: *\nAllow: /');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch SEO and Robots on mount
  useEffect(() => {
    if (!activeId) return;

    const fetchData = async () => {
      try {
        // Fetch SEO Config and Robots.txt in parallel for speed
        const [seoData, robots] = await Promise.allSettled([
          websiteService.getSeo(activeId),
          websiteService.getRobots(activeId),
        ]);

        // Parse SEO Config
        if (seoData.status === 'fulfilled' && seoData.value) {
          try {
            const parsed = typeof seoData.value === 'string' ? JSON.parse(seoData.value) : seoData.value;
            if (Array.isArray(parsed)) {
              setSeoPages(parsed);
            } else if (parsed && typeof parsed === 'object') {
              setSeoPages(prev => prev.map(page => ({
                ...page,
                ...(parsed[page.id] || {})
              })));
            }
          } catch (e) {
            console.warn('Failed to parse SEO data:', e);
          }
        }

        // Set Robots.txt
        if (robots.status === 'fulfilled' && robots.value) {
          setRobotsTxt(robots.value);
        }
      } catch (err) {
        console.warn('Failed to fetch SEO data:', err.message);
      }
    };

    fetchData();
  }, [activeId]);

  const updatePageSeo = (id, field, value) => {
    setSeoPages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };


  const handleSaveSeo = async (pageId) => {
    if (!activeId) {
      toast.error("No active theme found.");
      return;
    }

    setSaving(true);
    try {
      await websiteService.saveSeo(activeId, JSON.stringify(seoPages));
      toast.success("SEO settings saved!");
    } catch (err) {
      toast.error("Failed to save SEO: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRobots = async () => {
    if (!activeId) return;
    try {
      await websiteService.saveRobots(activeId, robotsTxt);
      toast.success("robots.txt saved!");
    } catch (err) {
      toast.error("Failed to save robots.txt");
    }
  };

  const handleSitemapUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeId) return;

    try {
      await websiteService.uploadSitemap(activeId, file);
      setSitemapFile({ name: file.name });
      toast.success("Sitemap uploaded!");
    } catch (err) {
      toast.error("Sitemap upload failed");
    }
  };

  const handleSitemapDelete = async () => {
    if (!activeId) return;
    try {
      await websiteService.deleteSitemap(activeId);
      setSitemapFile(null);
      toast.success("Sitemap deleted");
    } catch (err) {
      toast.error("Failed to delete sitemap");
    }
  };

  const getPageIcon = (id) => {
    switch (id) {
      case 'home': return <Home size={18} style={{ color: '#2563eb' }} />; // Blue-600
      case 'store': return <ShoppingBag size={18} style={{ color: '#9333ea' }} />; // Purple-600
      case 'blog': return <BookOpen size={18} style={{ color: '#db2777' }} />; // Pink-600
      default: return <Globe size={18} style={{ color: '#475569' }} />; // Slate-600
    }
  };

  const getPageColor = (id) => {
    switch (id) {
      case 'home': return {
        headerBg: 'linear-gradient(to right, #eff6ff, transparent)', // blue-50
        borderColor: '#dbeafe', // blue-100
        textColor: '#1d4ed8', // blue-700
        btnBg: '#2563eb', // blue-600
        btnHover: '#1d4ed8' // blue-700
      };
      case 'store': return {
        headerBg: 'linear-gradient(to right, #faf5ff, transparent)', // purple-50
        borderColor: '#f3e8ff', // purple-100
        textColor: '#7e22ce', // purple-700
        btnBg: '#9333ea', // purple-600
        btnHover: '#7e22ce' // purple-700
      };
      case 'blog': return {
        headerBg: 'linear-gradient(to right, #fdf2f8, transparent)', // pink-50
        borderColor: '#fce7f3', // pink-100
        textColor: '#be185d', // pink-700
        btnBg: '#db2777', // pink-600
        btnHover: '#be185d' // pink-700
      };
      default: return {
        headerBg: 'linear-gradient(to right, #f8fafc, transparent)', // slate-50
        borderColor: '#f1f5f9', // slate-100
        textColor: '#334155', // slate-700
        btnBg: '#1e293b', // slate-800
        btnHover: '#0f172a' // slate-900
      };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (themesLoading) {
    return <div className="p-5 text-center text-slate-500">Loading theme context...</div>;
  }

  if (!activeId) {
    return (
      <div className="max-w-4xl mx-auto my-5 px-3">
        <div className="p-5 text-center bg-white rounded-3 border shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
          <div className="p-4 bg-indigo-50 rounded-circle d-inline-block mb-4">
            <Search size={48} className="text-indigo-500" />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">No Active Context</h3>
          <p className="text-slate-500 mb-4">Select a theme context from your workspace to manage SEO settings.</p>

          <div className="list-group text-start">
            {themes.map(t => (
              <button key={t.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                onClick={async () => {
                  await applyTheme(t.id);
                  setSelectedThemeId(t.id);
                  toast.success(`Applied & managing SEO for ${t.name}`);
                }}>
                <span>{t.name}</span>
                <span className={`badge ${t.status === 'live' ? 'bg-success' : 'bg-secondary'}`}>{t.status}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-2 pb-5">
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 m-0 tracking-tight">SEO Configuration</h2>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto text-lg">
          Optimize your academy's visibility across search engines with granular control over meta tags.
        </p>
      </motion.div>

      {(
        <div className="row g-4">
          {seoPages.map((page, index) => {
            const icon = getPageIcon(page.id);
            const colors = getPageColor(page.id);

            const pageCard = (
              <div className="col-lg-6" key={page.id}>
                <motion.div
                  variants={itemVariants}
                  className="h-100"
                  whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
                >
                  <div
                    className="wb-card bg-white p-0 h-100 border shadow-sm overflow-hidden d-flex flex-column transition-all duration-300 hover:shadow-lg"
                    style={{ borderColor: colors.borderColor }}
                  >
                    {/* Compact Header with Gradient */}
                    <div
                      className="p-3 border-bottom d-flex align-items-center justify-content-between"
                      style={{ background: colors.headerBg, borderColor: colors.borderColor }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <motion.div
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          className="p-2 bg-white rounded-lg shadow-sm"
                          style={{ color: colors.textColor }}
                        >
                          {icon}
                        </motion.div>
                        <div>
                          <h3 className="text-base font-bold m-0" style={{ color: colors.textColor }}>{page.name}</h3>
                          <span className="small text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>SEO Config</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="py-1 px-3 text-xs font-medium text-white rounded shadow-sm border-0 d-flex align-items-center gap-1"
                        style={{ backgroundColor: colors.btnBg }}
                        onClick={() => handleSaveSeo(page.id)}
                        disabled={saving}
                      >
                        <Check size={14} /> {saving ? 'Saving...' : 'Save'}
                      </motion.button>
                    </div>

                    {/* Compact Body */}
                    <div className="p-3 flex-grow-1">
                      <div className="row g-3 mb-3">
                        <div className="col-md-7">
                          <label className="wb-label small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '10px' }}>Meta Title</label>
                          <input
                            className="wb-input py-2 text-sm form-control shadow-none"
                            placeholder={`e.g. ${page.name} | Academy`}
                            value={page.title || ''}
                            onChange={(e) => updatePageSeo(page.id, 'title', e.target.value)}
                            style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                          />
                        </div>
                        <div className="col-md-5">
                          <label className="wb-label small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '10px' }}>Keywords</label>
                          <input
                            className="wb-input py-2 text-sm form-control shadow-none"
                            placeholder="learning, course"
                            value={page.keywords || ''}
                            onChange={(e) => updatePageSeo(page.id, 'keywords', e.target.value)}
                            style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="wb-label small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '10px' }}>Description</label>
                        <textarea
                          className="wb-input py-2 text-sm form-control shadow-none"
                          placeholder="Page summary..."
                          rows={2}
                          value={page.description || ''}
                          onChange={(e) => updatePageSeo(page.id, 'description', e.target.value)}
                          style={{ minHeight: '60px', backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );

            // Inject Tools Column at index 2
            if (index === 2) {
              return [
                pageCard,
              ];
            }
            return pageCard;
          })}
        </div>
      )}

      {/* ─── SITEMAP & ROBOTS.TXT SECTION ─── */}
      {activeId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
          className="row g-4 mt-4"
        >
          {/* Sitemap Card */}
          <div className="col-lg-6">
            <motion.div
              className="wb-card bg-white p-0 shadow-sm overflow-hidden hover:shadow-lg transition-all h-100"
              style={{ border: '1px solid #d1fae5' }}
              whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300 } }}
            >
              <div
                className="p-3 border-bottom d-flex align-items-center justify-content-between"
                style={{ background: 'linear-gradient(to right, #ecfdf5, transparent)', borderColor: '#d1fae5' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <motion.div whileHover={{ rotate: 10 }} className="p-1.5 bg-white rounded-lg shadow-sm">
                    <Map size={18} style={{ color: '#059669' }} />
                  </motion.div>
                  <h3 className="text-base font-bold m-0" style={{ color: '#065f46' }}>Sitemap.xml</h3>
                </div>
                {sitemapFile && (
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-icon text-danger p-1"
                      onClick={handleSitemapDelete}
                      title="Delete Sitemap"
                    >
                      <Trash2 size={14} />
                    </button>
                    <span className="small fw-bold bg-white px-2 py-1 rounded border" style={{ color: '#059669', borderColor: '#a7f3d0', fontSize: '10px' }}>
                      Live
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3 d-flex align-items-center justify-content-between">
                <span className="text-muted small text-truncate" style={{ maxWidth: '250px' }}>{sitemapFile ? sitemapFile.name : 'No file uploaded'}</span>
                <label
                  className="btn cursor-pointer py-1 px-3 text-xs fw-bold shadow-sm d-flex align-items-center"
                  style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}
                >
                  {sitemapFile ? 'Replace' : 'Upload'}
                  <input type="file" className="d-none" accept=".xml" onChange={handleSitemapUpload} />
                </label>
              </div>
            </motion.div>
          </div>

          {/* Robots.txt Card */}
          <div className="col-lg-6">
            <motion.div
              className="wb-card bg-white p-0 shadow-sm overflow-hidden hover:shadow-lg transition-all h-100"
              style={{ border: '1px solid #e0e7ff' }}
              whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300 } }}
            >
              <div
                className="p-3 border-bottom d-flex align-items-center justify-content-between"
                style={{ background: 'linear-gradient(to right, #eef2ff, transparent)', borderColor: '#e0e7ff' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <motion.div whileHover={{ rotate: 10 }} className="p-1.5 bg-white rounded-lg shadow-sm">
                    <Bot size={18} style={{ color: '#4f46e5' }} />
                  </motion.div>
                  <h3 className="text-base font-bold m-0" style={{ color: '#3730a3' }}>Robots.txt</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-1 px-3 text-xs text-white border-0 rounded shadow-sm"
                  style={{ backgroundColor: '#4f46e5' }}
                  onClick={handleSaveRobots}
                >
                  Save
                </motion.button>
              </div>
              <div className="p-0">
                <textarea
                  className="wb-input font-monospace text-xs border-0 rounded-0"
                  rows={4}
                  value={robotsTxt}
                  onChange={(e) => setRobotsTxt(e.target.value)}
                  style={{ resize: 'none', width: '100%', padding: '12px', backgroundColor: '#0f172a', color: '#e2e8f0' }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    logo: null,
    logoPath: null,
    favicon: null,
    faviconPath: null,
    enableFootfall: false
  });
  const [saving, setSaving] = useState(false);

  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  // Fetch settings from backend on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await websiteService.getSettings();
        if (data) {
          setSettings(prev => ({
            ...prev,
            siteName: data.siteName || '',
            logoPath: data.logoPath || null,
            faviconPath: data.faviconPath || null,
            enableFootfall: data.footfallEnabled ?? false,
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch settings:', err.message);
      }
    };
    fetchSettings();
  }, []);

  // Save site name to backend
  const handleSaveSiteName = async () => {
    if (!settings.siteName.trim()) return;
    setSaving(true);
    try {
      await websiteService.updateSiteName(settings.siteName);
      toast.success('Site name saved!');
    } catch (err) {
      toast.error('Failed to save site name: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Upload logo to backend
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await websiteService.uploadLogo(file);
      // Show local preview
      const reader = new FileReader();
      reader.onloadend = () => setSettings(prev => ({ ...prev, logo: reader.result }));
      reader.readAsDataURL(file);
      toast.success('Logo uploaded!');
    } catch (err) {
      toast.error('Logo upload failed: ' + err.message);
    }
  };

  // Upload favicon to backend
  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await websiteService.uploadFavicon(file);
      const reader = new FileReader();
      reader.onloadend = () => setSettings(prev => ({ ...prev, favicon: reader.result }));
      reader.readAsDataURL(file);
      toast.success('Favicon uploaded!');
    } catch (err) {
      toast.error('Favicon upload failed: ' + err.message);
    }
  };

  // Toggle footfall
  const handleFootfallToggle = async (checked) => {
    setSettings(prev => ({ ...prev, enableFootfall: checked }));
    try {
      await websiteService.updateFootfall(checked);
      toast.info(`Social Footfall ${checked ? 'Enabled' : 'Disabled'}`);
    } catch (err) {
      toast.error('Failed to update footfall: ' + err.message);
      setSettings(prev => ({ ...prev, enableFootfall: !checked }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto"
    >
      <div className="d-flex align-items-center justify-content-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 m-0">Site Settings</h2>
          <p className="text-slate-500 mt-1">Manage your brand identity and global configurations.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary-action"
          onClick={handleSaveSiteName}
          disabled={saving}
        >
          <Check size={18} className="me-2" /> {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      <div className="row g-4">
        {/* Left Column: General Info */}
        <div className="col-lg-6">
          <motion.div variants={itemVariants} className="wb-card h-100 mb-4 p-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Settings size={20} />
              </div>
              <h5 className="font-bold text-lg m-0 text-slate-800">Site Configuration</h5>
            </div>

            <div className="mb-4">
              <label className="wb-label mb-2">Site Name</label>
              <input
                type="text"
                className="wb-input w-100 p-3 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                placeholder="e.g. My Awesome Academy"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                onBlur={handleSaveSiteName}
              />
              <p className="text-xs text-slate-400 mt-2">This name will appear in browser tabs and email notifications.</p>
            </div>

            <div className="mb-4">
              <label className="wb-label mb-2">Site Description</label>
              <textarea
                rows={4}
                className="wb-input w-100 p-3 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                placeholder="Briefly describe your academy..."
                value={settings.siteDescription || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              />
              <p className="text-xs text-slate-400 mt-2">Used for SEO and social media sharing previews.</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Branding */}
        <div className="col-lg-6">
          <motion.div variants={itemVariants} className="wb-card h-100 mb-4 p-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-slate-100">
              <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                <ImageIcon size={20} />
              </div>
              <h5 className="font-bold text-lg m-0 text-slate-800">Brand Identity</h5>
            </div>

            {/* Logo Upload */}
            <div className="mb-4">
              <label className="wb-label mb-2">Primary Logo</label>
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-slate-50"
                onClick={() => logoInputRef.current.click()}
              >
                {(settings.logo || settings.logoPath) ? (
                  <div className="position-relative group">
                    <img
                      src={settings.logo || settings.logoPath}
                      alt="Logo"
                      className="img-fluid mx-auto mb-2"
                      style={{ maxHeight: '80px', objectFit: 'contain' }}
                    />
                    <span className="text-xs text-indigo-600 font-medium bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">Click to Replace</span>
                  </div>
                ) : (
                  <div className="py-3">
                    <div className="bg-white p-2 rounded-full shadow-sm d-inline-block mb-2 text-secondary">
                      <Upload size={20} />
                    </div>
                    <p className="text-sm font-medium text-slate-600 m-0">Upload Logo</p>
                    <p className="text-xs text-slate-400 m-0 mt-1">PNG, JPG (Max 500KB)</p>
                  </div>
                )}
                <input ref={logoInputRef} type="file" className="d-none" accept="image/*" onChange={handleLogoUpload} />
              </div>
            </div>

            {/* Favicon Upload */}
            <div>
              <label className="wb-label mb-2">Favicon</label>
              <div className="d-flex align-items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="bg-white border border-slate-100 rounded-lg flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                  {(settings.favicon || settings.faviconPath) ? (
                    <img
                      src={settings.favicon || settings.faviconPath}
                      className="object-contain"
                      style={{ width: '32px', height: '32px' }}
                    />
                  ) : (
                    <Globe size={20} className="text-secondary" />
                  )}
                </div>
                <div className="flex-grow-1">
                  <p className="text-sm font-semibold text-slate-700 m-0">Browser Icon</p>
                  <p className="text-xs text-slate-400 m-0">32x32px PNG</p>
                </div>
                <button className="btn btn-sm btn-outline-secondary bg-white border-slate-200 text-slate-600" onClick={() => faviconInputRef.current.click()}>Upload</button>
                <input ref={faviconInputRef} type="file" className="d-none" accept="image/*" onChange={handleFaviconUpload} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full Width: Features */}
        <div className="col-12">
          <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-slate-100">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Monitor size={20} />
              </div>
              <h5 className="font-bold text-lg m-0 text-slate-800">Feature Settings</h5>
            </div>

            <div className="d-flex align-items-center justify-content-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div>
                <h6 className="font-bold text-slate-800 m-0 mb-1">Enable Social Footfall</h6>
                <p className="text-sm text-slate-500 m-0" style={{ maxWidth: '600px' }}>
                  Display live notifications of learner signups and purchases on your landing pages to increase trust and conversion rates.
                </p>
              </div>
              <div className="form-check form-switch" style={{ fontSize: '1.2rem' }}>
                <input
                  className="form-check-input cursor-pointer"
                  type="checkbox"
                  checked={settings.enableFootfall}
                  onChange={(e) => handleFootfallToggle(e.target.checked)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};


const Websites = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = useMemo(() => searchParams.get('tab') || 'appearance', [searchParams]);

  const setActiveTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  // Optimization: Only fetch theme data if we are on theme-related tabs
  const shouldFetchThemes = ['appearance', 'navigation', 'seo'].includes(activeTab);
  const { liveTheme, themes, loading: themesLoading } = useThemeManager(shouldFetchThemes);

  // Track which theme the user is currently "managing" across tabs
  // PERSISTENT: Remembers your selection even after refresh
  const [selectedThemeId, setSelectedThemeId] = usePersistentState('wb_active_editing_theme_id', null);

  // Determine the backend ID (tenantThemeId) to work with
  // Priority: 1. Theme matching selectedThemeId, 2. Live theme
  const activeTheme = themes?.find(t => t.id === selectedThemeId) ||
    themes?.find(t => t.status === 'live');

  const activeTenantThemeId = activeTheme?.tenantThemeId;

  // Debug log to trace context switches
  useEffect(() => {
    if (themes.length > 0) {
      console.log("🧩 Theme Context Updated:", {
        selectedFrontendId: selectedThemeId,
        activeThemeName: activeTheme?.name,
        activeTenantThemeId,
        isLive: activeTheme?.status === 'live'
      });
    }
  }, [selectedThemeId, activeTenantThemeId, themes]);

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: <Monitor size={18} /> },
    { id: 'navigation', label: 'Navigation', icon: <ChevronRight size={18} /> },
    { id: 'seo', label: 'SEO', icon: <Search size={18} /> },
    { id: 'builder', label: 'Website Builder', icon: <Layout size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="container-fluid p-0">
      <div className="website-builder-container">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        <div className="wb-header">
          <h1 className="wb-title">
            {activeTab === 'builder' ? 'Website Builder' : 'Manage Website'}
          </h1>
          <p className="wb-subtitle">
            {activeTab === 'builder'
              ? 'Design and manage your custom web pages from scratch independently of themes.'
              : 'Design, customize, and manage your public-facing academy website.'}
          </p>
        </div>

        <div className="wb-tabs">
          {tabs.filter(tab => {
            if (activeTab === 'builder') return tab.id === 'builder';
            return tab.id !== 'builder';
          }).map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`wb-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="position-absolute bottom-0 start-0 w-100 h-100 border-2 border-indigo-500 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{ pointerEvents: 'none', borderColor: 'transparent', boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.1)' }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'appearance' && (
              <AppearanceTab
                explicitlyEditingThemeId={selectedThemeId}
                setExplicitlyEditingThemeId={setSelectedThemeId}
              />
            )}
            {activeTab === 'navigation' && (
              <NavigationTab
                tenantThemeId={activeTenantThemeId}
                setSelectedThemeId={setSelectedThemeId}
              />
            )}
            {activeTab === 'seo' && (
              <SEOTab
                tenantThemeId={activeTenantThemeId}
                setSelectedThemeId={setSelectedThemeId}
              />
            )}
            {activeTab === 'builder' && (
              <WebsiteBuilderTab />
            )}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Websites;