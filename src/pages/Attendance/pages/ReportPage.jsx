import React, { useMemo, useState, useEffect } from 'react';
import AttendanceReport from '../components/AttendanceReport';
import { courseService } from '../../Courses/services/courseService';
import { batchService } from '../../Batches/services/batchService';
import { attendanceService } from '../services/attendanceService';

const ReportPage = ({ batchId: propBatchId }) => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBatch, setSelectedBatch] = useState(propBatchId || '');

    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initial Load - Courses (if no propBatchId) or Batch Details (if propBatchId)
    useEffect(() => {
        const init = async () => {
            if (propBatchId) {
                // If embedded, we might just need to load history directly, 
                // but let's try to get batch details to know course? 
                // Actually the report might just need history.
                loadHistory(propBatchId);
            } else {
                // Standalone mode - load courses for filter
                try {
                    const data = await courseService.getCourses();
                    setCourses(data);
                } catch (e) { console.error(e); }
            }
        };
        init();
    }, [propBatchId]);

    // When Course Changes (Standalone mode)
    useEffect(() => {
        if (!propBatchId && selectedCourse) {
            // Load batches for this course
            // Ideally batchService has getBatchesByCourseId, or we filter from all
            const loadBatches = async () => {
                try {
                    const allBatches = await batchService.getAllBatches();
                    // Filter mainly by courseId
                    // Note: batch.courseId might be number or string
                    setBatches(allBatches.filter(b => String(b.courseId) === String(selectedCourse)));
                } catch (e) { console.error(e); }
            };
            loadBatches();
        } else if (!propBatchId) {
            setBatches([]);
        }
    }, [selectedCourse, propBatchId]);

    // When Batch Changes (Standalone or via prop selection update?)
    // Actually if propBatchId is set, selectedBatch is set initally.
    // If standalone, user selects batch.
    useEffect(() => {
        if (!propBatchId && selectedBatch) {
            loadHistory(selectedBatch);
        }
    }, [selectedBatch, propBatchId]);

    const loadHistory = async (id) => {
        setLoading(true);
        try {
            // Real API call
            // The backend endpoint might logically be different or not ready, 
            // but we must implement the call as requested.
            const data = await attendanceService.getAttendanceHistory(id);
            // Ensure data structure matches what AttendanceReport expects
            // or map it here if needed.
            // Assuming data is array of objects.
            setHistory(data || []);
        } catch (error) {
            console.error("Failed to load attendance history", error);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            {/* Batch Selection Controls - Only show if no batchId prop is provided */}
            {!propBatchId && (
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-secondary">Course</label>
                                <select
                                    className="form-select"
                                    value={selectedCourse}
                                    onChange={(e) => {
                                        setSelectedCourse(e.target.value);
                                        setSelectedBatch('');
                                        setHistory([]);
                                    }}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(c => (
                                        <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-secondary">Batch</label>
                                <select
                                    className="form-select"
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                    disabled={!batches.length}
                                >
                                    <option value="">Select Batch</option>
                                    {batches.map(b => (
                                        <option key={b.batchId} value={b.batchId}>{b.batchName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(selectedBatch || propBatchId) ? (
                loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted">Loading attendance data...</p>
                    </div>
                ) : (
                    <AttendanceReport history={history} />
                )
            ) : (
                <div className="text-center py-5 text-muted">
                    <p>Please select a Course and Batch to view the attendance report.</p>
                </div>
            )}
        </div>
    );
};

export default ReportPage;
