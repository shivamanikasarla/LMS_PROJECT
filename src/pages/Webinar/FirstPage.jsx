import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import WebinarCard from './WebinarCard'
import { FiSearch, FiPlus, FiRadio, FiCalendar, FiVideo, FiX } from 'react-icons/fi'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Webinars from './Webinars'
import './FirstPage.css'

const FirstPage = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const location = useLocation()

  // Initialize filter from URL if present, else default to 'all'
  const getInitialFilter = () => {
    const params = new URLSearchParams(location.search)
    const f = params.get('filter')
    if (f && ['live', 'upcoming', 'recorded'].includes(f)) return f
    return 'all'
  }

  const [activeFilter, setActiveFilter] = useState(getInitialFilter())
  const [searchTerm, setSearchTerm] = useState('')
  const [counts, setCounts] = useState({ live: 0, upcoming: 0, recorded: 0 })
  const [loadError, setLoadError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const f = params.get('filter')
    if (f && ['live', 'upcoming', 'recorded'].includes(f)) {
      setActiveFilter(f)
    }
  }, [location.search])

  const loadData = () => {
    try {
      setLoadError(null)
      const keys = Object.keys(sessionStorage).filter(k => k.startsWith('webinar-'))
      const loadedItems = []
      const now = new Date()

      keys.forEach(k => {
        try {
          const raw = sessionStorage.getItem(k)
          if (!raw) return
          let parsed = JSON.parse(raw)
          if (parsed) {
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
            loadedItems.push(parsed)
          }
        } catch (e) {
          console.warn('FirstPage: skipping invalid webinar key', k, e)
        }
      })

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
      setLoadError(err.message || String(err))
    }
  }

  useEffect(() => {
    loadData()
    const handler = () => loadData()
    window.addEventListener('webinar-added', handler)
    return () => window.removeEventListener('webinar-added', handler)
  }, [location.pathname])

  const hasAny = items.length > 0;

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="webinar-firstpage">
      {/* Empty State - Hero Section */}
      {!hasAny && (
        <div className="webinar-empty-state">
          {/* Hero Content */}
          <div className="webinar-hero">
            <h1 className="webinar-hero-title">
              Grow your audience with <span className="text-highlight">Webinars</span>
            </h1>
            <p className="webinar-hero-subtitle">
              Host engaging live sessions, schedule upcoming events, and share recordings with your audience appropriately.
            </p>
            <button
              className="webinar-cta-btn"
              onClick={() => setShowCreateModal(true)}
            >
              Start Your First Webinar
            </button>
          </div>

          {/* Feature Cards */}
          <div className="webinar-features-grid">
            <div className="webinar-feature-card">
              <div className="feature-icon feature-icon-live">
                <FiRadio />
              </div>
              <h3 className="feature-title">Go Live Instantly</h3>
              <p className="feature-description">
                Launch live sessions to connect with your students in real-time.
              </p>
            </div>

            <div className="webinar-feature-card">
              <div className="feature-icon feature-icon-schedule">
                <FiCalendar />
              </div>
              <h3 className="feature-title">Schedule Events</h3>
              <p className="feature-description">
                Plan ahead and let your audience register for upcoming sessions.
              </p>
            </div>

            <div className="webinar-feature-card">
              <div className="feature-icon feature-icon-record">
                <FiVideo />
              </div>
              <h3 className="feature-title">Automated Recordings</h3>
              <p className="feature-description">
                Never miss a moment. All sessions are recorded for future viewing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header & Dashboard */}
      {hasAny && (
        <div className="container-fluid py-3">
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search webinars..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <span className="input-group-text">
                  <FiSearch />
                </span>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <select
                className="form-select"
                value={activeFilter}
                onChange={e => setActiveFilter(e.target.value)}
              >
                <option value="all">All Webinars</option>
                <option value="live">Live ({counts.live})</option>
                <option value="upcoming">Upcoming ({counts.upcoming})</option>
                <option value="recorded">Recorded ({counts.recorded})</option>
              </select>
            </div>
            <div className="col-12 col-md-4 text-md-end">
              <button
                className="btn btn-success w-100 w-md-auto"
                onClick={() => setShowCreateModal(true)}
              >
                <FiPlus className="me-2" /> Schedule Webinar
              </button>
            </div>
          </div>

          {loadError && (
            <div className="alert alert-danger">{loadError}</div>
          )}

          <div className="row g-4">
            {filteredItems.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="text-muted">🔍 No webinars found matching your criteria.</div>
              </div>
            ) : (
              filteredItems.map(item => (
                <div key={item.id} className="col-12 col-sm-6 col-lg-4">
                  <div className="h-100">
                    <WebinarCard item={item} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create Modal Portal */}
      {createPortal(
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                style={{
                  width: '100%',
                  maxWidth: '1200px',
                  height: '90vh',
                  background: '#f8fafc',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >


                {/* Render the Create Form - passing props to adjust its layout */}
                <div style={{ height: '100%', overflowY: 'auto' }}>
                  <Webinars isModal={true} onClose={() => setShowCreateModal(false)} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  )
}

export default FirstPage
