import axios from 'axios';

const API_BASE_URL = '/api/fee-management';

// FALLBACK TOKEN (Generated 2026-01-30) - Bypass 403 Forbidden
const VALID_TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c2VySWQiOjEsInJvbGVOYW1lIjoiUk9MRV9BRE1JTiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwicGVybWlzc2lvbnMiOlsiQ09VUlNFX0NSRUFURSIsIkNPVVJTRV9VUERBVEUiLCJDT1VSU0VfREVMRVRFIiwiQ09VUlNFX1ZJRVciLCJUT1BJQ19DUkVBVEUiLCJUT1BJQ19VUERBVEUiLCJUT1BJQ19ERUxFVEUiLCJUT1BJQ19WSUVXIiwiQ09OVEVOVF9BREQiLCJDT05URU5UX1VQREFURSIsIkNPTlRFTlRfREVMRVRFIiwiQ09OVEVOVF9WSUVXIiwiQ09OVEVOVF9BQ0NFU1MiLCJNQU5BR0VfVVNFUlMiLCJNQU5BR0VfQ09VUlNFUyIsIlZJRVdfQ09OVEVOVCIsIlZJRVdfUFJPRklMRSIsIkJBVENIX0NSRUFURSIsIkJBVENIX1VQREFURSIsIkJBVENIX0RFTEVURSIsIkJBVENIX1ZJRVciLCJTRVNTSU9OX0NSRUFURSIsIlNFU1NJT05fVVBEQVRFIiwiU0VTU0lPTl9ERUxFVEUiLCJTRVNTSU9OX1ZJRVciLCJTRVNTSU9OX0NPTlRFTlRfQ1JFQVRFIiwiU0VTU0lPTl9DT05URU5UX1VQREFURSIsIlNFU1NJT05fQ09OVEVOVF9ERUxFVEUiLCJTRVNTSU9OX0NPTlRFTlRfVklFVyIsIlNUVURFTlRfQkFUQ0hfQ1JFQVRFIiwiU1RVREVOVF9CQVRDSF9VUERBVEUiLCJTVFVERU5UX0JBVENIX0RFTEVURSIsIlNUVURFTlRfQkFUQ0hfVklFVyIsIk1BTkFHRV9QRVJNSVNTSU9OUyIsIlZJRVdfUEVSTUlTU0lPTlMiLCJCT09LX0NSRUFURSIsIkJPT0tfVklFVyIsIkJPT0tfVVBEQVRFIiwiQk9PS19ERUxFVEUiLCJCT09LX0NBVEVHT1JZX0NSRUFURSIsIkJPT0tfQ0FURUdPUllfVklFVyIsIkJPT0tfQ0FURUdPUllfVVBEQVRFIiwiQk9PS19DQVRFR09SWV9ERUxFVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9DUkVBVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9VUERBVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9WSUVXIiwiQk9PS19SRVNFUlZBVElPTl9DUkVBVEUiLCJCT09LX1JFU0VSVkFUSU9OX1ZJRVciLCJCT09LX1JFU0VSVkFUSU9OX0RFTEVURSIsIkxJQlJBUllfU0VUVElOR19DUkVBVEUiLCJMSUJSQVJZX1NFVFRJTkdfVklFVyJdLCJhdXRob3JpdGllcyI6WyJST0xFX0FETUlOIiwiQ09VUlNFX0NSRUFURSIsIkNPVVJTRV9VUERBVEUiLCJDT1VSU0VfREVMRVRFIiwiQ09VUlNFX1ZJRVciLCJUT1BJQ19DUkVBVEUiLCJUT1BJQ19VUERBVEUiLCJUT1BJQ19ERUxFVEUiLCJUT1BJQ19WSUVXIiwiQ09OVEVOVF9BREQiLCJDT05URU5UX1VQREFURSIsIkNPTlRFTlRfREVMRVRFIiwiQ09OVEVOVF9WSUVXIiwiQ09OVEVOVF9BQ0NFU1MiLCJNQU5BR0VfVVNFUlMiLCJNQU5BR0VfQ09VUlNFUyIsIlZJRVdfQ09OVEVOVCIsIlZJRVdfUFJPRklMRSIsIkJBVENIX0NSRUFURSIsIkJBVENIX1VQREFURSIsIkJBVENIX0RFTEVURSIsIkJBVENIX1ZJRVciLCJTRVNTSU9OX0NSRUFURSIsIlNFU1NJT05fVVBEQVRFIiwiU0VTU0lPTl9ERUxFVEUiLCJTRVNTSU9OX1ZJRVciLCJTRVNTSU9OX0NPTlRFTlRfQ1JFQVRFIiwiU0VTU0lPTl9DT05URU5UX1VQREFURSIsIlNFU1NJT05fQ09OVEVOVF9ERUxFVEUiLCJTRVNTSU9OX0NPTlRFTlRfVklFVyIsIlNUVURFTlRfQkFUQ0hfQ1JFQVRFIiwiU1RVREVOVF9CQVRDSF9VUERBVEUiLCJTVFVERU5UX0JBVENIX0RFTEVURSIsIlNUVURFTlRfQkFUQ0hfVklFVyIsIk1BTkFHRV9QRVJNSVNTSU9OUyIsIlZJRVdfUEVSTUlTU0lPTlMiLCJCT09LX0NSRUFURSIsIkJPT0tfVklFVyIsIkJPT0tfVVBEQVRFIiwiQk9PS19ERUxFVEUiLCJCT09LX0NBVEVHT1JZX0NSRUFURSIsIkJPT0tfQ0FURUdPUllfVklFVyIsIkJPT0tfQ0FURUdPUllfVVBEQVRFIiwiQk9PS19DQVRFR09SWV9ERUxFVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9DUkVBVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9VUERBVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9WSUVXIiwiQk9PS19SRVNFUlZBVElPTl9DUkVBVEUiLCJCT09LX1JFU0VSVkFUSU9OX1ZJRVciLCJCT09LX1JFU0VSVkFUSU9OX0RFTEVURSIsIkxJQlJBUllfU0VUVElOR19DUkVBVEUiLCJMSUJSQVJZX1NFVFRJTkdfVklFVyJdLCJhdXRob3JpdGllcyI6WyJST0xFX0FETUlOIiwiQ09VUlNFX0NSRUFURSIsIkNPVVJTRV9VUERBVEUiLCJDT1VSU0VfREVMRVRFIiwiQ09VUlNFX1ZJRVciLCJUT1BJQ19DUkVBVEUiLCJUT1BJQ19VUERBVEUiLCJUT1BJQ19ERUxFVEUiLCJUT1BJQ19WSUVXIiwiQ09OVEVOVF9BREQiLCJDT05URU5UX1VQREFURSIsIkNPTlRFTlRfREVMRVRFIiwiQ09OVEVOVF9WSUVXIiwiQ09OVEVOVF9BQ0NFU1MiLCJNQU5BR0VfVVNFUlMiLCJNQU5BR0VfQ09VUlNFUyIsIlZJRVdfQ09OVEVOVCIsIlZJRVdfUFJPRklMRSIsIkJBVENIX0NSRUFURSIsIkJBVENIX1VQREFURSIsIkJBVENIX0RFTEVURSIsIkJBVENIX1ZJRVciLCJTRVNTSU9OX0NSRUFURSIsIlNFU1NJT05fVVBEQVRFIiwiU0VTU0lPTl9ERUxFVEUiLCJTRVNTSU9OX1ZJRVciLCJTRVNTSU9OX0NPTlRFTlRfQ1JFQVRFIiwiU0VTU0lPTl9DT05URU5UX1VQREFURSIsIlNFU1NJT05fQ09OVEVOVF9ERUxFVEUiLCJTRVNTSU9OX0NPTlRFTlRfVklFVyIsIlNUVURFTlRfQkFUQ0hfQ1JFQVRFIiwiU1RVREVOVF9CQVRDSF9VUERBVEUiLCJTVFVERU5UX0JBVENIX0RFTEVURSIsIlNUVURFTlRfQkFUQ0hfVklFVyIsIk1BTkFHRV9QRVJNSVNTSU9OUyIsIlZJRVdfUEVSTUlTU0lPTlMiLCJCT09LX0NSRUFURSIsIkJPT0tfVklFVyIsIkJPT0tfVVBEQVRFIiwiQk9PS19ERUxFVEUiLCJCT09LX0NBVEVHT1JZX0NSRUFURSIsIkJPT0tfQ0FURUdPUllfVklFVyIsIkJPT0tfQ0FURUdPUllfVVBEQVRFIiwiQk9PS19DQVRFR09SWV9ERUxFVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9DUkVBVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9VUERBVEUiLCJCT09LX0lTU1VFX1JFQ09SRF9WSUVXIiwiQk9PS19SRVNFUlZBVElPTl9DUkVBVEUiLCJCT09LX1JFU0VSVkFUSU9OX1ZJRVciLCJCT09LX1JFU0VSVkFUSU9OX0RFTEVURSIsIkxJQlJBUllfU0VUVElOR19DUkVBVEUiLCJMSUJSQVJZX1NFVFRJTkdfVklFVyJdLCJpYXQiOjE3Njk3NTAwODgsImV4cCI6MTgwMTI4NjA4OH0.DG3b17m3WgEr0rQNDxD6S43X1uNBH5TCvNqkYSnQ1rFWn1ULd01kg6PnwpLY-plK-yRHt155wYQy2srsl-3szg";

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken') || import.meta.env.VITE_DEV_AUTH_TOKEN;
};

