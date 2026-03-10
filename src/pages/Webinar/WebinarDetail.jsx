import React, { useEffect, useState } from 'react';
import { webinarService } from '../../services/webinarService';
import { motion } from 'framer-motion';
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import './WebinarDetail.css';

const WebinarDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchDetail = async () => {
      // prefer location.state if available for instant display
      if (location.state && location.state.item) {
        setItem(location.state.item)
        return
      }

      try {
        setIsLoading(true)
        const data = await webinarService.getWebinarById(id)
        if (data) setItem(data)
      } catch (err) {
        console.error('Error fetching webinar detail:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [id, location.state])

  if (isLoading) {
    return (
      <div className="wd-container">
        <div className="wd-box">
          <p>Loading webinar details...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="wd-container">
        <div className="wd-box">
          <p>Webinar not found.</p>
          <button className="btn" onClick={() => navigate('/webinars')}>Back</button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="wd-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="wd-box">
        <h2 className="wd-title">{item.title}</h2>
        {item.cover && <div className="wd-cover"><img src={item.cover} alt="cover" /></div>}
        <div className="wd-meta">
          {item.dateTime && <div className="wd-pill">📅 {new Date(item.dateTime).toLocaleString()}</div>}
          {item.type && <div className={`wd-pill type-${item.type}`}>{item.type.toUpperCase()}</div>}
          {item.memberLimit && <div className="wd-pill">👥 Limit: {item.memberLimit}</div>}
          <div className="wd-pill">⏳ {item.duration} min</div>
        </div>
        {item.notes && <div className="wd-notes"><h4>About this session</h4><p>{item.notes}</p></div>}
        <div className="wd-actions">
          <button className="btn secondary" onClick={() => navigate('/')}>&larr; Back</button>

          <button className="btn danger" onClick={async () => {
            if (window.confirm('Are you sure you want to delete this webinar?')) {
              try {
                await webinarService.deleteWebinar(item.id);
                alert('Webinar deleted.');
                navigate('/webinar', { replace: true });
              } catch (err) {
                console.error('Error deleting webinar:', err);
                alert('Failed to delete webinar: ' + err.message);
              }
            }
          }}>Delete</button>

          <button className="btn primary" onClick={() => {
            // Placeholder for report viewing
            alert('Attendance Report: ' + (item.attendedCount || 0) + ' attendees')
          }}>Report</button>
        </div>
      </div>
    </motion.div>
  )
}

export default WebinarDetail
