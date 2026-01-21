import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FiArrowLeft, FiSave, FiLayers, FiUsers, FiCreditCard,
    FiCalendar, FiDollarSign, FiBell, FiSettings, FiSearch, FiX, FiPlus, FiCheckCircle, FiInfo, FiFilter
} from 'react-icons/fi';
import './FeeManagement.css';

// --- Sub-Components ---

const SectionHeader = ({ icon: Icon, title, description }) => (
    <div className="section-title" style={{ marginBottom: 24 }}>
        <div className="stat-icon" style={{ width: 40, height: 40, fontSize: 18, borderRadius: 12 }}>
            <Icon />
        </div>
        <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h3>
            {description && <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{description}</p>}
        </div>
    </div>
);

const BasicDetails = ({ data, onChange }) => (
    <motion.div className="glass-card form-section" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <SectionHeader icon={FiLayers} title="Basic Details" description="Set the core information for this fee structure" />
        <div className="form-grid">
            <div className="form-group">
                <label className="form-label">Fee Name *</label>
                <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="e.g. Annual Tuition Fee 2026"
                    value={data.name}
                    onChange={onChange}
                />
            </div>
            <div className="form-group">
                <label className="form-label">Fee Type *</label>
                <select name="type" className="form-select" value={data.type} onChange={onChange}>
                    <option value="Tuition Fee">Tuition Fee</option>
                    <option value="Admission Fee">Admission Fee</option>
                    <option value="Exam Fee">Exam Fee</option>
                    <option value="Library Fee">Library Fee</option>
                    <option value="Custom Fee">Custom Fee</option>
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Amount (₹) *</label>
                <div style={{ position: 'relative' }}>
                    <FiDollarSign style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
                    <input
                        type="number"
                        name="amount"
                        className="form-input"
                        style={{ paddingLeft: 38 }}
                        placeholder="0.00"
                        value={data.amount}
                        onChange={onChange}
                    />
                </div>
            </div>
        </div>

        <div className="form-group" style={{ marginTop: 24, padding: 16, background: 'rgba(255,255,255,0.4)', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: data.taxEnabled ? 16 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ padding: 8, background: '#e0f2fe', borderRadius: 8, color: '#0284c7' }}><FiInfo size={16} /></div>
                    <div>
                        <label className="form-label" style={{ marginBottom: 2, cursor: 'pointer' }}>Include Tax (GST/VAT)</label>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Apply percentage tax on top of the base amount</div>
                    </div>
                </div>
                <div
                    className={`toggle-switch ${data.taxEnabled ? 'active' : ''}`}
                    onClick={() => onChange({ target: { name: 'taxEnabled', value: !data.taxEnabled } })}
                >
                    <div className="toggle-track"><div className="toggle-thumb"></div></div>
                </div>
            </div>

            <AnimatePresence>
                {data.taxEnabled && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--glass-border)', paddingTop: 16 }}>
                            <input
                                type="number"
                                name="taxPercentage"
                                className="form-input"
                                style={{ width: 120 }}
                                value={data.taxPercentage}
                                onChange={onChange}
                            />
                            <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>% Tax Percentage</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="form-group" style={{ marginTop: 24 }}>
            <label className="form-label">Description (Optional)</label>
            <textarea
                name="description"
                className="form-textarea"
                placeholder="Add generic notes about this fee..."
                value={data.description}
                onChange={onChange}
            ></textarea>
        </div>
    </motion.div>
);

