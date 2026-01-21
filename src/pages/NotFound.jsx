import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            color: '#0f172a',
            fontFamily: "'Inter', sans-serif",
            textAlign: 'center',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.1)',
                    padding: '60px 40px',
                    borderRadius: '24px',
                    maxWidth: '500px',
                    width: '100%'
                }}
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: '72px', fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '16px' }}
                >
                    404
                </motion.div>

                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: '#1e293b' }}>Page Not Found</h2>
                <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            background: 'white',
                            color: '#475569',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '15px'
                        }}
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '15px',
                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                        }}
                    >
                        <Home size={18} />
                        Home
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
