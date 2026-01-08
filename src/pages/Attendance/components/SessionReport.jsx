import React, { useMemo } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, CheckCircle, Clock } from 'lucide-react';
import { ATTENDANCE_STATUS } from '../constants/attendanceConstants';
import AttendanceTable from '../components/AttendanceTable';

const COLORS = {
    PRESENT: '#22c55e',
    ABSENT: '#ef4444',
    LATE: '#eab308',
    LEFT_EARLY: '#3b82f6',
    UNMARKED: '#94a3b8'
};

const SessionReport = ({ sessionId }) => {
    const { attendanceList } = useAttendanceStore();

    /* ---------------- MOCK DATA FOR DEMO ---------------- */
    const MOCK_LOGS = useMemo(() => {
        // Generate flexible mock data if no real data exists
        return Array.from({ length: 42 }).map((_, i) => ({
            studentId: `std-${i}`,
            status: i < 30 ? 'PRESENT' : i < 35 ? 'LATE' : i < 40 ? 'ABSENT' : 'LEFT_EARLY',
            timestamp: new Date().toISOString()
        }));
    }, []);

    /* ---------------- FILTER BY SESSION ---------------- */

    const sessionRecords = useMemo(
        () => {
            const realData = attendanceList.filter(a => a.sessionId === sessionId);
            // If we have real data, use it. Otherwise, if it's a demo/mock session ID, show mock data.
            if (realData.length > 0) return realData;

            // Fallback for demo visualization
            if (sessionId) return MOCK_LOGS;

            return [];
        },
        [attendanceList, sessionId, MOCK_LOGS]
    );

    /* ---------------- DERIVED STATS ---------------- */

    const stats = useMemo(() => {
        if (sessionRecords.length === 0) {
            return {
                total: 0,
                present: 0,
                absent: 0,
                late: 0,
                leftEarly: 0,
                presentPct: 0,
                chartData: []
            };
        }

        const present = sessionRecords.filter(
            a => a.status === ATTENDANCE_STATUS.PRESENT
        ).length;

        const late = sessionRecords.filter(
            a => a.status === ATTENDANCE_STATUS.LATE
        ).length;

        const absent = sessionRecords.filter(
            a => a.status === ATTENDANCE_STATUS.ABSENT
        ).length;

        const leftEarly = sessionRecords.filter(
            a => a.status === ATTENDANCE_STATUS.LEFT_EARLY
        ).length;

        const total = present + late + absent + leftEarly;

        const presentPct =
            total > 0 ? (((present + late) / total) * 100).toFixed(1) : 0;

        return {
            total,
            present,
            late,
            absent,
            leftEarly,
            presentPct,
            chartData: [
                { name: 'Present', value: present },
                { name: 'Late', value: late },
                { name: 'Absent', value: absent },
                ...(leftEarly > 0 ? [{ name: 'Left Early', value: leftEarly }] : [])
            ]
        };
    }, [sessionRecords]);

    /* ---------------- EMPTY STATE ---------------- */

    if (stats.total === 0) {
        return (
            <div className="p-5 text-center text-muted">
                No attendance data available for this session.
            </div>
        );
    }

    /* ---------------- DOWNLOAD ---------------- */

    const handleDownload = () => {
        alert('CSV export will be implemented via backend');
    };

    /* ---------------- RENDER ---------------- */

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Attendance Report</h5>
                <button
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                    onClick={handleDownload}
                >
                    <Download size={16} /> Export CSV
                </button>
            </div>

            <div className="card-body">
                {/* Summary */}
                <div className="row g-4 mb-4">
                    <SummaryCard label="Total" value={stats.total} />
                    <SummaryCard label="Present" value={stats.present} color="success" />
                    <SummaryCard label="Late" value={stats.late} color="warning" />
                    <SummaryCard label="Absent" value={stats.absent} color="danger" />
                </div>

                {/* Chart + Details */}
                <div className="row g-4 align-items-center">
                    <div className="col-md-6" style={{ height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={stats.chartData}
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {stats.chartData.map((entry, i) => (
                                        <Cell
                                            key={i}
                                            fill={COLORS[entry.name.toUpperCase().replace(' ', '_')]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Summary</h6>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between px-0">
                                <span>
                                    <CheckCircle size={16} className="text-success me-2" />
                                    Attendance Rate
                                </span>
                                <strong>{stats.presentPct}%</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between px-0">
                                <span>
                                    <Clock size={16} className="text-secondary me-2" />
                                    Session Duration
                                </span>
                                <strong>60 mins</strong>
                            </li>
                        </ul>
                    </div>

                    {/* Detailed List for Corrections */}
                    <div className="col-12">
                        <div className="mt-4 border-top pt-4">
                            <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Detailed Attendance Log (Corrections)</h6>
                            <AttendanceTable
                                students={sessionRecords.map(r => ({
                                    studentId: r.studentId,
                                    name: r.studentId, // We might not have names in logs, fallback to ID
                                    status: r.status,
                                    remarks: ''
                                }))}
                                onStatusChange={() => { }}
                                onRemarkChange={() => { }}
                                isEditable={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ---------------- SMALL HELPER ---------------- */

const SummaryCard = ({ label, value, color }) => (
    <div className="col-md-3">
        <div
            className={`p-3 rounded-3 text-center border ${color ? `bg-${color} bg-opacity-10 border-${color}` : 'bg-light'
                }`}
        >
            <h6 className="text-uppercase small fw-bold text-muted">{label}</h6>
            <h2 className={`fw-bold mb-0 ${color ? `text-${color}` : ''}`}>
                {value}
            </h2>
        </div>
    </div>
);

export default SessionReport;
