import React, { useMemo } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiCalendar, FiBook, FiCheckCircle, FiXCircle, FiClock, FiActivity } from 'react-icons/fi';

const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="d-flex align-items-center mb-3">
        <div className="bg-light rounded-circle p-2 me-3 text-primary">
            <Icon size={16} />
        </div>
        <div>
            <div className="small text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>{label}</div>
            <div className="fw-medium">{value}</div>
        </div>
    </div>
);

const StatCard = ({ label, value, color, icon: Icon }) => (
    <div className="col-4">
        <div className={`p-3 rounded-3 bg-${color} bg-opacity-10 h-100 text-center`}>
            {Icon && <Icon className={`text-${color} mb-2`} size={20} />}
            <div className={`h4 fw-bold text-${color} mb-0`}>{value}</div>
            <div className={`small text-${color} text-opacity-75`}>{label}</div>
        </div>
    </div>
);

const StudentAttendanceProfile = ({ student, onClose }) => {
    if (!student) return null;

    // Mock stats for the student
    const stats = useMemo(() => {
        // Randomly generate some realistic looking stats based on the student ID
        const totalClasses = 45;
        const present = Math.floor(Math.random() * 10) + 30; // 30-40
        const absent = totalClasses - present;
        const percentage = Math.round((present / totalClasses) * 100);

        return { totalClasses, present, absent, percentage };
    }, [student.id]);

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, backdropFilter: 'blur(2px)' }}>

            <div className="card border-0 shadow-lg" style={{ width: '500px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3 ps-4 pe-3">
                    <h5 className="mb-0 fw-bold text-primary">Student Overview</h5>
                    <button className="btn btn-light btn-sm rounded-circle p-2" onClick={onClose}>
                        <FiX size={18} />
                    </button>
                </div>

                <div className="card-body px-4 pt-2 pb-4">
                    {/* Profile Header */}
                    <div className="d-flex align-items-center mb-4 pb-4 border-bottom">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fs-3 fw-bold"
                            style={{ width: '64px', height: '64px' }}>
                            {student.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="fw-bold mb-1">{student.name}</h4>
                            <span className="badge bg-light text-secondary border">ID: {student.studentId || student.id}</span>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="row g-2 mb-4">
                        <StatCard label="Attendance" value={`${stats.percentage}%`} color={stats.percentage >= 75 ? 'success' : 'warning'} icon={FiActivity} />
                        <StatCard label="Present" value={stats.present} color="success" icon={FiCheckCircle} />
                        <StatCard label="Absent" value={stats.absent} color="danger" icon={FiXCircle} />
                    </div>

                    {/* Details Grid */}
                    <h6 className="fw-bold text-muted mb-3 small text-uppercase">Contact & Academic Info</h6>
                    <div className="row">
                        <div className="col-md-6">
                            <DetailRow icon={FiMail} label="Email Address" value={`${student.name.toLowerCase().replace(' ', '.')}@example.com`} />
                            <DetailRow icon={FiPhone} label="Contact Number" value="+1 (555) 123-4567" />
                        </div>
                        <div className="col-md-6">
                            <DetailRow icon={FiBook} label="Course" value={student.courseName || "React Fundamentals"} />
                            <DetailRow icon={FiCalendar} label="Enrolled Date" value="Sep 15, 2023" />
                        </div>
                    </div>
                </div>

                <div className="card-footer bg-light bg-opacity-50 text-end border-top-0 py-3 px-4">
                    <button className="btn btn-outline-secondary btn-sm me-2" onClick={onClose}>Close</button>
                    <button className="btn btn-primary btn-sm">View Full Profile</button>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendanceProfile;
