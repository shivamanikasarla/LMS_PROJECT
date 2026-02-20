import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiDownload, FiMoreVertical, FiCheckCircle, FiAlertCircle, FiClock, FiFileText, FiPlus, FiX, FiRefreshCcw } from 'react-icons/fi';
import './FeeManagement.css';

// Portal Helper moved outside to prevent re-creation on render
const ModalPortal = ({ children }) => {
    return ReactDOM.createPortal(children, document.body);
};

const FeePayments = ({ setActiveTab }) => {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);

    const [paymentForm, setPaymentForm] = useState({
        studentId: '',
        amount: '',
        mode: 'UPI',
        transactionId: '',
        date: new Date().toISOString().split('T')[0],
        remarks: '',
        isThirdParty: false,
        provider: '',
        cardNumber: '',
        tenure: ''
    });

    const [transactions, setTransactions] = useState([
        { id: 1, student: "Alice Johnson", fee: "Tuition Fee", amount: "₹12,000", date: "Jan 05, 2026", status: "Paid", method: "Online" },
        { id: 2, student: "Bob Smith", fee: "Exam Fee", amount: "₹500", date: "Jan 04, 2026", status: "Paid", method: "Cash" },
        { id: 3, student: "Charlie Brown", fee: "Tuition Fee", amount: "₹6,000", date: "Jan 03, 2026", status: "Partial", method: "Online" },
        { id: 4, student: "David Lee", fee: "Library Fee", amount: "₹200", date: "-", status: "Pending", method: "-" },
        { id: 5, student: "Eve Adams", fee: "Tuition Fee", amount: "₹12,000", date: "-", status: "Overdue", method: "-" },
    ]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid': return <span className="status-badge paid"><FiCheckCircle /> Paid</span>;
            case 'Pending': return <span className="status-badge pending"><FiClock /> Pending</span>;
            case 'Overdue': return <span className="status-badge overdue"><FiAlertCircle /> Overdue</span>;
            case 'Partial': return <span className="status-badge pending" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}><FiClock /> Partial</span>;
            default: return null;
        }
    };

    const handleRecordPayment = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Basic Validation
        if (!paymentForm.studentId || !paymentForm.amount) {
            alert("Please fill all required fields");
            return;
        }

        const payAmount = Number(paymentForm.amount);

        // --- UPDATE CENTRALIZED DATA (lms_fee_data) ---
        const allBatches = JSON.parse(localStorage.getItem('lms_fee_data') || '[]');
        let studentFound = false;
        const searchTermLower = paymentForm.studentId.toString().toLowerCase();

        const updatedBatches = allBatches.map(batch => {
            if (!batch.studentList) return batch;

            const studentIndex = batch.studentList.findIndex(s =>
                String(s.id) === searchTermLower ||
                s.name.toLowerCase().includes(searchTermLower)
            );

            if (studentIndex !== -1) {
                studentFound = true;
                const student = batch.studentList[studentIndex];

                student.paidAmount = (student.paidAmount || 0) + payAmount;
                student.lastPay = paymentForm.date;

                // Update status logic
                if (student.paidAmount >= student.totalFee) student.status = 'PAID';
                else if (student.paidAmount > 0) student.status = 'PARTIAL';

                // Simple batch stats update (optional but good for consistency)
                // batch.collected += ... logic could go here
            }
            return batch;
        });

        if (studentFound) {
            localStorage.setItem('lms_fee_data', JSON.stringify(updatedBatches));
        }
        // ----------------------------------------------

        const methodDisplay = paymentForm.isThirdParty
            ? `EMI/Card (${paymentForm.provider})`
            : paymentForm.mode;

        const newTxn = {
            id: Date.now(),
            student: paymentForm.studentId,
            fee: "Manual Payment",
            amount: "₹" + payAmount.toLocaleString(),
            date: new Date(paymentForm.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: "Paid",
            method: methodDisplay
        };

        setTransactions(prev => [newTxn, ...prev]);
        console.log("Payment Recorded:", paymentForm);
        setShowRecordModal(false);
        setPaymentForm({
            studentId: '',
            amount: '',
            mode: 'UPI',
            transactionId: '',
            date: new Date().toISOString().split('T')[0],
            remarks: '',
            isThirdParty: false,
            provider: '',
            cardNumber: '',
            tenure: ''
        });

        if (studentFound) {
            // Optional: User feedback that student record was updated
            // alert("Payment recorded and student fee status updated.");
        }
    };

    const openInvoice = (txn) => {
        setSelectedTransaction(txn);
        setShowInvoiceModal(true);
    }

    const filteredData = transactions.filter(t =>
        (filter === 'All' || t.status === filter) &&
        (t.student.toLowerCase().includes(searchTerm.toLowerCase()) || t.fee.toLowerCase().includes(searchTerm.toLowerCase()))
    );



    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Controls */}
            <div className="controls-row">
                <div className="controls-left" style={{ display: 'flex', gap: 12 }}>
                    {['All', 'Paid', 'Pending', 'Overdue'].map(f => (
                        <button
                            key={f}
                            className={`nav-tab ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="controls-right" style={{ display: 'flex', gap: 12 }}>
                    <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiSearch color="#64748b" />
                        <input
                            type="text"
                            placeholder="Search student or fee..."
                            style={{ border: 'none', background: 'transparent', outline: 'none' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary" onClick={() => setShowRecordModal(true)} style={{ padding: '8px 16px' }}>
                        <FiPlus /> Record Payment
                    </button>
                    <button className="btn-icon"><FiDownload /></button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card table-container">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Fee Type</th>
                            <th>Amount</th>
                            <th>Payment Date</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(txn => (
                            <tr key={txn.id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{txn.student}</div>
                                    <div style={{ fontSize: 12, color: '#64748b' }}>ID: STD-{100 + txn.id}</div>
                                </td>
                                <td>{txn.fee}</td>
                                <td>{txn.amount}</td>
                                <td>{txn.date}</td>
                                <td>{txn.method}</td>
                                <td>{getStatusBadge(txn.status)}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
                                        {txn.status === 'Paid' && (
                                            <button
                                                className="btn-icon"
                                                title="View Receipt"
                                                style={{ width: 32, height: 32 }}
                                                onClick={() => openInvoice(txn)}
                                            >
                                                <FiFileText size={14} />
                                            </button>
                                        )}
                                        <button
                                            className="btn-icon"
                                            title="Request Refund"
                                            style={{ width: 32, height: 32 }}
                                            onClick={() => setActiveTab && setActiveTab('refunds')}
                                        >
                                            <FiRefreshCcw size={14} />
                                        </button>

                                        {/* More Actions Toggle */}
                                        <button
                                            className="btn-icon"
                                            style={{ width: 32, height: 32 }}
                                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === txn.id ? null : txn.id); }}
                                        >
                                            <FiMoreVertical size={14} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {activeMenu === txn.id && (
                                            <div className="dropdown-menu show" style={{
                                                position: 'absolute', right: 0, top: '100%',
                                                minWidth: 160, zIndex: 50, marginTop: 4,
                                                background: 'white', border: '1px solid #e2e8f0', borderRadius: 8,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                            }}>
                                                <button
                                                    className="dropdown-item"
                                                    style={{ width: '100%', textAlign: 'left', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
                                                    onClick={() => {
                                                        alert(`Receipt sent to student ${txn.student} via Email.`);
                                                        setActiveMenu(null);
                                                    }}
                                                >
                                                    <FiFileText size={12} /> Email Receipt
                                                </button>
                                                <button
                                                    className="dropdown-item text-danger"
                                                    style={{ width: '100%', textAlign: 'left', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444' }}
                                                    onClick={() => {
                                                        if (window.confirm('Delete this transaction? This will reverse the payment.')) {
                                                            setTransactions(prev => prev.filter(t => t.id !== txn.id));

                                                            // Reverse Logic (Simulated for this demo list, but real for newly added manual ones)
                                                            // Ideally we match by Student ID and subtract Balance
                                                            const allBatches = JSON.parse(localStorage.getItem('lms_fee_data') || '[]');
                                                            // Since demo data IDs are loose, we try to match by name for demo purposes, or ID if strictly linked
                                                            const updated = allBatches.map(b => {
                                                                if (!b.studentList) return b;
                                                                b.studentList = b.studentList.map(s => {
                                                                    // Loose match for demo
                                                                    if (s.name === txn.student || String(s.id) === String(txn.student)) {
                                                                        // Parse amount string '₹12,000' -> 12000
                                                                        const amt = Number(txn.amount.replace(/[^0-9.-]+/g, ""));
                                                                        s.paidAmount = Math.max(0, (s.paidAmount || 0) - amt);
                                                                        if (s.paidAmount === 0) s.status = 'PENDING';
                                                                        else if (s.paidAmount < s.totalFee) s.status = 'PARTIAL';
                                                                    }
                                                                    return s;
                                                                });
                                                                return b;
                                                            });
                                                            localStorage.setItem('lms_fee_data', JSON.stringify(updated));
                                                            setActiveMenu(null);
                                                        }
                                                    }}
                                                >
                                                    <FiX size={12} /> Delete Transaction
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredData.length === 0 && (
                    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                        No records found.
                    </div>
                )}
            </div>

            {/* Record Payment Modal */}
            <ModalPortal>
                <AnimatePresence>
                    {showRecordModal && (
                        <div className="modal-overlay">
                            <motion.div
                                className="modal-content"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                            >
                                <div className="modal-header">
                                    <h3 style={{ margin: 0 }}>Record Manual Payment</h3>
                                    <button className="btn-icon" onClick={() => setShowRecordModal(false)}><FiX /></button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group" style={{ marginBottom: 16 }}>
                                        <label className="form-label">Search Student ID / Name</label>
                                        <input type="text" className="form-input" placeholder="Enter student details..." value={paymentForm.studentId} onChange={e => setPaymentForm({ ...paymentForm, studentId: e.target.value })} />
                                    </div>
                                    <div className="form-grid" style={{ marginBottom: 16 }}>
                                        <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                            <label className="form-label">Amount (₹)</label>
                                            <input type="number" className="form-input" placeholder="0.00" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setPaymentForm({ ...paymentForm, isThirdParty: !paymentForm.isThirdParty })}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            cursor: 'pointer',
                                            marginBottom: 20,
                                            userSelect: 'none'
                                        }}
                                    >
                                        <div style={{
                                            width: 44,
                                            height: 24,
                                            background: paymentForm.isThirdParty ? '#000' : '#cbd5e1',
                                            borderRadius: 99,
                                            position: 'relative',
                                            transition: 'background 0.2s ease'
                                        }}>
                                            <div style={{
                                                width: 20,
                                                height: 20,
                                                background: 'white',
                                                borderRadius: '50%',
                                                position: 'absolute',
                                                top: 2,
                                                left: paymentForm.isThirdParty ? 22 : 2,
                                                transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                            }} />
                                        </div>
                                        <span className="form-label" style={{ marginBottom: 0, cursor: 'pointer', fontSize: 13, color: '#475569' }}>
                                            Record via EMI / Third Party / Card
                                        </span>
                                    </div>

                                    {paymentForm.isThirdParty ? (
                                        <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16, border: '1px solid #e2e8f0' }}>
                                            <div className="form-grid" style={{ marginBottom: 12 }}>
                                                <div className="form-group">
                                                    <label className="form-label">Provider Name / Bank</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="e.g. HDFC, Bajaj Finserv..."
                                                        value={paymentForm.provider}
                                                        onChange={e => setPaymentForm({ ...paymentForm, provider: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Card No. (Last 4)</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="XXXX"
                                                        maxLength={4}
                                                        value={paymentForm.cardNumber}
                                                        onChange={e => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label className="form-label">Transaction / Approval Code</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={paymentForm.transactionId}
                                                        onChange={e => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">EMI Tenure / Note</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="e.g. 6 Months"
                                                        value={paymentForm.tenure}
                                                        onChange={e => setPaymentForm({ ...paymentForm, tenure: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="form-group" style={{ marginBottom: 16 }}>
                                            <label className="form-label">Payment Mode</label>
                                            <select className="form-select" value={paymentForm.mode} onChange={e => setPaymentForm({ ...paymentForm, mode: e.target.value })}>
                                                <option>UPI</option>
                                                <option>Cash</option>
                                                <option>Bank Transfer</option>
                                                <option>Cheque</option>
                                                <option>Card</option>
                                            </select>
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label className="form-label">Remarks</label>
                                        <textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="Notes..." value={paymentForm.remarks} onChange={e => setPaymentForm({ ...paymentForm, remarks: e.target.value })}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn-icon" style={{ borderRadius: 8, width: 'auto', padding: '0 16px' }} onClick={() => setShowRecordModal(false)}>Cancel</button>
                                    <button className="btn-primary" onClick={handleRecordPayment}>Record Payment</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Invoice Preview Modal */}
                <AnimatePresence>
                    {showInvoiceModal && selectedTransaction && (
                        <div className="modal-overlay">
                            <motion.div
                                className="modal-content"
                                style={{ maxWidth: 600 }}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <div className="modal-header">
                                    <h3 style={{ margin: 0 }}>Payment Receipt</h3>
                                    <button className="btn-icon" onClick={() => setShowInvoiceModal(false)}><FiX /></button>
                                </div>
                                <div className="modal-body" style={{ background: '#f8fafc' }}>
                                    <div className="invoice-preview">
                                        <div className="invoice-header">
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: 24, marginBottom: 4 }}>WAC LMS</div>
                                                <div style={{ fontSize: 12, color: '#64748b' }}>Receipt #{1000 + selectedTransaction.id}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 600 }}>Date</div>
                                                <div>{selectedTransaction.date}</div>
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: 20 }}>
                                            <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase' }}>To</div>
                                            <div style={{ fontWeight: 600, fontSize: 16 }}>{selectedTransaction.student}</div>
                                            <div>Student ID: STD-{100 + selectedTransaction.id}</div>
                                        </div>

                                        <div className="invoice-row" style={{ borderBottom: '2px solid #e2e8f0', fontWeight: 600, fontSize: 12, color: '#64748b' }}>
                                            <span>DESCRIPTION</span>
                                            <span>AMOUNT</span>
                                        </div>
                                        <div className="invoice-row">
                                            <span>{selectedTransaction.fee}</span>
                                            <span>{selectedTransaction.amount}</span>
                                        </div>
                                        <div className="invoice-row">
                                            <span>Transaction Charge (0%)</span>
                                            <span>₹0.00</span>
                                        </div>

                                        <div className="invoice-total">
                                            <span>TOTAL PAID</span>
                                            <span>{selectedTransaction.amount}</span>
                                        </div>

                                        <div style={{ marginTop: 20, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                                            Thank you for your payment. This is a computer generated receipt.
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        <FiDownload /> Download PDF
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </ModalPortal>
        </motion.div>
    );
};

export default FeePayments;
