import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { webinarService } from '../../services/webinarService'
import { userService } from '../Users/services/userService'
import LiveCard from './LiveCard'
import UpcomingCard from './UpcomingCard'
import RecordedCard from './RecordedCard'
import { FiArrowLeft, FiLayout, FiCalendar, FiClock, FiAlignLeft, FiUsers, FiImage, FiUploadCloud, FiPlus, FiX, FiAlertTriangle, FiCopy, FiDownload, FiMapPin, FiGlobe, FiCheckCircle } from 'react-icons/fi'
import './Webinars.css';

const Webinars = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [meetingLink, setMeetingLink] = useState('')
    const [dateTime, setDateTime] = useState('')
    const [durationHours, setDurationHours] = useState(0)
    const [durationMinutes, setDurationMinutes] = useState(0)
    const [notes, setNotes] = useState('')
    const [cover, setCover] = useState(null)
    const [memberLimit, setMemberLimit] = useState(100)
    const [type, setType] = useState('upcoming')
    const [mode, setMode] = useState('ONLINE') // ONLINE, OFFLINE, HYBRID
    const [trainerId, setTrainerId] = useState('')
    const [instructors, setInstructors] = useState([])
    const [allowExternal, setAllowExternal] = useState(true)

    // Venue fields for OFFLINE/HYBRID
    const [venueName, setVenueName] = useState('')
    const [venueAddress, setVenueAddress] = useState('')
    const [venueCity, setVenueCity] = useState('')
    const [venueCountry, setVenueCountry] = useState('')
    const [mapLink, setMapLink] = useState('')

    // Lists
    const [learningOutcomes, setLearningOutcomes] = useState([])
    const [newOutcome, setNewOutcome] = useState('')

    const [enableBatchLimit, setEnableBatchLimit] = useState(false)
    const [notifyLearners, setNotifyLearners] = useState(false)
    const [isPaid, setIsPaid] = useState(false)
    const [listPrice, setListPrice] = useState(0)
    const [finalPrice, setFinalPrice] = useState(0)

    // Modal state
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [newWebinarId, setNewWebinarId] = useState(null)

    const [items, setItems] = useState([])
    const [filter, setFilter] = useState('all')
    const [isPublishing, setIsPublishing] = useState(false)

    const location = useLocation()

    useEffect(() => {
        loadItems()
        fetchInstructors()
    }, [])

    const fetchInstructors = async () => {
        try {
            const data = await userService.getAllInstructors()
            const usersList = Array.isArray(data) ? data : []
            
            const enriched = usersList.map(u => {
                const uId = u.userId || u.id;
                let displayName = u.name;
                if (!displayName && (u.firstName || u.lastName)) {
                    displayName = `${u.firstName || ''} ${u.lastName || ''}`.trim();
                }
                return {
                    id: uId,
                    userId: uId,
                    name: displayName || u.email || 'Unknown Instructor',
                    email: u.email || ''
                };
            });

            setInstructors(enriched)
            if (enriched.length > 0) setTrainerId(enriched[0].userId)
        } catch (err) {
            console.error('Error fetching instructors:', err)
        }
    }

    useEffect(() => {
        // pick up ?filter=live/upcoming/recorded if provided
        try {
            const params = new URLSearchParams(location.search)
            const f = params.get('filter') || params.get('type')
            if (f && ['live', 'upcoming', 'recorded', 'all'].includes(f)) setFilter(f)
        } catch (err) { }
    }, [location.search])

    const loadItems = async () => {
        try {
            const data = await webinarService.getAllWebinars()
            const now = new Date()

            // Re-eval status if needed
            const processed = (data || []).map(raw => {
                const parsed = { ...raw };
                parsed.id = raw.webinarId || raw.id;
                parsed.dateTime = raw.startTime || raw.dateTime;
                parsed.duration = raw.durationMinutes || raw.duration;
                parsed.notes = raw.description || raw.notes;
                parsed.memberLimit = raw.maxParticipants || raw.memberLimit;
                
                if (parsed.dateTime && parsed.duration) {
                    const start = new Date(parsed.dateTime)
                    const durationMs = (parseInt(parsed.duration, 10) || 30) * 60 * 1000
                    const end = new Date(start.getTime() + durationMs)
                    let newType = 'upcoming'
                    if (now >= start && now <= end) newType = 'live'
                    else if (now > end) newType = 'recorded'
                    
                    parsed.type = newType;
                }
                return parsed
            })

            // sort by dateTime if available
            processed.sort((a, b) => (a.dateTime || '') > (b.dateTime || '') ? 1 : -1)
            setItems(processed)
        } catch (err) { console.error('Error loading webinars:', err) }
    }

    const handlePublish = async (e) => {
        e && e.preventDefault()
        if (!title.trim()) { alert('Please enter a title'); return }
        if (!meetingLink.trim()) { alert('Please enter a meeting link for online sessions'); return }
        const limit = parseInt(memberLimit, 10) || 0
        if (limit <= 0) { alert('Member limit must be a positive number'); return }

        // Automatic classification logic
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

        const statusEnum = autoType === 'live' ? 'LIVE' : (autoType === 'recorded' ? 'COMPLETED' : 'SCHEDULED');

        const outcomesString = learningOutcomes.length > 0 
            ? "Learning Outcomes:\n" + learningOutcomes.map((o, i) => `${i+1}. ${o}`).join('\n') 
            : "";

        const newItem = {
            title,
            description: outcomesString + (notes ? "\n\nDescription: " + notes : ""),
            trainerId: parseInt(trainerId) || 1,
            mode: mode,
            type: isPaid ? "PAID" : "FREE",
            status: statusEnum,
            startTime: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}T${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}:00`,
            durationMinutes: totalDuration,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
            maxParticipants: enableBatchLimit ? (parseInt(limit) || 99999) : 99999,
            meetingLink: mode !== 'OFFLINE' ? meetingLink : "",
            price: isPaid ? (parseFloat(finalPrice) || 0) : 0,
            allowExternal: allowExternal,
            venueName: mode !== 'ONLINE' ? venueName : "",
            venueAddress: mode !== 'ONLINE' ? venueAddress : "",
            venueCity: mode !== 'ONLINE' ? venueCity : "",
            venueCountry: mode !== 'ONLINE' ? venueCountry : "",
            mapLink: mode !== 'ONLINE' ? mapLink : "",
            cover
        };

        console.log('Original Start:', start);
        console.log('Formatted Payload:', newItem);

        try {
            setIsPublishing(true)
            const created = await webinarService.createWebinar(newItem)
            console.log('Webinar Created Response:', created);
            window.dispatchEvent(new Event('webinar-added'));
            
            // Show modal instead of redirect
            setNewWebinarId(created?.webinarId || created?.id || Math.floor(Math.random() * 1000000))
            setShowSuccessModal(true)
        } catch (err) {
            console.error('Error publishing webinar:', err)
            alert('Failed to publish webinar: ' + err.message)
        } finally {
            setIsPublishing(false)
        }
    }

    const onCoverChange = (e) => {
        const f = e.target.files && e.target.files[0]
        if (f) setCover(URL.createObjectURL(f))
    }

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

    const addOutcome = () => {
        if (newOutcome.trim()) {
            setLearningOutcomes([...learningOutcomes, newOutcome.trim()])
            setNewOutcome('')
        }
    }

    const removeOutcome = (index) => {
        setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index))
    }

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
        <div className="create-page">
            <header className="create-header">
                <div className="left">
                    <button className="link-back" onClick={() => navigate(-1)}>
                        <FiArrowLeft size={20} />
                    </button>
                    <h2>Create a webinar</h2>
                </div>
                <div className="right">
                    <button className="btn publish" onClick={handlePublish}>
                        <FiUploadCloud size={18} style={{ marginRight: 8 }} />
                        Publish
                    </button>
                </div>
            </header>

            <form className="create-container" onSubmit={handlePublish}>
                <div className="create-left-column">
                    <div className="form-sections">
                        <label className="field">
                            <div className="label">Webinar title *</div>
                            <div className="input-wrapper">
                                <FiLayout className="input-icon" />
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter webinar title" required />
                            </div>
                        </label>

                        <label className="field">
                            <div className="label">Webinar mode *</div>
                            <div className="input-wrapper">
                                <FiGlobe className="input-icon" />
                                <select value={mode} onChange={(e) => setMode(e.target.value)} style={{width:'100%', border:'none', background:'transparent', outline:'none'}}>
                                    <option value="ONLINE">ONLINE</option>
                                    <option value="OFFLINE">OFFLINE</option>
                                    <option value="HYBRID">HYBRID</option>
                                </select>
                            </div>
                        </label>

                        {mode !== 'OFFLINE' && (
                            <label className="field">
                                <div className="label">Meeting Link *</div>
                                <div className="input-wrapper">
                                    <FiUploadCloud className="input-icon" />
                                    <input type="text" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="Zoom, GMeet, or session link" required />
                                </div>
                            </label>
                        )}

                        {mode !== 'ONLINE' && (
                            <>
                                <label className="field">
                                    <div className="label">Venue Name *</div>
                                    <div className="input-wrapper">
                                        <FiMapPin className="input-icon" />
                                        <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="Hotel Taj, Conference Hall A..." />
                                    </div>
                                </label>
                                <label className="field">
                                    <div className="label">Venue Address *</div>
                                    <div className="input-wrapper">
                                        <FiMapPin className="input-icon" />
                                        <input type="text" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} placeholder="Street, Building name..." />
                                    </div>
                                </label>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                                    <label className="field">
                                        <div className="label">City *</div>
                                        <div className="input-wrapper">
                                            <FiMapPin className="input-icon" />
                                            <input type="text" value={venueCity} onChange={(e) => setVenueCity(e.target.value)} placeholder="New Delhi" />
                                        </div>
                                    </label>
                                    <label className="field">
                                        <div className="label">Country *</div>
                                        <div className="input-wrapper">
                                            <FiGlobe className="input-icon" />
                                            <input type="text" value={venueCountry} onChange={(e) => setVenueCountry(e.target.value)} placeholder="India" />
                                        </div>
                                    </label>
                                </div>
                                <label className="field">
                                    <div className="label">Google Maps Link</div>
                                    <div className="input-wrapper">
                                        <FiMapPin className="input-icon" />
                                        <input type="text" value={mapLink} onChange={(e) => setMapLink(e.target.value)} placeholder="Paste map location link" />
                                    </div>
                                </label>
                            </>
                        )}

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
                            <div className="input-wrapper textarea-wrapper" style={{marginBottom: 0}}>
                                <FiAlignLeft className="input-icon" style={{ top: 14 }} />
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe the webinar" />
                            </div>
                        </label>
                    </div>

                    <div className="form-toggle-sections">
                        <div className="toggle-block">
                            <div className="form-toggle-row-clean">
                                <span>Enable Batch Limit</span>
                                <label className="switch">
                                    <input type="checkbox" checked={enableBatchLimit} onChange={(e) => setEnableBatchLimit(e.target.checked)} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            {enableBatchLimit && (
                                <div className="toggle-expand-content">
                                    <div className="label" style={{fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8}}>MAX PARTICIPANTS</div>
                                    <div className="input-wrapper" style={{width: '100%'}}>
                                        <FiUsers className="input-icon" />
                                        <input type="number" min="1" value={memberLimit} onChange={(e) => setMemberLimit(e.target.value)} style={{width: '100%', padding: '14px 16px', paddingLeft: '48px', borderRadius: '12px', border: '1px solid #e2e8f0'}} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="toggle-block">
                            <div className="form-toggle-row-clean">
                                <span>Notify learners via email</span>
                                <label className="switch">
                                    <input type="checkbox" checked={notifyLearners} onChange={(e) => setNotifyLearners(e.target.checked)} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="toggle-block">
                            <div className="form-toggle-row-clean">
                                <span>Allow External Participants</span>
                                <label className="switch">
                                    <input type="checkbox" checked={allowExternal} onChange={(e) => setAllowExternal(e.target.checked)} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="toggle-block">
                            <div className="form-toggle-row-clean">
                                <span>Paid webinar</span>
                                <label className="switch">
                                    <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            {isPaid && (
                                <div className="toggle-expand-content">
                                    <div style={{color: '#ef4444', fontSize: '13px', marginBottom: '16px'}}>Note: Connect your payment gateway to receive funds</div>
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                                        <div>
                                            <div style={{fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8}}>LIST PRICE</div>
                                            <div className="input-wrapper" style={{display: 'flex'}}>
                                                <div style={{padding: '14px', border: '1px solid #e2e8f0', borderRight: 'none', borderRadius: '12px 0 0 12px', background: '#f8fafc', color: '#64748b', fontSize: '15px', display: 'flex', alignItems: 'center'}}>
                                                    <span>₹</span>
                                                    <FiCalendar size={12} style={{marginLeft:4, opacity:0}}/>
                                                </div>
                                                <input type="number" placeholder="0" value={listPrice} onChange={(e) => setListPrice(e.target.value)} style={{width: '100%', padding: '14px 16px', borderRadius: '0 12px 12px 0', border: '1px solid #e2e8f0'}} />
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8}}>FINAL PAYABLE PRICE</div>
                                            <div className="input-wrapper" style={{display: 'flex'}}>
                                                <div style={{padding: '14px', border: '1px solid #e2e8f0', borderRight: 'none', borderRadius: '12px 0 0 12px', background: '#f8fafc', color: '#64748b', fontSize: '15px', display: 'flex', alignItems: 'center'}}>
                                                    <span>₹</span>
                                                    <FiCalendar size={12} style={{marginLeft:4, opacity:0}}/>
                                                </div>
                                                <input type="number" placeholder="Price" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} style={{width: '100%', padding: '14px 16px', borderRadius: '0 12px 12px 0', border: '1px solid #e2e8f0'}} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="dynamic-lists">
                        <div className="dynamic-section">
                            <div className="ds-header">
                                <span className="ds-title">Webinar Host / Instructor *</span>
                            </div>
                            <div className="input-wrapper" style={{marginTop: 12, position: 'relative', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s'}}>
                                <FiUsers className="input-icon" style={{color: '#64748b'}} />
                                <select 
                                    value={trainerId} 
                                    onChange={(e) => setTrainerId(e.target.value)}
                                    style={{
                                        width: '100%', 
                                        border: 'none', 
                                        background: 'transparent', 
                                        outline: 'none', 
                                        padding: '14px 16px', 
                                        paddingLeft: '48px',
                                        paddingRight: '40px',
                                        appearance: 'none',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        color: '#1e293b'
                                    }}
                                >
                                    <option value="" disabled>Select Instructor</option>
                                    {instructors.map(inst => (
                                        <option key={inst.id} value={inst.id}>
                                            {inst.name} {inst.email ? `(${inst.email})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <div style={{position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b'}}>
                                    <FiArrowLeft style={{transform: 'rotate(-90deg)'}} size={14} />
                                </div>
                            </div>
                        </div>

                        <div className="dynamic-section">
                            <div className="ds-header">
                                <span className="ds-title">Learning outcomes</span>
                            </div>
                            <div className="ds-input-row" style={{display:'flex', gap: 12, marginTop: 12}}>
                                <div className="input-wrapper" style={{flex: 1, marginBottom: 0}}>
                                    <FiCheckCircle className="input-icon" />
                                    <input 
                                        type="text" 
                                        value={newOutcome} 
                                        onChange={(e) => setNewOutcome(e.target.value)} 
                                        placeholder="Ex: Learn advanced React patterns"
                                        style={{width: '100%', border: 'none', background: 'transparent', outline: 'none', padding: '14px 16px', paddingLeft: '48px'}}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOutcome())}
                                    />
                                </div>
                                <button type="button" className="ds-add-btn-main" onClick={addOutcome} style={{background: '#0f172a', color: '#fff', border: 'none', padding: '0 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'}}>Add</button>
                            </div>
                            
                            <div className="ds-list" style={{marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10}}>
                                <AnimatePresence>
                                    {learningOutcomes.map((outcome, idx) => (
                                        <motion.div 
                                            key={idx} 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="ds-item" 
                                            style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px', background:'#fff', borderRadius:'12px', border:'1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}
                                        >
                                            <div style={{display:'flex', alignItems:'center', gap: 12}}>
                                                <div style={{width: 6, height: 6, borderRadius: '50%', background: '#3b82f6'}}></div>
                                                <span style={{fontSize:'14.5px', color:'#334155', fontWeight: 500}}>{outcome}</span>
                                            </div>
                                            <button type="button" onClick={() => removeOutcome(idx)} style={{background:'rgba(239, 68, 68, 0.1)', border:'none', color:'#ef4444', width: 28, height: 28, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor:'pointer', transition: 'all 0.2s'}}><FiX size={14}/></button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {learningOutcomes.length === 0 && (
                                    <div className="ds-body dashed-box" style={{padding: '32px', borderRadius: '16px', border: '2px dashed #e2e8f0', background: '#f8fafc'}}>
                                        <FiPlus className="ds-icon" style={{color: '#94a3b8', fontSize: '24px'}} />
                                        <span style={{color: '#64748b', fontWeight: 500}}>Add key takeaways for students</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="create-sidebar">
                    <button type="submit" className="btn publish ds-publish-btn">
                        <FiUploadCloud size={18} style={{ marginRight: 8 }} />
                        Publish Webinar
                    </button>
                    
                    <div className="preview-card-wrap">
                        <div className="preview-label">WEBINAR PREVIEW CARD</div>
                        <div className="preview-card-inner">
                            <div className="preview-image-bg" style={{backgroundImage: `url(${cover || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'})`}}>
                                <div className="preview-content">
                                    <span className={`preview-badge ${isPaid ? 'paid' : ''}`}>{isPaid ? 'PREMIUM WEBINAR' : 'FREE WEBINAR'}</span>
                                    <h3 className="preview-title">{title || 'Your Awesome Webinar Title'}</h3>
                                    <div className="preview-meta">
                                        <span><FiCalendar size={12} style={{marginRight: 4}}/> {dateTime ? new Date(dateTime).toLocaleDateString() : '10 Mar'}</span>
                                        <span style={{margin:'0 8px'}}>•</span>
                                        <span><FiClock size={12} style={{marginRight: 4}}/> {durationHours || durationMinutes ? `${durationHours}h ${durationMinutes}m` : '0m'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label className="upload-btn">
                            <FiImage size={16} style={{marginRight: 8}}/>
                            Upload Custom Image
                            <input type="file" accept="image/*" onChange={onCoverChange} style={{display: 'none'}} />
                        </label>
                    </div>
                </aside>
            </form>

            <section style={{ padding: '24px 32px' }}>

                <motion.div
                    className="webinar-cards"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >

                    {visible.map(item => (
                        <motion.div key={item.id} className="webinar-grid-item" variants={itemVariants}>
                            {item.type === 'live' && <LiveCard item={item} />}
                            {item.type === 'upcoming' && <UpcomingCard item={item} />}
                            {item.type === 'recorded' && <RecordedCard item={item} />}
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Share Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <div className="share-modal-overlay">
                        <motion.div 
                            className="share-modal"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        >
                            <div className="sm-header">
                                <h2>Share</h2>
                                <button className="sm-close" onClick={() => navigate('/webinar')}>
                                    <FiX size={20} />
                                </button>
                            </div>
                            
                            <div className="sm-content-grid">
                                <div className="sm-left">
                                    <div className="sm-warning-box">
                                        <FiAlertTriangle className="sm-warning-icon" />
                                        <span>Connect your bank account to start receiving payments</span>
                                        <button className="sm-connect-btn">⚡ Connect</button>
                                    </div>
                                    
                                    <div className="sm-info">
                                        <h3>Ready to go live?</h3>
                                        <p>Your webinar has been successfully scheduled. Share the link below with your audience to start getting registrations.</p>
                                    </div>
                                    
                                    <div className="sm-link-box">
                                        <span className="sm-link-text">{window.location.origin}/sessions/{newWebinarId || '262209'}</span>
                                        <button className="sm-copy-btn" onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/sessions/${newWebinarId || '262209'}`)
                                        }}><FiCopy size={16}/></button>
                                    </div>
                                    
                                    <button className="sm-download-btn">
                                        <FiDownload style={{marginRight: 8}}/> Download Resource
                                    </button>
                                </div>
                                
                                <div className="sm-right">
                                    <div className="sm-ticket">
                                        <div className="sm-ticket-badge">
                                            <div className="sm-dot"></div> Webinar
                                        </div>
                                        <h3 className="sm-ticket-title">{title || 'Your Awesome Webinar Title'}</h3>
                                        <div className="sm-ticket-date">
                                            <FiCalendar size={12} style={{marginRight: 4}}/>
                                            {dateTime ? new Date(dateTime).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true}) : 'Mar 13, 2026, 05:39 PM'}
                                        </div>
                                        
                                        <div className="sm-ticket-footer">
                                            <div className="sm-avatar">G</div>
                                            <span className="sm-brand">gyantrixacademy</span>
                                        </div>
                                        
                                        {/* Decorative circles for the ticket look */}
                                        <div className="sm-circle top-right"></div>
                                        <div className="sm-circle bottom-left"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default Webinars