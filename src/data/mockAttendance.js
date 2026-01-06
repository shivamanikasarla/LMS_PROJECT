export const MOCK_SESSIONS = [
    { id: 101, batchId: 1, date: '2026-01-06', time: '10:00 AM - 11:30 AM', topic: 'React Components Deep Dive', status: 'Completed' },
    { id: 102, batchId: 1, date: '2026-01-07', time: '10:00 AM - 11:30 AM', topic: 'State Management with Hooks', status: 'Upcoming' },
    { id: 103, batchId: 1, date: '2026-01-08', time: '10:00 AM - 11:30 AM', topic: 'Side Effects & useEffect', status: 'Upcoming' },
    { id: 201, batchId: 2, date: '2026-01-06', time: '06:00 PM - 08:00 PM', topic: 'Python Basics', status: 'Completed' },
];

export const MOCK_ATTENDANCE = [
    // Session 101 records
    { sessionId: 101, studentId: 1, status: 'Present', remarks: '', markedBy: 'Sarah Smith', timestamp: '2026-01-06T10:05:00' },
    { sessionId: 101, studentId: 7, status: 'Absent', remarks: 'Medical Leave', markedBy: 'Sarah Smith', timestamp: '2026-01-06T10:05:00' },
    { sessionId: 101, studentId: 8, status: 'Late', remarks: 'Network Issues', markedBy: 'Sarah Smith', timestamp: '2026-01-06T10:15:00' },
];
