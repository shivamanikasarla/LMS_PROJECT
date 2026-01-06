import { useState, useMemo, useEffect } from 'react';
import { MOCK_STUDENTS, MOCK_COURSES, MOCK_BATCHES, MOCK_SESSIONS, MOCK_ATTENDANCE_HISTORY } from '../data/mockData';
import { ATTENDANCE_STATUS } from '../constants/attendanceConstants';
import { isDateEditable, getAttendanceStats } from '../utils/attendanceUtils'; // Removed isDateFuture if unused or use it

export const useAttendance = () => {
    // 1. Selection State
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedBatchId, setSelectedBatchId] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSessionId, setSelectedSessionId] = useState("");

    // 2. Data State
    const [attendanceRecords, setAttendanceRecords] = useState(MOCK_ATTENDANCE_HISTORY); // { "sessionId": [ { studentId: status, ... } ] }
    const [draftRecords, setDraftRecords] = useState([]); // Current view draft
    const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error

    // 3. Derived Data (Cascading Dropdowns)
    const filteredBatches = useMemo(() =>
        MOCK_BATCHES.filter(b => b.courseId === selectedCourseId),
        [selectedCourseId]);

    const filteredSessions = useMemo(() =>
        MOCK_SESSIONS.filter(s => s.batchId === selectedBatchId && s.date === selectedDate),
        [selectedBatchId, selectedDate]);

    // 4. Load Students on Batch Change
    const students = useMemo(() => {
        if (!selectedBatchId) return [];
        return MOCK_STUDENTS.filter(s => s.batchId === selectedBatchId);
    }, [selectedBatchId]);

    // 5. Initialize Draft Records when Session Changes
    useEffect(() => {
        if (!selectedSessionId || students.length === 0) {
            setDraftRecords([]);
            return;
        }

        const saved = attendanceRecords[selectedSessionId];

        if (saved) {
            setDraftRecords(saved);
        } else {
            // Initialize new records for this session
            const initial = students.map(s => ({
                studentId: s.id,
                name: s.name,
                status: ATTENDANCE_STATUS.PENDING,
                remarks: '',
                markedAt: null,
                markedBy: null
            }));
            setDraftRecords(initial);
        }
        setSaveStatus('idle');
    }, [selectedSessionId, students, attendanceRecords]);

    // 6. Helpers
    const isEditable = useMemo(() => {
        return !!selectedSessionId; // Simplified for now - if session selected, can edit (add more rules later)
    }, [selectedSessionId]);

    const handleStatusChange = (studentId, status) => {
        if (!isEditable) return;
        setDraftRecords(prev => prev.map(r => r.studentId === studentId ? { ...r, status } : r));
        setSaveStatus('idle');
    };

    const markAll = (status) => {
        if (!isEditable) return;
        setDraftRecords(prev => prev.map(r => ({ ...r, status })));
        setSaveStatus('idle');
    };

    const saveAttendance = () => {
        if (!selectedSessionId) return;

        setSaveStatus('saving');
        setTimeout(() => {
            setAttendanceRecords(prev => ({
                ...prev,
                [selectedSessionId]: draftRecords.map(r => ({
                    ...r,
                    markedAt: new Date().toISOString(),
                    markedBy: 'Instructor (You)' // Mock user
                }))
            }));
            setSaveStatus('saved');
        }, 800);
    };

    const stats = useMemo(() => getAttendanceStats(draftRecords), [draftRecords]);

    return {
        // Data for Dropdowns
        courses: MOCK_COURSES,
        batches: filteredBatches,
        sessions: filteredSessions,

        // Selections
        selectedCourseId, setSelectedCourseId,
        selectedBatchId, setSelectedBatchId,
        selectedDate, setSelectedDate,
        selectedSessionId, setSelectedSessionId,

        // Working Data
        students: draftRecords, // We display the draft records which contain student info + status
        handleStatusChange,
        markAll,
        saveAttendance,

        // UI State
        isEditable,
        stats,
        saveStatus,
        isLoading: false
    };
};
