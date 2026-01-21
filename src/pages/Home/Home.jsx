import React from 'react'
import './Home.css'
import Typewriter from '../../components/Typewriter'

function Home() {
  const stats = [
    { icon: 'bi-people', label: 'Total Users', value: '1,234', color: 'primary' },
    { icon: 'bi-journal-bookmark', label: 'Courses', value: '45', color: 'success' },
    { icon: 'bi-pencil-square', label: 'Exams', value: '128', color: 'warning' },
    { icon: 'bi-patch-check', label: 'Certificates', value: '892', color: 'info' }
  ]

  const quickActions = [
    { icon: 'bi-plus-circle-fill', title: 'Add Course', desc: 'Create a new course', color: 'primary' },
    { icon: 'bi-person-plus-fill', title: 'Add User', desc: 'Register a new user', color: 'success' },
    { icon: 'bi-file-earmark-text-fill', title: 'Create Exam', desc: 'Set up a new exam', color: 'warning' },
    { icon: 'bi-graph-up-arrow', title: 'View Reports', desc: 'Check analytics', color: 'info' }
  ]

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h1 className="display-5 fw-bold mb-2">
            <Typewriter
              texts = {["WELCOME ADMIN","MANAGE USERS","CONTROL YOUR PLATFORM"]}
              typingSpeed={100}
              deletingSpeed={80}
              delayBetween={2000}
              loop={true}
              cursor={true}
              cursorBlinkSpeed={500}
            />
          </h1>
          <p className="lead text-muted">Manage your platform efficiently</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 g-md-4 mb-5">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex align-items-center gap-3">
                <div className={`bg-${stat.color} bg-opacity-10 rounded p-3`}>
                  <i className={`bi ${stat.icon} text-${stat.color} fs-3`}></i>
                </div>
                <div className="flex-grow-1">
                  <h3 className="mb-0 fw-bold">{stat.value}</h3>
                  <p className="text-muted small mb-0">{stat.label}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <h2 className="h3 fw-bold mb-4">Quick Actions</h2>
        </div>
      </div>
      <div className="row g-3 g-md-4">
        {quickActions.map((action, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100 shadow-sm border-0 text-center hover-lift">
              <div className="card-body p-4">
                <div className={`bg-${action.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} style={{ width: '60px', height: '60px' }}>
                  <i className={`bi ${action.icon} text-${action.color} fs-3`}></i>
                </div>
                <h5 className="card-title fw-semibold mb-2">{action.title}</h5>
                <p className="card-text text-muted small mb-0">{action.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home