const FeeAssignment = ({ data, setData, studentSearch, setStudentSearch, searchableStudents, handleStudentSearchAdd, removeStudent, availableBatches }) => {
    return (
        <motion.div className="glass-card form-section" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <SectionHeader icon={FiUsers} title="Assign Fee To" description="Select specific students or batches for this fee" />

            {/* Batch Filter */}
            <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Filter by Batch (Optional)</label>
                <div style={{ position: 'relative' }}>
                    <FiFilter style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
                    <select
                        className="form-select"
                        style={{ paddingLeft: 38 }}
                        value={data.batch}
                        onChange={(e) => setData({ ...data, batch: e.target.value })}
                    >
                        <option value="">All Batches</option>
                        {availableBatches.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Search & Add Students {data.batch ? '(from selected batch)' : ''}</label>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                    <FiSearch style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search by name or ID..."
                        style={{ paddingLeft: 38 }}
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                    />
                    {studentSearch && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                            background: 'white', borderRadius: 12, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                            zIndex: 10, padding: 8, border: '1px solid #e2e8f0'
                        }}>
                            {searchableStudents.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || String(s.id).includes(studentSearch)).map(student => (
                                <div
                                    key={student.id}
                                    onClick={() => { handleStudentSearchAdd(student); setStudentSearch(''); }}
                                    style={{ padding: '10px 14px', cursor: 'pointer', borderRadius: 8, transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>ID: #{student.id}</div>
                                </div>
                            ))}
                            {searchableStudents.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || String(s.id).includes(studentSearch)).length === 0 && (
                                <div style={{ padding: 12, textAlign: 'center', color: '#94a3b8' }}>No students found</div>
                            )}
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {data.selectedStudents.map(student => (
                        <div key={student.id} className="status-badge" style={{ background: '#e0e7ff', color: '#4338ca', padding: '8px 14px', border: '1px solid #c7d2fe' }}>
                            {student.name}
                            <FiX style={{ marginLeft: 8, cursor: 'pointer', opacity: 0.7 }} onClick={() => removeStudent(student.id)} />
                        </div>
                    ))}
                    {data.selectedStudents.length === 0 && <div style={{ padding: 20, width: '100%', textAlign: 'center', border: '2px dashed var(--glass-border)', borderRadius: 12, color: 'var(--text-secondary)' }}>No students selected. Search above to add.</div>}
                </div>
            </div>
        </motion.div>
    );
};

