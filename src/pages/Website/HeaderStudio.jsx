import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
    Monitor, Tablet, Smartphone, Check, ChevronRight, Undo, Redo, Code,
    Type, Image as ImageIcon, Box, Layout, MousePointer, X, GripVertical,
    FileText, LogIn, ShoppingCart, Search, FormInput, List, MessageSquare, Tag,
    Columns, Clock, Video, Map, Sliders, BookOpen, Library, LayoutTemplate,
    Layers, Globe, CheckSquare, CircleDot, ChevronDown, ChevronUp, Quote,
    Sparkles, Zap, PanelLeft, Eye, EyeOff, Plus, ListTree, Trash2, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Simple HTML to tree parser ───
const SELF_CLOSING_TAGS = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);

// ─── Smart node display name resolver ───
function getNodeDisplayInfo(node) {
    if (node.tag === '#text') return { name: node.text, icon: '✎', color: '#94a3b8' };
    const cls = node.className || '';
    // Class-based friendly names (gp-* and common builder classes)
    if (cls.includes('row')) return { name: 'Row', icon: '⊞', color: '#818cf8' };
    if (cls.includes('cell')) return { name: 'Cell', icon: '☐', color: '#818cf8' };
    if (cls.includes('navbar') || node.tag === 'nav') return { name: 'Navbar', icon: '☰', color: '#34d399' };
    if (cls.includes('gp-text')) return { name: 'Text', icon: 'T', color: '#fbbf24' };
    if (cls.includes('gp-quote')) return { name: 'Quote', icon: '❝', color: '#fbbf24' };
    if (cls.includes('gp-section')) return { name: 'Section', icon: '§', color: '#818cf8' };
    if (cls.includes('gp-image')) return { name: 'Image', icon: '🖼', color: '#f472b6' };
    if (cls.includes('gp-video')) return { name: 'Video', icon: '▶', color: '#f472b6' };
    if (cls.includes('gp-map')) return { name: 'Map', icon: '📍', color: '#f472b6' };
    if (cls.includes('gp-iframe')) return { name: 'Embed', icon: '⧉', color: '#f472b6' };
    if (cls.includes('gp-slider')) return { name: 'Slider', icon: '❮❯', color: '#f472b6' };
    if (cls.includes('gp-btn')) return { name: 'Button', icon: '◉', color: '#34d399' };
    if (cls.includes('gp-cart')) return { name: 'Cart', icon: '🛒', color: '#34d399' };
    if (cls.includes('gp-search')) return { name: 'Search', icon: '🔍', color: '#38bdf8' };
    if (cls.includes('gp-link-block')) return { name: 'Link Block', icon: '🔗', color: '#38bdf8' };
    if (cls.includes('gp-link')) return { name: 'Link', icon: '🔗', color: '#38bdf8' };
    if (cls.includes('gp-countdown') || cls.includes('gp-cd-box')) return { name: 'Countdown', icon: '⏱', color: '#fbbf24' };
    if (cls.includes('gp-courses')) return { name: 'Courses', icon: '📚', color: '#818cf8' };
    if (cls.includes('gp-course-card')) return { name: 'Course Card', icon: '📄', color: '#818cf8' };
    if (cls.includes('gp-blogs')) return { name: 'Blog Posts', icon: '📝', color: '#818cf8' };
    if (cls.includes('gp-blog-card')) return { name: 'Blog Card', icon: '📄', color: '#818cf8' };
    if (cls.includes('gp-tabs')) return { name: 'Tabs', icon: '▤', color: '#818cf8' };
    if (cls.includes('gp-form')) return { name: 'Form', icon: '📋', color: '#38bdf8' };
    if (cls.includes('gp-customcode')) return { name: 'Custom Code', icon: '</>', color: '#94a3b8' };
    if (cls.includes('gp-login')) return { name: 'Login', icon: '👤', color: '#34d399' };
    if (cls.includes('gp-label')) return { name: 'Label', icon: 'L', color: '#38bdf8' };
    if (cls.includes('gp-checkbox')) return { name: 'Checkbox', icon: '☑', color: '#38bdf8' };
    if (cls.includes('gp-radio')) return { name: 'Radio', icon: '◉', color: '#38bdf8' };
    // Tag-based fallback
    const tagMap = {
        div: { name: 'Box', icon: '☐', color: '#818cf8' },
        section: { name: 'Section', icon: '§', color: '#818cf8' },
        ul: { name: 'List', icon: '≡', color: '#94a3b8' },
        ol: { name: 'List', icon: '≡', color: '#94a3b8' },
        li: { name: 'Item', icon: '•', color: '#94a3b8' },
        a: { name: 'Link', icon: '🔗', color: '#38bdf8' },
        p: { name: 'Text', icon: 'T', color: '#fbbf24' },
        h1: { name: 'Heading 1', icon: 'H1', color: '#fbbf24' },
        h2: { name: 'Heading 2', icon: 'H2', color: '#fbbf24' },
        h3: { name: 'Heading 3', icon: 'H3', color: '#fbbf24' },
        h4: { name: 'Heading 4', icon: 'H4', color: '#fbbf24' },
        span: { name: 'Span', icon: 'T', color: '#fbbf24' },
        img: { name: 'Image', icon: '🖼', color: '#f472b6' },
        iframe: { name: 'Embed', icon: '⧉', color: '#f472b6' },
        video: { name: 'Video', icon: '▶', color: '#f472b6' },
        form: { name: 'Form', icon: '📋', color: '#38bdf8' },
        input: { name: 'Input', icon: '▭', color: '#38bdf8' },
        textarea: { name: 'Textarea', icon: '▭', color: '#38bdf8' },
        select: { name: 'Select', icon: '▾', color: '#38bdf8' },
        button: { name: 'Button', icon: '◉', color: '#34d399' },
        label: { name: 'Label', icon: 'L', color: '#38bdf8' },
        blockquote: { name: 'Quote', icon: '❝', color: '#fbbf24' },
        table: { name: 'Table', icon: '▦', color: '#818cf8' },
        header: { name: 'Header', icon: '☐', color: '#818cf8' },
        footer: { name: 'Footer', icon: '☐', color: '#818cf8' },
        main: { name: 'Main', icon: '☐', color: '#818cf8' },
    };
    return tagMap[node.tag] || { name: node.tag, icon: '◇', color: '#94a3b8' };
}

function parseHtmlToTree(html) {
    if (!html || !html.trim()) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString('<body>' + html + '</body>', 'text/html');
    const root = doc.body;
    let idCounter = 0;

    function buildTree(element) {
        const nodes = [];
        Array.from(element.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                const trimmed = child.textContent.trim();
                if (trimmed) {
                    nodes.push({
                        id: `_text_${idCounter++}`,
                        tag: '#text',
                        text: trimmed.length > 30 ? trimmed.substring(0, 30) + '…' : trimmed,
                        children: [],
                        className: '',
                    });
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const tag = child.tagName.toLowerCase();
                if (tag === 'script' || tag === 'style') return;

                const node = {
                    id: `_node_${idCounter++}`,
                    tag,
                    className: child.className || '',
                    children: buildTree(child),
                };
                nodes.push(node);
            }
        });
        return nodes;
    }

    return buildTree(root);
}

