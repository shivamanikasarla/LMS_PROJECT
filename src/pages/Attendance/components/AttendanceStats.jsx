import React from 'react';
import {
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiAlertCircle
} from 'react-icons/fi';

const AttendanceStats = ({ stats = {} }) => {
    const {
        total = 0,
        present = 0,
        absent = 0,
        late = 0,
        excused = 0,
        percentage = 0
    } = stats;

    const pending = Math.max(
        0,
        total - (present + absent + late + excused)
    );

    return (
        <div className="att-stats-row">

            <div className="att-stat-card present">
                <div className="icon-wrapper">
                    <FiCheckCircle />
                </div>
                <div>
                    <h4>Present</h4>
                    <p>{present}</p>
                </div>
            </div>

            <div className="att-stat-card absent">
                <div className="icon-wrapper">
                    <FiXCircle />
                </div>
                <div>
                    <h4>Absent</h4>
                    <p>{absent}</p>
                </div>
            </div>

            <div className="att-stat-card late">
                <div className="icon-wrapper">
                    <FiClock />
                </div>
                <div>
                    <h4>Late</h4>
                    <p>{late}</p>
                </div>
            </div>

            <div className="att-stat-card pending">
                <div className="icon-wrapper">
                    <FiAlertCircle />
                </div>
                <div>
                    <h4>Pending</h4>
                    <p>{pending}</p>
                </div>
            </div>

            <div className="att-stat-card percentage">
                <div className="circular-chart">
                    <span>{percentage}%</span>
                </div>
                <div>
                    <h4>Attendance Rate</h4>
                </div>
            </div>

        </div>
    );
};

export default AttendanceStats;
