import axios from 'axios';

const API_BASE_URL = '/api/transport';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Create axios instance with interceptors
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
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
// VEHICLE MANAGEMENT
// ============================================

export const getAllVehicles = async () => {
    try {
        const response = await apiClient.get('/vehicles');
        return response.data;
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }
};

export const createVehicle = async (vehicleData) => {
    try {
        const response = await apiClient.post('/vehicles', vehicleData);
        return response.data;
    } catch (error) {
        console.error('Error creating vehicle:', error);
        throw error;
    }
};

export const updateVehicle = async (id, vehicleData) => {
    try {
        const response = await apiClient.put(`/vehicles/${id}`, vehicleData);
        return response.data;
    } catch (error) {
        console.error('Error updating vehicle:', error);
        throw error;
    }
};

export const deleteVehicle = async (id) => {
    try {
        const response = await apiClient.delete(`/vehicles/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        throw error;
    }
};

// ============================================
// ROUTE MANAGEMENT
// ============================================

export const getAllRoutes = async () => {
    try {
        const response = await apiClient.get('/routes');
        return response.data;
    } catch (error) {
        console.error('Error fetching routes:', error);
        throw error;
    }
};

export const createRoute = async (routeData) => {
    try {
        const response = await apiClient.post('/routes', routeData);
        return response.data;
    } catch (error) {
        console.error('Error creating route:', error);
        throw error;
    }
};

export const updateRoute = async (id, routeData) => {
    try {
        const response = await apiClient.put(`/routes/${id}`, routeData);
        return response.data;
    } catch (error) {
        console.error('Error updating route:', error);
        throw error;
    }
};

export const deleteRoute = async (id) => {
    try {
        const response = await apiClient.delete(`/routes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting route:', error);
        throw error;
    }
};

// ============================================
// DRIVER MANAGEMENT
// ============================================

export const getAllDrivers = async () => {
    try {
        const response = await apiClient.get('/drivers');
        return response.data;
    } catch (error) {
        console.error('Error fetching drivers:', error);
        throw error;
    }
};

export const createDriver = async (driverData) => {
    try {
        const response = await apiClient.post('/drivers', driverData);
        return response.data;
    } catch (error) {
        console.error('Error creating driver:', error);
        throw error;
    }
};

export const updateDriver = async (id, driverData) => {
    try {
        const response = await apiClient.put(`/drivers/${id}`, driverData);
        return response.data;
    } catch (error) {
        console.error('Error updating driver:', error);
        throw error;
    }
};

export const deleteDriver = async (id) => {
    try {
        const response = await apiClient.delete(`/drivers/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting driver:', error);
        throw error;
    }
};

// ============================================
// STUDENT MAPPING (BUS ASSIGNMENT)
// ============================================

export const getStudentTransportMappings = async () => {
    try {
        const response = await apiClient.get('/student-mappings');
        return response.data;
    } catch (error) {
        console.error('Error fetching student mappings:', error);
        throw error;
    }
};

export const assignStudentToBus = async (mappingData) => {
    try {
        const response = await apiClient.post('/student-mappings', mappingData);
        return response.data;
    } catch (error) {
        console.error('Error assigning student to bus:', error);
        throw error;
    }
};

// ============================================
// FUEL & MAINTENANCE
// ============================================

export const getFuelLogs = async () => {
    try {
        const response = await apiClient.get('/fuel-logs');
        return response.data;
    } catch (error) {
        console.error('Error fetching fuel logs:', error);
        throw error;
    }
};

export const addFuelLog = async (logData) => {
    try {
        const response = await apiClient.post('/fuel-logs', logData);
        return response.data;
    } catch (error) {
        console.error('Error adding fuel log:', error);
        throw error;
    }
};

export const getMaintenanceLogs = async () => {
    try {
        const response = await apiClient.get('/maintenance-logs');
        return response.data;
    } catch (error) {
        console.error('Error fetching maintenance logs:', error);
        throw error;
    }
};

export const addMaintenanceLog = async (logData) => {
    try {
        const response = await apiClient.post('/maintenance-logs', logData);
        return response.data;
    } catch (error) {
        console.error('Error adding maintenance log:', error);
        throw error;
    }
};

// ============================================
// STUDENT MANAGEMENT
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

export const updateStudent = async (id, studentData) => {
    try {
        const response = await apiClient.put(`/students/${id}`, studentData);
        return response.data;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};

// ============================================
// ATTENDANCE
// ============================================

export const getAttendance = async (date, routeId) => {
    try {
        const response = await apiClient.get('/attendance', { params: { date, routeId } });
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance:', error);
        throw error;
    }
};

export const markAttendance = async (attendanceData) => {
    try {
        const response = await apiClient.post('/attendance', attendanceData);
        return response.data;
    } catch (error) {
        console.error('Error marking attendance:', error);
        throw error;
    }
};

export default {
    Vehicle: {
        getAllVehicles,
        addVehicle: createVehicle,
        updateVehicle,
        deleteVehicle
    },
    Route: {
        getAllRoutes,
        createRoute,
        updateRoute,
        deleteRoute
    },
    Driver: {
        getAllDrivers,
        createDriver,
        updateDriver,
        deleteDriver
    },
    Student: {
        getAllStudents,
        updateStudent,
        getStudentTransportMappings,
        assignStudentToBus
    },
    Fuel: {
        getFuelLogs,
        addFuelLog
    },
    Maintenance: {
        getMaintenanceLogs,
        addMaintenanceLog
    },
    Attendance: {
        getAttendance,
        markAttendance
    }
};
