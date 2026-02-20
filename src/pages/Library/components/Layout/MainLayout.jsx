import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './MainLayout.css';

const MainLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
        <div className="layout">
            <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="sidebar-overlay d-md-none"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40
                    }}
                />
            )}

            <div className="main-content">
                <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
                <main className="page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