// ─── LayerTreeNode component ───
const LayerTreeNode = ({ node, depth = 0, hoveredLayer, setHoveredLayer, selectedLayer, onSelectLayer, topIndex, totalSiblings, onMoveNode, onDeleteNode, onDuplicateNode, onToggleVisibility }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const isText = node.tag === '#text';
    const info = getNodeDisplayInfo(node);
    const isHovered = hoveredLayer === node.id;
    const isSelected = selectedLayer === node.id;
    const isTopLevel = depth === 1;
    const showActions = isHovered && isTopLevel;

    return (
        <div>
            <div
                onMouseEnter={() => setHoveredLayer(node.id)}
                onMouseLeave={() => setHoveredLayer(null)}
                style={{
                    display: 'flex', alignItems: 'center',
                    padding: '0', cursor: 'pointer',
                    fontSize: '12px',
                    color: isSelected ? '#e2e8f0' : isText ? '#64748b' : '#b8c0cc',
                    background: isSelected
                        ? 'rgba(99,102,241,0.18)'
                        : isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                    borderBottom: '1px solid rgba(148,163,184,0.04)',
                    borderLeft: isSelected ? '2px solid #818cf8' : '2px solid transparent',
                    transition: 'all 0.12s',
                    userSelect: 'none',
                    minHeight: '30px',
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectLayer) onSelectLayer(node.id, topIndex);
                }}
            >
                {/* Eye icon — visibility toggle */}
                <span
                    onClick={(e) => { e.stopPropagation(); if (isTopLevel && onToggleVisibility) onToggleVisibility(topIndex); }}
                    title={isTopLevel ? 'Toggle visibility' : ''}
                    style={{
                        width: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isHovered ? '#94a3b8' : 'rgba(148,163,184,0.3)', flexShrink: 0,
                        fontSize: '10px', transition: 'color 0.15s',
                        cursor: isTopLevel ? 'pointer' : 'default',
                    }}
                >
                    👁
                </span>

                {/* Indent spacer */}
                <span style={{ width: (depth * 12) + 'px', flexShrink: 0 }} />

                {/* Expand/Collapse arrow */}
                {hasChildren ? (
                    <span
                        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                        style={{
                            width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#64748b', flexShrink: 0, fontSize: '8px',
                            borderRadius: '2px', transition: 'background 0.12s',
                        }}
                    >
                        {expanded ? '▾' : '▸'}
                    </span>
                ) : (
                    <span style={{ width: '14px', flexShrink: 0 }} />
                )}

                {/* Friendly label */}
                <span style={{
                    flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    paddingLeft: '5px',
                    fontStyle: isText ? 'italic' : 'normal',
                    fontSize: isText ? '11px' : '12px',
                    fontWeight: isSelected ? '600' : '400',
                    color: isSelected ? '#e2e8f0' : isText ? '#64748b' : '#b8c0cc',
                    letterSpacing: '0.01em',
                }}>
                    {info.name}
                </span>

                {/* Action buttons on hover — only for top-level elements */}
                {showActions && (
                    <span style={{ display: 'flex', gap: '1px', flexShrink: 0 }}>
                        {/* Move Up */}
                        <button
                            title="Move Up"
                            onClick={(e) => { e.stopPropagation(); if (onMoveNode) onMoveNode(topIndex, -1); }}
                            disabled={topIndex <= 0}
                            style={{
                                background: 'transparent', border: 'none', padding: '2px 4px',
                                color: topIndex > 0 ? '#818cf8' : '#475569', cursor: topIndex > 0 ? 'pointer' : 'default',
                                fontSize: '11px', display: 'flex', alignItems: 'center', borderRadius: '2px',
                            }}
                        >↑</button>
                        {/* Move Down */}
                        <button
                            title="Move Down"
                            onClick={(e) => { e.stopPropagation(); if (onMoveNode) onMoveNode(topIndex, 1); }}
                            disabled={topIndex >= totalSiblings - 1}
                            style={{
                                background: 'transparent', border: 'none', padding: '2px 4px',
                                color: topIndex < totalSiblings - 1 ? '#818cf8' : '#475569', cursor: topIndex < totalSiblings - 1 ? 'pointer' : 'default',
                                fontSize: '11px', display: 'flex', alignItems: 'center', borderRadius: '2px',
                            }}
                        >↓</button>
                        {/* Duplicate */}
                        <button
                            title="Duplicate"
                            onClick={(e) => { e.stopPropagation(); if (onDuplicateNode) onDuplicateNode(topIndex); }}
                            style={{
                                background: 'transparent', border: 'none', padding: '2px 4px',
                                color: '#818cf8', cursor: 'pointer',
                                fontSize: '11px', display: 'flex', alignItems: 'center', borderRadius: '2px',
                            }}
                        >⊕</button>
                        {/* Delete */}
                        <button
                            title="Delete"
                            onClick={(e) => { e.stopPropagation(); if (onDeleteNode) onDeleteNode(topIndex); }}
                            style={{
                                background: 'transparent', border: 'none', padding: '2px 4px',
                                color: '#ef4444', cursor: 'pointer',
                                fontSize: '11px', display: 'flex', alignItems: 'center', borderRadius: '2px',
                            }}
                        >✕</button>
                    </span>
                )}

                {/* Child count badge */}
                {hasChildren && !showActions && (
                    <span style={{
                        fontSize: '10px', color: '#64748b',
                        padding: '0 4px', flexShrink: 0, minWidth: '16px', textAlign: 'center',
                    }}>
                        {node.children.length}
                    </span>
                )}

                {/* Move handle icon */}
                <span style={{
                    width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isHovered ? '#94a3b8' : 'rgba(148,163,184,0.15)', flexShrink: 0,
                    fontSize: '10px', cursor: 'grab', transition: 'color 0.15s',
                }}>
                    ✥
                </span>
            </div>

            {/* Children */}
            {expanded && hasChildren && (
                <div>
                    {node.children.map((child, i) => (
                        <LayerTreeNode
                            key={child.id || i}
                            node={child}
                            depth={depth + 1}
                            hoveredLayer={hoveredLayer}
                            setHoveredLayer={setHoveredLayer}
                            selectedLayer={selectedLayer}
                            onSelectLayer={onSelectLayer}
                            topIndex={depth === 0 ? i : topIndex}
                            totalSiblings={depth === 0 ? node.children.length : totalSiblings}
                            onMoveNode={onMoveNode}
                            onDeleteNode={onDeleteNode}
                            onDuplicateNode={onDuplicateNode}
                            onToggleVisibility={onToggleVisibility}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Color palette per category ───
const CATEGORY_COLORS = {
    layout: { accent: '#818cf8', glow: 'rgba(129,140,248,0.15)', bg: 'rgba(129,140,248,0.08)' },
    media: { accent: '#f472b6', glow: 'rgba(244,114,182,0.15)', bg: 'rgba(244,114,182,0.08)' },
    interactive: { accent: '#34d399', glow: 'rgba(52,211,153,0.15)', bg: 'rgba(52,211,153,0.08)' },
    content: { accent: '#fbbf24', glow: 'rgba(251,191,36,0.15)', bg: 'rgba(251,191,36,0.08)' },
    forms: { accent: '#38bdf8', glow: 'rgba(56,189,248,0.15)', bg: 'rgba(56,189,248,0.08)' },
};

// ─── All widgets with category grouping ───
const ALL_WIDGETS = [
    // Layout
    { id: '1col', label: '1 Column', icon: Layout, cat: 'layout', snippet: '<div class="row">\n  <div class="cell"></div>\n</div>' },
    { id: '2col', label: '2 Columns', icon: Columns, cat: 'layout', snippet: '<div class="row">\n  <div class="cell"></div>\n  <div class="cell"></div>\n</div>' },
    { id: '3col', label: '3 Columns', icon: Layers, cat: 'layout', snippet: '<div class="row">\n  <div class="cell"></div>\n  <div class="cell"></div>\n  <div class="cell"></div>\n</div>' },
    { id: '2col37', label: '2 Col 3/7', icon: LayoutTemplate, cat: 'layout', snippet: '<div class="row">\n  <div class="cell" style="flex:3"></div>\n  <div class="cell" style="flex:7"></div>\n</div>' },
    { id: 'navbar', label: 'Navbar', icon: List, cat: 'layout', snippet: '<nav class="navbar">\n  <div class="navbar-container">\n    <div class="navbar-brand" contenteditable="true">Brand</div>\n    <ul class="navbar-menu">\n      <li><a href="#" contenteditable="true">Home</a></li>\n      <li><a href="#" contenteditable="true">About</a></li>\n      <li><a href="#" contenteditable="true">Contact</a></li>\n    </ul>\n  </div>\n</nav>' },
    { id: 'tabs', label: 'Tabs', icon: Layout, cat: 'layout', snippet: '<div class="gp-tabs" data-component="tabs">\n  <div class="gp-tabs-header">\n    <button class="gp-tab-btn active" contenteditable="true">Tab 1</button>\n    <button class="gp-tab-btn" contenteditable="true">Tab 2</button>\n    <button class="gp-tab-btn" contenteditable="true">Tab 3</button>\n  </div>\n  <div class="gp-tab-content-wrapper">\n    <div class="gp-tab-pane active" contenteditable="true">Tab 1 content goes here...</div>\n    <div class="gp-tab-pane" contenteditable="true">Tab 2 content goes here...</div>\n    <div class="gp-tab-pane" contenteditable="true">Tab 3 content goes here...</div>\n  </div>\n</div>' },

    // Media
    { id: 'image', label: 'Image', icon: ImageIcon, cat: 'media', snippet: '<div class="gp-image-wrapper" data-component="image">\n  <img src="https://placehold.co/600x300/e2e8f0/94a3b8?text=Click+to+change+image" alt="placeholder" class="gp-image" />\n  <div class="gp-image-overlay">📷 Double-click to change image</div>\n</div>' },
    { id: 'video', label: 'Video', icon: Video, cat: 'media', snippet: '<div class="gp-video" data-component="video">\n  <div class="gp-video-inner">\n    <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>\n  </div>\n  <div class="gp-video-label">Video — Click to change URL</div>\n</div>' },
    { id: 'map', label: 'Map', icon: Map, cat: 'media', snippet: '<div class="gp-map" data-component="map">\n  <iframe src="https://maps.google.com/maps?q=new+york&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0"></iframe>\n  <div class="gp-map-label">Map — Click to change location</div>\n</div>' },
    { id: 'slider', label: 'Slider', icon: Sliders, cat: 'media', snippet: '<div class="gp-slider" data-component="slider">\n  <div class="gp-slide active" style="background:#f1f5f9" contenteditable="true">Slide 1 — Click to edit</div>\n  <div class="gp-slide" style="background:#ede9fe" contenteditable="true">Slide 2 — Click to edit</div>\n  <div class="gp-slide" style="background:#fce7f3" contenteditable="true">Slide 3 — Click to edit</div>\n  <div class="gp-slider-nav">\n    <button class="gp-slider-arrow prev">❮</button>\n    <div class="gp-slider-dots"><span class="dot active"></span><span class="dot"></span><span class="dot"></span></div>\n    <button class="gp-slider-arrow next">❯</button>\n  </div>\n</div>' },
    { id: 'iframe', label: 'Iframe', icon: Globe, cat: 'media', snippet: '<div class="gp-iframe" data-component="iframe">\n  <iframe src="https://example.com" frameborder="0"></iframe>\n  <div class="gp-iframe-label">Embed — Click to change URL</div>\n</div>' },

    // Interactive
    { id: 'button', label: 'Button', icon: MousePointer, cat: 'interactive', snippet: '<button class="gp-btn gp-btn-primary" contenteditable="true">Click Me</button>' },
    { id: 'login', label: 'Login', icon: LogIn, cat: 'interactive', snippet: '<div class="gp-login-block" data-component="login">\n  <button class="gp-btn gp-btn-outline" contenteditable="true">Login / Sign Up</button>\n</div>' },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, cat: 'interactive', snippet: '<div class="gp-cart" data-component="cart">\n  <span class="gp-cart-icon">🛒</span>\n  <span class="gp-cart-badge" contenteditable="true">3</span>\n</div>' },
    { id: 'search', label: 'Search', icon: Search, cat: 'interactive', snippet: '<div class="gp-search" data-component="search">\n  <input type="text" class="gp-search-input" placeholder="Search courses, blogs..." />\n  <button class="gp-search-btn">🔍</button>\n</div>' },
    { id: 'link', label: 'Link', icon: ChevronRight, cat: 'interactive', snippet: '<a href="#" class="gp-link" contenteditable="true">Link Text →</a>' },
    { id: 'linkblock', label: 'Link Block', icon: Box, cat: 'interactive', snippet: '<a href="#" class="gp-link-block" data-component="linkblock">\n  <div class="gp-link-block-inner" contenteditable="true">Clickable block — Edit text here</div>\n</a>' },
    { id: 'countdown', label: 'Countdown', icon: Clock, cat: 'interactive', snippet: '<div class="gp-countdown" data-component="countdown">\n  <div class="gp-cd-box"><span class="gp-cd-num" contenteditable="true">12</span><span class="gp-cd-label">Days</span></div>\n  <div class="gp-cd-sep">:</div>\n  <div class="gp-cd-box"><span class="gp-cd-num" contenteditable="true">08</span><span class="gp-cd-label">Hours</span></div>\n  <div class="gp-cd-sep">:</div>\n  <div class="gp-cd-box"><span class="gp-cd-num" contenteditable="true">45</span><span class="gp-cd-label">Min</span></div>\n  <div class="gp-cd-sep">:</div>\n  <div class="gp-cd-box"><span class="gp-cd-num" contenteditable="true">30</span><span class="gp-cd-label">Sec</span></div>\n</div>' },

    // Content
    { id: 'text', label: 'Text', icon: Type, cat: 'content', snippet: '<div class="gp-text" data-component="text" contenteditable="true">\n  <p>Enter your text here. Click to edit this paragraph and add your own content.</p>\n</div>' },
    { id: 'quote', label: 'Quote', icon: Quote, cat: 'content', snippet: '<blockquote class="gp-quote" data-component="quote">\n  <div class="gp-quote-text" contenteditable="true">"Design is not just what it looks like and feels like. Design is how it works."</div>\n  <div class="gp-quote-author" contenteditable="true">— Steve Jobs</div>\n</blockquote>' },
    { id: 'textsection', label: 'Section', icon: FileText, cat: 'content', snippet: '<section class="gp-section" data-component="section">\n  <h2 class="gp-section-title" contenteditable="true">Section Title</h2>\n  <p class="gp-section-text" contenteditable="true">Section content goes here. Click to edit and add your details below the heading.</p>\n</section>' },
    { id: 'courses', label: 'Courses', icon: BookOpen, cat: 'content', snippet: '<div class="gp-courses" data-component="courses">\n  <h3 class="gp-courses-heading" contenteditable="true">Our Courses</h3>\n  <div class="gp-courses-grid">\n    <div class="gp-course-card">\n      <div class="gp-course-thumb">📘</div>\n      <div class="gp-course-info">\n        <div class="gp-course-title" contenteditable="true">Course Title</div>\n        <div class="gp-course-price" contenteditable="true">₹999</div>\n      </div>\n    </div>\n    <div class="gp-course-card">\n      <div class="gp-course-thumb">📗</div>\n      <div class="gp-course-info">\n        <div class="gp-course-title" contenteditable="true">Course Title</div>\n        <div class="gp-course-price" contenteditable="true">₹1499</div>\n      </div>\n    </div>\n    <div class="gp-course-card">\n      <div class="gp-course-thumb">📕</div>\n      <div class="gp-course-info">\n        <div class="gp-course-title" contenteditable="true">Course Title</div>\n        <div class="gp-course-price" contenteditable="true">Free</div>\n      </div>\n    </div>\n  </div>\n</div>' },
    { id: 'blogs', label: 'Blogs', icon: FileText, cat: 'content', snippet: '<div class="gp-blogs" data-component="blogs">\n  <h3 class="gp-blogs-heading" contenteditable="true">Latest Blogs</h3>\n  <div class="gp-blogs-grid">\n    <div class="gp-blog-card">\n      <div class="gp-blog-thumb">📝</div>\n      <div class="gp-blog-title" contenteditable="true">Blog Post Title</div>\n      <div class="gp-blog-excerpt" contenteditable="true">Short description of the blog post goes here...</div>\n    </div>\n    <div class="gp-blog-card">\n      <div class="gp-blog-thumb">📄</div>\n      <div class="gp-blog-title" contenteditable="true">Blog Post Title</div>\n      <div class="gp-blog-excerpt" contenteditable="true">Short description of the blog post goes here...</div>\n    </div>\n  </div>\n</div>' },
    { id: 'customcode', label: 'Custom Code', icon: Code, cat: 'content', snippet: '<div class="gp-customcode" data-component="customcode" contenteditable="true">\n  <div class="gp-cc-label">⟨/⟩ Custom Code Block</div>\n  <div class="gp-cc-area">Paste your custom HTML / embed code here</div>\n</div>' },

    // Forms
    { id: 'form', label: 'Form', icon: Layout, cat: 'forms', snippet: '<form class="gp-form" data-component="form">\n  <div class="gp-form-group">\n    <label class="gp-form-label" contenteditable="true">Name</label>\n    <input type="text" class="gp-form-input" placeholder="Your name" />\n  </div>\n  <div class="gp-form-group">\n    <label class="gp-form-label" contenteditable="true">Email</label>\n    <input type="email" class="gp-form-input" placeholder="Your email" />\n  </div>\n  <div class="gp-form-group">\n    <label class="gp-form-label" contenteditable="true">Message</label>\n    <textarea class="gp-form-input gp-form-textarea" placeholder="Your message"></textarea>\n  </div>\n  <button type="submit" class="gp-btn gp-btn-primary" contenteditable="true">Submit</button>\n</form>' },
    { id: 'input', label: 'Input', icon: FormInput, cat: 'forms', snippet: '<div class="gp-form-group" data-component="input">\n  <label class="gp-form-label" contenteditable="true">Field Label</label>\n  <input type="text" class="gp-form-input" placeholder="Enter text..." />\n</div>' },
    { id: 'textarea', label: 'Textarea', icon: MessageSquare, cat: 'forms', snippet: '<div class="gp-form-group" data-component="textarea">\n  <label class="gp-form-label" contenteditable="true">Details</label>\n  <textarea class="gp-form-input gp-form-textarea" placeholder="Enter details..."></textarea>\n</div>' },
    { id: 'select', label: 'Select', icon: List, cat: 'forms', snippet: '<div class="gp-form-group" data-component="select">\n  <label class="gp-form-label" contenteditable="true">Choose option</label>\n  <select class="gp-form-input"><option>Option 1</option><option>Option 2</option><option>Option 3</option></select>\n</div>' },
    { id: 'label', label: 'Label', icon: Tag, cat: 'forms', snippet: '<label class="gp-label" contenteditable="true">Label Name</label>' },
    { id: 'checkbox', label: 'Checkbox', icon: CheckSquare, cat: 'forms', snippet: '<label class="gp-checkbox"><input type="checkbox" /><span contenteditable="true">I agree to terms &amp; conditions</span></label>' },
    { id: 'radio', label: 'Radio', icon: CircleDot, cat: 'forms', snippet: '<div class="gp-radio-group" data-component="radio">\n  <label class="gp-radio"><input type="radio" name="choice" value="1" /><span contenteditable="true">Option A</span></label>\n  <label class="gp-radio"><input type="radio" name="choice" value="2" /><span contenteditable="true">Option B</span></label>\n  <label class="gp-radio"><input type="radio" name="choice" value="3" /><span contenteditable="true">Option C</span></label>\n</div>' },
];

// ─── Visual icon renderer for widgets (GrapesJS-style box outlines) ───
const WidgetVisualIcon = ({ widgetId, color, size = 36 }) => {
    const s = size;
    const stroke = color || '#94a3b8';
    const sw = 1.5;
    const r = 2;

    const visualIcons = {
        '1col': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="4" y="6" width="28" height="24" rx={r} stroke={stroke} strokeWidth={sw} />
            </svg>
        ),
        '2col': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="3" y="6" width="14" height="24" rx={r} stroke={stroke} strokeWidth={sw} />
                <rect x="19" y="6" width="14" height="24" rx={r} stroke={stroke} strokeWidth={sw} />
            </svg>
        ),
        '3col': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="2" y="6" width="9.5" height="24" rx={r} stroke={stroke} strokeWidth={sw} />
                <rect x="13.25" y="6" width="9.5" height="24" rx={r} stroke={stroke} strokeWidth={sw} />
                <rect x="24.5" y="6" width="9.5" height="24" rx={r} stroke={stroke} strokeWidth={sw} />
            </svg>
        ),
        '2col37': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="3" y="6" width="10" height="24" rx={r} stroke={stroke} strokeWidth={sw} />
                <rect x="15" y="6" width="18" height="24" rx={r} stroke={stroke} strokeWidth={sw} />
            </svg>
        ),
        'text': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <text x="18" y="24" textAnchor="middle" fill={stroke} fontSize="22" fontWeight="700" fontFamily="serif">T</text>
            </svg>
        ),
        'image': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="4" y="7" width="28" height="22" rx={r} stroke={stroke} strokeWidth={sw} />
                <path d="M4 23l7-7 5 5 4-3 12 8" stroke={stroke} strokeWidth={sw} fill="none" strokeLinejoin="round" />
                <circle cx="12" cy="14" r="3" stroke={stroke} strokeWidth={sw} />
            </svg>
        ),
        'video': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="4" y="7" width="28" height="22" rx={r} stroke={stroke} strokeWidth={sw} />
                <polygon points="15,13 15,25 25,19" fill={stroke} opacity="0.7" />
            </svg>
        ),
        'map': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="4" y="7" width="28" height="22" rx={r} stroke={stroke} strokeWidth={sw} />
                <circle cx="18" cy="16" r="4" stroke={stroke} strokeWidth={sw} />
                <path d="M18 20l0 5" stroke={stroke} strokeWidth={sw} />
            </svg>
        ),
        'link': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <path d="M15 21a5 5 0 007 0l3-3a5 5 0 00-7-7l-1.5 1.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
                <path d="M21 15a5 5 0 00-7 0l-3 3a5 5 0 007 7l1.5-1.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
            </svg>
        ),
        'linkblock': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="5" y="8" width="26" height="20" rx={r} stroke={stroke} strokeWidth={sw} />
                <path d="M14 20a3 3 0 004 0l2-2a3 3 0 00-4-4l-1 1" stroke={stroke} strokeWidth={1.2} strokeLinecap="round" />
                <path d="M20 17a3 3 0 00-4 0l-2 2a3 3 0 004 4l1-1" stroke={stroke} strokeWidth={1.2} strokeLinecap="round" />
            </svg>
        ),
        'button': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="5" y="11" width="26" height="14" rx="7" stroke={stroke} strokeWidth={sw} />
                <text x="18" y="22" textAnchor="middle" fill={stroke} fontSize="8" fontWeight="600">BTN</text>
            </svg>
        ),
        'form': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="5" y="6" width="26" height="8" rx={r} stroke={stroke} strokeWidth={sw} />
                <rect x="5" y="16" width="26" height="8" rx={r} stroke={stroke} strokeWidth={sw} />
                <rect x="10" y="26" width="16" height="6" rx={r} stroke={stroke} strokeWidth={sw} fill={stroke} opacity="0.2" />
            </svg>
        ),
        'input': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="4" y="12" width="28" height="12" rx={r} stroke={stroke} strokeWidth={sw} />
                <line x1="8" y1="16" x2="8" y2="22" stroke={stroke} strokeWidth={sw} opacity="0.5" />
            </svg>
        ),
        'navbar': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="3" y="10" width="30" height="16" rx={r} stroke={stroke} strokeWidth={sw} />
                <line x1="8" y1="18" x2="13" y2="18" stroke={stroke} strokeWidth={sw} />
                <line x1="15" y1="18" x2="20" y2="18" stroke={stroke} strokeWidth={sw} />
                <line x1="22" y1="18" x2="28" y2="18" stroke={stroke} strokeWidth={sw} />
            </svg>
        ),
        'tabs': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="4" y="12" width="28" height="18" rx={r} stroke={stroke} strokeWidth={sw} />
                <rect x="4" y="6" width="10" height="7" rx={r} stroke={stroke} strokeWidth={sw} fill={stroke} opacity="0.15" />
                <rect x="15" y="6" width="10" height="7" rx={r} stroke={stroke} strokeWidth={sw} />
            </svg>
        ),
        'slider': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="4" y="8" width="28" height="20" rx={r} stroke={stroke} strokeWidth={sw} />
                <polygon points="8,18 13,14 13,22" fill={stroke} opacity="0.5" />
                <polygon points="28,18 23,14 23,22" fill={stroke} opacity="0.5" />
                <circle cx="15" cy="26" r="1.5" fill={stroke} opacity="0.4" />
                <circle cx="18" cy="26" r="1.5" fill={stroke} />
                <circle cx="21" cy="26" r="1.5" fill={stroke} opacity="0.4" />
            </svg>
        ),
        'iframe': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="4" y="6" width="28" height="24" rx={r} stroke={stroke} strokeWidth={sw} />
                <line x1="4" y1="12" x2="32" y2="12" stroke={stroke} strokeWidth={sw} />
                <circle cx="8" cy="9" r="1.2" fill={stroke} opacity="0.5" />
                <circle cx="12" cy="9" r="1.2" fill={stroke} opacity="0.5" />
            </svg>
        ),
        'login': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="8" y="10" width="20" height="16" rx={r} stroke={stroke} strokeWidth={sw} />
                <path d="M15 18h8M20 15l3 3-3 3" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        'cart': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <path d="M8 8h2l3 14h12l3-10H14" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="15" cy="26" r="2" stroke={stroke} strokeWidth={sw} />
                <circle cx="23" cy="26" r="2" stroke={stroke} strokeWidth={sw} />
            </svg>
        ),
        'search': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="4" y="12" width="28" height="12" rx="6" stroke={stroke} strokeWidth={sw} />
                <circle cx="12" cy="18" r="3" stroke={stroke} strokeWidth={1.2} />
                <line x1="14.5" y1="20.5" x2="16" y2="22" stroke={stroke} strokeWidth={1.2} strokeLinecap="round" />
            </svg>
        ),
        'countdown': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="3" y="10" width="7" height="16" rx={r} stroke={stroke} strokeWidth={sw} />
                <rect x="12" y="10" width="7" height="16" rx={r} stroke={stroke} strokeWidth={sw} />
                <rect x="26" y="10" width="7" height="16" rx={r} stroke={stroke} strokeWidth={sw} />
                <text x="6.5" y="21" textAnchor="middle" fill={stroke} fontSize="7" fontWeight="700">1</text>
                <text x="15.5" y="21" textAnchor="middle" fill={stroke} fontSize="7" fontWeight="700">2</text>
                <text x="29.5" y="21" textAnchor="middle" fill={stroke} fontSize="7" fontWeight="700">0</text>
                <circle cx="22" cy="15" r="0.8" fill={stroke} /><circle cx="22" cy="21" r="0.8" fill={stroke} />
            </svg>
        ),
        'quote': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="7" y="8" width="24" height="20" rx={r} stroke={stroke} strokeWidth={sw} />
                <line x1="4" y1="8" x2="4" y2="28" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />
                <text x="19" y="22" textAnchor="middle" fill={stroke} fontSize="14" fontWeight="700" fontFamily="serif" opacity="0.5">"</text>
            </svg>
        ),
        'textsection': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <line x1="6" y1="9" x2="22" y2="9" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
                <line x1="6" y1="16" x2="30" y2="16" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
                <line x1="6" y1="21" x2="28" y2="21" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
                <line x1="6" y1="26" x2="20" y2="26" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
            </svg>
        ),
        'courses': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="3" y="6" width="9" height="12" rx={r} stroke={stroke} strokeWidth={sw} />
                <rect x="13.5" y="6" width="9" height="12" rx={r} stroke={stroke} strokeWidth={sw} />
                <rect x="24" y="6" width="9" height="12" rx={r} stroke={stroke} strokeWidth={sw} />
                <line x1="5" y1="22" x2="10" y2="22" stroke={stroke} strokeWidth={sw} opacity="0.5" />
                <line x1="15.5" y1="22" x2="20.5" y2="22" stroke={stroke} strokeWidth={sw} opacity="0.5" />
                <line x1="26" y1="22" x2="31" y2="22" stroke={stroke} strokeWidth={sw} opacity="0.5" />
            </svg>
        ),
        'blogs': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="5" y="6" width="26" height="24" rx={r} stroke={stroke} strokeWidth={sw} />
                <line x1="10" y1="12" x2="26" y2="12" stroke={stroke} strokeWidth={sw} />
                <line x1="10" y1="17" x2="24" y2="17" stroke={stroke} strokeWidth={sw} opacity="0.6" />
                <line x1="10" y1="22" x2="20" y2="22" stroke={stroke} strokeWidth={sw} opacity="0.4" />
            </svg>
        ),
        'customcode': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <path d="M13 11l-7 7 7 7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23 11l7 7-7 7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
                <line x1="20" y1="8" x2="16" y2="28" stroke={stroke} strokeWidth={sw} strokeLinecap="round" opacity="0.5" />
            </svg>
        ),
        'textarea': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="4" y="7" width="28" height="22" rx={r} stroke={stroke} strokeWidth={sw} />
                <line x1="8" y1="12" x2="8" y2="16" stroke={stroke} strokeWidth={sw} opacity="0.5" />
                <line x1="24" y1="24" x2="28" y2="28" stroke={stroke} strokeWidth={1} opacity="0.4" />
                <line x1="27" y1="24" x2="28" y2="25" stroke={stroke} strokeWidth={1} opacity="0.4" />
            </svg>
        ),
        'select': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="4" y="12" width="28" height="12" rx={r} stroke={stroke} strokeWidth={sw} />
                <path d="M26 16l2 2.5-2 2.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                <line x1="8" y1="18" x2="20" y2="18" stroke={stroke} strokeWidth={sw} opacity="0.4" />
            </svg>
        ),
        'label': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <path d="M6 10h18l6 8-6 8H6z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
                <circle cx="10" cy="18" r="1.5" fill={stroke} opacity="0.5" />
            </svg>
        ),
        'checkbox': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <rect x="8" y="10" width="16" height="16" rx={r} stroke={stroke} strokeWidth={sw} />
                <path d="M12 18l3 3 6-7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        'radio': (
            <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="9" stroke={stroke} strokeWidth={sw} />
                <circle cx="18" cy="18" r="4" fill={stroke} opacity="0.6" />
            </svg>
        ),
    };

    if (visualIcons[widgetId]) return visualIcons[widgetId];

    // Fallback: return null (will use lucide icon instead)
    return null;
};

