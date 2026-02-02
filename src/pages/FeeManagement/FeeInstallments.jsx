import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLayers, FiCalendar, FiDollarSign, FiPlus, FiTrash2, FiAlertCircle, FiCheckCircle, FiUsers, FiX, FiEdit3, FiClock, FiPieChart, FiGrid, FiList } from 'react-icons/fi';
import './FeeManagement.css';
import { courseService } from '../Courses/services/courseService';
import { batchService } from '../Batches/services/batchService';
import { enrollmentService } from '../Batches/services/enrollmentService';
import { getAllStudents, createInstallmentPlan, getStudentInstallments } from '../../services/feeService';

const FeeInstallments = () => {
    const [batches, setBatches] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBatchId, setSelectedBatchId] = useState('');
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configuration State for ACTIVE student
    const [configuringStudent, setConfiguringStudent] = useState(null);
    const [planType, setPlanType] = useState('OneTime');
    const [installments, setInstallments] = useState([]);
    const [customCount, setCustomCount] = useState(2);

    // Load Courses and Batches from Backend
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch courses
                const coursesData = await courseService.getCourses();
                setCourses(coursesData || []);

                // Fetch all batches
                const batchesData = await batchService.getAllBatches();

                // Create a Map for faster Course Lookup
                const courseMap = {};
                coursesData.forEach(c => {
                    // Normalize keys and store fee
                    courseMap[String(c.courseId)] = Number(c.price || c.fee || c.amount || c.courseFee || 0);
                });
                console.log("💰 Fee Logic - Course Fees Map:", courseMap);

                // Fetch fresh student counts & lists for "Members Present" accuracy
                const batchesWithCounts = await Promise.all(batchesData.map(async (b) => {
                    try {
                        const s = await enrollmentService.getStudentsByBatch(b.batchId);

                        // Find Fee for this Batch's Course
                        // Handle potential nested course object or direct ID
                        const cId = b.courseId || b.course?.courseId;
                        const batchCourseFees = courseMap[String(cId)] || 0;
                        console.log(`Checking Batch ${b.batchName} (Course ${b.courseId}) -> Found Fee: ${batchCourseFees}`);

                        // Map Core Students to Fee UI Structure
                        const mappedStudents = s.map(stu => ({
                            ...stu,
                            id: stu.studentId || stu.id,
                            name: stu.studentName || stu.name || "Unknown Student",
                            // Priority: Student Specific Fee -> Batch Override -> Course Fee -> 0
                            totalFee: stu.totalFee || b.fee || batchCourseFees || 0,
                            paidAmount: stu.paidAmount || 0,
                            installments: stu.installments || []
                        }));

                        return {
                            ...b,
                            studentCount: s.length,
                            studentList: mappedStudents
                        };
                    } catch (err) {
                        console.error('Error enriching batch:', err);
                        return { ...b, studentCount: 0, studentList: [] };
                    }
                }));

                setBatches(batchesWithCounts || []);
            } catch (error) {
                console.error('Error fetching courses/batches:', error);
                setCourses([]);
                setBatches([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle Batch Selection
    useEffect(() => {
        if (selectedBatchId) {
            const batch = batches.find(b => String(b.batchId) === String(selectedBatchId));
            if (batch) {
                setSelectedBatch(batch);
                setConfiguringStudent(null); // Close any open config
            }
        } else {
            setSelectedBatch(null);
        }
    }, [selectedBatchId, batches]);

    // Open Configuration for a Student
    const openStudentConfig = (student) => {
        setConfiguringStudent(student);

        // Load existing or default
        if (student.installments && student.installments.length > 0) {
            setInstallments(student.installments);
            setPlanType(student.planType || 'Custom');
            setCustomCount(student.installments.length);
        } else {
            // Default to OneTime of STUDENT'S total fee
            initializeInstallments('OneTime', student.totalFee || 0);
        }
    };

    const initializeInstallments = (type, totalAmount) => {
        setPlanType(type);
        let count = 1;

        switch (type) {
            case 'OneTime': count = 1; break;
            case 'Quarterly': count = 4; break;
            case 'HalfYearly': count = 6; break;
            case 'Yearly': count = 12; break;
            case 'Custom': count = Number(customCount) || (customCount === '' ? 1 : customCount); break;
            default: count = 1;
        }

        const baseAmount = Math.floor(totalAmount / count);
        let remainder = totalAmount - (baseAmount * count);

        const newInstallments = Array.from({ length: count }).map((_, idx) => {
            const isLast = idx === count - 1;
            return {
                id: Date.now() + idx,
                name: `Installment ${idx + 1}`,
                amount: isLast ? baseAmount + remainder : baseAmount,
                dueDate: ''
            };
        });

        setInstallments(newInstallments);
    };

    const handleTypeChange = (type) => {
        if (!configuringStudent) return;
        const total = configuringStudent.totalFee || 0;

        if (type === 'Custom') {
            setPlanType(type);
            initializeInstallments('Custom', total);
        } else {
            initializeInstallments(type, total);
        }
    };

    const handleCustomCountChange = (e) => {
        const val = e.target.value;

        // Allow clearing the input (empty string)
        if (val === '') {
            setCustomCount('');
            return;
        }

        const count = parseInt(val);

        // Strict Check: Don't allow 0 or negative numbers
        if (count <= 0) return;

        // Update state if it's a number (or allow typing)
        setCustomCount(count);

        // Limit the heavy recalculation/logic to valid bounds
        if (count <= 24 && planType === 'Custom' && configuringStudent) {
            const total = configuringStudent.totalFee || 0;
            const baseAmount = Math.floor(total / count);
            let remainder = total - (baseAmount * count);

            const newInstallments = Array.from({ length: count }).map((_, idx) => ({
                id: Date.now() + idx,
                name: `Installment ${idx + 1}`,
                amount: idx === count - 1 ? baseAmount + remainder : baseAmount,
                dueDate: ''
            }));
            setInstallments(newInstallments);
        }
    };

    const updateInstallment = (index, field, value) => {
        const newInst = [...installments];
        newInst[index] = { ...newInst[index], [field]: value };
        setInstallments(newInst);
    };

    const removeInstallment = (index) => {
        if (installments.length <= 1) {
            alert("At least one installment is required.");
            return;
        }
        const newInst = installments.filter((_, i) => i !== index);
        setInstallments(newInst);
        setCustomCount(newInst.length);
    };

    const saveStudentPlan = async () => {
        if (!configuringStudent || !selectedBatch) return;

        const totalFee = configuringStudent.totalFee || 0;
        const sum = installments.reduce((acc, curr) => acc + Number(curr.amount), 0);

        // Validation: Sum check with 1 unit tolerance for rounding errors
        if (Math.abs(sum - totalFee) > 1) {
            alert(`Validation Error: Sum (₹${sum}) must equal Total Fee (₹${totalFee}).`);
            return;
        }

        if (installments.some(i => !i.dueDate)) {
            alert("Please set a Due Date for all installments.");
            return;
        }

        try {
            // Prepare Payload for Friend's Backend
            const payload = {
                planType: planType,
                totalFee: totalFee,
                installments: installments.map(i => ({
                    name: i.name,
                    amount: Number(i.amount),
                    dueDate: i.dueDate, // Date input values are already YYYY-MM-DD
                    status: 'PENDING'
                }))
            };

            // Call API
            await createInstallmentPlan(configuringStudent.id, payload);

            alert(`Successfully saved installment plan for ${configuringStudent.name} to Backend!`);

            // Optimistic Update: Update Local State to reflect changes immediately
            const updatedBatches = batches.map(b => {
                if (b.id === selectedBatch.id) {
                    const updatedList = b.studentList.map(s => {
                        if (s.id === configuringStudent.id) {
                            return {
                                ...s,
                                installments: installments,
                                planType: planType
                            };
                        }
                        return s;
                    });
                    return { ...b, studentList: updatedList };
                }
                return b;
            });

            // Optionally update local storage as a cache/fallback
            localStorage.setItem('lms_fee_data', JSON.stringify(updatedBatches));

            setBatches(updatedBatches);
            setConfiguringStudent(null); // Close modal

        } catch (error) {
            console.error("Failed to save plan to backend:", error);

            let displayMsg = "An unexpected error occurred.";

            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                displayMsg = `Timeout Error: The backend took too long to respond (>30s).\nThis usually means the connection is slow or the server is busy.`;
            } else if (error.message === 'Network Error') {
                displayMsg = `Network Error: Cannot reach 192.168.1.16:8080.\n1. Check if the backend is running.\n2. Disable Firewall on the backend laptop.\n3. Verify IP address.`;
            } else if (error.response) {
                // Server responded with non-2xx code
                displayMsg = `Server Error (${error.response.status}): ${JSON.stringify(error.response.data) || error.message}`;
            } else {
                displayMsg = error.message || "Unknown Error";
            }

            alert(`e: ${displayMsg}`);

            // Fallback for demo purposes if backend fails (so user can still see UI working)
            if (window.confirm(`${displayMsg}\n\nDo you want to save locally instead (for demo)?`)) {
                // Update Batch State Locally
                const updatedBatches = batches.map(b => {
                    if (b.id === selectedBatch.id) {
                        const updatedList = b.studentList.map(s => {
                            if (s.id === configuringStudent.id) {
                                return {
                                    ...s,
                                    installments: installments,
                                    planType: planType
                                };
                            }
                            return s;
                        });
                        return { ...b, studentList: updatedList };
                    }
                    return b;
                });
                localStorage.setItem('lms_fee_data', JSON.stringify(updatedBatches));
                setBatches(updatedBatches);
                setConfiguringStudent(null);
            }
        }
    };

    if (loading) {
        return (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 16, color: '#64748b' }}>Loading courses and batches...</div>
            </div>
        );
    }

    if (!batches.length && !loading) {
        return (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 16, color: '#64748b', marginBottom: 8 }}>No batches found</div>
                <div style={{ fontSize: 14, color: '#94a3b8' }}>Create batches first to configure installment plans</div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="installments-container">
            <div className="fee-header" style={{ marginBottom: 24 }}>
                <div className="fee-title">
                    <h1>Installment Plans</h1>
                </div>
                <div className="fee-subtitle">Select a student to configure their payment split</div>
            </div>

            {/* Filters */}
            <div className="glass-card form-section" style={{ marginBottom: 24, display: 'flex', gap: 24 }}>
                <div style={{ flex: 1 }}>
                    <label className="form-label">Select Course</label>
                    <div style={{ position: 'relative' }}>
                        <FiLayers style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
                        <select
                            className="form-select"
                            style={{ paddingLeft: 38 }}
                            value={selectedCourse}
                            onChange={(e) => {
                                setSelectedCourse(e.target.value);
                                setSelectedBatchId('');
                            }}
                        >
                            <option value="">-- Select Course --</option>
                            {courses.map(c => (
                                <option key={c.courseId} value={c.courseId}>
                                    {c.courseName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <label className="form-label">Select Batch</label>
                    <div style={{ position: 'relative' }}>
                        <FiLayers style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
                        <select
                            className="form-select"
                            style={{ paddingLeft: 38 }}
                            value={selectedBatchId}
                            onChange={(e) => setSelectedBatchId(e.target.value)}
                            disabled={!selectedCourse}
                        >
                            <option value="">-- Select Batch --</option>
                            {batches.filter(b => String(b.courseId) === String(selectedCourse)).map(b => (
                                <option key={b.batchId} value={b.batchId}>
                                    {b.batchName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Batches Grid (When Course Selected, No Batch Selected) */}
            {selectedCourse && !selectedBatchId && (
                <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                    {batches.filter(b => String(b.courseId) === String(selectedCourse)).map(batch => (
                        <motion.div
                            key={batch.batchId}
                            className="glass-card"
                            whileHover={{ y: -5, borderColor: '#6366f1' }}
                            onClick={() => setSelectedBatchId(batch.batchId)}
                            style={{ cursor: 'pointer', transition: 'all 0.2s', padding: 24 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                                <div style={{ width: 48, height: 48, background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca', fontSize: 20 }}>
                                    <FiUsers />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{batch.batchName}</h4>
                                    <div style={{ fontSize: 13, color: '#64748b' }}>{batch.courseName || 'Course'}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: 12 }}>
                                <div style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>Members Present</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{batch.studentCount || 0}</div>
                            </div>
                        </motion.div>
                    ))}
                    {batches.filter(b => String(b.courseId) === String(selectedCourse)).length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                            No batches found for this course.
                        </div>
                    )}
                </div>
            )}

            {/* Student List Grid (Only When Batch Selected) */}
            {selectedBatchId && selectedBatch && (
                <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                    {selectedBatch.studentList?.map(student => (
                        <motion.div
                            key={student.id}
                            className="glass-card student-card"
                            whileHover={{ y: -5, borderColor: '#6366f1' }}
                            onClick={() => openStudentConfig(student)}
                            style={{
                                cursor: 'pointer',
                                border: '1px solid transparent',
                                transition: 'all 0.2s',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 16 }}>{student.name}</h4>
                                    <div style={{ fontSize: 12, color: '#64748b' }}>ID: {student.id}</div>
                                </div>
                                <div style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                                    {student.planType === 'OneTime' || !student.planType ? 'One-Time' : student.planType}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Total Fee</div>
                                    <div style={{ fontWeight: 700, color: '#0f172a' }}>₹{(student.totalFee || 0).toLocaleString()}</div>
                                </div>
                                <button className="btn-icon" style={{ background: '#f8fafc', width: 32, height: 32 }}>
                                    <FiEdit3 />
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {(!selectedBatch.studentList || selectedBatch.studentList.length === 0) && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                            No students found in this batch.
                        </div>
                    )}
                </div>
            )}

            {/* Configuration Modal / Overlay */}
            <AnimatePresence>
                {configuringStudent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999,
                            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '100px 0 20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            className="glass-card no-scrollbar"
                            style={{ width: '95%', maxWidth: 700, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto', position: 'relative', background: 'white' }}
                        >
                            <button
                                onClick={() => setConfiguringStudent(null)}
                                style={{ position: 'absolute', right: 20, top: 20, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748b' }}
                            >
                                <FiX />
                            </button>

                            <div style={{ paddingBottom: 16, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
                                <h2 style={{ margin: 0, fontSize: 20 }}>Configure Payment Split</h2>
                                <div style={{ color: '#64748b' }}>For {configuringStudent.name} (ID: {configuringStudent.id})</div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600, color: '#334155' }}>Total Fee to Split</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ color: '#64748b', fontSize: 18 }}>₹</span>
                                    <input
                                        type="number"
                                        value={configuringStudent.totalFee || ''}
                                        onChange={(e) => {
                                            const newFee = Number(e.target.value);
                                            setConfiguringStudent(prev => ({ ...prev, totalFee: newFee }));
                                            // Recalculate installments immediately with new fee
                                            initializeInstallments(planType, newFee);
                                        }}
                                        style={{
                                            fontSize: 20, fontWeight: 700, color: '#6366f1',
                                            border: 'none', background: 'transparent', width: 120, textAlign: 'right', outline: 'none'
                                        }}
                                    />
                                    <FiEdit3 size={16} color="#94a3b8" />
                                </div>
                            </div>

                            {/* Plan Configuration Logic (Reused) */}
                            <div className="form-group" style={{ marginBottom: 24 }}>
                                <label className="form-label" style={{ marginBottom: 12 }}>Installment Plan Type</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                                    {[
                                        { id: 'OneTime', label: 'One Time', sub: 'Single Pay', icon: FiClock },
                                        { id: 'Quarterly', label: 'Quarterly', sub: '4 Parts', icon: FiPieChart },
                                        { id: 'HalfYearly', label: 'Half Year', sub: '6 Parts', icon: FiPieChart },
                                        { id: 'Yearly', label: 'Yearly', sub: '12 Parts', icon: FiGrid },
                                        { id: 'Custom', label: 'Custom', sub: 'Flexible', icon: FiList }
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => handleTypeChange(type.id)}
                                            style={{
                                                margin: 0, padding: '16px 8px',
                                                background: planType === type.id ? 'var(--primary-gradient)' : 'white',
                                                border: planType === type.id ? 'none' : '1px solid #e2e8f0',
                                                borderRadius: 12,
                                                cursor: 'pointer',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                                                transition: 'all 0.2s',
                                                boxShadow: planType === type.id ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                                                color: planType === type.id ? 'white' : '#64748b'
                                            }}
                                        >
                                            <type.icon size={20} />
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{type.label}</div>
                                                <div style={{ fontSize: 10, opacity: 0.8 }}>{type.sub}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {planType === 'Custom' && (
                                <div className="form-group" style={{ marginBottom: 24, maxWidth: 120 }}>
                                    <label className="form-label">Count</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        min="1" max="24"
                                        value={customCount}
                                        onChange={handleCustomCountChange}
                                    />
                                </div>
                            )}

                            {/* Table Header Row - For perfect alignment */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: planType === 'Custom' ? '50px 2fr 1.5fr 1.5fr 40px' : '50px 2fr 1.5fr 1.5fr', gap: 10,
                                padding: '0 10px 0 10px', marginBottom: 8
                            }}>
                                <div></div> {/* Empty for Index */}
                                <label className="form-label" style={{ fontSize: 11, color: '#64748b' }}>LABEL</label>
                                <label className="form-label" style={{ fontSize: 11, color: '#64748b' }}>AMOUNT</label>
                                <label className="form-label" style={{ fontSize: 11, color: '#64748b' }}>DUE DATE</label>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 350, overflowY: 'auto', paddingRight: 4 }} className="no-scrollbar">
                                {installments.map((inst, idx) => (
                                    <div key={inst.id} style={{
                                        display: 'grid', gridTemplateColumns: planType === 'Custom' ? '50px 2fr 1.5fr 1.5fr 40px' : '50px 2fr 1.5fr 1.5fr', gap: 10, alignItems: 'center',
                                        padding: '12px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12
                                    }}>
                                        <div style={{ fontWeight: 600, color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>#{idx + 1}</div>
                                        <div>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={inst.name}
                                                onChange={(e) => updateInstallment(idx, 'name', e.target.value)}
                                                style={{ background: 'white', fontSize: 13 }}
                                            />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: 10, top: 10, fontSize: 12, color: '#64748b' }}>₹</span>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={inst.amount}
                                                onChange={(e) => updateInstallment(idx, 'amount', e.target.value)}
                                                style={{ background: 'white', fontSize: 13, paddingLeft: 24 }}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={inst.dueDate}
                                                onChange={(e) => updateInstallment(idx, 'dueDate', e.target.value)}
                                                style={{ background: 'white', fontSize: 13 }}
                                            />
                                        </div>
                                        {planType === 'Custom' && (
                                            <button
                                                onClick={() => removeInstallment(idx)}
                                                className="btn-icon"
                                                style={{ width: 32, height: 32, color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}
                                                title="Remove Installment"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <button className="btn-secondary" onClick={() => setConfiguringStudent(null)} style={{ background: 'transparent', border: '1px solid #cbd5e1' }}>Cancel</button>
                                <button className="btn-primary" onClick={saveStudentPlan}>
                                    <FiSave /> Save Configuration
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )
                }
            </AnimatePresence >
        </motion.div >
    );
};

export default FeeInstallments;
