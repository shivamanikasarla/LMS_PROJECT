import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import './DashboardLayout.css'
// Note: Padding p-4 was removed from main to allow full-width pages like Website Builder.
// Individual pages should add their own container/padding.

const DashboardLayout = () => {
  // Lifted State: Manage sidebar open/close here for synchronous layout updates
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      // Auto-collapse on mobile, auto-expand on desktop if desired (or keep user preference)
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  // Calculate content margin based on state
  // Mobile: 0 (overlay), Desktop: 240px (Open) or 72px (Collapsed)
  const contentMarginLeft = isMobile ? '0' : (isSidebarOpen ? '240px' : '72px')

  return (
    <div className="min-vh-100 position-relative" style={{ backgroundColor: 'var(--main-bg)' }}>

      {/* Sidebar with Direct State Control */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className="flex-grow-1 d-flex flex-column min-w-0"
        style={{
          marginLeft: contentMarginLeft,
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '100vh',
          backgroundColor: 'var(--content-bg)'
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        {/* Removed p-4 to allow child pages full control over their layout/padding */}
        <main className="flex-grow-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout