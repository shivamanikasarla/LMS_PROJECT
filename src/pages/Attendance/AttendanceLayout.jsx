import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './styles/attendance.css';

const AttendanceLayout = () => {
    return (
        <div className="attendance-page">
            <div className="container-fluid">
                <header className="att-header mb-4">
                    <div>
                        <h1>Attendance Manager</h1>
                        <p>Manage sessions, track students, and export reports.</p>
                    </div>
                </header>

                <div className="d-flex gap-2 mb-4 border-bottom pb-3 overflow-auto">
                    <Tab to="/attendance/dashboard">Dashboard</Tab>

                    <Tab to="/attendance/offline-sync">Offline Upload</Tab>
                    <Tab to="/attendance/reports">Reports</Tab>
                    <Tab to="/attendance/settings">Settings</Tab>
                </div>

                <Outlet />
            </div>
        </div>
    );
};

const Tab = ({ to, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `btn btn-sm rounded-pill px-3 fw-medium ${isActive
                ? 'btn-secondary shadow-sm'
                : 'btn-light text-secondary hover-shadow'
            }`
        }
    >
        {children}
    </NavLink>
);

export default AttendanceLayout;
