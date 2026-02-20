import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navigationConfig } from '../../config/navigation';

const TopNav = () => {
    const location = useLocation();
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const isActive = (item) => {
        if (item.matchPrefix) {
            return location.pathname.startsWith(item.matchPrefix);
        }

        // Check if any sub-item is active
        if (item.subItems) {
            return item.subItems.some(sub =>
                location.pathname === sub.path || location.pathname.startsWith(sub.path + '/')
            );
        }

        return location.pathname === item.path;
    };

    return (
        <>
            <div className="w-100 bg-white border-bottom shadow-sm" style={{ height: 72 }}>
                <div className="container-fluid px-4 h-100">
                    <div className="d-flex align-items-center h-100 px-3 px-lg-4">

                        {/* HAMBURGER (Mobile Only) */}
                        <button
                            className="btn btn-link text-dark p-0 me-3 d-md-none"
                            onClick={() => setShowMobileMenu(true)}
                        >
                            <i className="bi bi-list fs-1"></i>
                        </button>

                        {/* BRAND */}
                        <div className="d-flex align-items-center gap-2 flex-shrink-0 text-decoration-none me-auto me-md-0">
                            <div className="bg-primary rounded d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                <i className="bi bi-bank text-white fs-5"></i>
                            </div>
                            <span className="fw-bold fs-5 d-none d-md-block" style={{ color: '#1e293b', letterSpacing: '-0.5px' }}>ClassX360</span>
                        </div>

                        {/* DESKTOP NAV (Hidden on Mobile) */}
                        <div className="d-none d-md-flex align-items-center gap-1 flex-grow-1 mx-4">
                            {navigationConfig.map((item) => {
                                const active = isActive(item);
                                return (
                                    <NavLink
                                        key={item.id}
                                        to={item.path}
                                        className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill text-decoration-none transition-smooth flex-shrink-0 ${active ? 'bg-dark text-white shadow-sm' : 'text-secondary hover-bg-light'}`}
                                        style={{ fontSize: '0.9rem', fontWeight: active ? '600' : '500', whiteSpace: 'nowrap' }}
                                    >
                                        <i className={`bi ${item.icon}`}></i>
                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </div>

                        {/* USER ACTIONS */}
                        <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-auto ms-md-0">
                            {/* Admin Login Button */}
                            <NavLink to="/login" className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-3 py-1 text-decoration-none shadow-sm border-0" style={{ fontSize: '0.85rem' }}>
                                <i className="bi bi-shield-lock-fill"></i>
                                <span className="d-inline">Admin Login</span>
                            </NavLink>

                            <button className="btn btn-light rounded-circle p-2 d-none d-lg-block text-secondary border-0">
                                <i className="bi bi-search"></i>
                            </button>
                            <button className="btn btn-light rounded-circle p-2 text-secondary border-0 position-relative">
                                <i className="bi bi-bell"></i>
                                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                    <span className="visually-hidden">New alerts</span>
                                </span>
                            </button>

                            <div className="d-flex align-items-center gap-2 ps-2 ms-1 border-start">
                                <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold d-none d-sm-flex" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                                    AD
                                </div>
                            </div>
                            <button
                                className="btn btn-light rounded-circle p-2 text-danger border-0 hover-bg-danger-subtle"
                                onClick={() => {
                                    localStorage.removeItem('authToken');
                                    localStorage.removeItem('auth_user');
                                    window.location.href = '/login';
                                }}
                                title="Sign Out"
                            >
                                <i className="bi bi-box-arrow-right"></i>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* MOBILE SIDEBAR OVERLAY */}
            {showMobileMenu && (
                <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1060 }}>
                    <div className="position-absolute w-100 h-100 bg-dark bg-opacity-50" onClick={() => setShowMobileMenu(false)} style={{ backdropFilter: 'blur(2px)' }}></div>
                    <div className="position-absolute top-0 start-0 h-100 bg-white shadow-lg d-flex flex-column" style={{ width: '280px' }}>

                        {/* Drawer Header */}
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <div className="bg-primary rounded d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                    <i className="bi bi-bank text-white"></i>
                                </div>
                                <span className="fw-bold fs-5">ClassX360</span>
                            </div>
                            <button className="btn btn-light btn-sm rounded-circle" onClick={() => setShowMobileMenu(false)}>
                                <i className="bi bi-x fs-5"></i>
                            </button>
                        </div>

                        {/* Vertical Nav */}
                        <div className="flex-grow-1 overflow-auto p-3">
                            <div className="d-flex flex-column gap-2">
                                {navigationConfig.map((item) => {
                                    const active = isActive(item);
                                    return (
                                        <NavLink
                                            key={item.id}
                                            to={item.path}
                                            onClick={() => setShowMobileMenu(false)}
                                            className={`d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none transition-smooth ${active ? 'bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}
                                        >
                                            <i className={`bi ${item.icon} fs-5`}></i>
                                            <span className="fw-medium">{item.label}</span>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-3 border-top bg-light">
                            <div className="d-flex align-items-center gap-3 px-2">
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                                    AD
                                </div>
                                <div>
                                    <div className="fw-bold text-dark small">Admin User</div>
                                    <div className="text-secondary small">admin@classx360.com</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default TopNav;
