import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateSessionToken } from '../utils/qrTimer';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
    const [session, setSession] = useState({
        id: null,
        status: 'IDLE', // IDLE, LIVE, ENDED
        mode: null,     // QR, MANUAL
        qrData: null,   // { token, expiresAt }
        settings: {
            expiryMinutes: 1, // Default to 1 min for demo speed or 5 as requested
            autoRefresh: true
        }
    });

    const [attendanceList, setAttendanceList] = useState([]);

    // Auto-refresh logic (Mocking the "QR auto-refreshes" requirement)
    useEffect(() => {
        let interval;
        if (session.status === 'LIVE' && session.mode === 'QR' && session.settings.autoRefresh) {
            interval = setInterval(() => {
                const timeLeft = session.qrData ? session.qrData.expiresAt - Date.now() : 0;
                // If close to expiry (e.g., < 2 seconds) or expired, refresh
                // OR simple periodic refresh based on expiryMinutes

                // For this demo, let's just refresh when it actually expires or simple interval?
                // The requirement says "Set expiry... QR auto-refreshes". 
                // Usually implies new QR is generated before old one dies or when old one dies.
                if (timeLeft <= 0) {
                    refreshQR();
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [session.status, session.mode, session.qrData, session.settings]);

    // --- Session Lock Logic ---

    // Helper to check if session is locked
    const isSessionLocked = () => {
        if (!session.endTime || session.status === 'ENDED') return true;
        return Date.now() > session.endTime;
    };

    const startSession = (sessionId, mode = 'QR', expiryMinutes = 5, durationMinutes = 60) => {
        const qrData = generateSessionToken(sessionId, expiryMinutes);
        const startTime = Date.now();
        const endTime = startTime + durationMinutes * 60 * 1000;

        setSession({
            id: sessionId,
            status: 'LIVE',
            mode,
            qrData,
            startTime,
            endTime,
            settings: { ...session.settings, expiryMinutes }
        });
        setAttendanceList([]); // Clear for new session
    };

    const stopSession = () => {
        setSession(prev => ({ ...prev, status: 'ENDED', qrData: null }));
    };

    const refreshQR = () => {
        if (!session.id) return;
        const qrData = generateSessionToken(session.id, session.settings.expiryMinutes);
        setSession(prev => ({ ...prev, qrData }));
    };

    // --- Offline Logic ---

    const queueOfflineAttendance = (studentId, status = 'PRESENT', customDate = null, customSessionId = null, metadata = {}) => {
        const record = {
            id: crypto.randomUUID(),
            sessionId: customSessionId || session.id || 'OFFLINE_SESSION',
            studentId,
            status,
            synced: false,
            timestamp: customDate ? new Date(customDate).toISOString() : new Date().toISOString(),
            ...metadata // Spread metadata like minutesLate
        };

        const stored = JSON.parse(localStorage.getItem('offline_attendance') || '[]');
        stored.push(record);
        localStorage.setItem('offline_attendance', JSON.stringify(stored));

        return record;
    };

    const getPendingSyncCount = () => {
        const stored = JSON.parse(localStorage.getItem('offline_attendance') || '[]');
        return stored.length;
    };

    const getModeFromSource = (source) => {
        const onlineSources = ['QR', 'FACE', 'STUDENT_SELF', 'ONLINE'];
        return onlineSources.includes(source) ? 'ONLINE' : 'OFFLINE';
    };

    const syncOfflineData = async () => {
        const stored = JSON.parse(localStorage.getItem('offline_attendance') || '[]');
        if (stored.length === 0) return { count: 0 };

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Merge into current list for demo purposes
        setAttendanceList(prev => {
            const newRecords = stored.map(s => ({
                sessionId: s.sessionId,
                studentId: s.studentId,
                timestamp: s.timestamp,
                source: 'OFFLINE_SYNC',
                mode: 'OFFLINE',
                status: s.status
            }));

            // Filter duplicates if needed, simplified here
            return [...newRecords, ...prev];
        });

        localStorage.removeItem('offline_attendance');
        return { count: stored.length };
    };

    const markAttendance = (studentId, status = 'PRESENT', source = 'MANUAL', overrideReason = null) => {
        // Session Lock Check
        if (isSessionLocked()) {
            if (source === 'QR' || source === 'STUDENT_SELF') {
                return { success: false, message: 'Session is LOCKED. Cannot mark attendance.' };
            }
            // Admin override check
            if (source === 'MANUAL' && !overrideReason) {
                return { success: false, message: 'Session is LOCKED. Admin override reason required.' };
            }
        }

        // Conflict Guard: Check against current state
        const existingRecord = attendanceList.find(a => a.studentId === studentId);
        if (existingRecord && existingRecord.mode === 'ONLINE' && source === 'MANUAL') {
            return { success: false, message: 'Attendance auto-managed for online participants' };
        }

        const mode = getModeFromSource(source);

        setAttendanceList(prev => {
            const existingIndex = prev.findIndex(a => a.studentId === studentId);
            const newRecord = {
                sessionId: session.id,
                studentId,
                timestamp: new Date().toISOString(),
                source,
                mode,
                status,
                overrideReason // Store reason if provided
            };

            if (existingIndex >= 0) {
                const updated = [...prev];
                // If switching from Offline to Online (e.g. late check-in), allow update
                // If switching from Online to Offline, we blocked it above (for manual)
                updated[existingIndex] = { ...updated[existingIndex], ...newRecord };
                return updated;
            } else {
                return [newRecord, ...prev];
            }
        });
        return { success: true };
    };

    // --- exposure ---

    const value = {
        session,
        attendanceList,
        startSession,
        stopSession,
        refreshQR,
        markAttendance,
        queueOfflineAttendance,
        syncOfflineData,
        getPendingSyncCount,
        isSessionLocked
    };

    return (
        <AttendanceContext.Provider value={value}>
            {children}
        </AttendanceContext.Provider>
    );
};

export const useAttendanceStore = () => {
    const context = useContext(AttendanceContext);
    if (!context) {
        throw new Error('useAttendanceStore must be used within an AttendanceProvider');
    }
    return context;
};
