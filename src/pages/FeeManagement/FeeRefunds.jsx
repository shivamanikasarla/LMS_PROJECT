import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCcw, FiCheck, FiX, FiEye, FiSearch, FiPlus, FiAlertCircle, FiFileText, FiDollarSign, FiActivity, FiCreditCard, FiBriefcase, FiUser, FiCalendar, FiCheckCircle, FiChevronLeft, FiTrash2 } from 'react-icons/fi';
import './FeeManagement.css';

// --- Types & Constants ---
const TRANSACTION_TYPES = {
    REFUND: 'REFUND'
};

const REFUND_MODES = {
    WALLET: 'WALLET',
    BANK: 'BANK'
};

const ACTIVE_SEASON = '2025-26'; // Mock Active Season

const FeeRefunds = () => {
    const [activeTab, setActiveTab] = useState('History'); // History, Audit
    const [showProcessModal, setShowProcessModal] = useState(false);

    // Data States
    const [refundsData, setRefundsData] = useState([]);
    const [allStudents, setAllStudents] = useState([]); // Flattened for search

    // Form States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [formData, setFormData] = useState({
        type: TRANSACTION_TYPES.REFUND,
        refundType: 'PARTIAL', // PARTIAL or FULL
        amount: '',
        mode: REFUND_MODES.WALLET,
        reason: '',
        reference: ''
    });

    const [isSearching, setIsSearching] = useState(false);

    // --- 1. Load Data ---
    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        // Load Logs
        const storedRefunds = JSON.parse(localStorage.getItem('lms_refunds_data') || '[]');
        setRefundsData(storedRefunds);

        // Load Students for Search (From lms_fee_data)
        const batches = JSON.parse(localStorage.getItem('lms_fee_data') || '[]');
        const flattened = batches.flatMap(b => {
            // Attach batch info to student for validation
            return (b.studentList || []).map(s => ({
                ...s,
                batchName: b.name,
                batchYear: b.year,
                batchId: b.id
            }));
        });
        setAllStudents(flattened);
    };

    // --- 2. Handlers ---

    const handleStudentSearch = (term) => {
        setSearchTerm(term);
        setIsSearching(true);
        if (term === '') {
            setIsSearching(false);
            setSelectedStudent(null);
        }
    };

    const selectStudent = (student) => {
        setSelectedStudent(student);
        setSearchTerm(student.name);
        setIsSearching(false);
        setFormData(prev => ({ ...prev, amount: '' }));
    };

    const handleProcess = () => {
        // 1. Validation
        if (!selectedStudent) return alert("Please select a student first");
        if (!formData.reason) return alert("Reason is required");

        // Determine Amount
        let finalAmount = 0;
        if (formData.refundType === 'FULL') {
            finalAmount = selectedStudent.paidAmount || 0;
        } else {
            finalAmount = Number(formData.amount);
        }

        if (finalAmount <= 0) return alert("Invalid amount to refund (Student may have 0 paid balance)");
        if (formData.refundType === 'PARTIAL' && finalAmount > (selectedStudent.paidAmount || 0)) {
            return alert("Refund amount cannot exceed paid amount");
        }

        // Season Validation
        if (selectedStudent.batchYear !== ACTIVE_SEASON) {
            if (!selectedStudent.batchYear.includes('2025') && !selectedStudent.batchYear.includes('26')) {
                return alert(`Cannot process refund for inactive season: ${selectedStudent.batchYear}`);
            }
        }

        // 2. Process Logic (Update lms_fee_data)
        const batches = JSON.parse(localStorage.getItem('lms_fee_data') || '[]');
        let studentUpdated = false;

        const updatedBatches = batches.map(b => {
            if (b.id === selectedStudent.batchId) {
                const sIndex = b.studentList.findIndex(s => s.id === selectedStudent.id);
                if (sIndex !== -1) {
                    const student = b.studentList[sIndex];

                    // APPLY LOGIC (REFUND ONLY)
                    student.paidAmount -= finalAmount;

                    // Recalculate Status
                    if (student.paidAmount >= student.totalFee && student.totalFee > 0) student.status = 'PAID';
                    else if (student.paidAmount > 0) student.status = 'PARTIAL';
                    else student.status = 'PENDING';

                    studentUpdated = true;
                }
            }
            return b;
        });

        if (studentUpdated) {
            // Save Batches
            localStorage.setItem('lms_fee_data', JSON.stringify(updatedBatches));

            // Create Audit Log
            const newRecord = {
                id: Date.now(),
                studentId: selectedStudent.id,
                studentName: selectedStudent.name,
                action: 'REFUND',
                detail: formData.refundType,
                amount: finalAmount,
                mode: formData.mode,
                reason: formData.reason,
                date: new Date().toLocaleDateString(),
                status: 'COMPLETED',
                admin: 'Admin'
            };

            const updatedLogs = [newRecord, ...refundsData];
            setRefundsData(updatedLogs);
            localStorage.setItem('lms_refunds_data', JSON.stringify(updatedLogs));

            alert('Refund Processed Successfully');
            setShowProcessModal(false);
            setSelectedStudent(null);
            setSearchTerm('');
            loadData(); // Refresh UI
        } else {
            alert('Error: Student record not found during processing.');
        }
    };

    const handleDeleteRefund = (refundId) => {
        if (!window.confirm("Are you sure you want to delete this refund? This will reverse the transaction and add the amount back to the student's paid balance.")) return;

        // 1. Get the refund log
        const refundLog = refundsData.find(r => r.id === refundId);
        if (!refundLog) return;

        // 2. Reverse the effect in lms_fee_data
        const batches = JSON.parse(localStorage.getItem('lms_fee_data') || '[]');
        let studentFound = false;

        const updatedBatches = batches.map(b => {
            // Try to find student in this batch
            // We need to match by ID. The log has studentId.
            const sIndex = b.studentList?.findIndex(s => s.id === refundLog.studentId);
            if (sIndex !== -1 && sIndex !== undefined) {
                const student = b.studentList[sIndex];

                // Reverse: Add money back
                student.paidAmount = (student.paidAmount || 0) + refundLog.amount;

                // Recalculate Status
                if (student.paidAmount >= student.totalFee) student.status = 'PAID';
                else if (student.paidAmount > 0) student.status = 'PARTIAL';
                else student.status = 'PENDING';

                studentFound = true;
            }
            return b;
        });

        if (studentFound) {
            localStorage.setItem('lms_fee_data', JSON.stringify(updatedBatches));

            // 3. Remove Log
            const updatedLogs = refundsData.filter(r => r.id !== refundId);
            setRefundsData(updatedLogs);
            localStorage.setItem('lms_refunds_data', JSON.stringify(updatedLogs));

            alert("Refund deleted and amount restored to student balance.");
            // Refresh search list if needed
            loadData();
        } else {
            // Student might have been deleted? Just delete log?
            // Taking safe approach: Delete log anyway if student not found (data cleanup)
            const updatedLogs = refundsData.filter(r => r.id !== refundId);
            setRefundsData(updatedLogs);
            localStorage.setItem('lms_refunds_data', JSON.stringify(updatedLogs));
            alert("Refund log deleted (Student record not found to restore balance).");
        }
    };

    // --- 3. Render Helpers ---
    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return { background: '#dcfce7', color: '#166534' };
            case 'PENDING': return { background: '#fef3c7', color: '#92400e' };
            default: return { background: '#f3f4f6', color: '#374151' };
        }
    };

    const OptionCard = ({ label, icon: Icon, active, onClick, subText }) => (
        <div
            onClick={onClick}
            style={{
                flex: 1, padding: 16, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                border: active ? '2px solid #6366f1' : '1px solid #e2e8f0',
                background: active ? '#f5f7ff' : 'white',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center'
            }}
            onMouseEnter={e => !active && (e.currentTarget.style.borderColor = '#cbd5e1')}
            onMouseLeave={e => !active && (e.currentTarget.style.borderColor = '#e2e8f0')}
        >
            <div style={{
                width: 36, height: 36, borderRadius: '50%', background: active ? '#6366f1' : '#f1f5f9',
                color: active ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <Icon size={18} />
            </div>
            <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: active ? '#4338ca' : '#1e293b' }}>{label}</div>
                {subText && <div style={{ fontSize: 11, color: active ? '#6366f1' : '#94a3b8' }}>{subText}</div>}
            </div>
            {active && <div style={{ position: 'absolute', top: 8, right: 8 }}><FiCheckCircle color="#6366f1" size={16} /></div>}
        </div>
    );

    const filteredStudents = allStudents.filter(s =>
        !searchTerm ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(s.id).includes(searchTerm)
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Header Controls */}
            <div className="controls-row" style={{ marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontSize: 20, color: '#1e293b' }}>Refund History</h3>
                <button className="btn-primary" onClick={() => setShowProcessModal(true)}>
                    <FiRefreshCcw /> Process New Refund
                </button>
            </div>

            {/* Audit/History Table */}
            <div className="glass-card table-container">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Student</th>
                            <th>Details</th>
                            <th>Amount</th>
                            <th>Mode</th>
                            <th>Reason</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {refundsData.filter(r => r.action === 'REFUND').map(r => (
                            <tr key={r.id}>
                                <td>#{r.id.toString().slice(-6)}</td>
                                <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                                <td>{r.detail}</td>
                                <td style={{ fontWeight: 600 }}>₹{r.amount.toLocaleString()}</td>
                                <td>{r.mode}</td>
                                <td style={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={r.reason}>{r.reason}</td>
                                <td>{r.date}</td>
                                <td>
                                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, ...getStatusStyle(r.status) }}>
                                        {r.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn-icon"
                                        style={{ color: '#ef4444', background: '#fee2e2', width: 32, height: 32 }}
                                        onClick={() => handleDeleteRefund(r.id)}
                                        title="Delete Refund (Reverses Transaction)"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {refundsData.filter(r => r.action === 'REFUND').length === 0 && (
                    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                        No refunds found. Click 'Process New Refund' to start.
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showProcessModal && (
                    <div className="modal-overlay">
                        <motion.div className="modal-content large-modal" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ maxHeight: '90vh', overflowY: 'auto' }}>

                            {/* Modal Header */}
                            <div className="modal-header" style={{ marginBottom: 32 }}>
                                <div>
                                    <h3 style={{ fontSize: 24, fontWeight: 700 }}>Process Refund</h3>
                                    <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#64748b' }}>Select student and configure options</p>
                                </div>
                                <button className="btn-icon" onClick={() => setShowProcessModal(false)}><FiX size={24} /></button>
                            </div>

                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                                {/* 1. Student Selection Field */}
                                <div style={{ position: 'relative' }}>
                                    <label className="form-label">Student</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiSearch style={{ position: 'absolute', left: 16, top: 18, color: '#64748b', fontSize: 20 }} />
                                        <input
                                            type="text"
                                            className="form-input"
                                            style={{ paddingLeft: 48, height: 56, fontSize: '16px', fontWeight: 500, width: '100%' }}
                                            placeholder="Search to select..."
                                            value={searchTerm}
                                            onChange={(e) => handleStudentSearch(e.target.value)}
                                            onFocus={() => setIsSearching(true)}
                                        />

                                        {/* Dropdown Results - Integrated Big Box Style */}
                                        <AnimatePresence>
                                            {isSearching && searchTerm && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="dropdown-menu show"
                                                    style={{
                                                        position: 'absolute', width: '100%', maxHeight: 300, overflowY: 'auto',
                                                        zIndex: 20, marginTop: 8, padding: 8,
                                                        background: 'white', border: '1px solid #e2e8f0', borderRadius: 16,
                                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                >
                                                    {filteredStudents.length > 0 ? filteredStudents.map(s => (
                                                        <div
                                                            key={s.id}
                                                            onClick={() => selectStudent(s)}
                                                            style={{
                                                                padding: '12px 16px', borderRadius: 12, marginBottom: 4, cursor: 'pointer',
                                                                display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#4338ca' }}>
                                                                {s.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{s.name}</div>
                                                                <div style={{ fontSize: 13, color: '#64748b' }}>ID: {s.id} • Bal: <span style={{ color: '#16a34a', fontWeight: 600 }}>₹{s.paidAmount || 0}</span></div>
                                                            </div>
                                                            <FiCheckCircle style={{ marginLeft: 'auto', opacity: 0 }} />
                                                        </div>
                                                    )) : (
                                                        <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>No results</div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Form Content - Always Visible but Disabled if No Student */}
                                <div style={{ opacity: selectedStudent ? 1 : 0.5, pointerEvents: selectedStudent ? 'auto' : 'none', transition: 'opacity 0.3s' }}>

                                    {/* Balance Display */}
                                    {selectedStudent && (
                                        <div style={{ marginBottom: 24, padding: 16, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                <FiUser style={{ color: '#16a34a' }} />
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#166534' }}>{selectedStudent.name}</div>
                                                    <div style={{ fontSize: 12, color: '#15803d' }}>Confirmed for Refund</div>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>MAX REFUNDable</div>
                                                <div style={{ fontSize: 18, color: '#16a34a', fontWeight: 700 }}>₹{selectedStudent.paidAmount || 0}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                        {/* Row 1: Type Selection */}
                                        <div>
                                            <label className="form-label" style={{ marginBottom: 12 }}>Refund Type</label>
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                <OptionCard
                                                    label="Partial Refund"
                                                    subText="Enter specific amount"
                                                    icon={FiActivity}
                                                    active={formData.refundType === 'PARTIAL'}
                                                    onClick={() => setFormData({ ...formData, refundType: 'PARTIAL' })}
                                                />
                                                <OptionCard
                                                    label="Full Refund"
                                                    subText={`Refund full ₹${selectedStudent ? (selectedStudent.paidAmount || 0) : '0'}`}
                                                    icon={FiRefreshCcw}
                                                    active={formData.refundType === 'FULL'}
                                                    onClick={() => setFormData({ ...formData, refundType: 'FULL' })}
                                                />
                                            </div>
                                        </div>

                                        {/* Row 2: Amount (Conditional) */}
                                        <AnimatePresence>
                                            {formData.refundType === 'PARTIAL' && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                                    <label className="form-label">Refund Amount</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <FiDollarSign style={{ position: 'absolute', left: 14, top: 18, color: '#64748b', fontSize: 20 }} />
                                                        <input
                                                            type="number"
                                                            className="form-input"
                                                            style={{ paddingLeft: 42, fontSize: 18, fontWeight: 600, height: 56 }}
                                                            value={formData.amount}
                                                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Row 3: Mode Selection */}
                                        <div>
                                            <label className="form-label" style={{ marginBottom: 12 }}>Refund Mode</label>
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                <OptionCard
                                                    label="Wallet Credit"
                                                    icon={FiBriefcase}
                                                    active={formData.mode === 'WALLET'}
                                                    onClick={() => setFormData({ ...formData, mode: 'WALLET' })}
                                                />
                                                <OptionCard
                                                    label="Bank Transfer"
                                                    icon={FiCreditCard}
                                                    active={formData.mode === 'BANK'}
                                                    onClick={() => setFormData({ ...formData, mode: 'BANK' })}
                                                />
                                            </div>
                                        </div>

                                        {/* Row 4: Reason */}
                                        <div>
                                            <label className="form-label" style={{ marginBottom: 12 }}>Reason / Remarks</label>
                                            <div style={{ position: 'relative' }}>
                                                <FiFileText style={{ position: 'absolute', left: 16, top: 16, color: '#64748b', fontSize: 20 }} />
                                                <textarea
                                                    className="form-input"
                                                    style={{
                                                        minHeight: 120,
                                                        paddingLeft: 48,
                                                        paddingTop: 16,
                                                        lineHeight: 1.6,
                                                        fontSize: 15,
                                                        resize: 'none',
                                                        width: '100%'
                                                    }}
                                                    value={formData.reason}
                                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                                    placeholder="Enter a mandatory reason for this refund (e.g., 'Student withdrew from course')..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        <button className="btn-primary" style={{ marginTop: 16, height: 56, fontSize: 16, borderRadius: 12 }} onClick={handleProcess}>
                                            Confirm Refund
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FeeRefunds;
