import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiCheckCircle, FiAlertCircle, FiPlay, FiFileText } from 'react-icons/fi';

const StudentExamDashboard = () => {
    const navigate = useNavigate();

    // Mock Data - In a real app, this would come from an API based on the logged-in student
    const [exams] = useState([
        {
            id: "E-101",
            title: "Advanced React Assessment",
            course: "Frontend Masterclass",
            duration: 60,
            status: "active", // active, upcoming, completed
            startTime: new Date().toISOString(), // Today
            endTime: new Date(Date.now() + 86400000).toISOString(),
            score: null
        },
        {
            id: "E-102",
            title: "JavaScript Fundamentals",
            course: "Web Development 101",
            duration: 45,
            status: "completed",
            dateCompleted: "2023-10-15",
            score: 85
        },
        {
            id: "E-103",
            title: "CSS Grid & Flexbox",
            course: "Web Design",
            duration: 30,
            status: "upcoming",
            startTime: new Date(Date.now() + 172800000).toISOString(), // 2 days later
        }
    ]);

    const activeExams = exams.filter(e => e.status === "active");
    const upcomingExams = exams.filter(e => e.status === "upcoming");
    const completedExams = exams.filter(e => e.status === "completed");

    return (
        <div className="container-fluid min-vh-100 bg-light p-4">
            <div className="container">
                <header className="mb-5">
                    <h1 className="fw-bold text-dark">My Exams</h1>
                    <p className="text-secondary">View and attempt your scheduled assessments.</p>
                </header>

                {/* Active Exams Section */}
                <section className="mb-5">
                    <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                        <FiPlay className="text-primary" /> Active Exams
                    </h5>
                    {activeExams.length > 0 ? (
                        <div className="row g-4">
                            {activeExams.map(exam => (
                                <div key={exam.id} className="col-12 col-md-6 col-lg-4">
                                    <div className="card border-0 shadow-sm h-100 exam-card active-card">
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3">
                                                    Active Now
                                                </span>
                                                <small className="text-muted fw-medium"><FiClock /> {exam.duration} mins</small>
                                            </div>
                                            <h4 className="fw-bold text-dark mb-1">{exam.title}</h4>
                                            <p className="text-secondary small mb-4">{exam.course}</p>

                                            <button
                                                className="btn btn-primary w-100 py-2 fw-medium shadow-sm transition-all"
                                                onClick={() => navigate(`/exams/student/attempt/${exam.id}`)}
                                            >
                                                Start Exam
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-light border shadow-sm text-center py-4">
                            <p className="mb-0 text-secondary">No active exams at the moment.</p>
                        </div>
                    )}
                </section>

                {/* Upcoming Exams Section */}
                <section className="mb-5">
                    <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                        <FiAlertCircle className="text-warning" /> Upcoming Exams
                    </h5>
                    {upcomingExams.length > 0 ? (
                        <div className="row g-4">
                            {upcomingExams.map(exam => (
                                <div key={exam.id} className="col-12 col-md-6 col-lg-4">
                                    <div className="card border-0 shadow-sm h-100 exam-card">
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3">
                                                    Upcoming
                                                </span>
                                                <small className="text-muted fw-medium"><FiClock /> {exam.duration} mins</small>
                                            </div>
                                            <h5 className="fw-bold text-dark mb-1">{exam.title}</h5>
                                            <p className="text-secondary small mb-3">{exam.course}</p>
                                            <hr className="border-secondary opacity-10 my-3" />
                                            <div className="d-flex align-items-center gap-2 text-secondary small">
                                                <FiClock /> Scheduled: {new Date(exam.startTime).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-light border shadow-sm text-center py-4">
                            <p className="mb-0 text-secondary">No upcoming exams.</p>
                        </div>
                    )}
                </section>

                {/* Completed Exams Section */}
                <section>
                    <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                        <FiCheckCircle className="text-success" /> Completed Exams
                    </h5>
                    <div className="card border-0 shadow-sm overflow-hidden">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4 py-3 text-secondary small text-uppercase">Exam Title</th>
                                        <th className="py-3 text-secondary small text-uppercase">Course</th>
                                        <th className="py-3 text-secondary small text-uppercase">Date</th>
                                        <th className="py-3 text-secondary small text-uppercase">Score</th>
                                        <th className="pe-4 py-3 text-secondary small text-uppercase text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {completedExams.map(exam => (
                                        <tr key={exam.id}>
                                            <td className="ps-4 fw-bold text-dark">{exam.title}</td>
                                            <td className="text-secondary">{exam.course}</td>
                                            <td className="text-muted small">{new Date(exam.dateCompleted || Date.now()).toLocaleDateString()}</td>
                                            <td>
                                                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 rounded-pill">
                                                    {exam.score}%
                                                </span>
                                            </td>
                                            <td className="pe-4 text-end">
                                                <button className="btn btn-sm btn-light text-primary fw-medium">
                                                    <FiFileText /> View Result
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {completedExams.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-secondary">
                                                No completed exams history.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
            <style>
                {`
                .active-card {
                    border-left: 4px solid #0d6efd !important;
                }
                .exam-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .exam-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.08) !important;
                }
                `}
            </style>
        </div>
    );
};

export default StudentExamDashboard;
