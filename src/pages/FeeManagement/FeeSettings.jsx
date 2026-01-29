import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiBell, FiInfo, FiCheckCircle, FiAlertCircle, FiSettings,
    FiMail, FiMessageSquare, FiSmartphone, FiClock, FiActivity,
    FiUserCheck, FiSave, FiList, FiLoader, FiGlobe, FiFileText, FiPercent, FiZap
} from 'react-icons/fi';
import './FeeManagement.css';

// --- Extracted Component to prevent re-renders ---
const NotificationCard = ({ notifType, data, onToggle, onConfigChange, onTest }) => (
    <motion.div
        layout
        className="glass-card"
        style={{ padding: 24, borderLeft: data.enabled ? '4px solid #6366f1' : '4px solid #cbd5e1' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
    >
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{data.title}</h3>
                    <div className={`status-badge ${data.enabled ? 'paid' : 'pending'}`}>
                        {data.enabled ? 'Active' : 'Disabled'}
                    </div>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                    {data.description}
                </p>
            </div>
            <div
                className={`toggle-switch ${data.enabled ? 'active' : ''}`}
                onClick={() => onToggle(notifType, 'enabled')}
            >
                <div className="toggle-track"><div className="toggle-thumb"></div></div>
            </div>
        </div>

        <AnimatePresence>
            {data.enabled && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                >
                    <div className="section-divider" style={{ margin: '16px 0' }}></div>

                    <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>



                        {/* Channels */}
                        <div>
                            <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Channels</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.channels.email}
                                        onChange={() => onToggle(notifType, 'channels', 'email')}
                                    />
                                    <FiMail size={14} /> Email
                                </label>
                            </div>
                        </div>

                        {/* Configuration Specifics */}
                        {(data.config || data.template) && (
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Configuration</label>

                                <div style={{ background: 'rgba(255,255,255,0.5)', padding: 12, borderRadius: 12, border: '1px solid var(--glass-border)' }}>

                                    {/* Specific Config Inputs */}
                                    {notifType === 'pending' && (
                                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 13 }}>Remind</span>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    style={{ width: 60, padding: '4px 8px' }}
                                                    value={data.config.daysBefore}
                                                    onChange={(e) => onConfigChange(notifType, 'daysBefore', e.target.value)}
                                                />
                                                <span style={{ fontSize: 13 }}>days before due date</span>
                                            </div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={data.config.repeat}
                                                    onChange={(e) => onConfigChange(notifType, 'repeat', e.target.checked)}
                                                />
                                                Auto-repeat daily until paid
                                            </label>
                                        </div>
                                    )}

                                    {notifType === 'overdue' && (
                                        <div style={{ marginBottom: 12 }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={data.config.autoLateFee}
                                                    onChange={(e) => onConfigChange(notifType, 'autoLateFee', e.target.checked)}
                                                />
                                                Auto-apply late fee & update status to 'Overdue'
                                            </label>
                                        </div>
                                    )}

                                    {notifType === 'paymentSuccess' && (
                                        <div style={{ marginBottom: 12 }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={data.config.generateReceipt}
                                                    onChange={(e) => onConfigChange(notifType, 'generateReceipt', e.target.checked)}
                                                />
                                                Generate PDF Receipt automatically
                                            </label>
                                        </div>
                                    )}

                                    {/* Template Preview */}
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <strong>Message Template:</strong>
                                            <button
                                                className="test-trigger-btn"
                                                style={{
                                                    height: '28px',
                                                    padding: '0 12px',
                                                    fontSize: '12px',
                                                    gap: '6px',
                                                    color: '#f59e0b',
                                                    background: 'rgba(245, 158, 11, 0.1)',
                                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                                    borderRadius: '6px',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => onTest(data)}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                <FiZap size={14} /> Test Trigger
                                            </button>
                                        </div>
                                        <div style={{
                                            marginTop: 4,
                                            fontFamily: 'monospace',
                                            background: 'rgba(0,0,0,0.05)',
                                            padding: 8,
                                            borderRadius: 6
                                        }}>
                                            {data.template}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

const FeeSettings = () => {
    const [saving, setSaving] = useState(false);

    // Default States
    const defaultGeneral = {
        currency: 'INR',
        currencySymbol: '₹',
        taxName: 'GST',
        taxPercentage: 18,
        invoicePrefix: 'INV-',
        financialYear: '2025-26'
    };

    const defaultLateFee = {
        enabled: false,
        amount: 50,
        type: 'fixed', // or 'percentage'
        gracePeriod: 5,
        maxCap: 2000,
        sendEmail: true,
        frequency: 'weekly'
    };

    const defaultNotifications = {
        creation: {
            id: 'creation',
            enabled: true,
            title: 'Fee Creation',
            description: 'Trigger when a new fee is created or assigned.',
            channels: { inApp: true, email: true, sms: false },
            recipients: { student: true, parent: true, mentor: true },
            template: "A new fee of {{amount}} has been assigned. Due date: {{dueDate}}."
        },
        pending: {
            id: 'pending',
            enabled: true,
            title: 'Pending Fee Reminder',
            description: 'Remind before the due date arises.',
            channels: { inApp: true, email: true, sms: true },
            recipients: { student: true, parent: true, mentor: false },
            config: { daysBefore: 3, repeat: true },
            template: "Your fee of {{amount}} is due on {{dueDate}}. Please pay to avoid late fees."
        },
        overdue: {
            id: 'overdue',
            enabled: true,
            title: 'Overdue Fee Alert',
            description: 'Trigger when due date is crossed.',
            channels: { inApp: true, email: true, sms: true },
            recipients: { student: true, parent: true, mentor: true },
            config: { autoLateFee: true },
            template: "Your fee is overdue. Default late fee rules will be applied."
        },
        paymentSuccess: {
            id: 'paymentSuccess',
            enabled: true,
            title: 'Payment Successful',
            description: 'Trigger when a payment is successfully recorded.',
            channels: { inApp: true, email: true, sms: false },
            recipients: { student: true, parent: true, mentor: false },
            config: { generateReceipt: true },
            template: "Payment of {{paidAmount}} successful. Transaction ID: {{txnId}}."
        },
        partialPayment: {
            id: 'partialPayment',
            enabled: true,
            title: 'Partial Payment',
            description: 'Trigger when a partial payment is made.',
            channels: { inApp: true, email: false, sms: false },
            recipients: { student: true, parent: true, mentor: false },
            template: "Partial payment of {{paidAmount}} received. Remaining: {{balance}}."
        },
        refundStatus: {
            id: 'refundStatus',
            enabled: true,
            title: 'Refund Status Update',
            description: 'Trigger when a refund is approved or rejected.',
            channels: { inApp: true, email: true, sms: false },
            recipients: { student: true, admin: true },
            template: "Your refund request for {{amount}} has been {{status}}."
        }
    };

    const [generalSettings, setGeneralSettings] = useState(defaultGeneral);
    const [lateFeeSettings, setLateFeeSettings] = useState(defaultLateFee);
    const [notifications, setNotifications] = useState(defaultNotifications);

    // Load Settings from LocalStorage
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = () => {
        try {
            const savedGeneral = localStorage.getItem('fee_general_settings');
            const savedLateFee = localStorage.getItem('fee_late_fee_settings');
            const savedNotifs = localStorage.getItem('fee_notification_settings');

            if (savedGeneral) setGeneralSettings(JSON.parse(savedGeneral));
            if (savedLateFee) setLateFeeSettings(JSON.parse(savedLateFee));
            if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
        } catch (error) {
            console.error("Failed to load settings", error);
        }
    };

    // Save Settings to LocalStorage
    const handleSave = async () => {
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing

            localStorage.setItem('fee_general_settings', JSON.stringify(generalSettings));
            localStorage.setItem('fee_late_fee_settings', JSON.stringify(lateFeeSettings));
            localStorage.setItem('fee_notification_settings', JSON.stringify(notifications));

            alert('Configuration saved successfully!');
        } catch (error) {
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    // --- Logic Handlers ---

    const handleGeneralChange = (e) => {
        const { name, value } = e.target;
        setGeneralSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (key, field, nestedField = null) => {
        setNotifications(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: nestedField
                    ? { ...prev[key][field], [nestedField]: !prev[key][field][nestedField] }
                    : !prev[key][field]
            }
        }));
    };

    const handleConfigChange = (key, configKey, value) => {
        setNotifications(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                config: {
                    ...prev[key].config,
                    [configKey]: value
                }
            }
        }));
    };

    const handleLateFeeChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLateFeeSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // --- Simulation Logic ---
    const handleTestTrigger = (data) => {
        let msg = data.template;
        // Mock Data for substitution
        const mockData = {
            amount: '₹45,000',
            dueDate: 'Jan 30, 2026',
            paidAmount: '₹12,000',
            txnId: 'TXN-998877',
            balance: '₹33,000',
            status: 'Approved'
        };

        Object.keys(mockData).forEach(key => {
            msg = msg.replace(`{{${key}}}`, mockData[key]);
        });

        const activeChannels = Object.entries(data.channels)
            .filter(([_, isActive]) => isActive)
            .map(([channel]) => channel)
            .join(', ');

        if (!activeChannels) {
            alert('Enable at least one channel to test!');
            return;
        }

        alert(`[TEST AUTOMATION]\n\nSending via: ${activeChannels.toUpperCase()}\n\nMessage:\n"${msg}"`);
    };



    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Fee Module Settings</h2>
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? <FiLoader className="spin" /> : <FiSave />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* General Configuration Section */}
            <section className="form-section">
                <div className="section-title"><FiSettings /> General Configuration</div>
                <div className="glass-card">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Currency Symbol</label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <FiGlobe style={{ position: 'absolute', left: 12, color: '#64748b' }} />
                                <input name="currencySymbol" value={generalSettings.currencySymbol} onChange={handleGeneralChange} className="form-input" style={{ paddingLeft: 36 }} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Currency Code</label>
                            <select name="currency" value={generalSettings.currency} onChange={handleGeneralChange} className="form-select">
                                <option value="INR">INR (Indian Rupee)</option>
                                <option value="USD">USD (US Dollar)</option>
                                <option value="EUR">EUR (Euro)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Financial Year</label>
                            <select name="financialYear" value={generalSettings.financialYear} onChange={handleGeneralChange} className="form-select">
                                <option value="2025-26">2025-26</option>
                                <option value="2026-27">2026-27</option>
                            </select>
                        </div>
                    </div>
                    <div className="section-divider"></div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Default Tax Name</label>
                            <input name="taxName" value={generalSettings.taxName} onChange={handleGeneralChange} className="form-input" placeholder="e.g. GST" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tax Percentage (%)</label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <FiPercent style={{ position: 'absolute', left: 12, color: '#64748b' }} />
                                <input type="number" name="taxPercentage" value={generalSettings.taxPercentage} onChange={handleGeneralChange} className="form-input" style={{ paddingLeft: 36 }} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Invoice Prefix</label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <FiFileText style={{ position: 'absolute', left: 12, color: '#64748b' }} />
                                <input name="invoicePrefix" value={generalSettings.invoicePrefix} onChange={handleGeneralChange} className="form-input" style={{ paddingLeft: 36 }} placeholder="e.g. INV-" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Late Fee Configuration Section */}
            <section className="form-section">
                <div className="section-title"><FiClock /> Late Fee Configuration</div>
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Enable Late Fees</h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                                Automatically apply late fees to overdue invoices.
                            </p>
                        </div>
                        <div
                            className={`toggle-switch ${lateFeeSettings.enabled ? 'active' : ''}`}
                            onClick={() => setLateFeeSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                        >
                            <div className="toggle-track"><div className="toggle-thumb"></div></div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {lateFeeSettings.enabled && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div className="section-divider"></div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Fee Amount ({generalSettings.currencySymbol})</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={lateFeeSettings.amount}
                                            onChange={handleLateFeeChange}
                                            className="form-input"
                                            placeholder="50"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Grace Period (Days)</label>
                                        <input
                                            type="number"
                                            name="gracePeriod"
                                            value={lateFeeSettings.gracePeriod}
                                            onChange={handleLateFeeChange}
                                            className="form-input"
                                            placeholder="5"
                                        />
                                        <small style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Days after due date before fee applies</small>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Max Fee Cap ({generalSettings.currencySymbol})</label>
                                        <input
                                            type="number"
                                            name="maxCap"
                                            value={lateFeeSettings.maxCap}
                                            onChange={handleLateFeeChange}
                                            className="form-input"
                                            placeholder="2000"
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: 16, padding: '12px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 8, border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
                                            <input
                                                type="checkbox"
                                                name="sendEmail"
                                                checked={lateFeeSettings.sendEmail}
                                                onChange={handleLateFeeChange}
                                            />
                                            Send Late Fee Notification
                                        </label>
                                        {lateFeeSettings.sendEmail && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }}>
                                                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Frequency:</span>
                                                <select
                                                    name="frequency"
                                                    value={lateFeeSettings.frequency}
                                                    onChange={handleLateFeeChange}
                                                    className="form-select"
                                                    style={{ width: 'auto', padding: '4px 24px 4px 8px', fontSize: 13, height: 28 }}
                                                >
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly">Weekly</option>
                                                    <option value="monthly">Monthly</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Notification Section */}
            <section className="form-section">
                <div className="section-title"><FiBell /> Notification Automation</div>
                <div className="settings-grid">
                    {/* Render cards using the extracted component */}
                    <NotificationCard
                        notifType="creation"
                        data={notifications.creation}
                        onToggle={handleToggle}
                        onConfigChange={handleConfigChange}
                        onTest={handleTestTrigger}
                    />
                    <NotificationCard
                        notifType="pending"
                        data={notifications.pending}
                        onToggle={handleToggle}
                        onConfigChange={handleConfigChange}
                        onTest={handleTestTrigger}
                    />
                    <NotificationCard
                        notifType="overdue"
                        data={notifications.overdue}
                        onToggle={handleToggle}
                        onConfigChange={handleConfigChange}
                        onTest={handleTestTrigger}
                    />
                    <NotificationCard
                        notifType="paymentSuccess"
                        data={notifications.paymentSuccess}
                        onToggle={handleToggle}
                        onConfigChange={handleConfigChange}
                        onTest={handleTestTrigger}
                    />
                    <NotificationCard
                        notifType="partialPayment"
                        data={notifications.partialPayment}
                        onToggle={handleToggle}
                        onConfigChange={handleConfigChange}
                        onTest={handleTestTrigger}
                    />
                    <NotificationCard
                        notifType="refundStatus"
                        data={notifications.refundStatus}
                        onToggle={handleToggle}
                        onConfigChange={handleConfigChange}
                        onTest={handleTestTrigger}
                    />
                </div>
            </section>

            {/* Logs Section Preview */}
            <div className="glass-card" style={{ marginTop: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 16 }}>Review Recent Notification Logs</h3>
                    <button className="btn-icon" style={{ width: 'auto', padding: '0 12px', fontSize: 12, gap: 6 }}>
                        <FiList /> View All Logs
                    </button>
                </div>
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Trigger</th>
                            <th>Recipient</th>
                            <th>Channel</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Today, 10:30 AM</td>
                            <td>Payment Success</td>
                            <td>Student: Alice</td>
                            <td>Email, In-App</td>
                            <td><span className="status-badge paid">Sent</span></td>
                        </tr>
                        <tr>
                            <td>Yesterday, 4:15 PM</td>
                            <td>Pending Reminder</td>
                            <td>Parent: Mr. Smith</td>
                            <td>SMS</td>
                            <td><span className="status-badge paid">Sent</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeeSettings;
