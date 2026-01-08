import React from 'react';
import { FiCalendar, FiAlertCircle } from 'react-icons/fi';

const AttendanceSessionSelector = ({
    selectedDate,
    setSelectedDate,
    selectedSessionId,
    setSelectedSessionId,
    sessionsForDate
}) => {
    return (
        <div className="session-selector-card">
            <div className="step-group">
                <span className="step-label">Step 1: Select Date</span>
                <div className="date-input-wrapper">
                    <FiCalendar className="icon" />
                    <input
                        type="date"
                        className="form-input"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedSessionId(null);
                        }}
                    />
                </div>
            </div>
            <div className={`step-group flex-grow ${!selectedDate ? 'opacity-50' : ''}`}>
                <span className="step-label">Step 2: Select Session</span>
                {sessionsForDate.length > 0 ? (
                    <div className="session-pills">
                        {sessionsForDate.map(session => (
                            <button
                                key={session.id}
                                className={`session-pill ${selectedSessionId === session.id ? 'active' : ''}`}
                                onClick={() => setSelectedSessionId(session.id)}
                            >
                                <div className="time">{session.time}</div>
                                <div className="topic">{session.topic}</div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="no-sessions-msg">
                        {selectedDate ? <><FiAlertCircle /> No sessions on this date.</> : "Pick a date first."}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceSessionSelector;
