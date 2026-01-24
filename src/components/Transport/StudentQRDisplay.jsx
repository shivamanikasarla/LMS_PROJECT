import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { FiDownload, FiPrinter, FiCalendar, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { generateQRData, getStudentQRConfig } from '../../utils/qrGenerator';
import { useTransportTheme } from '../../pages/Transport/Transport';

const StudentQRDisplay = ({ student, route, onClose }) => {
    const theme = useTransportTheme();
    const isDark = theme?.isDark || false;
    const [qrConfig, setQrConfig] = useState({ hasPickup: false, hasDrop: false });
    const [pickupQRData, setPickupQRData] = useState('');
    const [dropQRData, setDropQRData] = useState('');
    const [validDate, setValidDate] = useState('');

    const colors = {
        text: isDark ? '#f1f5f9' : '#1e293b',
        textMuted: isDark ? '#94a3b8' : '#64748b',
        cardBg: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '#334155' : '#e2e8f0',
    };

    useEffect(() => {
        if (!student || !route) return;

        // Get QR configuration
        const config = getStudentQRConfig(student);
        setQrConfig(config);

        // Set valid date to today
        const today = new Date().toISOString().split('T')[0];
        setValidDate(today);

        try {
            // Generate QR data
            if (config.hasPickup) {
                const pickupData = generateQRData(student, 'PICKUP', today, route);
                setPickupQRData(pickupData);
            }
            if (config.hasDrop) {
                const dropData = generateQRData(student, 'DROP', today, route);
                setDropQRData(dropData);
            }
        } catch (error) {
            console.error('Error generating QR codes:', error);
        }
    }, [student, route]);

    const downloadQR = (tripType) => {
        const svg = document.getElementById(`qr-${tripType.toLowerCase()}`);
        if (!svg) return;

        // Convert SVG to canvas for download
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = `${student.name}_${tripType}_QR_${validDate}.png`;
            link.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    const printQR = () => {
        window.print();
    };

    if (!student || !route) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                background: colors.cardBg,
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '600px',
                margin: '0 auto'
            }}
        >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: colors.text }}>
                    Transport QR Codes
                </h2>
                <p style={{ margin: '8px 0 0', fontSize: '14px', color: colors.textMuted }}>
                    {student.name} • {student.class}
                </p>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '12px',
                    padding: '6px 12px',
                    background: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                    color: '#10b981',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600'
                }}>
                    <FiCalendar size={14} />
                    Valid for: {new Date(validDate).toLocaleDateString()}
                </div>
            </div>

            {/* Route Info */}
            <div style={{
                background: isDark ? '#0f172a' : '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: `1px solid ${colors.border}`
            }}>
                <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '4px' }}>Route Information</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: colors.text }}>{route.name} ({route.code})</div>
                <div style={{ fontSize: '13px', color: colors.textMuted, marginTop: '4px' }}>
                    Vehicle: {route.vehicle || 'Not Assigned'}
                </div>
            </div>

            {/* QR Codes */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: qrConfig.hasPickup && qrConfig.hasDrop ? '1fr 1fr' : '1fr',
                gap: '24px',
                marginBottom: '24px'
            }}>
                {/* Pickup QR */}
                {qrConfig.hasPickup && pickupQRData && (
                    <div style={{
                        background: '#ffffff',
                        padding: '20px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '2px solid #3b82f6'
                    }}>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#3b82f6',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}>
                            <FiCheckCircle size={16} />
                            PICKUP QR
                        </div>
                        <div style={{
                            background: '#fff',
                            padding: '16px',
                            borderRadius: '8px',
                            display: 'inline-block'
                        }}>
                            <QRCodeSVG
                                id="qr-pickup"
                                value={pickupQRData}
                                size={180}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
                            Scan during pickup
                        </div>
                        <button
                            onClick={() => downloadQR('PICKUP')}
                            style={{
                                marginTop: '12px',
                                padding: '8px 16px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                margin: '12px auto 0'
                            }}
                        >
                            <FiDownload size={14} /> Download
                        </button>
                    </div>
                )}

                {/* Drop QR */}
                {qrConfig.hasDrop && dropQRData && (
                    <div style={{
                        background: '#ffffff',
                        padding: '20px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '2px solid #f59e0b'
                    }}>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#f59e0b',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}>
                            <FiCheckCircle size={16} />
                            DROP QR
                        </div>
                        <div style={{
                            background: '#fff',
                            padding: '16px',
                            borderRadius: '8px',
                            display: 'inline-block'
                        }}>
                            <QRCodeSVG
                                id="qr-drop"
                                value={dropQRData}
                                size={180}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
                            Scan during drop
                        </div>
                        <button
                            onClick={() => downloadQR('DROP')}
                            style={{
                                marginTop: '12px',
                                padding: '8px 16px',
                                background: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                margin: '12px auto 0'
                            }}
                        >
                            <FiDownload size={14} /> Download
                        </button>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div style={{
                background: isDark ? 'rgba(99, 102, 241, 0.15)' : '#eff6ff',
                padding: '16px',
                borderRadius: '12px',
                border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.3)' : '#bfdbfe'}`,
                marginBottom: '24px'
            }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#6366f1', marginBottom: '8px' }}>
                    📱 How to Use
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: colors.textMuted, lineHeight: '1.6' }}>
                    <li>Show this QR code to the driver/conductor</li>
                    <li>They will scan it to mark your attendance</li>
                    <li>Each QR is valid only for today ({new Date(validDate).toLocaleDateString()})</li>
                    <li>QR expires after successful scan</li>
                    {qrConfig.hasPickup && qrConfig.hasDrop && (
                        <li>Use pickup QR in morning, drop QR in evening</li>
                    )}
                </ul>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                    onClick={printQR}
                    style={{
                        padding: '10px 20px',
                        background: isDark ? '#334155' : '#f1f5f9',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        color: colors.text,
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <FiPrinter size={16} /> Print
                </button>
                <button
                    onClick={onClose}
                    style={{
                        padding: '10px 20px',
                        background: '#6366f1',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    Close
                </button>
            </div>

            {/* Warning for inactive */}
            {student.status !== 'Active' && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                    border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'}`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <FiAlertCircle size={16} color="#ef4444" />
                    <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: '600' }}>
                        Transport status is inactive - QR codes will not work
                    </span>
                </div>
            )}
        </motion.div>
    );
};

export default StudentQRDisplay;
