import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid, FiList, FiUsers, FiPieChart, FiTrendingUp,
    FiMoreVertical, FiFilter, FiDownload, FiPlus, FiSearch, FiCalendar,
    FiSettings, FiCreditCard, FiActivity, FiLayers, FiRefreshCcw,
    FiCheckCircle, FiAlertCircle, FiArrowLeft
} from 'react-icons/fi';
import './FeeManagement.css';
import FeePayments from './FeePayments';
import FeeRefunds from './FeeRefunds';
import FeeSettings from './FeeSettings';
import FeeBatches from './FeeBatches';
import FeeInstallments from './FeeInstallments';
import FeeAuditLogs from './FeeAuditLogs';

import { FaRupeeSign } from 'react-icons/fa';
import { batchService } from '../Batches/services/batchService';
import { courseService } from '../Courses/services/courseService';
import { enrollmentService } from '../Batches/services/enrollmentService';
import { createFeeDiscount, getFeeDiscounts, deleteFeeDiscount } from '../../services/feeService';

// --- Student Detail View Component ---
const StudentFeeDetailView = ({ student, onBack }) => {
    const total = Number(student.totalFee || 0);
    const paid = Number(student.paidAmount || 0);
    const pending = Math.max(0, total - paid);

    const [discounts, setDiscounts] = useState([]);
    const [loadingDiscounts, setLoadingDiscounts] = useState(false);
    const [showDiscountForm, setShowDiscountForm] = useState(false);
    const [newDiscount, setNewDiscount] = useState({
        name: '', type: 'FLAT', value: '', reason: ''
    });

    // Fetch Discounts (Student & Batch)
    const fetchDiscounts = async () => {
        setLoadingDiscounts(true);
        try {
            // Concurrent fetch for Student and Batch discounts
            const [studentDiscounts, batchDiscounts] = await Promise.all([
                getFeeDiscounts({ scopeId: student.id, discountScope: 'STUDENT' }),
                student.batchId ? getFeeDiscounts({ scopeId: student.batchId, discountScope: 'BATCH' }) : []
            ]);

            // Combine and tag
            const combined = [
                ...(studentDiscounts || []).map(d => ({ ...d, source: 'STUDENT' })),
                ...(batchDiscounts || []).map(d => ({ ...d, source: 'BATCH' }))
            ];
            setDiscounts(combined);
        } catch (err) {
            console.error("Failed to load discounts", err);
        } finally {
            setLoadingDiscounts(false);
        }
    };

    React.useEffect(() => {
        fetchDiscounts();
    }, [student.id, student.batchId]);

    const handleAddDiscount = async () => {
        if (!newDiscount.value || !newDiscount.name) return alert("Please fill details");

        // Infer ID from existing discounts (Batch/Student) or default to 1. 
        // Ideally, we should fetch active Fee Structures for this student's batch to select from.
        const inferredId = discounts.length > 0 ? discounts[0].feeStructureId : 1;
        console.log("Inferred Fee Structure ID:", inferredId);

        try {
            await createFeeDiscount({
                feeStructureId: inferredId,
                discountScope: 'STUDENT',
                scopeId: student.id,
                discountName: newDiscount.name,
                discountType: newDiscount.type,
                discountValue: Number(newDiscount.value),
                admissionFee: 0,
                reason: newDiscount.reason
            });
            alert("Discount Override Added!");
            setShowDiscountForm(false);
            setNewDiscount({ name: '', type: 'FLAT', value: '', reason: '' });
            fetchDiscounts(); // Refresh
        } catch (err) {
            console.error(err);
            alert("Failed to add discount. " + (err.response?.data?.message || ""));
        }
    };

    const handleDeleteDiscount = async (id) => {
        if (!window.confirm("Remove this discount override?")) return;
        try {
            await deleteFeeDiscount(id);
            fetchDiscounts();
        } catch (err) {
            alert("Failed to delete");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={onBack} className="btn-secondary" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiArrowLeft /> Back to Dashboard
            </button>

            <div className="glass-card" style={{ marginBottom: 24, padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ margin: '0 0 8px 0', fontSize: 24 }}>{student.name}</h2>
                        <div style={{ color: '#64748b', fontSize: 14 }}>Student ID: {student.id}</div>
                        <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                            <span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>{student.courseName}</span>
                            <span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>{student.batchName}</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Total Fee</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#334155' }}>₹{total.toLocaleString()}</div>
                    </div>
                </div>

                <div className="section-divider" style={{ margin: '24px 0' }}></div>

                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 12, border: '1px solid #dcfce7' }}>
                        <div style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>Paid Amount</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#15803d', marginTop: 4 }}>₹{paid.toLocaleString()}</div>
                    </div>
                    <div style={{ padding: 16, background: '#fff7ed', borderRadius: 12, border: '1px solid #ffedd5' }}>
                        <div style={{ fontSize: 13, color: '#9a3412', fontWeight: 600 }}>Pending Amount</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#c2410c', marginTop: 4 }}>₹{pending.toLocaleString()}</div>
                    </div>
                    <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>Next Due Date</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#334155', marginTop: 4 }}>
                            {student.installments?.find(i => !i.paidDate)?.dueDate || 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Discounts Section */}
            <div className="glass-card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiLayers /> Fee Discounts & Overrides
                    </h3>
                    <button className="btn-primary" onClick={() => setShowDiscountForm(!showDiscountForm)} style={{ padding: '8px 16px', fontSize: 13 }}>
                        {showDiscountForm ? 'Cancel' : '+ Add Override'}
                    </button>
                </div>

                {showDiscountForm && (
                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 20, border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: 14 }}>Add Student Override Discount</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 1fr auto', gap: 12, alignItems: 'end' }}>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Name</label>
                                <input type="text" className="form-input" placeholder="e.g. Special Approval" value={newDiscount.name} onChange={e => setNewDiscount({ ...newDiscount, name: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Type</label>
                                <select className="form-select" value={newDiscount.type} onChange={e => setNewDiscount({ ...newDiscount, type: e.target.value })}>
                                    <option value="FLAT">Flat (₹)</option>
                                    <option value="PERCENTAGE">% Off</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Value</label>
                                <input type="number" className="form-input" placeholder="0" value={newDiscount.value} onChange={e => setNewDiscount({ ...newDiscount, value: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Reason</label>
                                <input type="text" className="form-input" placeholder="Optional" value={newDiscount.reason} onChange={e => setNewDiscount({ ...newDiscount, reason: e.target.value })} />
                            </div>
                            <button className="btn-primary" onClick={handleAddDiscount} style={{ height: 42 }}>Save</button>
                        </div>
                    </div>
                )}

                {loadingDiscounts ? <div style={{ padding: 20, textAlign: 'center' }}>Loading discounts...</div> : (
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Source</th>
                                <th>Discount Name</th>
                                <th>Type</th>
                                <th>Value</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discounts.length > 0 ? discounts.map((d, i) => (
                                <tr key={i} style={{ opacity: d.source === 'BATCH' ? 0.7 : 1 }}>
                                    <td>
                                        <span className={`status-badge ${d.source === 'STUDENT' ? 'paid' : 'pending'}`}>
                                            {d.source === 'STUDENT' ? 'Override (Student)' : 'Batch Default'}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{d.discountName}</td>
                                    <td>{d.discountType}</td>
                                    <td>{d.discountType === 'FLAT' ? `₹${d.discountValue}` : `${d.discountValue}%`}</td>
                                    <td>
                                        {d.source === 'STUDENT' && (
                                            <button className="btn-icon" onClick={() => handleDeleteDiscount(d.id)} style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}>
                                                <FiMoreVertical style={{ transform: 'rotate(90deg)' }} />
                                            </button>
                                        )}
                                        {d.source === 'BATCH' && <span style={{ fontSize: 11, color: '#94a3b8' }}>Inherited</span>}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>
                                        No active discounts. Add an override to reduce fees for this student.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontSize: 18 }}>Installment Schedule</h3>
                    <button className="btn-primary" onClick={() => alert('Payment Gateway Integration Required')}>
                        <FiCreditCard /> Pay Now
                    </button>
                </div>

                {student.installments && student.installments.length > 0 ? (
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Installment</th>
                                <th>Due Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.installments.map((inst, idx) => {
                                const isPaid = inst.status === 'Paid' || (paid >= ((idx + 1) * (total / student.installments.length))); // Simple logic for demo
                                return (
                                    <tr key={inst.id || idx}>
                                        <td style={{ fontWeight: 500 }}>{inst.name || `Installment ${idx + 1}`}</td>
                                        <td>{inst.dueDate}</td>
                                        <td>₹{Number(inst.amount).toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${isPaid ? 'paid' : 'pending'}`}>
                                                {isPaid ? <FiCheckCircle /> : <FiAlertCircle />}
                                                {isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            {!isPaid && (
                                                <button className="btn-icon" style={{ color: '#6366f1', borderColor: '#e0e7ff', background: '#eef2ff' }}>
                                                    <FaRupeeSign size={12} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                        No installment plan configured for this student.
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// --- FeeDashboard Component ---
const FeeDashboard = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeActionId, setActiveActionId] = useState(null);
    const [transactionFilter, setTransactionFilter] = useState('All');
    const [showTransactionFilterMenu, setShowTransactionFilterMenu] = useState(false);

    // Dynamic Filters State
    const [courseFilter, setCourseFilter] = useState('All Courses');
    const [batchFilter, setBatchFilter] = useState('All Batches');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [availableBatches, setAvailableBatches] = useState([]);

    // Compute all students for search
    const allStudents = React.useMemo(() => {
        return availableBatches.flatMap(batch =>
            (batch.studentList || []).map(student => ({
                ...student,
                batchName: batch.name,
                courseName: batch.course
            }))
        );
    }, [availableBatches]);

    const filteredStudents = React.useMemo(() => {
        if (!searchTerm) return [];
        const lowerSearch = searchTerm.toLowerCase();
        return allStudents.filter(s =>
            s.name.toLowerCase().includes(lowerSearch) ||
            String(s.id).includes(lowerSearch)
        ).slice(0, 5); // Limit to 5 results
    }, [searchTerm, allStudents]);

    // Calcluate KPIs based on filters
    const kpiData = React.useMemo(() => {
        let totalCollection = 0;
        let totalPending = 0;
        let totalOverdue = 0;
        let monthlyRevenue = 0;

        const filteredBatches = availableBatches.filter(b => {
            const matchCourse = courseFilter === 'All Courses' || b.course === courseFilter;
            const matchBatch = batchFilter === 'All Batches' || b.name === batchFilter;
            return matchCourse && matchBatch;
        });

        filteredBatches.forEach(batch => {
            if (batch.studentList) {
                batch.studentList.forEach(student => {
                    const paid = Number(student.paidAmount || 0);
                    const total = Number(student.totalFee || 0);
                    const pending = Math.max(0, total - paid);

                    totalCollection += paid;
                    totalPending += pending;

                    // Simple overdue check (legacy or status based)
                    if (student.status === 'OVERDUE' || (pending > 0 && new Date() > new Date(batch.feeDetails?.dueDate || '2025-12-31'))) {
                        totalOverdue += pending;
                    }

                    // Mock Monthly Revenue (e.g. 15% of total collection for demo purposes as transaction dates aren't persistent)
                    // In a real app, we would sum transactions where date is in current month.
                    monthlyRevenue += (paid * 0.18);
                });
            }
        });

        const formatCurrency = (val) => "₹" + val.toLocaleString('en-IN');

        return [
            { title: "Total Collection", value: formatCurrency(totalCollection), icon: <FaRupeeSign />, color: "linear-gradient(135deg, #10b981 0%, #059669 100%)", subtitle: "This Year" },
            { title: "Pending Amount", value: formatCurrency(totalPending), icon: <FiAlertCircle />, color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", subtitle: `${filteredBatches.reduce((acc, b) => acc + (b.studentList?.length || 0), 0)} Students` },
            { title: "Overdue Amount", value: formatCurrency(totalOverdue), icon: <FiActivity />, color: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", subtitle: "Action Required" },
            { title: "Monthly Revenue", value: formatCurrency(monthlyRevenue), icon: <FiTrendingUp />, color: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", subtitle: "Jan 2026" },
        ];
    }, [availableBatches, courseFilter, batchFilter]);

    React.useEffect(() => {
        const handleClickOutside = () => setActiveActionId(null);
        window.addEventListener('click', handleClickOutside);

        const loadData = async () => {
            try {
                // 1. Fetch Courses (for Fee Info)
                const courses = await courseService.getCourses();
                const courseFeeMap = {};
                const courseNameMap = {};
                (courses || []).forEach(c => {
                    courseFeeMap[c.courseId] = c.fee || c.price || c.amount || 0;
                    courseNameMap[c.courseId] = c.courseName;
                });
                setAvailableCourses((courses || []).map(c => c.courseName));

                // 2. Fetch Batches
                const batches = await batchService.getAllBatches();

                // 3. Fetch Students for Each Batch & Map Fees
                const batchesWithStudents = await Promise.all(batches.map(async (batch) => {
                    // Fetch students in this batch
                    const students = await enrollmentService.getStudentsByBatch(batch.batchId);

                    const courseFee = courseFeeMap[batch.courseId] || 0;
                    const courseName = courseNameMap[batch.courseId] || 'Unknown Course';

                    const mappedStudents = students.map(s => ({
                        ...s,
                        id: s.studentId, // Ensure ID consistency
                        name: s.studentName || s.name,
                        totalFee: s.totalFee || courseFee, // Use dynamic course fee!
                        paidAmount: s.paidAmount || 0,
                        status: s.status || 'PENDING',
                        batchName: batch.batchName,
                        batchId: batch.batchId,
                        courseName: courseName
                    }));

                    return {
                        ...batch,
                        name: batch.batchName, // Standardize naming for UI
                        course: courseName,
                        studentList: mappedStudents
                    };
                }));

                setAvailableBatches(batchesWithStudents);

            } catch (error) {
                console.error("Failed to load Fee Dashboard data:", error);
            }
        };

        loadData();

        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const transactionData = [
        { id: 1, name: "Student Name 1", studentId: "2026001", type: "Tuition Fee", date: "Jan 06, 2026", amount: "₹12,000", status: "Pending" },
        { id: 2, name: "Student Name 2", studentId: "2026002", type: "Tuition Fee", date: "Jan 07, 2026", amount: "₹12,000", status: "Paid" },
        { id: 3, name: "Student Name 3", studentId: "2026003", type: "Tuition Fee", date: "Jan 08, 2026", amount: "₹12,000", status: "Pending" },
        { id: 4, name: "Student Name 4", studentId: "2026004", type: "Tuition Fee", date: "Jan 09, 2026", amount: "₹12,000", status: "Paid" },
        { id: 5, name: "Student Name 5", studentId: "2026005", type: "Tuition Fee", date: "Jan 10, 2026", amount: "₹12,000", status: "Pending" },
    ];

    const filteredTransactions = transactionData.filter(txn => {
        // 1. Check Search
        const matchesSearch = txn.name.toLowerCase().includes(searchTerm.toLowerCase()) || txn.studentId.includes(searchTerm);
        // 2. Check Filter
        const matchesFilter = transactionFilter === 'All' ? true : txn.status === transactionFilter;

        return matchesSearch && matchesFilter;
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Filters Row */}
            {/* Filters Row */}
            <div className="controls-row">
                <select
                    className="form-select"
                    style={{ maxWidth: 200 }}
                    value={courseFilter}
                    onChange={(e) => {
                        setCourseFilter(e.target.value);
                        setBatchFilter('All Batches'); // Reset batch when course changes
                    }}
                >
                    <option key="all">All Courses</option>
                    {availableCourses.map((c, index) => <option key={`${c}-${index}`}>{c}</option>)}
                </select>
                <select
                    className="form-select"
                    style={{ maxWidth: 200 }}
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                >
                    <option key="all" value="All Batches">All Batches</option>
                    {availableBatches
                        .filter(b => courseFilter === 'All Courses' || b.course === courseFilter)
                        .map((b, idx) => <option key={b.id || idx} value={b.name}>{b.name}</option>)
                    }
                </select>
                <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 300, position: 'relative', zIndex: 100 }}>
                    <FiSearch color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search student..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSelectedStudent(null); // Clear selection on search
                        }}
                    />
                    {searchTerm && !selectedStudent && (
                        <div className="dropdown-menu show" style={{
                            position: 'absolute', top: '100%', left: 0, right: 0,
                            marginTop: 8, maxHeight: 300, overflowY: 'auto', zIndex: 50,
                            background: 'white', borderRadius: 12, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                        }}>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <div
                                        key={student.id}
                                        className="dropdown-item"
                                        style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                                        onClick={() => {
                                            setSelectedStudent(student);
                                            setSearchTerm('');
                                        }}
                                    >
                                        <div style={{ fontWeight: 600, color: '#334155' }}>{student.name}</div>
                                        <div style={{ fontSize: 12, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>ID: {student.id}</span>
                                            <span>{student.batchName}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: 16, color: '#94a3b8', textAlign: 'center', fontSize: 13 }}>No student found</div>
                            )}
                        </div>
                    )}
                </div>
                <button className="btn-primary" onClick={() => navigate('/fee/create')}>
                    <FiPlus /> Create Fee Structure
                </button>
            </div>

            {selectedStudent ? (
                <StudentFeeDetailView
                    student={selectedStudent}
                    onBack={() => {
                        setSelectedStudent(null);
                        setSearchTerm('');
                    }}
                />
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="stats-grid">
                        {kpiData.map((kpi, index) => (
                            <motion.div
                                key={index}
                                className="glass-card stat-item"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="stat-header">
                                    <div className="stat-icon" style={{ background: kpi.color }}>{kpi.icon}</div>
                                </div>
                                <div className="stat-value">{kpi.value}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="stat-label">{kpi.title}</div>
                                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{kpi.subtitle}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Charts Section Placeholder */}
                    <div className="charts-grid" style={{ marginBottom: 32 }}>
                        <div className="glass-card" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <h3 style={{ margin: 0, fontSize: '18px' }}>Monthly Collection</h3>
                                <select className="form-select" style={{ padding: '4px 8px', fontSize: 12 }}>
                                    <option>2026</option>
                                    <option>2025</option>
                                </select>
                            </div>

                            <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end', gap: 12, paddingBottom: 12 }}>
                                {[
                                    { m: 'Jan', h: 35 }, { m: 'Feb', h: 55 }, { m: 'Mar', h: 45 },
                                    { m: 'Apr', h: 70 }, { m: 'May', h: 65 }, { m: 'Jun', h: 85 },
                                    { m: 'Jul', h: 60 }, { m: 'Aug', h: 75 }, { m: 'Sep', h: 50 },
                                    { m: 'Oct', h: 60 }, { m: 'Nov', h: 80 }, { m: 'Dec', h: 90 }
                                ].map((item, i) => (
                                    <div key={i} className="bar-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end', cursor: 'pointer' }}>
                                        <div style={{
                                            fontSize: 10, fontWeight: 600, color: '#64748b',
                                            opacity: 0, transform: 'translateY(10px)', transition: '0.2s'
                                        }} className="bar-value">
                                            {item.h}k
                                        </div>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${item.h}%` }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bar-fill"
                                            style={{
                                                width: '100%',
                                                background: i === 11 ? 'var(--primary-gradient)' : '#e2e8f0',
                                                borderRadius: 6,
                                                minHeight: 4
                                            }}
                                        />
                                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{item.m}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <h3 style={{ alignSelf: 'flex-start', margin: '0 0 20px 0', fontSize: '18px' }}>Course Revenue Distribution</h3>

                            {(() => {
                                // 1. Calculate Data Dynamically
                                const batches = JSON.parse(localStorage.getItem('lms_fee_data') || '[]');
                                const revenueData = batches.map(b => ({
                                    name: b.name,
                                    value: (b.studentList || []).reduce((sum, s) => sum + (s.paidAmount || 0), 0)
                                })).filter(d => d.value > 0);

                                const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.value, 0);

                                // Colors Palette
                                const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

                                // If no revenue
                                if (totalRevenue === 0) {
                                    return (
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
                                            No revenue data available
                                        </div>
                                    );
                                }

                                // 2. Build Gradient String
                                let currentDeg = 0;
                                const gradientParts = revenueData.map((item, index) => {
                                    const percent = (item.value / totalRevenue) * 100;
                                    const start = currentDeg;
                                    currentDeg += percent;
                                    const color = COLORS[index % COLORS.length];
                                    return `${color} ${start}% ${currentDeg}%`;
                                });
                                const gradientString = `conic-gradient(${gradientParts.join(', ')})`;

                                return (
                                    <>
                                        {/* Pie Chart */}
                                        <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: gradientString, position: 'relative' }}>
                                            <div style={{ position: 'absolute', inset: 30, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                                                <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total</span>
                                                <span style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                                                    {(totalRevenue / 1000).toFixed(1)}K
                                                </span>
                                                <span style={{ fontSize: 10, color: '#94a3b8' }}>INR</span>
                                            </div>
                                        </div>

                                        {/* Legend */}
                                        <div className="no-scrollbar" style={{ width: '100%', marginTop: 24, maxHeight: 100, overflowY: 'auto' }}>
                                            {revenueData.map((item, index) => (
                                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, alignItems: 'center' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span style={{ width: 10, height: 10, background: COLORS[index % COLORS.length], borderRadius: '50%' }}></span>
                                                        <span style={{ color: '#334155', fontWeight: 500 }}>{item.name}</span>
                                                    </span>
                                                    <span style={{ fontWeight: 600, color: '#64748b' }}>
                                                        {((item.value / totalRevenue) * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Recent Table */}
                    <div className="glass-card">
                        {/* ... existing table code ... */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h3>Recent Transactions</h3>
                            <div style={{ position: 'relative' }}>
                                <button
                                    className={`btn-icon ${transactionFilter !== 'All' ? 'active-filter' : ''}`}
                                    onClick={() => setShowTransactionFilterMenu(!showTransactionFilterMenu)}
                                    style={{
                                        position: 'relative',
                                        border: transactionFilter !== 'All' ? '1px solid #6366f1' : undefined,
                                        color: transactionFilter !== 'All' ? '#6366f1' : undefined
                                    }}
                                >
                                    <FiFilter />
                                </button>
                                {showTransactionFilterMenu && (
                                    <div className="dropdown-menu show" style={{
                                        position: 'absolute', right: 0, top: '120%',
                                        minWidth: 150, zIndex: 10,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                                    }}>
                                        {['All', 'Paid', 'Pending'].map(status => (
                                            <button
                                                key={status}
                                                className="dropdown-item"
                                                style={{
                                                    justifyContent: 'flex-start',
                                                    background: transactionFilter === status ? '#f1f5f9' : 'transparent',
                                                    fontWeight: transactionFilter === status ? 600 : 400
                                                }}
                                                onClick={() => {
                                                    setTransactionFilter(status);
                                                    setShowTransactionFilterMenu(false);
                                                }}
                                            >
                                                {status}
                                                {transactionFilter === status && <FiCheckCircle size={12} style={{ marginLeft: 'auto', color: '#6366f1' }} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="table-container">
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Fee Type</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.length > 0 ? (
                                        filteredTransactions.map(txn => (
                                            <tr key={txn.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 12 }}>
                                                            {txn.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 500 }}>{txn.name}</div>
                                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>ID: {txn.studentId}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{txn.type}</td>
                                                <td>{txn.date}</td>
                                                <td>{txn.amount}</td>
                                                <td>
                                                    <span className={`status-badge ${txn.status === 'Paid' ? 'paid' : 'pending'}`}>
                                                        {txn.status === 'Paid' ? <FiCheckCircle /> : <FiAlertCircle />}
                                                        {txn.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                                                        <button
                                                            className="btn-icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveActionId(activeActionId === txn.id ? null : txn.id);
                                                            }}
                                                        >
                                                            <FiMoreVertical />
                                                        </button>
                                                        {activeActionId === txn.id && (
                                                            <div className="dropdown-menu show" style={{
                                                                position: 'absolute', right: 0, top: '100%',
                                                                minWidth: 160, zIndex: 10, marginTop: 4,
                                                                background: 'white', borderRadius: 8,
                                                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                                                padding: '8px 0', border: '1px solid #e2e8f0'
                                                            }}>
                                                                <button
                                                                    className="dropdown-item"
                                                                    style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 13 }}
                                                                    onClick={() => alert(`View Receipt for ${txn.name}`)}
                                                                    onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                                                    onMouseLeave={(e) => e.target.style.background = 'none'}
                                                                >
                                                                    <FiCheckCircle size={14} /> View Receipt
                                                                </button>
                                                                <button
                                                                    className="dropdown-item"
                                                                    style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 13 }}
                                                                    onClick={() => alert(`Downloading Invoice for ${txn.studentId}...`)}
                                                                    onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                                                    onMouseLeave={(e) => e.target.style.background = 'none'}
                                                                >
                                                                    <FiDownload size={14} /> Download Invoice
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                                                No transactions found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

// --- Main Layout ---

const FeeManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.defaultTab || 'dashboard');

    React.useEffect(() => {
        if (location.state && location.state.defaultTab) {
            setActiveTab(location.state.defaultTab);
        }
    }, [location]);

    const tabs = [
        { id: 'dashboard', label: 'Overview', icon: <FiGrid /> },
        { id: 'batches', label: 'Batches', icon: <FiLayers /> },
        { id: 'installments', label: 'Installments', icon: <FiList /> },
        { id: 'payments', label: 'Payments', icon: <FiCreditCard /> },
        { id: 'refunds', label: 'Refunds', icon: <FiRefreshCcw /> },
        { id: 'settings', label: 'Settings', icon: <FiSettings /> },
        { id: 'audit', label: 'Audit Log', icon: <FiActivity /> },
    ];

    return (
        <div className="fee-container">
            {/* Header */}
            <header className="fee-header">
                <div>
                    <div className="fee-title">
                        <h1>Fee Management</h1>
                    </div>
                    <div className="fee-subtitle">Manage student fees, batches, and payments</div>
                </div>


            </header>

            {/* Navigation */}
            <nav className="nav-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </nav>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && <FeeDashboard />}
                    {activeTab === 'batches' && <FeeBatches />}
                    {activeTab === 'installments' && <FeeInstallments />}
                    {activeTab === 'payments' && <FeePayments setActiveTab={setActiveTab} />}
                    {activeTab === 'refunds' && <FeeRefunds />}
                    {activeTab === 'settings' && <FeeSettings />}
                    {activeTab === 'audit' && <FeeAuditLogs />}


                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FeeManagement;