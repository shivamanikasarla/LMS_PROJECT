import React, { useMemo } from 'react';
import AttendanceReport from '../components/AttendanceReport';

import { MOCK_COURSES, MOCK_BATCHES } from '../data/mockData';

const ReportPage = ({ batchId }) => {
    const [selectedCourse, setSelectedCourse] = React.useState('');
    const [selectedBatch, setSelectedBatch] = React.useState('');

    // Pre-select batch if batchId prop is provided
    React.useEffect(() => {
        if (batchId) {
            const batch = MOCK_BATCHES.find(b => b.id === batchId);
            if (batch) {
                setSelectedBatch(batchId);
                setSelectedCourse(batch.courseId);
            }
        }
    }, [batchId]);

    // Derived state for batches dropdown
    const availableBatches = useMemo(() => {
        if (!selectedCourse) return MOCK_BATCHES;
        return MOCK_BATCHES.filter(b => b.courseId === selectedCourse);
    }, [selectedCourse]);

    // Mock Data Generation based on Selected Batch
    const mockBatchHistory = useMemo(() => {
        if (!selectedBatch) return [];

        const batch = MOCK_BATCHES.find(b => b.id === selectedBatch);
        const course = MOCK_COURSES.find(c => c.id === batch?.courseId);

        // Generate pseudo-students for this batch
        const studentCount = 15; // Simulate a class of 15
        const students = Array.from({ length: studentCount }).map((_, i) => ({
            id: `ST-${selectedBatch}-${i + 1}`,
            name: `Student ${i + 1} (${batch?.name})`
        }));

        // Only generate for TODAY
        const today = new Date().toISOString().split('T')[0];

        const history = [];

        // Helper to get random status
        const getStatus = () => {
            const rand = Math.random();
            if (rand > 0.9) return 'ABSENT';
            if (rand > 0.8) return 'LATE';
            return 'PRESENT';
        };

        // Generate history for today only
        students.forEach(student => {
            const status = getStatus();
            let minutes = 0;
            if (status === 'PRESENT') minutes = 60;
            if (status === 'LATE') minutes = 45;

            history.push({
                id: crypto.randomUUID(),
                date: today,
                courseName: course?.title || 'Unknown Course',
                studentName: student.name,
                studentId: student.id,
                status,
                method: Math.random() > 0.5 ? 'QR Scan' : 'Manual',
                attendanceInMinutes: minutes
            });
        });

        return history;
    }, [selectedBatch]);

    return (
        <div className="fade-in">
            {/* Batch Selection Controls - Only show if no batchId is provided */}
            {!batchId && (
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
                                        setSelectedBatch(''); // Reset batch on course change
                                    }}
                                >
                                    <option value="">Select Course</option>
                                    {MOCK_COURSES.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-secondary">Batch</label>
                                <select
                                    className="form-select"
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                    disabled={!availableBatches.length}
                                >
                                    <option value="">Select Batch</option>
                                    {availableBatches.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedBatch ? (
                <AttendanceReport history={mockBatchHistory} />
            ) : (
                <div className="text-center py-5 text-muted">
                    <p>Please select a Course and Batch to view the attendance report.</p>
                </div>
            )}
        </div>
    );
};

export default ReportPage;
