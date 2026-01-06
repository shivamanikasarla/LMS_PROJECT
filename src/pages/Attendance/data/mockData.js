
export const MOCK_COURSES = [
    { id: '1', title: 'React Native Masterclass' },
    { id: '2', title: 'Python & Data Science' },
    { id: 'C-003', title: 'Full Stack Java Development' },
];

export const MOCK_BATCHES = [
    { id: '1', courseId: '1', name: 'React Morning Batch A', status: 'Ongoing' },
    { id: '2', courseId: '2', name: 'Python Weekend Special', status: 'Ongoing' },
    { id: 'B-003', courseId: 'C-003', name: 'Java Morning Batch', status: 'Ongoing' },
];

export const MOCK_SESSIONS = [
    // Java Morning
    { id: 'SES-101', batchId: 'B-003', date: '2026-01-02', time: '10:00 - 11:30', title: 'Intro to OOP', type: 'Live Class' },
    { id: 'SES-102', batchId: 'B-003', date: '2026-01-02', time: '12:00 - 13:00', title: 'Lab: Class Structure', type: 'Lab' },
];

export const MOCK_STUDENTS = [
    { id: 'S-001', name: 'Alice Johnson', batchId: '1', avatar: null },
    { id: 'S-002', name: 'Bob Smith', batchId: '1', avatar: null },
];

export const MOCK_ATTENDANCE_HISTORY = {
    'SES-101': [],
};
