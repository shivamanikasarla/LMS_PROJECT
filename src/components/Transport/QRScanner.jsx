import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiUpload, FiCheckCircle, FiXCircle, FiAlertCircle, FiX } from 'react-icons/fi';
import {
    validateQRData,
    checkDuplicateScan,
    recordQRScan,
    getTodaysScans
} from '../../utils/qrGenerator';
import { useTransportTheme } from '../../pages/Transport/Transport';

const QRScanner = ({ students, routes, onScanSuccess, onClose }) => {
    const theme = useTransportTheme();
    const isDark = theme?.isDark || false;
    const [scanner, setScanner] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [todaysScans, setTodaysScans] = useState([]);

    const colors = {
        text: isDark ? '#f1f5f9' : '#1e293b',
        textMuted: isDark ? '#94a3b8' : '#64748b',
        cardBg: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '#334155' : '#e2e8f0',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
    };

    useEffect(() => {
        // Load today's scans
        setTodaysScans(getTodaysScans());

        return () => {
            // Cleanup scanner
            if (scanner) {
                scanner.clear().catch(console.error);
            }
        };
    }, []);

    const startScanner = () => {
        setScanning(true);
        setScanResult(null);

        const html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            },
            false
        );

        html5QrcodeScanner.render(
            (decodedText) => {
                // Process QR code
                processQRCode(decodedText);
                html5QrcodeScanner.clear();
                setScanning(false);
            },
            (error) => {
                // Scanning errors (ignore most of them)
            }
        );

        setScanner(html5QrcodeScanner);
    };

    const processQRCode = (qrData) => {
        // Validate QR code
        const validation = validateQRData(qrData, students, routes);

        if (!validation.valid) {
            setScanResult({
                success: false,
                message: validation.error,
                type: 'error'
            });
            playErrorSound();
            return;
        }

        // Check for duplicates
        const duplicateCheck = checkDuplicateScan(validation.data, todaysScans);
        if (!duplicateCheck.canScan) {
            setScanResult({
                success: false,
                message: duplicateCheck.reason,
                type: 'warning'
            });
            playErrorSound();
            return;
        }

        // Record the scan
        const scanRecord = recordQRScan(validation.data, 'Driver/Conductor');

        // Update today's scans
        setTodaysScans([...todaysScans, scanRecord]);

        // Success!
        setScanResult({
            success: true,
            message: `${validation.data.student.name} marked ${validation.data.tripType.toLowerCase()} successfully!`,
            type: 'success',
            data: validation.data,
            scanRecord
        });

        playSuccessSound();

        // Callback to parent
        if (onScanSuccess) {
            onScanSuccess(scanRecord);
        }
    };

    const playSuccessSound = () => {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBi2P1vPTgjMGHm7A7+OZUR0LVKjj87BeDQk8ltL0wHEfBjN/zfDajj4KE1y16+qnVxEKRp/g8r5sIAYqj9bz04IzBh5uwO/jmVEdC1So4/OwXg0JPJbS9MBxHwYzf83w2o4+ChNctetqp1cRCkaS4PK+bCAGKo/W89OCMwYebsDv45lRHQtUqOPzsF4NCTyW0vTAcR8GM3/N8NqOPgoTXLXraqhXFApGkuDyvmwgBiqP1vPTgjMGHm7A7+OZUh0LUqjj87BeDAk8l9L0wHEfBjN/zfDajj4KE1y16+qoVxQKRpLh8r5sIAYqj9Xz04IzBh5twO/jmVIdC1Kn4/OwXgwJPJfS9MBxHwYyf83w2o4+ChNct+vqqFcUCkaS4fK+bCAGKo/V89OCMwYebcDv45lSHQtSp+PzsF4MCTyX0vTAcR8GMn/N8NqOPgoTXLfr6qhXFApGkuHyvmwgBiqP1fPTgjMGHm3A7+OZUh0LUqfj87BeDAk8l9P0wHEfBjJ/zfDajj4KE1y36+qoVxQKRpLh8r1sIAYqj9Xz04IzBh5twO/jmVIdC1Kn4/OwXgwJPJfT9MBxHwYyf83w2o4+ChNct+vqqFcUCkaS4fK9bCAGKo/V89OCMwYebcDv45lSHQtSp+PzsF4MCTyX0/TAcR8GMn/N8NqOPgoTXLfr6qhXFApGkuHyvm0gBiqO1fPTgjMGHm3A7+OZUh0LUqfj87BeDAk8l9P0wHEfBjJ/zfDajz4KE1y36+qoVxQKRpLh8r1tIAYqjdXz1IIzBh5twO/jmVIdC1Kn4/OwXgwJPJfT9MBxHwYyf83w2o8+ChNct+vqqFcUCkaS4fK9bSAGKo3V89SCMwYebcDv45lSHQtSp+PzsF4MCTyX0/PAcR8GMn/N8NqOPgoTXLfr6qhXFApGkuHyvW0gBiqN1fPUgjMGHm3A7+OZUh0LUqfj87BeDAk8l9PzwHEfBjJ/zfDajj4KE1y36+qnVxQKRpLh8r1tIAYqjdXz1IIzBh5twO/jmVIdC1Kn4/OwXgwJPJfT88BxHwYyf83w2o4+ChNct+vqp1cUCkaS4fK9bSAGKo3V89SCMwYebcDv45lSHQtSp+PzsF4MCTyX0/PAcR8GMn/N8NqOPgoTXLfr6qdXFApGkuHyvW0gBiqN1fPUgjMGHm3A7uOZUh0LUqfj87BeDAk8l9PzwHEfBjJ/zfDajj4KE1y36+');
        audio.play().catch(() => { }); // Ignore if audio fails
    };

    const playErrorSound = () => {
        const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
        audio.play().catch(() => { });
    };

    const stopScanner = () => {
        if (scanner) {
            scanner.clear().catch(console.error);
            setScanning(false);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            // For simplicity, you'd need a QR decoder for images
            // This is a placeholder - actual implementation would use html5-qrcode's file scan
            alert('File upload scanning - coming soon. Please use camera scan for now.');
        };
        reader.readAsDataURL(file);
    };

    return (
        <div style={{
            background: colors.cardBg,
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '600px',
            margin: '0 auto',
            border: `1px solid ${colors.border}`
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: colors.text }}>
                        Scan Student QR Code
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: colors.textMuted }}>
                        For attendance marking
                    </p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: colors.textMuted,
                            padding: '8px'
                        }}
                    >
                        <FiX size={24} />
                    </button>
                )}
            </div>

            {/* Scanner Controls */}
            {!scanning && !scanResult && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <button
                        onClick={startScanner}
                        style={{
                            flex: 1,
                            padding: '16px',
                            background: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <FiCamera size={20} /> Start Camera Scan
                    </button>
                </div>
            )}

            {/* Scanner Area */}
            {scanning && (
                <div style={{ marginBottom: '24px' }}>
                    <div id="qr-reader" style={{ width: '100%' }}></div>
                    <button
                        onClick={stopScanner}
                        style={{
                            marginTop: '12px',
                            width: '100%',
                            padding: '12px',
                            background: colors.error,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Stop Scanning
                    </button>
                </div>
            )}

            {/* Scan Result */}
            <AnimatePresence>
                {scanResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            padding: '20px',
                            borderRadius: '12px',
                            background: scanResult.success
                                ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5')
                                : scanResult.type === 'warning'
                                    ? (isDark ? 'rgba(251, 191, 36, 0.15)' : '#fff7ed')
                                    : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2'),
                            border: `2px solid ${scanResult.success ? colors.success : scanResult.type === 'warning' ? colors.warning : colors.error}`,
                            marginBottom: '24px'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: scanResult.success ? '12px' : '0'
                        }}>
                            {scanResult.success ? (
                                <FiCheckCircle size={32} color={colors.success} />
                            ) : scanResult.type === 'warning' ? (
                                <FiAlertCircle size={32} color={colors.warning} />
                            ) : (
                                <FiXCircle size={32} color={colors.error} />
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: scanResult.success ? colors.success : scanResult.type === 'warning' ? colors.warning : colors.error,
                                    marginBottom: '4px'
                                }}>
                                    {scanResult.success ? 'Success!' : scanResult.type === 'warning' ? 'Already Scanned' : 'Scan Failed'}
                                </div>
                                <div style={{ fontSize: '14px', color: colors.text }}>
                                    {scanResult.message}
                                </div>
                            </div>
                        </div>

                        {scanResult.success && scanResult.scanRecord && (
                            <div style={{
                                padding: '12px',
                                background: isDark ? '#0f172a' : '#f8fafc',
                                borderRadius: '8px',
                                fontSize: '13px',
                                color: colors.textMuted
                            }}>
                                <div><strong>Route:</strong> {scanResult.scanRecord.routeName}</div>
                                <div><strong>Type:</strong> {scanResult.scanRecord.tripType}</div>
                                <div><strong>Time:</strong> {scanResult.scanRecord.scanTime}</div>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setScanResult(null);
                                setScanning(false);
                            }}
                            style={{
                                marginTop: '16px',
                                width: '100%',
                                padding: '10px',
                                background: '#6366f1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Scan Another
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Today's Scan Summary */}
            {!scanning && todaysScans.length > 0 && (
                <div style={{
                    padding: '16px',
                    background: isDark ? '#0f172a' : '#f8fafc',
                    borderRadius: '12px',
                    border: `1px solid ${colors.border}`
                }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '12px' }}>
                        Today's Scans: {todaysScans.length}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ textAlign: 'center', padding: '12px', background: isDark ? '#1e293b' : '#ffffff', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
                                {todaysScans.filter(s => s.tripType === 'PICKUP').length}
                            </div>
                            <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '4px' }}>Pickups</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '12px', background: isDark ? '#1e293b' : '#ffffff', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
                                {todaysScans.filter(s => s.tripType === 'DROP').length}
                            </div>
                            <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '4px' }}>Drops</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
