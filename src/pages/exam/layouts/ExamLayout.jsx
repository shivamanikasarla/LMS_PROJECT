import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const ExamLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Main Content */}
            <div className="flex-grow-1">
                <Outlet />
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, children }) => (
    <li className="nav-item">
        <NavLink
            to={to}
            className={({ isActive }) =>
                `nav-link px-3 ${isActive ? 'text-primary fw-bold' : 'text-secondary'}`
            }
        >
            <i className={`${icon} me-2`}></i>
            {children}
        </NavLink>
    </li>
);

export default ExamLayout;
