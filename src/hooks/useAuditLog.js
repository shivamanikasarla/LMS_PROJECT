import { createAuditLog } from '../services/feeService';

/**
 * Custom hook for creating audit logs
 * Makes it easy to log admin operations throughout the app
 */
const useAuditLog = () => {
    const logAction = async (action, details = {}) => {
        try {
            // Get current user info from localStorage
            const userEmail = localStorage.getItem('userEmail') || 'Unknown Admin';
            const userId = localStorage.getItem('userId') || null;

            const logData = {
                action,
                adminEmail: userEmail,
                adminId: userId ? parseInt(userId) : 1, // Default to 1 (Admin) if null to prevent 500 errors
                timestamp: new Date().toISOString(),
                details: typeof details === 'string' ? details : JSON.stringify(details),
                module: 'FEE_MANAGEMENT',
                ...details
            };

            await createAuditLog(logData);
            console.log('✅ Audit log created:', action);
        } catch (error) {
            console.error('❌ Failed to create audit log:', error);
            // Don't throw - audit logging should not break the main operation
        }
    };

    return { logAction };
};

export default useAuditLog;
