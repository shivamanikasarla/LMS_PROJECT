import React, { useState } from 'react';
import {
    Monitor, Tablet, Smartphone, Check, ChevronRight, Undo, Redo, Code,
    Type, Image as ImageIcon, Box, Layout, MousePointer, X,
    FileText, LogIn, ShoppingCart, Search, FormInput, List, MessageSquare, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderStudio = ({ isOpen, onClose, initialHtml, initialCss, onSave, onUnpublish }) => {
    const [htmlCode, setHtmlCode] = useState(initialHtml);
    const [cssCode, setCssCode] = useState(initialCss);
    const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
    const [activeTab, setActiveTab] = useState('design'); // 'design', 'code'
    const [activeCategory, setActiveCategory] = useState('components'); // 'components', 'forms'

    if (!isOpen) return null;

    // Generate preview content securely
    const previewContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background: #ffffff; overflow-x: hidden; }
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

    // Visual Widgets for the Sidebar
    const widgets = {
        components: [
            { id: 'blogs', label: 'Blogs', icon: FileText, snippet: '<a href="/blogs" class="nav-link">Blogs</a>' },
            { id: 'login', label: 'Login Button', icon: LogIn, snippet: '<button class="btn-login">Login</button>' },
            { id: 'cart', label: 'Cart', icon: ShoppingCart, snippet: '<div class="cart-icon">🛒</div>' },
            { id: 'search', label: 'Search Courses', icon: Search, snippet: '<div class="search-bar"><input type="text" placeholder="Search..."/></div>' },
        ],
        forms: [
            { id: 'form', label: 'Form', icon: Layout, snippet: '<form class="custom-form">\n  <!-- Form Content -->\n</form>' },
            { id: 'input', label: 'Input', icon: FormInput, snippet: '<input type="text" class="form-input" placeholder="Enter text..." />' },
            { id: 'textarea', label: 'Textarea', icon: MessageSquare, snippet: '<textarea class="form-textarea" placeholder="Enter details..."></textarea>' },
            { id: 'select', label: 'Select', icon: List, snippet: '<select class="form-select"><option>Option 1</option></select>' },
            { id: 'button', label: 'Button', icon: MousePointer, snippet: '<button class="btn-primary">Submit</button>' },
            { id: 'label', label: 'Label', icon: Tag, snippet: '<label class="form-label">Label Name</label>' },
        ]
    };

    const handleAddWidget = (snippet) => {
        // Simple append for now - in a real builder this would be drag & drop or robust insertion
        setHtmlCode(prev => prev + '\n' + snippet);
    };

    // Styles
    const styles = {
        modalOverlay: {
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: '#0f172a', zIndex: 9999, display: 'flex', flexDirection: 'column', color: '#f8fafc',
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        },
        header: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px',
            padding: '0 24px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155'
        },
        sidebar: {
            width: '280px', backgroundColor: '#1e293b', borderRight: '1px solid #334155',
            display: 'flex', flexDirection: 'column'
        },
        sidebarHeader: {
            padding: '16px', borderBottom: '1px solid #334155',
            fontWeight: '600', fontSize: '14px', color: '#cbd5e1', letterSpacing: '0.05em', textTransform: 'uppercase'
        },
        categoryButton: (active) => ({
            padding: '10px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
            color: active ? '#fff' : '#94a3b8',
            backgroundColor: active ? '#334155' : 'transparent',
            display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s'
        }),
        widgetGrid: {
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px'
        },
        widgetCard: {
            backgroundColor: '#334155', borderRadius: '8px', padding: '16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: 'pointer', transition: 'all 0.2s', border: '1px solid transparent'
        },
        mainArea: {
            flexGrow: 1, backgroundColor: '#0f172a', position: 'relative',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
        },
        deviceButton: (isActive) => ({
            padding: '8px', borderRadius: '6px', border: 'none',
            backgroundColor: isActive ? '#334155' : 'transparent',
            color: isActive ? '#818cf8' : '#64748b',
            cursor: 'pointer', display: 'flex'
        }),
        actionButton: {
            padding: '8px 16px', borderRadius: '6px', border: 'none',
            background: 'linear-gradient(to right, #4f46e5, #6366f1)',
            color: 'white', fontWeight: '600', fontSize: '13px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
        }
    };

    return (
        <div style={styles.modalOverlay}>
            {/* TOP BAR */}
            <div style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                    >
                        <X size={20} />
                    </button>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Custom Header</span>
                </div>

                <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '4px', borderRadius: '6px', width: 'fit-content' }}>
                    {['desktop', 'tablet', 'mobile'].map(mode => (
                        <button
                            key={mode}
                            style={styles.deviceButton(deviceMode === mode)}
                            onClick={() => setDeviceMode(mode)}
                        >
                            {mode === 'desktop' && <Monitor size={16} />}
                            {mode === 'tablet' && <Tablet size={16} />}
                            {mode === 'mobile' && <Smartphone size={16} />}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setActiveTab(activeTab === 'code' ? 'design' : 'code')}
                        style={{ ...styles.deviceButton(activeTab === 'code'), gap: '8px', width: 'auto', padding: '8px 12px' }}
                    >
                        <Code size={16} /> <span style={{ fontSize: '13px' }}>Code Editor</span>
                    </button>
                    <button style={styles.actionButton} onClick={() => onSave(htmlCode, cssCode)}>
                        <Check size={16} /> Save / Publish
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 60px)' }}>

                {/* LEFT SIDEBAR - WIDGETS */}
                {activeTab === 'design' && (
                    <div style={styles.sidebar}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div
                                style={styles.categoryButton(activeCategory === 'components')}
                                onClick={() => setActiveCategory('components')}
                            >
                                <Box size={16} /> Components
                            </div>
                            <AnimatePresence>
                                {activeCategory === 'components' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={styles.widgetGrid}
                                    >
                                        {widgets.components.map(item => (
                                            <div
                                                key={item.id}
                                                style={styles.widgetCard}
                                                className="widget-card-hover"
                                                onClick={() => handleAddWidget(item.snippet)}
                                                onMouseOver={e => { e.currentTarget.style.backgroundColor = '#475569'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                                onMouseOut={e => { e.currentTarget.style.backgroundColor = '#334155'; e.currentTarget.style.transform = 'none' }}
                                            >
                                                <item.icon size={24} color="#94a3b8" />
                                                <span style={{ fontSize: '12px', color: '#e2e8f0' }}>{item.label}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div
                                style={styles.categoryButton(activeCategory === 'forms')}
                                onClick={() => setActiveCategory('forms')}
                            >
                                <Layout size={16} /> Forms
                            </div>
                            <AnimatePresence>
                                {activeCategory === 'forms' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={styles.widgetGrid}
                                    >
                                        {widgets.forms.map(item => (
                                            <div
                                                key={item.id}
                                                style={styles.widgetCard}
                                                className="widget-card-hover"
                                                onClick={() => handleAddWidget(item.snippet)}
                                                onMouseOver={e => { e.currentTarget.style.backgroundColor = '#475569'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                                onMouseOut={e => { e.currentTarget.style.backgroundColor = '#334155'; e.currentTarget.style.transform = 'none' }}
                                            >
                                                <item.icon size={24} color="#94a3b8" />
                                                <span style={{ fontSize: '12px', color: '#e2e8f0' }}>{item.label}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* CENTER - PREVIEW or CODE */}
                <div style={styles.mainArea}>
                    {activeTab === 'design' ? (
                        <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                            padding: '40px'
                        }}>
                            <motion.div
                                layout
                                style={{
                                    width: deviceMode === 'mobile' ? '375px' : deviceMode === 'tablet' ? '768px' : '100%',
                                    height: deviceMode === 'mobile' ? '667px' : deviceMode === 'tablet' ? '1024px' : '100%',
                                    maxWidth: '100%', maxHeight: '100%',
                                    backgroundColor: 'white',
                                    borderRadius: deviceMode === 'desktop' ? '4px' : '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                                }}
                            >
                                <iframe
                                    title="Header Preview"
                                    srcDoc={previewContent}
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                    sandbox="allow-scripts"
                                />
                            </motion.div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', height: '100%' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #334155' }}>
                                <div style={{ padding: '8px 16px', backgroundColor: '#1e293b', color: '#94a3b8', fontSize: '12px' }}>HTML</div>
                                <CodeEditorArea code={htmlCode} setCode={setHtmlCode} language="html" />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '8px 16px', backgroundColor: '#1e293b', color: '#94a3b8', fontSize: '12px' }}>CSS</div>
                                <CodeEditorArea code={cssCode} setCode={setCssCode} language="css" />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

// Internal Editor Area Component with Inline Styles
const CodeEditorArea = ({ code, setCode, language }) => (
    <textarea
        style={{
            flexGrow: 1, padding: '16px', fontFamily: 'monospace', fontSize: '14px', border: 'none', outline: 'none', resize: 'none',
            backgroundColor: '#0f172a', lineHeight: '1.6', tabSize: 2,
            color: '#e2e8f0', caretColor: '#818cf8'
        }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
    />
);

export default HeaderStudio;