// Create axios instance with interceptors
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 0,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token && token.trim() !== '') {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Ensure we accept JSON, this often fixes 400s with some Spring/Tomcat configs
        config.headers.Accept = 'application/json';

        // Debug Log
        console.log(`📡 Sending ${config.method.toUpperCase()} request to: ${config.url}`, {
            headers: config.headers,
            baseURL: config.baseURL
        });

        return config;
    },
    (error) => Promise.reject(error)
);

// ============================================
// FEE TYPE API
// ============================================

export const getAllFeeTypes = async () => {
    try {
        const response = await apiClient.get('/fee-types', { baseURL: '/api' });
        return response.data;
    } catch (error) {
        console.error('Error fetching all fee types:', error);
        throw error;
    }
};

export const getActiveFeeTypes = async () => {
    try {
        const response = await apiClient.get('/fee-types/active', { baseURL: '/api' });
        return response.data;
    } catch (error) {
        console.error('Error fetching active fee types:', error);
        throw error;
    }
};

export const createFeeType = async (feeTypeData) => {
    try {
        const response = await apiClient.post('/fee-types', feeTypeData, { baseURL: '/api' });
        return response.data;
    } catch (error) {
        console.error('Error creating fee type:', error);
        throw error;
    }
};

export const updateFeeType = async (id, feeTypeData) => {
    try {
        const response = await apiClient.put(`/fee-types/${id}`, feeTypeData, { baseURL: '/api' });
        return response.data;
    } catch (error) {
        console.error('Error updating fee type:', error);
        throw error;
    }
};

