import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(window.navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) {
        return (
            <div className="d-flex align-items-center text-success small fw-medium" title="System Online">
                <Wifi size={16} className="me-1" />
                <span>Online</span>
            </div>
        );
    }

    return (
        <div className="d-flex align-items-center text-danger small fw-medium bg-danger-subtle px-2 py-1 rounded" title="Offline Mode - Changes saved locally">
            <WifiOff size={16} className="me-1" />
            <span>Offline</span>
        </div>
    );
};

export default NetworkStatus;