// ─── Style Section (collapsible) ───
const StyleSection = ({ title, color, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div style={{ borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
            <div
                onClick={() => setOpen(!open)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px',
                    cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: '#94a3b8',
                    letterSpacing: '0.03em', userSelect: 'none',
                }}
            >
                <span style={{ fontSize: '7px', color: '#64748b' }}>{open ? '▾' : '▸'}</span>
                {color && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color }} />}
                {title}
            </div>
            {open && <div style={{ padding: '0 14px 12px' }}>{children}</div>}
        </div>
    );
};

// ─── Style Input Row (2-column) ───
const StyleRow = ({ children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>{children}</div>
);

// ─── Style Field ───
const StyleField = ({ label, value, onChange, type = 'text', options, color: fieldColor }) => {
    const inputStyle = {
        width: '100%', padding: '5px 7px', fontSize: '11px', fontFamily: '"JetBrains Mono", monospace',
        background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(148,163,184,0.1)',
        borderRadius: '4px', color: '#cbd5e1', outline: 'none',
    };
    return (
        <div>
            <div style={{ fontSize: '10px', color: fieldColor || '#64748b', marginBottom: '3px', fontWeight: '500' }}>{label}</div>
            {options ? (
                <select value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            ) : type === 'color' ? (
                <div style={{ display: 'flex', gap: '4px' }}>
                    <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    <input type="color" value={value && value.startsWith('#') ? value : '#000000'} onChange={(e) => onChange(e.target.value)}
                        style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }} />
                </div>
            ) : (
                <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(129,140,248,0.4)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.1)'}
                />
            )}
        </div>
    );
};

