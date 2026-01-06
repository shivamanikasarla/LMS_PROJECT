import React, { useState, useMemo } from 'react';
import { MOCK_COURSES, MOCK_BATCHES } from './data/mockData';
import AttendanceTab from '../Batches/tabs/AttendanceTab';
import '../Batches/styles/BatchBuilder.css'; // Import shared styles
import './styles/attendance.css'; // Import local overrides if any

const Attendance = () => {
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedBatchId, setSelectedBatchId] = useState('');

    // Filter batches based on selected course
    const filteredBatches = useMemo(() => {
        return MOCK_BATCHES.filter(b => b.courseId === selectedCourseId);
    }, [selectedCourseId]);

    // Handle course change
    const handleCourseChange = (e) => {
        setSelectedCourseId(e.target.value);
        setSelectedBatchId(''); // Reset batch when course changes
    };

    // Mock Batch Stats (In a real app, these would come from the backend based on selectedBatchId)
    const batchStats = useMemo(() => {
        if (!selectedBatchId) return null;
        return {
            totalStudents: 42,
            avgAttendance: 85,
            totalSessions: 12,
            lastSessionRate: 90
        };
    }, [selectedBatchId]);

    return (
        <div className="attendance-page-wrapper">
            <header className="page-header mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Attendance Module</h1>
                        <p className="text-gray-500 mt-1">Manage student attendance across all active courses and batches.</p>
                    </div>
                    {/* Global Quick Search */}
                    <div className="d-flex align-items-center">
                        <div className="search-box-modern" style={{ width: '300px' }}>
                            <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input
                                type="text"
                                placeholder="Search courses, students, or sessions..."
                                className="search-input-modern"
                                style={{ background: '#f8fafc' }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Global Context Selector */}
            <div className="gradient-header-card mb-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label-modern">1. Select Course</label>
                        <select
                            className="form-select-modern"
                            value={selectedCourseId}
                            onChange={handleCourseChange}
                        >
                            <option value="">-- Choose Course --</option>
                            {MOCK_COURSES.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label-modern">2. Select Batch</label>
                        <select
                            className="form-select-modern"
                            value={selectedBatchId}
                            onChange={(e) => setSelectedBatchId(e.target.value)}
                            disabled={!selectedCourseId}
                        >
                            <option value="">-- Choose Batch --</option>
                            {filteredBatches.map(batch => (
                                <option key={batch.id} value={batch.id}>{batch.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Batch Stats Overlay (Visible when Batch is Selected) */}
            {selectedBatchId && batchStats && (
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0 h-100 p-3 d-flex align-items-center gap-3 flex-row">
                            <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </div>
                            <div>
                                <h3 className="m-0 fw-bold">{batchStats.totalStudents}</h3>
                                <p className="m-0 text-muted small text-uppercase fw-bold">Active Students</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0 h-100 p-3 d-flex align-items-center gap-3 flex-row">
                            <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                            </div>
                            <div>
                                <h3 className="m-0 fw-bold">{batchStats.avgAttendance}%</h3>
                                <p className="m-0 text-muted small text-uppercase fw-bold">Avg. Attendance</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0 h-100 p-3 d-flex align-items-center gap-3 flex-row">
                            <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-circle">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </div>
                            <div>
                                <h3 className="m-0 fw-bold">{batchStats.totalSessions}</h3>
                                <p className="m-0 text-muted small text-uppercase fw-bold">Total Sessions</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0 h-100 p-3 d-flex align-items-center gap-3 flex-row">
                            <div className="p-3 bg-info bg-opacity-10 text-info rounded-circle">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><activity></activity><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </div>
                            <div>
                                <h3 className="m-0 fw-bold">{batchStats.lastSessionRate}%</h3>
                                <p className="m-0 text-muted small text-uppercase fw-bold">Last Session</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Attendance Tab Content */}
            {selectedBatchId ? (
                <div className="fade-in-up">
                    <AttendanceTab batchId={selectedBatchId} showAdvancedControls={true} />
                </div>
            ) : (
                <div className="att-empty-state">
                    <div className="mb-3 p-4 bg-light rounded-circle text-primary mx-auto" style={{ width: 'fit-content' }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <polyline points="17 11 19 13 23 9"></polyline>
                        </svg>
                    </div>
                    <h3 className="text-gray-700 fw-bold mt-3">Ready to Mark Attendance?</h3>
                    <p className="text-muted max-w-md mx-auto">Please select a <strong>Course</strong> and <strong>Batch</strong> from the dropdowns above to load the session list and student registry.</p>
                </div>
            )}
        </div>
    );
};

export default Attendance;
