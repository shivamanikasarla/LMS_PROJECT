import axios from 'axios';

const API_BASE_URL = '/api/fee';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Create axios instance with interceptors
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ============================================
// FEE SETTINGS API
// ============================================

export const getFeeSettings = async () => {
    try {
        const response = await apiClient.get('/settings');
        return response.data;
    } catch (error) {
        console.error('Error fetching fee settings:', error);
        throw error;
    }
};

export const saveFeeSettings = async (settings) => {
    try {
        const response = await apiClient.post('/settings', settings);
        return response.data;
    } catch (error) {
        console.error('Error saving fee settings:', error);
        throw error;
    }
};

// ============================================
// AUDIT LOG API
// ============================================

export const getAuditLogs = async (params = {}) => {
    try {
        const response = await apiClient.get('/audit-logs', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        throw error;
    }
};

export const createAuditLog = async (logData) => {
    try {
        const response = await apiClient.post('/audit-logs', logData);
        return response.data;
    } catch (error) {
        console.error('Error creating audit log:', error);
        throw error;
    }
};

export const exportAuditLogs = async (format = 'csv', params = {}) => {
    try {
        const response = await apiClient.get('/audit-logs/export', {
            params: { ...params, format },
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error exporting audit logs:', error);
        throw error;
    }
};

// ============================================
// BATCH INTEGRATION API
// ============================================

export const getAllBatches = async () => {
    try {
        const response = await apiClient.get('/batches');
        return response.data;
    } catch (error) {
        console.error('Error fetching batches:', error);
        throw error;
    }
};

export const getBatchesByCourse = async (courseId) => {
    try {
        const response = await apiClient.get(`/batches/course/${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching batches by course:', error);
        throw error;
    }
};

export const createBatchFee = async (batchId, feeData) => {
    try {
        const response = await apiClient.post(`/batch/${batchId}`, feeData);
        return response.data;
    } catch (error) {
        console.error('Error creating batch fee:', error);
        throw error;
    }
};

export const getBatchFees = async (batchId) => {
    try {
        const response = await apiClient.get(`/batch/${batchId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching batch fees:', error);
        throw error;
    }
};

// ============================================
// STUDENTS API
// ============================================

export const getAllStudents = async () => {
    try {
        const response = await apiClient.get('/students');
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

export const getStudentById = async (studentId) => {
    try {
        const response = await apiClient.get(`/student/${studentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student:', error);
        throw error;
    }
};

export const getStudentsByBatch = async (batchId) => {
    try {
        const response = await apiClient.get(`/batches/${batchId}/students`);
        return response.data;
    } catch (error) {
        console.error('Error fetching students by batch:', error);
        throw error;
    }
};

// ============================================
// REFUNDS API
// ============================================

export const getAllRefunds = async () => {
    try {
        const response = await apiClient.get('/refunds');
        return response.data;
    } catch (error) {
        console.error('Error fetching refunds:', error);
        throw error;
    }
};

export const createRefund = async (refundData) => {
    try {
        const response = await apiClient.post('/refunds', refundData);
        return response.data;
    } catch (error) {
        console.error('Error creating refund:', error);
        throw error;
    }
};

export const deleteRefund = async (refundId) => {
    try {
        const response = await apiClient.delete(`/refunds/${refundId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting refund:', error);
        throw error;
    }
};

// ============================================
// PAYMENTS API
// ============================================

export const getAllPayments = async () => {
    try {
        const response = await apiClient.get('/payments');
        return response.data;
    } catch (error) {
        console.error('Error fetching payments:', error);
        throw error;
    }
};

export const getPaymentsByStudent = async (studentId) => {
    try {
        const response = await apiClient.get(`/payments/student/${studentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student payments:', error);
        throw error;
    }
};

export const createPayment = async (paymentData) => {
    try {
        const response = await apiClient.post('/payments', paymentData);
        return response.data;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};

// ============================================
// INSTALLMENTS API
// ============================================

export const getAllInstallments = async () => {
    try {
        const response = await apiClient.get('/installments');
        return response.data;
    } catch (error) {
        console.error('Error fetching installments:', error);
        throw error;
    }
};

export const getStudentInstallments = async (studentId) => {
    try {
        const response = await apiClient.get(`/student/${studentId}/installments`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student installments:', error);
        throw error;
    }
};

export const createInstallmentPlan = async (studentId, planData) => {
    try {
        const response = await apiClient.post(`/student/${studentId}/installments`, planData);
        return response.data;
    } catch (error) {
        console.error('Error creating installment plan:', error);
        throw error;
    }
};

// ============================================
// CREATE FEE API
// ============================================

export const createFee = async (feeData) => {
    try {
        const response = await apiClient.post('/create', feeData);
        return response.data;
    } catch (error) {
        console.error('Error creating fee:', error);
        throw error;
    }
};

export const getStudentFee = async (studentId) => {
    try {
        const response = await apiClient.get(`/student/${studentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student fee:', error);
        throw error;
    }
};

// ============================================
// DASHBOARD/REPORTS API
// ============================================

export const getDashboardStats = async () => {
    try {
        const response = await apiClient.get('/dashboard/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};

export const getCollectionReport = async (params = {}) => {
    try {
        const response = await apiClient.get('/reports/collection', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching collection report:', error);
        throw error;
    }
};

export default {
    // Settings
    getFeeSettings,
    saveFeeSettings,

    // Audit Logs
    getAuditLogs,
    createAuditLog,
    exportAuditLogs,

    // Batches
    getAllBatches,
    getBatchesByCourse,
    createBatchFee,
    getBatchFees,

    // Students
    getAllStudents,
    getStudentById,
    getStudentsByBatch,

    // Refunds
    getAllRefunds,
    createRefund,
    deleteRefund,

    // Payments
    getAllPayments,
    getPaymentsByStudent,
    createPayment,

    // Installments
    getAllInstallments,
    getStudentInstallments,
    createInstallmentPlan,

    // Fee Creation
    createFee,
    getStudentFee,

    // Dashboard
    getDashboardStats,
    getCollectionReport,
};
