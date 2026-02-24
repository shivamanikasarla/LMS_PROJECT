import React, { useState, useEffect, useRef } from 'react';
import {
    Monitor, Tablet, Smartphone, Undo, Redo, Code, Eye,
    ChevronLeft, Plus, Settings, X, Trash2, Check, Send,
    RotateCcw, MousePointer, Image as ImageIcon, Type, Box,
    Layers, ChevronRight, GripVertical, Settings2, Globe,
    Video, List, FormInput, BookOpen, MessageSquare, Users,
    ShoppingBag, CheckSquare, Zap, DollarSign, Trophy, Quote,
    Award, Clock, Phone, Info, Search, Layout, Star, Brain,
    Handshake, HelpCircle, FileWarning, Bold, Italic, Underline,
    AlignLeft, AlignCenter, AlignRight, Type as TextIcon, Palette, Link as LinkIcon,
    MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const PageBuilder = ({ isOpen, onClose, page, onSave }) => {
    const [activeDevice, setActiveDevice] = useState('desktop'); // desktop, tablet, mobile
    const [htmlCode, setHtmlCode] = useState(page?.html || `
        <header class="gy-header">
            <div class="gy-header-container">
                <div class="gy-logo-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <div class="gy-search-wrapper">
                    <input type="text" placeholder="Search" class="gy-search-input" />
                    <svg class="gy-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <nav class="gy-nav">
                    <a href="#">Courses</a>
                    <a href="#">Blog</a>
                    <a href="#">About</a>
                    <div class="gy-cart">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 0 0 1-8 0"></path></svg>
                    </div>
                </nav>
                <button class="gy-login-btn">Login</button>
            </div>
        </header>

        <section class="gp-hero">
            <h1>Welcome to Gyantrix Academy</h1>
            <p>Start building your amazing educational platform.</p>
        </section>

        <footer class="gy-footer">
            <div class="gy-footer-container">
                <div class="gy-footer-cta">
                    <button class="gy-footer-btn">
                        <span class="gy-footer-g">G</span> Launch your Graphy
                    </button>
                    <p class="gy-footer-trust">100K+ creators trust Graphy to teach online</p>
                </div>
                <div class="gy-footer-socials">
                    <a href="#" class="gy-social-icon">f</a>
                    <a href="#" class="gy-social-icon">ig</a>
                    <a href="#" class="gy-social-icon">𝕏</a>
                    <a href="#" class="gy-social-icon">in</a>
                    <a href="#" class="gy-social-icon">yt</a>
                    <a href="#" class="gy-social-icon">sp</a>
                </div>
                <div class="gy-footer-bottom">
                    <div class="gy-copyright">gyantrixacademy © 2026</div>
                    <div class="gy-footer-links">
                        <a href="#">Privacy policy</a>
                        <a href="#">Terms of use</a>
                        <a href="#">Contact us</a>
                        <a href="#">Refund policy</a>
                    </div>
                </div>
            </div>
        </footer>
    `);
    const [cssCode, setCssCode] = useState(page?.css || `
        .gy-header { background: #fff; border-bottom: 1px solid #eee; padding: 12px 24px; font-family: 'Inter', sans-serif; position: sticky; top: 0; z-index: 1000; }
        .gy-header-container { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; gap: 32px; }
        .gy-logo-box { background: #000; color: #fff; width: 40px; height: 40px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .gy-logo-box svg { width: 20px; height: 20px; fill: #fff; }
        .gy-search-wrapper { flex: 1; max-width: 320px; position: relative; margin-left: auto; }
        .gy-search-input { width: 100%; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 20px; padding: 8px 16px 8px 40px; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .gy-search-input:focus { border-color: #76c3a7; }
        .gy-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #9ca3af; }
        .gy-nav { display: flex; align-items: center; gap: 24px; }
        .gy-nav a { text-decoration: none; color: #4b5563; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .gy-nav a:hover { color: #111827; }
        .gy-cart { color: #4b5563; cursor: pointer; }
        .gy-cart svg { width: 20px; height: 20px; }
        .gy-login-btn { background: #76c3a7; color: #fff; border: none; padding: 10px 28px; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s; }
        .gy-login-btn:hover { background: #65b396; }

        .gp-hero { padding: 100px 20px; text-align: center; background: #fff; font-family: 'Inter', sans-serif; }
        .gp-hero h1 { font-size: 48px; font-weight: 800; color: #1e293b; margin-bottom: 20px; }
        .gp-hero p { color: #64748b; font-size: 18px; }

        .gy-footer { background: #fff; padding: 60px 24px 40px; border-top: 1px solid #eee; font-family: 'Inter', sans-serif; text-align: center; }
        .gy-footer-container { max-width: 1200px; margin: 0 auto; }
        .gy-footer-btn { background: #000; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .gy-footer-g { background: #fff; color: #000; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .gy-footer-trust { color: #6b7280; font-size: 12px; margin-bottom: 40px; }
        .gy-footer-socials { display: flex; justify-content: center; gap: 20px; margin-bottom: 40px; }
        .gy-social-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #4b5563; font-weight: 700; font-size: 14px; text-decoration: none; transition: color 0.2s; }
        .gy-social-icon:hover { color: #000; }
        .gy-footer-bottom { padding-top: 30px; border-top: 1px solid #f3f4f6; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .gy-copyright { font-size: 13px; color: #6b7280; }
        .gy-footer-links { display: flex; gap: 24px; }
        .gy-footer-links a { text-decoration: none; color: #4b5563; font-size: 13px; transition: color 0.2s; }
        .gy-footer-links a:hover { color: #000; }
    `);
    const [isCodeView, setIsCodeView] = useState(false);
    const [isVisualPreview, setIsVisualPreview] = useState(false);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTemplateCategory, setActiveTemplateCategory] = useState(null);
    const [addedSections, setAddedSections] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null); // { tagName, rect, text, styles }

    const templates = {
        header: [
            {
                id: 'gh1', title: 'Official Graphy Header',
                html: `
                    <header class="gy-header">
                        <div class="gy-header-container">
                            <div class="gy-logo-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                            </div>
                            <div class="gy-search-wrapper">
                                <input type="text" placeholder="Search" class="gy-search-input" />
                                <svg class="gy-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            <nav class="gy-nav">
                                <a href="#">Courses</a>
                                <a href="#">Blog</a>
                                <a href="#">About</a>
                                <div class="gy-cart">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 0 0 1-8 0"></path></svg>
                                </div>
                            </nav>
                            <button class="gy-login-btn">Login</button>
                        </div>
                    </header>
                `,
                css: `
                    .gy-header { background: #fff; border-bottom: 1px solid #eee; padding: 12px 24px; font-family: 'Inter', sans-serif; position: sticky; top: 0; z-index: 1000; }
                    .gy-header-container { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; gap: 32px; }
                    .gy-logo-box { background: #000; color: #fff; width: 40px; height: 40px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                    .gy-logo-box svg { width: 20px; height: 20px; fill: #fff; }
                    .gy-search-wrapper { flex: 1; max-width: 320px; position: relative; margin-left: auto; }
                    .gy-search-input { width: 100%; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 20px; padding: 8px 16px 8px 40px; font-size: 14px; outline: none; transition: border-color 0.2s; }
                    .gy-search-input:focus { border-color: #76c3a7; }
                    .gy-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #9ca3af; }
                    .gy-nav { display: flex; align-items: center; gap: 24px; }
                    .gy-nav a { text-decoration: none; color: #4b5563; font-size: 14px; font-weight: 500; transition: color 0.2s; }
                    .gy-nav a:hover { color: #111827; }
                    .gy-cart { color: #4b5563; cursor: pointer; }
                    .gy-cart svg { width: 20px; height: 20px; }
                    .gy-login-btn { background: #76c3a7; color: #fff; border: none; padding: 10px 28px; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s; }
                    .gy-login-btn:hover { background: #65b396; }
                `,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'h1', title: 'Design & Build',
                html: `<section class="hf-hero"> <div class="hf-container"> <div class="hf-content"> <span class="hf-badge">DESIGN & BUILD</span> <h1 class="hf-title">We design & build awesome products that make a difference.</h1> <p class="hf-subtitle">WITH LESS STUFF, MORE MEANING</p> <button class="hf-btn-primary">CONTACT US</button> </div> <div class="hf-image-wrapper"> <div class="hf-image-main"> <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&q=80" /> </div> <div class="hf-image-overlay"> <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80" /> <div class="hf-overlay-content"> <h3>FIND YOUR STYLE</h3> <button>VIEW GALLERY</button> </div> </div> </div> </div> </section>`,
                css: `.hf-hero { padding: 120px 5%; background: #fff; overflow: visible; font-family: 'Inter', sans-serif; } .hf-container { display: flex; align-items: center; gap: 60px; max-width: 1400px; margin: 0 auto; } .hf-content { flex: 1.2; z-index: 2; } .hf-badge { color: #1e293b; font-weight: 700; font-size: 14px; margin-bottom: 24px; display: block; opacity: 0.8; } .hf-title { font-size: 64px; line-height: 1.1; font-weight: 800; color: #000; margin: 0 0 40px; letter-spacing: -2px; } .hf-subtitle { color: #64748b; font-size: 14px; letter-spacing: 4px; font-weight: 600; margin-bottom: 50px; text-transform: uppercase; } .hf-btn-primary { border: 2px solid #1e293b; background: none; padding: 18px 45px; border-radius: 40px; font-weight: 800; font-size: 14px; cursor: pointer; color: #1e293b; } .hf-image-wrapper { flex: 1; position: relative; display: flex; align-items: flex-end; } .hf-image-main { width: 90%; border-radius: 12px; overflow: hidden; transform: translateX(-40px); } .hf-image-main img { width: 100%; display: block; filter: grayscale(1); opacity: 0.9; } .hf-image-overlay { position: absolute; right: -60px; bottom: -40px; width: 65%; border-radius: 12px; overflow: hidden; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.25); z-index: 3; aspect-ratio: 0.8; } .hf-image-overlay img { width: 100%; height: 100%; object-fit: cover; } .hf-overlay-content { position: absolute; inset: 0; background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; } .hf-overlay-title { font-size: 28px; color: #000; margin: 0 0 20px; font-weight: 500; letter-spacing: 2px; }`,
                preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&h=200&fit=crop'
            },
            {
                id: 'h2', title: 'Less Stuff',
                html: `<section class="ls-hero"> <div class="ls-container"> <div class="ls-text"> <h1 class="ls-title">With Less Stuff And More Compassion.</h1> <p class="ls-subtitle">CORE VALUES THAT DRIVE US</p> <button class="ls-btn">Learn More</button> </div> <div class="ls-mockup"> <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000" /> </div> </div> </section>`,
                css: `.ls-hero { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ls-container { display: flex; align-items: center; gap: 80px; max-width: 1200px; margin: 0 auto; } .ls-text { flex: 1; } .ls-text .ls-title { font-size: 48px; font-weight: 800; line-height: 1.2; margin-bottom: 30px; color: #1e293b; } .ls-text .ls-subtitle { font-size: 14px; letter-spacing: 3px; color: #64748b; font-weight: 600; margin-bottom: 40px; text-transform: uppercase; } .ls-text .ls-btn { background: #1e293b; color: #fff; padding: 15px 35px; border-radius: 30px; border: none; font-weight: 700; font-size: 14px; cursor: pointer; } .ls-mockup { flex: 1.5; } .ls-mockup img { width: 100%; border-radius: 12px; box-shadow: 0 30px 60px rgba(0,0,0,0.1); }`,
                preview: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=300&h=200&fit=crop'
            },
            {
                id: 'h3', title: 'Summer Trends',
                html: `<section class="st-section"> <div class="st-grid"> <div class="st-text"> <span class="st-badge">THE SEASON</span> <h1 class="st-title">NEW SUMMER TRENDS.</h1> <p class="st-subtitle">DISCOVER THE LATEST IN DESIGN</p> <button class="st-btn">VIEW ALL</button> </div> <div class="st-img"> <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800" /> </div> </div> </section>`,
                css: `.st-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .st-grid { display: flex; align-items: center; gap: 40px; max-width: 1000px; margin: 0 auto; } .st-text { flex: 1; } .st-text .st-badge { font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 10px; } .st-text .st-title { font-size: 40px; margin: 20px 0; font-weight: 800; color: #1e293b; } .st-text .st-subtitle { font-size: 16px; color: #64748b; margin-bottom: 30px; } .st-text .st-btn { background: #1e293b; color: #fff; padding: 12px 25px; border-radius: 5px; border: none; font-weight: 600; cursor: pointer; } .st-img { flex: 0.8; height: 500px; border-radius: 10px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); } .st-img img { width: 100%; height: 100%; object-fit: cover; }`,
                preview: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=200&fit=crop'
            },
            {
                id: 'h4', title: 'Everything You Need',
                html: `<section class="ey-section"> <div class="ey-container"> <div class="ey-graphic"> <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800" /> </div> <div class="ey-text"> <h1 class="ey-title">Everything you need to create beautiful pages and share your stories.</h1> <button class="ey-btn">Get Started</button> </div> </div> </section>`,
                css: `.ey-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ey-container { display: flex; align-items: center; gap: 60px; max-width: 1200px; margin: 0 auto; } .ey-text { flex: 1; } .ey-text .ey-title { font-size: 32px; font-weight: 700; line-height: 1.4; color: #1e293b; margin-bottom: 40px; } .ey-text .ey-btn { background: #4f46e5; color: #fff; padding: 15px 30px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; } .ey-graphic { flex: 1.2; } .ey-graphic img { width: 100%; border-radius: 12px; transform: skewY(-5deg); box-shadow: 0 40px 80px rgba(0,0,0,0.1); }`,
                preview: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&h=200&fit=crop'
            },
            {
                id: 'h5', title: 'No More Complex',
                html: `<section class="complex-section"> <span class="complex-badge">CORE VALUE</span> <h1 class="complex-title">No more complex things.</h1> <div class="complex-cards"> <div class="c-card" style="background: #fbbf24"></div> <div class="c-card" style="background: #f97316"></div> <div class="c-card" style="background: #ef4444"></div> <div class="c-card" style="background: #60a5fa"></div> <div class="c-card" style="background: #10b981"></div> </div> </section>`,
                css: `.complex-section { padding: 100px 5%; text-align: center; background: #fff; font-family: 'Inter', sans-serif; } .complex-section .complex-badge { font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 10px; } .complex-section .complex-title { font-size: 56px; font-weight: 800; margin-bottom: 60px; color: #1e293b; } .complex-cards { display: flex; justify-content: center; gap: -30px; } .c-card { width: 180px; height: 260px; border-radius: 15px; border: 4px solid #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.1); transform: rotate(-5deg); transition: transform 0.3s; } .c-card:hover { transform: translateY(-20px) rotate(0deg); z-index: 10; }`,
                preview: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=300&h=200&fit=crop'
            },
            {
                id: 'h6', title: 'Old Style',
                html: `<section class="old-style"> <div class="old-container"> <div class="old-left"> <p class="old-text">A style that never gets old.</p> <button class="old-btn">Discover</button> </div> <div class="old-right"> <img src="https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=1000" /> </div> </div> </section>`,
                css: `.old-style { padding: 80px 5%; background: #f1f5f9; font-family: 'Inter', sans-serif; } .old-container { display: flex; align-items: center; max-width: 1200px; margin: 0 auto; background: #fff; padding: 60px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); } .old-left { flex: 1; } .old-left .old-text { font-size: 40px; font-weight: 400; margin-bottom: 30px; color: #1e293b; line-height: 1.3; } .old-left .old-btn { background: #1e293b; color: #fff; padding: 15px 30px; border-radius: 30px; border: none; font-weight: 700; cursor: pointer; } .old-right { flex: 1.5; } .old-right img { width: 100%; border-radius: 10px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }`,
                preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop'
            },
            {
                id: 'h7', title: 'Bold Better',
                html: `<section class="bold-hero"> <div class="bold-container"> <h1 class="bold-text">BOLD. BETTER.</h1> <div class="bold-grid"> <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" /> <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30" /> <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" /> </div> </div> </section>`,
                css: `.bold-hero { background: #f97316; padding: 120px 5%; color: #fff; overflow: hidden; position: relative; font-family: 'Inter', sans-serif; } .bold-container { max-width: 1200px; margin: 0 auto; } .bold-text { font-size: 160px; font-weight: 900; line-height: 0.8; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.2; width: 100%; text-align: center; color: #fff; } .bold-grid { display: flex; justify-content: center; gap: 40px; position: relative; z-index: 2; } .bold-grid img { width: 280px; height: 400px; object-fit: cover; border-radius: 20px; box-shadow: 0 40px 80px rgba(0,0,0,0.3); transform: rotate(-5deg); } .bold-grid img:nth-child(2) { transform: rotate(5deg); margin-top: 60px; } .bold-grid img:nth-child(3) { transform: rotate(-2deg); margin-top: -20px; }`,
                preview: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop'
            },
            {
                id: 'h8', title: 'Take a Break',
                html: `<section class="break-section"> <div class="break-img"> <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" /> <div class="break-overlay"> <h1 class="break-title">Take A Break</h1> <button class="break-btn">Explore</button> </div> </div> </section>`,
                css: `.break-section { padding: 40px; font-family: 'Inter', sans-serif; } .break-img { position: relative; height: 600px; border-radius: 20px; overflow: hidden; } .break-img img { width: 100%; height: 100%; object-fit: cover; } .break-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; background: rgba(0,0,0,0.1); } .break-overlay .break-title { font-size: 72px; font-weight: 800; margin-bottom: 24px; text-shadow: 0 10px 20px rgba(0,0,0,0.2); } .break-overlay .break-btn { border: 2px solid #fff; background: none; color: #fff; padding: 15px 40px; border-radius: 40px; font-weight: 700; cursor: pointer; font-size: 16px; }`,
                preview: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=300&h=200&fit=crop'
            },
            {
                id: 'h9', title: 'Modern Home Decor',
                html: `<section class="decor-section"> <div class="decor-card"> <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7" /> <div class="decor-info"> <h2 class="decor-title">MODERN HOME DECOR</h2> <p class="decor-subtitle">Elegance in every corner.</p> <button class="decor-btn">VIEW PRODUCTS</button> </div> </div> </section>`,
                css: `.decor-section { padding: 120px 5%; background: #0c0a09; font-family: 'Inter', sans-serif; } .decor-card { max-width: 1200px; margin: 0 auto; position: relative; } .decor-card img { width: 100%; height: 600px; object-fit: cover; border-radius: 4px; opacity: 0.8; } .decor-info { background: #0c0a09; color: #fff; padding: 60px; position: absolute; bottom: -60px; left: 80px; border: 1px solid #292524; width: 450px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); } .decor-info .decor-title { font-size: 32px; margin-bottom: 20px; font-weight: 700; } .decor-info .decor-subtitle { font-size: 16px; color: #a1a1aa; margin-bottom: 30px; } .decor-info .decor-btn { background: #fff; color: #000; border: none; padding: 12px 30px; font-weight: 700; font-size: 12px; margin-top: 30px; cursor: pointer; border-radius: 4px; }`,
                preview: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=200&fit=crop'
            },
            {
                id: 'h10', title: 'Photo Studio',
                html: `<section class="studio-section"> <div class="studio-grid"> <div class="studio-text"> <h3 class="studio-title">Mark's Photo Studio</h3> <p class="studio-subtitle">CAPTURING EMOTIONS THROUGH THE LENS</p> <button class="studio-btn">Book Session</button> </div> <div class="studio-img"> <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" /> </div> </div> </section>`,
                css: `.studio-section { padding: 120px 10%; background: #fff; font-family: 'Inter', sans-serif; } .studio-grid { display: grid; grid-template-columns: 1fr 1.5fr; align-items: center; gap: 80px; max-width: 1400px; margin: 0 auto; } .studio-text .studio-title { font-family: 'Playfair Display', serif; font-size: 56px; margin: 0 0 20px; color: #1e293b; line-height: 1.1; } .studio-text .studio-subtitle { letter-spacing: 4px; font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 40px; text-transform: uppercase; } .studio-text .studio-btn { background: #1e293b; color: #fff; padding: 15px 30px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; } .studio-img img { width: 100%; border-radius: 12px; filter: grayscale(1); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }`,
                preview: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=200&fit=crop'
            },
            {
                id: 'h11', title: 'Experiences',
                html: `<section class="stool-section"> <div class="stool-container"> <div class="stool-img"> <img src="https://images.unsplash.com/photo-1503602642458-232111445657" /> </div> <div class="stool-text"> <h1 class="stool-title">We not only design things. We design experiences.</h1> <p class="stool-subtitle">CRAFTING QUALITY SINCE 1995</p> </div> </div> </section>`,
                css: `.stool-section { padding: 120px 5%; background: #fafafa; font-family: 'Inter', sans-serif; } .stool-container { display: flex; align-items: center; gap: 100px; max-width: 1100px; margin: 0 auto; } .stool-img { flex: 1; } .stool-img img { width: 100%; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); } .stool-text { flex: 1; } .stool-text .stool-title { font-size: 40px; line-height: 1.3; font-weight: 300; color: #1e293b; margin-bottom: 30px; } .stool-text .stool-subtitle { font-size: 14px; letter-spacing: 3px; color: #64748b; font-weight: 600; text-transform: uppercase; }`,
                preview: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&h=200&fit=crop'
            },
            {
                id: 'h12', title: 'Minimalist Spaces',
                html: `<section class="min-section"> <div class="min-container"> <h1 class="min-title">WE LOVE DESIGNING MINIMALIST SPACES</h1> <p class="min-subtitle">Pure, simple, and functional design solutions for your modern lifestyle.</p> <div class="min-line"></div> </div> </section>`,
                css: `.min-section { background: #fff; padding: 140px 5%; text-align: center; font-family: 'Inter', sans-serif; } .min-container { max-width: 900px; margin: 0 auto; } .min-section .min-title { font-size: 14px; letter-spacing: 6px; color: #94a3b8; font-weight: 700; margin-bottom: 40px; text-transform: uppercase; } .min-section .min-subtitle { font-size: 48px; color: #1e293b; font-weight: 200; line-height: 1.3; margin-bottom: 60px; } .min-line { width: 1px; height: 120px; background: #e2e8f0; margin: 0 auto; }`,
                preview: 'https://images.unsplash.com/photo-1549497538-301228c965dd?w=300&h=200&fit=crop'
            }
        ],
        footer: [
            {
                id: 'gf1', title: 'Official Graphy Footer',
                html: `
                    <footer class="gy-footer">
                        <div class="gy-footer-container">
                            <div class="gy-footer-cta">
                                <button class="gy-footer-btn">
                                    <span class="gy-footer-g">G</span> Launch your Graphy
                                </button>
                                <p class="gy-footer-trust">100K+ creators trust Graphy to teach online</p>
                            </div>
                            <div class="gy-footer-socials">
                                <a href="#" class="gy-social-icon">f</a>
                                <a href="#" class="gy-social-icon">ig</a>
                                <a href="#" class="gy-social-icon">𝕏</a>
                                <a href="#" class="gy-social-icon">in</a>
                                <a href="#" class="gy-social-icon">yt</a>
                                <a href="#" class="gy-social-icon">sp</a>
                            </div>
                            <div class="gy-footer-bottom">
                                <div class="gy-copyright">gyantrixacademy © 2026</div>
                                <div class="gy-footer-links">
                                    <a href="#">Privacy policy</a>
                                    <a href="#">Terms of use</a>
                                    <a href="#">Contact us</a>
                                    <a href="#">Refund policy</a>
                                </div>
                            </div>
                        </div>
                    </footer>
                `,
                css: `
                    .gy-footer { background: #fff; padding: 60px 24px 40px; border-top: 1px solid #eee; font-family: 'Inter', sans-serif; text-align: center; }
                    .gy-footer-container { max-width: 1200px; margin: 0 auto; }
                    .gy-footer-btn { background: #000; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; margin-bottom: 20px; }
                    .gy-footer-g { background: #fff; color: #000; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
                    .gy-footer-trust { color: #6b7280; font-size: 12px; margin-bottom: 40px; }
                    .gy-footer-socials { display: flex; justify-content: center; gap: 20px; margin-bottom: 40px; }
                    .gy-social-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #4b5563; font-weight: 700; font-size: 14px; text-decoration: none; transition: color 0.2s; }
                    .gy-social-icon:hover { color: #000; }
                    .gy-footer-bottom { padding-top: 30px; border-top: 1px solid #f3f4f6; display: flex; flex-direction: column; align-items: center; gap: 16px; }
                    .gy-copyright { font-size: 13px; color: #6b7280; }
                    .gy-footer-links { display: flex; gap: 24px; }
                    .gy-footer-links a { text-decoration: none; color: #4b5563; font-size: 13px; transition: color 0.2s; }
                    .gy-footer-links a:hover { color: #000; }
                `,
                preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&h=200&fit=crop'
            },
            {
                id: 'gf2', title: 'Centered Company Footer',
                html: `<footer class="f2-footer"><div class="f2-container"><h2 class="f2-name">COMPANY <span>NAME</span></h2><p class="f2-address">12345 Street Name, City. State 12345</p><p class="f2-phone">P: (123) 456 7890 / 456 7891</p><div class="f2-socials"><a href="#" class="f2-social">𝕏</a><a href="#" class="f2-social">f</a><a href="#" class="f2-social">g+</a><a href="#" class="f2-social">✉</a></div><p class="f2-copyright">© Copyright 2026 Company Name</p></div></footer>`,
                css: `.f2-footer { padding: 60px 24px 40px; background: #fff; font-family: 'Inter', sans-serif; text-align: center; border-top: 1px solid #eee; } .f2-container { max-width: 600px; margin: 0 auto; } .f2-name { font-size: 32px; font-weight: 300; color: #333; letter-spacing: 6px; margin: 0 0 24px; } .f2-name span { color: #f59e0b; } .f2-address { font-size: 15px; color: #555; margin: 0 0 6px; } .f2-phone { font-size: 15px; color: #555; margin: 0 0 30px; } .f2-socials { display: flex; justify-content: center; gap: 20px; margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #eee; } .f2-social { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: #555; font-size: 16px; text-decoration: none; transition: color 0.2s; } .f2-social:hover { color: #000; } .f2-copyright { font-size: 13px; color: #999; }`,
                preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&h=200&fit=crop'
            },
            {
                id: 'gf3', title: 'Multi-Column Footer',
                html: `<footer class="f3-footer"><div class="f3-container"><div class="f3-col"><h3 class="f3-brand">YourBrand</h3><p class="f3-about">We create amazing digital experiences for educators and students worldwide.</p><div class="f3-socials"><a href="#">𝕏</a><a href="#">f</a><a href="#">in</a><a href="#">ig</a></div></div><div class="f3-col"><h4>Quick Links</h4><a href="#">Home</a><a href="#">About</a><a href="#">Courses</a><a href="#">Blog</a></div><div class="f3-col"><h4>Support</h4><a href="#">Help Center</a><a href="#">Contact Us</a><a href="#">FAQs</a><a href="#">Community</a></div><div class="f3-col"><h4>Contact</h4><p>hello@yourbrand.com</p><p>(123) 456-7890</p><p>123 Business Ave, City</p></div></div><div class="f3-bottom"><p>© 2026 YourBrand. All rights reserved.</p><div class="f3-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Refund Policy</a></div></div></footer>`,
                css: `.f3-footer { padding: 80px 5% 30px; background: #1e293b; font-family: 'Inter', sans-serif; color: #94a3b8; } .f3-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 50px; margin-bottom: 50px; } .f3-brand { font-size: 24px; font-weight: 800; color: #fff; margin: 0 0 14px; } .f3-about { font-size: 14px; line-height: 1.7; margin: 0 0 20px; } .f3-socials { display: flex; gap: 14px; } .f3-socials a { color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; } .f3-socials a:hover { color: #fff; } .f3-col h4 { font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 18px; } .f3-col a { display: block; font-size: 14px; color: #94a3b8; text-decoration: none; margin-bottom: 10px; transition: color 0.2s; } .f3-col a:hover { color: #fff; } .f3-col p { font-size: 14px; margin: 0 0 8px; } .f3-bottom { max-width: 1200px; margin: 0 auto; padding-top: 30px; border-top: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; } .f3-bottom p { font-size: 13px; margin: 0; } .f3-links { display: flex; gap: 20px; } .f3-links a { font-size: 13px; color: #94a3b8; text-decoration: none; } .f3-links a:hover { color: #fff; }`,
                preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop'
            },
            {
                id: 'gf4', title: 'Gradient Footer',
                html: `<footer class="f4-footer"><div class="f4-container"><div class="f4-top"><h3 class="f4-brand">YourBrand</h3><div class="f4-nav"><a href="#">Home</a><a href="#">About</a><a href="#">Courses</a><a href="#">Blog</a><a href="#">Contact</a></div></div><div class="f4-middle"><p class="f4-desc">Empowering learners everywhere with world-class online education. Join our community and start your learning journey today.</p><div class="f4-socials"><a href="#" class="f4-sc">𝕏</a><a href="#" class="f4-sc">f</a><a href="#" class="f4-sc">ig</a><a href="#" class="f4-sc">in</a><a href="#" class="f4-sc">yt</a></div></div><div class="f4-bottom"><p>© 2026 YourBrand. All rights reserved.</p></div></div></footer>`,
                css: `.f4-footer { padding: 60px 5% 30px; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); font-family: 'Inter', sans-serif; color: #94a3b8; } .f4-container { max-width: 900px; margin: 0 auto; text-align: center; } .f4-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); } .f4-brand { font-size: 22px; font-weight: 800; color: #fff; margin: 0; } .f4-nav { display: flex; gap: 28px; } .f4-nav a { font-size: 14px; color: #94a3b8; text-decoration: none; transition: color 0.2s; } .f4-nav a:hover { color: #fff; } .f4-middle { margin-bottom: 40px; } .f4-desc { font-size: 15px; line-height: 1.7; max-width: 500px; margin: 0 auto 24px; } .f4-socials { display: flex; justify-content: center; gap: 16px; } .f4-sc { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; } .f4-sc:hover { background: rgba(255,255,255,0.1); color: #fff; } .f4-bottom p { font-size: 13px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop'
            },
            {
                id: 'gf5', title: 'Minimal Footer',
                html: `<footer class="f5-footer"><div class="f5-container"><div class="f5-left"><span class="f5-brand">YourBrand</span><span class="f5-copy">© 2026</span></div><div class="f5-links"><a href="#">About</a><a href="#">Blog</a><a href="#">Courses</a><a href="#">Contact</a><a href="#">Privacy</a><a href="#">Terms</a></div></div></footer>`,
                css: `.f5-footer { padding: 30px 5%; background: #fff; border-top: 1px solid #e2e8f0; font-family: 'Inter', sans-serif; } .f5-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; } .f5-left { display: flex; align-items: center; gap: 12px; } .f5-brand { font-size: 18px; font-weight: 800; color: #1e293b; } .f5-copy { font-size: 13px; color: #94a3b8; } .f5-links { display: flex; gap: 24px; } .f5-links a { font-size: 14px; color: #64748b; text-decoration: none; transition: color 0.2s; } .f5-links a:hover { color: #1e293b; }`,
                preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop'
            },
            {
                id: 'gf6', title: 'Large Brand Footer',
                html: `<footer class="f6-footer"><div class="f6-container"><div class="f6-grid"><div class="f6-col f6-brand-col"><h2 class="f6-logo">YourBrand</h2><p class="f6-tagline">Empowering creators and educators to share knowledge with the world.</p><div class="f6-social-row"><a href="#">𝕏</a><a href="#">f</a><a href="#">ig</a><a href="#">in</a></div></div><div class="f6-col"><h4>Product</h4><a href="#">Features</a><a href="#">Pricing</a><a href="#">Integrations</a><a href="#">Updates</a></div><div class="f6-col"><h4>Company</h4><a href="#">About</a><a href="#">Blog</a><a href="#">Careers</a><a href="#">Press</a></div><div class="f6-col"><h4>Resources</h4><a href="#">Help Center</a><a href="#">Tutorials</a><a href="#">Community</a><a href="#">Templates</a></div></div><div class="f6-bottom"><p>© 2026 YourBrand Inc. All rights reserved.</p><div class="f6-bot-links"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Cookie Settings</a></div></div></div></footer>`,
                css: `.f6-footer { padding: 80px 5% 30px; background: #fafafa; border-top: 1px solid #e5e7eb; font-family: 'Inter', sans-serif; } .f6-container { max-width: 1200px; margin: 0 auto; } .f6-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 50px; margin-bottom: 60px; } .f6-logo { font-size: 26px; font-weight: 800; color: #1e293b; margin: 0 0 12px; } .f6-tagline { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 20px; } .f6-social-row { display: flex; gap: 14px; } .f6-social-row a { font-size: 14px; font-weight: 600; color: #64748b; text-decoration: none; transition: color 0.2s; } .f6-social-row a:hover { color: #1e293b; } .f6-col h4 { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 18px; text-transform: uppercase; letter-spacing: 1px; } .f6-col a { display: block; font-size: 14px; color: #64748b; text-decoration: none; margin-bottom: 12px; transition: color 0.2s; } .f6-col a:hover { color: #4f46e5; } .f6-bottom { padding-top: 24px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; } .f6-bottom p { font-size: 13px; color: #94a3b8; margin: 0; } .f6-bot-links { display: flex; gap: 20px; } .f6-bot-links a { font-size: 13px; color: #94a3b8; text-decoration: none; } .f6-bot-links a:hover { color: #64748b; }`,
                preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&h=200&fit=crop'
            },
            {
                id: 'gf7', title: 'Simple Copyright Bar',
                html: `<footer class="f7-footer"><div class="f7-container"><p class="f7-text">© 2026 Company Name. All rights reserved.</p><div class="f7-socials"><a href="#">𝕏</a><a href="#">f</a><a href="#">ig</a><a href="#">in</a></div></div></footer>`,
                css: `.f7-footer { padding: 20px 5%; background: #1e293b; font-family: 'Inter', sans-serif; } .f7-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; } .f7-text { font-size: 13px; color: #94a3b8; margin: 0; } .f7-socials { display: flex; gap: 18px; } .f7-socials a { color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; } .f7-socials a:hover { color: #fff; }`,
                preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop'
            }
        ],
        basic: [
            {
                id: 'b1', title: 'Cloud Hero - Centered',
                html: `<section class="b1-hero"><div class="b1-overlay"></div><div class="b1-content"><h1 class="b1-title">LOREM IPSUM IS SIMPLY DUMMY TEXT</h1><p class="b1-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p></div></section>`,
                css: `.b1-hero { position: relative; min-height: 550px; background: url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1400&q=80') center/cover no-repeat; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; } .b1-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.25); } .b1-content { position: relative; z-index: 2; text-align: center; max-width: 800px; padding: 60px 40px; color: #fff; } .b1-title { font-size: 48px; font-weight: 800; margin: 0 0 30px; line-height: 1.15; text-shadow: 0 2px 20px rgba(0,0,0,0.3); } .b1-desc { font-size: 18px; line-height: 1.7; opacity: 0.9; text-shadow: 0 1px 10px rgba(0,0,0,0.2); }`,
                preview: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=300&h=200&fit=crop'
            },
            {
                id: 'b2', title: 'Cloud Hero - Left Text',
                html: `<section class="b2-hero"><div class="b2-overlay"></div><div class="b2-content"><h1 class="b2-title">LOREM IPSUM IS SIMPLY DUMMY TEXT</h1><p class="b2-desc">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.</p><p class="b2-author">— John Williams</p></div></section>`,
                css: `.b2-hero { position: relative; min-height: 500px; background: url('https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=1400&q=80') center/cover no-repeat; display: flex; align-items: center; font-family: 'Inter', sans-serif; } .b2-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(99,102,241,0.7), rgba(168,85,247,0.5)); } .b2-content { position: relative; z-index: 2; max-width: 600px; padding: 60px 80px; color: #fff; } .b2-title { font-size: 42px; font-weight: 800; margin: 0 0 25px; line-height: 1.15; } .b2-desc { font-size: 16px; line-height: 1.7; opacity: 0.9; margin-bottom: 20px; } .b2-author { font-size: 14px; font-style: italic; opacity: 0.8; }`,
                preview: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=300&h=200&fit=crop'
            },
            {
                id: 'b3', title: 'Sunset Hero with CTA',
                html: `<section class="b3-hero"><div class="b3-overlay"></div><div class="b3-content"><h1 class="b3-title">LOREM IPSUM IS SIMPLY DUMMY TEXT</h1><p class="b3-desc">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p><div class="b3-btns"><button class="b3-btn-primary">Get Started</button><button class="b3-btn-secondary">Learn More</button></div></div></section>`,
                css: `.b3-hero { position: relative; min-height: 550px; background: url('https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1400&q=80') center/cover no-repeat; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; } .b3-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)); } .b3-content { position: relative; z-index: 2; text-align: center; max-width: 750px; padding: 60px 40px; color: #fff; } .b3-title { font-size: 44px; font-weight: 800; margin: 0 0 25px; line-height: 1.15; } .b3-desc { font-size: 17px; line-height: 1.7; opacity: 0.9; margin-bottom: 35px; } .b3-btns { display: flex; gap: 16px; justify-content: center; } .b3-btn-primary { background: #4f46e5; color: #fff; border: none; padding: 14px 36px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; } .b3-btn-secondary { background: transparent; color: #fff; border: 2px solid #fff; padding: 14px 36px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=300&h=200&fit=crop'
            },
            {
                id: 'b4', title: 'Split Layout - Image Right',
                html: `<section class="b4-section"><div class="b4-container"><div class="b4-text"><span class="b4-badge">ABOUT US</span><h2 class="b4-title">We Create Beautiful Digital Experiences</h2><p class="b4-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p><button class="b4-btn">Learn More</button></div><div class="b4-img"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" alt="Team" /></div></div></section>`,
                css: `.b4-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .b4-container { display: flex; align-items: center; gap: 80px; max-width: 1200px; margin: 0 auto; } .b4-text { flex: 1; } .b4-badge { font-size: 12px; font-weight: 700; color: #4f46e5; letter-spacing: 3px; text-transform: uppercase; display: block; margin-bottom: 16px; } .b4-title { font-size: 36px; font-weight: 800; color: #1e293b; line-height: 1.2; margin: 0 0 20px; } .b4-desc { font-size: 16px; color: #64748b; line-height: 1.7; margin-bottom: 30px; } .b4-btn { background: #4f46e5; color: #fff; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; } .b4-img { flex: 1; } .b4-img img { width: 100%; border-radius: 16px; box-shadow: 0 25px 50px rgba(0,0,0,0.1); }`,
                preview: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop'
            },
            {
                id: 'b5', title: 'Feature Cards Grid',
                html: `<section class="b5-section"><div class="b5-container"><h2 class="b5-title">Why Choose Us</h2><p class="b5-subtitle">Everything you need to grow your business</p><div class="b5-grid"><div class="b5-card"><div class="b5-icon">🚀</div><h3>Fast Performance</h3><p>Lightning fast load times for the best user experience.</p></div><div class="b5-card"><div class="b5-icon">🎨</div><h3>Beautiful Design</h3><p>Stunning designs that capture attention and drive results.</p></div><div class="b5-card"><div class="b5-icon">🔒</div><h3>Secure & Reliable</h3><p>Enterprise-grade security to protect your data.</p></div><div class="b5-card"><div class="b5-icon">📱</div><h3>Fully Responsive</h3><p>Looks perfect on every device and screen size.</p></div></div></div></section>`,
                css: `.b5-section { padding: 100px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .b5-container { max-width: 1100px; margin: 0 auto; text-align: center; } .b5-title { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0 0 12px; } .b5-subtitle { font-size: 18px; color: #64748b; margin-bottom: 60px; } .b5-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; text-align: left; } .b5-card { background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: transform 0.3s, box-shadow 0.3s; } .b5-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1); } .b5-icon { font-size: 36px; margin-bottom: 16px; } .b5-card h3 { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 10px; } .b5-card p { font-size: 15px; color: #64748b; line-height: 1.6; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'b6', title: 'Testimonial Section',
                html: `<section class="b6-section"><div class="b6-container"><h2 class="b6-title">What Our Students Say</h2><div class="b6-grid"><div class="b6-card"><div class="b6-stars">★★★★★</div><p class="b6-quote">"This course completely transformed my understanding of web development. The instructors are amazing!"</p><div class="b6-author"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Author" /><div><strong>Sarah Johnson</strong><span>Full Stack Developer</span></div></div></div><div class="b6-card"><div class="b6-stars">★★★★★</div><p class="b6-quote">"Best investment I've made in my career. The hands-on projects really helped me learn practical skills."</p><div class="b6-author"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Author" /><div><strong>David Chen</strong><span>UI/UX Designer</span></div></div></div></div></div></section>`,
                css: `.b6-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .b6-container { max-width: 1100px; margin: 0 auto; text-align: center; } .b6-title { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0 0 50px; } .b6-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; text-align: left; } .b6-card { background: #f8fafc; padding: 40px; border-radius: 16px; border: 1px solid #e2e8f0; } .b6-stars { color: #f59e0b; font-size: 20px; margin-bottom: 16px; } .b6-quote { font-size: 17px; color: #334155; line-height: 1.7; margin: 0 0 24px; font-style: italic; } .b6-author { display: flex; align-items: center; gap: 14px; } .b6-author img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; } .b6-author strong { display: block; font-size: 15px; color: #1e293b; } .b6-author span { font-size: 13px; color: #64748b; }`,
                preview: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=300&h=200&fit=crop'
            },
            {
                id: 'b7', title: 'Stats Counter Section',
                html: `<section class="b7-section"><div class="b7-container"><h2 class="b7-title">Our Impact in Numbers</h2><div class="b7-grid"><div class="b7-stat"><div class="b7-number">10K+</div><div class="b7-label">Students Enrolled</div></div><div class="b7-stat"><div class="b7-number">95%</div><div class="b7-label">Satisfaction Rate</div></div><div class="b7-stat"><div class="b7-number">200+</div><div class="b7-label">Courses Available</div></div><div class="b7-stat"><div class="b7-number">50+</div><div class="b7-label">Expert Instructors</div></div></div></div></section>`,
                css: `.b7-section { padding: 100px 5%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Inter', sans-serif; } .b7-container { max-width: 1100px; margin: 0 auto; text-align: center; } .b7-title { font-size: 36px; font-weight: 800; color: #fff; margin: 0 0 60px; } .b7-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; } .b7-stat { padding: 30px; } .b7-number { font-size: 48px; font-weight: 900; color: #fff; margin-bottom: 8px; } .b7-label { font-size: 16px; color: rgba(255,255,255,0.8); font-weight: 500; }`,
                preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop'
            },
            {
                id: 'b8', title: 'CTA Banner',
                html: `<section class="b8-section"><div class="b8-container"><div class="b8-content"><h2 class="b8-title">Ready to Start Learning?</h2><p class="b8-desc">Join thousands of students already learning on our platform. Start your journey today.</p></div><div class="b8-actions"><button class="b8-btn-primary">Get Started Free</button><button class="b8-btn-secondary">Watch Demo</button></div></div></section>`,
                css: `.b8-section { padding: 80px 5%; background: #1e293b; font-family: 'Inter', sans-serif; } .b8-container { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 40px; } .b8-title { font-size: 32px; font-weight: 800; color: #fff; margin: 0 0 10px; } .b8-desc { font-size: 16px; color: #94a3b8; margin: 0; } .b8-actions { display: flex; gap: 14px; flex-shrink: 0; } .b8-btn-primary { background: #4f46e5; color: #fff; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; white-space: nowrap; } .b8-btn-secondary { background: transparent; color: #fff; border: 1px solid #475569; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; white-space: nowrap; }`,
                preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop'
            },
            {
                id: 'b9', title: 'Image Gallery Grid',
                html: `<section class="b9-section"><div class="b9-container"><h2 class="b9-title">Our Gallery</h2><p class="b9-subtitle">A glimpse into our world</p><div class="b9-grid"><img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80" alt="Gallery 1" /><img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80" alt="Gallery 2" /><img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80" alt="Gallery 3" /><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80" alt="Gallery 4" /><img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80" alt="Gallery 5" /><img src="https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600&q=80" alt="Gallery 6" /></div></div></section>`,
                css: `.b9-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .b9-container { max-width: 1200px; margin: 0 auto; text-align: center; } .b9-title { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0 0 10px; } .b9-subtitle { font-size: 18px; color: #64748b; margin-bottom: 50px; } .b9-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; } .b9-grid img { width: 100%; height: 250px; object-fit: cover; border-radius: 12px; transition: transform 0.3s; cursor: pointer; } .b9-grid img:hover { transform: scale(1.03); }`,
                preview: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop'
            },
            {
                id: 'b10', title: 'Text Content Block',
                html: `<section class="b10-section"><div class="b10-container"><h2 class="b10-title">About Our Academy</h2><div class="b10-divider"></div><p class="b10-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p><p class="b10-text">It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.</p></div></section>`,
                css: `.b10-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .b10-container { max-width: 800px; margin: 0 auto; text-align: center; } .b10-title { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0 0 20px; } .b10-divider { width: 60px; height: 4px; background: #4f46e5; margin: 0 auto 30px; border-radius: 2px; } .b10-text { font-size: 17px; color: #64748b; line-height: 1.8; margin: 0 0 20px; }`,
                preview: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=300&h=200&fit=crop'
            },
            {
                id: 'b11', title: 'Mountain Hero - Dark',
                html: `<section class="b11-hero"><div class="b11-overlay"></div><div class="b11-content"><span class="b11-badge">WELCOME TO OUR ACADEMY</span><h1 class="b11-title">Learn Without Limits</h1><p class="b11-desc">Access world-class education from anywhere. Join our community of learners and start your journey to success today.</p><button class="b11-btn">Explore Courses</button></div></section>`,
                css: `.b11-hero { position: relative; min-height: 600px; background: url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=80') center/cover no-repeat; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; } .b11-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.85) 100%); } .b11-content { position: relative; z-index: 2; text-align: center; max-width: 700px; padding: 60px 40px; color: #fff; } .b11-badge { font-size: 12px; font-weight: 700; letter-spacing: 4px; color: #818cf8; display: block; margin-bottom: 20px; } .b11-title { font-size: 56px; font-weight: 800; margin: 0 0 24px; line-height: 1.1; } .b11-desc { font-size: 18px; line-height: 1.7; opacity: 0.85; margin-bottom: 35px; } .b11-btn { background: #4f46e5; color: #fff; border: none; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 16px; cursor: pointer; transition: background 0.2s; } .b11-btn:hover { background: #4338ca; }`,
                preview: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=200&fit=crop'
            },
            {
                id: 'b12', title: 'Blue Gradient Hero',
                html: `<section class="b12-hero"><div class="b12-content"><h1 class="b12-title">LOREM IPSUM IS SIMPLY DUMMY TEXT OF THE PRINTING INDUSTRY</h1><p class="b12-desc">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p><div class="b12-btns"><button class="b12-btn-primary">Explore Now</button></div></div></section>`,
                css: `.b12-hero { min-height: 500px; background: linear-gradient(135deg, #0ea5e9, #6366f1, #a855f7); display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; } .b12-content { text-align: center; max-width: 800px; padding: 80px 40px; color: #fff; } .b12-title { font-size: 40px; font-weight: 800; margin: 0 0 24px; line-height: 1.2; letter-spacing: 1px; } .b12-desc { font-size: 17px; line-height: 1.7; opacity: 0.9; margin-bottom: 35px; } .b12-btn-primary { background: #fff; color: #4f46e5; border: none; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 16px; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=300&h=200&fit=crop'
            }
        ],
        slider: [
            {
                id: 's1', title: 'Full Width Image Slider',
                html: `<section class="s1-slider"><div class="s1-slides"><div class="s1-slide s1-active" style="background-image:url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1400&q=80')"><div class="s1-overlay"></div><div class="s1-text"><h1>Beautiful Landscapes</h1><p>Explore the wonders of nature with our curated collection</p></div></div><div class="s1-slide" style="background-image:url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=80')"><div class="s1-overlay"></div><div class="s1-text"><h1>Mountain Adventures</h1><p>Reach new heights and discover breathtaking views</p></div></div><div class="s1-slide" style="background-image:url('https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1400&q=80')"><div class="s1-overlay"></div><div class="s1-text"><h1>Golden Sunsets</h1><p>Witness the most stunning sunsets from around the world</p></div></div></div><button class="s1-prev" onclick="(function(btn){var s=btn.closest('.s1-slider');var slides=s.querySelectorAll('.s1-slide');var c=s.querySelector('.s1-active');var i=Array.from(slides).indexOf(c);c.classList.remove('s1-active');slides[(i-1+slides.length)%slides.length].classList.add('s1-active')})(this)">‹</button><button class="s1-next" onclick="(function(btn){var s=btn.closest('.s1-slider');var slides=s.querySelectorAll('.s1-slide');var c=s.querySelector('.s1-active');var i=Array.from(slides).indexOf(c);c.classList.remove('s1-active');slides[(i+1)%slides.length].classList.add('s1-active')})(this)">›</button></section>`,
                css: `.s1-slider { position: relative; height: 550px; overflow: hidden; font-family: 'Inter', sans-serif; } .s1-slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s ease; } .s1-slide.s1-active { opacity: 1; } .s1-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)); } .s1-text { position: absolute; bottom: 80px; left: 60px; color: #fff; z-index: 2; } .s1-text h1 { font-size: 48px; font-weight: 800; margin: 0 0 12px; text-shadow: 0 2px 15px rgba(0,0,0,0.3); } .s1-text p { font-size: 18px; opacity: 0.9; margin: 0; } .s1-prev, .s1-next { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); color: #fff; border: none; width: 50px; height: 50px; border-radius: 50%; font-size: 28px; cursor: pointer; z-index: 3; display: flex; align-items: center; justify-content: center; transition: background 0.2s; } .s1-prev:hover, .s1-next:hover { background: rgba(255,255,255,0.4); } .s1-prev { left: 20px; } .s1-next { right: 20px; }`,
                preview: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=300&h=200&fit=crop'
            },
            {
                id: 's2', title: 'Split Slider with Text',
                html: `<section class="s2-slider"><div class="s2-container"><div class="s2-img-wrap"><div class="s2-slides"><div class="s2-slide s2-active"><img src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80" alt="Slide 1" /></div><div class="s2-slide"><img src="https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&q=80" alt="Slide 2" /></div><div class="s2-slide"><img src="https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80" alt="Slide 3" /></div></div><button class="s2-prev" onclick="(function(btn){var s=btn.closest('.s2-img-wrap');var slides=s.querySelectorAll('.s2-slide');var c=s.querySelector('.s2-active');var i=Array.from(slides).indexOf(c);c.classList.remove('s2-active');slides[(i-1+slides.length)%slides.length].classList.add('s2-active')})(this)">‹</button><button class="s2-next" onclick="(function(btn){var s=btn.closest('.s2-img-wrap');var slides=s.querySelectorAll('.s2-slide');var c=s.querySelector('.s2-active');var i=Array.from(slides).indexOf(c);c.classList.remove('s2-active');slides[(i+1)%slides.length].classList.add('s2-active')})(this)">›</button></div><div class="s2-text"><h2 class="s2-title">Lorem Ipsum is simply dummy text</h2><p class="s2-desc">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p><button class="s2-btn">Learn More</button></div></div></section>`,
                css: `.s2-slider { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .s2-container { display: flex; align-items: center; gap: 60px; max-width: 1200px; margin: 0 auto; } .s2-img-wrap { flex: 1; position: relative; border-radius: 16px; overflow: hidden; height: 450px; } .s2-slides { position: relative; width: 100%; height: 100%; } .s2-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 0.7s ease; } .s2-slide.s2-active { opacity: 1; } .s2-slide img { width: 100%; height: 100%; object-fit: cover; } .s2-prev, .s2-next { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.4); color: #fff; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 22px; cursor: pointer; z-index: 3; display: flex; align-items: center; justify-content: center; } .s2-prev { left: 12px; } .s2-next { right: 12px; } .s2-text { flex: 1; } .s2-title { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0 0 20px; line-height: 1.2; } .s2-desc { font-size: 16px; color: #64748b; line-height: 1.7; margin-bottom: 30px; } .s2-btn { background: #4f46e5; color: #fff; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=300&h=200&fit=crop'
            },
            {
                id: 's3', title: 'Gradient Overlay Slider',
                html: `<section class="s3-slider"><div class="s3-slides"><div class="s3-slide s3-active" style="background-image:url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80')"><div class="s3-overlay"></div><div class="s3-content"><span class="s3-badge">FEATURED</span><h1 class="s3-title">Discover Amazing Places</h1><p class="s3-desc">Embark on unforgettable journeys around the globe</p><button class="s3-btn">Explore Now</button></div></div><div class="s3-slide" style="background-image:url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1400&q=80')"><div class="s3-overlay"></div><div class="s3-content"><span class="s3-badge">TRENDING</span><h1 class="s3-title">Nature's Masterpiece</h1><p class="s3-desc">Experience the beauty of untouched wilderness</p><button class="s3-btn">View Gallery</button></div></div><div class="s3-slide" style="background-image:url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80')"><div class="s3-overlay"></div><div class="s3-content"><span class="s3-badge">NEW</span><h1 class="s3-title">Into the Forest</h1><p class="s3-desc">Find peace and tranquility in nature's embrace</p><button class="s3-btn">Learn More</button></div></div></div><button class="s3-prev" onclick="(function(btn){var s=btn.closest('.s3-slider');var slides=s.querySelectorAll('.s3-slide');var c=s.querySelector('.s3-active');var i=Array.from(slides).indexOf(c);c.classList.remove('s3-active');slides[(i-1+slides.length)%slides.length].classList.add('s3-active')})(this)">‹</button><button class="s3-next" onclick="(function(btn){var s=btn.closest('.s3-slider');var slides=s.querySelectorAll('.s3-slide');var c=s.querySelector('.s3-active');var i=Array.from(slides).indexOf(c);c.classList.remove('s3-active');slides[(i+1)%slides.length].classList.add('s3-active')})(this)">›</button><div class="s3-dots"><span class="s3-dot s3-dot-active" onclick="(function(d){var s=d.closest('.s3-slider');var slides=s.querySelectorAll('.s3-slide');var dots=s.querySelectorAll('.s3-dot');slides.forEach(function(sl){sl.classList.remove('s3-active')});dots.forEach(function(dt){dt.classList.remove('s3-dot-active')});slides[0].classList.add('s3-active');d.classList.add('s3-dot-active')})(this)"></span><span class="s3-dot" onclick="(function(d){var s=d.closest('.s3-slider');var slides=s.querySelectorAll('.s3-slide');var dots=s.querySelectorAll('.s3-dot');slides.forEach(function(sl){sl.classList.remove('s3-active')});dots.forEach(function(dt){dt.classList.remove('s3-dot-active')});slides[1].classList.add('s3-active');d.classList.add('s3-dot-active')})(this)"></span><span class="s3-dot" onclick="(function(d){var s=d.closest('.s3-slider');var slides=s.querySelectorAll('.s3-slide');var dots=s.querySelectorAll('.s3-dot');slides.forEach(function(sl){sl.classList.remove('s3-active')});dots.forEach(function(dt){dt.classList.remove('s3-dot-active')});slides[2].classList.add('s3-active');d.classList.add('s3-dot-active')})(this)"></span></div></section>`,
                css: `.s3-slider { position: relative; height: 600px; overflow: hidden; font-family: 'Inter', sans-serif; } .s3-slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s ease; } .s3-slide.s3-active { opacity: 1; } .s3-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(79,70,229,0.7), rgba(168,85,247,0.5)); } .s3-content { position: absolute; top: 50%; left: 60px; transform: translateY(-50%); color: #fff; z-index: 2; max-width: 550px; } .s3-badge { font-size: 12px; font-weight: 700; letter-spacing: 3px; background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; display: inline-block; margin-bottom: 20px; } .s3-title { font-size: 52px; font-weight: 800; margin: 0 0 16px; line-height: 1.1; } .s3-desc { font-size: 18px; opacity: 0.9; margin: 0 0 30px; } .s3-btn { background: #fff; color: #4f46e5; border: none; padding: 14px 36px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; } .s3-prev, .s3-next { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.15); backdrop-filter: blur(6px); color: #fff; border: none; width: 48px; height: 48px; border-radius: 50%; font-size: 26px; cursor: pointer; z-index: 3; display: flex; align-items: center; justify-content: center; } .s3-prev { left: 20px; } .s3-next { right: 20px; } .s3-dots { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 3; } .s3-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.4); cursor: pointer; transition: background 0.2s; } .s3-dot.s3-dot-active { background: #fff; }`,
                preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop'
            },
            {
                id: 's4', title: 'Dark Theme Slider',
                html: `<section class="s4-slider"><div class="s4-slides"><div class="s4-slide s4-active" style="background-image:url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80')"><div class="s4-overlay"></div><div class="s4-content"><h1 class="s4-title">The Future is Here</h1><p class="s4-desc">Discover cutting-edge technology and innovation</p><button class="s4-btn">Get Started</button></div></div><div class="s4-slide" style="background-image:url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1400&q=80')"><div class="s4-overlay"></div><div class="s4-content"><h1 class="s4-title">Explore the Universe</h1><p class="s4-desc">Journey through the cosmos and beyond</p><button class="s4-btn">Learn More</button></div></div><div class="s4-slide" style="background-image:url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1400&q=80')"><div class="s4-overlay"></div><div class="s4-content"><h1 class="s4-title">Infinite Possibilities</h1><p class="s4-desc">Unlock your potential with limitless learning</p><button class="s4-btn">Join Now</button></div></div></div><button class="s4-prev" onclick="(function(btn){var s=btn.closest('.s4-slider');var slides=s.querySelectorAll('.s4-slide');var c=s.querySelector('.s4-active');var i=Array.from(slides).indexOf(c);c.classList.remove('s4-active');slides[(i-1+slides.length)%slides.length].classList.add('s4-active')})(this)">‹</button><button class="s4-next" onclick="(function(btn){var s=btn.closest('.s4-slider');var slides=s.querySelectorAll('.s4-slide');var c=s.querySelector('.s4-active');var i=Array.from(slides).indexOf(c);c.classList.remove('s4-active');slides[(i+1)%slides.length].classList.add('s4-active')})(this)">›</button></section>`,
                css: `.s4-slider { position: relative; height: 550px; overflow: hidden; font-family: 'Inter', sans-serif; } .s4-slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s ease; } .s4-slide.s4-active { opacity: 1; } .s4-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%); } .s4-content { position: absolute; top: 50%; left: 80px; transform: translateY(-50%); color: #fff; z-index: 2; max-width: 500px; } .s4-title { font-size: 48px; font-weight: 800; margin: 0 0 16px; line-height: 1.1; } .s4-desc { font-size: 18px; opacity: 0.8; margin: 0 0 30px; } .s4-btn { background: #4f46e5; color: #fff; border: none; padding: 14px 36px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; transition: background 0.2s; } .s4-btn:hover { background: #4338ca; } .s4-prev, .s4-next { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 50px; height: 50px; border-radius: 50%; font-size: 26px; cursor: pointer; z-index: 3; display: flex; align-items: center; justify-content: center; } .s4-prev { left: 20px; } .s4-next { right: 20px; }`,
                preview: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop'
            },
            {
                id: 's5', title: 'Testimonial Carousel',
                html: `<section class="s5-section"><h2 class="s5-heading">What People Say</h2><div class="s5-carousel"><div class="s5-slides"><div class="s5-card s5-active"><div class="s5-stars">★★★★★</div><p class="s5-quote">"This platform has completely changed how I approach learning. The courses are top-notch and the community is incredibly supportive."</p><div class="s5-author"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="" /><div><strong>Emily Rodriguez</strong><span>Marketing Director</span></div></div></div><div class="s5-card"><div class="s5-stars">★★★★★</div><p class="s5-quote">"Best online learning experience I've ever had. The instructors are world-class and the content is always up to date."</p><div class="s5-author"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="" /><div><strong>Michael Chen</strong><span>Software Engineer</span></div></div></div><div class="s5-card"><div class="s5-stars">★★★★★</div><p class="s5-quote">"I was able to switch careers entirely thanks to the skills I learned here. Can't recommend it enough!"</p><div class="s5-author"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" alt="" /><div><strong>Sarah Williams</strong><span>Product Designer</span></div></div></div></div><button class="s5-prev" onclick="(function(btn){var s=btn.closest('.s5-carousel');var cards=s.querySelectorAll('.s5-card');var c=s.querySelector('.s5-active');var i=Array.from(cards).indexOf(c);c.classList.remove('s5-active');cards[(i-1+cards.length)%cards.length].classList.add('s5-active')})(this)">‹</button><button class="s5-next" onclick="(function(btn){var s=btn.closest('.s5-carousel');var cards=s.querySelectorAll('.s5-card');var c=s.querySelector('.s5-active');var i=Array.from(cards).indexOf(c);c.classList.remove('s5-active');cards[(i+1)%cards.length].classList.add('s5-active')})(this)">›</button></div></section>`,
                css: `.s5-section { padding: 100px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; text-align: center; } .s5-heading { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0 0 50px; } .s5-carousel { position: relative; max-width: 700px; margin: 0 auto; } .s5-slides { position: relative; min-height: 280px; } .s5-card { position: absolute; inset: 0; opacity: 0; transition: opacity 0.6s ease; background: #fff; padding: 50px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); text-align: left; } .s5-card.s5-active { opacity: 1; position: relative; } .s5-stars { color: #f59e0b; font-size: 22px; margin-bottom: 20px; } .s5-quote { font-size: 18px; color: #334155; line-height: 1.7; margin: 0 0 30px; font-style: italic; } .s5-author { display: flex; align-items: center; gap: 14px; } .s5-author img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; } .s5-author strong { display: block; font-size: 16px; color: #1e293b; } .s5-author span { font-size: 13px; color: #64748b; } .s5-prev, .s5-next { position: absolute; top: 50%; transform: translateY(-50%); background: #fff; color: #1e293b; border: 1px solid #e2e8f0; width: 44px; height: 44px; border-radius: 50%; font-size: 22px; cursor: pointer; z-index: 3; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); } .s5-prev { left: -60px; } .s5-next { right: -60px; }`,
                preview: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=300&h=200&fit=crop'
            },
            {
                id: 's6', title: 'Multi-Image Showcase',
                html: `<section class="s6-section"><div class="s6-container"><div class="s6-header"><h2 class="s6-title">Our Portfolio</h2><div class="s6-nav"><button class="s6-prev" onclick="(function(btn){var wrap=btn.closest('.s6-section').querySelector('.s6-track');var scroll=wrap.scrollLeft;wrap.scrollTo({left:scroll-320,behavior:'smooth'})})(this)">‹</button><button class="s6-next" onclick="(function(btn){var wrap=btn.closest('.s6-section').querySelector('.s6-track');var scroll=wrap.scrollLeft;wrap.scrollTo({left:scroll+320,behavior:'smooth'})})(this)">›</button></div></div><div class="s6-track"><div class="s6-item"><img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80" alt="" /><h3>Team Collaboration</h3><p>Building together for success</p></div><div class="s6-item"><img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80" alt="" /><h3>Creative Workspace</h3><p>Where ideas come to life</p></div><div class="s6-item"><img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80" alt="" /><h3>Learning Sessions</h3><p>Interactive classroom experience</p></div><div class="s6-item"><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80" alt="" /><h3>Student Projects</h3><p>Showcasing student work</p></div><div class="s6-item"><img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=80" alt="" /><h3>Campus Life</h3><p>Experience beyond academics</p></div></div></div></section>`,
                css: `.s6-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .s6-container { max-width: 1200px; margin: 0 auto; } .s6-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; } .s6-title { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0; } .s6-nav { display: flex; gap: 10px; } .s6-prev, .s6-next { background: #f1f5f9; color: #1e293b; border: none; width: 44px; height: 44px; border-radius: 50%; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; } .s6-prev:hover, .s6-next:hover { background: #e2e8f0; } .s6-track { display: flex; gap: 24px; overflow-x: auto; scroll-behavior: smooth; padding-bottom: 10px; } .s6-track::-webkit-scrollbar { display: none; } .s6-item { min-width: 300px; flex-shrink: 0; } .s6-item img { width: 100%; height: 220px; object-fit: cover; border-radius: 12px; margin-bottom: 14px; } .s6-item h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 6px; } .s6-item p { font-size: 14px; color: #64748b; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop'
            }
        ],
        video: [
            {
                id: 'v1', title: 'Full Width Video',
                html: `<section class="v1-section"><div class="v1-container"><h2 class="v1-title">Watch Our Introduction</h2><p class="v1-subtitle">Learn what makes us different</p><div class="v1-video"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div></section>`,
                css: `.v1-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .v1-container { max-width: 900px; margin: 0 auto; text-align: center; } .v1-title { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0 0 12px; } .v1-subtitle { font-size: 18px; color: #64748b; margin-bottom: 40px; } .v1-video { position: relative; padding-bottom: 56.25%; height: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.15); } .v1-video iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }`,
                preview: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=300&h=200&fit=crop'
            },
            {
                id: 'v2', title: 'Video with Play Button',
                html: `<section class="v2-section"><div class="v2-container"><div class="v2-thumbnail" onclick="(function(el){var iframe=document.createElement('iframe');iframe.src='https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';iframe.setAttribute('frameborder','0');iframe.setAttribute('allowfullscreen','');iframe.setAttribute('allow','accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture');iframe.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%';el.innerHTML='';el.appendChild(iframe)})(this)"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80" alt="Video Thumbnail" /><div class="v2-play"><svg viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div><div class="v2-overlay"></div></div></div></section>`,
                css: `.v2-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .v2-container { max-width: 1000px; margin: 0 auto; } .v2-thumbnail { position: relative; padding-bottom: 56.25%; height: 0; border-radius: 16px; overflow: hidden; cursor: pointer; box-shadow: 0 20px 50px rgba(0,0,0,0.15); } .v2-thumbnail img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; } .v2-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); transition: background 0.3s; } .v2-thumbnail:hover .v2-overlay { background: rgba(0,0,0,0.15); } .v2-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; background: rgba(79,70,229,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 2; transition: transform 0.3s; } .v2-thumbnail:hover .v2-play { transform: translate(-50%, -50%) scale(1.1); } .v2-play svg { width: 30px; height: 30px; margin-left: 4px; }`,
                preview: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop'
            },
            {
                id: 'v3', title: 'Split Video + Text',
                html: `<section class="v3-section"><div class="v3-container"><div class="v3-video"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="v3-text"><span class="v3-badge">VIDEO</span><h2 class="v3-title">Lorem Ipsum is simply dummy text</h2><p class="v3-desc">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p><button class="v3-btn">Watch Full Course</button></div></div></section>`,
                css: `.v3-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .v3-container { display: flex; align-items: center; gap: 60px; max-width: 1200px; margin: 0 auto; } .v3-video { flex: 1.2; position: relative; padding-bottom: 33.75%; height: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.12); } .v3-video iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; } .v3-text { flex: 1; } .v3-badge { font-size: 12px; font-weight: 700; color: #4f46e5; letter-spacing: 3px; text-transform: uppercase; display: block; margin-bottom: 14px; } .v3-title { font-size: 32px; font-weight: 800; color: #1e293b; line-height: 1.2; margin: 0 0 18px; } .v3-desc { font-size: 16px; color: #64748b; line-height: 1.7; margin-bottom: 28px; } .v3-btn { background: #4f46e5; color: #fff; border: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=300&h=200&fit=crop'
            },
            {
                id: 'v4', title: 'Text + Video Right',
                html: `<section class="v4-section"><div class="v4-container"><div class="v4-text"><h2 class="v4-title">Lorem Ipsum is simply dummy text</h2><p class="v4-desc">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p><button class="v4-btn">Get Started</button></div><div class="v4-video"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div></section>`,
                css: `.v4-section { padding: 100px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .v4-container { display: flex; align-items: center; gap: 60px; max-width: 1200px; margin: 0 auto; } .v4-text { flex: 1; } .v4-title { font-size: 32px; font-weight: 800; color: #1e293b; line-height: 1.2; margin: 0 0 18px; } .v4-desc { font-size: 16px; color: #64748b; line-height: 1.7; margin-bottom: 28px; } .v4-btn { background: #1e293b; color: #fff; border: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; } .v4-video { flex: 1.2; position: relative; padding-bottom: 33.75%; height: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.12); } .v4-video iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }`,
                preview: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=300&h=200&fit=crop'
            },
            {
                id: 'v5', title: 'Dark Cinematic Hero',
                html: `<section class="v5-section"><div class="v5-overlay"></div><div class="v5-content"><h1 class="v5-title">Watch Our Story</h1><p class="v5-desc">A short film about our journey, our passion, and our vision for the future of education.</p><div class="v5-play-wrap" onclick="(function(el){var sec=el.closest('.v5-section');var vid=document.createElement('div');vid.className='v5-fullvid';vid.innerHTML='<iframe src=\\'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1\\' frameborder=\\'0\\' allowfullscreen allow=\\'autoplay\\'></iframe>';sec.querySelector('.v5-content').replaceWith(vid)})(this)"><div class="v5-play"><svg viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div><span>Play Video</span></div></div></section>`,
                css: `.v5-section { position: relative; min-height: 550px; background: url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&q=80') center/cover no-repeat; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; } .v5-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.65); } .v5-content { position: relative; z-index: 2; text-align: center; color: #fff; max-width: 600px; padding: 40px; } .v5-title { font-size: 48px; font-weight: 800; margin: 0 0 16px; } .v5-desc { font-size: 18px; opacity: 0.85; line-height: 1.7; margin-bottom: 40px; } .v5-play-wrap { display: inline-flex; align-items: center; gap: 16px; cursor: pointer; padding: 14px 32px; border: 2px solid rgba(255,255,255,0.4); border-radius: 40px; transition: border-color 0.3s; } .v5-play-wrap:hover { border-color: #fff; } .v5-play-wrap span { font-size: 16px; font-weight: 600; } .v5-play { width: 50px; height: 50px; background: #4f46e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; } .v5-play svg { width: 22px; height: 22px; margin-left: 3px; } .v5-fullvid { position: relative; z-index: 2; width: 80%; max-width: 900px; margin: 0 auto; } .v5-fullvid iframe { width: 100%; height: 500px; border-radius: 12px; }`,
                preview: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=200&fit=crop'
            },
            {
                id: 'v6', title: 'Video Course Preview Grid',
                html: `<section class="v6-section"><div class="v6-container"><h2 class="v6-title">Course Previews</h2><p class="v6-subtitle">Watch free previews of our most popular courses</p><div class="v6-grid"><div class="v6-card"><div class="v6-thumb"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Course 1" frameborder="0" allowfullscreen></iframe></div><h3>Complete Web Development</h3><p>Learn HTML, CSS, JS & React</p></div><div class="v6-card"><div class="v6-thumb"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Course 2" frameborder="0" allowfullscreen></iframe></div><h3>Python for Beginners</h3><p>Master Python programming</p></div><div class="v6-card"><div class="v6-thumb"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Course 3" frameborder="0" allowfullscreen></iframe></div><h3>UI/UX Design Mastery</h3><p>Design stunning interfaces</p></div></div></div></section>`,
                css: `.v6-section { padding: 100px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .v6-container { max-width: 1200px; margin: 0 auto; text-align: center; } .v6-title { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0 0 12px; } .v6-subtitle { font-size: 18px; color: #64748b; margin-bottom: 50px; } .v6-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; text-align: left; } .v6-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: transform 0.3s; } .v6-card:hover { transform: translateY(-4px); } .v6-thumb { position: relative; padding-bottom: 56.25%; height: 0; } .v6-thumb iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; } .v6-card h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 16px 20px 6px; } .v6-card p { font-size: 14px; color: #64748b; margin: 0 20px 20px; }`,
                preview: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&h=200&fit=crop'
            },
            {
                id: 'v7', title: 'Video Testimonial',
                html: `<section class="v7-section"><div class="v7-container"><div class="v7-video"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Testimonial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="v7-text"><div class="v7-stars">★★★★★</div><h2 class="v7-title">"This course changed my career path entirely"</h2><p class="v7-desc">Hear directly from our students about their transformative learning experiences on our platform.</p><div class="v7-author"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Student" /><div><strong>Sarah Johnson</strong><span>Now at Google • Class of 2025</span></div></div></div></div></section>`,
                css: `.v7-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .v7-container { display: flex; align-items: center; gap: 60px; max-width: 1200px; margin: 0 auto; } .v7-video { flex: 1; position: relative; padding-bottom: 28%; height: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.12); } .v7-video iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; } .v7-text { flex: 1; } .v7-stars { color: #f59e0b; font-size: 24px; margin-bottom: 16px; } .v7-title { font-size: 28px; font-weight: 700; color: #1e293b; line-height: 1.3; margin: 0 0 16px; font-style: italic; } .v7-desc { font-size: 16px; color: #64748b; line-height: 1.7; margin-bottom: 24px; } .v7-author { display: flex; align-items: center; gap: 14px; } .v7-author img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; } .v7-author strong { display: block; font-size: 16px; color: #1e293b; } .v7-author span { font-size: 13px; color: #64748b; }`,
                preview: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=300&h=200&fit=crop'
            },
            {
                id: 'v8', title: 'Minimal Video Embed',
                html: `<section class="v8-section"><div class="v8-container"><div class="v8-video"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div></section>`,
                css: `.v8-section { padding: 60px 5%; background: #0f172a; font-family: 'Inter', sans-serif; } .v8-container { max-width: 1000px; margin: 0 auto; } .v8-video { position: relative; padding-bottom: 56.25%; height: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.4); } .v8-video iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }`,
                preview: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=200&fit=crop'
            }
        ],
        custom: [
            {
                id: 'cd1', title: 'Gradient Hero - Split',
                html: `<section class="cd1-section"><div class="cd1-container"><div class="cd1-left"><div class="cd1-dots"></div><h1 class="cd1-title">LOREM IPSUM IS DUMMY TEXT</h1><p class="cd1-desc">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p></div><div class="cd1-right"><h2 class="cd1-rtitle">Lorem Ipsum is simply dummy text</h2><p class="cd1-rdesc">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p></div></div></section>`,
                css: `.cd1-section { display: flex; min-height: 500px; font-family: 'Inter', sans-serif; } .cd1-container { display: flex; width: 100%; } .cd1-left { flex: 1; background: linear-gradient(135deg, #f97316, #fb923c, #fdba74); padding: 80px 60px; color: #fff; position: relative; overflow: hidden; } .cd1-dots::before { content: '• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •'; position: absolute; top: 0; left: 0; right: 0; bottom: 0; font-size: 24px; letter-spacing: 20px; line-height: 40px; opacity: 0.15; color: #fff; overflow: hidden; padding: 20px; } .cd1-title { font-size: 42px; font-weight: 900; margin: 0 0 30px; line-height: 1.1; position: relative; z-index: 2; } .cd1-desc { font-size: 16px; line-height: 1.8; opacity: 0.9; position: relative; z-index: 2; font-style: italic; } .cd1-right { flex: 1; background: #fff; padding: 80px 60px; display: flex; flex-direction: column; justify-content: center; } .cd1-rtitle { font-size: 32px; font-weight: 700; color: #1e293b; margin: 0 0 20px; line-height: 1.3; } .cd1-rdesc { font-size: 16px; color: #64748b; line-height: 1.8; }`,
                preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop'
            },
            {
                id: 'cd2', title: 'Warm Gradient - Centered',
                html: `<section class="cd2-section"><div class="cd2-dots"></div><div class="cd2-content"><h1 class="cd2-title">LOREM IPSUM IS SIMPLY DUMMY TEXT</h1><p class="cd2-desc">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p><button class="cd2-btn">Get Started</button></div></section>`,
                css: `.cd2-section { position: relative; min-height: 500px; background: linear-gradient(135deg, #ea580c, #f97316, #fdba74); display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; overflow: hidden; } .cd2-dots::before { content: '· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·'; position: absolute; inset: 0; font-size: 28px; letter-spacing: 18px; line-height: 35px; opacity: 0.15; color: #fff; overflow: hidden; padding: 20px; } .cd2-content { position: relative; z-index: 2; text-align: center; max-width: 700px; padding: 60px 40px; color: #fff; } .cd2-title { font-size: 44px; font-weight: 900; margin: 0 0 24px; line-height: 1.15; } .cd2-desc { font-size: 17px; line-height: 1.8; opacity: 0.9; margin-bottom: 35px; } .cd2-btn { background: #fff; color: #ea580c; border: none; padding: 14px 36px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop'
            },
            {
                id: 'cd3', title: 'Warm Gradient - Left Aligned',
                html: `<section class="cd3-section"><div class="cd3-dots"></div><div class="cd3-content"><span class="cd3-badge">CUSTOM DESIGN</span><h1 class="cd3-title">Lorem Ipsum is simply dummy text</h1><p class="cd3-desc">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p><div class="cd3-btns"><button class="cd3-btn-primary">Learn More</button><button class="cd3-btn-secondary">Watch Demo</button></div></div></section>`,
                css: `.cd3-section { position: relative; min-height: 500px; background: linear-gradient(160deg, #f97316, #fb923c, #fbbf24); display: flex; align-items: center; font-family: 'Inter', sans-serif; overflow: hidden; } .cd3-dots::before { content: '• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •'; position: absolute; inset: 0; font-size: 22px; letter-spacing: 22px; line-height: 38px; opacity: 0.12; color: #fff; overflow: hidden; padding: 20px; } .cd3-content { position: relative; z-index: 2; max-width: 600px; padding: 80px; color: #fff; } .cd3-badge { font-size: 12px; font-weight: 700; letter-spacing: 3px; background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; display: inline-block; margin-bottom: 24px; } .cd3-title { font-size: 40px; font-weight: 800; margin: 0 0 20px; line-height: 1.2; } .cd3-desc { font-size: 16px; line-height: 1.8; opacity: 0.9; margin-bottom: 30px; } .cd3-btns { display: flex; gap: 14px; } .cd3-btn-primary { background: #fff; color: #ea580c; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; } .cd3-btn-secondary { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.5); padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop'
            },
            {
                id: 'cd4', title: 'Gradient + Code Block',
                html: `<section class="cd4-section"><div class="cd4-container"><div class="cd4-left"><div class="cd4-dots"></div><h1 class="cd4-title">Build Something Amazing</h1><p class="cd4-desc">Start creating beautiful websites with our drag-and-drop builder. No coding required.</p><button class="cd4-btn">Start Building</button></div><div class="cd4-right"><div class="cd4-code"><div class="cd4-code-header"><span class="cd4-dot cd4-red"></span><span class="cd4-dot cd4-yellow"></span><span class="cd4-dot cd4-green"></span></div><pre class="cd4-pre"><code>&lt;div class="hero"&gt;\n  &lt;h1&gt;Hello World&lt;/h1&gt;\n  &lt;p&gt;Welcome to your\n     new website&lt;/p&gt;\n  &lt;button&gt;Get Started&lt;/button&gt;\n&lt;/div&gt;</code></pre></div></div></div></section>`,
                css: `.cd4-section { min-height: 480px; font-family: 'Inter', sans-serif; } .cd4-container { display: flex; min-height: 480px; } .cd4-left { flex: 1; background: linear-gradient(135deg, #f97316, #fb923c); padding: 80px 60px; color: #fff; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: center; } .cd4-dots::before { content: '• • • • • • • • • • • • • • • • • • • • • •'; position: absolute; inset: 0; font-size: 20px; letter-spacing: 20px; line-height: 36px; opacity: 0.1; color: #fff; overflow: hidden; padding: 20px; } .cd4-title { font-size: 38px; font-weight: 800; margin: 0 0 16px; line-height: 1.15; position: relative; z-index: 2; } .cd4-desc { font-size: 16px; line-height: 1.7; opacity: 0.9; margin-bottom: 28px; position: relative; z-index: 2; } .cd4-btn { background: #fff; color: #ea580c; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; align-self: flex-start; position: relative; z-index: 2; } .cd4-right { flex: 1; background: #1e293b; padding: 60px; display: flex; align-items: center; justify-content: center; } .cd4-code { background: #0f172a; border-radius: 12px; width: 100%; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); } .cd4-code-header { padding: 12px 16px; display: flex; gap: 8px; background: #1e293b; } .cd4-dot { width: 12px; height: 12px; border-radius: 50%; } .cd4-red { background: #ef4444; } .cd4-yellow { background: #fbbf24; } .cd4-green { background: #22c55e; } .cd4-pre { padding: 24px; margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.8; font-family: 'Courier New', monospace; }`,
                preview: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop'
            },
            {
                id: 'cd5', title: 'Peach Gradient Cards',
                html: `<section class="cd5-section"><div class="cd5-dots"></div><div class="cd5-container"><h2 class="cd5-title">Our Services</h2><p class="cd5-subtitle">What we offer to help you grow</p><div class="cd5-grid"><div class="cd5-card"><div class="cd5-icon">🎯</div><h3>Strategy</h3><p>We craft winning strategies tailored to your goals.</p></div><div class="cd5-card"><div class="cd5-icon">🎨</div><h3>Design</h3><p>Beautiful, modern designs that captivate your audience.</p></div><div class="cd5-card"><div class="cd5-icon">⚡</div><h3>Development</h3><p>Fast, reliable code that brings designs to life.</p></div></div></div></section>`,
                css: `.cd5-section { position: relative; padding: 100px 5%; background: linear-gradient(135deg, #fdba74, #fb923c, #f97316); font-family: 'Inter', sans-serif; overflow: hidden; } .cd5-dots::before { content: '• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •'; position: absolute; inset: 0; font-size: 20px; letter-spacing: 22px; line-height: 38px; opacity: 0.1; color: #fff; overflow: hidden; padding: 20px; } .cd5-container { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; text-align: center; } .cd5-title { font-size: 36px; font-weight: 800; color: #fff; margin: 0 0 12px; } .cd5-subtitle { font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 50px; } .cd5-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } .cd5-card { background: rgba(255,255,255,0.95); padding: 40px 30px; border-radius: 16px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); } .cd5-icon { font-size: 36px; margin-bottom: 16px; } .cd5-card h3 { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 10px; } .cd5-card p { font-size: 15px; color: #64748b; line-height: 1.6; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop'
            },
            {
                id: 'cd6', title: 'Warm CTA Section',
                html: `<section class="cd6-section"><div class="cd6-dots"></div><div class="cd6-container"><div class="cd6-content"><h2 class="cd6-title">Ready to Transform Your Learning?</h2><p class="cd6-desc">Join thousands of creators who are already using our platform to share knowledge and grow their business.</p><div class="cd6-actions"><button class="cd6-btn-primary">Start Free Trial</button><button class="cd6-btn-secondary">See Pricing →</button></div><p class="cd6-note">No credit card required • 14-day free trial</p></div></div></section>`,
                css: `.cd6-section { position: relative; padding: 100px 5%; background: linear-gradient(135deg, #ea580c, #f97316, #fbbf24); font-family: 'Inter', sans-serif; overflow: hidden; } .cd6-dots::before { content: '· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·'; position: absolute; inset: 0; font-size: 26px; letter-spacing: 20px; line-height: 36px; opacity: 0.12; color: #fff; overflow: hidden; padding: 20px; } .cd6-container { position: relative; z-index: 2; max-width: 700px; margin: 0 auto; text-align: center; } .cd6-title { font-size: 40px; font-weight: 800; color: #fff; margin: 0 0 18px; line-height: 1.2; } .cd6-desc { font-size: 17px; color: rgba(255,255,255,0.9); line-height: 1.7; margin-bottom: 35px; } .cd6-actions { display: flex; gap: 14px; justify-content: center; margin-bottom: 20px; } .cd6-btn-primary { background: #fff; color: #ea580c; border: none; padding: 16px 36px; border-radius: 10px; font-weight: 700; font-size: 16px; cursor: pointer; } .cd6-btn-secondary { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.4); padding: 16px 36px; border-radius: 10px; font-weight: 600; font-size: 16px; cursor: pointer; } .cd6-note { font-size: 13px; color: rgba(255,255,255,0.7); }`,
                preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop'
            }
        ],
        placeholder: [
            {
                id: 'ph1', title: 'Text Placeholder - Split',
                html: `<section class="ph1-section"><div class="ph1-container"><div class="ph1-left"><h1 class="ph1-title">LOREM IPSUM IS SIMPLY DUMMY TEXT OF THE PRINTING INDUSTRY</h1><p class="ph1-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p></div><div class="ph1-right"></div></div></section>`,
                css: `.ph1-section { font-family: 'Inter', sans-serif; } .ph1-container { display: flex; min-height: 400px; } .ph1-left { flex: 1; padding: 80px 60px; background: #fff; display: flex; flex-direction: column; justify-content: center; } .ph1-title { font-size: 36px; font-weight: 900; color: #000; margin: 0 0 24px; line-height: 1.2; text-transform: uppercase; } .ph1-desc { font-size: 15px; color: #555; line-height: 1.8; margin: 0; } .ph1-right { flex: 0.8; background: #e5e7eb; }`,
                preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop'
            },
            {
                id: 'ph2', title: 'Centered Placeholder',
                html: `<section class="ph2-section"><div class="ph2-container"><h2 class="ph2-title">PLACEHOLDER</h2></div></section>`,
                css: `.ph2-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; border: 1px dashed #d1d5db; } .ph2-container { max-width: 800px; margin: 0 auto; text-align: center; } .ph2-title { font-size: 28px; font-weight: 700; color: #9ca3af; letter-spacing: 6px; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop'
            },
            {
                id: 'ph3', title: 'Content Placeholder',
                html: `<section class="ph3-section"><div class="ph3-container"><div class="ph3-text"><h1 class="ph3-title">LOREM IPSUM IS SIMPLY DUMMY TEXT OF THE PRINTING INDUSTRY</h1><p class="ph3-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting.</p></div><div class="ph3-placeholder"><div class="ph3-box"></div></div></div></section>`,
                css: `.ph3-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ph3-container { display: flex; gap: 60px; max-width: 1200px; margin: 0 auto; align-items: flex-start; } .ph3-text { flex: 1; } .ph3-title { font-size: 32px; font-weight: 900; color: #000; margin: 0 0 24px; line-height: 1.25; text-transform: uppercase; } .ph3-desc { font-size: 15px; color: #555; line-height: 1.8; margin: 0; } .ph3-placeholder { flex: 0.8; } .ph3-box { width: 100%; height: 300px; background: #f3f4f6; border-radius: 8px; border: 2px dashed #d1d5db; }`,
                preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop'
            }
        ],
        courses: [
            {
                id: 'cl1', title: 'Course Cards Grid',
                html: `<section class="cl1-section"><div class="cl1-container"><div class="cl1-header"><h2 class="cl1-title">OUR COURSES</h2><button class="cl1-view-more">View More</button></div><div class="cl1-grid"><div class="cl1-card"><div class="cl1-img" style="background:#e8f5e9"><div class="cl1-shape" style="border-left:60px solid transparent;border-right:60px solid transparent;border-bottom:80px solid #66bb6a;margin:60px auto 0"></div></div><h3 class="cl1-name">Artificial Intelligence Course</h3><p class="cl1-desc">Master AI fundamentals and applications</p><div class="cl1-price"><span class="cl1-original">₹14,999</span><span class="cl1-sale">₹9,999</span></div></div><div class="cl1-card"><div class="cl1-img" style="background:#1a237e"><div class="cl1-shape" style="width:80px;height:80px;border-radius:50%;background:#f48fb1;margin:50px auto 0"></div></div><h3 class="cl1-name">Medical Coding Course</h3><p class="cl1-desc">Unlock the world of medical coding with our comprehensive course</p><div class="cl1-price"><span class="cl1-original">₹14,999</span><span class="cl1-sale">₹9,999</span></div></div><div class="cl1-card"><div class="cl1-img" style="background:#e0f2f1"><div class="cl1-shape" style="border-left:60px solid transparent;border-right:60px solid transparent;border-bottom:80px solid #4db6ac;margin:60px auto 0"></div></div><h3 class="cl1-name">Devops Course</h3><p class="cl1-desc">Master DevOps tools and practices for faster software delivery</p><div class="cl1-price"><span class="cl1-original">₹14,999</span><span class="cl1-sale">₹9,999</span></div></div></div></div></section>`,
                css: `.cl1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .cl1-container { max-width: 1200px; margin: 0 auto; } .cl1-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; } .cl1-title { font-size: 28px; font-weight: 800; color: #1e293b; margin: 0; letter-spacing: 2px; } .cl1-view-more { background: #fff; color: #1e293b; border: 2px solid #1e293b; padding: 12px 28px; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer; } .cl1-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; } .cl1-card { background: #fff; border-radius: 12px; overflow: hidden; } .cl1-img { height: 240px; display: flex; align-items: flex-start; justify-content: center; } .cl1-shape { display: block; } .cl1-name { font-size: 18px; font-weight: 700; color: #1e293b; margin: 16px 0 8px; padding: 0 4px; } .cl1-desc { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0 0 12px; padding: 0 4px; } .cl1-price { padding: 0 4px 16px; } .cl1-original { font-size: 14px; color: #94a3b8; text-decoration: line-through; margin-right: 8px; } .cl1-sale { font-size: 16px; font-weight: 700; color: #ef4444; }`,
                preview: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&h=200&fit=crop'
            },
            {
                id: 'cl2', title: 'Popular Courses',
                html: `<section class="cl2-section"><div class="cl2-container"><h2 class="cl2-title">Our Popular Courses</h2><p class="cl2-subtitle">Explore our most enrolled courses by students worldwide</p><div class="cl2-grid"><div class="cl2-card"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80" alt="Course" /><div class="cl2-badge">BESTSELLER</div><div class="cl2-info"><h3>English Speaking</h3><p class="cl2-author">By Sarah Johnson</p><div class="cl2-meta"><span class="cl2-rating">★ 4.8</span><span class="cl2-students">2.5K students</span></div><div class="cl2-price"><span class="cl2-original">₹4,999</span><span class="cl2-sale">₹1,999</span></div></div></div><div class="cl2-card"><img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80" alt="Course" /><div class="cl2-badge cl2-new">NEW</div><div class="cl2-info"><h3>Financial Planning</h3><p class="cl2-author">By Michael Chen</p><div class="cl2-meta"><span class="cl2-rating">★ 4.6</span><span class="cl2-students">1.8K students</span></div><div class="cl2-price"><span class="cl2-original">₹5,999</span><span class="cl2-sale">₹2,999</span></div></div></div><div class="cl2-card"><img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80" alt="Course" /><div class="cl2-badge">POPULAR</div><div class="cl2-info"><h3>Web Development</h3><p class="cl2-author">By David Park</p><div class="cl2-meta"><span class="cl2-rating">★ 4.9</span><span class="cl2-students">5.2K students</span></div><div class="cl2-price"><span class="cl2-original">₹7,999</span><span class="cl2-sale">₹3,999</span></div></div></div></div></div></section>`,
                css: `.cl2-section { padding: 100px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .cl2-container { max-width: 1200px; margin: 0 auto; text-align: center; } .cl2-title { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0 0 12px; } .cl2-subtitle { font-size: 16px; color: #64748b; margin-bottom: 50px; } .cl2-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; text-align: left; } .cl2-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: transform 0.3s; position: relative; } .cl2-card:hover { transform: translateY(-4px); } .cl2-card img { width: 100%; height: 200px; object-fit: cover; } .cl2-badge { position: absolute; top: 12px; left: 12px; background: #f59e0b; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; letter-spacing: 1px; } .cl2-new { background: #22c55e; } .cl2-info { padding: 20px; } .cl2-info h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 6px; } .cl2-author { font-size: 13px; color: #94a3b8; margin: 0 0 12px; } .cl2-meta { display: flex; gap: 16px; margin-bottom: 14px; } .cl2-rating { font-size: 13px; color: #f59e0b; font-weight: 600; } .cl2-students { font-size: 13px; color: #64748b; } .cl2-price { } .cl2-original { font-size: 14px; color: #94a3b8; text-decoration: line-through; margin-right: 8px; } .cl2-sale { font-size: 18px; font-weight: 700; color: #4f46e5; }`,
                preview: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&h=200&fit=crop'
            },
            {
                id: 'cl3', title: 'Course Categories',
                html: `<section class="cl3-section"><div class="cl3-container"><h2 class="cl3-title">Our Top Courses</h2><div class="cl3-categories"><span class="cl3-cat cl3-active">All</span><span class="cl3-cat">Design</span><span class="cl3-cat">Development</span><span class="cl3-cat">Marketing</span><span class="cl3-cat">Business</span></div><div class="cl3-grid"><div class="cl3-card"><img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80" alt="Course" /><div class="cl3-info"><span class="cl3-tag">Design</span><h3>UI/UX Design Masterclass</h3><div class="cl3-bottom"><span class="cl3-price">₹3,999</span><span class="cl3-lessons">24 Lessons</span></div></div></div><div class="cl3-card"><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80" alt="Course" /><div class="cl3-info"><span class="cl3-tag cl3-tag-dev">Development</span><h3>React JS Complete Guide</h3><div class="cl3-bottom"><span class="cl3-price">₹4,999</span><span class="cl3-lessons">36 Lessons</span></div></div></div><div class="cl3-card"><img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=80" alt="Course" /><div class="cl3-info"><span class="cl3-tag cl3-tag-mkt">Marketing</span><h3>Digital Marketing Pro</h3><div class="cl3-bottom"><span class="cl3-price">₹2,999</span><span class="cl3-lessons">18 Lessons</span></div></div></div><div class="cl3-card"><img src="https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400&q=80" alt="Course" /><div class="cl3-info"><span class="cl3-tag cl3-tag-biz">Business</span><h3>Startup Fundamentals</h3><div class="cl3-bottom"><span class="cl3-price">₹5,999</span><span class="cl3-lessons">30 Lessons</span></div></div></div></div></div></section>`,
                css: `.cl3-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .cl3-container { max-width: 1200px; margin: 0 auto; } .cl3-title { font-size: 36px; font-weight: 800; color: #1e293b; text-align: center; margin: 0 0 30px; } .cl3-categories { display: flex; justify-content: center; gap: 12px; margin-bottom: 50px; } .cl3-cat { padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; color: #64748b; background: #f1f5f9; cursor: pointer; transition: all 0.2s; } .cl3-cat.cl3-active { background: #4f46e5; color: #fff; } .cl3-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; } .cl3-card { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; transition: box-shadow 0.3s; } .cl3-card:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.08); } .cl3-card img { width: 100%; height: 180px; object-fit: cover; } .cl3-info { padding: 16px; } .cl3-tag { font-size: 11px; font-weight: 700; color: #4f46e5; background: #eef2ff; padding: 4px 10px; border-radius: 4px; display: inline-block; margin-bottom: 8px; } .cl3-tag-dev { color: #059669; background: #ecfdf5; } .cl3-tag-mkt { color: #d97706; background: #fffbeb; } .cl3-tag-biz { color: #dc2626; background: #fef2f2; } .cl3-info h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 12px; } .cl3-bottom { display: flex; justify-content: space-between; align-items: center; } .cl3-price { font-size: 16px; font-weight: 700; color: #4f46e5; } .cl3-lessons { font-size: 13px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=200&fit=crop'
            },
            {
                id: 'cl4', title: 'Horizontal Course List',
                html: `<section class="cl4-section"><div class="cl4-container"><h2 class="cl4-title">Explore My Courses</h2><div class="cl4-list"><div class="cl4-item"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80" alt="Course" /><div class="cl4-info"><h3>Complete Python Bootcamp</h3><p>Learn Python from scratch to advanced concepts with hands-on projects</p><div class="cl4-meta"><span class="cl4-duration">⏱ 42 Hours</span><span class="cl4-level">📊 Beginner</span></div></div><div class="cl4-action"><div class="cl4-price">₹4,999</div><button class="cl4-btn">Enroll Now</button></div></div><div class="cl4-item"><img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&q=80" alt="Course" /><div class="cl4-info"><h3>Full Stack Web Development</h3><p>Master HTML, CSS, JavaScript, React, Node.js and MongoDB</p><div class="cl4-meta"><span class="cl4-duration">⏱ 64 Hours</span><span class="cl4-level">📊 Intermediate</span></div></div><div class="cl4-action"><div class="cl4-price">₹7,999</div><button class="cl4-btn">Enroll Now</button></div></div><div class="cl4-item"><img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&q=80" alt="Course" /><div class="cl4-info"><h3>Data Science & Analytics</h3><p>Analyze data, build models and create visualizations</p><div class="cl4-meta"><span class="cl4-duration">⏱ 38 Hours</span><span class="cl4-level">📊 Advanced</span></div></div><div class="cl4-action"><div class="cl4-price">₹5,999</div><button class="cl4-btn">Enroll Now</button></div></div></div></div></section>`,
                css: `.cl4-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .cl4-container { max-width: 1000px; margin: 0 auto; } .cl4-title { font-size: 32px; font-weight: 800; color: #1e293b; text-align: center; margin: 0 0 40px; } .cl4-list { display: flex; flex-direction: column; gap: 20px; } .cl4-item { display: flex; align-items: center; gap: 24px; background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.04); transition: box-shadow 0.3s; } .cl4-item:hover { box-shadow: 0 8px 25px rgba(0,0,0,0.08); } .cl4-item img { width: 160px; height: 110px; object-fit: cover; border-radius: 8px; flex-shrink: 0; } .cl4-info { flex: 1; } .cl4-info h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 6px; } .cl4-info p { font-size: 14px; color: #64748b; margin: 0 0 10px; line-height: 1.5; } .cl4-meta { display: flex; gap: 16px; } .cl4-duration, .cl4-level { font-size: 13px; color: #94a3b8; } .cl4-action { text-align: center; flex-shrink: 0; } .cl4-price { font-size: 20px; font-weight: 800; color: #4f46e5; margin-bottom: 10px; } .cl4-btn { background: #4f46e5; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; white-space: nowrap; }`,
                preview: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&h=200&fit=crop'
            },
            {
                id: 'cl5', title: 'Featured Course Banner',
                html: `<section class="cl5-section"><div class="cl5-container"><div class="cl5-featured"><div class="cl5-img"><img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80" alt="Featured Course" /></div><div class="cl5-info"><span class="cl5-badge">FEATURED COURSE</span><h2 class="cl5-title">Complete Digital Marketing Masterclass</h2><p class="cl5-desc">Learn SEO, Social Media Marketing, Google Ads, Analytics and more. This comprehensive course covers everything you need to become a digital marketing expert.</p><div class="cl5-stats"><div class="cl5-stat"><strong>48+</strong><span>Hours</span></div><div class="cl5-stat"><strong>120+</strong><span>Lessons</span></div><div class="cl5-stat"><strong>4.9</strong><span>Rating</span></div></div><div class="cl5-price-row"><div><span class="cl5-original">₹12,999</span><span class="cl5-sale">₹5,999</span></div><button class="cl5-btn">Enroll Now →</button></div></div></div></div></section>`,
                css: `.cl5-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .cl5-container { max-width: 1100px; margin: 0 auto; } .cl5-featured { display: flex; gap: 50px; align-items: center; background: #f8fafc; border-radius: 20px; overflow: hidden; } .cl5-img { flex: 1; } .cl5-img img { width: 100%; height: 400px; object-fit: cover; } .cl5-info { flex: 1; padding: 40px 40px 40px 0; } .cl5-badge { font-size: 12px; font-weight: 700; color: #4f46e5; letter-spacing: 2px; background: #eef2ff; padding: 6px 14px; border-radius: 4px; display: inline-block; margin-bottom: 16px; } .cl5-title { font-size: 28px; font-weight: 800; color: #1e293b; margin: 0 0 16px; line-height: 1.3; } .cl5-desc { font-size: 15px; color: #64748b; line-height: 1.7; margin-bottom: 24px; } .cl5-stats { display: flex; gap: 30px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0; } .cl5-stat strong { display: block; font-size: 22px; color: #1e293b; } .cl5-stat span { font-size: 13px; color: #94a3b8; } .cl5-price-row { display: flex; justify-content: space-between; align-items: center; } .cl5-original { font-size: 16px; color: #94a3b8; text-decoration: line-through; margin-right: 10px; } .cl5-sale { font-size: 24px; font-weight: 800; color: #4f46e5; } .cl5-btn { background: #4f46e5; color: #fff; border: none; padding: 14px 30px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=200&fit=crop'
            },
            {
                id: 'cl6', title: 'Colored Course Cards',
                html: `<section class="cl6-section"><div class="cl6-container"><h2 class="cl6-title">Start Your Fitness Journey</h2><p class="cl6-subtitle">Choose from our curated collection of courses</p><div class="cl6-grid"><div class="cl6-card" style="border-top:4px solid #ef4444"><div class="cl6-icon">🧘</div><h3>Yoga Basics</h3><p>Learn foundational yoga poses and breathing techniques</p><div class="cl6-footer"><span class="cl6-price">₹1,999</span><span class="cl6-lessons">12 Lessons</span></div></div><div class="cl6-card" style="border-top:4px solid #3b82f6"><div class="cl6-icon">💪</div><h3>Strength Training</h3><p>Build muscle and increase your overall fitness level</p><div class="cl6-footer"><span class="cl6-price">₹2,499</span><span class="cl6-lessons">18 Lessons</span></div></div><div class="cl6-card" style="border-top:4px solid #22c55e"><div class="cl6-icon">🏃</div><h3>Cardio Mastery</h3><p>Boost your endurance with proven cardio routines</p><div class="cl6-footer"><span class="cl6-price">₹1,499</span><span class="cl6-lessons">10 Lessons</span></div></div></div></div></section>`,
                css: `.cl6-section { padding: 100px 5%; background: #fefce8; font-family: 'Inter', sans-serif; } .cl6-container { max-width: 1100px; margin: 0 auto; text-align: center; } .cl6-title { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0 0 12px; } .cl6-subtitle { font-size: 16px; color: #64748b; margin-bottom: 50px; } .cl6-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; text-align: left; } .cl6-card { background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); transition: transform 0.3s; } .cl6-card:hover { transform: translateY(-4px); } .cl6-icon { font-size: 40px; margin-bottom: 16px; } .cl6-card h3 { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 8px; } .cl6-card p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 20px; } .cl6-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #f1f5f9; } .cl6-price { font-size: 18px; font-weight: 700; color: #4f46e5; } .cl6-lessons { font-size: 13px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=200&fit=crop'
            }
        ],
        forms: [
            {
                id: 'fm1', title: 'Contact Us - Image Left',
                html: `<section class="fm1-section"><div class="fm1-container"><div class="fm1-img"><img src="https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&q=80" alt="Contact" /></div><div class="fm1-form"><h2 class="fm1-title">Contact Us</h2><div class="fm1-field"><label>Name: <span>*</span></label><input type="text" placeholder="Name" /></div><div class="fm1-field"><label>Email: <span>*</span></label><input type="email" placeholder="Email" /></div><div class="fm1-field"><label>Mobile: <span>*</span></label><input type="tel" placeholder="Mobile" /></div><div class="fm1-field"><label>Message: <span>*</span></label><textarea placeholder="Message" rows="4"></textarea></div><button class="fm1-btn">SUBMIT</button></div></div></section>`,
                css: `.fm1-section { padding: 0; font-family: 'Inter', sans-serif; } .fm1-container { display: flex; min-height: 500px; } .fm1-img { flex: 1; } .fm1-img img { width: 100%; height: 100%; object-fit: cover; } .fm1-form { flex: 1; padding: 60px 50px; background: #fff; } .fm1-title { font-size: 32px; font-weight: 700; color: #1e293b; margin: 0 0 30px; } .fm1-field { margin-bottom: 20px; } .fm1-field label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px; } .fm1-field label span { color: #ef4444; } .fm1-field input, .fm1-field textarea { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s; box-sizing: border-box; } .fm1-field input:focus, .fm1-field textarea:focus { border-color: #4f46e5; } .fm1-field textarea { resize: vertical; } .fm1-btn { background: #1e293b; color: #fff; border: none; padding: 14px 40px; font-size: 14px; font-weight: 700; letter-spacing: 2px; cursor: pointer; margin-top: 10px; }`,
                preview: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=300&h=200&fit=crop'
            },
            {
                id: 'fm2', title: 'Simple Contact Form',
                html: `<section class="fm2-section"><div class="fm2-container"><h2 class="fm2-title">Contact Us</h2><p class="fm2-subtitle">We'd love to hear from you. Send us a message!</p><div class="fm2-form"><div class="fm2-row"><div class="fm2-field"><label>First Name</label><input type="text" placeholder="John" /></div><div class="fm2-field"><label>Last Name</label><input type="text" placeholder="Doe" /></div></div><div class="fm2-field"><label>Email Address</label><input type="email" placeholder="john@example.com" /></div><div class="fm2-field"><label>Subject</label><input type="text" placeholder="How can we help?" /></div><div class="fm2-field"><label>Message</label><textarea placeholder="Your message..." rows="5"></textarea></div><button class="fm2-btn">Send Message</button></div></div></section>`,
                css: `.fm2-section { padding: 100px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .fm2-container { max-width: 650px; margin: 0 auto; background: #fff; padding: 50px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); } .fm2-title { font-size: 32px; font-weight: 800; color: #1e293b; margin: 0 0 8px; text-align: center; } .fm2-subtitle { font-size: 16px; color: #64748b; text-align: center; margin-bottom: 36px; } .fm2-row { display: flex; gap: 16px; } .fm2-row .fm2-field { flex: 1; } .fm2-field { margin-bottom: 20px; } .fm2-field label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px; } .fm2-field input, .fm2-field textarea { width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s; box-sizing: border-box; } .fm2-field input:focus, .fm2-field textarea:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); } .fm2-field textarea { resize: vertical; } .fm2-btn { width: 100%; background: #4f46e5; color: #fff; border: none; padding: 14px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s; } .fm2-btn:hover { background: #4338ca; }`,
                preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop'
            },
            {
                id: 'fm3', title: 'Dark Split Contact',
                html: `<section class="fm3-section"><div class="fm3-container"><div class="fm3-left"><h2 class="fm3-title">Get in Touch</h2><p class="fm3-desc">Have questions? We're here to help. Fill out the form and we'll respond within 24 hours.</p><div class="fm3-info"><div class="fm3-info-item"><span class="fm3-icon">📧</span><div><strong>Email</strong><p>hello@yourbrand.com</p></div></div><div class="fm3-info-item"><span class="fm3-icon">📞</span><div><strong>Phone</strong><p>(123) 456-7890</p></div></div><div class="fm3-info-item"><span class="fm3-icon">📍</span><div><strong>Address</strong><p>123 Business Ave, City</p></div></div></div></div><div class="fm3-right"><div class="fm3-field"><input type="text" placeholder="Your Name" /></div><div class="fm3-field"><input type="email" placeholder="Email Address" /></div><div class="fm3-field"><input type="tel" placeholder="Phone Number" /></div><div class="fm3-field"><textarea placeholder="Your Message" rows="5"></textarea></div><button class="fm3-btn">Send Message →</button></div></div></section>`,
                css: `.fm3-section { padding: 0; font-family: 'Inter', sans-serif; } .fm3-container { display: flex; min-height: 550px; } .fm3-left { flex: 1; background: linear-gradient(135deg, #1e293b, #334155); padding: 60px 50px; color: #fff; display: flex; flex-direction: column; justify-content: center; } .fm3-title { font-size: 36px; font-weight: 800; margin: 0 0 16px; } .fm3-desc { font-size: 16px; color: #94a3b8; line-height: 1.7; margin-bottom: 40px; } .fm3-info { display: flex; flex-direction: column; gap: 24px; } .fm3-info-item { display: flex; align-items: flex-start; gap: 14px; } .fm3-icon { font-size: 24px; } .fm3-info-item strong { display: block; font-size: 15px; color: #fff; margin-bottom: 2px; } .fm3-info-item p { font-size: 14px; color: #94a3b8; margin: 0; } .fm3-right { flex: 1; padding: 60px 50px; background: #fff; display: flex; flex-direction: column; justify-content: center; } .fm3-field { margin-bottom: 18px; } .fm3-field input, .fm3-field textarea { width: 100%; padding: 14px 18px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 15px; font-family: inherit; outline: none; box-sizing: border-box; } .fm3-field input:focus, .fm3-field textarea:focus { border-color: #4f46e5; } .fm3-field textarea { resize: vertical; } .fm3-btn { background: #4f46e5; color: #fff; border: none; padding: 16px 36px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; align-self: flex-start; }`,
                preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop'
            },
            {
                id: 'fm4', title: 'Newsletter Signup',
                html: `<section class="fm4-section"><div class="fm4-container"><div class="fm4-content"><h2 class="fm4-title">Stay Updated</h2><p class="fm4-desc">Subscribe to our newsletter and never miss an update. Get the latest courses, tips, and exclusive offers delivered to your inbox.</p><div class="fm4-form"><input type="email" placeholder="Enter your email address" /><button class="fm4-btn">Subscribe</button></div><p class="fm4-note">We respect your privacy. Unsubscribe at any time.</p></div></div></section>`,
                css: `.fm4-section { padding: 100px 5%; background: linear-gradient(135deg, #667eea, #764ba2); font-family: 'Inter', sans-serif; } .fm4-container { max-width: 600px; margin: 0 auto; text-align: center; color: #fff; } .fm4-title { font-size: 36px; font-weight: 800; margin: 0 0 16px; } .fm4-desc { font-size: 16px; line-height: 1.7; opacity: 0.9; margin-bottom: 36px; } .fm4-form { display: flex; gap: 12px; margin-bottom: 16px; } .fm4-form input { flex: 1; padding: 16px 20px; border: none; border-radius: 10px; font-size: 15px; font-family: inherit; outline: none; } .fm4-btn { background: #1e293b; color: #fff; border: none; padding: 16px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; white-space: nowrap; } .fm4-note { font-size: 13px; opacity: 0.7; }`,
                preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop'
            }
        ],
        curriculum: [
            {
                id: 'cu1', title: 'Course Curriculum',
                html: `<section class="cu1-section"><div class="cu1-container"><h2 class="cu1-title">Course Curriculum</h2><div class="cu1-modules"><div class="cu1-module"><div class="cu1-module-header"><span class="cu1-arrow">▶</span><h3>Module 1: Introduction & Setup</h3><span class="cu1-count">5 Lessons</span></div><div class="cu1-lessons"><div class="cu1-lesson"><span class="cu1-check">✓</span>Welcome to the Course<span class="cu1-dur">5:30</span></div><div class="cu1-lesson"><span class="cu1-check">✓</span>Setting Up Your Environment<span class="cu1-dur">12:00</span></div><div class="cu1-lesson"><span class="cu1-lock">🔒</span>Your First Project<span class="cu1-dur">18:45</span></div></div></div><div class="cu1-module"><div class="cu1-module-header"><span class="cu1-arrow">▶</span><h3>Module 2: Core Concepts</h3><span class="cu1-count">8 Lessons</span></div></div><div class="cu1-module"><div class="cu1-module-header"><span class="cu1-arrow">▶</span><h3>Module 3: Advanced Topics</h3><span class="cu1-count">6 Lessons</span></div></div><div class="cu1-module"><div class="cu1-module-header"><span class="cu1-arrow">▶</span><h3>Module 4: Final Project</h3><span class="cu1-count">4 Lessons</span></div></div></div></div></section>`,
                css: `.cu1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .cu1-container { max-width: 800px; margin: 0 auto; } .cu1-title { font-size: 32px; font-weight: 800; color: #1e293b; margin: 0 0 30px; } .cu1-modules { display: flex; flex-direction: column; gap: 2px; } .cu1-module { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; } .cu1-module-header { display: flex; align-items: center; gap: 12px; padding: 18px 20px; background: #f8fafc; cursor: pointer; } .cu1-arrow { font-size: 12px; color: #64748b; } .cu1-module-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; flex: 1; } .cu1-count { font-size: 13px; color: #94a3b8; font-weight: 500; } .cu1-lessons { padding: 0; } .cu1-lesson { display: flex; align-items: center; gap: 12px; padding: 14px 20px 14px 44px; border-top: 1px solid #f1f5f9; font-size: 14px; color: #475569; } .cu1-check { color: #22c55e; font-size: 14px; } .cu1-lock { font-size: 14px; } .cu1-dur { margin-left: auto; font-size: 13px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&h=200&fit=crop'
            },
            {
                id: 'cu2', title: 'Course Content - Blue',
                html: `<section class="cu2-section"><div class="cu2-container"><div class="cu2-header"><h2>Course Content</h2><p>4 Modules • 23 Lessons • 12h 30m total length</p></div><div class="cu2-modules"><div class="cu2-mod"><div class="cu2-mod-top"><span>▼</span><h3>Getting Started</h3><span class="cu2-meta">5 Lessons • 2h 15m</span></div><div class="cu2-mod-list"><div class="cu2-item"><span>📹</span>Course Overview<span class="cu2-time">10:30</span></div><div class="cu2-item"><span>📹</span>Installing Required Tools<span class="cu2-time">15:00</span></div><div class="cu2-item"><span>📹</span>Understanding the Basics<span class="cu2-time">22:45</span></div></div></div><div class="cu2-mod"><div class="cu2-mod-top"><span>▶</span><h3>Intermediate Concepts</h3><span class="cu2-meta">8 Lessons • 4h 20m</span></div></div><div class="cu2-mod"><div class="cu2-mod-top"><span>▶</span><h3>Advanced Techniques</h3><span class="cu2-meta">6 Lessons • 3h 45m</span></div></div><div class="cu2-mod"><div class="cu2-mod-top"><span>▶</span><h3>Final Project & Certificate</h3><span class="cu2-meta">4 Lessons • 2h 10m</span></div></div></div></div></section>`,
                css: `.cu2-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .cu2-container { max-width: 800px; margin: 0 auto; } .cu2-header { background: #1e40af; color: #fff; padding: 24px 28px; border-radius: 12px 12px 0 0; } .cu2-header h2 { font-size: 24px; font-weight: 800; margin: 0 0 6px; } .cu2-header p { font-size: 14px; opacity: 0.8; margin: 0; } .cu2-modules { border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; overflow: hidden; } .cu2-mod { border-bottom: 1px solid #e2e8f0; } .cu2-mod:last-child { border-bottom: none; } .cu2-mod-top { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: #f8fafc; cursor: pointer; } .cu2-mod-top span:first-child { font-size: 12px; color: #64748b; } .cu2-mod-top h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; flex: 1; } .cu2-meta { font-size: 13px; color: #94a3b8; } .cu2-mod-list { } .cu2-item { display: flex; align-items: center; gap: 10px; padding: 12px 20px 12px 44px; font-size: 14px; color: #475569; border-top: 1px solid #f1f5f9; } .cu2-time { margin-left: auto; font-size: 13px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=200&fit=crop'
            },
            {
                id: 'cu3', title: 'Syllabus Overview',
                html: `<section class="cu3-section"><div class="cu3-container"><h2 class="cu3-title">Syllabus</h2><p class="cu3-subtitle">Everything you'll learn in this comprehensive course</p><div class="cu3-list"><div class="cu3-item"><div class="cu3-num">01</div><div class="cu3-info"><h3>Introduction to the Course</h3><p>Overview of course structure, objectives, and expected outcomes.</p><span class="cu3-details">3 Lessons • 45 min</span></div></div><div class="cu3-item"><div class="cu3-num">02</div><div class="cu3-info"><h3>Fundamentals & Core Concepts</h3><p>Deep dive into the essential building blocks you need to master.</p><span class="cu3-details">6 Lessons • 2h 30m</span></div></div><div class="cu3-item"><div class="cu3-num">03</div><div class="cu3-info"><h3>Hands-on Projects</h3><p>Apply what you've learned through real-world projects and exercises.</p><span class="cu3-details">5 Lessons • 3h 15m</span></div></div><div class="cu3-item"><div class="cu3-num">04</div><div class="cu3-info"><h3>Advanced Strategies</h3><p>Take your skills to the next level with advanced techniques.</p><span class="cu3-details">4 Lessons • 2h</span></div></div></div></div></section>`,
                css: `.cu3-section { padding: 100px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .cu3-container { max-width: 800px; margin: 0 auto; } .cu3-title { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0 0 10px; text-align: center; } .cu3-subtitle { font-size: 16px; color: #64748b; text-align: center; margin-bottom: 50px; } .cu3-list { display: flex; flex-direction: column; gap: 20px; } .cu3-item { display: flex; gap: 20px; background: #fff; padding: 28px; border-radius: 12px; border: 1px solid #e2e8f0; transition: box-shadow 0.3s; } .cu3-item:hover { box-shadow: 0 8px 25px rgba(0,0,0,0.06); } .cu3-num { font-size: 28px; font-weight: 900; color: #4f46e5; min-width: 50px; } .cu3-info { flex: 1; } .cu3-info h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 8px; } .cu3-info p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 10px; } .cu3-details { font-size: 13px; color: #94a3b8; font-weight: 500; }`,
                preview: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&h=200&fit=crop'
            },
            {
                id: 'cu4', title: 'Training Plan Overview',
                html: `<section class="cu4-section"><div class="cu4-container"><h2 class="cu4-title">Training Plan Overview</h2><p class="cu4-desc">Course Curriculum 5 will be displayed here.</p><div class="cu4-timeline"><div class="cu4-step"><div class="cu4-dot"></div><div class="cu4-step-info"><h3>Week 1-2: Foundation</h3><p>Build a solid understanding of core concepts and terminology</p></div></div><div class="cu4-step"><div class="cu4-dot"></div><div class="cu4-step-info"><h3>Week 3-4: Implementation</h3><p>Start building real projects with guided exercises</p></div></div><div class="cu4-step"><div class="cu4-dot"></div><div class="cu4-step-info"><h3>Week 5-6: Advanced Topics</h3><p>Master advanced patterns and best practices</p></div></div><div class="cu4-step"><div class="cu4-dot cu4-dot-last"></div><div class="cu4-step-info"><h3>Week 7-8: Capstone Project</h3><p>Complete your final project and earn your certificate</p></div></div></div></div></section>`,
                css: `.cu4-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .cu4-container { max-width: 700px; margin: 0 auto; text-align: center; } .cu4-title { font-size: 32px; font-weight: 800; color: #1e293b; margin: 0 0 12px; } .cu4-desc { font-size: 16px; color: #64748b; margin-bottom: 50px; } .cu4-timeline { text-align: left; position: relative; padding-left: 40px; } .cu4-timeline::before { content: ''; position: absolute; left: 11px; top: 8px; bottom: 8px; width: 2px; background: #e2e8f0; } .cu4-step { position: relative; margin-bottom: 36px; } .cu4-step:last-child { margin-bottom: 0; } .cu4-dot { position: absolute; left: -40px; top: 4px; width: 24px; height: 24px; border-radius: 50%; background: #4f46e5; border: 4px solid #eef2ff; } .cu4-dot-last { background: #22c55e; border-color: #dcfce7; } .cu4-step-info h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 6px; } .cu4-step-info p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=200&fit=crop'
            },
            {
                id: 'cu5', title: 'What You Will Learn',
                html: `<section class="cu5-section"><div class="cu5-container"><h2 class="cu5-title">What You'll Learn</h2><div class="cu5-grid"><div class="cu5-item"><span class="cu5-check">✅</span><p>Build complete web applications from scratch</p></div><div class="cu5-item"><span class="cu5-check">✅</span><p>Understand modern JavaScript ES6+ features</p></div><div class="cu5-item"><span class="cu5-check">✅</span><p>Master React components, hooks, and state management</p></div><div class="cu5-item"><span class="cu5-check">✅</span><p>Work with REST APIs and database integration</p></div><div class="cu5-item"><span class="cu5-check">✅</span><p>Deploy applications to production servers</p></div><div class="cu5-item"><span class="cu5-check">✅</span><p>Write clean, maintainable, and tested code</p></div><div class="cu5-item"><span class="cu5-check">✅</span><p>Implement authentication and authorization</p></div><div class="cu5-item"><span class="cu5-check">✅</span><p>Create responsive designs for all devices</p></div></div></div></section>`,
                css: `.cu5-section { padding: 80px 5%; background: #fffbeb; border: 1px solid #fde68a; font-family: 'Inter', sans-serif; } .cu5-container { max-width: 900px; margin: 0 auto; } .cu5-title { font-size: 28px; font-weight: 800; color: #1e293b; margin: 0 0 30px; } .cu5-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; } .cu5-item { display: flex; align-items: flex-start; gap: 12px; } .cu5-check { font-size: 18px; flex-shrink: 0; } .cu5-item p { font-size: 15px; color: #374151; line-height: 1.5; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=200&fit=crop'
            },
            {
                id: 'cu6', title: 'Course Outline - Dark',
                html: `<section class="cu6-section"><div class="cu6-container"><h2 class="cu6-title">Course Outline</h2><p class="cu6-subtitle">Comprehensive curriculum designed by industry experts</p><div class="cu6-modules"><div class="cu6-mod"><div class="cu6-mod-head"><div class="cu6-mod-left"><span class="cu6-badge">Module 1</span><h3>Getting Started</h3></div><span class="cu6-dur">2h 15m</span></div></div><div class="cu6-mod"><div class="cu6-mod-head"><div class="cu6-mod-left"><span class="cu6-badge">Module 2</span><h3>Core Fundamentals</h3></div><span class="cu6-dur">4h 30m</span></div></div><div class="cu6-mod"><div class="cu6-mod-head"><div class="cu6-mod-left"><span class="cu6-badge">Module 3</span><h3>Building Projects</h3></div><span class="cu6-dur">5h 45m</span></div></div><div class="cu6-mod"><div class="cu6-mod-head"><div class="cu6-mod-left"><span class="cu6-badge">Module 4</span><h3>Advanced Patterns</h3></div><span class="cu6-dur">3h 20m</span></div></div><div class="cu6-mod"><div class="cu6-mod-head"><div class="cu6-mod-left"><span class="cu6-badge cu6-green">Module 5</span><h3>Deployment & Beyond</h3></div><span class="cu6-dur">2h 50m</span></div></div></div></div></section>`,
                css: `.cu6-section { padding: 100px 5%; background: #0f172a; font-family: 'Inter', sans-serif; } .cu6-container { max-width: 800px; margin: 0 auto; } .cu6-title { font-size: 36px; font-weight: 800; color: #fff; text-align: center; margin: 0 0 10px; } .cu6-subtitle { font-size: 16px; color: #94a3b8; text-align: center; margin-bottom: 50px; } .cu6-modules { display: flex; flex-direction: column; gap: 12px; } .cu6-mod { background: #1e293b; border-radius: 10px; overflow: hidden; } .cu6-mod-head { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; cursor: pointer; } .cu6-mod-left { display: flex; align-items: center; gap: 14px; } .cu6-badge { font-size: 11px; font-weight: 700; color: #fff; background: #4f46e5; padding: 4px 12px; border-radius: 4px; letter-spacing: 1px; } .cu6-green { background: #22c55e; } .cu6-mod-head h3 { font-size: 16px; font-weight: 600; color: #e2e8f0; margin: 0; } .cu6-dur { font-size: 14px; color: #64748b; }`,
                preview: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&h=200&fit=crop'
            }
        ],
        feedback: [
            {
                id: 'fb1', title: 'Star Rating Cards',
                html: `<section class="fb1-section"><div class="fb1-container"><h2 class="fb1-title">Reviews and Testimonials</h2><div class="fb1-summary"><div class="fb1-big-rating"><span class="fb1-num">4.8</span><div class="fb1-stars">★★★★★</div><p>Based on 2,450 reviews</p></div></div><div class="fb1-grid"><div class="fb1-card"><div class="fb1-card-stars">★★★★★</div><p class="fb1-quote">"This course completely transformed my career. The instructor explains complex topics in such a simple way!"</p><div class="fb1-author"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" alt="Student" /><div><strong>Priya Sharma</strong><span>Web Developer</span></div></div></div><div class="fb1-card"><div class="fb1-card-stars">★★★★★</div><p class="fb1-quote">"Best investment in my education. The projects were hands-on and practical. Highly recommend!"</p><div class="fb1-author"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" alt="Student" /><div><strong>Rahul Patel</strong><span>Software Engineer</span></div></div></div><div class="fb1-card"><div class="fb1-card-stars">★★★★☆</div><p class="fb1-quote">"Great content and well-structured modules. The community support is fantastic too."</p><div class="fb1-author"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop" alt="Student" /><div><strong>Ananya Desai</strong><span>UI/UX Designer</span></div></div></div></div></div></section>`,
                css: `.fb1-section { padding: 100px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .fb1-container { max-width: 1100px; margin: 0 auto; } .fb1-title { font-size: 32px; font-weight: 800; color: #1e293b; text-align: center; margin: 0 0 30px; } .fb1-summary { text-align: center; margin-bottom: 40px; } .fb1-num { font-size: 56px; font-weight: 900; color: #1e293b; } .fb1-stars { font-size: 24px; color: #f59e0b; margin-bottom: 4px; } .fb1-summary p { font-size: 14px; color: #94a3b8; } .fb1-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } .fb1-card { background: #fff; padding: 28px; border-radius: 12px; border: 1px solid #e2e8f0; } .fb1-card-stars { font-size: 18px; color: #f59e0b; margin-bottom: 14px; } .fb1-quote { font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 20px; font-style: italic; } .fb1-author { display: flex; align-items: center; gap: 12px; } .fb1-author img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; } .fb1-author strong { display: block; font-size: 14px; color: #1e293b; } .fb1-author span { font-size: 12px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=300&h=200&fit=crop'
            },
            {
                id: 'fb2', title: 'Rating with Progress',
                html: `<section class="fb2-section"><div class="fb2-container"><h2 class="fb2-title">Course Feedback</h2><div class="fb2-layout"><div class="fb2-left"><div class="fb2-big"><span class="fb2-score">4.3</span><div class="fb2-stars">★★★★☆</div><p>Course Rating</p></div></div><div class="fb2-right"><div class="fb2-bar"><span class="fb2-label">5 ★</span><div class="fb2-track"><div class="fb2-fill" style="width:72%"></div></div><span class="fb2-pct">72%</span></div><div class="fb2-bar"><span class="fb2-label">4 ★</span><div class="fb2-track"><div class="fb2-fill" style="width:18%"></div></div><span class="fb2-pct">18%</span></div><div class="fb2-bar"><span class="fb2-label">3 ★</span><div class="fb2-track"><div class="fb2-fill" style="width:6%"></div></div><span class="fb2-pct">6%</span></div><div class="fb2-bar"><span class="fb2-label">2 ★</span><div class="fb2-track"><div class="fb2-fill" style="width:3%"></div></div><span class="fb2-pct">3%</span></div><div class="fb2-bar"><span class="fb2-label">1 ★</span><div class="fb2-track"><div class="fb2-fill" style="width:1%"></div></div><span class="fb2-pct">1%</span></div></div></div></div></section>`,
                css: `.fb2-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .fb2-container { max-width: 800px; margin: 0 auto; } .fb2-title { font-size: 28px; font-weight: 800; color: #1e293b; text-align: center; margin: 0 0 40px; } .fb2-layout { display: flex; gap: 60px; align-items: center; } .fb2-left { text-align: center; min-width: 180px; } .fb2-score { font-size: 64px; font-weight: 900; color: #1e293b; display: block; } .fb2-stars { font-size: 22px; color: #f59e0b; margin-bottom: 4px; } .fb2-left p { font-size: 14px; color: #94a3b8; margin: 0; } .fb2-right { flex: 1; } .fb2-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; } .fb2-label { font-size: 14px; color: #64748b; min-width: 30px; font-weight: 600; } .fb2-track { flex: 1; height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; } .fb2-fill { height: 100%; background: #f59e0b; border-radius: 5px; } .fb2-pct { font-size: 13px; color: #94a3b8; min-width: 36px; text-align: right; }`,
                preview: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=300&h=200&fit=crop'
            },
            {
                id: 'fb3', title: 'Dark Reviews Section',
                html: `<section class="fb3-section"><div class="fb3-container"><h2 class="fb3-title">Reviews and Testimonials</h2><p class="fb3-subtitle">Course Feedback will be displayed here.</p><div class="fb3-grid"><div class="fb3-card"><div class="fb3-card-top"><div class="fb3-stars">★★★★★</div><span class="fb3-date">2 weeks ago</span></div><p>"Excellent course! The instructor is very knowledgeable and the content is well-organized."</p><strong>Amit Kumar</strong></div><div class="fb3-card"><div class="fb3-card-top"><div class="fb3-stars">★★★★★</div><span class="fb3-date">1 month ago</span></div><p>"I learned so much from this course. The practical examples really helped solidify the concepts."</p><strong>Sneha Reddy</strong></div><div class="fb3-card"><div class="fb3-card-top"><div class="fb3-stars">★★★★☆</div><span class="fb3-date">1 month ago</span></div><p>"Great value for money. Would recommend to anyone looking to upskill in this area."</p><strong>Vikram Singh</strong></div></div></div></section>`,
                css: `.fb3-section { padding: 100px 5%; background: #0f172a; font-family: 'Inter', sans-serif; } .fb3-container { max-width: 1000px; margin: 0 auto; text-align: center; } .fb3-title { font-size: 32px; font-weight: 800; color: #f59e0b; margin: 0 0 10px; } .fb3-subtitle { font-size: 16px; color: #94a3b8; margin-bottom: 50px; } .fb3-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; text-align: left; } .fb3-card { background: #1e293b; padding: 28px; border-radius: 12px; color: #e2e8f0; } .fb3-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; } .fb3-stars { color: #f59e0b; font-size: 16px; } .fb3-date { font-size: 12px; color: #64748b; } .fb3-card p { font-size: 14px; line-height: 1.7; margin: 0 0 16px; color: #94a3b8; font-style: italic; } .fb3-card strong { font-size: 14px; color: #e2e8f0; }`,
                preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop'
            },
            {
                id: 'fb4', title: 'Student Review Cards',
                html: `<section class="fb4-section"><div class="fb4-container"><h2 class="fb4-title">What Students Say</h2><div class="fb4-grid"><div class="fb4-card"><div class="fb4-header"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" alt="Student" /><div><strong>Sarah Johnson</strong><div class="fb4-stars">★★★★★</div></div></div><p>"The best online course I've ever taken. Every concept is explained with real examples."</p><span class="fb4-course">📚 Web Development Bootcamp</span></div><div class="fb4-card"><div class="fb4-header"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" alt="Student" /><div><strong>David Chen</strong><div class="fb4-stars">★★★★★</div></div></div><p>"Incredibly well-structured. I went from beginner to building real projects in weeks."</p><span class="fb4-course">📚 Python Masterclass</span></div><div class="fb4-card"><div class="fb4-header"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop" alt="Student" /><div><strong>Emily Park</strong><div class="fb4-stars">★★★★☆</div></div></div><p>"Great content with practical exercises. The instructor responds quickly to questions."</p><span class="fb4-course">📚 Data Science Fundamentals</span></div></div></div></section>`,
                css: `.fb4-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .fb4-container { max-width: 1100px; margin: 0 auto; } .fb4-title { font-size: 32px; font-weight: 800; color: #1e293b; text-align: center; margin: 0 0 50px; } .fb4-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } .fb4-card { background: #f8fafc; padding: 28px; border-radius: 16px; border: 1px solid #e2e8f0; } .fb4-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; } .fb4-header img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; } .fb4-header strong { font-size: 16px; color: #1e293b; display: block; margin-bottom: 2px; } .fb4-stars { color: #f59e0b; font-size: 14px; } .fb4-card p { font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 16px; font-style: italic; } .fb4-course { font-size: 13px; color: #4f46e5; font-weight: 600; }`,
                preview: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=300&h=200&fit=crop'
            },
            {
                id: 'fb5', title: 'Feedback Form',
                html: `<section class="fb5-section"><div class="fb5-container"><h2 class="fb5-title">Share Your Feedback</h2><p class="fb5-subtitle">Your feedback helps us improve the course for everyone</p><div class="fb5-form"><div class="fb5-rating-select"><p>Rate this course:</p><div class="fb5-stars-select">★ ★ ★ ★ ★</div></div><div class="fb5-field"><label>Your Name</label><input type="text" placeholder="Enter your name" /></div><div class="fb5-field"><label>Your Review</label><textarea placeholder="Tell us about your experience..." rows="4"></textarea></div><button class="fb5-btn">Submit Review</button></div></div></section>`,
                css: `.fb5-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .fb5-container { max-width: 550px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); } .fb5-title { font-size: 28px; font-weight: 800; color: #1e293b; text-align: center; margin: 0 0 8px; } .fb5-subtitle { font-size: 15px; color: #64748b; text-align: center; margin-bottom: 30px; } .fb5-rating-select { text-align: center; margin-bottom: 24px; } .fb5-rating-select p { font-size: 14px; color: #475569; font-weight: 600; margin: 0 0 8px; } .fb5-stars-select { font-size: 32px; color: #d1d5db; letter-spacing: 8px; cursor: pointer; } .fb5-field { margin-bottom: 18px; } .fb5-field label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px; } .fb5-field input, .fb5-field textarea { width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; box-sizing: border-box; } .fb5-field input:focus, .fb5-field textarea:focus { border-color: #4f46e5; } .fb5-field textarea { resize: vertical; } .fb5-btn { width: 100%; background: #4f46e5; color: #fff; border: none; padding: 14px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop'
            },
            {
                id: 'fb6', title: 'Reviews with Colored Bars',
                html: `<section class="fb6-section"><div class="fb6-container"><h2 class="fb6-title">Reviews and Testimonials</h2><div class="fb6-cards"><div class="fb6-card"><div class="fb6-bar" style="background:#4f46e5"></div><div class="fb6-content"><div class="fb6-stars">★★★★★</div><p>"Amazing course with real-world applications. The instructor makes complex topics simple."</p><div class="fb6-person"><strong>Rajesh Kumar</strong><span>Data Analyst</span></div></div></div><div class="fb6-card"><div class="fb6-bar" style="background:#22c55e"></div><div class="fb6-content"><div class="fb6-stars">★★★★★</div><p>"Hands-down the best course on this topic. Practical, engaging, and well-structured."</p><div class="fb6-person"><strong>Meera Iyer</strong><span>Product Manager</span></div></div></div><div class="fb6-card"><div class="fb6-bar" style="background:#f59e0b"></div><div class="fb6-content"><div class="fb6-stars">★★★★☆</div><p>"Very informative content. Would love to see more advanced topics covered in future updates."</p><div class="fb6-person"><strong>Kiran Joshi</strong><span>Backend Developer</span></div></div></div></div></div></section>`,
                css: `.fb6-section { padding: 100px 5%; background: #fff; font-family: 'Inter', sans-serif; } .fb6-container { max-width: 1000px; margin: 0 auto; } .fb6-title { font-size: 32px; font-weight: 800; color: #1e293b; text-align: center; margin: 0 0 50px; } .fb6-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } .fb6-card { background: #f8fafc; border-radius: 12px; overflow: hidden; } .fb6-bar { height: 4px; } .fb6-content { padding: 24px; } .fb6-stars { color: #f59e0b; font-size: 16px; margin-bottom: 14px; } .fb6-card p { font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 18px; font-style: italic; } .fb6-person strong { display: block; font-size: 14px; color: #1e293b; } .fb6-person span { font-size: 12px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=300&h=200&fit=crop'
            }
        ],
        photos: [
            {
                id: 'ph01', title: 'Gallery Grid',
                html: `<section class="pg1-section"><div class="pg1-container"><h2 class="pg1-title">GALLERY</h2><div class="pg1-grid"><img src="https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=400&q=80" alt="Gallery" /><img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80" alt="Gallery" /><img src="https://images.unsplash.com/photo-1501004318855-06e19a5f6c7c?w=400&q=80" alt="Gallery" /><img src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80" alt="Gallery" /></div></div></section>`,
                css: `.pg1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pg1-container { max-width: 1100px; margin: 0 auto; } .pg1-title { font-size: 24px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 30px; text-align: center; } .pg1-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; } .pg1-grid img { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; }`,
                preview: 'https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=300&h=200&fit=crop'
            },
            {
                id: 'ph02', title: 'Gallery - Soft Style',
                html: `<section class="pg2-section"><div class="pg2-container"><h2 class="pg2-title">Gallery</h2><div class="pg2-grid"><img src="https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&q=80" alt="Gallery" /><img src="https://images.unsplash.com/photo-1501004318855-06e19a5f6c7c?w=400&q=80" alt="Gallery" /><img src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80" alt="Gallery" /></div></div></section>`,
                css: `.pg2-section { padding: 80px 5%; background: #fafaf8; font-family: 'Georgia', serif; } .pg2-container { max-width: 900px; margin: 0 auto; text-align: center; } .pg2-title { font-size: 28px; font-weight: 400; color: #333; margin: 0 0 30px; font-style: italic; } .pg2-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; } .pg2-grid img { width: 100%; height: 240px; object-fit: cover; border-radius: 4px; }`,
                preview: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=300&h=200&fit=crop'
            },
            {
                id: 'ph03', title: 'Numbered Gallery',
                html: `<section class="pg3-section"><div class="pg3-container"><h2 class="pg3-title">GALLERY</h2><div class="pg3-row"><span class="pg3-num">01.</span><div class="pg3-images"><img src="https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=400&q=80" alt="Gallery" /><img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80" alt="Gallery" /></div></div><div class="pg3-row"><span class="pg3-num">02.</span><div class="pg3-images"><img src="https://images.unsplash.com/photo-1501004318855-06e19a5f6c7c?w=400&q=80" alt="Gallery" /><img src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80" alt="Gallery" /></div></div></div></section>`,
                css: `.pg3-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pg3-container { max-width: 900px; margin: 0 auto; } .pg3-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 30px; } .pg3-row { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 24px; } .pg3-num { font-size: 24px; font-weight: 700; color: #1e293b; min-width: 40px; padding-top: 8px; } .pg3-images { display: flex; gap: 16px; flex: 1; } .pg3-images img { flex: 1; height: 180px; object-fit: cover; border-radius: 4px; }`,
                preview: 'https://images.unsplash.com/photo-1501004318855-06e19a5f6c7c?w=300&h=200&fit=crop'
            },
            {
                id: 'ph04', title: 'Portfolio Grid',
                html: `<section class="pg4-section"><div class="pg4-container"><h2 class="pg4-title">PORTFOLIO</h2><div class="pg4-grid"><div class="pg4-item"><img src="https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=400&q=80" alt="Work" /><div class="pg4-overlay"><h3>Project One</h3></div></div><div class="pg4-item"><img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80" alt="Work" /><div class="pg4-overlay"><h3>Project Two</h3></div></div><div class="pg4-item"><img src="https://images.unsplash.com/photo-1501004318855-06e19a5f6c7c?w=400&q=80" alt="Work" /><div class="pg4-overlay"><h3>Project Three</h3></div></div><div class="pg4-item"><img src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80" alt="Work" /><div class="pg4-overlay"><h3>Project Four</h3></div></div></div></div></section>`,
                css: `.pg4-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .pg4-container { max-width: 1000px; margin: 0 auto; } .pg4-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 30px; text-align: center; } .pg4-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; } .pg4-item { position: relative; overflow: hidden; border-radius: 8px; } .pg4-item img { width: 100%; height: 250px; object-fit: cover; display: block; transition: transform 0.4s; } .pg4-item:hover img { transform: scale(1.05); } .pg4-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); padding: 20px; } .pg4-overlay h3 { color: #fff; font-size: 16px; font-weight: 600; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=200&fit=crop'
            },
            {
                id: 'ph05', title: 'Our Works Showcase',
                html: `<section class="pg5-section"><div class="pg5-container"><h2 class="pg5-title">OUR WORKS</h2><div class="pg5-grid"><img src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&q=80" alt="Work" /><img src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80" alt="Work" /><img src="https://images.unsplash.com/photo-1501004318855-06e19a5f6c7c?w=400&q=80" alt="Work" /></div></div></section>`,
                css: `.pg5-section { padding: 60px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pg5-container { max-width: 900px; margin: 0 auto; } .pg5-title { font-size: 14px; font-weight: 700; color: #94a3b8; letter-spacing: 4px; margin: 0 0 24px; } .pg5-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; } .pg5-grid img { width: 100%; height: 180px; object-fit: cover; border-radius: 4px; }`,
                preview: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=300&h=200&fit=crop'
            },
            {
                id: 'ph06', title: 'Cursive Gallery',
                html: `<section class="pg6-section"><div class="pg6-container"><h2 class="pg6-title">Gallery</h2><div class="pg6-grid"><img src="https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&q=80" alt="Gallery" /><img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80" alt="Gallery" /><img src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&q=80" alt="Gallery" /></div></div></section>`,
                css: `.pg6-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pg6-container { max-width: 1100px; margin: 0 auto; text-align: center; } .pg6-title { font-size: 42px; font-weight: 400; color: #1e293b; margin: 0 0 40px; font-family: 'Georgia', serif; font-style: italic; } .pg6-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } .pg6-grid img { width: 100%; height: 320px; object-fit: cover; border-radius: 8px; }`,
                preview: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&h=200&fit=crop'
            }
        ],
        team: [
            {
                id: 'tm1', title: 'Meet Our Team',
                html: `<section class="tm1-section"><div class="tm1-container"><h2 class="tm1-title">MEET OUR TEAM</h2><div class="tm1-grid"><div class="tm1-card"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" alt="Team" /><h3>VINCENT NELSON</h3><p>WEB DESIGNER</p></div><div class="tm1-card"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" alt="Team" /><h3>NATHAN WILLIAMS</h3><p>WEB DEVELOPER</p></div><div class="tm1-card"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" alt="Team" /><h3>THOMAS CALVIN</h3><p>ACCOUNT MANAGER</p></div></div></div></section>`,
                css: `.tm1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .tm1-container { max-width: 1000px; margin: 0 auto; text-align: center; } .tm1-title { font-size: 28px; font-weight: 800; color: #1e293b; letter-spacing: 6px; margin: 0 0 50px; } .tm1-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; } .tm1-card { text-align: center; } .tm1-card img { width: 180px; height: 180px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; } .tm1-card h3 { font-size: 16px; font-weight: 700; color: #1e293b; letter-spacing: 4px; margin: 0 0 6px; } .tm1-card p { font-size: 13px; color: #94a3b8; letter-spacing: 2px; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop'
            },
            {
                id: 'tm2', title: 'Highly Qualified Team',
                html: `<section class="tm2-section"><div class="tm2-container"><h2 class="tm2-title">HIGHLY QUALIFIED TEAM</h2><p class="tm2-subtitle">Our talented professionals who make it all happen</p><div class="tm2-grid"><div class="tm2-card"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" alt="Team" /><div class="tm2-info"><h3>Sarah Johnson</h3><p class="tm2-role">Lead Designer</p><p class="tm2-bio">Creative visionary with 8+ years of experience in UI/UX design</p></div></div><div class="tm2-card"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" alt="Team" /><div class="tm2-info"><h3>James Anderson</h3><p class="tm2-role">Tech Lead</p><p class="tm2-bio">Full-stack developer passionate about scalable solutions</p></div></div><div class="tm2-card"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" alt="Team" /><div class="tm2-info"><h3>Emily Chen</h3><p class="tm2-role">Marketing Head</p><p class="tm2-bio">Digital strategist driving growth through data-driven campaigns</p></div></div></div></div></section>`,
                css: `.tm2-section { padding: 100px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .tm2-container { max-width: 1100px; margin: 0 auto; text-align: center; } .tm2-title { font-size: 24px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 10px; } .tm2-subtitle { font-size: 16px; color: #64748b; margin-bottom: 50px; } .tm2-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; text-align: center; } .tm2-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); } .tm2-card img { width: 100%; height: 280px; object-fit: cover; } .tm2-info { padding: 24px; } .tm2-info h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 4px; } .tm2-role { font-size: 13px; color: #4f46e5; font-weight: 600; margin: 0 0 10px; } .tm2-bio { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop'
            },
            {
                id: 'tm3', title: 'Meet The Experts',
                html: `<section class="tm3-section"><div class="tm3-container"><h2 class="tm3-title">MEET THE EXPERTS</h2><div class="tm3-grid"><div class="tm3-card"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" alt="Expert" /><h3>Dr. Alex Kumar</h3><p>AI Researcher</p><div class="tm3-social"><span>🔗</span><span>🐦</span><span>💼</span></div></div><div class="tm3-card"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" alt="Expert" /><h3>Prof. Maya Patel</h3><p>Data Scientist</p><div class="tm3-social"><span>🔗</span><span>🐦</span><span>💼</span></div></div><div class="tm3-card"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" alt="Expert" /><h3>Mark Thompson</h3><p>Cloud Architect</p><div class="tm3-social"><span>🔗</span><span>🐦</span><span>💼</span></div></div></div></div></section>`,
                css: `.tm3-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .tm3-container { max-width: 1000px; margin: 0 auto; text-align: center; } .tm3-title { font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .tm3-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; } .tm3-card { text-align: center; } .tm3-card img { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; border: 3px solid #f1f5f9; } .tm3-card h3 { font-size: 17px; font-weight: 700; color: #1e293b; margin: 0 0 4px; } .tm3-card p { font-size: 13px; color: #64748b; margin: 0 0 12px; } .tm3-social { display: flex; justify-content: center; gap: 10px; font-size: 18px; } .tm3-social span { cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop'
            },
            {
                id: 'tm4', title: 'Amazing Team - Left',
                html: `<section class="tm4-section"><div class="tm4-container"><div class="tm4-text"><h2>Meet<br/>our amazing<br/>team.</h2></div><div class="tm4-members"><div class="tm4-member"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" alt="Member" /><div><strong>Lisa Chen</strong><span>CEO & Founder</span></div></div><div class="tm4-member"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" alt="Member" /><div><strong>Ryan Park</strong><span>CTO</span></div></div><div class="tm4-member"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" alt="Member" /><div><strong>Anna White</strong><span>Head of Design</span></div></div><div class="tm4-member"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" alt="Member" /><div><strong>Tom Harris</strong><span>Lead Engineer</span></div></div></div></div></section>`,
                css: `.tm4-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .tm4-container { display: flex; gap: 80px; max-width: 1000px; margin: 0 auto; align-items: center; } .tm4-text h2 { font-size: 40px; font-weight: 800; color: #1e293b; line-height: 1.2; margin: 0; } .tm4-members { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; flex: 1; } .tm4-member { display: flex; align-items: center; gap: 14px; padding: 16px; background: #f8fafc; border-radius: 10px; } .tm4-member img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; } .tm4-member strong { display: block; font-size: 15px; color: #1e293b; } .tm4-member span { font-size: 13px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop'
            },
            {
                id: 'tm5', title: 'Meet The Experts - Avatars',
                html: `<section class="tm5-section"><div class="tm5-container"><h2 class="tm5-title">OUR TEAM</h2><div class="tm5-avatars"><div class="tm5-avatar"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" alt="Team" /></div><div class="tm5-avatar"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" alt="Team" /></div><div class="tm5-avatar"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80" alt="Team" /></div><div class="tm5-avatar"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80" alt="Team" /></div><div class="tm5-avatar"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80" alt="Team" /></div></div><p class="tm5-desc">Our passionate team of experts is dedicated to delivering the best learning experience for our students.</p></div></section>`,
                css: `.tm5-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .tm5-container { max-width: 600px; margin: 0 auto; text-align: center; } .tm5-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 30px; } .tm5-avatars { display: flex; justify-content: center; gap: -8px; margin-bottom: 24px; } .tm5-avatar { margin: 0 -6px; } .tm5-avatar img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); } .tm5-desc { font-size: 15px; color: #64748b; line-height: 1.6; }`,
                preview: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop'
            },
            {
                id: 'tm6', title: 'Our Team - Dark',
                html: `<section class="tm6-section"><div class="tm6-container"><h2 class="tm6-title">OUR TEAM</h2><p class="tm6-subtitle">A Passionate Team</p><div class="tm6-grid"><div class="tm6-card"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" alt="Team" /><h3>Sarah Chen</h3><p>Product Manager</p></div><div class="tm6-card"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" alt="Team" /><h3>David Kim</h3><p>Senior Developer</p></div><div class="tm6-card"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" alt="Team" /><h3>Emma Davis</h3><p>UX Designer</p></div></div></div></section>`,
                css: `.tm6-section { padding: 100px 5%; background: #0f172a; font-family: 'Inter', sans-serif; } .tm6-container { max-width: 1000px; margin: 0 auto; text-align: center; } .tm6-title { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: 4px; margin: 0 0 8px; } .tm6-subtitle { font-size: 16px; color: #94a3b8; margin-bottom: 50px; } .tm6-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; } .tm6-card { text-align: center; } .tm6-card img { width: 160px; height: 160px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; border: 3px solid #1e293b; } .tm6-card h3 { font-size: 17px; font-weight: 700; color: #e2e8f0; margin: 0 0 4px; } .tm6-card p { font-size: 13px; color: #64748b; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop'
            }
        ],
        products: [
            {
                id: 'ps1', title: 'Our Products Grid',
                html: `<section class="ps1-section"><div class="ps1-container"><h2 class="ps1-title">OUR PRODUCTS</h2><div class="ps1-grid"><div class="ps1-card"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" alt="Product" /><h3>Product One</h3><p>Premium quality product with innovative design and features.</p></div><div class="ps1-card"><img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" alt="Product" /><h3>Product Two</h3><p>Cutting-edge technology meets elegant craftsmanship.</p></div><div class="ps1-card"><img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80" alt="Product" /><h3>Product Three</h3><p>Designed for the modern professional who demands the best.</p></div></div></div></section>`,
                css: `.ps1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ps1-container { max-width: 1100px; margin: 0 auto; text-align: center; } .ps1-title { font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 40px; } .ps1-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; } .ps1-card { text-align: center; } .ps1-card img { width: 100%; height: 220px; object-fit: cover; border-radius: 8px; margin-bottom: 16px; } .ps1-card h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 8px; } .ps1-card p { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop'
            },
            {
                id: 'ps2', title: 'Services We Offer',
                html: `<section class="ps2-section"><div class="ps2-container"><h2 class="ps2-title">SERVICES WE OFFER</h2><div class="ps2-grid"><div class="ps2-card"><span class="ps2-icon">🎨</span><h3>Design</h3><p>Beautiful interfaces that engage your users and drive results.</p></div><div class="ps2-card"><span class="ps2-icon">💻</span><h3>Development</h3><p>Robust solutions built with modern technology stacks.</p></div><div class="ps2-card"><span class="ps2-icon">📱</span><h3>Mobile Apps</h3><p>Native and cross-platform apps for iOS and Android.</p></div><div class="ps2-card"><span class="ps2-icon">📈</span><h3>Marketing</h3><p>Data-driven strategies to grow your digital presence.</p></div></div></div></section>`,
                css: `.ps2-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .ps2-container { max-width: 1000px; margin: 0 auto; text-align: center; } .ps2-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 40px; } .ps2-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; } .ps2-card { background: #fff; padding: 28px 20px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center; } .ps2-icon { font-size: 36px; display: block; margin-bottom: 14px; } .ps2-card h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 8px; } .ps2-card p { font-size: 13px; color: #64748b; line-height: 1.5; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ps3', title: 'Our Services - Numbered',
                html: `<section class="ps3-section"><div class="ps3-container"><h2 class="ps3-title">OUR SERVICES</h2><div class="ps3-divider"></div><div class="ps3-grid"><div class="ps3-item"><span class="ps3-num">01.</span><h3>SERVICE ONE</h3><p>Lorem Ipsum has been the industry's standard dummy text since 1500s.</p></div><div class="ps3-item"><span class="ps3-num">02.</span><h3>SERVICE TWO</h3><p>Lorem Ipsum has been the industry's standard dummy text since 1500s.</p></div><div class="ps3-item"><span class="ps3-num">03.</span><h3>SERVICE THREE</h3><p>Lorem Ipsum has been the industry's standard dummy text since 1500s.</p></div></div></div></section>`,
                css: `.ps3-section { padding: 80px 5%; background: #f1f5f9; font-family: 'Inter', sans-serif; } .ps3-container { max-width: 1000px; margin: 0 auto; text-align: center; } .ps3-title { font-size: 28px; font-weight: 800; color: #1e293b; letter-spacing: 6px; margin: 0 0 16px; } .ps3-divider { width: 40px; height: 3px; background: #1e293b; margin: 0 auto 50px; } .ps3-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; text-align: left; } .ps3-num { font-size: 48px; font-weight: 900; color: #1e293b; display: block; margin-bottom: 16px; } .ps3-item h3 { font-size: 16px; font-weight: 800; color: #1e293b; letter-spacing: 2px; margin: 0 0 12px; } .ps3-item p { font-size: 14px; color: #64748b; line-height: 1.7; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ps4', title: 'Services We Provide',
                html: `<section class="ps4-section"><div class="ps4-container"><h2 class="ps4-title">SERVICES WE PROVIDE</h2><div class="ps4-grid"><div class="ps4-card"><div class="ps4-num">1</div><h3>Consulting</h3><p>Expert guidance for your digital transformation journey.</p></div><div class="ps4-card"><div class="ps4-num">2</div><h3>Development</h3><p>Custom software solutions tailored to your business needs.</p></div><div class="ps4-card"><div class="ps4-num">3</div><h3>Support</h3><p>24/7 dedicated support to keep your systems running smoothly.</p></div></div></div></section>`,
                css: `.ps4-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ps4-container { max-width: 900px; margin: 0 auto; text-align: center; } .ps4-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .ps4-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; } .ps4-card { text-align: center; padding: 20px; } .ps4-num { width: 40px; height: 40px; background: #1e293b; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; margin: 0 auto 16px; } .ps4-card h3 { font-size: 17px; font-weight: 700; color: #1e293b; margin: 0 0 8px; } .ps4-card p { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ps5', title: 'Our Products - Images',
                html: `<section class="ps5-section"><div class="ps5-container"><h2 class="ps5-title">OUR PRODUCTS</h2><div class="ps5-grid"><div class="ps5-card"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" alt="Product" /><div class="ps5-badge">NEW</div></div><div class="ps5-card"><img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" alt="Product" /><div class="ps5-badge ps5-hot">HOT</div></div><div class="ps5-card"><img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80" alt="Product" /></div></div></div></section>`,
                css: `.ps5-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ps5-container { max-width: 1000px; margin: 0 auto; text-align: center; } .ps5-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 30px; } .ps5-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; } .ps5-card { position: relative; overflow: hidden; border-radius: 10px; } .ps5-card img { width: 100%; height: 260px; object-fit: cover; display: block; } .ps5-badge { position: absolute; top: 12px; right: 12px; background: #4f46e5; color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 1px; } .ps5-hot { background: #ef4444; }`,
                preview: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop'
            },
            {
                id: 'ps6', title: 'Our Services - Dark',
                html: `<section class="ps6-section"><div class="ps6-container"><h2 class="ps6-title">Our Services</h2><p class="ps6-subtitle">What we bring to the table</p><div class="ps6-grid"><div class="ps6-card"><div class="ps6-icon">⚡</div><h3>Fast Delivery</h3><p>Quick turnaround times without compromising quality.</p></div><div class="ps6-card"><div class="ps6-icon">🛡️</div><h3>Secure Solutions</h3><p>Enterprise-grade security built into every product.</p></div><div class="ps6-card"><div class="ps6-icon">🔧</div><h3>Custom Solutions</h3><p>Tailor-made solutions designed for your unique needs.</p></div></div></div></section>`,
                css: `.ps6-section { padding: 100px 5%; background: #0f172a; font-family: 'Inter', sans-serif; } .ps6-container { max-width: 1000px; margin: 0 auto; text-align: center; } .ps6-title { font-size: 32px; font-weight: 800; color: #fff; margin: 0 0 8px; } .ps6-subtitle { font-size: 16px; color: #94a3b8; margin-bottom: 50px; } .ps6-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } .ps6-card { background: #1e293b; padding: 32px 24px; border-radius: 12px; text-align: center; } .ps6-icon { font-size: 36px; margin-bottom: 16px; } .ps6-card h3 { font-size: 18px; font-weight: 700; color: #e2e8f0; margin: 0 0 10px; } .ps6-card p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            }
        ],
        features: [
            {
                id: 'ft1', title: 'Features Icon Grid',
                html: `<section class="ft1-section"><div class="ft1-container"><div class="ft1-grid"><div class="ft1-card"><div class="ft1-icon" style="color:#e74c3c">💡</div><h3>CREATIVE IDEAS</h3><div class="ft1-line" style="background:#e74c3c"></div></div><div class="ft1-card"><div class="ft1-icon" style="color:#f39c12">⚙️</div><h3>WEB DEVELOPMENT</h3><div class="ft1-line" style="background:#f39c12"></div></div><div class="ft1-card"><div class="ft1-icon" style="color:#3498db">📷</div><h3>PHOTOGRAPHY</h3><div class="ft1-line" style="background:#3498db"></div></div><div class="ft1-card"><div class="ft1-icon" style="color:#e74c3c">📱</div><h3>RESPONSIVE DESIGN</h3><div class="ft1-line" style="background:#e74c3c"></div></div><div class="ft1-card"><div class="ft1-icon" style="color:#2ecc71">📋</div><h3>DIGITAL MARKETING</h3><div class="ft1-line" style="background:#2ecc71"></div></div><div class="ft1-card"><div class="ft1-icon" style="color:#9b59b6">🌐</div><h3>ONLINE SUPPORT</h3><div class="ft1-line" style="background:#9b59b6"></div></div></div></div></section>`,
                css: `.ft1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ft1-container { max-width: 1000px; margin: 0 auto; } .ft1-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 50px 40px; } .ft1-card { text-align: center; } .ft1-icon { font-size: 42px; margin-bottom: 16px; } .ft1-card h3 { font-size: 15px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 14px; } .ft1-line { width: 40px; height: 3px; margin: 0 auto; border-radius: 2px; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ft2', title: 'Why Choose Us',
                html: `<section class="ft2-section"><div class="ft2-container"><h2 class="ft2-title">WHY CHOOSE US</h2><div class="ft2-grid"><div class="ft2-item"><span class="ft2-check">✓</span><div><h3>Expert Instructors</h3><p>Learn from industry professionals with years of real-world experience.</p></div></div><div class="ft2-item"><span class="ft2-check">✓</span><div><h3>Hands-on Projects</h3><p>Build real projects to strengthen your portfolio and practical skills.</p></div></div><div class="ft2-item"><span class="ft2-check">✓</span><div><h3>Lifetime Access</h3><p>Get unlimited access to course content, updates, and community support.</p></div></div><div class="ft2-item"><span class="ft2-check">✓</span><div><h3>Certificate</h3><p>Earn a verified certificate upon completion to boost your career.</p></div></div></div></div></section>`,
                css: `.ft2-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .ft2-container { max-width: 800px; margin: 0 auto; } .ft2-title { font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: 3px; text-align: center; margin: 0 0 40px; } .ft2-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; } .ft2-item { display: flex; gap: 14px; background: #fff; padding: 24px; border-radius: 10px; border: 1px solid #e2e8f0; } .ft2-check { font-size: 20px; color: #22c55e; font-weight: 700; min-width: 28px; } .ft2-item h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 6px; } .ft2-item p { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ft3', title: 'Numbered Features',
                html: `<section class="ft3-section"><div class="ft3-container"><div class="ft3-grid"><div class="ft3-card"><span class="ft3-num">01</span><h3>Fast Performance</h3><p>Lightning-fast load times and optimized delivery for the best user experience.</p></div><div class="ft3-card"><span class="ft3-num">02</span><h3>Easy Integration</h3><p>Seamlessly connects with your existing tools and workflow.</p></div><div class="ft3-card"><span class="ft3-num">03</span><h3>24/7 Support</h3><p>Round-the-clock expert assistance whenever you need help.</p></div></div></div></section>`,
                css: `.ft3-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ft3-container { max-width: 1000px; margin: 0 auto; } .ft3-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; } .ft3-card { padding: 20px; } .ft3-num { font-size: 36px; font-weight: 900; color: #e2e8f0; display: block; margin-bottom: 14px; } .ft3-card h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 10px; } .ft3-card p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ft4', title: 'Features Grid 1-4',
                html: `<section class="ft4-section"><div class="ft4-container"><div class="ft4-grid"><div class="ft4-card"><div class="ft4-num">1</div><h3>QUALITY CONTENT</h3><p>Well-structured curriculum designed by industry experts and professionals.</p></div><div class="ft4-card"><div class="ft4-num">2</div><h3>LIVE MENTORING</h3><p>Direct interaction with experienced mentors for personalized guidance.</p></div><div class="ft4-card"><div class="ft4-num">3</div><h3>PRACTICAL PROJECTS</h3><p>Build real-world projects to solidify your knowledge and skills.</p></div><div class="ft4-card"><div class="ft4-num">4</div><h3>JOB ASSISTANCE</h3><p>Career support and job placement assistance after course completion.</p></div></div></div></section>`,
                css: `.ft4-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ft4-container { max-width: 900px; margin: 0 auto; } .ft4-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; } .ft4-card { padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px; } .ft4-num { font-size: 28px; font-weight: 900; color: #4f46e5; margin-bottom: 12px; } .ft4-card h3 { font-size: 14px; font-weight: 800; color: #1e293b; letter-spacing: 2px; margin: 0 0 10px; } .ft4-card p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ft5', title: 'What Makes Us Different',
                html: `<section class="ft5-section"><div class="ft5-container"><div class="ft5-left"><h2>WHAT MAKES US DIFFERENT</h2><div class="ft5-items"><div class="ft5-item"><span>✦</span><p>Industry-leading course content updated regularly</p></div><div class="ft5-item"><span>✦</span><p>One-on-one mentoring sessions with experts</p></div><div class="ft5-item"><span>✦</span><p>Hands-on projects with real-world applications</p></div><div class="ft5-item"><span>✦</span><p>Community of 10,000+ active learners</p></div></div></div><div class="ft5-right"><img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" alt="Features" /></div></div></section>`,
                css: `.ft5-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ft5-container { display: flex; gap: 60px; max-width: 1000px; margin: 0 auto; align-items: center; } .ft5-left { flex: 1; } .ft5-left h2 { font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 30px; } .ft5-items { display: flex; flex-direction: column; gap: 16px; } .ft5-item { display: flex; gap: 12px; align-items: flex-start; } .ft5-item span { color: #4f46e5; font-size: 14px; padding-top: 2px; } .ft5-item p { font-size: 15px; color: #475569; line-height: 1.5; margin: 0; } .ft5-right { flex: 1; } .ft5-right img { width: 100%; border-radius: 12px; }`,
                preview: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop'
            },
            {
                id: 'ft6', title: 'Special Features',
                html: `<section class="ft6-section"><div class="ft6-container"><h2 class="ft6-title">SPECIAL FEATURES</h2><div class="ft6-grid"><div class="ft6-card"><img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80" alt="Feature" /><h3>Interactive Labs</h3><p>Practice coding in browser-based labs with instant feedback.</p></div><div class="ft6-card"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" alt="Feature" /><h3>Group Projects</h3><p>Collaborate with peers on team-based learning activities.</p></div><div class="ft6-card"><img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80" alt="Feature" /><h3>Certification</h3><p>Earn industry-recognized certificates upon completion.</p></div></div></div></section>`,
                css: `.ft6-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .ft6-container { max-width: 1100px; margin: 0 auto; text-align: center; } .ft6-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .ft6-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; text-align: left; } .ft6-card { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; } .ft6-card img { width: 100%; height: 180px; object-fit: cover; } .ft6-card h3 { font-size: 17px; font-weight: 700; color: #1e293b; margin: 20px 20px 8px; } .ft6-card p { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0 20px 20px; }`,
                preview: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop'
            }
        ],
        process: [
            {
                id: 'pr1', title: 'How We Work',
                html: `<section class="pr1-section"><div class="pr1-container"><h2 class="pr1-title">HOW WE WORK</h2><div class="pr1-divider"></div><div class="pr1-grid"><div class="pr1-step"><span class="pr1-num">01.</span><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="pr1-step"><span class="pr1-num">02.</span><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="pr1-step"><span class="pr1-num">03.</span><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div></div></div></section>`,
                css: `.pr1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pr1-container { max-width: 1000px; margin: 0 auto; } .pr1-title { font-size: 32px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 16px; } .pr1-divider { width: 40px; height: 3px; background: #1e293b; margin-bottom: 50px; } .pr1-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; } .pr1-num { font-size: 48px; font-weight: 300; color: #d1d5db; display: block; margin-bottom: 20px; } .pr1-step p { font-size: 16px; color: #475569; line-height: 1.7; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pr2', title: 'How It Works - Arrows',
                html: `<section class="pr2-section"><div class="pr2-container"><h2 class="pr2-title">HOW WE WORK</h2><div class="pr2-steps"><div class="pr2-step"><div class="pr2-badge">STEP 1</div><p>Research & Planning</p></div><span class="pr2-arrow">→</span><div class="pr2-step"><div class="pr2-badge">STEP 2</div><p>Design & Develop</p></div><span class="pr2-arrow">→</span><div class="pr2-step"><div class="pr2-badge">STEP 3</div><p>Test & Launch</p></div></div></div></section>`,
                css: `.pr2-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .pr2-container { max-width: 900px; margin: 0 auto; text-align: center; } .pr2-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 40px; } .pr2-steps { display: flex; align-items: center; justify-content: center; gap: 20px; } .pr2-step { background: #fff; padding: 28px 24px; border-radius: 12px; border: 1px solid #e2e8f0; flex: 1; } .pr2-badge { font-size: 11px; font-weight: 700; color: #4f46e5; letter-spacing: 2px; margin-bottom: 10px; } .pr2-step p { font-size: 15px; color: #1e293b; font-weight: 600; margin: 0; } .pr2-arrow { font-size: 24px; color: #94a3b8; font-weight: 300; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pr3', title: 'How It Works - Circles',
                html: `<section class="pr3-section"><div class="pr3-container"><h2 class="pr3-title">HOW IT WORKS</h2><div class="pr3-steps"><div class="pr3-step"><div class="pr3-circle">1</div><h3>Sign Up</h3><p>Create your account in just a few clicks</p></div><div class="pr3-line"></div><div class="pr3-step"><div class="pr3-circle">2</div><h3>Choose Course</h3><p>Browse and select your desired course</p></div><div class="pr3-line"></div><div class="pr3-step"><div class="pr3-circle">3</div><h3>Start Learning</h3><p>Begin your learning journey immediately</p></div></div></div></section>`,
                css: `.pr3-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pr3-container { max-width: 900px; margin: 0 auto; text-align: center; } .pr3-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 50px; } .pr3-steps { display: flex; align-items: flex-start; justify-content: center; gap: 0; } .pr3-step { text-align: center; flex: 1; } .pr3-circle { width: 50px; height: 50px; background: #1e293b; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; margin: 0 auto 16px; } .pr3-step h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 6px; } .pr3-step p { font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; } .pr3-line { width: 60px; height: 2px; background: #e2e8f0; margin-top: 25px; flex-shrink: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pr4', title: 'Timeline Process',
                html: `<section class="pr4-section"><div class="pr4-container"><h2 class="pr4-title">TIMELINE PROCESS</h2><div class="pr4-timeline"><div class="pr4-item"><div class="pr4-dot"></div><div class="pr4-content"><h3>Phase 1: Discovery</h3><p>Understanding requirements, goals, and target audience.</p></div></div><div class="pr4-item"><div class="pr4-dot"></div><div class="pr4-content"><h3>Phase 2: Design</h3><p>Creating wireframes, prototypes, and visual designs.</p></div></div><div class="pr4-item"><div class="pr4-dot"></div><div class="pr4-content"><h3>Phase 3: Development</h3><p>Building the solution with clean, maintainable code.</p></div></div><div class="pr4-item"><div class="pr4-dot"></div><div class="pr4-content"><h3>Phase 4: Launch</h3><p>Testing, deploying, and monitoring the final product.</p></div></div></div></div></section>`,
                css: `.pr4-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .pr4-container { max-width: 700px; margin: 0 auto; } .pr4-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; text-align: center; margin: 0 0 40px; } .pr4-timeline { position: relative; padding-left: 30px; border-left: 2px solid #e2e8f0; } .pr4-item { position: relative; margin-bottom: 30px; } .pr4-dot { position: absolute; left: -37px; top: 4px; width: 12px; height: 12px; background: #4f46e5; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 0 2px #4f46e5; } .pr4-content h3 { font-size: 17px; font-weight: 700; color: #1e293b; margin: 0 0 6px; } .pr4-content p { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pr5', title: 'The Process - Dots',
                html: `<section class="pr5-section"><div class="pr5-container"><h2 class="pr5-title">THE PROCESS</h2><div class="pr5-steps"><div class="pr5-step"><div class="pr5-dot"></div><h3>01</h3><p>Discover</p></div><div class="pr5-step"><div class="pr5-dot"></div><h3>02</h3><p>Design</p></div><div class="pr5-step"><div class="pr5-dot"></div><h3>03</h3><p>Develop</p></div><div class="pr5-step"><div class="pr5-dot"></div><h3>04</h3><p>Deliver</p></div></div></div></section>`,
                css: `.pr5-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pr5-container { max-width: 800px; margin: 0 auto; text-align: center; } .pr5-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 50px; } .pr5-steps { display: flex; justify-content: space-around; } .pr5-step { text-align: center; } .pr5-dot { width: 16px; height: 16px; background: #1e293b; border-radius: 50%; margin: 0 auto 16px; } .pr5-step h3 { font-size: 24px; font-weight: 300; color: #94a3b8; margin: 0 0 6px; } .pr5-step p { font-size: 14px; color: #1e293b; font-weight: 600; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pr6', title: 'Our Work Steps',
                html: `<section class="pr6-section"><div class="pr6-container"><h2 class="pr6-title">OUR WORK STEPS</h2><div class="pr6-grid"><div class="pr6-card"><div class="pr6-num">01</div><h3>Consultation</h3><p>We discuss your requirements, goals, and vision for the project.</p></div><div class="pr6-card"><div class="pr6-num">02</div><h3>Strategy</h3><p>We create a detailed roadmap and plan of action.</p></div><div class="pr6-card"><div class="pr6-num">03</div><h3>Execution</h3><p>Our team brings the plan to life with precision.</p></div><div class="pr6-card"><div class="pr6-num">04</div><h3>Delivery</h3><p>Final review, testing, and successful project delivery.</p></div></div></div></section>`,
                css: `.pr6-section { padding: 80px 5%; background: #0f172a; font-family: 'Inter', sans-serif; } .pr6-container { max-width: 1000px; margin: 0 auto; text-align: center; } .pr6-title { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: 4px; margin: 0 0 40px; } .pr6-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; } .pr6-card { background: #1e293b; padding: 28px 20px; border-radius: 10px; text-align: center; } .pr6-num { font-size: 28px; font-weight: 800; color: #4f46e5; margin-bottom: 12px; } .pr6-card h3 { font-size: 16px; font-weight: 700; color: #e2e8f0; margin: 0 0 8px; } .pr6-card p { font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            }
        ],
        pricing: [
            {
                id: 'pc1', title: 'Choose Your Plan',
                html: `<section class="pc1-section"><div class="pc1-container"><h2 class="pc1-title">CHOOSE YOUR PLAN</h2><div class="pc1-grid"><div class="pc1-card"><span class="pc1-num">01</span><h3>BASIC</h3><p class="pc1-desc">Perfect for beginners getting started</p><div class="pc1-price">$<span>29</span>/mo</div><ul><li>✓ 5 Courses</li><li>✓ Basic Support</li><li>✓ Certificate</li></ul><button>GET STARTED</button></div><div class="pc1-card pc1-popular"><span class="pc1-num">02</span><h3>ADVANCED</h3><p class="pc1-desc">Most popular for serious learners</p><div class="pc1-price">$<span>59</span>/mo</div><ul><li>✓ All Courses</li><li>✓ Priority Support</li><li>✓ Certificate</li><li>✓ Mentoring</li></ul><button>GET STARTED</button></div><div class="pc1-card"><span class="pc1-num">03</span><h3>ULTIMATE</h3><p class="pc1-desc">Complete access to everything</p><div class="pc1-price">$<span>79</span>/mo</div><ul><li>✓ All Courses</li><li>✓ 24/7 Support</li><li>✓ Certificate</li><li>✓ 1-on-1 Mentoring</li></ul><button>GET STARTED</button></div></div></div></section>`,
                css: `.pc1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pc1-container { max-width: 1000px; margin: 0 auto; text-align: center; } .pc1-title { font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .pc1-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } .pc1-card { padding: 36px 28px; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center; } .pc1-popular { border-color: #4f46e5; box-shadow: 0 4px 20px rgba(79,70,229,0.15); } .pc1-num { font-size: 36px; font-weight: 900; color: #e2e8f0; display: block; margin-bottom: 10px; } .pc1-card h3 { font-size: 16px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 6px; } .pc1-desc { font-size: 13px; color: #94a3b8; margin-bottom: 20px; } .pc1-price { font-size: 16px; color: #64748b; margin-bottom: 20px; } .pc1-price span { font-size: 40px; font-weight: 800; color: #1e293b; } .pc1-card ul { list-style: none; padding: 0; margin: 0 0 24px; text-align: left; } .pc1-card li { font-size: 14px; color: #475569; padding: 6px 0; } .pc1-card button { width: 100%; padding: 12px; background: #1e293b; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; letter-spacing: 2px; cursor: pointer; } .pc1-popular button { background: #4f46e5; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pc2', title: 'Simple Pricing',
                html: `<section class="pc2-section"><div class="pc2-container"><h2 class="pc2-title">SIMPLE PRICING</h2><div class="pc2-grid"><div class="pc2-card"><h3>Starter</h3><div class="pc2-price">$<span>11</span>/mo</div><p>Basic features for individuals</p><button class="pc2-btn">Choose Plan</button></div><div class="pc2-card"><h3>Professional</h3><div class="pc2-price">$<span>57</span>/mo</div><p>Advanced features for teams</p><button class="pc2-btn pc2-pop">Choose Plan</button></div></div></div></section>`,
                css: `.pc2-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pc2-container { max-width: 700px; margin: 0 auto; text-align: center; } .pc2-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .pc2-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; } .pc2-card { padding: 36px; border: 1px solid #e2e8f0; border-radius: 12px; } .pc2-card h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 12px; } .pc2-price { font-size: 16px; color: #64748b; margin-bottom: 10px; } .pc2-price span { font-size: 42px; font-weight: 800; color: #1e293b; } .pc2-card p { font-size: 14px; color: #94a3b8; margin-bottom: 24px; } .pc2-btn { padding: 12px 28px; border: 2px solid #1e293b; background: transparent; color: #1e293b; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; } .pc2-pop { background: #1e293b; color: #fff; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pc3', title: 'Subscription Plans',
                html: `<section class="pc3-section"><div class="pc3-container"><h2 class="pc3-title">SUBSCRIPTION PLANS</h2><div class="pc3-grid"><div class="pc3-card"><div class="pc3-badge" style="background:#22c55e">BASIC</div><div class="pc3-price">$<span>39</span></div><p class="pc3-period">per month</p><ul><li>5 Courses Access</li><li>Email Support</li><li>Basic Certificate</li></ul><button>Subscribe</button></div><div class="pc3-card pc3-featured"><div class="pc3-badge" style="background:#4f46e5">ADVANCED</div><div class="pc3-price">$<span>59</span></div><p class="pc3-period">per month</p><ul><li>All Courses Access</li><li>Priority Support</li><li>Pro Certificate</li><li>Live Sessions</li></ul><button>Subscribe</button></div><div class="pc3-card"><div class="pc3-badge" style="background:#f59e0b">ULTIMATE</div><div class="pc3-price">$<span>79</span></div><p class="pc3-period">per month</p><ul><li>Everything in Advanced</li><li>1-on-1 Mentoring</li><li>Job Assistance</li><li>Lifetime Access</li></ul><button>Subscribe</button></div></div></div></section>`,
                css: `.pc3-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .pc3-container { max-width: 1000px; margin: 0 auto; text-align: center; } .pc3-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 40px; } .pc3-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } .pc3-card { background: #fff; padding: 36px 28px; border-radius: 12px; border: 1px solid #e2e8f0; } .pc3-featured { border-color: #4f46e5; transform: scale(1.05); box-shadow: 0 8px 30px rgba(79,70,229,0.15); } .pc3-badge { display: inline-block; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 16px; border-radius: 20px; letter-spacing: 2px; margin-bottom: 16px; } .pc3-price { font-size: 16px; color: #64748b; } .pc3-price span { font-size: 48px; font-weight: 800; color: #1e293b; } .pc3-period { font-size: 14px; color: #94a3b8; margin-bottom: 20px; } .pc3-card ul { list-style: none; padding: 0; margin: 0 0 24px; text-align: left; } .pc3-card li { font-size: 14px; color: #475569; padding: 8px 0; border-bottom: 1px solid #f1f5f9; } .pc3-card button { width: 100%; padding: 12px; background: #4f46e5; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pc4', title: 'Pricing Plans - Circles',
                html: `<section class="pc4-section"><div class="pc4-container"><h2 class="pc4-title">PRICING PLANS</h2><div class="pc4-grid"><div class="pc4-card"><div class="pc4-circle" style="background:#4f46e5">$17</div><h3>Basic Plan</h3><p>For individuals</p></div><div class="pc4-card"><div class="pc4-circle" style="background:#22c55e">$29</div><h3>Pro Plan</h3><p>For professionals</p></div></div></div></section>`,
                css: `.pc4-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pc4-container { max-width: 600px; margin: 0 auto; text-align: center; } .pc4-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .pc4-grid { display: flex; justify-content: center; gap: 40px; } .pc4-card { text-align: center; } .pc4-circle { width: 80px; height: 80px; border-radius: 50%; color: #fff; font-size: 22px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; } .pc4-card h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 4px; } .pc4-card p { font-size: 13px; color: #94a3b8; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pc5', title: 'Plans That Meet Your Needs',
                html: `<section class="pc5-section"><div class="pc5-container"><h2 class="pc5-title">PLANS THAT MEET YOUR NEEDS</h2><div class="pc5-grid"><div class="pc5-card"><h3>BASIC</h3><div class="pc5-price">$<span>39</span></div><ul><li>✓ 5 Courses</li><li>✓ Email Support</li><li>✓ Certificate</li><li>✗ Mentoring</li></ul><button>Choose</button></div><div class="pc5-card pc5-pop"><div class="pc5-tag">POPULAR</div><h3>ADVANCED</h3><div class="pc5-price">$<span>59</span></div><ul><li>✓ All Courses</li><li>✓ Priority Support</li><li>✓ Certificate</li><li>✓ Mentoring</li></ul><button>Choose</button></div><div class="pc5-card"><h3>ULTIMATE</h3><div class="pc5-price">$<span>79</span></div><ul><li>✓ Everything</li><li>✓ 24/7 Support</li><li>✓ Certificate</li><li>✓ 1:1 Sessions</li></ul><button>Choose</button></div></div></div></section>`,
                css: `.pc5-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .pc5-container { max-width: 1000px; margin: 0 auto; text-align: center; } .pc5-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 40px; } .pc5-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } .pc5-card { background: #fff; padding: 36px 24px; border-radius: 12px; border: 1px solid #e2e8f0; position: relative; } .pc5-pop { border-color: #4f46e5; } .pc5-tag { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #4f46e5; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 16px; border-radius: 20px; letter-spacing: 1px; } .pc5-card h3 { font-size: 15px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 12px; } .pc5-price { font-size: 16px; color: #64748b; margin-bottom: 20px; } .pc5-price span { font-size: 44px; font-weight: 800; color: #1e293b; } .pc5-card ul { list-style: none; padding: 0; margin: 0 0 24px; text-align: left; } .pc5-card li { font-size: 14px; color: #475569; padding: 6px 0; } .pc5-card button { width: 100%; padding: 12px; background: #1e293b; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; } .pc5-pop button { background: #4f46e5; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pc6', title: 'Pricing Plans - Dark',
                html: `<section class="pc6-section"><div class="pc6-container"><h2 class="pc6-title">PRICING PLANS</h2><div class="pc6-grid"><div class="pc6-card"><span class="pc6-num">01</span><h3>LITE / $77</h3><p>Lorem Ipsum is dummy text of the printing and typesetting industry. Lorem Ipsum dolor sit amet.</p><button>GET STARTED</button></div><div class="pc6-card"><span class="pc6-num">02</span><h3>ADVANCED / $159</h3><p>Lorem Ipsum is dummy text of the printing and typesetting industry. Lorem Ipsum dolor sit amet.</p><button>GET STARTED</button></div><div class="pc6-card"><span class="pc6-num">03</span><h3>ULTIMATE / $213</h3><p>Lorem Ipsum is dummy text of the printing and typesetting industry. Lorem Ipsum dolor sit amet.</p><button>GET STARTED</button></div></div></div></section>`,
                css: `.pc6-section { padding: 80px 5%; background: #0f172a; font-family: 'Inter', sans-serif; } .pc6-container { max-width: 1100px; margin: 0 auto; } .pc6-title { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: 4px; text-align: center; margin: 0 0 50px; } .pc6-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; } .pc6-card { padding: 30px; } .pc6-num { font-size: 56px; font-weight: 900; color: #1e293b; display: block; margin-bottom: 16px; } .pc6-card h3 { font-size: 16px; font-weight: 700; color: #f59e0b; letter-spacing: 2px; margin: 0 0 16px; } .pc6-card p { font-size: 15px; color: #94a3b8; line-height: 1.7; margin: 0 0 24px; } .pc6-card button { padding: 12px 28px; background: transparent; color: #e2e8f0; border: 1px solid #475569; font-size: 12px; font-weight: 700; letter-spacing: 3px; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            }
        ],
        skills: [
            {
                id: 'sk1', title: 'Team Skills - Bars',
                html: `<section class="sk1-section"><div class="sk1-container"><h2 class="sk1-title">TEAM SKILLS</h2><div class="sk1-list"><div class="sk1-item"><div class="sk1-label"><span>HTML & CSS</span><span>95%</span></div><div class="sk1-bar"><div class="sk1-fill" style="width:95%"></div></div></div><div class="sk1-item"><div class="sk1-label"><span>JavaScript</span><span>69%</span></div><div class="sk1-bar"><div class="sk1-fill" style="width:69%"></div></div></div><div class="sk1-item"><div class="sk1-label"><span>React</span><span>77%</span></div><div class="sk1-bar"><div class="sk1-fill" style="width:77%"></div></div></div></div></div></section>`,
                css: `.sk1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .sk1-container { max-width: 700px; margin: 0 auto; } .sk1-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; text-align: center; } .sk1-list { display: flex; flex-direction: column; gap: 24px; } .sk1-label { display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 8px; } .sk1-bar { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; } .sk1-fill { height: 100%; background: #1e293b; border-radius: 4px; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'sk2', title: 'Professional Skills - Circles',
                html: `<section class="sk2-section"><div class="sk2-container"><h2 class="sk2-title">PROFESSIONAL SKILLS</h2><div class="sk2-grid"><div class="sk2-card"><div class="sk2-circle" style="border-color:#ef4444"><span>91%</span></div><h3>HTML & CSS</h3><p>Lorem Ipsum is dummy text of the printing industry.</p></div><div class="sk2-card"><div class="sk2-circle" style="border-color:#22c55e"><span>83%</span></div><h3>PHP</h3><p>Lorem Ipsum is dummy text of the printing industry.</p></div><div class="sk2-card"><div class="sk2-circle" style="border-color:#f59e0b"><span>72%</span></div><h3>JavaScript</h3><p>Lorem Ipsum is dummy text of the printing industry.</p></div><div class="sk2-card"><div class="sk2-circle" style="border-color:#3b82f6"><span>85%</span></div><h3>Photoshop</h3><p>Lorem Ipsum is dummy text of the printing industry.</p></div></div></div></section>`,
                css: `.sk2-section { padding: 80px 5%; background: #fff; font-family: 'Georgia', serif; } .sk2-container { max-width: 1000px; margin: 0 auto; text-align: center; } .sk2-title { font-size: 36px; font-weight: 400; color: #1e293b; letter-spacing: 12px; margin: 0 0 50px; } .sk2-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; } .sk2-card { text-align: center; } .sk2-circle { width: 80px; height: 80px; border-radius: 50%; border: 3px solid; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; } .sk2-circle span { font-size: 20px; font-weight: 700; color: #1e293b; font-family: 'Inter', sans-serif; } .sk2-card h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 8px; font-family: 'Inter', sans-serif; } .sk2-card p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; font-family: 'Inter', sans-serif; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'sk3', title: 'Work Skills - Progress',
                html: `<section class="sk3-section"><div class="sk3-container"><h2 class="sk3-title">WORK SKILLS</h2><div class="sk3-grid"><div class="sk3-item"><div class="sk3-icon">🎯</div><h3>Strategy</h3><div class="sk3-bar"><div class="sk3-fill" style="width:90%;background:#4f46e5"></div></div></div><div class="sk3-item"><div class="sk3-icon">🎨</div><h3>Design</h3><div class="sk3-bar"><div class="sk3-fill" style="width:85%;background:#22c55e"></div></div></div><div class="sk3-item"><div class="sk3-icon">💻</div><h3>Development</h3><div class="sk3-bar"><div class="sk3-fill" style="width:78%;background:#f59e0b"></div></div></div></div></div></section>`,
                css: `.sk3-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .sk3-container { max-width: 700px; margin: 0 auto; } .sk3-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; text-align: center; } .sk3-grid { display: flex; flex-direction: column; gap: 28px; } .sk3-item { display: flex; align-items: center; gap: 16px; } .sk3-icon { font-size: 28px; } .sk3-item h3 { font-size: 15px; font-weight: 700; color: #1e293b; min-width: 100px; margin: 0; } .sk3-bar { flex: 1; height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden; } .sk3-fill { height: 100%; border-radius: 5px; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'sk4', title: 'Our Finest Skills',
                html: `<section class="sk4-section"><div class="sk4-container"><h2 class="sk4-title">OUR FINEST SKILLS</h2><div class="sk4-grid"><div class="sk4-card"><div class="sk4-badge">🎨</div><h3>UI/UX Design</h3></div><div class="sk4-card"><div class="sk4-badge">💻</div><h3>Web Dev</h3></div><div class="sk4-card"><div class="sk4-badge">📱</div><h3>Mobile Apps</h3></div></div></div></section>`,
                css: `.sk4-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .sk4-container { max-width: 800px; margin: 0 auto; text-align: center; } .sk4-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .sk4-grid { display: flex; justify-content: center; gap: 40px; } .sk4-card { text-align: center; } .sk4-badge { width: 70px; height: 70px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; margin: 0 auto 12px; } .sk4-card h3 { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'sk5', title: 'Team Skills - Compact',
                html: `<section class="sk5-section"><div class="sk5-container"><h2 class="sk5-title">TEAM SKILLS</h2><div class="sk5-grid"><div class="sk5-item"><span class="sk5-pct">31%</span><span class="sk5-name">Design</span></div><div class="sk5-item"><span class="sk5-pct">50%</span><span class="sk5-name">Marketing</span></div><div class="sk5-item"><span class="sk5-pct">17%</span><span class="sk5-name">Support</span></div><div class="sk5-item"><span class="sk5-pct">83%</span><span class="sk5-name">Development</span></div></div></div></section>`,
                css: `.sk5-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .sk5-container { max-width: 800px; margin: 0 auto; text-align: center; } .sk5-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .sk5-grid { display: flex; justify-content: space-around; } .sk5-item { text-align: center; } .sk5-pct { display: block; font-size: 28px; font-weight: 800; color: #1e293b; margin-bottom: 8px; } .sk5-name { font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'sk6', title: 'Professional Skills - Colored',
                html: `<section class="sk6-section"><div class="sk6-container"><h2 class="sk6-title">PROFESSIONAL SKILLS</h2><div class="sk6-grid"><div class="sk6-card"><div class="sk6-circle" style="background:#ef4444"><span>95%</span></div><h3>HTML & CSS</h3></div><div class="sk6-card"><div class="sk6-circle" style="background:#22c55e"><span>69%</span></div><h3>PHP</h3></div><div class="sk6-card"><div class="sk6-circle" style="background:#f59e0b"><span>77%</span></div><h3>JavaScript</h3></div></div></div></section>`,
                css: `.sk6-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .sk6-container { max-width: 800px; margin: 0 auto; text-align: center; } .sk6-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 40px; } .sk6-grid { display: flex; justify-content: center; gap: 50px; } .sk6-card { text-align: center; } .sk6-circle { width: 80px; height: 80px; border-radius: 50%; color: #fff; font-size: 20px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; } .sk6-card h3 { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            }
        ],
        achievements: [
            {
                id: 'ac1', title: 'Achievements - Stats',
                html: `<section class="ac1-section"><div class="ac1-container"><h2 class="ac1-title">ACHIEVEMENTS</h2><div class="ac1-grid"><div class="ac1-stat"><span class="ac1-num">97</span><p>COURSES</p></div><div class="ac1-stat"><span class="ac1-num">200+</span><p>STUDENTS</p></div><div class="ac1-stat"><span class="ac1-num">15</span><p>AWARDS</p></div></div></div></section>`,
                css: `.ac1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ac1-container { max-width: 800px; margin: 0 auto; text-align: center; } .ac1-title { font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .ac1-grid { display: flex; justify-content: space-around; } .ac1-stat { text-align: center; } .ac1-num { font-size: 48px; font-weight: 300; color: #1e293b; display: block; margin-bottom: 8px; } .ac1-stat p { font-size: 13px; font-weight: 700; color: #64748b; letter-spacing: 3px; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ac2', title: 'Achievements - With Image',
                html: `<section class="ac2-section"><div class="ac2-container"><div class="ac2-left"><h2>ACHIEVEMENTS</h2><div class="ac2-stats"><div class="ac2-stat"><span>82</span><p>PROJECTS DONE</p><div class="ac2-line"></div></div><div class="ac2-stat"><span>150+</span><p>HAPPY CLIENTS</p><div class="ac2-line"></div></div><div class="ac2-stat"><span>9</span><p>AWARDS WON</p><div class="ac2-line"></div></div></div></div><div class="ac2-right"><img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" alt="Achievements" /></div></div></section>`,
                css: `.ac2-section { padding: 80px 5%; background: #fff; font-family: 'Georgia', serif; } .ac2-container { display: flex; gap: 60px; max-width: 1000px; margin: 0 auto; align-items: center; } .ac2-left { flex: 1; } .ac2-left h2 { font-size: 28px; font-weight: 400; color: #1e293b; letter-spacing: 6px; margin: 0 0 40px; } .ac2-stats { display: flex; gap: 40px; } .ac2-stat { text-align: center; } .ac2-stat span { font-size: 42px; font-weight: 300; color: #1e293b; display: block; margin-bottom: 8px; font-family: 'Inter', sans-serif; } .ac2-stat p { font-size: 11px; font-weight: 700; color: #f59e0b; letter-spacing: 3px; margin: 0 0 12px; font-family: 'Inter', sans-serif; } .ac2-line { width: 30px; height: 2px; background: #1e293b; margin: 0 auto; } .ac2-right { flex: 1; } .ac2-right img { width: 100%; border-radius: 8px; }`,
                preview: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop'
            },
            {
                id: 'ac3', title: 'Achievements - Inline',
                html: `<section class="ac3-section"><div class="ac3-container"><h2 class="ac3-title">ACHIEVEMENTS</h2><div class="ac3-grid"><div class="ac3-stat"><span>130+</span><p>Projects</p></div><div class="ac3-stat"><span>72</span><p>Clients</p></div><div class="ac3-stat"><span>14</span><p>Awards</p></div><div class="ac3-stat"><span>99%</span><p>Satisfaction</p></div><div class="ac3-stat"><span>22k</span><p>Students</p></div></div></div></section>`,
                css: `.ac3-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .ac3-container { max-width: 900px; margin: 0 auto; text-align: center; } .ac3-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .ac3-grid { display: flex; justify-content: space-around; } .ac3-stat { text-align: center; } .ac3-stat span { font-size: 32px; font-weight: 800; color: #1e293b; display: block; margin-bottom: 4px; } .ac3-stat p { font-size: 13px; color: #64748b; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ac4', title: 'Our Achievements',
                html: `<section class="ac4-section"><div class="ac4-container"><h2 class="ac4-title">OUR ACHIEVEMENTS</h2><div class="ac4-grid"><div class="ac4-card"><span class="ac4-icon">🎓</span><div class="ac4-num">8k+</div><p>Students Enrolled</p></div><div class="ac4-card"><span class="ac4-icon">📚</span><div class="ac4-num">235</div><p>Courses Available</p></div><div class="ac4-card"><span class="ac4-icon">🏆</span><div class="ac4-num">11</div><p>Awards Won</p></div><div class="ac4-card"><span class="ac4-icon">⭐</span><div class="ac4-num">99%</div><p>Satisfaction Rate</p></div></div></div></section>`,
                css: `.ac4-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ac4-container { max-width: 900px; margin: 0 auto; text-align: center; } .ac4-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .ac4-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; } .ac4-card { text-align: center; padding: 20px; } .ac4-icon { font-size: 32px; display: block; margin-bottom: 10px; } .ac4-num { font-size: 36px; font-weight: 800; color: #1e293b; margin-bottom: 6px; } .ac4-card p { font-size: 14px; color: #64748b; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ac5', title: 'Achievements - Dark',
                html: `<section class="ac5-section"><div class="ac5-container"><h2 class="ac5-title">ACHIEVEMENTS</h2><div class="ac5-grid"><div class="ac5-stat"><span>400+</span><p>Projects</p></div><div class="ac5-stat"><span>123</span><p>Clients</p></div><div class="ac5-stat"><span>34</span><p>Awards</p></div></div></div></section>`,
                css: `.ac5-section { padding: 80px 5%; background: #0f172a; font-family: 'Inter', sans-serif; } .ac5-container { max-width: 800px; margin: 0 auto; text-align: center; } .ac5-title { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: 4px; margin: 0 0 40px; } .ac5-grid { display: flex; justify-content: space-around; } .ac5-stat { text-align: center; } .ac5-stat span { font-size: 48px; font-weight: 800; color: #22c55e; display: block; margin-bottom: 8px; } .ac5-stat p { font-size: 14px; color: #94a3b8; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ac6', title: 'Achievements - Cards',
                html: `<section class="ac6-section"><div class="ac6-container"><h2 class="ac6-title">ACHIEVEMENTS</h2><div class="ac6-grid"><div class="ac6-card"><span>20+</span><p>Years Experience</p></div><div class="ac6-card"><span>315</span><p>Projects Completed</p></div><div class="ac6-card"><span>14</span><p>Industry Awards</p></div><div class="ac6-card"><span>12,000</span><p>Happy Students</p></div></div></div></section>`,
                css: `.ac6-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ac6-container { max-width: 1000px; margin: 0 auto; text-align: center; } .ac6-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .ac6-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; } .ac6-card { padding: 28px; background: #f8fafc; border-radius: 12px; text-align: center; } .ac6-card span { font-size: 36px; font-weight: 800; color: #4f46e5; display: block; margin-bottom: 8px; } .ac6-card p { font-size: 14px; color: #475569; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            }
        ],
        testimonials: [
            {
                id: 'ts1', title: 'Happy Clients',
                html: `<section class="ts1-section"><div class="ts1-container"><h2 class="ts1-title">HAPPY CLIENTS</h2><div class="ts1-grid"><div class="ts1-card"><p>"Excellent course content and amazing instructor support. Highly recommended for anyone looking to upskill."</p><h4>— Sarah Johnson</h4></div><div class="ts1-card"><p>"The best learning platform I've used. The projects are practical and the community is very helpful."</p><h4>— Mike Chen</h4></div></div></div></section>`,
                css: `.ts1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ts1-container { max-width: 900px; margin: 0 auto; } .ts1-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 4px; text-align: center; margin: 0 0 40px; } .ts1-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; } .ts1-card { padding: 28px; border: 1px solid #e2e8f0; border-radius: 12px; } .ts1-card p { font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 16px; font-style: italic; } .ts1-card h4 { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ts2', title: 'Testimonials - Photos',
                html: `<section class="ts2-section"><div class="ts2-container"><h2 class="ts2-title">TESTIMONIALS</h2><div class="ts2-grid"><div class="ts2-card"><img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Client" /><p>"A wonderful experience. The courses are well-structured and the mentoring sessions are invaluable."</p><h4>Emily Davis</h4><span>Marketing Manager</span></div><div class="ts2-card"><img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Client" /><p>"Transformed my career completely. I went from beginner to professional in just 6 months."</p><h4>James Wilson</h4><span>Software Developer</span></div><div class="ts2-card"><img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Client" /><p>"The best investment I've made in my education. Premium content at an affordable price."</p><h4>Lisa Anderson</h4><span>UI Designer</span></div></div></div></section>`,
                css: `.ts2-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .ts2-container { max-width: 1000px; margin: 0 auto; text-align: center; } .ts2-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .ts2-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } .ts2-card { background: #fff; padding: 30px 24px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center; } .ts2-card img { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; } .ts2-card p { font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 16px; font-style: italic; } .ts2-card h4 { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 2px; } .ts2-card span { font-size: 12px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ts3', title: 'Customer Testimonials',
                html: `<section class="ts3-section"><div class="ts3-container"><h2 class="ts3-title">CUSTOMER TESTIMONIALS</h2><div class="ts3-grid"><div class="ts3-card"><div class="ts3-stars">⭐⭐⭐⭐⭐</div><p>"Outstanding quality and service. The attention to detail is remarkable."</p><div class="ts3-author"><img src="https://randomuser.me/api/portraits/men/75.jpg" alt="" /><div><h4>Robert Brown</h4><span>CEO, TechCorp</span></div></div></div><div class="ts3-card"><div class="ts3-stars">⭐⭐⭐⭐⭐</div><p>"A game-changer for our team. We've seen incredible results since day one."</p><div class="ts3-author"><img src="https://randomuser.me/api/portraits/women/65.jpg" alt="" /><div><h4>Anna Martinez</h4><span>Product Manager</span></div></div></div></div></div></section>`,
                css: `.ts3-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ts3-container { max-width: 900px; margin: 0 auto; text-align: center; } .ts3-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .ts3-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; } .ts3-card { background: #f8fafc; padding: 28px; border-radius: 12px; text-align: left; } .ts3-stars { font-size: 16px; margin-bottom: 12px; } .ts3-card p { font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 16px; } .ts3-author { display: flex; align-items: center; gap: 12px; } .ts3-author img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; } .ts3-author h4 { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 2px; } .ts3-author span { font-size: 12px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ts4', title: 'What People Say',
                html: `<section class="ts4-section"><div class="ts4-container"><h2 class="ts4-title">WHAT PEOPLE SAY ABOUT US</h2><div class="ts4-content"><p class="ts4-quote">"The learning experience here is second to none. The courses are comprehensive, the instructors are knowledgeable, and the support team is always ready to help."</p><div class="ts4-avatars"><img src="https://randomuser.me/api/portraits/women/44.jpg" alt="" /><img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" /><img src="https://randomuser.me/api/portraits/women/68.jpg" alt="" /></div><h4>Jennifer Smith</h4><span>Senior Developer at Google</span></div></div></section>`,
                css: `.ts4-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ts4-container { max-width: 700px; margin: 0 auto; text-align: center; } .ts4-title { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 40px; } .ts4-quote { font-size: 18px; color: #475569; line-height: 1.7; font-style: italic; margin: 0 0 24px; } .ts4-avatars { display: flex; justify-content: center; gap: -8px; margin-bottom: 16px; } .ts4-avatars img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; margin-left: -8px; } .ts4-avatars img:first-child { margin-left: 0; } .ts4-container h4 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 4px; } .ts4-container span { font-size: 13px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ts5', title: 'Client Reviews',
                html: `<section class="ts5-section"><div class="ts5-container"><h2 class="ts5-title">CLIENT REVIEWS</h2><div class="ts5-card"><div class="ts5-quote">❝</div><p>"Incredibly well-designed platform with top-notch content. The instructors are truly experts in their fields and the community support is phenomenal."</p><h4>David Thompson</h4><span>CTO, StartupHub</span></div></div></section>`,
                css: `.ts5-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .ts5-container { max-width: 700px; margin: 0 auto; text-align: center; } .ts5-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .ts5-card { padding: 40px; } .ts5-quote { font-size: 60px; color: #e2e8f0; line-height: 1; margin-bottom: 16px; } .ts5-card p { font-size: 18px; color: #475569; line-height: 1.7; font-style: italic; margin: 0 0 24px; } .ts5-card h4 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 4px; } .ts5-card span { font-size: 13px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ts6', title: 'Testimonial - Background',
                html: `<section class="ts6-section"><div class="ts6-overlay"><div class="ts6-container"><div class="ts6-line"></div><p class="ts6-quote">"It's easy to use, customizable, and user-friendly. A truly amazing features with reasonable prices."</p><h4>DENNIS ANDERSON</h4><div class="ts6-line2"></div></div></div></section>`,
                css: `.ts6-section { background: url('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&q=80') center/cover no-repeat; font-family: 'Inter', sans-serif; } .ts6-overlay { padding: 100px 5%; background: rgba(0,0,0,0.5); } .ts6-container { max-width: 700px; margin: 0 auto; text-align: center; } .ts6-line { width: 50px; height: 2px; background: #fff; margin: 0 auto 30px; } .ts6-quote { font-size: 24px; color: #fff; line-height: 1.6; font-style: italic; margin: 0 0 24px; font-weight: 300; } .ts6-container h4 { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: 6px; margin: 0 0 16px; } .ts6-line2 { width: 50px; height: 2px; background: #fff; margin: 0 auto; }`,
                preview: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&h=200&fit=crop'
            }
        ],
        partners: [
            {
                id: 'pt1', title: 'Our Partners',
                html: `<section class="pt1-section"><div class="pt1-container"><h2 class="pt1-title">OUR PARTNERS</h2><div class="pt1-grid"><span style="font-family:'Georgia',serif;font-size:22px;letter-spacing:4px;color:#94a3b8">CREATIVE</span><span style="font-family:'Georgia',serif;font-size:22px;font-weight:700;font-style:italic;color:#94a3b8">Steady</span><span style="font-size:18px;font-weight:700;letter-spacing:2px;color:#94a3b8">∞ INFINITECH</span><span style="font-family:'Brush Script MT',cursive;font-size:26px;color:#94a3b8">Light Studio</span><span style="font-size:16px;font-weight:700;letter-spacing:6px;color:#94a3b8;border:1px solid #cbd5e1;padding:4px 12px">SITEPRO</span><span style="font-size:18px;font-weight:300;letter-spacing:3px;color:#94a3b8">design firm</span></div></div></section>`,
                css: `.pt1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pt1-container { max-width: 900px; margin: 0 auto; text-align: center; } .pt1-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .pt1-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px 30px; align-items: center; justify-items: center; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pt2', title: 'Our Clients - Elegant',
                html: `<section class="pt2-section"><div class="pt2-container"><h2 class="pt2-title">OUR CLIENTS</h2><p class="pt2-sub">We are globally recognized and trusted by the world's best names.</p><div class="pt2-grid"><span style="font-family:'Georgia',serif;font-size:24px;letter-spacing:6px;color:#c0c0c0">CREATIVE</span><span style="font-family:'Georgia',serif;font-size:24px;font-weight:700;font-style:italic;color:#c0c0c0">Steady</span><span style="font-size:20px;font-weight:700;letter-spacing:3px;color:#c0c0c0">∞ INFINITECH</span><span style="font-family:'Brush Script MT',cursive;font-size:28px;color:#c0c0c0">Light Studio</span><span style="font-size:18px;font-weight:700;letter-spacing:8px;color:#c0c0c0;border:1px solid #d4d4d4;padding:6px 14px">SITEPRO</span><span style="font-size:20px;font-weight:300;letter-spacing:4px;color:#c0c0c0">design firm</span></div></div></section>`,
                css: `.pt2-section { padding: 80px 5%; background: #fff; font-family: 'Georgia', serif; } .pt2-container { max-width: 900px; margin: 0 auto; text-align: center; } .pt2-title { font-size: 32px; font-weight: 400; color: #1e293b; letter-spacing: 8px; margin: 0 0 12px; } .pt2-sub { font-size: 15px; color: #94a3b8; margin: 0 0 50px; font-family: 'Inter', sans-serif; } .pt2-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px 30px; align-items: center; justify-items: center; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pt3', title: 'Our Clients - Cards',
                html: `<section class="pt3-section"><div class="pt3-container"><h2 class="pt3-title">OUR CLIENTS</h2><div class="pt3-grid"><div class="pt3-card"><span style="font-size:18px;font-weight:700;letter-spacing:4px;color:#64748b">BRAND A</span></div><div class="pt3-card"><span style="font-size:18px;font-weight:700;letter-spacing:4px;color:#64748b">BRAND B</span></div><div class="pt3-card"><span style="font-size:18px;font-weight:700;letter-spacing:4px;color:#64748b">BRAND C</span></div><div class="pt3-card"><span style="font-size:18px;font-weight:700;letter-spacing:4px;color:#64748b">BRAND D</span></div></div></div></section>`,
                css: `.pt3-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .pt3-container { max-width: 800px; margin: 0 auto; text-align: center; } .pt3-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 40px; } .pt3-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; } .pt3-card { padding: 28px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pt4', title: 'Our Partners - Minimal',
                html: `<section class="pt4-section"><div class="pt4-container"><h2 class="pt4-title">OUR PARTNERS</h2><div class="pt4-row"><span>Acme Inc</span><span>•</span><span>Globex</span><span>•</span><span>Initech</span><span>•</span><span>Umbrella</span><span>•</span><span>Stark</span></div></div></section>`,
                css: `.pt4-section { padding: 60px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pt4-container { max-width: 800px; margin: 0 auto; text-align: center; } .pt4-title { font-size: 16px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 30px; } .pt4-row { display: flex; justify-content: center; gap: 16px; align-items: center; flex-wrap: wrap; } .pt4-row span { font-size: 16px; color: #94a3b8; font-weight: 600; letter-spacing: 1px; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pt5', title: 'Our Lovely Clients',
                html: `<section class="pt5-section"><div class="pt5-container"><h2 class="pt5-title">OUR LOVELY CLIENTS</h2><div class="pt5-strip"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=120&fit=crop" alt="" /><img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&h=120&fit=crop" alt="" /><img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&h=120&fit=crop" alt="" /><img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200&h=120&fit=crop" alt="" /></div></div></section>`,
                css: `.pt5-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pt5-container { max-width: 900px; margin: 0 auto; text-align: center; } .pt5-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 30px; } .pt5-strip { display: flex; gap: 16px; justify-content: center; } .pt5-strip img { width: 180px; height: 100px; object-fit: cover; border-radius: 8px; filter: grayscale(100%); opacity: 0.7; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'pt6', title: 'Our Clients - Side Image',
                html: `<section class="pt6-section"><div class="pt6-container"><div class="pt6-img"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" alt="Office" /></div><div class="pt6-content"><h2>OUR CLIENTS</h2><div class="pt6-list"><span>Google</span><span>Microsoft</span><span>Amazon</span><span>Apple</span><span>Meta</span><span>Netflix</span></div></div></div></section>`,
                css: `.pt6-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .pt6-container { display: flex; gap: 50px; max-width: 900px; margin: 0 auto; align-items: center; } .pt6-img { flex: 0 0 200px; } .pt6-img img { width: 100%; border-radius: 8px; } .pt6-content { flex: 1; } .pt6-content h2 { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 20px; } .pt6-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; } .pt6-list span { font-size: 15px; font-weight: 600; color: #64748b; padding: 10px; background: #f8fafc; border-radius: 8px; text-align: center; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            }
        ],
        featured: [
            {
                id: 'fe1', title: 'As Featured On - Inline',
                html: `<section class="fe1-section"><div class="fe1-container"><h2 class="fe1-title">AS FEATURED ON</h2><div class="fe1-row"><span style="font-size:16px;font-weight:700;letter-spacing:3px;color:#94a3b8">FORBES</span><span style="font-size:16px;font-weight:700;letter-spacing:3px;color:#94a3b8">MASHABLE</span><span style="font-size:16px;font-weight:700;letter-spacing:3px;color:#94a3b8">TECHCRUNCH</span><span style="font-size:16px;font-weight:700;letter-spacing:3px;color:#94a3b8">THE VERGE</span></div></div></section>`,
                css: `.fe1-section { padding: 60px 5%; background: #fff; font-family: 'Inter', sans-serif; } .fe1-container { max-width: 800px; margin: 0 auto; text-align: center; } .fe1-title { font-size: 14px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 30px; } .fe1-row { display: flex; justify-content: space-around; align-items: center; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'fe2', title: 'As Featured On - Elegant',
                html: `<section class="fe2-section"><div class="fe2-container"><h2 class="fe2-title">As Featured On</h2><div class="fe2-row"><span style="font-family:'Georgia',serif;font-size:20px;color:#b0b0b0;letter-spacing:2px">Forbes</span><span style="font-size:18px;font-weight:800;color:#b0b0b0;letter-spacing:3px">WIRED</span><span style="font-family:'Georgia',serif;font-size:20px;font-style:italic;color:#b0b0b0">TechCrunch</span><span style="font-size:18px;font-weight:300;color:#b0b0b0;letter-spacing:4px">THE VERGE</span></div></div></section>`,
                css: `.fe2-section { padding: 60px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .fe2-container { max-width: 800px; margin: 0 auto; text-align: center; } .fe2-title { font-size: 16px; font-weight: 600; color: #64748b; letter-spacing: 2px; margin: 0 0 30px; font-family: 'Georgia', serif; } .fe2-row { display: flex; justify-content: space-around; align-items: center; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'fe3', title: 'As Featured On - With Text',
                html: `<section class="fe3-section"><div class="fe3-container"><h2 class="fe3-title">AS FEATURED ON</h2><p class="fe3-desc">Lorem Ipsum is simply dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p><div class="fe3-row"><span style="font-size:18px;font-weight:700;letter-spacing:4px;color:#94a3b8">⊙ UPCLICK</span><span style="font-size:20px;font-weight:800;letter-spacing:6px;color:#94a3b8">MMEDIA</span><span style="font-size:18px;font-weight:700;letter-spacing:4px;color:#94a3b8">WORLDWIDE</span></div></div></section>`,
                css: `.fe3-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .fe3-container { max-width: 700px; margin: 0 auto; text-align: center; } .fe3-title { font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: 6px; margin: 0 0 16px; } .fe3-desc { font-size: 15px; color: #64748b; line-height: 1.7; margin: 0 0 40px; } .fe3-row { display: flex; justify-content: space-around; align-items: center; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'fe4', title: 'As Featured On - Lines',
                html: `<section class="fe4-section"><div class="fe4-container"><h2 class="fe4-title">As Featured On</h2><div class="fe4-line"></div><div class="fe4-row"><span style="font-size:16px;font-weight:700;letter-spacing:3px;color:#94a3b8">CNN</span><span style="font-size:16px;font-weight:700;letter-spacing:3px;color:#94a3b8">BBC</span><span style="font-size:16px;font-weight:700;letter-spacing:3px;color:#94a3b8">NBC</span><span style="font-size:16px;font-weight:700;letter-spacing:3px;color:#94a3b8">FOX</span></div><div class="fe4-line"></div></div></section>`,
                css: `.fe4-section { padding: 60px 5%; background: #fff; font-family: 'Inter', sans-serif; } .fe4-container { max-width: 700px; margin: 0 auto; text-align: center; } .fe4-title { font-size: 16px; font-weight: 600; color: #1e293b; letter-spacing: 2px; margin: 0 0 20px; } .fe4-line { height: 1px; background: #e2e8f0; margin: 16px 0; } .fe4-row { display: flex; justify-content: space-around; align-items: center; padding: 10px 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'fe5', title: 'As Featured On - Dark',
                html: `<section class="fe5-section"><div class="fe5-container"><h2 class="fe5-title">AS FEATURED ON</h2><div class="fe5-row"><span style="font-size:16px;font-weight:700;letter-spacing:4px;color:#475569">FORBES</span><span style="font-size:16px;font-weight:700;letter-spacing:4px;color:#475569">WIRED</span><span style="font-size:16px;font-weight:700;letter-spacing:4px;color:#475569">MASHABLE</span><span style="font-size:16px;font-weight:700;letter-spacing:4px;color:#475569">NBC</span></div></div></section>`,
                css: `.fe5-section { padding: 60px 5%; background: #0f172a; font-family: 'Inter', sans-serif; } .fe5-container { max-width: 800px; margin: 0 auto; text-align: center; } .fe5-title { font-size: 14px; font-weight: 800; color: #94a3b8; letter-spacing: 4px; margin: 0 0 30px; } .fe5-row { display: flex; justify-content: space-around; align-items: center; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'fe6', title: 'As Featured On - Image',
                html: `<section class="fe6-section"><div class="fe6-container"><div class="fe6-left"><img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80" alt="Featured" /></div><div class="fe6-right"><h2>AS FEATURED ON</h2><p>We have been recognized by leading publications worldwide for our commitment to excellence.</p><div class="fe6-logos"><span style="font-weight:700;letter-spacing:3px;color:#94a3b8">FORBES</span><span style="font-weight:700;letter-spacing:3px;color:#94a3b8">WIRED</span><span style="font-weight:700;letter-spacing:3px;color:#94a3b8">NBC</span></div></div></div></section>`,
                css: `.fe6-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .fe6-container { display: flex; gap: 50px; max-width: 900px; margin: 0 auto; align-items: center; } .fe6-left { flex: 0 0 280px; } .fe6-left img { width: 100%; border-radius: 8px; } .fe6-right { flex: 1; } .fe6-right h2 { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 12px; } .fe6-right p { font-size: 15px; color: #64748b; line-height: 1.6; margin: 0 0 24px; } .fe6-logos { display: flex; gap: 24px; font-size: 14px; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            }
        ],
        notfound: [
            {
                id: 'nf1', title: '404 - Background Image',
                html: `<section class="nf1-section"><div class="nf1-overlay"><h1>404</h1><p>PAGE NOT FOUND</p></div></section>`,
                css: `.nf1-section { background: url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80') center/cover no-repeat; font-family: 'Inter', sans-serif; } .nf1-overlay { padding: 120px 5%; background: rgba(0,0,0,0.5); text-align: center; } .nf1-overlay h1 { font-size: 80px; font-weight: 900; color: #fff; margin: 0 0 10px; } .nf1-overlay p { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: 6px; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=200&fit=crop'
            },
            {
                id: 'nf2', title: '404 - Clean',
                html: `<section class="nf2-section"><div class="nf2-container"><h1>404</h1><p class="nf2-sub">Page Not Found</p><p class="nf2-desc">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p><button>Go Home</button></div></section>`,
                css: `.nf2-section { padding: 120px 5%; background: #fff; font-family: 'Inter', sans-serif; } .nf2-container { max-width: 600px; margin: 0 auto; text-align: center; } .nf2-container h1 { font-size: 100px; font-weight: 900; color: #1e293b; margin: 0 0 10px; } .nf2-sub { font-size: 18px; font-weight: 700; color: #1e293b; letter-spacing: 3px; margin: 0 0 16px; } .nf2-desc { font-size: 15px; color: #64748b; line-height: 1.6; margin: 0 0 28px; } .nf2-container button { padding: 12px 32px; background: #1e293b; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'nf3', title: '404 - Oops',
                html: `<section class="nf3-section"><div class="nf3-container"><h1>404</h1><p class="nf3-msg">Oops! The page you're looking for doesn't exist.</p><p class="nf3-sub">Click the link below to return home.</p><a href="#" class="nf3-link">HOMEPAGE</a></div></section>`,
                css: `.nf3-section { padding: 120px 5%; background: #fff; font-family: 'Inter', sans-serif; } .nf3-container { max-width: 600px; margin: 0 auto; text-align: center; } .nf3-container h1 { font-size: 120px; font-weight: 900; color: #0f172a; margin: 0 0 20px; } .nf3-msg { font-size: 18px; color: #475569; margin: 0 0 8px; } .nf3-sub { font-size: 16px; color: #64748b; margin: 0 0 24px; } .nf3-link { font-size: 14px; font-weight: 700; color: #1e293b; text-decoration: underline; letter-spacing: 3px; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'nf4', title: '404 - Something Wrong',
                html: `<section class="nf4-section"><div class="nf4-container"><h2>Something's wrong here...</h2><p>We can't find the page you're looking for. Check out our help center or head back to home.</p><button>Back to Home</button></div></section>`,
                css: `.nf4-section { padding: 120px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .nf4-container { max-width: 500px; margin: 0 auto; text-align: center; } .nf4-container h2 { font-size: 24px; font-weight: 700; color: #1e293b; margin: 0 0 16px; } .nf4-container p { font-size: 15px; color: #64748b; line-height: 1.6; margin: 0 0 24px; } .nf4-container button { padding: 12px 28px; background: #4f46e5; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'nf5', title: '404 - LOST',
                html: `<section class="nf5-section"><div class="nf5-container"><h1>LOST</h1><p>The page you were looking for was moved, removed, renamed or might never existed.</p><a href="#">← Go Back Home</a></div></section>`,
                css: `.nf5-section { padding: 120px 5%; background: #fff; font-family: 'Inter', sans-serif; } .nf5-container { max-width: 500px; margin: 0 auto; text-align: center; } .nf5-container h1 { font-size: 72px; font-weight: 900; color: #1e293b; letter-spacing: 16px; margin: 0 0 20px; } .nf5-container p { font-size: 15px; color: #64748b; line-height: 1.6; margin: 0 0 24px; } .nf5-container a { font-size: 14px; font-weight: 700; color: #4f46e5; text-decoration: none; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'nf6', title: '404 - Error Page',
                html: `<section class="nf6-section"><div class="nf6-container"><h1>4 0 4</h1><h2>ERROR - PAGE NOT FOUND</h2><p>The page you are trying to reach is not available. Please check the URL or go back to the homepage.</p><button>Return Home</button></div></section>`,
                css: `.nf6-section { padding: 120px 5%; background: #0f172a; font-family: 'Inter', sans-serif; } .nf6-container { max-width: 600px; margin: 0 auto; text-align: center; } .nf6-container h1 { font-size: 80px; font-weight: 900; color: #4f46e5; letter-spacing: 20px; margin: 0 0 10px; } .nf6-container h2 { font-size: 16px; font-weight: 800; color: #e2e8f0; letter-spacing: 6px; margin: 0 0 20px; } .nf6-container p { font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 0 0 28px; } .nf6-container button { padding: 12px 32px; background: #4f46e5; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            }
        ],
        comingsoon: [
            {
                id: 'cs1', title: 'Coming Soon - Clean',
                html: `<section class="cs1-section"><div class="cs1-container"><h2>OUR WEBSITE IS COMING VERY SOON</h2><div class="cs1-dots"><span>●</span><span>●</span><span>●</span><span>●</span></div></div></section>`,
                css: `.cs1-section { padding: 120px 5%; background: #fff; font-family: 'Inter', sans-serif; } .cs1-container { max-width: 600px; margin: 0 auto; text-align: center; } .cs1-container h2 { font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 24px; } .cs1-dots { display: flex; justify-content: center; gap: 8px; } .cs1-dots span { font-size: 10px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'cs2', title: 'We Are Coming Soon',
                html: `<section class="cs2-section"><div class="cs2-container"><div class="cs2-icon">▲</div><h2>WE ARE COMING SOON</h2><div class="cs2-line"></div><p>We are working hard to bring you something amazing. Stay tuned!</p><div class="cs2-dots"><span>●</span><span>●</span><span>●</span><span>●</span><span>●</span></div></div></section>`,
                css: `.cs2-section { padding: 120px 5%; background: #fff; font-family: 'Inter', sans-serif; } .cs2-container { max-width: 600px; margin: 0 auto; text-align: center; } .cs2-icon { font-size: 28px; color: #1e293b; margin-bottom: 20px; } .cs2-container h2 { font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 16px; } .cs2-line { width: 40px; height: 2px; background: #1e293b; margin: 0 auto 16px; } .cs2-container p { font-size: 15px; color: #64748b; margin: 0 0 24px; } .cs2-dots { display: flex; justify-content: center; gap: 8px; } .cs2-dots span { font-size: 10px; color: #94a3b8; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'cs3', title: 'Under Maintenance',
                html: `<section class="cs3-section"><div class="cs3-container"><div class="cs3-icon">🖥️</div><h2>SITE IS UNDER MAINTENANCE</h2><p>Please check back in sometime.</p><div class="cs3-social"><span>🌐</span><span>🐦</span><span>📘</span><span>📷</span><span>📌</span></div></div></section>`,
                css: `.cs3-section { padding: 120px 5%; background: #fff; font-family: 'Inter', sans-serif; } .cs3-container { max-width: 600px; margin: 0 auto; text-align: center; } .cs3-icon { font-size: 48px; margin-bottom: 24px; } .cs3-container h2 { font-size: 24px; font-weight: 800; color: #1e293b; letter-spacing: 6px; margin: 0 0 12px; } .cs3-container p { font-size: 16px; color: #64748b; margin: 0 0 30px; } .cs3-social { display: flex; justify-content: center; gap: 16px; font-size: 20px; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'cs4', title: 'Coming Soon - Timer',
                html: `<section class="cs4-section"><div class="cs4-container"><p class="cs4-sub">WE'LL BE THERE SOON</p><h2>COMING SOON</h2><div class="cs4-line"></div><div class="cs4-timer"><div class="cs4-unit"><span>90</span><p>DAYS</p></div><div class="cs4-unit"><span>%</span></div><div class="cs4-dots"><span>●</span><span>●</span><span>●</span><span>●</span></div></div></div></section>`,
                css: `.cs4-section { padding: 120px 5%; background: #fff; font-family: 'Inter', sans-serif; } .cs4-container { max-width: 600px; margin: 0 auto; text-align: center; } .cs4-sub { font-size: 12px; color: #94a3b8; letter-spacing: 3px; margin: 0 0 10px; } .cs4-container h2 { font-size: 28px; font-weight: 800; color: #1e293b; letter-spacing: 8px; margin: 0 0 16px; } .cs4-line { width: 40px; height: 2px; background: #1e293b; margin: 0 auto 24px; } .cs4-timer { display: flex; justify-content: center; align-items: center; gap: 16px; } .cs4-unit { text-align: center; } .cs4-unit span { font-size: 36px; font-weight: 800; color: #1e293b; display: block; } .cs4-unit p { font-size: 11px; color: #94a3b8; letter-spacing: 2px; margin: 4px 0 0; } .cs4-dots { display: flex; gap: 6px; } .cs4-dots span { font-size: 8px; color: #cbd5e1; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'cs5', title: 'Coming Soon - Background',
                html: `<section class="cs5-section"><div class="cs5-overlay"><h2>COMING SOON</h2><p>Our website is currently under construction. We'll be here soon with our new awesome site.</p></div></section>`,
                css: `.cs5-section { background: url('https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1200&q=80') center/cover no-repeat; font-family: 'Inter', sans-serif; } .cs5-overlay { padding: 140px 5%; background: rgba(0,0,0,0.6); text-align: center; } .cs5-overlay h2 { font-size: 36px; font-weight: 900; color: #fff; letter-spacing: 8px; margin: 0 0 16px; } .cs5-overlay p { font-size: 16px; color: #e2e8f0; max-width: 500px; margin: 0 auto; line-height: 1.6; }`,
                preview: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=300&h=200&fit=crop'
            },
            {
                id: 'cs6', title: 'Coming Soon - Dark',
                html: `<section class="cs6-section"><div class="cs6-container"><h2>OUR WEBSITE IS COMING VERY SOON</h2><p>Sorry, our website is currently getting a face lift. Check back with us shortly. Thanks for your patience.</p><div class="cs6-dots"><span>●</span><span>●</span><span>●</span></div></div></section>`,
                css: `.cs6-section { padding: 120px 5%; background: #0f172a; font-family: 'Inter', sans-serif; } .cs6-container { max-width: 600px; margin: 0 auto; text-align: center; } .cs6-container h2 { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: 4px; margin: 0 0 16px; } .cs6-container p { font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px; } .cs6-dots { display: flex; justify-content: center; gap: 8px; } .cs6-dots span { font-size: 10px; color: #475569; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            }
        ],
        helpfaq: [
            {
                id: 'hf1', title: 'FAQs - Simple',
                html: `<section class="hf1-section"><div class="hf1-container"><h2 class="hf1-title">FAQs</h2><div class="hf1-list"><div class="hf1-item"><h4>Q: What is your return policy?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf1-item"><h4>Q: How do I track my order?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf1-item"><h4>Q: Can I change my subscription?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div></div></div></section>`,
                css: `.hf1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .hf1-container { max-width: 700px; margin: 0 auto; } .hf1-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 30px; text-align: center; } .hf1-item { padding: 16px 0; border-bottom: 1px solid #e2e8f0; } .hf1-item h4 { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 8px; } .hf1-item p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'hf2', title: 'FAQs - Two Column',
                html: `<section class="hf2-section"><div class="hf2-container"><h2 class="hf2-title">FAQs</h2><div class="hf2-grid"><div class="hf2-item"><h4>What services do you offer?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf2-item"><h4>How can I contact support?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf2-item"><h4>What are your pricing plans?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf2-item"><h4>Do you offer refunds?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div></div></div></section>`,
                css: `.hf2-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .hf2-container { max-width: 800px; margin: 0 auto; } .hf2-title { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 30px; text-align: center; } .hf2-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; } .hf2-item { padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; } .hf2-item h4 { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 8px; } .hf2-item p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'hf3', title: 'FAQs - Serif Title',
                html: `<section class="hf3-section"><div class="hf3-container"><h2 class="hf3-title">FAQs</h2><div class="hf3-list"><div class="hf3-item"><h4>How do I get started?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf3-item"><h4>Is there a free trial?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf3-item"><h4>Can I upgrade my plan?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div></div></div></section>`,
                css: `.hf3-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .hf3-container { max-width: 700px; margin: 0 auto; } .hf3-title { font-size: 28px; font-weight: 400; color: #1e293b; letter-spacing: 4px; margin: 0 0 30px; text-align: center; font-family: 'Georgia', serif; font-style: italic; } .hf3-item { padding: 16px 0; border-bottom: 1px solid #e2e8f0; } .hf3-item h4 { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 8px; } .hf3-item p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'hf4', title: 'Frequently Asked Questions',
                html: `<section class="hf4-section"><div class="hf4-container"><h2 class="hf4-title">Frequently Asked Questions</h2><div class="hf4-list"><div class="hf4-item"><div class="hf4-num">01</div><div><h4>What is your cancellation policy?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div></div><div class="hf4-item"><div class="hf4-num">02</div><div><h4>How do I update my billing info?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div></div><div class="hf4-item"><div class="hf4-num">03</div><div><h4>Can I pause my subscription?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div></div></div></div></section>`,
                css: `.hf4-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .hf4-container { max-width: 700px; margin: 0 auto; } .hf4-title { font-size: 22px; font-weight: 700; color: #1e293b; margin: 0 0 30px; text-align: center; font-family: 'Georgia', serif; } .hf4-item { display: flex; gap: 16px; padding: 20px 0; border-bottom: 1px solid #e2e8f0; } .hf4-num { font-size: 18px; font-weight: 800; color: #94a3b8; min-width: 30px; } .hf4-item h4 { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 8px; } .hf4-item p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'hf5', title: 'FAQ - Grid',
                html: `<section class="hf5-section"><div class="hf5-container"><h2 class="hf5-title">FAQ</h2><div class="hf5-grid"><div class="hf5-item"><h4>HOW DO I CREATE AN ACCOUNT?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf5-item"><h4>HOW DO I UPDATE MY SETTINGS?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf5-item"><h4>HOW DO I CHANGE MY PASSWORD?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf5-item"><h4>HOW DO I CANCEL MY ORDER?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf5-item"><h4>HOW DO I CLOSE MY ACCOUNT?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf5-item"><h4>HOW DO I CONTACT CUSTOMER SERVICE?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div></div></div></section>`,
                css: `.hf5-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .hf5-container { max-width: 900px; margin: 0 auto; } .hf5-title { font-size: 32px; font-weight: 400; color: #1e293b; margin: 0 0 40px; text-align: center; font-family: 'Georgia', serif; } .hf5-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; } .hf5-item h4 { font-size: 14px; font-weight: 800; color: #1e293b; letter-spacing: 2px; margin: 0 0 10px; } .hf5-item p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'hf6', title: 'FAQ - Dark',
                html: `<section class="hf6-section"><div class="hf6-container"><h2 class="hf6-title">FAQ</h2><div class="hf6-list"><div class="hf6-item"><h4>What platforms do you support?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf6-item"><h4>Is my data secure?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div><div class="hf6-item"><h4>Do you have a mobile app?</h4><p>Lorem Ipsum is simply dummy text of the printing industry.</p></div></div></div></section>`,
                css: `.hf6-section { padding: 80px 5%; background: #0f172a; font-family: 'Inter', sans-serif; } .hf6-container { max-width: 700px; margin: 0 auto; } .hf6-title { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: 3px; margin: 0 0 30px; text-align: center; } .hf6-item { padding: 16px 0; border-bottom: 1px solid #1e293b; } .hf6-item h4 { font-size: 15px; font-weight: 700; color: #e2e8f0; margin: 0 0 8px; } .hf6-item p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            }
        ],
        contact: [
            {
                id: 'ct1', title: 'Contact - 3 Column',
                html: `<section class="ct1-section"><div class="ct1-container"><div class="ct1-col"><div class="ct1-icon">📍</div><h4>OUR LOCATION</h4><p>Your Company Name</p><p>12345 Street Name, City, State 12345</p><p>P: (123) 456 7890 / 456 7891</p></div><div class="ct1-col"><div class="ct1-icon">🕐</div><h4>OPENING HOURS</h4><p>Monday - Friday: 9:00 AM - 10:00 PM</p><p>Saturday: 10:00 AM - 11:00 PM</p><p>Sunday: CLOSED</p></div><div class="ct1-col"><div class="ct1-icon">💬</div><h4>STAY UPDATED</h4><p>Follow us on:</p><p>Instagram: @companyname</p><p>Twitter: @companyname</p></div></div></section>`,
                css: `.ct1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ct1-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; max-width: 900px; margin: 0 auto; } .ct1-icon { font-size: 36px; margin-bottom: 16px; } .ct1-col h4 { font-size: 13px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 16px; } .ct1-col p { font-size: 14px; color: #64748b; line-height: 1.8; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ct2', title: 'Contact - Form',
                html: `<section class="ct2-section"><div class="ct2-container"><h2>SEND US A MESSAGE</h2><div class="ct2-form"><input type="text" placeholder="Your Name" /><input type="email" placeholder="Your Email" /><textarea placeholder="Your Message" rows="4"></textarea><button>Send Message</button></div></div></section>`,
                css: `.ct2-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ct2-container { max-width: 500px; margin: 0 auto; text-align: center; } .ct2-container h2 { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 4px; margin: 0 0 30px; } .ct2-form { display: flex; flex-direction: column; gap: 12px; } .ct2-form input, .ct2-form textarea { padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-family: inherit; } .ct2-form button { padding: 12px; background: #1e293b; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ct3', title: 'Contact - With Question',
                html: `<section class="ct3-section"><div class="ct3-container"><div class="ct3-left"><h2>Do you have something to say?</h2><h3>Contact us!</h3></div><div class="ct3-right"><input type="text" placeholder="Name" /><input type="email" placeholder="Email" /><textarea placeholder="Message" rows="3"></textarea><button>Submit</button></div></div></section>`,
                css: `.ct3-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ct3-container { display: flex; gap: 50px; max-width: 800px; margin: 0 auto; align-items: center; } .ct3-left { flex: 1; } .ct3-left h2 { font-size: 24px; font-weight: 700; color: #1e293b; margin: 0 0 8px; } .ct3-left h3 { font-size: 20px; font-weight: 700; color: #4f46e5; margin: 0; } .ct3-right { flex: 1; display: flex; flex-direction: column; gap: 10px; } .ct3-right input, .ct3-right textarea { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; font-family: inherit; } .ct3-right button { padding: 10px; background: #4f46e5; color: #fff; border: none; border-radius: 6px; font-size: 14px; font-weight: 700; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ct4', title: 'Contact - Minimal',
                html: `<section class="ct4-section"><div class="ct4-container"><h2>GET IN TOUCH</h2><div class="ct4-line"></div><p>Email: hello@yourcompany.com</p><p>Phone: +1 (555) 123-4567</p><p>Address: 123 Business Ave, Suite 100</p></div></section>`,
                css: `.ct4-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ct4-container { max-width: 500px; margin: 0 auto; text-align: center; } .ct4-container h2 { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: 6px; margin: 0 0 16px; } .ct4-line { width: 40px; height: 2px; background: #1e293b; margin: 0 auto 24px; } .ct4-container p { font-size: 15px; color: #64748b; margin: 0 0 8px; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ct5', title: 'Contact - Drop a Line',
                html: `<section class="ct5-section"><div class="ct5-container"><div class="ct5-left"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" alt="Office" /></div><div class="ct5-right"><h2>Drop us a line to get the conversation started.</h2><input type="text" placeholder="Name" /><input type="email" placeholder="Email" /><textarea placeholder="Message" rows="3"></textarea><button>Send</button></div></div></section>`,
                css: `.ct5-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .ct5-container { display: flex; gap: 40px; max-width: 800px; margin: 0 auto; align-items: center; } .ct5-left { flex: 0 0 240px; } .ct5-left img { width: 100%; border-radius: 8px; } .ct5-right { flex: 1; } .ct5-right h2 { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 20px; } .ct5-right input, .ct5-right textarea { width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; font-family: inherit; margin-bottom: 10px; box-sizing: border-box; } .ct5-right button { padding: 10px 28px; background: #1e293b; color: #fff; border: none; border-radius: 6px; font-size: 14px; font-weight: 700; cursor: pointer; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'ct6', title: 'Contact - Background',
                html: `<section class="ct6-section"><div class="ct6-overlay"><h2>CONTACT ME</h2><p>Feel free to reach out for collaborations or just a friendly hello!</p><p class="ct6-email">hello@yourname.com</p></div></section>`,
                css: `.ct6-section { background: url('https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1200&q=80') center/cover no-repeat; font-family: 'Inter', sans-serif; } .ct6-overlay { padding: 120px 5%; background: rgba(99,71,148,0.7); text-align: center; } .ct6-overlay h2 { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: 6px; margin: 0 0 16px; } .ct6-overlay p { font-size: 16px; color: #e2e8f0; margin: 0 0 8px; } .ct6-email { font-size: 18px; font-weight: 700; color: #fff; margin-top: 16px; }`,
                preview: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=300&h=200&fit=crop'
            }
        ],
        information: [
            {
                id: 'in1', title: 'Info - Image & Text',
                html: `<section class="in1-section"><div class="in1-container"><div class="in1-img"><img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" alt="Summer" /></div><div class="in1-content"><h2>WONDERFUL SUMMER GETAWAY</h2><p>Lorem Ipsum is simply dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p></div></div></section>`,
                css: `.in1-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .in1-container { display: flex; gap: 40px; max-width: 900px; margin: 0 auto; align-items: center; } .in1-img { flex: 0 0 300px; } .in1-img img { width: 100%; border-radius: 8px; } .in1-content { flex: 1; } .in1-content h2 { font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: 3px; margin: 0 0 16px; } .in1-content p { font-size: 15px; color: #64748b; line-height: 1.7; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
            },
            {
                id: 'in2', title: 'A New Different Perspective',
                html: `<section class="in2-section"><div class="in2-container"><div class="in2-accent"></div><div class="in2-content"><h2>A NEW DIFFERENT PERSPECTIVE.</h2><p>Lorem Ipsum is simply dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. When an unknown printer took a galley of type and scrambled it to make a type specimen book.</p></div></div></section>`,
                css: `.in2-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .in2-container { display: flex; gap: 30px; max-width: 700px; margin: 0 auto; } .in2-accent { width: 6px; background: #eab308; border-radius: 3px; flex-shrink: 0; } .in2-content h2 { font-size: 22px; font-weight: 900; color: #1e293b; margin: 0 0 16px; } .in2-content p { font-size: 15px; color: #64748b; line-height: 1.7; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'in3', title: 'Time To Think, Time To Create',
                html: `<section class="in3-section"><div class="in3-container"><div class="in3-left"><img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80" alt="Creative" style="width:100%;border-radius:8px;" /></div><div class="in3-right"><h2>Time To Think,<br/>Time To Create.</h2><p>Lorem Ipsum is simply dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text.</p></div></div></section>`,
                css: `.in3-section { padding: 80px 5%; background: #fce7f3; font-family: 'Inter', sans-serif; } .in3-container { display: flex; gap: 40px; max-width: 800px; margin: 0 auto; align-items: center; } .in3-left { flex: 0 0 280px; } .in3-right h2 { font-size: 28px; font-weight: 700; color: #1e293b; margin: 0 0 16px; line-height: 1.3; } .in3-right p { font-size: 15px; color: #64748b; line-height: 1.7; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=200&fit=crop'
            },
            {
                id: 'in4', title: 'Less is More',
                html: `<section class="in4-section"><div class="in4-container"><div class="in4-left"><img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&q=80" alt="Plant" /><img src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&q=80" alt="Nature" /></div><div class="in4-right"><h2>Less is More</h2><p>Lorem Ipsum is simply dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p></div></div></section>`,
                css: `.in4-section { padding: 80px 5%; background: #fff; font-family: 'Inter', sans-serif; } .in4-container { display: flex; gap: 40px; max-width: 800px; margin: 0 auto; align-items: center; } .in4-left { display: flex; gap: 12px; flex: 0 0 300px; } .in4-left img { width: 140px; height: 180px; object-fit: cover; border-radius: 8px; } .in4-right h2 { font-size: 24px; font-weight: 400; color: #1e293b; margin: 0 0 16px; font-family: 'Georgia', serif; font-style: italic; } .in4-right p { font-size: 15px; color: #64748b; line-height: 1.7; margin: 0; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'in5', title: 'Stay Classy',
                html: `<section class="in5-section"><div class="in5-container"><h2>Stay Classy</h2><div class="in5-line"></div><p>Lorem Ipsum is simply dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. When an unknown printer took a galley of type.</p></div></section>`,
                css: `.in5-section { padding: 100px 5%; background: #fff; font-family: 'Georgia', serif; } .in5-container { max-width: 600px; margin: 0 auto; text-align: center; } .in5-container h2 { font-size: 36px; font-weight: 400; color: #1e293b; font-style: italic; margin: 0 0 16px; } .in5-line { width: 50px; height: 2px; background: #1e293b; margin: 0 auto 24px; } .in5-container p { font-size: 15px; color: #64748b; line-height: 1.8; margin: 0; font-family: 'Inter', sans-serif; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            },
            {
                id: 'in6', title: 'Info - Gallery',
                html: `<section class="in6-section"><div class="in6-container"><div class="in6-imgs"><img src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=250&q=80" alt="" /><img src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=250&q=80" alt="" /><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&q=80" alt="" /></div><div class="in6-text"><h2>Make Everything Simple</h2><p>Lorem Ipsum is simply dummy text of the printing industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p></div></div></section>`,
                css: `.in6-section { padding: 80px 5%; background: #f8fafc; font-family: 'Inter', sans-serif; } .in6-container { max-width: 800px; margin: 0 auto; text-align: center; } .in6-imgs { display: flex; gap: 12px; justify-content: center; margin-bottom: 30px; } .in6-imgs img { width: 200px; height: 150px; object-fit: cover; border-radius: 8px; } .in6-text h2 { font-size: 22px; font-weight: 700; color: #1e293b; margin: 0 0 12px; } .in6-text p { font-size: 15px; color: #64748b; line-height: 1.7; margin: 0; max-width: 500px; margin: 0 auto; }`,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
            }
        ]
    };

    const handleApplyTemplate = (template) => {
        const isActualHeader = template.html.trim().startsWith('<header');
        const isActualFooter = template.html.trim().startsWith('<footer');

        if (isActualHeader) {
            // Only replace existing header if applying an actual <header> template
            setHtmlCode(prev => {
                const hasHeader = prev.includes('<header');
                if (hasHeader) {
                    return prev.replace(/<header[\s\S]*?<\/header>/, template.html);
                } else {
                    return template.html + '\n' + prev;
                }
            });
        } else if (isActualFooter) {
            setHtmlCode(prev => {
                const hasFooter = prev.includes('<footer');
                if (hasFooter) {
                    return prev.replace(/<footer[\s\S]*?<\/footer>/, template.html);
                } else {
                    return prev + '\n' + template.html;
                }
            });
        } else {
            setHtmlCode(prev => {
                // For sections (hero, basic, etc.), insert before footer if exists
                if (prev.includes('<footer')) {
                    const parts = prev.split('<footer');
                    // We want to replace only the first part before the footer
                    // but if there are multiple sections, parts might have more than 2 elements
                    // actually split('<footer') will give parts[0] as everything before the first footer
                    return parts[0] + '\n\n' + template.html + '\n\n<footer' + parts.slice(1).join('<footer');
                } else {
                    return prev + '\n\n' + template.html;
                }
            });
        }
        setCssCode(prev => prev + '\n\n' + template.css);
        // Track added section with its category name
        if (activeTemplateCategory && activeTemplateCategory !== 'header' && activeTemplateCategory !== 'footer') {
            const categoryLabel = sections.find(s => s.id === activeTemplateCategory)?.label || activeTemplateCategory;
            setAddedSections(prev => [...prev, { id: Date.now(), category: activeTemplateCategory, label: categoryLabel, title: template.title }]);
        }
        setActiveTemplateCategory(null);
        toast.success(`Applied ${template.title} template!`);
    };

    const sections = [
        { id: 'header', label: 'Header', icon: <Layers size={24} /> },
        { id: 'basic', label: 'Basic', icon: <Layout size={24} /> },
        { id: 'slider', label: 'Slider', icon: <Monitor size={24} /> },
        { id: 'video', label: 'Video', icon: <Video size={24} /> },
        { id: 'footer', label: 'Footer', icon: <Layers size={24} /> },
        { id: 'custom', label: 'Custom Design', icon: <Settings2 size={24} /> },
        { id: 'placeholder', label: 'Placeholder', icon: <Box size={24} /> },
        { id: 'courses', label: 'Courses List', icon: <List size={24} /> },
        { id: 'forms', label: 'Forms', icon: <FormInput size={24} /> },
        { id: 'curriculum', label: 'Curriculum', icon: <BookOpen size={24} /> },
        { id: 'feedback', label: 'Course Feedback', icon: <Star size={24} /> },
        { id: 'photos', label: 'Photos', icon: <ImageIcon size={24} /> },
        { id: 'team', label: 'Team', icon: <Users size={24} /> },
        { id: 'products', label: 'Products, Services', icon: <ShoppingBag size={24} /> },
        { id: 'features', label: 'Features', icon: <CheckSquare size={24} /> },
        { id: 'process', label: 'Process', icon: <Zap size={24} /> },
        { id: 'pricing', label: 'Pricing', icon: <DollarSign size={24} /> },
        { id: 'skills', label: 'Skills', icon: <Brain size={24} /> },
        { id: 'achievements', label: 'Achievements', icon: <Trophy size={24} /> },
        { id: 'testimonials', label: 'Testimonials', icon: <Quote size={24} /> },
        { id: 'partners', label: 'Partners', icon: <Handshake size={24} /> },
        { id: 'featured', label: 'As Featured On', icon: <Award size={24} /> },
        { id: 'notfound', label: 'Page Not Found', icon: <FileWarning size={24} /> },
        { id: 'comingsoon', label: 'Coming Soon', icon: <Clock size={24} /> },
        { id: 'helpfaq', label: 'Help, FAQ', icon: <HelpCircle size={24} /> },
        { id: 'contact', label: 'Contact', icon: <Phone size={24} /> },
        { id: 'information', label: 'Information', icon: <Info size={24} /> },
    ];

    const filteredSections = sections.filter(s =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const iframeRef = useRef(null);
    const htmlCodeRef = useRef(htmlCode);

    // Keep ref in sync with state
    useEffect(() => {
        htmlCodeRef.current = htmlCode;
    }, [htmlCode]);

    // Function to update iframe content directly without rewriting the whole doc
    const updateIframeContent = (newHtml) => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                const wrapper = doc.getElementById('user-content');
                if (wrapper) {
                    wrapper.innerHTML = newHtml;
                }
            }
        }
    };

    // Write iframe ONLY on mount/view changes - never on htmlCode changes
    useEffect(() => {
        if (!iframeRef.current || isCodeView) return;
        const doc = iframeRef.current.contentDocument;
        if (!doc) return;

        const injectionScript = `
                <script>
                    (function() {
                        var selectedEl = null;

                        // Disable ALL links to prevent navigation
                        var allLinks = document.querySelectorAll('a');
                        for (var i = 0; i < allLinks.length; i++) {
                            allLinks[i].setAttribute('data-href', allLinks[i].getAttribute('href') || '');
                            allLinks[i].removeAttribute('href');
                            allLinks[i].addEventListener('click', function(ev) { ev.preventDefault(); });
                        }

                        // Hover highlight
                        document.addEventListener('mouseover', function(e) {
                            var t = e.target;
                            if (t === document.body || t === document.documentElement || t.id === 'user-content') return;
                            if (t !== selectedEl) {
                                t.style.outline = '2px dashed rgba(79,70,229,0.5)';
                                t.style.outlineOffset = '-2px';
                            }
                            t.style.cursor = 'pointer';
                        });

                        document.addEventListener('mouseout', function(e) {
                            var t = e.target;
                            if (t !== selectedEl) {
                                t.style.outline = 'none';
                                t.style.outlineOffset = '';
                            }
                        });

                        // Single click to select and edit
                        document.addEventListener('click', function(e) {
                            e.preventDefault();
                            var target = e.target;
                            if (target === document.body || target === document.documentElement || target.id === 'user-content') return;

                            // Deselect previous
                            if (selectedEl && selectedEl !== target) {
                                selectedEl.style.outline = 'none';
                                selectedEl.contentEditable = 'false';
                            }

                            // Select new
                            selectedEl = target;
                            selectedEl.style.outline = '2px solid #4f46e5';
                            selectedEl.style.outlineOffset = '-2px';

                            // Make text elements editable immediately
                            if (target.tagName !== 'IMG' && target.tagName !== 'SVG' && target.tagName !== 'path' && target.tagName !== 'VIDEO') {
                                selectedEl.contentEditable = 'true';
                                selectedEl.focus();
                            }

                            var rect = selectedEl.getBoundingClientRect();
                            var section = selectedEl.closest('section') || selectedEl.closest('header') || selectedEl.closest('footer');
                            var sectionRect = null;
                            if (section) {
                                var sRect = section.getBoundingClientRect();
                                sectionRect = { top: sRect.top, left: sRect.left, width: sRect.width, height: sRect.height };
                            }

                            window.parent.postMessage({
                                type: 'ELEMENT_SELECTED',
                                tagName: selectedEl.tagName,
                                text: selectedEl.innerText || '',
                                isImage: selectedEl.tagName === 'IMG',
                                rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                                sectionRect: sectionRect
                            }, '*');
                        });

                        // Sync edits back
                        document.addEventListener('input', function(e) {
                            var wrapper = document.getElementById('user-content');
                            if (wrapper) {
                                window.parent.postMessage({
                                    type: 'CONTENT_UPDATED',
                                    html: wrapper.innerHTML
                                }, '*');
                            }
                        });
                    })();
                </script>
            `;

        const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body { margin: 0; font-family: 'Inter', sans-serif; background: #fff; min-height: 100vh; }
              ${cssCode}
              .builder-highlight { outline: 2px solid #4f46e5 !important; outline-offset: -2px; }
            </style>
          </head>
          <body>
            <div id="user-content">${htmlCodeRef.current}</div>
            ${!isVisualPreview ? injectionScript : ''}
          </body>
        </html>
      `;
        doc.open();
        doc.write(fullHtml);
        doc.close();
    }, [cssCode, isCodeView, isOpen, isVisualPreview]);

    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data.type === 'ELEMENT_SELECTED') {
                setSelectedElement(e.data);
            } else if (e.data.type === 'CONTENT_UPDATED') {
                setHtmlCode(e.data.html);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Formatting functions for the toolbar
    const applyFormatting = (command, value = null) => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow.document.execCommand(command, false, value);
        }
    };

    if (!isOpen) return null;

    const deviceWidths = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px'
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999, background: '#f8fafc',
            display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif'
        }}>
            {/* Top Bar */}
            <div style={{
                height: '60px', background: '#fff', borderBottom: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px',
                flexShrink: 0
            }}>
                {/* Top Left */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none',
                            color: '#64748b', fontSize: '14px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px'
                        }}
                        className="hover:bg-slate-100"
                    >
                        <ChevronLeft size={16} /> <span style={{ fontWeight: 500 }}>Back</span>
                    </button>
                    <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                            Unpublished
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                            {page?.title || 'New Page'}
                        </span>
                    </div>
                </div>

                {/* Top Center: Device & Undo/Redo & View Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <button
                            onClick={() => setActiveDevice('desktop')}
                            style={{ padding: '6px', borderRadius: '6px', background: activeDevice === 'desktop' ? '#fff' : 'transparent', border: 'none', color: activeDevice === 'desktop' ? '#4f46e5' : '#64748b', cursor: 'pointer', boxShadow: activeDevice === 'desktop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                        ><Monitor size={18} /></button>
                        <button
                            onClick={() => setActiveDevice('tablet')}
                            style={{ padding: '6px', borderRadius: '6px', background: activeDevice === 'tablet' ? '#fff' : 'transparent', border: 'none', color: activeDevice === 'tablet' ? '#4f46e5' : '#64748b', cursor: 'pointer', boxShadow: activeDevice === 'tablet' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                        ><Tablet size={18} /></button>
                        <button
                            onClick={() => setActiveDevice('mobile')}
                            style={{ padding: '6px', borderRadius: '6px', background: activeDevice === 'mobile' ? '#fff' : 'transparent', border: 'none', color: activeDevice === 'mobile' ? '#4f46e5' : '#64748b', cursor: 'pointer', boxShadow: activeDevice === 'mobile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                        ><Smartphone size={18} /></button>
                    </div>
                    <div style={{ width: '1px', height: '20px', background: '#cbd5e1' }} />
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <button style={{ padding: '6px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'not-allowed' }}><RotateCcw size={18} /></button>
                        <button style={{ padding: '6px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'not-allowed' }}><RotateCcw size={18} style={{ transform: 'scaleX(-1)' }} /></button>
                    </div>
                    <div style={{ width: '1px', height: '20px', background: '#cbd5e1' }} />
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <button
                            onClick={() => setIsCodeView(!isCodeView)}
                            style={{ padding: '6px', borderRadius: '6px', background: isCodeView ? '#fff' : 'transparent', border: 'none', color: isCodeView ? '#4f46e5' : '#64748b', cursor: 'pointer' }}
                        ><Code size={18} /></button>
                        <button
                            onClick={() => setIsVisualPreview(!isVisualPreview)}
                            style={{ padding: '6px', borderRadius: '6px', background: isVisualPreview ? '#fff' : 'transparent', border: 'none', color: isVisualPreview ? '#4f46e5' : '#64748b', cursor: 'pointer' }}
                        ><Eye size={18} /></button>
                    </div>
                </div>

                {/* Top Right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>
                        Last Edited: <strong>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</strong>
                    </div>
                    <button
                        style={{
                            background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px',
                            fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                        }}
                        onClick={() => { onSave(htmlCode, cssCode); toast.success('Saved successfully!'); }}
                    >
                        <Check size={18} /> Save
                    </button>
                    <button
                        style={{
                            background: '#fff', color: '#4f46e5', border: '1px solid #e2e8f0', padding: '8px 20px', borderRadius: '6px',
                            fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                        }}
                    >
                        <Send size={18} /> Publish
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <div style={{
                    width: '300px', background: '#fff', borderRight: '1px solid #e2e8f0',
                    display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'relative'
                }}>
                    <AnimatePresence mode="wait">
                        {!isAddingSection ? (
                            <motion.div
                                key="main-sidebar"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                style={{ padding: '20px', flex: 1, overflowY: 'auto' }}
                            >
                                <div style={{ marginBottom: '24px' }}>
                                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                                        Section
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
                                            borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer',
                                            fontSize: '14px', color: '#475569'
                                        }} className="hover:bg-slate-50">
                                            <Layers size={16} /> <span>Header</span>
                                        </div>

                                        <div style={{ margin: '12px 0', borderTop: '1px solid #f1f5f9' }} />

                                        {addedSections.map((sec) => (
                                            <div key={sec.id} style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '10px', borderRadius: '6px', background: '#f8fafc',
                                                fontSize: '14px', color: '#1e293b', fontWeight: 500
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    {sections.find(s => s.id === sec.category)?.icon || <Box size={16} />}
                                                    <span>{sec.label}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <button
                                                        onClick={() => setAddedSections(prev => prev.filter(s => s.id !== sec.id))}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}
                                                        title="Remove section"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <GripVertical size={14} className="text-slate-300" />
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => setIsAddingSection(true)}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '6px', border: '1px dashed #cbd5e1',
                                                background: 'none', color: '#4f46e5', fontSize: '14px', fontWeight: 500,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                cursor: 'pointer', marginTop: '12px'
                                            }}
                                            className="hover:bg-slate-50"
                                        >
                                            <Plus size={18} /> Add Sections
                                        </button>

                                        <div style={{ margin: '12px 0', borderTop: '1px solid #f1f5f9' }} />

                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
                                            borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer',
                                            fontSize: '14px', color: '#475569'
                                        }} className="hover:bg-slate-50">
                                            <Layers size={16} /> <span>Footer</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="add-section"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
                            >
                                {/* Add Section Header */}
                                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                                    <button
                                        onClick={() => setIsAddingSection(false)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '4px', background: 'none',
                                            border: 'none', color: '#1e293b', fontSize: '16px', fontWeight: 600,
                                            cursor: 'pointer', padding: '4px 0', marginBottom: '12px'
                                        }}
                                    >
                                        <ChevronLeft size={20} /> Back
                                    </button>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{
                                                width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px',
                                                border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none',
                                                background: '#f8fafc'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    <div style={{ padding: '12px', background: '#f0f4f8', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                                        Add Section
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                        {filteredSections.map(section => (
                                            <div
                                                key={section.id}
                                                onClick={() => {
                                                    if (templates[section.id]) {
                                                        setActiveTemplateCategory(section.id);
                                                    } else {
                                                        toast.info(`Templates for ${section.label} coming soon!`);
                                                    }
                                                }}
                                                style={{
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                    justifyContent: 'center', padding: '24px 12px', gap: '12px',
                                                    borderBottom: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9',
                                                    cursor: 'pointer', textAlign: 'center', transition: 'background 0.2s'
                                                }}
                                                className="hover:bg-slate-50"
                                            >
                                                <div style={{ color: '#475569' }}>{section.icon}</div>
                                                <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>{section.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
                        <button style={{
                            width: '100%', padding: '10px', borderRadius: '6px', background: '#f1f5f9',
                            border: 'none', color: '#475569', fontSize: '13px', fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                        }}>
                            <Settings size={16} /> Page Settings
                        </button>
                    </div>
                </div>

                {/* Main Canvas Area */}
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                    {/* Graphy-Style Editing Toolbar */}
                    <AnimatePresence>
                        {selectedElement && !isCodeView && !isVisualPreview && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    zIndex: 50,
                                    background: '#fff',
                                    borderBottom: '1px solid #e2e8f0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '6px 16px',
                                    gap: '2px'
                                }}
                            >
                                {/* Bold / Italic / Underline */}
                                <button onClick={() => applyFormatting('bold')} title="Bold" style={{ padding: '7px 10px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>B</button>
                                <button onClick={() => applyFormatting('italic')} title="Italic" style={{ padding: '7px 10px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer', fontStyle: 'italic', fontSize: '15px', color: '#1e293b' }}>I</button>
                                <button onClick={() => applyFormatting('underline')} title="Underline" style={{ padding: '7px 10px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '15px', color: '#1e293b' }}>U</button>

                                <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 6px' }} />

                                {/* Text Color */}
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <button title="Text Color" style={{ padding: '7px 10px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 700, color: '#1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                                        A
                                        <span style={{ width: '14px', height: '3px', background: '#ef4444', borderRadius: '1px', marginTop: '2px' }} />
                                    </button>
                                    <input type="color" onChange={(e) => applyFormatting('foreColor', e.target.value)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} title="Pick text color" />
                                </div>

                                {/* Background Color */}
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <button title="Highlight Color" style={{ padding: '7px 10px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        <Palette size={16} color="#475569" />
                                    </button>
                                    <input type="color" onChange={(e) => applyFormatting('hiliteColor', e.target.value)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} title="Pick highlight color" />
                                </div>

                                <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 6px' }} />

                                {/* Heading Selector */}
                                <select
                                    onChange={(e) => {
                                        if (e.target.value === 'p') {
                                            applyFormatting('formatBlock', 'p');
                                        } else {
                                            applyFormatting('formatBlock', e.target.value);
                                        }
                                    }}
                                    style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', color: '#1e293b', cursor: 'pointer', fontWeight: 500, outline: 'none' }}
                                    defaultValue="p"
                                >
                                    <option value="p">Paragraph</option>
                                    <option value="h1">Heading 1</option>
                                    <option value="h2">Heading 2</option>
                                    <option value="h3">Heading 3</option>
                                    <option value="h4">Heading 4</option>
                                </select>

                                <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 6px' }} />

                                {/* Alignment */}
                                <button onClick={() => applyFormatting('justifyLeft')} title="Align Left" style={{ padding: '7px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}><AlignLeft size={16} color="#475569" /></button>
                                <button onClick={() => applyFormatting('justifyCenter')} title="Align Center" style={{ padding: '7px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}><AlignCenter size={16} color="#475569" /></button>
                                <button onClick={() => applyFormatting('justifyRight')} title="Align Right" style={{ padding: '7px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}><AlignRight size={16} color="#475569" /></button>

                                <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 6px' }} />

                                {/* Link */}
                                <button onClick={() => {
                                    const url = prompt('Enter URL:');
                                    if (url) applyFormatting('createLink', url);
                                }} title="Insert Link" style={{ padding: '7px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}><LinkIcon size={16} color="#475569" /></button>

                                {/* More Options */}
                                <button onClick={() => applyFormatting('removeFormat')} title="Clear Formatting" style={{ padding: '7px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}><MoreHorizontal size={16} color="#475569" /></button>

                                <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 6px' }} />

                                {/* Undo / Redo */}
                                <button onClick={() => applyFormatting('undo')} title="Undo" style={{ padding: '7px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}><RotateCcw size={16} color="#475569" /></button>
                                <button onClick={() => applyFormatting('redo')} title="Redo" style={{ padding: '7px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}><RotateCcw size={16} color="#475569" style={{ transform: 'scaleX(-1)' }} /></button>

                                {/* Spacer */}
                                <div style={{ flex: 1 }} />

                                {/* Image Change (conditional) */}
                                {selectedElement.isImage && (
                                    <button onClick={() => toast.info('Image uploader coming soon!')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                        <ImageIcon size={14} /> Change Image
                                    </button>
                                )}

                                {/* Close */}
                                <button onClick={() => setSelectedElement(null)} title="Close Toolbar" style={{ padding: '7px', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}><X size={16} color="#94a3b8" /></button>
                            </motion.div>
                        )}

                        {selectedElement && selectedElement.sectionRect && !isCodeView && !isVisualPreview && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                    position: 'absolute',
                                    top: selectedElement.sectionRect.top + 10,
                                    left: selectedElement.sectionRect.left + 10,
                                    zIndex: 45,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}
                            >
                                <div style={{
                                    background: '#4f46e5', borderRadius: '4px', display: 'flex',
                                    flexDirection: 'column', padding: '2px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                }}>
                                    <button title="Move Up" onClick={() => toast.info('Move Up coming soon!')} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }} className="hover:bg-indigo-600">
                                        <ChevronUp size={14} />
                                    </button>
                                    <button title="Move Down" onClick={() => toast.info('Move Down coming soon!')} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }} className="hover:bg-indigo-600">
                                        <ChevronDown size={14} />
                                    </button>
                                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', margin: '2px 0' }} />
                                    <button title="Add Above" style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }} className="hover:bg-indigo-600">
                                        <Plus size={14} />
                                    </button>
                                    <button title="Settings" style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }} className="hover:bg-indigo-600">
                                        <Settings size={14} />
                                    </button>
                                    <button title="Delete" onClick={() => toast.info('Delete functionality coming soon!')} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }} className="hover:bg-red-500">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isCodeView ? (
                        <div style={{ flex: 1, display: 'flex', background: '#0f172a' }}>
                            <textarea
                                value={htmlCode}
                                onChange={(e) => setHtmlCode(e.target.value)}
                                style={{
                                    flex: 1, background: 'transparent', color: '#e2e8f0', padding: '24px',
                                    fontFamily: 'JetBrains Mono, Menlo, monospace', fontSize: '14px',
                                    border: 'none', outline: 'none', resize: 'none', borderRight: '1px solid #1e293b'
                                }}
                                spellCheck="false"
                            />
                            <textarea
                                value={cssCode}
                                onChange={(e) => setCssCode(e.target.value)}
                                style={{
                                    flex: 1, background: 'transparent', color: '#e2e8f0', padding: '24px',
                                    fontFamily: 'JetBrains Mono, Menlo, monospace', fontSize: '14px',
                                    border: 'none', outline: 'none', resize: 'none'
                                }}
                                spellCheck="false"
                            />
                        </div>
                    ) : (
                        <div style={{
                            flex: 1, padding: '40px', overflow: 'auto', display: 'flex', justifyContent: 'center',
                            background: '#f1f5f9'
                        }}>
                            <div style={{
                                width: deviceWidths[activeDevice], height: 'fit-content', minHeight: '100%',
                                background: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                                borderRadius: activeDevice === 'desktop' ? '0' : '12px',
                                transition: 'width 0.3s ease', position: 'relative', overflow: 'hidden'
                            }}>
                                <iframe
                                    ref={iframeRef}
                                    style={{ width: '100%', height: '100%', border: 'none', minHeight: '800px' }}
                                    title="Page Preview"
                                />

                                {/* Visual Widgets/Controls overlay if needed */}
                                {!isVisualPreview && (
                                    <div style={{ position: 'absolute', top: '100px', right: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <button style={{
                                            width: '40px', height: '40px', borderRadius: '4px', background: '#0ea5e9',
                                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none',
                                            cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                        }}>
                                            <Settings2 size={20} />
                                        </button>
                                        <button style={{
                                            width: '40px', height: '40px', borderRadius: '4px', background: '#f43f5e',
                                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none',
                                            cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                        }}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Template Gallery Overlay */}
                <AnimatePresence>
                    {activeTemplateCategory && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                                backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex',
                                alignItems: 'center', justifyContent: 'center', padding: '40px'
                            }}
                            onClick={() => setActiveTemplateCategory(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    width: '100%', maxWidth: '1000px', height: '85vh', background: '#fff',
                                    borderRadius: '16px', display: 'flex', flexDirection: 'column',
                                    overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                                }}
                            >
                                <div style={{
                                    padding: '24px 32px', borderBottom: '1px solid #e2e8f0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}>
                                    <div>
                                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                                            Choose a {activeTemplateCategory.charAt(0).toUpperCase() + activeTemplateCategory.slice(1)} Template
                                        </h2>
                                        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>
                                            Select a layout to instantly apply it to your page.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setActiveTemplateCategory(null)}
                                        style={{
                                            width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                                            background: '#f1f5f9', color: '#64748b', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                        }}
                                        className="hover:bg-slate-200"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#f8fafc' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
                                        {templates[activeTemplateCategory]?.map(template => (
                                            <div
                                                key={template.id}
                                                onClick={() => handleApplyTemplate(template)}
                                                style={{
                                                    background: '#fff', borderRadius: '12px', overflow: 'hidden',
                                                    border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s'
                                                }}
                                                className="hover:shadow-xl hover:-translate-y-1"
                                            >
                                                <div style={{ position: 'relative', paddingTop: '65%', borderBottom: '1px solid #f1f5f9' }}>
                                                    <img
                                                        src={template.preview}
                                                        alt={template.title}
                                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <div style={{
                                                        position: 'absolute', inset: 0, background: 'rgba(79, 70, 229, 0.1)',
                                                        opacity: 0, transition: 'opacity 0.2s', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center'
                                                    }} className="hover:opacity-100">
                                                        <span style={{
                                                            background: '#4f46e5', color: '#fff', padding: '8px 20px',
                                                            borderRadius: '6px', fontWeight: 600, fontSize: '13px'
                                                        }}>Apply Template</span>
                                                    </div>
                                                </div>
                                                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>{template.title}</span>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {(!templates[activeTemplateCategory] || templates[activeTemplateCategory].length === 0) && (
                                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                                            <Layout size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                            <p>No templates available for this category yet.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PageBuilder;
