import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect
} from 'react';
import {
    X,
    CheckCircle,
    AlertCircle,
    Info,
    AlertTriangle
} from 'lucide-react';

/* =========================
   CONTEXT
   ========================= */

const ToastContext = createContext(null);

const TOAST_TYPES = ['success', 'error', 'info', 'warning'];

/* =========================
   PROVIDER
   ========================= */

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    /* ---------- CLEANUP ---------- */
    useEffect(() => {
        return () => {
            Object.values(timers.current).forEach(clearTimeout);
        };
    }, []);

    /* ---------- REMOVE ---------- */
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
        if (timers.current[id]) {
            clearTimeout(timers.current[id]);
            delete timers.current[id];
        }
    }, []);

    /* ---------- ADD ---------- */
    const addToast = useCallback((message, type, duration = 3000) => {
        if (!TOAST_TYPES.includes(type)) {
            type = 'info';
        }

        const id = crypto.randomUUID();

        setToasts(prev => [...prev, { id, message, type }]);

        timers.current[id] = setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);

    /* ---------- SAFE API ---------- */
    const api = {
        success: (msg, d) => addToast(msg, 'success', d),
        error: (msg, d) => addToast(msg, 'error', d),
        info: (msg, d) => addToast(msg, 'info', d),
        warning: (msg, d) => addToast(msg, 'warning', d),
        remove: removeToast
    };

    return (
        <ToastContext.Provider value={api}>
            {children}

            {/* ---------- UI ---------- */}
            <div
                className="toast-container position-fixed top-0 end-0 p-3"
                style={{ zIndex: 1100 }}
            >
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className="toast show mb-2 border-0 shadow-sm animate-fade-in"
                        style={{
                            background: '#fff',
                            minWidth: 300,
                            borderLeft: `4px solid ${t.type === 'success' ? '#198754' :
                                    t.type === 'error' ? '#dc3545' :
                                        t.type === 'warning' ? '#ffc107' :
                                            '#0d6efd'
                                }`
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <div className="toast-body d-flex align-items-center gap-2">
                                {t.type === 'success' && <CheckCircle size={20} className="text-success" />}
                                {t.type === 'error' && <AlertCircle size={20} className="text-danger" />}
                                {t.type === 'warning' && <AlertTriangle size={20} className="text-warning" />}
                                {t.type === 'info' && <Info size={20} className="text-primary" />}
                                <span>{t.message}</span>
                            </div>

                            <button
                                className="btn-close me-2"
                                onClick={() => removeToast(t.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

/* =========================
   HOOK
   ========================= */

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used inside ToastProvider');
    }
    return ctx;
};
