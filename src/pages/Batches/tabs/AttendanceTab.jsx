import React from 'react';
import ReportPage from '../../Attendance/pages/ReportPage';

const AttendanceTab = ({ batchId }) => {
    return (
        <div className="p-3">
            <ReportPage batchId={batchId} />
        </div>
    );
};

export default AttendanceTab;
