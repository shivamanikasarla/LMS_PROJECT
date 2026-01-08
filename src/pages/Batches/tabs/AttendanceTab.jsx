import React from 'react';
import SessionDashboard from '../../Attendance/pages/SessionDashboard';

const AttendanceTab = ({ batchId, showAdvancedControls }) => {
    return (
        <div className="p-3">
            <SessionDashboard />
        </div>
    );
};

export default AttendanceTab;
