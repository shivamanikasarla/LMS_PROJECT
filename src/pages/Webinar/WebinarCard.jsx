import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Webinars.css'

const WebinarCard = ({ item }) => {
    const navigate = useNavigate()

    // Determine attributes based on type
    const typeConfig = {
        live: {
            label: 'Live',
            color: '#ef4444',
            btnText: 'Join',
            isLive: true
        },
        upcoming: {
            label: 'Upcoming',
            color: '#3b82f6',
            btnText: 'View Details',
            isLive: false
        },
        recorded: {
            label: 'Recorded',
            color: '#22c55e',
            btnText: 'Watch',
            isLive: false
        }
    }[item.type] || { label: 'Webinar', color: '#64748b', btnText: 'View', isLive: false }

    return (
        <motion.div
            className="class-item webinar-card"
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            {item.cover && (
                <div className="card-cover">
                    <img src={item.cover} alt="cover" />
                    <div className="card-overlay">
                        <div className="card-overlay-title">{item.title}</div>
                        <div className="card-overlay-meta">
                            {item.dateTime ? new Date(item.dateTime).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                ...(item.type === 'recorded' && { year: 'numeric' }),
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            }) : typeConfig.label}
                        </div>
                    </div>
                </div>
            )}
            <div style={{ padding: '16px' }}>
                <div className="ci-notes">{item.notes && item.notes.slice(0, 100)}{item.notes && item.notes.length > 100 ? '...' : ''}</div>
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{ fontSize: 12, color: typeConfig.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {typeConfig.isLive && (
                                <span style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%' }}></span>
                            )}
                            {typeConfig.label}
                        </span>
                    </div>
                    <button className="btn" onClick={() => navigate(`/webinar/${item.id}`, { state: { item } })} style={{ padding: '8px 16px', fontSize: '13px' }}>{typeConfig.btnText}</button>
                </div>
            </div>
        </motion.div>
    )
}

export default WebinarCard
