import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { webinarService } from '../../services/webinarService'
import LiveCard from './LiveCard'
import UpcomingCard from './UpcomingCard'
import RecordedCard from './RecordedCard'
import { FiSearch, FiPlus, FiCalendar, FiVideo, FiRadio, FiInbox, FiLayout } from 'react-icons/fi'
import './FirstPage.css';

const FirstPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Initialize filter from URL if present, else default to 'all'
  const getInitialFilter = () => {
    const params = new URLSearchParams(location.search)
    const f = params.get('filter')
    if (f && ['all', 'live', 'upcoming', 'recorded'].includes(f)) return f
    return 'all'
  }

  const [activeFilter, setActiveFilter] = useState(getInitialFilter())
  const [searchTerm, setSearchTerm] = useState('')
  const [items, setItems] = useState([])
  const [counts, setCounts] = useState({ live: 0, upcoming: 0, recorded: 0 })
  const [loadError, setLoadError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const f = params.get('filter')
    if (f && ['all', 'live', 'upcoming', 'recorded'].includes(f)) {
      setActiveFilter(f)
    }
  }, [location.search])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setLoadError(null)

      const allWebinars = await webinarService.getAllWebinars()

      const now = new Date();
      // Map backend keys to frontend expected keys
      const loadedItems = (allWebinars || []).map(raw => {
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
          return parsed;
      });

      // Sort by date/time
      loadedItems.sort((a, b) => (a.dateTime || '') > (b.dateTime || '') ? 1 : -1)
      setItems(loadedItems)

      const grouped = { live: 0, upcoming: 0, recorded: 0 }
      loadedItems.forEach(d => {
        const t = d.type || 'upcoming'
        if (grouped[t] !== undefined) grouped[t]++
      })

      setCounts(grouped)
    } catch (err) {
      console.error('Error loading webinars:', err)
      setLoadError(err.message || String(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // We can keep the event listener for local updates if needed, 
    // but typically backend-driven apps rely on re-fetching.
    const handler = () => loadData()
    window.addEventListener('webinar-added', handler)
    return () => window.removeEventListener('webinar-added', handler)
  }, [location.pathname])

  const hasAny = counts.live + counts.upcoming + counts.recorded > 0

  const filteredItems = searchTerm
    ? items.filter(i => (i.title || '').toLowerCase().includes(searchTerm.toLowerCase()))
    : items.filter(i => activeFilter === 'all' ? true : i.type === activeFilter)

  return (
    <div className="firstpage-container">
      {/* Navbar */}
      <nav className="fp-navbar">
        <div className="fp-brand">
          <FiLayout size={24} color="#3b82f6" />
          <span>Webinars</span>
        </div>
        <button
          className="btn-theme"
          onClick={() => navigate('/webinar/webinars?create=1')}
        >
          <FiPlus size={18} />
          Create Webinar
        </button>
      </nav>

      <main className="fp-main">
        {loadError && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: 16, borderRadius: 12, marginBottom: 24 }}>
            Error loading webinars: {loadError}
          </div>
        )}

        {!hasAny ? (
          <div className="fp-hero">
            <h1 className="fp-hero-title">Grow your audience with Webinars</h1>
            <p style={{ fontSize: 18, color: '#64748b', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
              Host engaging live sessions, schedule upcoming events, and share recordings with your audience appropriately.
            </p>

            <button
              className="fp-cta"
              onClick={() => navigate('/webinar/webinars?create=1&type=live')}
            >
              Start Your First Webinar
            </button>

            <div className="fp-features">
              <div className="fp-feature">
                <div style={{ background: '#dbeafe', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <FiRadio size={24} color="#2563eb" />
                </div>
                <h4>Go Live Instantly</h4>
                <p>Launch live sessions to connect with your students in real-time.</p>
              </div>
              <div className="fp-feature">
                <div style={{ background: '#ede9fe', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <FiCalendar size={24} color="#7c3aed" />
                </div>
                <h4>Schedule Events</h4>
                <p>Plan ahead and let your audience register for upcoming sessions.</p>
              </div>
              <div className="fp-feature">
                <div style={{ background: '#f1f5f9', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <FiVideo size={24} color="#475569" />
                </div>
                <h4>Automated Recordings</h4>
                <p>Never miss a moment. All sessions are recorded for future viewing.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="fp-dashboard">
            <div className="fp-dashboard-header-clean">
              <div className="fp-header-top-clean">
                <div className="fp-search-wrapper-clean">
                  <FiSearch className="fp-search-icon" />
                  <input
                    type="text"
                    placeholder="Search webinars..."
                    className="fp-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="fp-dropdown-clean">
                  <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
                    <option value="all">All Webinars</option>
                    <option value="live">Live Webinars</option>
                    <option value="upcoming">Upcoming Webinars</option>
                    <option value="recorded">Recorded Webinars</option>
                  </select>
                </div>

                <button
                  className="btn-theme fp-schedule-btn"
                  onClick={() => navigate('/webinar/webinars?create=1')}
                >
                  <FiPlus size={16} style={{marginRight: 8}}/> Schedule Webinar
                </button>
              </div>
            </div>

            <div className="fp-content-area-clean">
              {filteredItems.length === 0 ? (
                <div className="fp-empty-state">
                  <FiInbox className="fp-empty-icon" />
                  <h3>No {searchTerm ? 'matching' : activeFilter} webinars found</h3>
                  <p>
                    {searchTerm
                      ? `We couldn't find any webinars matching "${searchTerm}"`
                      : `You don't have any ${activeFilter} webinars yet.`}
                  </p>
                  {!searchTerm && (
                    <button className="secondary-btn" style={{ marginTop: 20 }} onClick={() => navigate('/webinar/webinars?create=1')}>
                      Create New Webinar
                    </button>
                  )}
                </div>
              ) : (
                <div className="fp-cards-grid-clean">
                  {filteredItems.map(item => (
                    <SimpleWebinarCard key={item.id} item={item} navigate={navigate} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )
        }
      </main >
    </div >
  )
}

const SimpleWebinarCard = ({ item, navigate }) => {
  return (
    <div className="admin-webinar-card">
      <div className="awc-image-block" style={{ backgroundImage: `url(${item.cover || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500'})` }}>
        <div className="awc-image-overlay">
          <h3 className="awc-title">{item.title || 'Untitled'}</h3>
          <div className="awc-date">
            {item.dateTime ? new Date(item.dateTime).toLocaleString('en-US', {month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true}) : 'No Date Set'}
          </div>
        </div>
      </div>
      <div className="awc-body">
        <p className="awc-desc">{item.notes || 'No description provided.'}</p>
        <div className="awc-footer">
          <span className={`awc-status ${item.type || 'upcoming'}`}>{item.type ? item.type.toUpperCase() : 'UPCOMING'}</span>
          <button className="awc-view-btn" onClick={() => navigate(`/webinar/${item.id}`, { state: { item } })}>View Details</button>
        </div>
      </div>
    </div>
  )
}

export default FirstPage
