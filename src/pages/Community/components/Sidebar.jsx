import React from 'react';
import { NavLink } from 'react-router-dom';
import { mockChannels } from '../constants'; // Use shared constants or fetch from service
import { Hash, Megaphone, HelpCircle, MessageSquare } from 'lucide-react'; // Assuming lucide-react is available

const Sidebar = () => {
    const getIcon = (id) => {
        switch (id) {
            case 'announcements': return <Megaphone size={18} />;
            case 'doubts': return <HelpCircle size={18} />;
            case 'discussion': return <MessageSquare size={18} />;
            default: return <Hash size={18} />;
        }
    };

    return (
        <aside className="community-sidebar">
            <div className="community-header">
                <h1 className="community-title">Community</h1>
                <p className="community-subtitle">Learn together</p>
            </div>

            <nav className="channel-nav">
                {mockChannels.map(channel => (
                    <NavLink
                        key={channel.id}
                        to={`/community/${channel.id}`}
                        className={({ isActive }) => `channel-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="channel-icon">{getIcon(channel.id)}</span>
                        {channel.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