const PaymentConfiguration = ({ data, setData }) => {
    const updateInstallment = (id, field, value) => {
        setData(prev => ({
            ...prev,
            installments: prev.installments.map(inst => inst.id === id ? { ...inst, [field]: value } : inst)
        }));
    };

    const addInstallment = () => {
        setData(prev => ({
            ...prev,
            installments: [...prev.installments, { id: Date.now(), name: `Installment ${prev.installments.length + 1}`, percent: 0, due: '' }]
        }));
    };

    const removeInstallment = (id) => {
        setData(prev => ({
            ...prev,
            installments: prev.installments.filter(inst => inst.id !== id)
        }));
    };

    return (
        <motion.div className="glass-card form-section" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <SectionHeader icon={FiCreditCard} title="Payment Schedule & Rules" description="Configure when and how the fee should be paid" />

            <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Payment Schedule Structure</label>
                <select
                    className="form-select"
                    value={data.schedule}
                    onChange={(e) => setData({ ...data, schedule: e.target.value })}
                >
                    <option value="OneTime">One-Time Payment</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="4Months">Every 4 Months</option>
                    <option value="HalfYearly">Half Yearly (6 Months)</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Installments">Custom Installments</option>
                </select>
            </div>

            {data.schedule === 'Installments' ? (
                <div className="timeline-container" style={{ paddingLeft: 24, borderLeft: '2px solid #e2e8f0', marginLeft: 12 }}>
                    {data.installments.map((inst, index) => (
                        <div className="timeline-item" key={inst.id} style={{ marginBottom: 24, position: 'relative' }}>
                            <div className="timeline-dot" style={{ position: 'absolute', left: -31, top: 12, width: 14, height: 14, borderRadius: '50%', background: 'var(--primary-gradient)', border: '2px solid white', boxShadow: '0 0 0 1px #e2e8f0' }}></div>
                            <div className="glass-card" style={{ padding: 16, border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.4)' }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 2, minWidth: 200 }}>
                                        <label className="form-label" style={{ fontSize: 11 }}>Installment Name</label>
                                        <input type="text" className="form-input" value={inst.name} onChange={e => updateInstallment(inst.id, 'name', e.target.value)} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 100 }}>
                                        <label className="form-label" style={{ fontSize: 11 }}>% of Total</label>
                                        <input type="number" className="form-input" value={inst.percent} onChange={e => updateInstallment(inst.id, 'percent', e.target.value)} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 140 }}>
                                        <label className="form-label" style={{ fontSize: 11 }}>Due Date</label>
                                        <input type="date" className="form-input" value={inst.due} onChange={e => updateInstallment(inst.id, 'due', e.target.value)} />
                                    </div>
                                    {index > 0 && (
                                        <button className="btn-icon" style={{ color: '#ef4444', height: 44, width: 44, background: '#fef2f2', border: '1px solid #fee2e2' }} onClick={() => removeInstallment(inst.id)}><FiX /></button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn-primary" onClick={addInstallment} style={{ width: 'auto', padding: '8px 16px', background: 'white', color: '#6366f1', border: '1px solid #e0e7ff', boxShadow: 'none' }}>
                        <FiPlus /> Add Another Installment
                    </button>
                </div>
            ) : (
                <div className="form-group" style={{ marginBottom: 24 }}>
                    <label className="form-label">Due Date</label>
                    <div style={{ position: 'relative' }}>
                        <FiCalendar style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
                        <input
                            type="date"
                            className="form-input"
                            style={{ paddingLeft: 38 }}
                            value={data.dueDate}
                            onChange={(e) => setData({ ...data, dueDate: e.target.value })}
                        />
                    </div>
                </div>
            )}

            <div className="section-divider"></div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label" style={{ marginBottom: 12 }}>Late Fee Rules</label>
                    <div
                        className={`toggle-switch ${data.lateFeeEnabled ? 'active' : ''}`}
                        onClick={() => setData({ ...data, lateFeeEnabled: !data.lateFeeEnabled })}
                    >
                        <div className="toggle-track"><div className="toggle-thumb"></div></div>
                        <span className="toggle-label">Enable Late Fee</span>
                    </div>
                </div>
                {data.lateFeeEnabled && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="form-group">
                            <label className="form-label">Calculation Type</label>
                            <div style={{ display: 'flex', gap: 12 }}>
                                {['amount', 'percentage'].map(type => (
                                    <button
                                        key={type}
                                        className={`nav-tab ${data.lateFeeType === type ? 'active' : ''}`}
                                        onClick={() => setData({ ...data, lateFeeType: type })}
                                        style={{ margin: 0, border: '1px solid var(--glass-border)', background: data.lateFeeType === type ? 'var(--primary-gradient)' : 'white' }}
                                    >
                                        {type === 'amount' ? 'Fixed Amount' : 'Percentage %'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: 16 }}>
                            <label className="form-label">Value</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Enter value"
                                value={data.lateFeeValue}
                                onChange={(e) => setData({ ...data, lateFeeValue: e.target.value })}
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

const PaymentMethods = ({ data, setData, toggleNested }) => (
    <motion.div className="glass-card form-section" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <SectionHeader icon={FiSettings} title="Payment Methods" description="Select allowed payment modes for this fee" />
        <div className="form-grid">
            <div className="form-group">
                <label className="form-label" style={{ marginBottom: 10 }}>Online Modes</label>
                <div className="glass-card" style={{ padding: 16, background: 'rgba(255,255,255,0.4)', borderRadius: 12 }}>
                    {Object.keys(data.online).map(mode => (
                        <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                            <div className={`checkbox-custom ${data.online[mode] ? 'checked' : ''}`} style={{
                                width: 20, height: 20, borderRadius: 6, border: data.online[mode] ? 'none' : '2px solid #cbd5e1',
                                background: data.online[mode] ? 'var(--primary-gradient)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {data.online[mode] && <FiCheckCircle color="white" size={12} />}
                            </div>
                            <input type="checkbox" checked={data.online[mode]} onChange={() => toggleNested(setData, 'online', mode)} style={{ display: 'none' }} />
                            <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{mode}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="form-group">
                <label className="form-label" style={{ marginBottom: 10 }}>Manual Modes</label>
                <div className="glass-card" style={{ padding: 16, background: 'rgba(255,255,255,0.4)', borderRadius: 12 }}>
                    {Object.keys(data.manual).map(mode => (
                        <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                            <div className={`checkbox-custom ${data.manual[mode] ? 'checked' : ''}`} style={{
                                width: 20, height: 20, borderRadius: 6, border: data.manual[mode] ? 'none' : '2px solid #cbd5e1',
                                background: data.manual[mode] ? 'var(--primary-gradient)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {data.manual[mode] && <FiCheckCircle color="white" size={12} />}
                            </div>
                            <input type="checkbox" checked={data.manual[mode]} onChange={() => toggleNested(setData, 'manual', mode)} style={{ display: 'none' }} />
                            <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{mode.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
        <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Allow Admin Manual Record</span>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Admins can mark fees as paid manually</p>
            </div>
            <div
                className={`toggle-switch ${data.allowManualRecording ? 'active' : ''}`}
                onClick={() => setData({ ...data, allowManualRecording: !data.allowManualRecording })}
            >
                <div className="toggle-track"><div className="toggle-thumb"></div></div>
            </div>
        </div>
    </motion.div>
);

const NotificationSettings = ({ data, setData, toggleNested }) => (
    <motion.div className="glass-card form-section" style={{ marginBottom: 100 }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <SectionHeader icon={FiBell} title="Notifications & Automation" description="Configure automated alerts for this fee" />
        <div className="form-grid">
            <div className="form-group">
                <label className="form-label">Recipients</label>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {['Student', 'Parent', 'Mentor'].map(role => {
                        const key = `notify${role}`;
                        return (
                            <label key={role} className={`nav-tab ${data[key] ? 'active' : ''}`} style={{
                                borderRadius: 12, padding: '10px 16px', background: data[key] ? '#eff6ff' : 'white',
                                border: data[key] ? '1px solid #bfdbfe' : '1px solid #e2e8f0', color: data[key] ? '#2563eb' : 'var(--text-secondary)',
                                margin: 0
                            }}>
                                <input type="checkbox" checked={data[key]} onChange={() => setData({ ...data, [key]: !data[key] })} style={{ display: 'none' }} />
                                {role}
                            </label>
                        )
                    })}
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Triggers</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {Object.keys(data.triggers).map(trigger => (
                        <div key={trigger} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'white', border: '1px solid #f1f5f9', borderRadius: 10 }}>
                            <span style={{ fontSize: 14, fontWeight: 500 }}>{trigger.replace('on', 'On ')}</span>
                            <div
                                className={`toggle-switch ${data.triggers[trigger] ? 'active' : ''}`}
                                onClick={() => toggleNested(setData, 'triggers', trigger)}
                                style={{ transform: 'scale(0.8)' }}
                            >
                                <div className="toggle-track"><div className="toggle-thumb"></div></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);

const DiscountSettings = ({ data, setData }) => (
    <motion.div className="glass-card form-section" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
        <SectionHeader icon={FiDollarSign} title="Fee Concession" description="Apply a scholarship or discount to the base fee" />

        <div className="form-group" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <label className="form-label" style={{ marginBottom: 2, cursor: 'pointer' }}>Enable Concession</label>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Reduce fees via Scholarship or Discount</div>
                </div>
                <div
                    className={`toggle-switch ${data.enabled ? 'active' : ''}`}
                    onClick={() => setData({ ...data, enabled: !data.enabled })}
                >
                    <div className="toggle-track"><div className="toggle-thumb"></div></div>
                </div>
            </div>
        </div>

        <AnimatePresence>
            {data.enabled && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <div className="form-grid" style={{ paddingTop: 12, borderTop: '1px solid var(--glass-border)' }}>
                        <div className="form-group">
                            <label className="form-label">Concession Category</label>
                            <div style={{ display: 'flex', gap: 12 }}>
                                {['Scholarship', 'Discount'].map(cat => (
                                    <button
                                        key={cat}
                                        className={`nav-tab ${data.category === cat ? 'active' : ''}`}
                                        onClick={() => setData({ ...data, category: cat })}
                                        style={{
                                            margin: 0,
                                            border: '1px solid var(--glass-border)',
                                            background: data.category === cat ? 'var(--primary-gradient)' : 'white',
                                            color: data.category === cat ? 'white' : 'var(--text-secondary)',
                                            width: '100%',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="form-grid" style={{ marginTop: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Calculation Type</label>
                            <div style={{ display: 'flex', gap: 12 }}>
                                {['flat', 'percentage'].map(type => (
                                    <button
                                        key={type}
                                        className={`nav-tab ${data.type === type ? 'active' : ''}`}
                                        onClick={() => setData({ ...data, type: type })}
                                        style={{ margin: 0, border: '1px solid var(--glass-border)', background: data.type === type ? '#f1f5f9' : 'white', color: data.type === type ? '#0f172a' : 'var(--text-secondary)', width: '100%', justifyContent: 'center' }}
                                    >
                                        {type === 'flat' ? 'Flat Amount (₹)' : 'Percentage (%)'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Value</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder={data.type === 'flat' ? "Amount (e.g. 5000)" : "Percentage (e.g. 10)"}
                                value={data.value}
                                onChange={(e) => setData({ ...data, value: e.target.value })}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

// --- Main Component ---

const CreateFee = () => {
    const navigate = useNavigate();

    // Form States
    const [basicDetails, setBasicDetails] = useState({
        name: '',
        type: 'Tuition Fee',
        amount: '',
        description: '',
        taxEnabled: false,
        taxPercentage: 18
    });

    const [discount, setDiscount] = useState({
        enabled: false,
        category: 'Scholarship',
        type: 'flat',
        value: '',
        reason: ''
    });

    const [assignment, setAssignment] = useState({
        course: '',
        batch: '', // This will now hold selected batch ID
        category: 'Normal',
        targetType: 'group',
        selectedStudents: []
    });

    const [paymentConfig, setPaymentConfig] = useState({
        schedule: 'Monthly',
        installments: [
            { id: 1, name: 'Installment 1', percent: 100, due: '' }
        ],
        lateFeeEnabled: false,
        lateFeeType: 'amount',
        lateFeeValue: '',
        dueDate: '',
        autoApplyDiscounts: false
    });

    const [paymentMethods, setPaymentMethods] = useState({
        online: { upi: true, card: true, netbanking: true },
        manual: { cash: true, bankTransfer: true, cheque: true },
        allowManualRecording: true
    });

    const [notifications, setNotifications] = useState({
        autoUpdateStatus: true,
        notifyStudent: true,
        notifyParent: false,
        notifyMentor: false,
        triggers: {
            onCreation: true,
            onPending: true,
            onOverdue: true
        }
    });

    const [studentSearch, setStudentSearch] = useState('');
    const [availableBatches, setAvailableBatches] = useState([]);
    const [searchableStudents, setSearchableStudents] = useState([]);

    // 1. Load Data on Mount
    useEffect(() => {
        const storedBatches = JSON.parse(localStorage.getItem('lms_fee_data') || '[]');
        setAvailableBatches(storedBatches);

        // Flatten all students initially
        const allStudents = storedBatches.flatMap(b => b.studentList || []);
        setSearchableStudents(allStudents);
    }, []);

    // 2. Filter Students when Batch Selected
    useEffect(() => {
        if (assignment.batch) {
            const selectedBatch = availableBatches.find(b => String(b.id) === String(assignment.batch));
            if (selectedBatch && selectedBatch.studentList) {
                setSearchableStudents(selectedBatch.studentList);
            } else {
                setSearchableStudents([]);
            }
        } else {
            // Show all students if no batch selected
            const allStudents = availableBatches.flatMap(b => b.studentList || []);
            setSearchableStudents(allStudents);
        }
    }, [assignment.batch, availableBatches]);

    const handleStudentSearchAdd = (student) => {
        if (!assignment.selectedStudents.find(s => s.id === student.id)) {
            setAssignment(prev => ({ ...prev, selectedStudents: [...prev.selectedStudents, student] }));
        }
    };

    const removeStudent = (id) => {
        setAssignment(prev => ({ ...prev, selectedStudents: prev.selectedStudents.filter(s => s.id !== id) }));
    };

    const handleBasicChange = (e) => setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });

    // Toggle helper
    const toggleNested = (stateSetter, parentKey, childKey) => {
        stateSetter(prev => ({
            ...prev,
            [parentKey]: {
                ...prev[parentKey],
                [childKey]: !prev[parentKey][childKey]
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (assignment.selectedStudents.length === 0) {
            alert('Please select at least one student.');
            return;
        }

        const feeAmount = Number(basicDetails.amount);
        let finalAmount = feeAmount;

        // Apply Discount Logic
        if (discount.enabled && discount.value) {
            const discVal = Number(discount.value);
            if (discount.type === 'flat') {
                finalAmount = Math.max(0, feeAmount - discVal);
            } else {
                finalAmount = Math.max(0, feeAmount - (feeAmount * discVal / 100));
            }
        }

        const feeName = basicDetails.name;

        // 1. Load Centralized Data
        const allBatches = JSON.parse(localStorage.getItem('lms_fee_data') || '[]');
        let updatedBatches = [...allBatches];
        let updatedCount = 0;
        let studentsNotFound = [];

        // 2. Iterate selected students
        assignment.selectedStudents.forEach(selected => {
            let found = false;

            // Find valid batch containing this student
            // Prioritize the selected batch if any, otherwise search all

            // NOTE: We update the source batch in lms_fee_data directly.

            const batchIndex = updatedBatches.findIndex(b => b.studentList && b.studentList.some(s => s.id === selected.id));

            if (batchIndex !== -1) {
                const batch = updatedBatches[batchIndex];
                const studentIndex = batch.studentList.findIndex(s => s.id === selected.id);

                if (studentIndex !== -1) {
                    // Update Student Record
                    const student = batch.studentList[studentIndex];
                    student.totalFee = (student.totalFee || 0) + finalAmount;

                    found = true;
                    updatedCount++;
                }
            }

            if (!found) {
                studentsNotFound.push(selected);
            }
        });

        // 3. Handle Students NOT in any batch (Legacy fallback)
        if (studentsNotFound.length > 0) {
            const batchName = 'Individual Fees: ' + feeName;

            const existingCustomIndex = updatedBatches.findIndex(b => b.name === batchName && String(b.id).startsWith('custom-'));

            if (existingCustomIndex !== -1) {
                const batch = updatedBatches[existingCustomIndex];
                const newStudents = studentsNotFound.map(s => ({
                    id: s.id,
                    name: s.name,
                    roll: 'IND-' + s.id,
                    totalFee: finalAmount,
                    paidAmount: 0,
                    status: 'PENDING'
                }));
                batch.studentList = [...batch.studentList, ...newStudents];
                batch.students = batch.studentList.length;
            } else {
                // Create New
                const newBatchId = 'custom-' + Date.now();
                updatedBatches.unshift({
                    id: newBatchId,
                    name: batchName,
                    course: 'Custom Assignment',
                    year: new Date().getFullYear(),
                    students: studentsNotFound.length,
                    collected: 0,
                    studentList: studentsNotFound.map(s => ({
                        id: s.id,
                        name: s.name,
                        roll: 'IND-' + s.id,
                        totalFee: finalAmount,
                        paidAmount: 0,
                        status: 'PENDING'
                    })),
                    // Legacy container
                    feeDetails: {
                        structure: [{ name: basicDetails.type, amount: finalAmount }],
                        totalFee: finalAmount * studentsNotFound.length,
                        paidAmount: 0,
                        pendingAmount: finalAmount * studentsNotFound.length,
                        dueDate: paymentConfig.dueDate || '2026-12-31'
                    }
                });
            }
        }

        // 4. Save
        localStorage.setItem('lms_fee_data', JSON.stringify(updatedBatches));

        let message = '';
        if (updatedCount > 0) message += `Updated fee for ${updatedCount} existing student(s). `;
        if (studentsNotFound.length > 0) message += `Created/Merged ${studentsNotFound.length} student(s) into individual batch.`;

        alert(message);
        navigate('/fee', { state: { defaultTab: 'batches' } });
    };

    return (
        <motion.div
            className="fee-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', overflowX: 'hidden' }}
        >
            {/* Header */}
            <header className="fee-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate('/fee')} className="btn-icon">
                        <FiArrowLeft />
                    </button>
                    <div className="fee-title">
                        <h1>Create New Fee</h1>
                        <div className="fee-subtitle">Define fee structure, pricing plans, and payment schedules</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button onClick={() => navigate('/fee')} style={{
                        background: 'transparent', border: '1px solid #cbd5e1',
                        padding: '10px 24px', borderRadius: '10px', fontWeight: 600, color: '#64748b', cursor: 'pointer', transition: 'all 0.2s'
                    }} onMouseEnter={(e) => e.target.style.background = '#f1f5f9'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="btn-primary">
                        <FiSave /> Save Fee Structure
                    </button>
                </div>
            </header>

            {/* Main Form Content */}
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <BasicDetails data={basicDetails} onChange={handleBasicChange} />

                <DiscountSettings data={discount} setData={setDiscount} />

                <FeeAssignment
                    data={assignment}
                    setData={setAssignment}
                    studentSearch={studentSearch}
                    setStudentSearch={setStudentSearch}
                    searchableStudents={searchableStudents}
                    availableBatches={availableBatches}
                    handleStudentSearchAdd={handleStudentSearchAdd}
                    removeStudent={removeStudent}
                />

                <PaymentConfiguration data={paymentConfig} setData={setPaymentConfig} />

                <PaymentMethods data={paymentMethods} setData={setPaymentMethods} toggleNested={toggleNested} />

                <NotificationSettings data={notifications} setData={setNotifications} toggleNested={toggleNested} />
            </div>
        </motion.div>
    );
};

export default CreateFee;
