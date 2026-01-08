import React from 'react';
import AttendanceInsights from '../components/AttendanceInsights';

const InsightsPage = () => {
    // In a real app, calculate these from useAttendanceStore or fetch from API
    const mockStats = {
        onTimePct: 85,
        latePct: 15,
        totalBreak: '12h 45m',
        totalWorking: '152h'
    };

    return (
        <div className="fade-in">
            <AttendanceInsights stats={mockStats} />
        </div>
    );
};

export default InsightsPage;
