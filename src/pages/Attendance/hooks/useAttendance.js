import { useState, useMemo, useEffect, useRef } from 'react';

import {
    MOCK_STUDENTS,
    MOCK_COURSES,
    MOCK_BATCHES,
    MOCK_SESSIONS,
    MOCK_ATTENDANCE_HISTORY
} from '../data/mockData';

import { ATTENDANCE_STATUS } from '../constants/attendanceConstants';
import { getAttendanceStats } from '../utils/attendanceUtils';

export const useAttendance = () => {
    /* ---------------- SELECTION STATE ---------------- */

    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedBatchId, setSelectedBatchId] = useState('');
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [selectedSessionId, setSelectedSessionId] = useState('');

    /* ---------------- DATA STATE ---------------- */

    // attendanceRecords = { sessionId: [records] }
    const [attendanceRecords, setAttendanceRecords] = useState(
        MOCK_ATTENDANCE_HISTORY || {}
    );

    // Draft records for current session
    const [draftRecords, setDraftRecords] = useState([]);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error

    const saveTimerRef = useRef(null);

    /* ---------------- DERIVED DATA ---------------- */

    const courses = MOCK_COURSES;

    const batches = useMemo(
        () => MOCK_BATCHES.filter(b => b.courseId === selectedCourseId),
        [selectedCourseId]
    );

    const sessions = useMemo(
        () =>
            MOCK_SESSIONS.filter(
                s => s.batchId === selectedBatchId && s.date === selectedDate
            ),
        [selectedBatchId, selectedDate]
    );

    const students = useMemo(() => {
        if (!selectedBatchId) return [];
        return MOCK_STUDENTS.filter(s => s.batchId === selectedBatchId);
    }, [selectedBatchId]);

    /* ---------------- INIT DRAFT RECORDS ---------------- */

    useEffect(() => {
        if (!selectedSessionId || students.length === 0) {
            setDraftRecords([]);
            return;
        }

        const existing = attendanceRecords[selectedSessionId];

        if (existing && Array.isArray(existing)) {
            setDraftRecords(existing);
        } else {
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

    /* ---------------- EDITABILITY ---------------- */

    const isEditable = useMemo(() => {
        return (
            Boolean(selectedSessionId) &&
            draftRecords.length > 0 &&
            saveStatus !== 'saving'
        );
    }, [selectedSessionId, draftRecords, saveStatus]);

    /* ---------------- ACTIONS ---------------- */

    const handleStatusChange = (studentId, status) => {
        if (!isEditable) return;

        setDraftRecords(prev =>
            prev.map(r =>
                r.studentId === studentId ? { ...r, status } : r
            )
        );

        setSaveStatus('idle');
    };

    const markAll = status => {
        if (!isEditable) return;

        setDraftRecords(prev =>
            prev.map(r => ({ ...r, status }))
        );

        setSaveStatus('idle');
    };

    const saveAttendance = () => {
        if (!selectedSessionId || draftRecords.length === 0) return;

        setSaveStatus('saving');

        // Cleanup previous save
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }

        saveTimerRef.current = setTimeout(() => {
            setAttendanceRecords(prev => ({
                ...prev,
                [selectedSessionId]: draftRecords.map(r => ({
                    ...r,
                    markedAt: new Date().toISOString(),
                    markedBy: 'Instructor'
                }))
            }));

            setSaveStatus('saved');
        }, 800);
    };

    /* ---------------- CLEANUP ---------------- */

    useEffect(() => {
        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, []);

    /* ---------------- STATS ---------------- */

    const stats = useMemo(
        () => getAttendanceStats(draftRecords || []),
        [draftRecords]
    );

    /* ---------------- PUBLIC API ---------------- */

    return {
        // Dropdown data
        courses,
        batches,
        sessions,

        // Selection
        selectedCourseId,
        setSelectedCourseId,
        selectedBatchId,
        setSelectedBatchId,
        selectedDate,
        setSelectedDate,
        selectedSessionId,
        setSelectedSessionId,

        // Attendance
        students: draftRecords,
        handleStatusChange,
        markAll,
        saveAttendance,

        // UI state
        isEditable,
        saveStatus,
        stats,
        isLoading: false
    };
};
