import React from 'react';
import { ATTENDANCE_STATUS } from '../constants/attendanceConstants';
import {
    FiCheck,
    FiX,
    FiClock,
    FiMinusCircle
} from 'react-icons/fi';

const STATUS_ACTIONS = [
    {
        key: ATTENDANCE_STATUS.PRESENT,
        label: 'Present',
        icon: <FiCheck />,
        className: 'present'
    },
    {
        key: ATTENDANCE_STATUS.ABSENT,
        label: 'Absent',
        icon: <FiX />,
        className: 'absent'
    },
    {
        key: ATTENDANCE_STATUS.LATE,
        label: 'Late',
        icon: <FiClock />,
        className: 'late'
    },
    {
        key: ATTENDANCE_STATUS.EXCUSED,
        label: 'Excused',
        icon: <FiMinusCircle />,
        className: 'excused'
    }
];

const AttendanceTable = ({
    students = [],
    onStatusChange,
    onRemarkChange,
    onLateMinutesChange,
    isEditable = false
}) => {
    return (
        <div className="att-table-container">
            <table className="att-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Remarks</th>
                    </tr>
                </thead>

                <tbody>
                    {students.length === 0 && (
                        <tr>
                            <td colSpan="3" className="text-center py-4">
                                No students found in this batch.
                            </td>
                        </tr>
                    )}

                    {students.map(student => {
                        const name = student.name || 'Unknown';
                        const avatar = name.charAt(0).toUpperCase();

                        return (
                            <tr
                                key={student.studentId}
                                className={!isEditable ? 'disabled-row' : ''}
                            >
                                {/* Student */}
                                <td className="student-name-cell">
                                    <div className="avatar-placeholder">
                                        {avatar}
                                    </div>
                                    <span>{name}</span>
                                </td>

                                {/* Status */}
                                <td>
                                    <div className="status-options d-flex gap-2 flex-wrap">
                                        {STATUS_ACTIONS.map(action => (
                                            <button
                                                key={action.key}
                                                type="button"
                                                className={`btn btn-sm ${student.status === action.key
                                                    ? `btn-${action.className === 'present' ? 'success' : action.className === 'absent' ? 'danger' : action.className === 'late' ? 'warning' : 'secondary'}`
                                                    : 'btn-outline-light text-dark border'
                                                    }`}
                                                style={{ minWidth: '90px' }}
                                                onClick={() =>
                                                    isEditable &&
                                                    onStatusChange(
                                                        student.studentId,
                                                        action.key
                                                    )
                                                }
                                                disabled={!isEditable}
                                            >
                                                {action.icon} <span className="ms-1">{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {isEditable && student.status === ATTENDANCE_STATUS.LATE && (
                                        <div className="mt-2 d-flex align-items-center animate-fade-in">
                                            <span className="small text-muted me-2">Minutes Late:</span>
                                            <input
                                                type="number"
                                                min="1"
                                                className="form-control form-control-sm"
                                                style={{ width: '80px' }}
                                                value={student.lateMinutes || ''}
                                                onChange={(e) =>
                                                    onLateMinutesChange &&
                                                    onLateMinutesChange(student.studentId, e.target.value)
                                                }
                                                placeholder="Min"
                                            />
                                        </div>
                                    )}
                                </td>

                                {/* Remarks */}
                                <td>
                                    <input
                                        type="text"
                                        className="remark-input"
                                        placeholder="Add remark..."
                                        value={student.remarks || ''}
                                        onChange={e =>
                                            isEditable &&
                                            onRemarkChange(
                                                student.studentId,
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditable}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;
