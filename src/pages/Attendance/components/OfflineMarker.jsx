import React, { useState } from 'react';
import { WifiOff, Save } from 'lucide-react';
import { useAttendanceStore } from '../store/attendanceStore';
import { ATTENDANCE_STATUS } from '../constants/attendanceConstants';

const OfflineMarker = ({ isActive }) => {
    const { queueOfflineAttendance, session } = useAttendanceStore();

    const [studentId, setStudentId] = useState('');
    const [status, setStatus] = useState(ATTENDANCE_STATUS.PRESENT);
    const [lastQueued, setLastQueued] = useState(null);

    if (!isActive) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!session?.id) {
            alert('No active session. Cannot mark offline attendance.');
            return;
        }

        if (!studentId.trim()) return;

        const record = queueOfflineAttendance(studentId.trim(), status);
        setLastQueued(record);
        setStudentId('');
    };

    return (
        <div className="card border-warning mb-4">
            <div className="card-header bg-warning bg-opacity-10 fw-bold d-flex align-items-center gap-2">
                <WifiOff size={18} />
                Offline Mode Active
            </div>

            <div className="card-body">
                <form onSubmit={handleSubmit} className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Student ID / Roll No"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        autoFocus
                    />

                    <select
                        className="form-select w-auto"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value={ATTENDANCE_STATUS.PRESENT}>Present</option>
                        <option value={ATTENDANCE_STATUS.LATE}>Late</option>
                    </select>

                    <button
                        type="submit"
                        className="btn btn-warning fw-bold d-flex align-items-center gap-2"
                    >
                        <Save size={16} /> Queue
                    </button>
                </form>

                {lastQueued && (
                    <div className="mt-2 text-success small">
                        Queued <strong>{lastQueued.studentId}</strong> as{' '}
                        <strong>{lastQueued.status}</strong>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfflineMarker;
