import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const SystemSettings = () => {
    const toast = useToast();

    return (
        <>
            <h4 className="mb-3">System</h4>

            <div className="d-flex gap-2">
                <button
                    className="btn btn-outline-primary"
                    onClick={() => toast.warning('Backend not connected')}
                >
                    <Download size={16} className="me-2" />
                    Backup Database
                </button>

                <button
                    className="btn btn-danger"
                    onClick={() => {
                        if (window.confirm('Clear cache?')) {
                            toast.warning('Backend not connected');
                        }
                    }}
                >
                    <Trash2 size={16} className="me-2" />
                    Clear Cache
                </button>
            </div>
        </>
    );
};

export default SystemSettings;
