import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AttendanceProvider } from './store/attendanceStore';
import AttendanceLayout from './AttendanceLayout';
import SessionDashboard from './pages/SessionDashboard';
import SessionDetails from './pages/SessionDetails';
import OfflineSync from './pages/OfflineSync';

import ReportPage from './pages/ReportPage';
import AttendanceSettings from './components/AttendanceSettings';
import SessionsList from './pages/SessionsList';

// Attendance.jsx
// Attendance.jsx

const Attendance = () => (
    <Routes>
        <Route
            element={
                <AttendanceProvider>
                    <AttendanceLayout />
                </AttendanceProvider>
            }
        >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SessionDashboard />} />
            <Route path="sessions" element={<SessionsList />} />
            <Route path="sessions/:sessionId/*" element={<SessionDetails />} />

            <Route path="reports" element={<ReportPage />} />
            <Route path="settings" element={<AttendanceSettings />} />
            <Route path="offline-sync" element={<OfflineSync />} />
            <Route path="*" element={<Navigate to="/attendance/dashboard" replace />} />
        </Route>
    </Routes>
);

export default Attendance;
