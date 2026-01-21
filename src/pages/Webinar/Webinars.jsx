import './Webinars.css'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import WebinarCard from './WebinarCard'
import { FiArrowLeft, FiLayout, FiCalendar, FiClock, FiAlignLeft, FiUsers, FiImage, FiUploadCloud, FiChevronDown, FiCheckCircle, FiChevronLeft, FiX, FiLink, FiDownload, FiAlertTriangle, FiCopy, FiZap } from 'react-icons/fi'
import WebinarHosts from './components/WebinarHosts'
import LearningOutcomes from './components/LearningOutcomes'
import Testimonials from './components/Testimonials'

const Webinars = ({ isModal = false, onClose }) => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [dateTime, setDateTime] = useState('')
    const [durationHours, setDurationHours] = useState(0)
    const [durationMinutes, setDurationMinutes] = useState(0)
    const [notes, setNotes] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [publishedItem, setPublishedItem] = useState(null)
    const getRandomCover = () => {
        const covers = [
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000', // Study/Notebook
            'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&q=80&w=1000', // Computer/Tech
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000', // Office/Desk
            'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000', // Coding/Developer
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000'  // Meeting/Collaboration
        ];
        return covers[Math.floor(Math.random() * covers.length)];
    };

    const [cover, setCover] = useState(getRandomCover())
    const [isDefaultCover, setIsDefaultCover] = useState(true)
    const [memberLimit, setMemberLimit] = useState(100)
    const [type, setType] = useState('upcoming')

    // ... (rest of code) ...

    const onCoverChange = (e) => {
        const f = e.target.files && e.target.files[0]
        if (f) {
            setCover(URL.createObjectURL(f))
            setIsDefaultCover(false)
        }
    }

    // New Fields
    const [notifyLearners, setNotifyLearners] = useState(false)
    const [isPaid, setIsPaid] = useState(false)
    const [currency, setCurrency] = useState('INR')
    const [listPrice, setListPrice] = useState('')
    const [finalPrice, setFinalPrice] = useState('')
    const [showAdvanced, setShowAdvanced] = useState(false)

    // New Features
    const [batchLimitEnabled, setBatchLimitEnabled] = useState(false)
    const [hosts, setHosts] = useState([])
    const [outcomes, setOutcomes] = useState([])
    const [testimonials, setTestimonials] = useState([])


    const [items, setItems] = useState([])
    const [filter, setFilter] = useState('all')

    const location = useLocation()

    useEffect(() => {
        loadItems()
    }, [])

    useEffect(() => {
        // pick up ?filter=live/upcoming/recorded if provided
        try {
            const params = new URLSearchParams(location.search)
            const f = params.get('filter') || params.get('type')
            if (f && ['live', 'upcoming', 'recorded', 'all'].includes(f)) setFilter(f)
        } catch (err) { /* ignore */ }
    }, [location.search])

    const loadItems = () => {
        try {
            const keys = Object.keys(sessionStorage).filter(k => k.startsWith('webinar-'))
            const now = new Date()
            const data = keys.map(k => {
                const raw = sessionStorage.getItem(k)
                if (!raw) return null
                let parsed = JSON.parse(raw)

                // Re-eval status
                if (parsed.dateTime && parsed.duration) {
                    const start = new Date(parsed.dateTime)
                    const durationMs = (parseInt(parsed.duration, 10) || 30) * 60 * 1000
                    const end = new Date(start.getTime() + durationMs)
                    let newType = 'upcoming'
                    if (now >= start && now <= end) newType = 'live'
                    else if (now > end) newType = 'recorded'

                    if (parsed.type !== newType) {
                        parsed.type = newType
                        sessionStorage.setItem(k, JSON.stringify(parsed))
                    }
                }
                return parsed
            }).filter(Boolean)
            // sort by dateTime if available
            data.sort((a, b) => (a.dateTime || '') > (b.dateTime || '') ? 1 : -1)
            setItems(data)
        } catch (err) { console.error(err) }
    }

    const handlePublish = (e) => {
        e && e.preventDefault()
        if (!title || !dateTime) {
            alert('Please fill in all required fields')
            return
        }
        const limit = parseInt(memberLimit, 10) || 0
        if (batchLimitEnabled && limit <= 0) { alert('Member limit must be a positive number when enabled'); return }

        const now = new Date();
        const start = new Date(dateTime || Date.now());
        const totalDuration = (parseInt(durationHours, 10) || 0) * 60 + (parseInt(durationMinutes, 10) || 0);
        const durationMs = (totalDuration || 30) * 60 * 1000;
        const end = new Date(start.getTime() + durationMs);

        let autoType = 'upcoming';
        if (now >= start && now <= end) {
            autoType = 'live';
        } else if (now > end) {
            autoType = 'recorded';
        } else {
            autoType = 'upcoming';
        }

        const newItem = {
            id: Date.now(),
            title: title || 'Untitled Webinar',
            dateTime,
            duration: `${durationHours || 0}h ${durationMinutes || 0}m`,
            notes: notes || 'No description provided',
            cover: cover,
            memberLimit: batchLimitEnabled ? memberLimit : null,
            attendedCount: 0, // Keep this from original
            type: autoType,
            hosts,
            outcomes,
            testimonials,
            notifyLearners,
            isPaid,
            currency: isPaid ? currency : null,
            listPrice: isPaid ? listPrice : null,
            finalPrice: isPaid ? finalPrice : null
        }

        try {
            sessionStorage.setItem(`webinar-${newItem.id}`, JSON.stringify(newItem));
            window.dispatchEvent(new Event('webinar-added'));
            setPublishedItem(newItem)
            setShowSuccess(true)
        } catch (err) { console.error(err) }
    }

    const handleNavigateToDashboard = () => {
        if (isModal && onClose) {
            onClose();
        } else {
            navigate(`/webinar`)
        }
    }

    // Filter items logic - only relevant if NOT in modal
    const visible = items.filter(i => filter === 'all' ? true : (i.type === filter))

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 }
    };

    return (
        <div className="create-page" style={isModal ? { minHeight: 'auto', padding: '24px', background: 'transparent' } : {}}>
            <header className="create-header">
                <div className="left">
                    {!isModal && (
                        <button className="link-back" onClick={() => navigate(-1)}>
                            <FiArrowLeft size={20} />
                        </button>
                    )}
                    <h2 style={{ color: '#1e293b' }}>Create a webinar</h2>
                </div>
                <div className="right">


                    {isModal && onClose && (
                        <button
                            onClick={onClose}
                            style={{
                                marginLeft: '12px',
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#64748b',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fee2e2'; e.currentTarget.style.background = '#fef2f2'; }}
                            onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}
                        >
                            <FiX size={20} />
                        </button>
                    )}
                </div>
            </header>

            <motion.div
                className="create-container"
                onSubmit={handlePublish}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="create-left-column">
                    <div className="form-sections">
                        <label className="field">
                            <div className="label">Webinar title *</div>
                            <div className="input-wrapper">
                                <FiLayout className="input-icon" />
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mastering React 2024" required />
                            </div>
                        </label>

                        <label className="field two">
                            <div className="label">Webinar date *</div>
                            <div className="input-wrapper">
                                <FiCalendar className="input-icon" />
                                <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                            </div>
                        </label>

                        <label className="field two">
                            <div className="label">Webinar duration *</div>
                            <div className="input-wrapper" style={{ border: 'none', padding: 0, background: 'transparent' }}>
                                <div className="duration-row">
                                    <div className="duration-input-group">
                                        <input
                                            type="number"
                                            min="0"
                                            value={durationHours}
                                            onChange={(e) => setDurationHours(e.target.value)}
                                            placeholder="0"
                                        />
                                        <span className="input-label">Hours</span>
                                    </div>
                                    <div className="duration-input-group">
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={durationMinutes}
                                            onChange={(e) => setDurationMinutes(e.target.value)}
                                            placeholder="0"
                                        />
                                        <span className="input-label">Minutes</span>
                                    </div>
                                </div>
                            </div>
                        </label>

                        <label className="field">
                            <div className="label">Webinar description</div>
                            <div className="input-wrapper textarea-wrapper">
                                <FiAlignLeft className="input-icon" style={{ top: 18 }} />
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe what attendees will learn..." />
                            </div>
                        </label>

                        {/* Batch Limit Toggle & Input */}
                        <div style={{ gridColumn: 'span 2', marginTop: 12 }}>
                            <div className="toggle-wrapper">
                                <span className="toggle-label">Enable Batch Limit</span>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={batchLimitEnabled}
                                        onChange={(e) => setBatchLimitEnabled(e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <AnimatePresence>
                                {batchLimitEnabled && (
                                    <motion.div
                                        className="field"
                                        style={{ marginBottom: 24 }}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <div className="label">Max participants</div>
                                        <div className="input-wrapper">
                                            <FiUsers className="input-icon" />
                                            <input
                                                type="number"
                                                min="1"
                                                value={memberLimit}
                                                onChange={(e) => setMemberLimit(e.target.value)}
                                                placeholder="Enter limit"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* New Toggles */}
                        <div style={{ gridColumn: 'span 2', marginTop: 12 }}>
                            <div className="toggle-wrapper">
                                <span className="toggle-label">Notify learners via email</span>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={notifyLearners}
                                        onChange={(e) => setNotifyLearners(e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="toggle-wrapper">
                                <span className="toggle-label">Paid webinar</span>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={isPaid}
                                        onChange={(e) => setIsPaid(e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <AnimatePresence>
                                {isPaid && (
                                    <motion.div
                                        className="pricing-section"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <span className="payment-warning">
                                            Note: Connect your payment gateway to receive funds
                                        </span>

                                        <div className="pricing-row">
                                            <label className="field" style={{ gridColumn: 'span 1', marginBottom: 0 }}>
                                                <div className="label">List price</div>
                                                <div className="currency-input-group">
                                                    <select
                                                        className="currency-select"
                                                        value={currency}
                                                        onChange={(e) => setCurrency(e.target.value)}
                                                    >
                                                        <option value="INR">₹</option>
                                                        <option value="USD">$</option>
                                                        <option value="EUR">€</option>
                                                    </select>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        value={listPrice}
                                                        onChange={(e) => setListPrice(e.target.value)}
                                                    />
                                                </div>
                                            </label>

                                            <label className="field" style={{ gridColumn: 'span 1', marginBottom: 0 }}>
                                                <div className="label">Final payable price</div>
                                                <div className="currency-input-group">
                                                    <select
                                                        className="currency-select"
                                                        value={currency}
                                                        onChange={(e) => setCurrency(e.target.value)}
                                                        disabled
                                                    >
                                                        <option value="INR">₹</option>
                                                        <option value="USD">$</option>
                                                        <option value="EUR">€</option>
                                                    </select>
                                                    <input
                                                        type="number"
                                                        placeholder="Price"
                                                        value={finalPrice}
                                                        onChange={(e) => setFinalPrice(e.target.value)}
                                                    />
                                                </div>
                                            </label>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Feature Sections */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <WebinarHosts hosts={hosts} setHosts={setHosts} />
                            <LearningOutcomes outcomes={outcomes} setOutcomes={setOutcomes} />
                            <Testimonials testimonials={testimonials} setTestimonials={setTestimonials} />
                        </div>
                    </div>

                </div>





                <motion.aside
                    className="create-sidebar"
                    style={{ alignSelf: 'start', position: 'sticky', top: '20px' }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Sidebar Publish Button */}
                    <button
                        className="btn btn-success"
                        onClick={handlePublish}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontWeight: 700,
                            fontSize: '16px',
                            marginBottom: '24px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                    >
                        <FiUploadCloud size={20} />
                        Publish Webinar
                    </button>
                    <div className="upload-box">
                        <div style={{ marginBottom: '16px', fontWeight: 700, fontSize: '14px', color: '#1e293b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Webinar Preview Card</div>

                        <label className="upload-preview clickable-upload">
                            <input type="file" accept="image/*" onChange={onCoverChange} />

                            <img
                                src={cover}
                                alt="cover"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            />

                            {/* Overlay Title for Default Cover */}
                            {isDefaultCover && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: '24px',
                                    background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.4) 60%, transparent 100%)',
                                    color: 'white',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    minHeight: '60%',
                                    textAlign: 'left'
                                }}>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        color: '#818cf8',
                                        marginBottom: '8px'
                                    }}>
                                        {isPaid ? 'Premium Webinar' : 'Free Webinar'}
                                    </span>
                                    <h3 style={{
                                        margin: 0,
                                        fontSize: '20px',
                                        fontWeight: 800,
                                        lineHeight: 1.3,
                                        textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                        fontFamily: 'Plus Jakarta Sans, sans-serif'
                                    }}>
                                        {title || 'Your Awesome Webinar Title'}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', opacity: 0.9, marginTop: '12px', fontWeight: 500 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FiCalendar size={14} />
                                            {new Date(dateTime || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                        <span>•</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FiClock size={14} />
                                            {(parseInt(durationHours) || 0) > 0 ? `${durationHours}h ` : ''}{durationMinutes || 0}m
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="upload-hover-overlay" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                opacity: 0,
                                transition: 'all 0.3s ease',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%', backdropFilter: 'blur(4px)' }}>
                                    <FiUploadCloud size={24} />
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: 600 }}>Change Cover Image</span>
                            </div>
                        </label>

                        <button
                            type="button"
                            className="btn"
                            style={{
                                width: '100%',
                                marginTop: '20px',
                                background: '#f8fafc',
                                color: '#475569',
                                border: '2px dashed #cbd5e1',
                                padding: '12px',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => document.querySelector('.clickable-upload input').click()}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'; }}
                        >
                            <FiImage /> Upload Custom Image
                        </button>
                    </div>
                </motion.aside>
            </motion.div >

            {/* Only show existing cards if NOT in modal mode (keep modal focused on create) */}
            {
                !isModal && (
                    <section style={{ padding: '18px 28px' }}>
                        <motion.div
                            className="webinar-cards"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {visible.map(item => (
                                <motion.div key={item.id} className="webinar-grid-item" variants={itemVariants}>
                                    <WebinarCard item={item} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                )
            }


            {/* Success Modal */}
            {/* Success Modal */}
            {/* Success Modal */}
            {
                createPortal(
                    <AnimatePresence>
                        {showSuccess && publishedItem && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 2147483647,
                                background: 'rgba(15, 23, 42, 0.6)', // Darker dim for focus
                                backdropFilter: 'blur(8px)',
                                margin: 0,
                                padding: 0,
                                boxSizing: 'border-box'
                            }}>
                                <motion.div
                                    style={{
                                        width: '900px',
                                        maxWidth: '95vw',
                                        background: '#fff',
                                        borderRadius: '32px', // Extra rounded matching screenshot
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                        position: 'relative',
                                        margin: 'auto',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    transition={{ type: 'spring', duration: 0.4 }}
                                >
                                    {/* Header */}
                                    <div style={{
                                        padding: '24px 32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <h3 style={{
                                            fontSize: '24px',
                                            fontWeight: 800,
                                            color: '#1e293b',
                                            margin: 0,
                                            fontFamily: 'Plus Jakarta Sans, sans-serif'
                                        }}>
                                            Share
                                        </h3>
                                        <button
                                            onClick={handleNavigateToDashboard}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#64748b',
                                                padding: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <FiX size={24} />
                                        </button>
                                    </div>

                                    {/* Content Grid */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        padding: '0 32px 40px',
                                        gap: '40px'
                                    }}>
                                        {/* Left Column: Actions */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

                                            {/* Bank Warning (Conditional - showing logic simplified for demo matching the image) */}
                                            {isPaid && (
                                                <div style={{
                                                    background: '#f1f5f9',
                                                    borderRadius: '16px',
                                                    padding: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: '12px'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <FiAlertTriangle size={20} color="#eab308" />
                                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', lineHeight: 1.4 }}>
                                                            Connect your bank account<br />to start receiving payments
                                                        </span>
                                                    </div>
                                                    <button style={{
                                                        background: '#fff',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '20px',
                                                        padding: '6px 16px',
                                                        fontSize: '13px',
                                                        fontWeight: 600,
                                                        color: '#1e293b',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}>
                                                        <FiZap size={14} /> Connect
                                                    </button>
                                                </div>
                                            )}

                                            {/* Spacer if no warning */}
                                            {/* Success Message Content (Fills the gap) */}
                                            <div style={{ marginTop: '12px' }}>
                                                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                                                    Ready to go live?
                                                </h4>
                                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                                                    Your webinar has been successfully scheduled. Share the link below with your audience to start getting registrations.
                                                </p>
                                            </div>

                                            {/* Link Input (Pushed to bottom) */}
                                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <div style={{
                                                    background: '#f8fafc',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    padding: '4px 4px 4px 16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <span style={{
                                                        fontSize: '14px',
                                                        color: '#3b82f6',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        marginRight: '12px'
                                                    }}>
                                                        https://gyantrix.com/sessions/{publishedItem.id}
                                                    </span>
                                                    <button style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        padding: '10px',
                                                        cursor: 'pointer',
                                                        color: '#64748b'
                                                    }}>
                                                        <FiCopy size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Download Button */}
                                            <button style={{
                                                width: '100%',
                                                background: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '24px', // Pill shape
                                                padding: '16px',
                                                fontSize: '16px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                                marginTop: '12px'
                                            }}>
                                                <FiDownload size={20} /> Download Resource
                                            </button>

                                        </div>

                                        {/* Right Column: Preview Card */}
                                        <div style={{
                                            flex: 1,
                                            background: '#f8fafc',
                                            borderRadius: '24px',
                                            padding: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {/* The "Social Poster" Look */}
                                            <div style={{
                                                width: '100%',
                                                aspectRatio: '1',
                                                borderRadius: '16px',
                                                background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)', // Light Purple Gradient
                                                padding: '24px',
                                                position: 'relative',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                boxShadow: '0 10px 30px -5px rgba(167, 139, 250, 0.4)',
                                                overflow: 'hidden'
                                            }}>
                                                {/* Background Pattern (Optional subtle circles) */}
                                                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                                                <div style={{ position: 'absolute', bottom: '-20%', left: '-20%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>

                                                <div style={{ position: 'relative', zIndex: 1 }}>
                                                    {/* Badge */}
                                                    <div style={{
                                                        background: 'white',
                                                        padding: '6px 12px',
                                                        borderRadius: '20px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        color: '#1e293b',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                                    }}>
                                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#000' }}></div>
                                                        Webinar
                                                    </div>

                                                    {/* Title */}
                                                    <h2 style={{
                                                        fontSize: '32px',
                                                        fontWeight: 800,
                                                        color: '#1e293b',
                                                        marginTop: '24px',
                                                        marginBottom: '8px',
                                                        lineHeight: 1.2
                                                    }}>
                                                        {publishedItem.title}
                                                    </h2>

                                                    {/* Date */}
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        color: '#334155',
                                                        fontSize: '14px',
                                                        fontWeight: 600
                                                    }}>
                                                        <FiCalendar />
                                                        {new Date(publishedItem.dateTime).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>

                                                <div style={{ position: 'relative', zIndex: 1 }}>
                                                    {/* Host */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            background: '#fcb900', // Orange placeholder color from image
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                            fontWeight: 700
                                                        }}>
                                                            G
                                                        </div>
                                                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                                                            gyantrixacademy
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* FREE Ribbon logic */}
                                                {!isPaid && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: '30px',
                                                        right: '-40px',
                                                        background: '#fff',
                                                        color: '#1e293b',
                                                        fontWeight: 800,
                                                        fontSize: '12px',
                                                        padding: '4px 40px',
                                                        transform: 'rotate(-45deg)',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px'
                                                    }}>
                                                        FREE
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>,
                    document.body
                )
            }
        </div >
    )
}

export default Webinars