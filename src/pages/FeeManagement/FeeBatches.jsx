import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUsers, FiChevronRight, FiSearch, FiFilter, FiMoreVertical,
    FiArrowLeft, FiCalendar, FiClock, FiCheckCircle,
    FiAlertCircle, FiDownload, FiCreditCard, FiTrash2, FiEdit3, FiLoader, FiRefreshCcw
} from 'react-icons/fi';
import './FeeManagement.css';
import { getAllStudents, getStudentsByBatch } from '../../services/feeService';
import { batchService } from '../../pages/Batches/services/batchService';
import { enrollmentService } from '../../pages/Batches/services/enrollmentService';
import { courseService } from '../../pages/Courses/services/courseService';

const FeeBatches = () => {
    // --- State Management ---
    const [view, setView] = useState('grid'); // grid, list, detail
    const [batches, setBatches] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feeDetails, setFeeDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [discountForm, setDiscountForm] = useState({ amount: '', reason: '' });

    // Payment State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        mode: 'Online', // Online, Cash, Cheque
        reference: '',
        date: new Date().toISOString().split('T')[0]
    });

    // Filter & Search States for Student List
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('All'); // New Course Filter State

    // --- 1) LOAD BATCHES FROM BACKEND ---
    useEffect(() => {
        initializeData();
    }, []);

    const initializeData = async () => {
        setLoading(true);
        try {
            // Fetch batches from Fee Backend
            const batchesData = await batchService.getAllBatches();

            // Fetch Courses for Fee Info
            const coursesData = await courseService.getCourses();
            const courseFeeMap = {};
            if (coursesData && Array.isArray(coursesData)) {
                coursesData.forEach(c => {
                    courseFeeMap[c.courseId] = c.fee || c.price || c.amount || 0;
                });
            }

            // Fetch fresh student counts for "Members Present" accuracy
            const batchesWithCounts = await Promise.all(batchesData.map(async (b) => {
                try {
                    const s = await enrollmentService.getStudentsByBatch(b.batchId);
                    return { ...b, _realCount: s.length };
                } catch { return { ...b, _realCount: 0 }; }
            }));

            // Transform backend data to match UI expectations
            const transformedBatches = batchesWithCounts.map(batch => ({
                id: batch.batchId,
                batchId: batch.batchId,
                name: batch.batchName,
                course: batch.courseName || 'Course',
                courseId: batch.courseId,
                courseFee: courseFeeMap[batch.courseId] || 0, // Store correct fee here
                year: batch.academicYear || batch.startDate?.substring(0, 4) || '2025-26',
                students: batch._realCount, // Actual Members Present
                collected: calculateCollectionPercentage(batch),
                studentList: [], // Will be loaded when batch is clicked
            }));

            setBatches(transformedBatches);
        } catch (err) {
            console.error('Error loading batches:', err);
            setError('Failed to load batches from backend');
            setBatches([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper to calculate collection percentage
    const calculateCollectionPercentage = (batch) => {
        // This would come from backend calculation
        // For now, return a placeholder
        return batch.collectionRate || 0;
    };

    // --- 2) BATCH -> STUDENTS FLOW ---
    const handleBatchClick = async (batch) => {
        setSelectedBatch(batch);
        setSearchTerm(''); // Reset search
        setFilterStatus('All'); // Reset filter
        setLoading(true);

        try {
            // Fetch students using Enrollment Service (from Core LMS)
            // This ensures we see students even if Fee Backend is empty/isolated
            const enrolledStudents = await enrollmentService.getStudentsByBatch(batch.id);

            // Map to Fee Structure
            // Note: feeService.getStudentsByBatch might eventually replace this to get REAL fee data.
            // For now, we map Core students to Fee UI structure (with placeholder fee amounts).
            const mappedStudents = enrolledStudents.map(s => ({
                id: s.studentId || s.id,
                name: s.studentName || s.name || "Unknown Student",
                roll: s.rollNo || `STU-${s.id || s.studentId}`,
                totalFee: s.totalFee || batch.courseFee || 0, // Fee from Course (via Batch lookup) or 0
                paidAmount: s.paidAmount || 0,
                status: s.status || 'PENDING'
            }));

            setStudents(mappedStudents);
            setView('list');
        } catch (error) {
            console.error("Failed to fetch batch students:", error);
            setStudents([]);
            setView('list');
        } finally {
            setLoading(false);
        }
    };

    // --- 3) STUDENT FEE STATUS CALCULATION ---
    const calculateStatus = (student) => {
        // totalFee, paidAmount, dueAmount, feeStatus
        const total = student.totalFee || 0;
        const paid = student.paidAmount || 0;
        const due = total - paid;

        let status = student.status ? student.status.toUpperCase() : 'PENDING';

        // Auto-calculation fallback if no explicit status
        if (!student.status) {
            if (paid === 0) status = 'PENDING';
            else if (paid < total) status = 'PARTIAL';
            else if (paid >= total) status = 'PAID';
        }

        return { total, paid, due, status };
    };

    // --- 4) STUDENT -> FEE DETAILS ---
    const handleStudentClick = async (student) => {
        setLoading(true);
        setSelectedStudent(student);

        // Simulate fetching details or extract from nested if extended
        // For now using mock details derived from the student object + batch info
        // In full app, we would store deep structure. Here we simulate structure based on totals.

        setTimeout(() => {
            setFeeDetails({
                structure: [
                    { name: 'Tuition Fee (Base)', amount: student.totalFee },
                ],
                totalFee: student.totalFee,
                paidAmount: student.paidAmount || 0,
                pendingAmount: (student.totalFee - (student.paidAmount || 0)),
                dueDate: '2026-03-31',
                payments: [
                    // Mock payment if paid > 0
                    ...(student.paidAmount > 0 ? [{ id: 'p1', date: student.lastPay || '2025-01-01', mode: 'Online', reference: 'TXN-AUTO', amount: student.paidAmount }] : [])
                ],
                // Simulated installments (waterfall logic will apply to these)
                installments: [
                    { id: 1, name: 'Term 1 (Fall)', amount: Math.floor(student.totalFee * 0.4), dueDate: '2025-08-15' },
                    { id: 2, name: 'Term 2 (Winter)', amount: Math.floor(student.totalFee * 0.3), dueDate: '2025-12-15' },
                    { id: 3, name: 'Term 3 (Spring)', amount: Math.ceil(student.totalFee * 0.3), dueDate: '2026-03-15' }
                ]
            });
            setView('detail');
            setLoading(false);
        }, 300);
    };

    const handleBack = () => {
        if (view === 'detail') {
            setFeeDetails(null);
            setView('list');
        }
        else if (view === 'list') {
            setSelectedBatch(null);
            setStudents([]);
            setView('grid');
        }
    };

    // --- 5) FEE ALLOCATION (ADMIN ACTION) ---
    const handleAllocateFee = async () => {
        // Example payload
        const payload = {
            studentId: selectedStudent?.id, // or batchId if bulk
            feeType: 'Tuition',
            amount: 50000
        };

        try {
            const res = await fetch('/api/fee-allocations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                // Refresh data
                alert('Fee Allocated Successfully');
                // update local state or re-fetch
            } else {
                // Simulation of success for demo
                alert('Fee Allocated Successfully (Simulated)');
            }
        } catch (e) {
            console.error(e);
            alert('Fee Allocated Successfully (Simulated)');
        }
    };

    // --- 7) DISCOUNT APPLY (ADMIN) ---
    // --- 7) DISCOUNT APPLY (ADMIN) ---
    const handleApplyDiscount = () => {
        if (feeDetails.pendingAmount <= 0) {
            return alert("Cannot apply discount: Student has already paid full fees (or excess).");
        }
        setShowDiscountModal(true);
    };

    const submitDiscount = () => {
        if (!discountForm.amount || !discountForm.reason) return alert('Please fill all fields');
        const discountAmt = Number(discountForm.amount);

        if (discountAmt <= 0) return alert('Invalid amount');

        if (discountAmt > feeDetails.pendingAmount) {
            return alert(`Discount cannot exceed pending amount (₹${feeDetails.pendingAmount.toLocaleString()}). Total Fee cannot be less than Paid Amount.`);
        }

        // Update Local State
        setFeeDetails(prev => {
            const discountAmt = Number(discountForm.amount);
            const newTotal = prev.totalFee - discountAmt;
            const newStructure = [...prev.structure, { name: `Discount (${discountForm.reason})`, amount: -discountAmt }];

            return {
                ...prev,
                totalFee: newTotal,
                pendingAmount: newTotal - prev.paidAmount,
                structure: newStructure
            };
        });

        // TODO: Save to LocalStorage (Exercise for later)
        setShowDiscountModal(false);
        setDiscountForm({ amount: '', reason: '' });
        alert(`Discount of ₹${Number(discountForm.amount)} applied successfully.`);
    };

    const handleRecordPayment = () => {
        // Failsafe Check
        if (feeDetails.pendingAmount <= 0) return alert("Fee is fully paid. Cannot record further payments.");

        // 1. Validate
        if (!paymentForm.amount || Number(paymentForm.amount) <= 0) return alert("Please enter a valid amount");

        const payAmount = Number(paymentForm.amount);
        const currentPending = feeDetails.totalFee - feeDetails.paidAmount;

        if (payAmount > currentPending) {
            return alert(`Payment exceeds pending amount. Maximum payable: ₹${currentPending.toLocaleString()}`);
        }

        // 2. Update Local State (Immediate Feedback)
        setFeeDetails(prev => {
            const newPaid = prev.paidAmount + payAmount;
            const newPending = prev.totalFee - newPaid;

            const newPayment = {
                id: Date.now(),
                date: new Date(paymentForm.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                mode: paymentForm.mode,
                reference: paymentForm.reference || `#${Math.floor(Math.random() * 10000)}`,
                amount: payAmount
            };

            return {
                ...prev,
                paidAmount: newPaid,
                pendingAmount: newPending,
                payments: [newPayment, ...(prev.payments || [])]
            };
        });

        // 3. Persist to LocalStorage
        const allBatches = JSON.parse(localStorage.getItem('lms_fee_data') || '[]');
        const updatedBatches = allBatches.map(b => {
            // Find the batch
            if (b.id === selectedBatch.id) {
                // Find the student
                const sIndex = b.studentList.findIndex(s => s.id === selectedStudent.id);
                if (sIndex !== -1) {
                    const student = b.studentList[sIndex];

                    // Update Student Data
                    student.paidAmount = (student.paidAmount || 0) + payAmount;

                    // Update status
                    if (student.paidAmount >= student.totalFee) student.status = 'PAID';
                    else if (student.paidAmount > 0) student.status = 'PARTIAL';

                    // Add to payments history if it existed (mock data usually doesn't have it nested deep, but we can try)
                    if (!student.payments) student.payments = [];
                    student.payments.push({
                        id: Date.now(),
                        amount: payAmount,
                        date: paymentForm.date,
                        mode: paymentForm.mode,
                        reference: paymentForm.reference
                    });
                }
            }
            return b;
        });
        localStorage.setItem('lms_fee_data', JSON.stringify(updatedBatches));

        // 4. Reset & Close
        setShowPaymentModal(false);
        setPaymentForm({ amount: '', mode: 'Online', reference: '', date: new Date().toISOString().split('T')[0] });
        alert("Payment Recorded Successfully!");
    };

    // --- 8) REFUND INITIATION ---
    const handleRefund = async (paymentId) => {
        if (!window.confirm('Initiate Refund?')) return;
        try {
            await fetch('/api/fee-refunds', {
                method: 'POST',
                body: JSON.stringify({ paymentId })
            });
            alert('Refund Initiated');
            // Update UI
        } catch (e) {
            console.error(e);
            alert('Refund Initiated (Simulated)');
        }
    };

    // --- 9) RECEIPTS ---
    const handleDownloadReceipt = async (paymentId) => {
        // In a real app this would trigger a file download from the URL
        // window.open(`/api/payments/${paymentId}/receipt`, '_blank');
        alert(`Downloading receipt for payment ${paymentId}...`);
    };


    // --- NEW: Remove Student from Batch ---
    const handleRemoveStudent = (e, studentId) => {
        e.stopPropagation();
        if (!window.confirm('Remove this student from the batch?')) return;

        // 1. Update Students List View
        const updatedStudents = students.filter(s => s.id !== studentId);
        setStudents(updatedStudents);

        // 2. Update Batch Data (State & LocalStorage)
        if (selectedBatch && String(selectedBatch.id).startsWith('custom-')) {
            const storedBatches = JSON.parse(localStorage.getItem('userCreatedBatches') || '[]');
            const batchIndex = storedBatches.findIndex(b => b.id === selectedBatch.id);

            if (batchIndex !== -1) {
                // Update Storage
                storedBatches[batchIndex].studentList = updatedStudents;
                storedBatches[batchIndex].students = updatedStudents.length;
                localStorage.setItem('userCreatedBatches', JSON.stringify(storedBatches));

                // Update Local State for Grid View consistency
                setBatches(prev => prev.map(b => b.id === selectedBatch.id ? {
                    ...b,
                    students: updatedStudents.length,
                    studentList: updatedStudents
                } : b));

                // Update Selected Batch Ref
                setSelectedBatch(prev => ({ ...prev, students: updatedStudents.length, studentList: updatedStudents }));
            }
        }
    };

    // --- Views ---

    const handleDeleteBatch = (e, batchId) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this fee batch?')) return;

        setBatches(prev => prev.filter(b => b.id !== batchId));

        if (String(batchId).startsWith('custom-')) {
            const storedBatches = JSON.parse(localStorage.getItem('userCreatedBatches') || '[]');
            const updatedStored = storedBatches.filter(b => b.id !== batchId);
            localStorage.setItem('userCreatedBatches', JSON.stringify(updatedStored));
        }
    };

    // Helper for dropdown
    const [activeMenu, setActiveMenu] = useState(null);

    useEffect(() => {
        const closeMenu = () => setActiveMenu(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    const renderBatchGrid = () => {
        const uniqueCourses = ['All', ...new Set(batches.map(b => b.course).filter(Boolean))];
        const filteredBatches = selectedCourse === 'All'
            ? batches
            : batches.filter(b => b.course === selectedCourse);

        return (
            <motion.div
                key="grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
            >
                {/* Course Filter Bar */}
                <div style={{ marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ position: 'relative', minWidth: 250 }}>
                        <select
                            className="form-select" // Reusing standard select style
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            style={{
                                padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0',
                                outline: 'none', width: '100%', cursor: 'pointer',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.02)', appearance: 'none', background: 'white'
                            }}
                        >
                            {uniqueCourses.map(course => (
                                <option key={course} value={course}>{course === 'All' ? 'All Courses' : course}</option>
                            ))}
                        </select>
                        <FiFilter style={{ position: 'absolute', right: 14, top: 14, color: '#64748b', pointerEvents: 'none' }} />
                    </div>
                    <div style={{ color: '#64748b', fontSize: 13 }}>
                        Showing {filteredBatches.length} batch{filteredBatches.length !== 1 ? 'es' : ''}
                    </div>
                </div>

                <div
                    className="form-grid"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', paddingBottom: 100 }}
                >
                    {loading && <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>
                        <FiLoader className="spin" style={{ marginBottom: 16 }} size={24} />
                        <div>Loading Batches from Fee Backend...</div>
                    </div>}

                    {error && (
                        <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#ef4444' }}>
                            <FiAlertCircle size={24} style={{ marginBottom: 12 }} />
                            <div>{error}</div>
                            <button
                                className="btn-primary"
                                onClick={initializeData}
                                style={{ marginTop: 16, padding: '8px 20px' }}
                            >
                                <FiRefreshCcw style={{ marginRight: 8 }} /> Retry
                            </button>
                        </div>
                    )}

                    {!loading && filteredBatches.map(batch => (
                        <div
                            key={batch.id}
                            className="glass-card batch-card"
                            onClick={() => handleBatchClick(batch)}
                            style={{ cursor: 'pointer', position: 'relative' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div className="batch-icon-placeholder">
                                    <FiUsers size={20} color="white" />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div className={`status-badge ${batch.collected >= 80 ? 'paid' : batch.collected >= 40 ? 'pending' : 'overdue'}`}>
                                        {batch.collected}% Collected
                                    </div>
                                    {/* Options Menu for Custom Batches */}
                                    {String(batch.id).startsWith('custom-') && (
                                        <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                                            <button
                                                className="btn-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenu(activeMenu === batch.id ? null : batch.id);
                                                }}
                                                style={{ width: 28, height: 28 }}
                                            >
                                                <FiMoreVertical size={16} />
                                            </button>

                                            {activeMenu === batch.id && (
                                                <div className="dropdown-menu show" style={{
                                                    position: 'absolute', right: 0, top: '100%',
                                                    minWidth: 120, zIndex: 10, marginTop: 4,
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                                                }}>
                                                    <button
                                                        className="dropdown-item text-danger"
                                                        onClick={(e) => handleDeleteBatch(e, batch.id)}
                                                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                                                    >
                                                        <FiTrash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 style={{ margin: '0 0 4px 0', fontSize: 16 }}>{batch.name}</h3>
                            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>{batch.course}</p>

                            <div style={{ marginTop: 20, display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <FiCalendar size={14} /> {batch.year}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <FiUsers size={14} /> {batch.students} Members Present
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ marginTop: 16, height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ width: `${batch.collected}%`, background: 'var(--primary-gradient)', height: '100%' }}></div>
                            </div>
                        </div>
                    ))}
                    {!loading && filteredBatches.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                            No batches found for the selected course.
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    const renderStudentList = () => (
        <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            {/* Header / Toolbar */}
            <div className="glass-card" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', overflow: 'visible', position: 'relative', zIndex: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button className="btn-icon" onClick={handleBack}><FiArrowLeft /></button>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 18 }}>{selectedBatch?.name}</h3>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedBatch?.course} • {selectedBatch?.year}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.5)', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--glass-border)' }}>
                        <FiSearch color="var(--text-secondary)" />
                        <input
                            placeholder="Search student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', marginLeft: 8, outline: 'none', fontSize: 13 }}
                        />
                    </div>

                    {/* Filter Button & Menu */}
                    <div style={{ position: 'relative' }}>
                        <button
                            className={`btn-icon ${filterStatus !== 'All' ? 'active-filter' : ''}`}
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            style={{ position: 'relative', border: filterStatus !== 'All' ? '1px solid #6366f1' : undefined, color: filterStatus !== 'All' ? '#6366f1' : undefined }}
                        >
                            <FiFilter />
                        </button>
                        {showFilterMenu && (
                            <div className="dropdown-menu show" style={{
                                position: 'absolute', right: 0, top: '120%',
                                minWidth: 150, zIndex: 50,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                            }}>
                                {['All', 'Paid', 'Pending', 'Overdue', 'Partial'].map(status => (
                                    <button
                                        key={status}
                                        className="dropdown-item"
                                        style={{
                                            justifyContent: 'flex-start',
                                            background: filterStatus === status ? '#f1f5f9' : 'transparent',
                                            fontWeight: filterStatus === status ? 600 : 400
                                        }}
                                        onClick={() => {
                                            setFilterStatus(status);
                                            setShowFilterMenu(false);
                                        }}
                                    >
                                        {status}
                                        {filterStatus === status && <FiCheckCircle size={12} style={{ marginLeft: 'auto', color: '#6366f1' }} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="glass-card table-container">
                {loading ? <div style={{ padding: 20, textAlign: 'center' }}>Loading Students...</div> : (
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Roll No</th>
                                <th>Status</th>
                                <th>Total Fee</th>
                                <th>Paid</th>
                                <th>Due</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.filter(student => {
                                // 1. Calculate Status
                                const { status } = calculateStatus(student);
                                // 2. Check Filter
                                if (filterStatus !== 'All' && status !== filterStatus.toUpperCase()) return false;
                                // 3. Check Search
                                if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                    !student.roll.toLowerCase().includes(searchTerm.toLowerCase())) return false;
                                return true;
                            }).map(student => {
                                const { total, paid, due, status } = calculateStatus(student);
                                return (
                                    <tr key={student.id} onClick={() => handleStudentClick(student)} style={{ cursor: 'pointer' }}>
                                        <td style={{ fontWeight: 600 }}>{student.name}</td>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{student.roll}</td>
                                        <td>
                                            <span className={`status-badge ${status.toLowerCase()}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td>₹{total.toLocaleString()}</td>
                                        <td style={{ color: '#059669' }}>₹{paid.toLocaleString()}</td>
                                        <td style={{ color: due > 0 ? '#dc2626' : 'var(--text-secondary)', fontWeight: due > 0 ? 700 : 400 }}>
                                            {due > 0 ? `₹${due.toLocaleString()}` : '-'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                                                <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={() => handleStudentClick(student)}>
                                                    <FiChevronRight />
                                                </button>
                                                {/* Allow removing students only from custom batches */}
                                                {selectedBatch && String(selectedBatch.id).startsWith('custom-') && (
                                                    <button
                                                        className="btn-icon"
                                                        style={{ width: 28, height: 28, color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}
                                                        onClick={(e) => handleRemoveStudent(e, student.id)}
                                                        title="Remove Student"
                                                    >
                                                        <FiTrash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: 20, color: 'var(--text-secondary)' }}>
                                        No students in this batch.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </motion.div>
    );

    const renderStudentDetail = () => {
        if (!feeDetails) return <div className="glass-card">Loading Details...</div>;

        const { total, paid, due, status } = calculateStatus({
            totalFee: feeDetails.totalFee,
            paidAmount: feeDetails.paidAmount
        });

        return (
            <motion.div
                key="detail"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}
            >
                {/* Main Info */}
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <button className="btn-icon" onClick={handleBack}><FiArrowLeft /></button>
                            <div>
                                <h2 style={{ margin: 0, fontSize: 20 }}>{selectedStudent?.name}</h2>
                                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{selectedStudent?.roll} • {selectedBatch?.course}</div>
                            </div>
                        </div>
                        <div className={`status-badge ${status.toLowerCase()}`} style={{ fontSize: 14, padding: '6px 16px' }}>
                            {status} Account
                        </div>
                    </div>

                    <div style={{ padding: 24 }}>
                        <h4 style={{ marginTop: 0 }}>Fee Breakdown</h4>
                        <div className="invoice-preview" style={{ boxShadow: 'none', border: '1px solid #e2e8f0', padding: 24 }}>
                            {feeDetails.structure?.map((item, idx) => (
                                <div key={idx} className="invoice-row">
                                    <span>{item.name}</span>
                                    <span>₹{item.amount.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="invoice-total">
                                <span>Total Fee</span>
                                <span>₹{feeDetails.totalFee.toLocaleString()}</span>
                            </div>
                            <div className="invoice-row" style={{ marginTop: 10, color: '#059669' }}>
                                <span>Total Paid</span>
                                <span>- ₹{feeDetails.paidAmount.toLocaleString()}</span>
                            </div>
                            <div className="invoice-row" style={{ color: feeDetails.pendingAmount < 0 ? '#059669' : '#dc2626', fontWeight: 'bold' }}>
                                <span>{feeDetails.pendingAmount < 0 ? 'Excess Paid' : 'Balance Pending'}</span>
                                <span>{feeDetails.pendingAmount < 0 ? `+ ₹${Math.abs(feeDetails.pendingAmount).toLocaleString()}` : `₹${feeDetails.pendingAmount.toLocaleString()}`}</span>
                            </div>
                        </div>

                        {/* Payment Schedule (Water-fall Logic) */}
                        <h4 style={{ marginBottom: 16 }}>Payment Schedule (Terms)</h4>
                        <div className="glass-card" style={{ padding: 0, marginBottom: 24, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                            <table className="premium-table" style={{ fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc' }}>
                                        <th>Term Name</th>
                                        <th>Due Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Paid / Due</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        let remainingPaid = feeDetails.paidAmount;
                                        return feeDetails.installments?.map(term => {
                                            let status = 'Pending';
                                            let termPaid = 0;

                                            // Waterfall Logic
                                            if (remainingPaid >= term.amount) {
                                                status = 'Paid';
                                                termPaid = term.amount;
                                                remainingPaid -= term.amount;
                                            } else if (remainingPaid > 0) {
                                                status = 'Partial';
                                                termPaid = remainingPaid;
                                                remainingPaid = 0;
                                            } else {
                                                status = 'Pending';
                                                termPaid = 0;
                                            }

                                            // Correct validation for excess
                                            const termDue = Math.max(0, term.amount - termPaid);

                                            return (
                                                <tr key={term.id}>
                                                    <td style={{ fontWeight: 500 }}>{term.name}</td>
                                                    <td style={{ color: '#64748b' }}>{term.dueDate}</td>
                                                    <td style={{ fontWeight: 600 }}>₹{term.amount.toLocaleString()}</td>
                                                    <td>
                                                        <span className={`status-badge ${status.toLowerCase()}`} style={{ fontSize: 11, padding: '2px 8px' }}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 11 }}>
                                                            <span style={{ color: '#16a34a' }}>Paid: ₹{termPaid.toLocaleString()}</span>
                                                            <span style={{ color: termDue > 0 ? '#dc2626' : '#94a3b8' }}>Due: ₹{termDue.toLocaleString()}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        });
                                    })()}
                                </tbody>
                            </table>
                        </div>

                        <h4 style={{ marginBottom: 12 }}>Payment History</h4>
                        {/* Step 6: Payments View */}
                        <table className="premium-table" style={{ fontSize: 13 }}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Mode</th>
                                    <th>Ref ID</th>
                                    <th>Amount</th>
                                    <th>Receipt</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeDetails.payments?.map(payment => (
                                    <tr key={payment.id}>
                                        <td>{payment.date}</td>
                                        <td>{payment.mode}</td>
                                        <td style={{ fontFamily: 'monospace' }}>{payment.reference}</td>
                                        <td>₹{payment.amount.toLocaleString()}</td>
                                        {/* Step 9: Receipts */}
                                        <td>
                                            <button className="btn-icon" onClick={() => handleDownloadReceipt(payment.id)}>
                                                <FiDownload style={{ color: '#6366f1' }} />
                                            </button>
                                        </td>
                                        {/* Step 8: Refund */}
                                        <td>
                                            <button className="btn-icon" onClick={() => handleRefund(payment.id)} title="Initiate Refund">
                                                <FiRefreshCcw style={{ color: '#f59e0b', fontSize: 12 }} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!feeDetails.payments || feeDetails.payments.length === 0) && (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8' }}>No payments found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="glass-card">
                        <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {/* Record Payment (Simulated) */}
                            <button
                                className="btn-primary"
                                style={{ justifyContent: 'center', opacity: feeDetails.pendingAmount <= 0 ? 0.5 : 1, cursor: feeDetails.pendingAmount <= 0 ? 'not-allowed' : 'pointer' }}
                                onClick={() => {
                                    if (feeDetails.pendingAmount <= 0) return alert("Fee is fully paid. Cannot record further payments.");
                                    setShowPaymentModal(true);
                                }}
                            >
                                <FiCreditCard /> Record Payment
                            </button>
                            {/* Step 7: Apply Discount */}
                            <button className="btn-icon" style={{ width: '100%', justifyContent: 'center', gap: 8 }} onClick={handleApplyDiscount}>
                                <FiEdit3 /> Apply Discount
                            </button>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Pending Dues</h3>
                        <div style={{ fontSize: 32, fontWeight: 700, color: feeDetails.pendingAmount < 0 ? '#059669' : '#dc2626' }}>
                            {feeDetails.pendingAmount < 0 ? `+ ₹${Math.abs(feeDetails.pendingAmount).toLocaleString()}` : `₹${feeDetails.pendingAmount.toLocaleString()}`}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                            Due by {feeDetails.dueDate || '-'}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    if (error) {
        return <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>
    }

    return (
        <>
            <AnimatePresence mode="wait">
                {view === 'grid' && renderBatchGrid()}
                {view === 'list' && renderStudentList()}
                {view === 'detail' && renderStudentDetail()}
            </AnimatePresence>

            {/* Discount Modal */}
            {showDiscountModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <motion.div
                        className="modal-content"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ background: 'white', padding: 24, borderRadius: 12, width: 400, maxWidth: '90%' }}
                    >
                        <h3 style={{ margin: '0 0 16px 0' }}>Apply Fee Discount</h3>

                        <div className="form-group" style={{ marginBottom: 16 }}>
                            <label className="form-label">Discount Amount (₹)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Enter amount..."
                                value={discountForm.amount}
                                onChange={e => setDiscountForm({ ...discountForm, amount: e.target.value })}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 24 }}>
                            <label className="form-label">Reason / Note</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Scholarship, Early Bird..."
                                value={discountForm.reason}
                                onChange={e => setDiscountForm({ ...discountForm, reason: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <button
                                className="btn-icon"
                                style={{ width: 'auto', padding: '0 16px' }}
                                onClick={() => setShowDiscountModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={submitDiscount}
                            >
                                Apply Discount
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <motion.div
                        className="modal-content"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ background: 'white', padding: 24, borderRadius: 12, width: 450, maxWidth: '90%' }}
                    >
                        <h3 style={{ margin: '0 0 16px 0' }}>Record New Payment</h3>

                        <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 13, color: '#475569' }}>
                            Recording payment for <strong>{selectedStudent?.name}</strong>.
                            <br />
                            Pending Due: <span style={{ color: '#dc2626', fontWeight: 600 }}>₹{feeDetails.pendingAmount.toLocaleString()}</span>
                        </div>

                        <div className="form-group" style={{ marginBottom: 16 }}>
                            <label className="form-label">Amount (₹)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Enter amount..."
                                value={paymentForm.amount}
                                onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                            />
                        </div>

                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Payment Mode</label>
                                <select
                                    className="form-select"
                                    value={paymentForm.mode}
                                    onChange={e => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                                >
                                    <option>Online</option>
                                    <option>Cash</option>
                                    <option>Cheque</option>
                                    <option>Bank Transfer</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={paymentForm.date}
                                    onChange={e => setPaymentForm({ ...paymentForm, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 24 }}>
                            <label className="form-label">Reference ID (Optional)</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Transaction ID, Cheque No, etc."
                                value={paymentForm.reference}
                                onChange={e => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <button
                                className="btn-icon"
                                style={{ width: 'auto', padding: '0 16px' }}
                                onClick={() => setShowPaymentModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleRecordPayment}
                            >
                                Confirm Payment
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default FeeBatches;
