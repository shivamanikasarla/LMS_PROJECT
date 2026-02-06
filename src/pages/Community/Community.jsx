import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChannelFeed from './pages/ChannelFeed';
import PostDetail from './pages/PostDetail';
import './Community.css';

const Community = () => {
    return (
        <div className="community-container">
            <Sidebar />
            <main className="community-main">
                <Routes>
                    <Route path="/" element={<Navigate to="announcements" replace />} />
                    <Route path=":channelId" element={<ChannelFeed />} />
                    <Route path="post/:postId" element={<PostDetail />} />
                </Routes>
            </main>
        </div>
    );
};

export default Community;
