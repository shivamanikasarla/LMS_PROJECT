import { useState, useEffect } from 'react'

const Navbar = ({ toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Removed direct DOM manipulation handleMenuClick


  return (
    <header
      className="navbar navbar-expand-lg sticky-top shadow-sm"
      style={{
        minHeight: '64px',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)'
      }}
    >
      <div className="container-fluid px-3">
        <div className="d-flex align-items-center justify-content-between w-100">
          {isMobile && (
            <button
              className="btn btn-link d-lg-none p-2"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
              type="button"
            >
              <i className="bi bi-list fs-4"></i>
            </button>
          )}
          <div className="navbar-brand mb-0">
            <h4
              className="mb-0 fw-bold"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Admin Panel
            </h4>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-link position-relative p-2"
              title="Notifications"
              type="button"
            >
              <i className="bi bi-bell fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                3
              </span>
            </button>
            <button
              className="btn btn-link p-2"
              title="Profile"
              type="button"
            >
              <i className="bi bi-person-circle fs-4"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
