import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import TopNav from './TopNav'
import ContextNav from './ContextNav'

const DashboardLayout = () => {

  // Mobile check preserved 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="d-flex flex-column" style={{ height: '100dvh', backgroundColor: '#f5f7fb' }}>
      {/* 1. PRIMARY NAVIGATION (Top Row) */}
      <div className="flex-shrink-0 w-100">
        <TopNav />
      </div>

      {/* 2. SECONDARY CONTEXT NAVIGATION (Sub Row) */}
      <div className="z-2 position-relative flex-shrink-0 w-100">
        <ContextNav />
      </div>

      {/* 3. SCROLLABLE CONTENT AREA */}
      <main className="flex-grow-1 overflow-auto">
        <div className="container-fluid px-4 py-4" style={{ maxWidth: 1600 }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
