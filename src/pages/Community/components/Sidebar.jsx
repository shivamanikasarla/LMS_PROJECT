import React from 'react';
import { NavLink } from 'react-router-dom';
import { TOPIC_BOARDS } from '../constants';
import { Layout, HelpCircle, MessageSquare, BookOpen } from 'lucide-react';

const Sidebar = () => {
    const getIcon = (id) => {
        switch (id) {
            case 'announcements': return <Layout size={20} />;
            case 'questions': return <HelpCircle size={20} />; // 'questions' or 'doubts' check constant
            case 'doubts': return <HelpCircle size={20} />;
            case 'discussions': return <MessageSquare size={20} />;
            case 'resources': return <BookOpen size={20} />;
            default: return <MessageSquare size={20} />;
        }
    };

    return (
        <div className="community-sidebar">
            <h3 className="sidebar-title">Menu</h3>
            <div className="sidebar-menu">
                {TOPIC_BOARDS.map(board => (
                    <NavLink
                        key={board.id}
                        to={`/community/board/${board.id}`}
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        style={{ borderLeftColor: board.color }}
                    >
                        <span className="board-icon" style={{ color: board.color }}>
                            {getIcon(board.id)}
                        </span>
                        <div className="board-info">
                            <span className="board-name">{board.name}</span>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
