import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout, Globe, Search, Settings,
  Plus, Edit2, Eye, Trash2, GripVertical,
  Check, ChevronRight, Upload, Link, X, Monitor, Code, Maximize, Columns,
  Facebook, Twitter, Instagram, Youtube, Linkedin, Send, Image as ImageIcon,
  Home, ShoppingBag, BookOpen, Map, Bot, RotateCcw, Copy, Smartphone, Tablet, Undo, Redo
} from 'lucide-react';
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
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [key, state]);

  return [state, setState];
};

// --- Custom Hook for Theme Management (Backend Integrated) ---
const useThemeManager = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for tracking visible themes (tabs)
  const [visibleThemeIds, setVisibleThemeIds] = usePersistentState('wb_visible_theme_ids', []);

  // State for tracking applied theme IDs (templateId -> tenantThemeId)
  const [appliedThemeIds, setAppliedThemeIds] = usePersistentState('wb_applied_theme_map', {});



  // Fetch themes from backend
  const fetchThemes = async () => {
    try {
      setLoading(true);
      const templates = await websiteService.getAvailableThemes();

      // Map backend data to frontend format
      const mappedThemes = templates.map(template => {
        // Check if this theme is already "applied" / visible in tabs
        // If backend returns tenant_theme_id, use it. Otherwise, use template ID as fallback key.
        const isVisible = visibleThemeIds.includes(`template-${template.theme_id}`);

        // Check if we have a locally stored tenantThemeId for this template
        const storedTenantThemeId = appliedThemeIds ? appliedThemeIds[`template-${template.theme_id}`] : null;

        return {
          id: `template-${template.theme_id}`,
          themeTemplateId: template.theme_id,
          name: template.name,
          image: template.preview_image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
          color: '#8b5cf6', // Default color
          status: isVisible ? 'draft' : 'draft', // If visible, it's effectively a draft we are working on
          isVisible: isVisible,
          // Use backend provided ID if available, else fallback to local map
          tenantThemeId: template.tenant_theme_id || storedTenantThemeId || null
        };
      });

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
    fetchThemes();
  }, [visibleThemeIds, appliedThemeIds]); // Refetch when IDs change

  const liveTheme = themes.find(t => t.status === 'live') || themes[0];

  const applyTheme = async (id) => {
    const theme = themes.find(t => t.id === id);
    if (!theme || !theme.themeTemplateId) {
      toast.error('Invalid theme');
      return;
    }

    try {
      const response = await websiteService.applyTheme(theme.themeTemplateId);

      // Attempt to capture tenantThemeId from response (supporting potential backend fix)
      let newTenantThemeId = null;
      if (response && typeof response === 'object' && response.tenantThemeId) {
        newTenantThemeId = response.tenantThemeId;
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
      toast.error('No theme to publish');
      return;
    }

    try {
      await websiteService.publishTheme(tenantThemeId);
      toast.success("Theme published as LIVE!");
      // Refresh themes
      await fetchThemes();
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
            <option>Course Catalog</option>
            <option>About / Info</option>
            <option>Legal / Policy</option>
            <option>Blog Post</option>
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
            const statusLabel = theme.status === 'live' ? 'Live' : 'Draft';


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
                  {theme.name}
                  <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    {statusLabel}
                  </span>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="position-absolute bottom-0 start-0 w-100 bg-indigo-600"
                    style={{ height: '3px', borderRadius: '4px 4px 0 0' }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Glow effect for active tab */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="position-absolute bottom-0 start-0 w-100"
                    style={{
                      height: '20px',
                      background: 'linear-gradient(to top, rgba(79, 70, 229, 0.1), transparent)',
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
            <button className="btn btn-primary btn-sm bg-indigo-600 border-indigo-600 hover:bg-indigo-700" onClick={() => publishTheme(activeTheme?.tenantThemeId)}>
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
          onViewBuilder={() => onEditTheme(activeTabId)}
        />
      </div>
    </div>
  );
};

// Default pages configuration for any new theme
const DEFAULT_THEME_PAGES = [
  { id: 1, title: 'Home', url: '/', type: 'Landing Page', status: 'Published' },
  { id: 2, title: 'Course Landing Page', url: '', type: 'System', status: 'Published' },
  { id: 3, title: 'Checkout Success Page', url: '', type: 'System', status: 'Published' },
  { id: 4, title: 'Membership Page', url: '/membership', type: 'System', status: 'Published' },
  { id: 5, title: 'Contact Us', url: '/contactus', type: 'System', status: 'Published' },
  { id: 6, title: 'About Us', url: '/aboutus', type: 'System', status: 'Published' },
  { id: 7, title: 'About Us iOS App', url: '/aboutus-ios', type: 'System', status: 'Published' },
  { id: 8, title: 'FAQs', url: '/faqs', type: 'System', status: 'Published' },
  { id: 9, title: 'FAQs iOS App', url: '/faqs-ios', type: 'System', status: 'Published' },
  { id: 10, title: 'Terms of Use', url: '/termsofuse', type: 'System', status: 'Published' },
  { id: 11, title: 'Privacy Policy', url: '/privacypolicy', type: 'System', status: 'Published' },
  { id: 12, title: 'Refund Policy', url: '/refundpolicy', type: 'System', status: 'Published' },
];

const ThemePagesOverview = ({ themeId, onViewBuilder }) => {
  const storageKey = `lms_wb_pages_v2_${themeId}`;
  // Initialize with DEFAULT_THEME_PAGES so every theme has pages by default
  const [pages, setPages] = usePersistentState(storageKey, DEFAULT_THEME_PAGES);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to RESET the page configuration for this theme? This will revert all pages to the default set and cannot be undone.")) {
      setPages(DEFAULT_THEME_PAGES);
      toast.info("Theme pages reset to defaults.");
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="bg-white">
          <tr>
            <th className="py-4 ps-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-0" style={{ width: '40%' }}>Title</th>
            <th className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-0" style={{ width: '30%' }}>URI</th>
            <th className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-0 text-center" style={{ width: '15%' }}>Customize</th>
            <th className="py-4 pe-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-0 text-end" style={{ width: '15%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(pages || []).slice(0, 5).map(page => (
            <tr key={page.id} className="group hover:bg-slate-50 transition-colors">
              <td className="ps-4 py-4 border-0 border-bottom border-slate-50">
                <span className="text-sm font-normal text-slate-700">{page.title}</span>
              </td>
              <td className="py-4 border-0 border-bottom border-slate-50">
                <span className="text-sm text-slate-500">{page.url || '-'}</span>
              </td>
              <td className="py-4 border-0 border-bottom border-slate-50 text-center">
                <button
                  onClick={onViewBuilder}
                  className="btn btn-link p-0 text-indigo-600 text-sm hover:text-indigo-800 text-decoration-none"
                >
                  Edit
                </button>
              </td>
              <td className="py-4 text-end pe-4 border-0 border-bottom border-slate-50">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <button className="btn-icon text-slate-600 hover:text-indigo-600" title="Copy Link" onClick={() => toast.success("Link copied!")}><Copy size={16} strokeWidth={1.5} /></button>
                  <button className="btn-icon text-slate-600 hover:text-indigo-600" title="View Page" onClick={() => toast.success("Opening page preview...")}><Eye size={16} strokeWidth={1.5} /></button>
                  <button className="btn-icon text-slate-600 hover:text-indigo-600" title="Reset Page" onClick={handleReset}><RotateCcw size={16} strokeWidth={1.5} /></button>
                </div>
              </td>
            </tr>
          ))}
          {(pages || []).length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-8 text-slate-500 border-0">No pages configured for this theme yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
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

const WebsiteBuilderTab = ({ themeId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const storageKey = themeId ? `lms_wb_pages_v2_${themeId}` : 'lms_wb_pages_v2_default';
  const [pages, setPages] = usePersistentState(storageKey, DEFAULT_THEME_PAGES);

  const [editingPage, setEditingPage] = useState(null);
  const [previewingPage, setPreviewingPage] = useState(null);

  const handleSavePage = (pageData) => {
    if (editingPage) {
      // Update existing
      setPages(prev => prev.map(p => p.id === pageData.id ? pageData : p));
      toast.success("Page updated successfully!");
    } else {
      // Create new
      setPages([...pages, { id: Date.now(), ...pageData, status: 'Draft' }]);
      toast.success("Page created successfully!");
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      setPages(prev => prev.filter(p => p.id !== id));
      toast.info("Page deleted.");
    }
  };

  const toggleStatus = (id) => {
    setPages(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' } : p
    ));
    toast.success("Page status updated");
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
      <motion.div variants={itemVariants} className="d-flex justify-content-end align-items-center mb-4">
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
                    <td className="pe-4 py-3 text-end">
                      <div className="d-flex align-items-center justify-content-end gap-2">
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
    </motion.div >
  );
};

const AppearanceTab = () => {
  const { themes, liveTheme, applyTheme, publishTheme, removeThemeFromTabs, loading } = useThemeManager();

  // State for the Fullscreen Preview Modal
  const [previewTheme, setPreviewTheme] = useState(null);

  // View state: 'themes' or 'builder'
  const [view, setView] = useState('themes');

  // Specific theme being edited (if selected from Tabs)
  const [explicitlyEditingThemeId, setExplicitlyEditingThemeId] = useState(null);

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
                          onClick={() => applyTheme(theme.id)}
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



const NavigationTab = () => {
  // --- Header State ---
  const [headerConfig, setHeaderConfig] = usePersistentState('lms_wb_header_config_v2', {
    fixed: 'no',
    height: 80,
    bgColor: '#ffffff',
    textColor: '#000000',
    showSearch: 'yes',
    showCart: 'yes'
  });

  const [headerLinks, setHeaderLinks] = usePersistentState('lms_wb_header_links', [
    { id: 1, text: 'Store', url: '/store', newTab: false, visible: true },
    { id: 2, text: 'Blog', url: '/blog', newTab: false, visible: true },
    { id: 3, text: 'About', url: '/about', newTab: false, visible: true },
  ]);

  // --- Footer State ---
  const [footerLinks, setFooterLinks] = usePersistentState('lms_wb_footer_links', {
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    telegram: ''
  });

  const [footerConfig, setFooterConfig] = usePersistentState('lms_wb_footer_config_v2', {
    bgColor: '#ffffff',
    textColor: '#000000',
    title: 'Launch your Academy',
    copyright: '© 2025 LMS Academy. All rights reserved.'
  });

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
        {/* ... existing footer preview logic ... */}
        <div className="p-5 rounded-xl text-center transition-colors shadow-sm" style={{ backgroundColor: footerConfig.bgColor, color: footerConfig.textColor }}>
          <h4 className="mb-3 font-bold">{footerConfig.title}</h4>

          <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap" style={{ opacity: 0.9 }}>
            {/* Social Icons Preview */}
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

      {/* Code Editor Modal */}
      <AnimatePresence>
        {isCodeEditorOpen && (
          <HeaderCodeEditorModal
            isOpen={isCodeEditorOpen}
            onClose={() => setCodeEditorOpen(false)}
            initialHtml={headerConfig.customHtml || '<!-- Default Header HTML -->\n<header class="custom-header">\n  <div class="logo">My Logo</div>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/courses">Courses</a>\n  </nav>\n</header>'}
            initialCss={headerConfig.customCss || '/* Custom Header CSS */\n.custom-header {\n  display: flex;\n  justify-content: space-between;\n  padding: 20px;\n  background: #fff;\n  box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n}\n\n.logo {\n  font-weight: bold;\n  font-size: 24px;\n}'}
            onSave={(html, css) => {
              updateHeaderConfig('customHtml', html);
              updateHeaderConfig('customCss', css);
              setCodeEditorOpen(false);
              toast.success("Custom Header Saved!");
            }}
          />
        )}
      </AnimatePresence>



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
            className="btn-primary-action px-4 py-2" onClick={() => toast.success("Configuration saved successfully!")}
          >
            <Check size={18} className="me-2" /> Save Changes
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
            onSave={(html, css) => {
              updateHeaderConfig('customHtml', html);
              updateHeaderConfig('customCss', css);
              setCodeEditorOpen(false);
              toast.success("Custom Header Saved!");
            }}
            onUnpublish={() => {
              if (window.confirm("Are you sure you want to unpublish the custom header? This will revert to the default header.")) {
                updateHeaderConfig('customHeader', 'no');
                setCodeEditorOpen(false);
                toast.info("Custom Header Unpublished. Reverted to default.");
              }
            }}
          />
        )}
      </AnimatePresence >
    </motion.div >
  );
};

const HeaderCodeEditorModal = ({ isOpen, onClose, initialHtml, initialCss, onSave, onUnpublish }) => {
  const [htmlCode, setHtmlCode] = useState(initialHtml);
  const [cssCode, setCssCode] = useState(initialCss);
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop', 'tablet', 'mobile'

  if (!isOpen) return null;

  // Generate preview content securely
  const previewContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background: #f8fafc; overflow-x: hidden; }
          /* Reset for preview */
          * { box-sizing: border-box; }
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
      </body>
    </html>
  `;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex flex-column bg-slate-900 text-white font-sans animate-in fade-in duration-200">

      {/* PROFESSIONAL STUDIO HEADER */}
      <div className="d-flex align-items-center justify-content-between px-4 py-3 bg-slate-900 border-bottom border-slate-700 shadow-sm" style={{ backdropFilter: 'blur(10px)' }}>

        {/* Left: Branding & Back */}
        <div className="d-flex align-items-center gap-4">
          <button
            onClick={onClose}
            className="d-flex align-items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="rotate-180" size={20} />
            <span className="text-sm font-medium">Exit Builder</span>
          </button>
          <div className="h-6 w-px bg-slate-700"></div>
          <div className="d-flex align-items-center gap-2">
            <div className="p-1.5 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
              <Code size={18} className="text-white" />
            </div>
            <div>
              <h5 className="m-0 text-sm font-bold text-white tracking-wide">Header Studio</h5>
              <div className="text-xs text-slate-400">Custom Code Editor</div>
            </div>
          </div>
        </div>

        {/* Center: Device Toggles */}
        <div className="d-flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            className={`p-2 rounded-md transition-all ${deviceMode === 'desktop' ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setDeviceMode('desktop')}
            title="Desktop View"
          >
            <Monitor size={18} />
          </button>
          <button
            className={`p-2 rounded-md transition-all ${deviceMode === 'tablet' ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setDeviceMode('tablet')}
            title="Tablet View"
          >
            <Tablet size={18} />
          </button>
          <button
            className={`p-2 rounded-md transition-all ${deviceMode === 'mobile' ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setDeviceMode('mobile')}
            title="Mobile View"
          >
            <Smartphone size={18} />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex gap-1 me-2">
            <button className="p-2 text-slate-500 hover:text-white transition-colors" title="Undo (Visual Only)"><Undo size={18} /></button>
            <button className="p-2 text-slate-500 hover:text-white transition-colors" title="Redo (Visual Only)"><Redo size={18} /></button>
          </div>
          <button
            className="px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-all uppercase tracking-wider"
            onClick={onUnpublish}
          >
            Unpublish
          </button>
          <button
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 d-flex align-items-center gap-2 border border-indigo-400/20"
            onClick={() => onSave(htmlCode, cssCode)}
          >
            <Check size={16} /> Publish Changes
          </button>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-grow-1 d-flex overflow-hidden">

        {/* LEFT: CODE EDITOR */}
        <div className="w-50 d-flex flex-column border-end border-slate-700 bg-[#0d1117]">
          {/* Tabs */}
          <div className="d-flex border-bottom border-slate-800">
            <div className="px-6 py-3 border-bottom border-indigo-500 text-indigo-400 text-xs font-bold uppercase tracking-wider bg-slate-800/50">
              Source Code
            </div>
            <div className="flex-grow-1 bg-[#0d1117]"></div>
          </div>

          <div className="flex-grow-1 d-flex flex-column overflow-hidden">
            <div className="h-50 d-flex flex-column border-bottom border-slate-800">
              <div className="px-4 py-1 bg-slate-800/30 text-xs text-slate-500 font-mono border-bottom border-slate-800/50 d-flex justify-content-between">
                <span>HTML Structure</span>
                <span className="text-slate-600">index.html</span>
              </div>
              <CodeEditorArea code={htmlCode} setCode={setHtmlCode} language="html" theme="dark" />
            </div>
            <div className="h-50 d-flex flex-column">
              <div className="px-4 py-1 bg-slate-800/30 text-xs text-slate-500 font-mono border-bottom border-slate-800/50 d-flex justify-content-between">
                <span>CSS Styles</span>
                <span className="text-slate-600">style.css</span>
              </div>
              <CodeEditorArea code={cssCode} setCode={setCssCode} language="css" theme="dark" />
            </div>
          </div>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="w-50 bg-slate-950 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}>
          </div>

          <div className="mb-3 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-400 backdrop-blur-sm shadow-sm d-flex align-items-center gap-2">
            <div className="w-2 h-2 rounded-circle bg-green-500 animate-pulse"></div>
            Live Preview
          </div>

          <motion.div
            layout
            className="bg-white shadow-2xl overflow-hidden transition-all duration-300 relative"
            style={{
              width: deviceMode === 'mobile' ? '375px' : deviceMode === 'tablet' ? '768px' : '100%',
              height: deviceMode === 'mobile' ? '667px' : deviceMode === 'tablet' ? '1024px' : '100%',
              maxHeight: '100%',
              maxWidth: '100%',
              borderRadius: deviceMode === 'desktop' ? '0' : '12px',
              border: deviceMode !== 'desktop' ? '8px solid #1e293b' : 'none'
            }}
          >
            <iframe
              title="Header Preview"
              srcDoc={previewContent}
              className="w-100 h-100 border-0 bg-white"
              sandbox="allow-scripts"
            />
          </motion.div>
        </div>

      </div>
    </div>
  );
};

// Updated Editor Area for Dark Theme Support
const CodeEditorArea = ({ code, setCode, language, theme = 'light' }) => (
  <div className="w-100 h-100 position-relative d-flex">
    {/* Line Numbers */}
    <div className={`py-4 text-end font-monospace text-sm select-none d-flex flex-column align-items-end pe-3 border-end ${theme === 'dark' ? 'bg-[#0d1117] text-slate-600 border-slate-800' : 'bg-slate-50 text-slate-400 border-slate-200'}`} style={{ width: '48px', lineHeight: '1.6', minWidth: '48px' }}>
      {Array.from({ length: 99 }).map((_, i) => <div key={i}>{i + 1}</div>)}
    </div>

    <textarea
      className={`flex-grow-1 p-4 font-monospace text-sm border-0 focus:outline-none resize-none ${theme === 'dark' ? 'text-indigo-100' : 'text-slate-800'}`}
      style={{
        backgroundColor: 'transparent',
        lineHeight: '1.6',
        tabSize: 2,
        caretColor: theme === 'dark' ? '#818cf8' : '#4f46e5'
      }}
      value={code}
      onChange={(e) => setCode(e.target.value)}
      spellCheck="false"
      autoFocus={language === 'html'}
    />
  </div>
);

const SEOTab = () => {
  const [seoPages, setSeoPages] = usePersistentState('lms_wb_seo_pages', [
    { id: 'home', name: 'Home Page', title: 'Home Page Title', description: 'Home Page Description', keywords: 'Home Page Keywords' },
    { id: 'store', name: 'Store', title: 'Store Title', description: 'Store Description', keywords: 'Store Keywords' },
    { id: 'blog', name: 'Blog', title: 'Blog Title', description: 'Blog Description', keywords: 'Blog Keywords' },
  ]);

  const [sitemapFile, setSitemapFile] = useState(null);
  const [robotsTxt, setRobotsTxt] = usePersistentState('lms_wb_robots', 'User-agent: *\nAllow: /');

  const updatePageSeo = (id, field, value) => {
    setSeoPages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSave = (pageName) => {
    toast.success(`${pageName} SEO settings saved!`);
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-2">
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 m-0 tracking-tight">SEO Configuration</h2>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto text-lg">
          Optimize your academy's visibility across search engines with granular control over meta tags and indexing.
        </p>
      </motion.div>

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
                    className="p-3 border-bottom"
                    style={{ background: colors.headerBg, borderColor: colors.borderColor }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
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
                        onClick={() => handleSave(page.name)}
                      >
                        <Check size={14} /> Save
                      </motion.button>
                    </div>
                  </div>

                  {/* Compact Body */}
                  <div className="p-3 flex-grow-1">
                    <div className="row g-3 mb-3">
                      <div className="col-md-7">
                        <label className="wb-label small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '10px' }}>Meta Title</label>
                        <input
                          className="wb-input py-2 text-sm form-control shadow-none"
                          placeholder={`e.g. ${page.name} | Academy`}
                          value={page.title}
                          onChange={(e) => updatePageSeo(page.id, 'title', e.target.value)}
                          style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                        />
                      </div>
                      <div className="col-md-5">
                        <label className="wb-label small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '10px' }}>Keywords</label>
                        <input
                          className="wb-input py-2 text-sm form-control shadow-none"
                          placeholder="learning, course"
                          value={page.keywords}
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
                        value={page.description}
                        onChange={(e) => updatePageSeo(page.id, 'description', e.target.value)}
                        style={{ minHeight: '60px', backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );

          // Inject Tools Column at index 2 (swapped position with pageCard as requested previously: Page Left, Tools Right)
          if (index === 2) {
            return [
              pageCard,
              <div className="col-lg-6" key="seo-tools-combined">
                <motion.div variants={itemVariants} className="d-flex flex-column gap-3 h-100">

                  {/* Sitemap Card Compact */}
                  <motion.div
                    className="wb-card bg-white p-0 shadow-sm overflow-hidden flex-grow-1 hover:shadow-lg transition-all"
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
                        <button
                          className="text-[10px] font-bold bg-white px-2 py-1 rounded border"
                          style={{ color: '#059669', borderColor: '#a7f3d0' }}
                          onClick={() => toast.success("Uploaded!")}
                        >
                          Uploaded
                        </button>
                      )}
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-between">
                      <span className="text-muted small text-truncate" style={{ maxWidth: '150px' }}>{sitemapFile ? sitemapFile.name : 'No file selected'}</span>
                      <label
                        className="btn cursor-pointer py-1 px-3 text-xs fw-bold shadow-sm d-flex align-items-center"
                        style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}
                      >
                        Browse File
                        <input type="file" className="d-none" accept=".xml" onChange={(e) => setSitemapFile(e.target.files[0])} />
                      </label>
                    </div>
                  </motion.div>

                  {/* Robots.txt Card Compact */}
                  <motion.div
                    className="wb-card bg-white p-0 shadow-sm overflow-hidden flex-grow-1 hover:shadow-lg transition-all"
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
                        onClick={() => toast.success("Updated!")}
                      >
                        Save
                      </motion.button>
                    </div>
                    <div className="p-0">
                      <textarea
                        className="wb-input font-monospace text-xs border-0 rounded-0"
                        rows={3}
                        value={robotsTxt}
                        onChange={(e) => setRobotsTxt(e.target.value)}
                        style={{ resize: 'none', width: '100%', padding: '12px', backgroundColor: '#0f172a', color: '#e2e8f0' }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ];
          }
          return pageCard;
        })}
      </div>
    </motion.div>
  );
};

const SettingsTab = () => {
  const [settings, setSettings] = usePersistentState('lms_wb_settings', {
    siteName: 'LMS Academy',
    siteDescription: 'The best place to learn online.',
    logo: null,
    favicon: null,
    enableFootfall: true
  });

  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  const handleFileUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) {
        toast.error("File is too large for this demo (max 500KB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, [key]: reader.result }));
        toast.success(`${key === 'logo' ? 'Logo' : 'Favicon'} updated!`);
      };
      reader.readAsDataURL(file);
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
          className="btn-primary-action" onClick={() => toast.success("All settings saved successfully!")}
        >
          <Check size={18} className="me-2" /> Save Changes
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
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
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
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
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
                {settings.logo ? (
                  <div className="position-relative group">
                    <img
                      src={settings.logo}
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
                <input ref={logoInputRef} type="file" className="d-none" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
              </div>
            </div>

            {/* Favicon Upload */}
            <div>
              <label className="wb-label mb-2">Favicon</label>
              <div className="d-flex align-items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="bg-white border border-slate-100 rounded-lg flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                  {settings.favicon ? (
                    <img
                      src={settings.favicon}
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
                <input ref={faviconInputRef} type="file" className="d-none" accept="image/*" onChange={(e) => handleFileUpload(e, 'favicon')} />
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
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSettings(prev => ({ ...prev, enableFootfall: checked }));
                    toast.info(`Social Footfall ${checked ? 'Enabled' : 'Disabled'}`);
                  }}
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
  const [activeTab, setActiveTab] = useState('appearance'); // Default to appearance

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: <Monitor size={18} /> },

    { id: 'navigation', label: 'Navigation', icon: <ChevronRight size={18} /> },
    { id: 'seo', label: 'SEO', icon: <Search size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="container-fluid p-0"> {/* Wrapper to contain layout */}
      <div className="website-builder-container">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        <div className="wb-header">
          <h1 className="wb-title">Manage Website</h1>
          <p className="wb-subtitle">Design, customize, and manage your public-facing academy website.</p>
        </div>

        <div className="wb-tabs">
          {tabs.map(tab => (
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
            {activeTab === 'appearance' && <AppearanceTab />}

            {activeTab === 'navigation' && <NavigationTab />}
            {activeTab === 'seo' && <SEOTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Websites;