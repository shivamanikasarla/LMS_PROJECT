import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiX, FiDownload, FiPrinter } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StudentQRDisplay = ({ student, route, onClose }) => {
    const qrRef = useRef(null);

    // Generate unique content for the QR code
    // Format: STUDENT_ID|VEHICLE_ID|TIMESTAMP
    // This can be encrypted or customized based on backend requirements
    const qrContent = JSON.stringify({
        sid: student.id,
        vid: route?.id || student.vehicleId,
        nm: student.name,
        ts: Date.now()
    });

    const handleDownload = () => {
        const svg = document.getElementById("student-qr-code");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = `QR_${student.name.replace(/\s+/g, '_')}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print QR Code</title>');
        printWindow.document.write('</head><body style="display:flex; justify-content:center; align-items:center; height:100vh; flex-direction:column; font-family:sans-serif;">');
        printWindow.document.write(`<h2>${student.name}</h2>`);
        printWindow.document.write(`<div style="margin: 20px;">${document.getElementById('qr-container').innerHTML}</div>`);
        printWindow.document.write(`<p>ID: ${student.id}</p>`);
        printWindow.document.write(`<p>Bus: ${route?.vehicleNumber || 'Assigned Bus'}</p>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
                background: 'white',
                padding: '32px',
                borderRadius: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}
        >
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    border: 'none',
                    background: '#f1f5f9',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b'
                }}
            >
                <FiX size={18} />
            </button>

            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#1e293b' }}>Transport Pass</h3>
            <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '14px' }}>Scan this code to mark attendance</p>

            <div
                id="qr-container"
                style={{
                    background: '#eff6ff',
                    padding: '24px',
                    borderRadius: '16px',
                    display: 'inline-block',
                    marginBottom: '24px',
                    border: '2px dashed #bfdbfe'
                }}
            >
                <QRCodeSVG
                    id="student-qr-code"
                    value={qrContent}
                    size={200}
                    level={"H"}
                    includeMargin={true}
                    imageSettings={{
                        src: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png", // Bus Icon
                        x: undefined,
                        y: undefined,
                        height: 40,
                        width: 40,
                        excavate: true,
                    }}
                />
            </div>

            <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0', fontSize: '18px', color: '#1e293b' }}>{student.name}</h4>
                <div style={{ display: 'inline-block', background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', marginTop: '8px', fontSize: '13px', fontWeight: '500', color: '#475569' }}>
                    ID: {student.id}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    onClick={handleDownload}
                    className="btn-secondary"
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        color: '#475569',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}
                >
                    <FiDownload /> Save
                </button>
                <button
                    onClick={handlePrint}
                    className="btn-primary"
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        border: 'none',
                        background: '#4f46e5',
                        color: 'white',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}
                >
                    <FiPrinter /> Print
                </button>
            </div>
        </motion.div>
    );
};

export default StudentQRDisplay;
