import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

        {/* HEADER */}
        <div className="sidebar-header">
          {/* Title (Fades out when closed) */}
          <div className="sidebar-title">
            LMS Admin
          </div>

          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            title="Toggle Sidebar"
          >
            <i className={`bi ${isOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`} />
          </button>
        </div>

        {/* MENU */}
        <nav className="sidebar-nav">
          <div className="d-flex flex-column gap-1">
            <SidebarItem to="/" icon="house-door" label="Home" />
            <SidebarItem to="/courses" icon="journal-bookmark" label="Courses" />
            <SidebarItem to="/users" icon="people" label="Users" />
            <SidebarItem to="/exams" icon="pencil-square" label="Exams" />
            <SidebarItem to="/webinar" icon="camera-video" label="Webinar" />
            <SidebarItem to="/fee" icon="cash-coin" label="Fee Management" />
            <SidebarItem to="/transport" icon="truck" label="Transport" />
            <SidebarItem to="/certificates" icon="patch-check" label="Certificates" />
            <SidebarItem to="/marketing" icon="bar-chart-line" label="Marketing" />
            <SidebarItem to="/affiliatemarketing" icon="link-45deg" label="Affiliate" />
            <SidebarItem to="/myapp" icon="phone" label="My App" />
            <SidebarItem to="/websites" icon="globe" label="Manage Website" />
            <SidebarItem to="/settings" icon="gear" label="Settings" />
          </div>
        </nav>

        {/* FOOTER / THEME TOGGLE */}
        <div className="sidebar-footer">
          <button
            className="nav-link-item w-100 border-0 bg-transparent"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Theme"
            data-tooltip={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            <span className="nav-icon">
              <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`} />
            </span>
            <span className="nav-label">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>

      </aside>
    </>
  )
}

const SidebarItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
    data-tooltip={label} // Used by CSS for hover effect in collapsed mode
  >
    <span className="nav-icon">
      <i className={`bi bi-${icon}`} />
    </span>
    <span className="nav-label">{label}</span>
  </NavLink>
)

export default Sidebar
