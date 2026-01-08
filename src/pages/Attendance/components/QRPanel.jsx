import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import { useAttendanceStore } from '../store/attendanceStore';
import { getTimeRemaining } from '../utils/qrTimer';

const QRPanel = () => {
    const { session, refreshQR } = useAttendanceStore();
    const [timeLeft, setTimeLeft] = useState(0);

    /* ---------------- COUNTDOWN ---------------- */

    useEffect(() => {
        if (!session?.qrData?.expiresAt) return;

        const update = () => {
            setTimeLeft(getTimeRemaining(session.qrData.expiresAt));
        };

        update(); // immediate update
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [session?.qrData?.expiresAt]);

    /* ---------------- HELPERS ---------------- */

    const formatTime = (ms) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    if (!session?.qrData) {
        return (
            <div className="text-muted text-center py-4">
                Waiting for QR initialization…
            </div>
        );
    }

    const isExpired = timeLeft === 0;
    const isCritical = timeLeft > 0 && timeLeft <= 10000; // last 10s
    const canRefresh = session.status === 'LIVE' && session.mode === 'QR';

    /* ---------------- RENDER ---------------- */

    return (
        <div className="text-center">
            <h5 className="mb-3 fw-bold text-dark">Scan to Check-in</h5>

            {/* QR */}
            <div className="position-relative d-inline-block p-3 bg-white rounded-3 shadow-sm border mb-3">
                <div
                    style={{
                        filter: isExpired ? 'blur(4px)' : 'none',
                        opacity: isExpired ? 0.5 : 1,
                        transition: 'all 0.3s'
                    }}
                >
                    <QRCodeSVG value={session.qrData.token} size={200} level="H" />
                </div>

                {isExpired && (
                    <div className="position-absolute top-50 start-50 translate-middle text-danger bg-white p-2 rounded shadow-sm border">
                        <AlertTriangle size={22} className="mb-1 d-block mx-auto" />
                        <strong>Expired</strong>
                    </div>
                )}
            </div>

            {/* Timer */}
            <div className="mb-3">
                <div
                    className={`d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill fw-bold ${isExpired
                            ? 'bg-danger text-white'
                            : isCritical
                                ? 'bg-warning text-dark'
                                : 'bg-light text-primary'
                        }`}
                >
                    <Clock size={16} />
                    <span className="font-monospace fs-5">
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Refresh */}
            <button
                className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2"
                onClick={refreshQR}
                disabled={!canRefresh}
            >
                <RefreshCw size={14} />
                Force Refresh
            </button>

            <p className="text-muted x-small mt-3 mb-0">
                Auto-refresh every {session.settings?.expiryMinutes} minutes
            </p>
        </div>
    );
};

export default QRPanel;