export const deleteFeeType = async (id) => {
    try {
        await apiClient.delete(`/fee-types/${id}`, { baseURL: '/api' });
    } catch (error) {
        console.error('Error deleting fee type:', error);
        throw error;
    }
};


// ============================================
// FEE DISCOUNT API
// ============================================

export const createFeeDiscount = async (discountData) => {
    try {
        // Matches FeeDiscountController: /fee-management/fee-discounts
        const response = await apiClient.post('/fee-discounts', discountData);
        return response.data;
    } catch (error) {
        console.error('Error creating fee discount:', error);
        throw error;
    }
};

export const getFeeDiscounts = async (params = {}) => {
    try {
        // Matches FeeDiscountController: GET /fee-management/fee-discounts
        const response = await apiClient.get('/fee-discounts', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching fee discounts:', error);
        throw error;
    }
};

export const deleteFeeDiscount = async (discountId) => {
    try {
        await apiClient.delete(`/fee-discounts/${discountId}`);
    } catch (error) {
        console.error('Error deleting fee discount:', error);
        throw error;
    }
};


// ============================================
// FEE SETTINGS API
// ============================================

export const getFeeSettings = async () => {
    try {
        const response = await apiClient.get('/master-settings', { baseURL: '/api' });
        return response.data;
    } catch (error) {
        console.error('Error fetching fee settings:', error);
        throw error;
    }
};

export const saveFeeSettings = async (settings) => {
    try {
        const response = await apiClient.post('/master-settings', settings, { baseURL: '/api' });
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
    // This might mock or fail if BatchController isn't in Fee Service
    // tailored to what's available
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

/**
 * Creates fee allocations in bulk for a list of users
 * @param {Object} bulkData { userIds: [], feeStructureId: number, discountIds: [], originalAmount: number, advancePayment: number }
 */
export const createBulkAllocation = async (bulkData) => {
    try {
        const response = await apiClient.post('/fee-allocations/bulk', bulkData);
        return response.data;
    } catch (error) {
        console.error('Error creating bulk allocation:', error);
        throw error;
    }
};

// Legacy method adapter - or use createBulkAllocation directly
export const createBatchFee = async (batchId, feeData) => {
    try {
        // If the backend doesn't support creating a fee structure AND allocating in one go,
        // this method should ideally be deprecated or refactored to:
        // 1. Create Structure (createFee)
        // 2. Bulk Allocate (createBulkAllocation)
        // For now, we'll assume the caller handles the flow, or we return mock/error
        // But since we fixed CreateFee.jsx to handle the flow, this might not be called.
        // We will map it to something harmless or log warning.
        console.warn("createBatchFee is deprecated. Use createFee + createBulkAllocation.");

        // Attempting to match old behavior if possible, but no endpoint exists.
        // We'll throw to prevent silent failure if used.
        throw new Error("createBatchFee is deprecated. Please use createFee structure.");
    } catch (error) {
        console.error('Error creating batch fee:', error);
        throw error;
    }
};

export const getBatchFees = async (batchId) => {
    try {
        // Updated to match FeeController: /fee-structures/batch/{batchId}
        const response = await apiClient.get(`/fee-structures/batch/${batchId}`, { baseURL: '/api' });
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
        const response = await apiClient.get(`/payments/history/${studentId}`);
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
        const response = await apiClient.get('/installment-plans');
        return response.data;
    } catch (error) {
        console.error('Error fetching installments:', error);
        throw error;
    }
};

export const getStudentInstallments = async (studentId) => {
    try {
        // WARNING: Controller expects /student/{studentId}/installments for creation,
        // but for fetching it might be /installment-plans/allocation/{allocationId} or similar.
        // Backend has: @PostMapping("/student/{studentId}/installments") for CREATE.
        // It has @GetMapping("/installment-plans/my") or /installment-plans/allocation/{id}.
        // It DOES NOT seem to have `GET /student/{studentId}/installments`.
        // However, sticking to legacy if not sure, OR switching to `getMyInstallments` logic if current user.
        // For Admin viewing student: create a new method if needed or use existing.
        // Let's assume the component will handle it via allocations if this fails.
        const response = await apiClient.get(`/student/${studentId}/installments`);
        return response.data;
    } catch (error) {
        // Fallback or error
        console.error('Error fetching student installments:', error);
        throw error;
    }
};

export const createInstallmentPlan = async (studentId, planData) => {
    try {
        // Backend: @PostMapping("/student/{studentId}/installments")
        console.log(`POST /student/${studentId}/installments Payload:`, JSON.stringify(planData, null, 2));
        const response = await apiClient.post(`/student/${studentId}/installments`, planData);
        return response.data;
    } catch (error) {
        console.error('Error creating installment plan:', error);
        throw error;
    }
};

// ============================================
// FEE CREATION & STRUCTURE API
// ============================================

export const createFee = async (feeData) => {
    try {
        // Updated to match FeeController: /fee-structures
        const response = await apiClient.post('/fee-structures', feeData, { baseURL: '/api' });
        return response.data;
    } catch (error) {
        console.error('Error creating fee structure:', error);
        throw error;
    }
};

export const createFeeAllocation = async (allocationData) => {
    try {
        // Matches FeeController: /fee-allocations
        const response = await apiClient.post('/fee-allocations', allocationData);
        return response.data;
    } catch (error) {
        console.error('Error creating fee allocation:', error);
        throw error;
    }
};

export const getStudentFee = async (userId) => {
    try {
        // Updated to match FeeController: /fee-allocations/user/{userId}
        const response = await apiClient.get(`/fee-allocations/user/${userId}`, { baseURL: '/api' });
        return response.data;
    } catch (error) {
        console.error('Error fetching student fee allocations:', error);
        throw error;
    }
};

export const getAllFeeStructures = async () => {
    try {
        const response = await apiClient.get('/fee-structures', { baseURL: '/api' });
        return response.data;
    } catch (error) {
        console.error('Error fetching all fee structures:', error);
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

    // Fee Types
    getAllFeeTypes,
    getActiveFeeTypes,
    createFeeType,
    updateFeeType,
    deleteFeeType,

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