// ─── Full Style Properties Panel ───
const StylePanel = ({ styles, onStyleChange, elementName }) => {
    if (!styles) return null;
    const s = (prop) => styles[prop] || '';
    const set = (prop) => (val) => onStyleChange(prop, val);

    return (
        <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
            {/* Selected element info */}
            <div style={{
                padding: '10px 14px', borderBottom: '1px solid rgba(148,163,184,0.06)',
                fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8' }} />
                <span style={{ fontWeight: '600', color: '#cbd5e1' }}>{elementName || 'Element'}</span>
            </div>

            {/* ── General ── */}
            <StyleSection title="General" color="#818cf8">
                <StyleRow>
                    <StyleField label="Display" value={s('display')} onChange={set('display')}
                        options={['block', 'flex', 'grid', 'inline', 'inline-block', 'inline-flex', 'none']} />
                    <StyleField label="Position" value={s('position')} onChange={set('position')}
                        options={['static', 'relative', 'absolute', 'fixed', 'sticky']} />
                </StyleRow>
                <StyleRow>
                    <StyleField label="Top" value={s('top')} onChange={set('top')} />
                    <StyleField label="Right" value={s('right')} onChange={set('right')} />
                </StyleRow>
                <StyleRow>
                    <StyleField label="Bottom" value={s('bottom')} onChange={set('bottom')} />
                    <StyleField label="Left" value={s('left')} onChange={set('left')} />
                </StyleRow>
                <StyleField label="Overflow" value={s('overflow')} onChange={set('overflow')}
                    options={['visible', 'hidden', 'scroll', 'auto']} />
            </StyleSection>

            {/* ── Dimension ── */}
            <StyleSection title="Dimension" color="#38bdf8">
                <StyleRow>
                    <StyleField label="Width" value={s('width')} onChange={set('width')} />
                    <StyleField label="Height" value={s('height')} onChange={set('height')} />
                </StyleRow>
                <StyleRow>
                    <StyleField label="Max Width" value={s('maxWidth')} onChange={set('maxWidth')} />
                    <StyleField label="Min Height" value={s('minHeight')} onChange={set('minHeight')} />
                </StyleRow>
            </StyleSection>

            {/* ── Margin ── */}
            <StyleSection title="Margin" color="#fbbf24" defaultOpen={false}>
                <StyleRow>
                    <StyleField label="Top" value={s('marginTop')} onChange={set('marginTop')} />
                    <StyleField label="Right" value={s('marginRight')} onChange={set('marginRight')} />
                </StyleRow>
                <StyleRow>
                    <StyleField label="Bottom" value={s('marginBottom')} onChange={set('marginBottom')} />
                    <StyleField label="Left" value={s('marginLeft')} onChange={set('marginLeft')} />
                </StyleRow>
            </StyleSection>

            {/* ── Padding ── */}
            <StyleSection title="Padding" color="#f472b6" defaultOpen={false}>
                <StyleRow>
                    <StyleField label="Top" value={s('paddingTop')} onChange={set('paddingTop')} color="#f472b6" />
                    <StyleField label="Right" value={s('paddingRight')} onChange={set('paddingRight')} color="#f472b6" />
                </StyleRow>
                <StyleRow>
                    <StyleField label="Bottom" value={s('paddingBottom')} onChange={set('paddingBottom')} color="#f472b6" />
                    <StyleField label="Left" value={s('paddingLeft')} onChange={set('paddingLeft')} color="#f472b6" />
                </StyleRow>
            </StyleSection>

            {/* ── Typography ── */}
            <StyleSection title="Typography" color="#fbbf24">
                <StyleRow>
                    <StyleField label="Font" value={s('fontFamily')} onChange={set('fontFamily')}
                        options={['Arial', 'Inter', 'Roboto', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'system-ui', 'monospace', 'sans-serif', 'serif']} />
                    <StyleField label="Font Size" value={s('fontSize')} onChange={set('fontSize')} />
                </StyleRow>
                <StyleRow>
                    <StyleField label="Weight" value={s('fontWeight')} onChange={set('fontWeight')}
                        options={['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']} />
                    <StyleField label="Letter Spacing" value={s('letterSpacing')} onChange={set('letterSpacing')} />
                </StyleRow>
                <StyleField label="Font Color" value={s('color')} onChange={set('color')} type="color" />
                <div style={{ marginTop: '6px' }} />
                <StyleRow>
                    <StyleField label="Line Height" value={s('lineHeight')} onChange={set('lineHeight')} />
                    <StyleField label="Text Align" value={s('textAlign')} onChange={set('textAlign')}
                        options={['left', 'center', 'right', 'justify']} />
                </StyleRow>
                <StyleField label="Text Decoration" value={s('textDecoration')} onChange={set('textDecoration')}
                    options={['none', 'underline', 'line-through', 'overline']} />
            </StyleSection>

            {/* ── Decorations ── */}
            <StyleSection title="Decorations" color="#34d399">
                <StyleField label="Opacity" value={s('opacity')} onChange={set('opacity')} />
                <div style={{ marginTop: '6px' }} />
                <StyleField label="Background Color" value={s('backgroundColor')} onChange={set('backgroundColor')} type="color" />
                <div style={{ marginTop: '8px', fontSize: '10px', color: '#f472b6', fontWeight: '500', marginBottom: '4px' }}>Border Radius</div>
                <StyleRow>
                    <StyleField label="Top" value={s('borderTopLeftRadius')} onChange={set('borderTopLeftRadius')} />
                    <StyleField label="Right" value={s('borderTopRightRadius')} onChange={set('borderTopRightRadius')} />
                </StyleRow>
                <StyleRow>
                    <StyleField label="Bottom" value={s('borderBottomLeftRadius')} onChange={set('borderBottomLeftRadius')} />
                    <StyleField label="Left" value={s('borderBottomRightRadius')} onChange={set('borderBottomRightRadius')} />
                </StyleRow>
                <div style={{ marginTop: '8px', fontSize: '10px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Border</div>
                <StyleRow>
                    <StyleField label="Width" value={s('borderWidth')} onChange={set('borderWidth')} />
                    <StyleField label="Style" value={s('borderStyle')} onChange={set('borderStyle')}
                        options={['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge']} />
                </StyleRow>
                <StyleField label="Border Color" value={s('borderColor')} onChange={set('borderColor')} type="color" />
                <div style={{ marginTop: '6px' }} />
                <StyleField label="Box Shadow" value={s('boxShadow')} onChange={set('boxShadow')} />
            </StyleSection>

            {/* ── Flex ── */}
            <StyleSection title="Flex" color="#818cf8" defaultOpen={false}>
                <StyleRow>
                    <StyleField label="Direction" value={s('flexDirection')} onChange={set('flexDirection')}
                        options={['row', 'column', 'row-reverse', 'column-reverse']} />
                    <StyleField label="Wrap" value={s('flexWrap')} onChange={set('flexWrap')}
                        options={['nowrap', 'wrap', 'wrap-reverse']} />
                </StyleRow>
                <StyleRow>
                    <StyleField label="Justify" value={s('justifyContent')} onChange={set('justifyContent')}
                        options={['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']} />
                    <StyleField label="Align" value={s('alignItems')} onChange={set('alignItems')}
                        options={['stretch', 'flex-start', 'center', 'flex-end', 'baseline']} />
                </StyleRow>
                <StyleField label="Gap" value={s('gap')} onChange={set('gap')} />
            </StyleSection>

            {/* ── Extra ── */}
            <StyleSection title="Extra" color="#94a3b8" defaultOpen={false}>
                <StyleField label="Transition" value={s('transition')} onChange={set('transition')} />
                <div style={{ marginTop: '6px' }} />
                <StyleField label="Cursor" value={s('cursor')} onChange={set('cursor')}
                    options={['auto', 'default', 'pointer', 'move', 'text', 'wait', 'crosshair', 'not-allowed', 'grab']} />
                <div style={{ marginTop: '8px', fontSize: '10px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Transform</div>
                <StyleRow>
                    <StyleField label="Rotate" value={s('rotate')} onChange={set('rotate')} />
                    <StyleField label="Scale" value={s('scale')} onChange={set('scale')} />
                </StyleRow>
            </StyleSection>

            {/* Bottom padding */}
            <div style={{ height: '40px' }} />
        </div>
    );
};

const CATEGORIES = [
    { key: 'all', label: 'All', icon: Sparkles },
    { key: 'layout', label: 'Layout', icon: Layout },
    { key: 'media', label: 'Media', icon: ImageIcon },
    { key: 'interactive', label: 'Actions', icon: Zap },
    { key: 'content', label: 'Content', icon: FileText },
    { key: 'forms', label: 'Forms', icon: FormInput },
];

const HeaderStudio = ({ isOpen, onClose, initialHtml, initialCss, onSave, onUnpublish, initialTab = 'design' }) => {
    const [htmlCode, setHtmlCode] = useState(initialHtml);
    const [cssCode, setCssCode] = useState(initialCss);
    const [deviceMode, setDeviceMode] = useState('desktop');
    const [activeTab, setActiveTab] = useState(initialTab);
    const [activeCat, setActiveCat] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredWidget, setHoveredWidget] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [sidebarView, setSidebarView] = useState('components'); // 'components' | 'structure'
    const [hoveredLayer, setHoveredLayer] = useState(null);
    const [selectedLayer, setSelectedLayer] = useState(null);
    const [selectedStyles, setSelectedStyles] = useState(null);
    const [selectedElementIndex, setSelectedElementIndex] = useState(-1);
    const [selectedElementName, setSelectedElementName] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [draggedSnippet, setDraggedSnippet] = useState(null);
    const iframeRef = useRef(null);

    // Listen for messages from the preview iframe (delete, reorder, etc.)
    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data && e.data.type === 'builder-update-html') {
                setHtmlCode(e.data.html || '');
            }
            if (e.data && e.data.type === 'builder-element-clicked') {
                const idx = e.data.index;
                setSelectedLayer('_node_' + idx);
                setSelectedElementIndex(idx);
                setSelectedElementName(e.data.tagName || 'Element');
                if (idx >= 0) {
                    // Request computed styles from iframe
                    if (iframeRef.current && iframeRef.current.contentWindow) {
                        iframeRef.current.contentWindow.postMessage({ type: 'builder-get-styles', index: idx }, '*');
                    }
                } else {
                    // Clicking background — sync any pending style changes, then clear
                    if (iframeRef.current && iframeRef.current.contentWindow) {
                        iframeRef.current.contentWindow.postMessage({ type: 'builder-sync-html' }, '*');
                    }
                    setSelectedStyles(null);
                    setSelectedElementName('');
                }
            }
            if (e.data && e.data.type === 'builder-element-styles') {
                setSelectedStyles(e.data.styles || null);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Select a layer from the structure panel and highlight on canvas
    const handleSelectLayer = useCallback((nodeId, topIndex) => {
        setSelectedLayer(nodeId);
        // Robust selection: find the absolute index in a flat list of all elements
        // The structure panel provides 'topIndex' which we now treat as the absolute index 
        // because we'll flatten the tree to find it or similar.
        // Actually, let's just use the nodeId suffix if it was generated from the absolute list.
        const absoluteIndex = nodeId.startsWith('_node_') ? parseInt(nodeId.replace('_node_', '')) : -1;

        setSelectedElementIndex(absoluteIndex);
        if (iframeRef.current && iframeRef.current.contentWindow && absoluteIndex >= 0) {
            iframeRef.current.contentWindow.postMessage({ type: 'builder-select-element', index: absoluteIndex }, '*');
            // Also request styles
            iframeRef.current.contentWindow.postMessage({ type: 'builder-get-styles', index: absoluteIndex }, '*');
        }
    }, []);

    // Sync iframe HTML back to parent state without reloading
    const syncIframeHtml = useCallback(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'builder-sync-html' }, '*');
        }
    }, []);

    // Debounce timer ref for style changes
    const styleSyncTimer = useRef(null);

    // Handle style change from the properties panel
    const handleStyleChange = useCallback((property, value) => {
        if (iframeRef.current && iframeRef.current.contentWindow && selectedElementIndex >= 0) {
            iframeRef.current.contentWindow.postMessage({
                type: 'builder-apply-style', index: selectedElementIndex, property, value
            }, '*');
        }
        // Update local state immediately for responsive UI
        setSelectedStyles(prev => prev ? { ...prev, [property]: value } : prev);
        // Debounced sync — wait 800ms after user stops editing, then sync HTML
        if (styleSyncTimer.current) clearTimeout(styleSyncTimer.current);
        styleSyncTimer.current = setTimeout(() => {
            syncIframeHtml();
        }, 800);
    }, [selectedElementIndex, syncIframeHtml]);

    // Close the properties panel and sync HTML
    const handleCloseStylePanel = useCallback(() => {
        // Sync any pending changes first
        if (styleSyncTimer.current) clearTimeout(styleSyncTimer.current);
        syncIframeHtml();
        setSelectedStyles(null);
        setSelectedElementIndex(-1);
        setSelectedElementName('');
        setSelectedLayer(null);
    }, [syncIframeHtml]);

    // Move a top-level element up or down in the HTML
    const handleMoveNode = useCallback((index, direction) => {
        setHtmlCode(prev => {
            const parser = new DOMParser();
            const doc = parser.parseFromString('<body>' + prev + '</body>', 'text/html');
            const body = doc.body;
            const children = Array.from(body.children);
            const newIdx = index + direction;
            if (newIdx < 0 || newIdx >= children.length) return prev;
            if (direction === -1) {
                body.insertBefore(children[index], children[newIdx]);
            } else {
                body.insertBefore(children[newIdx], children[index]);
            }
            return body.innerHTML;
        });
    }, []);

    // Delete a top-level element
    const handleDeleteNode = useCallback((index) => {
        setHtmlCode(prev => {
            const parser = new DOMParser();
            const doc = parser.parseFromString('<body>' + prev + '</body>', 'text/html');
            const body = doc.body;
            const children = Array.from(body.children);
            if (index >= 0 && index < children.length) {
                children[index].remove();
            }
            return body.innerHTML;
        });
        setSelectedLayer(null);
    }, []);

    // Duplicate a top-level element
    const handleDuplicateNode = useCallback((index) => {
        setHtmlCode(prev => {
            const parser = new DOMParser();
            const doc = parser.parseFromString('<body>' + prev + '</body>', 'text/html');
            const body = doc.body;
            const children = Array.from(body.children);
            if (index >= 0 && index < children.length) {
                const clone = children[index].cloneNode(true);
                children[index].insertAdjacentElement('afterend', clone);
            }
            return body.innerHTML;
        });
    }, []);

    // Toggle visibility of a top-level element
    const handleToggleVisibility = useCallback((index) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'builder-toggle-visibility', index }, '*');
        }
    }, []);

    // Parse HTML into a tree for the layer panel
    const layerTree = useMemo(() => parseHtmlToTree(htmlCode), [htmlCode]);

    // Filter widgets
    const filteredWidgets = useMemo(() => {
        return ALL_WIDGETS.filter(w => {
            const matchCat = activeCat === 'all' || w.cat === activeCat;
            const matchSearch = !searchQuery || w.label.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [activeCat, searchQuery]);

    if (!isOpen) return null;

    const previewContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, sans-serif; background: #ffffff; overflow-x: hidden; }
          * { box-sizing: border-box; }
          /* Builder-mode: row & cell styling */
          .row {
            display: flex; width: 100%; min-height: 75px;
            border: 2px solid #3b97e3; border-radius: 3px;
            position: relative; margin-bottom: 8px;
            background: rgba(59,151,227,0.04);
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .row:hover {
            box-shadow: 0 0 0 1px #3b97e3;
          }
          .row::before {
            content: 'Row';
            position: absolute; top: 0; left: 0;
            background: #3b97e3; color: #fff;
            font-size: 10px; font-weight: 600;
            padding: 2px 8px; border-radius: 0 0 3px 0;
            z-index: 2; line-height: 1.4;
          }
          .cell {
            flex: 1; min-height: 75px;
            border: 1px dashed #92c5f0;
            margin: 4px; border-radius: 2px;
            position: relative;
            transition: background 0.2s, border-color 0.2s;
          }
          .cell:hover {
            background: rgba(59,151,227,0.08);
            border-color: #3b97e3;
          }
          /* Navbar styling */
          .navbar {
            background: #333; width: 100%;
            border: 2px solid #3b97e3; border-radius: 3px;
            position: relative; margin-bottom: 8px;
          }
          .navbar::before {
            content: 'Navbar';
            position: absolute; top: 0; left: 0;
            background: #3b97e3; color: #fff;
            font-size: 10px; font-weight: 600;
            padding: 2px 8px; border-radius: 0 0 3px 0;
            z-index: 2; line-height: 1.4;
          }
          .navbar-container {
            display: flex; align-items: center;
            justify-content: space-between;
            padding: 0 16px; min-height: 48px;
            gap: 20px;
          }
          .navbar-brand {
            color: #fff; font-weight: 700; font-size: 16px;
            cursor: text; outline: none;
            padding: 4px 8px; border-radius: 3px;
          }
          .navbar-brand:hover { background: rgba(255,255,255,0.08); }
          .navbar-brand:focus { background: rgba(59,151,227,0.2); }
          .navbar-menu {
            list-style: none; margin: 0; padding: 0;
            display: flex; gap: 0; align-items: center;
          }
          .navbar-menu li { position: relative; }
          .navbar-menu li a {
            color: #ddd; text-decoration: none;
            padding: 12px 16px; display: block;
            font-size: 14px; font-weight: 500;
            transition: color 0.2s, background 0.2s;
            cursor: text; outline: none;
            border: 1px solid transparent; border-radius: 2px;
          }
          .navbar-menu li a:hover {
            color: #fff; background: rgba(255,255,255,0.08);
          }
          .navbar-menu li a:focus {
            border-color: #3b97e3;
            background: rgba(59,151,227,0.15);
          }

          /* ─── Graphy-style component CSS ─── */
          [contenteditable="true"] { outline: none; cursor: text; }
          [contenteditable="true"]:focus { box-shadow: inset 0 0 0 2px rgba(59,151,227,0.4); border-radius: 3px; }
          [data-component] { position: relative; border: 1px dashed transparent; transition: border-color 0.2s; margin-bottom: 8px; }
          [data-component]:hover { border-color: #3b97e3; }

          /* Tabs */
          .gp-tabs { border: 2px solid #3b97e3; border-radius: 4px; overflow: hidden; position: relative; }
          .gp-tabs::before { content:'Tabs'; position:absolute;top:0;left:0;background:#3b97e3;color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:0 0 3px 0;z-index:10; }
          .gp-tabs-header { display:flex; background:#f1f5f9; border-bottom:2px solid #e2e8f0; position: relative; z-index: 5; }
          .gp-tab-btn { padding:10px 20px; border:none; background:transparent; cursor:pointer; font-size:13px; font-weight:500; color:#64748b; border-bottom:2px solid transparent; margin-bottom:-2px; transition:all 0.2s; }
          .gp-tab-btn.active { color:#4f46e5; border-bottom-color:#4f46e5; background:#fff; }
          .gp-tab-btn:hover { color:#334155; background:#f8fafc; }
          .gp-tab-content-wrapper { position: relative; }
          .gp-tab-pane { display: none; padding:16px; min-height:60px; }
          .gp-tab-pane.active { display: block; }

          /* Image */
          .gp-image-wrapper { position:relative; border:2px solid #3b97e3; border-radius:4px; overflow:hidden; }
          .gp-image-wrapper::before { content:'Image'; position:absolute;top:0;left:0;background:#3b97e3;color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:0 0 3px 0;z-index:2; }
          .gp-image { width:100%; display:block; min-height:120px; background:#f1f5f9; }
          .gp-image-overlay { position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.6); color:#fff; text-align:center; padding:8px; font-size:12px; opacity:0; transition:opacity 0.2s; }
          .gp-image-wrapper:hover .gp-image-overlay { opacity:1; }

          /* Video / Map / Iframe */
          .gp-video, .gp-map, .gp-iframe { border:2px solid #3b97e3; border-radius:4px; overflow:hidden; }
          .gp-video::before { content:'Video'; position:absolute;top:0;left:0;background:#3b97e3;color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:0 0 3px 0;z-index:2; }
          .gp-map::before { content:'Map'; position:absolute;top:0;left:0;background:#3b97e3;color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:0 0 3px 0;z-index:2; }
          .gp-iframe::before { content:'Embed'; position:absolute;top:0;left:0;background:#3b97e3;color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:0 0 3px 0;z-index:2; }
          .gp-video-inner { position:relative; padding-bottom:56.25%; height:0; }
          .gp-video-inner iframe { position:absolute; top:0; left:0; width:100%; height:100%; }
          .gp-map iframe, .gp-iframe iframe { width:100%; height:250px; display:block; }
          .gp-video-label, .gp-map-label, .gp-iframe-label { background:#f1f5f9; padding:6px 12px; font-size:11px; color:#64748b; text-align:center; }

          /* Slider */
          .gp-slider { border:2px solid #3b97e3; border-radius:4px; overflow:hidden; }
          .gp-slider::before { content:'Slider'; position:absolute;top:0;left:0;background:#3b97e3;color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:0 0 3px 0;z-index:2; }
          .gp-slide { display:none; min-height:150px; padding:40px 20px; text-align:center; font-size:18px; color:#64748b; align-items:center; justify-content:center; }
          .gp-slide.active { display:flex; }
          .gp-slider-nav { display:flex; align-items:center; justify-content:center; gap:12px; padding:10px; background:#f8fafc; }
          .gp-slider-arrow { background:#e2e8f0; border:none; width:28px; height:28px; border-radius:50%; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center; }
          .gp-slider-arrow:hover { background:#cbd5e1; }
          .gp-slider-dots { display:flex; gap:6px; }
          .gp-slider-dots .dot { width:8px; height:8px; border-radius:50%; background:#cbd5e1; }
          .gp-slider-dots .dot.active { background:#4f46e5; }

          /* Buttons */
          .gp-btn { padding:10px 24px; border-radius:6px; font-size:14px; font-weight:600; cursor:pointer; outline:none; transition:all 0.2s; display:inline-block; }
          .gp-btn-primary { background:#4f46e5; color:#fff; border:none; }
          .gp-btn-primary:hover { background:#4338ca; }
          .gp-btn-outline { background:transparent; color:#4f46e5; border:2px solid #4f46e5; }
          .gp-btn-outline:hover { background:#4f46e5; color:#fff; }

          /* Cart */
          .gp-cart { display:inline-flex; align-items:center; position:relative; cursor:pointer; }
          .gp-cart-icon { font-size:24px; }
          .gp-cart-badge { position:absolute; top:-8px; right:-10px; background:#ef4444; color:#fff; border-radius:50%; width:20px; height:20px; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; }

          /* Search */
          .gp-search { display:flex; gap:0; border:2px solid #e2e8f0; border-radius:8px; overflow:hidden; background:#fff; flex:1; max-width:400px; margin:0 auto; }
          .gp-search-input { flex:1; padding:10px 16px; border:none; outline:none; font-size:14px; background:transparent; }
          .gp-search-btn { padding:10px 16px; border:none; background:#4f46e5; cursor:pointer; font-size:16px; color:#fff; }
          .gp-search-btn:hover { background:#4338ca; }

          /* Link */
          .gp-link { color:#4f46e5; text-decoration:none; font-weight:500; font-size:14px; }
          .gp-link:hover { text-decoration:underline; }
          .gp-link-block { display:block; padding:16px; border:2px dashed #e2e8f0; border-radius:8px; text-decoration:none; color:#334155; transition:border-color 0.2s, background 0.2s; }
          .gp-link-block:hover { border-color:#4f46e5; background:rgba(79,70,229,0.03); }

          /* Countdown */
          .gp-countdown { display:flex; align-items:center; gap:8px; padding:12px; }
          .gp-cd-box { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px 16px; text-align:center; min-width:60px; }
          .gp-cd-num { display:block; font-size:28px; font-weight:800; color:#1e293b; line-height:1; }
          .gp-cd-label { display:block; font-size:10px; color:#94a3b8; text-transform:uppercase; margin-top:4px; letter-spacing:0.5px; }
          .gp-cd-sep { font-size:24px; font-weight:700; color:#94a3b8; }

          /* Text */
          .gp-text { padding:8px; line-height:1.7; color:#334155; font-size:15px; }
          .gp-text p { margin:0; }

          /* Quote */
          .gp-quote { border-left:4px solid #4f46e5; padding:16px 24px; margin:8px 0; background:#f8fafc; border-radius:0 8px 8px 0; }
          .gp-quote-text { font-size:16px; color:#475569; font-style:italic; line-height:1.6; }
          .gp-quote-author { margin-top:8px; font-size:13px; color:#94a3b8; font-style:normal; }

          /* Section */
          .gp-section { padding:24px 16px; }
          .gp-section-title { font-size:24px; font-weight:700; color:#1e293b; margin:0 0 8px 0; }
          .gp-section-text { font-size:15px; color:#64748b; line-height:1.7; margin:0; }

          /* Courses */
          .gp-courses { padding:16px; }
          .gp-courses-heading { font-size:20px; font-weight:700; color:#1e293b; margin:0 0 16px 0; }
          .gp-courses-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
          .gp-course-card { border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; transition:box-shadow 0.2s; }
          .gp-course-card:hover { box-shadow:0 4px 12px rgba(0,0,0,0.08); }
          .gp-course-thumb { padding:24px; text-align:center; font-size:40px; background:#f8fafc; }
          .gp-course-info { padding:12px; }
          .gp-course-title { font-weight:600; color:#1e293b; font-size:14px; }
          .gp-course-price { color:#4f46e5; font-weight:700; font-size:14px; margin-top:4px; }

          /* Blogs */
          .gp-blogs { padding:16px; }
          .gp-blogs-heading { font-size:20px; font-weight:700; color:#1e293b; margin:0 0 16px 0; }
          .gp-blogs-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
          .gp-blog-card { border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; transition:box-shadow 0.2s; }
          .gp-blog-card:hover { box-shadow:0 4px 12px rgba(0,0,0,0.08); }
          .gp-blog-thumb { padding:20px; text-align:center; font-size:36px; background:#f8fafc; }
          .gp-blog-title { font-weight:600; color:#1e293b; font-size:14px; padding:10px 12px 4px; }
          .gp-blog-excerpt { font-size:12px; color:#94a3b8; padding:0 12px 12px; line-height:1.5; }

          /* Custom Code */
          .gp-customcode { border:2px dashed #94a3b8; border-radius:6px; padding:16px; background:#f8fafc; font-family:monospace; }
          .gp-cc-label { font-size:14px; font-weight:600; color:#64748b; margin-bottom:8px; }
          .gp-cc-area { font-size:12px; color:#94a3b8; }

          /* Forms */
          .gp-form { display:flex; flex-direction:column; gap:14px; padding:16px; max-width:450px; }
          .gp-form-group { display:flex; flex-direction:column; gap:4px; }
          .gp-form-label { font-size:13px; font-weight:600; color:#334155; }
          .gp-form-input { padding:10px 14px; border:1px solid #e2e8f0; border-radius:6px; font-size:14px; font-family:inherit; outline:none; transition:border-color 0.2s; }
          .gp-form-input:focus { border-color:#4f46e5; }
          .gp-form-textarea { min-height:80px; resize:vertical; }
          .gp-label { font-weight:600; font-size:14px; color:#334155; display:block; padding:4px; }
          .gp-checkbox, .gp-radio { display:flex; align-items:center; gap:8px; cursor:pointer; padding:4px; font-size:14px; color:#334155; }
          .gp-radio-group { display:flex; flex-direction:column; gap:8px; padding:8px; }
          .gp-login-block { display:inline-block; }

          /* Builder selected element highlight */
          .builder-selected {
            outline: 2px solid #fbbf24 !important;
            outline-offset: 2px;
            box-shadow: 0 0 0 4px rgba(251,191,36,0.15) !important;
          }
          /* Builder toolbar on elements */
          body > * { position: relative; }
          .builder-toolbar {
            position: absolute; top: 0; right: 0; z-index: 100;
            display: none; gap: 2px; padding: 2px;
            background: #3b97e3; border-radius: 0 0 0 4px;
          }
          body > *:hover > .builder-toolbar { display: flex; }
          .builder-toolbar button {
            background: transparent; border: none; color: #fff;
            cursor: pointer; padding: 3px 5px; font-size: 12px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 2px; transition: background 0.15s;
          }
          .builder-toolbar button:hover { background: rgba(255,255,255,0.25); }
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
        <script>
          (function() {
            var selectedIdx = -1;

            function addToolbars() {
              document.querySelectorAll('.builder-toolbar').forEach(t => t.remove());
              // Add toolbars and click listeners to elements
              // We only add toolbars to top-level elements or components with data-component
              var items = document.body.querySelectorAll('*');
              items.forEach((el, i) => {
                if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.classList.contains('builder-toolbar')) return;

                // Add select listener
                el.onclick = function(e) {
                  e.stopPropagation();
                  clearSelection();
                  el.classList.add('builder-selected');
                  var idx = Array.from(document.body.querySelectorAll('*')).indexOf(el);
                  var tagInfo = el.tagName.toLowerCase();
                  var cls = el.className ? el.className.toString().split(' ').find(function(c) { return c.startsWith('gp-'); }) : '';
                  window.parent.postMessage({ type: 'builder-element-clicked', index: idx, tagName: cls || tagInfo }, '*');

                  // --- Inline Tab Switching Logic ---
                  if (el.classList.contains('gp-tab-btn')) {
                    var tabsContainer = el.closest('.gp-tabs');
                    if (tabsContainer) {
                      var btns = tabsContainer.querySelectorAll('.gp-tab-btn');
                      var btnIdx = Array.from(btns).indexOf(el);
                      var contentWrapper = tabsContainer.querySelector('.gp-tab-content-wrapper');
                      if (contentWrapper) {
                        var panes = contentWrapper.querySelectorAll('.gp-tab-pane');
                        btns.forEach(b => b.classList.remove('active'));
                        panes.forEach(p => p.classList.remove('active'));
                        el.classList.add('active');
                        if (panes[btnIdx]) panes[btnIdx].classList.add('active');
                      }
                    }
                  }

                  // --- Inline Slider Logic ---
                  if (el.classList.contains('gp-slider-arrow') || el.classList.contains('dot')) {
                    var slider = el.closest('.gp-slider');
                    if (slider) {
                      var slides = slider.querySelectorAll('.gp-slide');
                      var dots = slider.querySelectorAll('.dot');
                      var current = Array.from(slides).findIndex(s => s.classList.contains('active'));
                      if (current === -1) current = 0;
                      
                      var next = current;
                      if (el.classList.contains('prev')) next = (current - 1 + slides.length) % slides.length;
                      else if (el.classList.contains('next')) next = (current + 1) % slides.length;
                      else if (el.classList.contains('dot')) next = Array.from(dots).indexOf(el);

                      slides.forEach((s, idx) => s.classList.toggle('active', idx === next));
                      dots.forEach((d, idx) => d.classList.toggle('active', idx === next));
                    }
                  }
                };

                // Only add actions toolbar to top-level or data-component elements
                if (el.parentElement === document.body || el.hasAttribute('data-component')) {
                  var tb = document.createElement('div');
                  tb.className = 'builder-toolbar';
                  
                  // Move Up
                  var btnUp = document.createElement('button');
                  btnUp.innerHTML = '↑';
                  btnUp.onclick = function(e) {
                    e.stopPropagation();
                    if (el.previousElementSibling) {
                      el.parentElement.insertBefore(el, el.previousElementSibling);
                      syncBack();
                    }
                  };
                  
                  // Duplicate
                  var btnDup = document.createElement('button');
                  btnDup.innerHTML = '⧉';
                  btnDup.onclick = function(e) {
                    e.stopPropagation();
                    var clone = el.cloneNode(true);
                    clone.querySelectorAll('.builder-toolbar').forEach(t => t.remove());
                    el.after(clone);
                    syncBack();
                  };
                  
                  // Delete
                  var btnDel = document.createElement('button');
                  btnDel.innerHTML = '✕';
                  btnDel.onclick = function(e) {
                    e.stopPropagation();
                    el.remove();
                    syncBack();
                  };
                  
                  tb.appendChild(btnUp);
                  tb.appendChild(btnDup);
                  tb.appendChild(btnDel);
                  el.appendChild(tb);
                }
              });
            }

            function syncBack() {
              document.querySelectorAll('.builder-toolbar').forEach(t => t.remove());
              document.querySelectorAll('.builder-selected').forEach(t => t.classList.remove('builder-selected'));
              var html = document.body.innerHTML;
              // Prevent early script termination by splitting the tag string
              var scriptRegex = new RegExp('<script[\\s\\S]*?<\\/script>', 'gi');
              html = html.replace(scriptRegex, '').trim();
              window.parent.postMessage({ type: 'builder-update-html', html: html }, '*');
              setTimeout(addToolbars, 50);
            }

            function getYouTubeId(url) {
              var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
              var match = url.match(regExp);
              return (match && match[2].length == 11) ? match[2] : null;
            }

            // Double click for media elements
            document.addEventListener('dblclick', function(e) {
              // Image
              var imgWrapper = e.target.closest('.gp-image-wrapper');
              if (imgWrapper) {
                var img = imgWrapper.querySelector('img');
                if (img) {
                  var url = prompt('Enter new image URL:', img.src);
                  if (url && url.trim()) { img.src = url.trim(); syncBack(); }
                }
                return;
              }

              // Video
              var vidWrapper = e.target.closest('.gp-video');
              if (vidWrapper) {
                var frame = vidWrapper.querySelector('iframe');
                if (frame) {
                  var url = prompt('Enter YouTube URL or Embed Link:', frame.src);
                  if (url && url.trim()) {
                    var finalUrl = url.trim();
                    var ytId = getYouTubeId(finalUrl);
                    if (ytId) finalUrl = 'https://www.youtube.com/embed/' + ytId;
                    frame.src = finalUrl;
                    syncBack();
                  }
                }
                return;
              }

              // Map / Iframe
              var embedWrapper = e.target.closest('.gp-map, .gp-iframe');
              if (embedWrapper) {
                var frame = embedWrapper.querySelector('iframe');
                if (frame) {
                  var url = prompt('Enter new Source URL:', frame.src);
                  if (url && url.trim()) { frame.src = url.trim(); syncBack(); }
                }
                return;
              }
            });

            // Selection and body clicks
            document.body.onclick = function(e) {
              if (e.target === document.body) {
                clearSelection();
                window.parent.postMessage({ type: 'builder-element-clicked', index: -1 }, '*');
              }
            };

            function clearSelection() {
              document.querySelectorAll('.builder-selected').forEach(el => el.classList.remove('builder-selected'));
            }

            window.addEventListener('message', function(e) {
              var els = document.body.querySelectorAll('*');
              if (e.data.type === 'builder-select-element') {
                clearSelection();
                var idx = e.data.index;
                if (idx >= 0 && idx < els.length) {
                  els[idx].classList.add('builder-selected');
                  els[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
              }
              if (e.data.type === 'builder-apply-style') {
                var idx = e.data.index;
                if (idx >= 0 && idx < els.length) {
                  els[idx].style[e.data.property] = e.data.value;
                }
              }
              if (e.data.type === 'builder-get-styles') {
                var idx = e.data.index;
                if (idx >= 0 && idx < els.length) {
                  var el = els[idx];
                  var cs = window.getComputedStyle(el);
                  var props = ['display','position','top','right','bottom','left','overflow',
                    'width','height','maxWidth','minHeight',
                    'marginTop','marginRight','marginBottom','marginLeft',
                    'paddingTop','paddingRight','paddingBottom','paddingLeft',
                    'fontFamily','fontSize','fontWeight','letterSpacing','color','lineHeight','textAlign','textDecoration',
                    'opacity','backgroundColor',
                    'borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius',
                    'borderWidth','borderStyle','borderColor','boxShadow',
                    'flexDirection','flexWrap','justifyContent','alignItems','gap',
                    'transition','cursor','rotate','scale'];
                  var stylesObj = {};
                  props.forEach(p => { try { stylesObj[p] = cs[p] || ''; } catch(err) {} });
                  window.parent.postMessage({ type: 'builder-element-styles', styles: stylesObj }, '*');
                }
              }
              if (e.data.type === 'builder-sync-html') syncBack();
            });

            addToolbars();
          })();
        </script>
      </body>
    </html>
  `;

    const handleAddWidget = (snippet) => {
        if (selectedElementIndex >= 0 && (selectedElementName === 'cell' || selectedElementName === 'row' || selectedElementName === 'div' || selectedElementName === 'section')) {
            // Try to insert INTO the selected element
            if (iframeRef.current && iframeRef.current.contentWindow) {
                // We need a way to tell the iframe to insert into a specific index
                // For now, let's just append to body if we don't have a complex DOM manipulator in iframe
                // But let's improve the iframe script later to support "append to selected"
                setHtmlCode(prev => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString('<body>' + prev + '</body>', 'text/html');
                    const els = Array.from(doc.body.querySelectorAll('*'));
                    if (els[selectedElementIndex]) {
                        els[selectedElementIndex].insertAdjacentHTML('beforeend', snippet);
                    } else {
                        doc.body.insertAdjacentHTML('beforeend', '\n' + snippet);
                    }
                    return doc.body.innerHTML;
                });
            }
        } else {
            setHtmlCode(prev => prev + '\n' + snippet);
        }
    };

    // Drag handlers
    const handleDragStart = useCallback((e, snippet) => {
        e.dataTransfer.setData('text/plain', snippet);
        e.dataTransfer.effectAllowed = 'copy';
        setIsDragging(true);
        setDraggedSnippet(snippet);
    }, []);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
        setDraggedSnippet(null);
    }, []);

    const handleCanvasDragOver = useCallback((e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, []);

    const handleCanvasDrop = useCallback((e) => {
        e.preventDefault();
        const snippet = e.dataTransfer.getData('text/plain');
        if (snippet) {
            setHtmlCode(prev => prev + '\n' + snippet);
        }
        setIsDragging(false);
        setDraggedSnippet(null);
    }, []);

    const catColor = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.content;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'linear-gradient(135deg, #0c0f1a 0%, #131832 50%, #0f172a 100%)',
            zIndex: 9999, display: 'flex', flexDirection: 'column', color: '#f8fafc',
            fontFamily: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
        }}>
            {/* ─── TOP BAR ─── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px',
                padding: '0 20px',
                background: 'rgba(15,23,42,0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(99,102,241,0.15)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                        <X size={18} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 8px #818cf8' }} />
                        <span style={{ fontWeight: '700', fontSize: '15px', letterSpacing: '-0.01em' }}>Header Studio</span>
                    </div>
                </div>

                {/* Device Switcher */}
                <div style={{
                    display: 'flex', background: 'rgba(30,41,59,0.6)', padding: '3px', borderRadius: '10px',
                    border: '1px solid rgba(99,102,241,0.12)',
                }}>
                    {[
                        { mode: 'desktop', Icon: Monitor },
                        { mode: 'tablet', Icon: Tablet },
                        { mode: 'mobile', Icon: Smartphone },
                    ].map(({ mode, Icon }) => (
                        <button
                            key={mode}
                            style={{
                                padding: '6px 10px', borderRadius: '8px', border: 'none',
                                background: deviceMode === mode ? 'rgba(129,140,248,0.2)' : 'transparent',
                                color: deviceMode === mode ? '#a5b4fc' : '#64748b',
                                cursor: 'pointer', display: 'flex', transition: 'all 0.2s',
                            }}
                            onClick={() => setDeviceMode(mode)}
                        >
                            <Icon size={15} />
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        style={{
                            padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.2)',
                            background: 'transparent', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                            fontSize: '12px',
                        }}
                    >
                        <PanelLeft size={14} /> {showSidebar ? 'Hide' : 'Show'} Panel
                    </button>
                    <button
                        onClick={() => setActiveTab(activeTab === 'code' ? 'design' : 'code')}
                        style={{
                            padding: '6px 12px', borderRadius: '8px',
                            border: activeTab === 'code' ? '1px solid rgba(129,140,248,0.4)' : '1px solid rgba(148,163,184,0.2)',
                            background: activeTab === 'code' ? 'rgba(129,140,248,0.1)' : 'transparent',
                            color: activeTab === 'code' ? '#a5b4fc' : '#94a3b8',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px',
                        }}
                    >
                        <Code size={14} /> Code
                    </button>
                    <button
                        onClick={() => { if (window.confirm('Clear entire canvas?')) setHtmlCode(''); }}
                        style={{
                            padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)',
                            background: 'transparent', color: '#f87171', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px',
                        }}
                    >
                        <Trash2 size={14} /> Clear
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                // Build a complete, self-contained HTML document with CSS inlined
                                const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Header</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        /* Inlined custom styles (also available as styles.css) */
        ${cssCode}
    </style>
</head>
<body>
${htmlCode}
</body>
</html>`;
                                const blob = await websiteService.exportHeader(fullHtml, cssCode);
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'header.zip';
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                window.URL.revokeObjectURL(url);
                            } catch (err) {
                                console.error('Export failed:', err);
                                alert('Export failed: ' + err.message);
                            }
                        }}
                        style={{
                            padding: '6px 12px', borderRadius: '8px',
                            border: '1px solid rgba(52,211,153,0.3)',
                            background: 'transparent',
                            color: '#34d399', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px',
                        }}
                    >
                        <Download size={14} /> Export ZIP
                    </button>
                    <button
                        onClick={() => onSave(htmlCode, cssCode)}
                        style={{
                            padding: '7px 18px', borderRadius: '8px', border: 'none',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: 'white', fontWeight: '600', fontSize: '12px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                            boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Check size={14} /> Save & Publish
                    </button>
                </div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div style={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 56px)', overflow: 'hidden' }}>

                {/* ─── LEFT SIDEBAR ─── */}
                <AnimatePresence>
                    {activeTab === 'design' && showSidebar && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 300, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{
                                background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(20,27,46,0.98) 100%)',
                                backdropFilter: 'blur(16px)',
                                borderRight: '1px solid rgba(99,102,241,0.1)',
                                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            {/* Sidebar Tab Switcher */}
                            <div style={{
                                display: 'flex', borderBottom: '1px solid rgba(148,163,184,0.08)',
                            }}>
                                {[
                                    { key: 'components', label: 'Components', icon: Sparkles, accent: '#818cf8' },
                                    { key: 'structure', label: 'Structure', icon: ListTree, accent: '#fbbf24' },
                                ].map(tab => {
                                    const isActive = sidebarView === tab.key;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setSidebarView(tab.key)}
                                            style={{
                                                flex: 1, padding: '10px 0', border: 'none',
                                                background: 'transparent', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                fontSize: '11px', fontWeight: '600', color: isActive ? tab.accent : '#64748b',
                                                borderBottom: isActive ? `2px solid ${tab.accent}` : '2px solid transparent',
                                                transition: 'all 0.2s',
                                                letterSpacing: '0.02em',
                                            }}
                                        >
                                            <tab.icon size={13} /> {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ─── COMPONENTS VIEW ─── */}
                            {sidebarView === 'components' && (
                                <>
                                    {/* Search + Count */}
                                    <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            background: 'rgba(30,41,59,0.5)', borderRadius: '8px',
                                            padding: '0 10px', border: '1px solid rgba(148,163,184,0.1)',
                                        }}>
                                            <Search size={13} color="#64748b" />
                                            <input
                                                type="text"
                                                placeholder="Search components..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                style={{
                                                    background: 'transparent', border: 'none', outline: 'none',
                                                    color: '#e2e8f0', fontSize: '12px', padding: '8px 0', width: '100%',
                                                    caretColor: '#818cf8',
                                                }}
                                            />
                                            {searchQuery && (
                                                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px', display: 'flex' }}>
                                                    <X size={12} />
                                                </button>
                                            )}
                                            <span style={{ fontSize: '10px', color: '#64748b', flexShrink: 0 }}>{filteredWidgets.length}</span>
                                        </div>
                                    </div>

                                    {/* Category Pills */}
                                    <div style={{
                                        display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '10px 16px',
                                        borderBottom: '1px solid rgba(148,163,184,0.08)',
                                    }}>
                                        {CATEGORIES.map(cat => {
                                            const isActive = activeCat === cat.key;
                                            const color = CATEGORY_COLORS[cat.key]?.accent || '#818cf8';
                                            return (
                                                <button
                                                    key={cat.key}
                                                    onClick={() => setActiveCat(cat.key)}
                                                    style={{
                                                        padding: '5px 12px', borderRadius: '20px', border: 'none',
                                                        fontSize: '11px', fontWeight: '500', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', gap: '5px',
                                                        transition: 'all 0.2s',
                                                        background: isActive ? `${color}22` : 'rgba(30,41,59,0.4)',
                                                        color: isActive ? color : '#94a3b8',
                                                        outline: isActive ? `1px solid ${color}44` : '1px solid transparent',
                                                    }}
                                                >
                                                    <cat.icon size={11} /> {cat.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Widget Grid */}
                                    <div style={{
                                        flexGrow: 1, overflowY: 'auto', padding: '12px',
                                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px',
                                        alignContent: 'start',
                                    }}>
                                        <AnimatePresence mode="popLayout">
                                            {filteredWidgets.map((item, index) => {
                                                const colors = catColor(item.cat);
                                                const isHovered = hoveredWidget === item.id;
                                                const visualIcon = <WidgetVisualIcon widgetId={item.id} color={isHovered ? colors.accent : '#94a3b8'} />;
                                                return (
                                                    <motion.div
                                                        key={item.id}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        transition={{ duration: 0.15, delay: index * 0.02 }}
                                                        draggable="true"
                                                        onDragStart={(e) => handleDragStart(e, item.snippet)}
                                                        onDragEnd={handleDragEnd}
                                                        onClick={() => handleAddWidget(item.snippet)}
                                                        onMouseEnter={() => setHoveredWidget(item.id)}
                                                        onMouseLeave={() => setHoveredWidget(null)}
                                                        style={{
                                                            background: isHovered ? colors.bg : 'rgba(30,41,59,0.35)',
                                                            borderRadius: '10px', padding: '14px 8px',
                                                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                            cursor: 'grab',
                                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            border: isHovered ? `1px solid ${colors.accent}40` : '1px solid rgba(148,163,184,0.06)',
                                                            boxShadow: isHovered ? `0 4px 20px ${colors.glow}` : 'none',
                                                            transform: isHovered ? 'translateY(-2px)' : 'none',
                                                            position: 'relative',
                                                        }}
                                                    >
                                                        {isHovered && (
                                                            <div style={{
                                                                position: 'absolute', top: '6px', right: '6px',
                                                                width: '5px', height: '5px', borderRadius: '50%',
                                                                background: colors.accent, boxShadow: `0 0 6px ${colors.accent}`,
                                                            }} />
                                                        )}
                                                        {/* Visual SVG icon or fallback to lucide icon */}
                                                        {visualIcon || <item.icon size={18} color={isHovered ? colors.accent : '#94a3b8'} style={{ transition: 'color 0.2s' }} />}
                                                        <span style={{
                                                            fontSize: '10px', color: isHovered ? '#e2e8f0' : '#94a3b8',
                                                            textAlign: 'center', lineHeight: '1.3', fontWeight: '500',
                                                            transition: 'color 0.2s',
                                                        }}>
                                                            {item.label}
                                                        </span>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                        {filteredWidgets.length === 0 && (
                                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 16px', color: '#64748b', fontSize: '13px' }}>
                                                No components found
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* ─── STRUCTURE VIEW ─── */}
                            {sidebarView === 'structure' && (
                                <div style={{ flexGrow: 1, overflowY: 'auto', paddingTop: '0', paddingBottom: '16px' }}>
                                    {layerTree.length > 0 ? (
                                        <div>
                                            {/* Body root node */}
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '0',
                                                padding: '0', minHeight: '34px',
                                                fontSize: '12px', color: '#e2e8f0',
                                                borderBottom: '1px solid rgba(148,163,184,0.06)',
                                                background: 'rgba(129,140,248,0.06)',
                                            }}>
                                                {/* Eye */}
                                                <span style={{
                                                    width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'rgba(148,163,184,0.35)', fontSize: '11px',
                                                }}>👁</span>
                                                {/* Expand */}
                                                <span style={{ width: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '8px' }}>▾</span>
                                                {/* Label */}
                                                <span style={{ flex: 1, paddingLeft: '4px', fontWeight: '600' }}>Body</span>
                                                {/* Count */}
                                                <span style={{ fontSize: '10px', color: '#64748b', padding: '0 6px', minWidth: '16px', textAlign: 'center' }}>
                                                    {layerTree.length}
                                                </span>
                                                {/* Handle */}
                                                <span style={{ width: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(148,163,184,0.2)', fontSize: '11px' }}>✥</span>
                                            </div>
                                            {layerTree.map((node, i) => (
                                                <LayerTreeNode
                                                    key={node.id || i}
                                                    node={node}
                                                    depth={1}
                                                    hoveredLayer={hoveredLayer}
                                                    setHoveredLayer={setHoveredLayer}
                                                    selectedLayer={selectedLayer}
                                                    onSelectLayer={handleSelectLayer}
                                                    topIndex={i}
                                                    totalSiblings={layerTree.length}
                                                    onMoveNode={handleMoveNode}
                                                    onDeleteNode={handleDeleteNode}
                                                    onDuplicateNode={handleDuplicateNode}
                                                    onToggleVisibility={handleToggleVisibility}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b', fontSize: '12px' }}>
                                            <ListTree size={24} color="#334155" style={{ marginBottom: '8px' }} />
                                            <p>No elements yet</p>
                                            <p style={{ fontSize: '11px', color: '#475569' }}>Add components to see the structure</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Sidebar Footer Gradient */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px',
                                background: 'linear-gradient(transparent, rgba(15,23,42,0.95))',
                                pointerEvents: 'none',
                            }} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── CENTER: PREVIEW or CODE ─── */}
                <div style={{
                    flexGrow: 1, position: 'relative',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                }}>
                    {activeTab === 'design' ? (
                        <div
                            onDragOver={handleCanvasDragOver}
                            onDrop={handleCanvasDrop}
                            style={{
                                width: '100%', height: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.04), transparent 70%)',
                                backgroundImage: 'radial-gradient(rgba(99,102,241,0.08) 1px, transparent 1px)',
                                backgroundSize: '24px 24px',
                                padding: '32px',
                                position: 'relative',
                            }}
                        >
                            {/* Drop indicator overlay */}
                            {isDragging && (
                                <div style={{
                                    position: 'absolute', inset: '12px', borderRadius: '12px',
                                    border: '2px dashed #818cf8', background: 'rgba(99,102,241,0.06)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    zIndex: 10, pointerEvents: 'none',
                                }}>
                                    <div style={{
                                        background: 'rgba(15,23,42,0.85)', padding: '10px 24px', borderRadius: '8px',
                                        color: '#a5b4fc', fontSize: '13px', fontWeight: '600',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                                    }}>
                                        <Plus size={16} /> Drop component here
                                    </div>
                                </div>
                            )}
                            <motion.div
                                layout
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                style={{
                                    width: deviceMode === 'mobile' ? '375px' : deviceMode === 'tablet' ? '768px' : '100%',
                                    height: deviceMode === 'mobile' ? '667px' : deviceMode === 'tablet' ? '1024px' : '100%',
                                    maxWidth: '100%', maxHeight: '100%',
                                    backgroundColor: 'white',
                                    borderRadius: deviceMode === 'desktop' ? '8px' : '16px',
                                    overflow: 'hidden',
                                    boxShadow: isDragging
                                        ? '0 0 0 2px rgba(129,140,248,0.4), 0 25px 60px rgba(0,0,0,0.5)'
                                        : '0 0 0 1px rgba(99,102,241,0.1), 0 25px 60px rgba(0,0,0,0.5)',
                                    transition: 'box-shadow 0.3s',
                                }}
                            >
                                <iframe
                                    ref={iframeRef}
                                    title="Header Preview"
                                    srcDoc={previewContent}
                                    style={{ width: '100%', height: '100%', border: 'none', pointerEvents: isDragging ? 'none' : 'auto' }}
                                    sandbox="allow-scripts"
                                />
                            </motion.div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', height: '100%' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(99,102,241,0.1)' }}>
                                <div style={{
                                    padding: '8px 16px', color: '#94a3b8', fontSize: '11px', fontWeight: '600',
                                    letterSpacing: '0.05em', textTransform: 'uppercase',
                                    background: 'rgba(15,23,42,0.6)', borderBottom: '1px solid rgba(99,102,241,0.08)',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                }}>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#f472b6' }} />
                                    HTML
                                </div>
                                <CodeEditorArea code={htmlCode} setCode={setHtmlCode} language="html" />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    padding: '8px 16px', color: '#94a3b8', fontSize: '11px', fontWeight: '600',
                                    letterSpacing: '0.05em', textTransform: 'uppercase',
                                    background: 'rgba(15,23,42,0.6)', borderBottom: '1px solid rgba(99,102,241,0.08)',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                }}>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38bdf8' }} />
                                    CSS
                                </div>
                                <CodeEditorArea code={cssCode} setCode={setCssCode} language="css" />
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── RIGHT: STYLE PROPERTIES PANEL ─── */}
                <AnimatePresence>
                    {selectedStyles && selectedElementIndex >= 0 && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 260, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                height: '100%', overflow: 'hidden',
                                background: 'rgba(15,23,42,0.95)',
                                borderLeft: '1px solid rgba(99,102,241,0.12)',
                                display: 'flex', flexDirection: 'column',
                                position: 'relative',
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                padding: '10px 14px', fontSize: '11px', fontWeight: '700',
                                color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase',
                                borderBottom: '1px solid rgba(99,102,241,0.1)',
                                background: 'rgba(15,23,42,0.6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Sliders size={12} />
                                    Properties
                                </div>
                                <button
                                    onClick={handleCloseStylePanel}
                                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px', display: 'flex' }}
                                >
                                    <X size={12} />
                                </button>
                            </div>

                            {/* Style Panel Content */}
                            <StylePanel
                                styles={selectedStyles}
                                onStyleChange={handleStyleChange}
                                elementName={selectedElementName}
                            />

                            {/* Bottom gradient */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px',
                                background: 'linear-gradient(transparent, rgba(15,23,42,0.95))',
                                pointerEvents: 'none',
                            }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
};

// ─── Code Editor Area ───
const CodeEditorArea = ({ code, setCode, language }) => (
    <textarea
        style={{
            flexGrow: 1, padding: '16px', fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '13px',
            border: 'none', outline: 'none', resize: 'none',
            backgroundColor: '#080c1a', lineHeight: '1.7', tabSize: 2,
            color: '#e2e8f0', caretColor: '#818cf8',
        }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
    />
);

export default HeaderStudio;
