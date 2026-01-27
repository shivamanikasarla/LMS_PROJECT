// Base API URL - uses proxy configured in vite.config.js
const API_BASE_URL = "/transport";

// Get token from localStorage or sessionStorage
const getAuthToken = () => {
    // Debugging: Check all sources
    const local = localStorage.getItem('authToken');
    const session = sessionStorage.getItem('authToken');
    const env = import.meta.env.VITE_AUTH_TOKEN;

    console.groupCollapsed('🔐 Auth Token Debug');
    console.log('Local Storage:', local ? '✅ Found' : '❌ Empty');
    console.log('Session Storage:', session ? '✅ Found' : '❌ Empty');
    console.log('Env Var (VITE_AUTH_TOKEN):', env ? '✅ Found' : '❌ Empty/Undefined');
    console.groupEnd();

    // 1. Try localStorage/sessionStorage first (Active session)
    const storageToken = local || session;
    if (storageToken) {
        return storageToken;
    }

    // 2. Fallback to environment variable (Dev/Testing)
    if (env) {
        console.log('✅ Using environment token');
        return env;
    }

    console.error('🚨 CRITICAL: No auth token found in Storage OR Environment!');
    return null;
};

// Common headers for all requests
const getHeaders = () => {
    const token = getAuthToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
    };
    console.log('📤 Request headers:', { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : 'None' });
    return headers;
};

// Error handler with improved debugging
const handleResponse = async (response, requestUrl = '') => {
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }

        // Add connection-specific error messages
        if (response.status === 0 || !response.status) {
            errorMessage = `❌ Cannot connect to backend!\n\nPlease check:\n1. Backend is running\n2. Backend URL is correct in .env file\n3. Network connection\n\nRequested: ${requestUrl}`;
        } else if (response.status === 404) {
            errorMessage = `❌ API endpoint not found (404)\n\nEndpoint: ${requestUrl}\n\nMake sure your friend's backend has the correct endpoint.`;
        } else if (response.status === 401 || response.status === 403) {
            errorMessage = `❌ Authentication failed (${response.status})\n\nYou may need to add an auth token in the .env file.\n\n${errorMessage}`;
        }

        throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }
    return await response.text();
};

/* =====================================================
                     VEHICLE SERVICES
 * ===================================================== */

export const VehicleService = {
    // Get all vehicles
    getAllVehicles: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles`, {
                method: "GET",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            throw error;
        }
    },

    // Get vehicle by number
    getVehicleByNumber: async (vehicleNumber) => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleNumber}`, {
                method: "GET",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error fetching vehicle ${vehicleNumber}:`, error);
            throw error;
        }
    },

    // Add new vehicle
    addVehicle: async (vehicleData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(vehicleData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error adding vehicle:", error);
            throw error;
        }
    },

    // Update vehicle (full update)
    updateVehicle: async (vehicleNumber, vehicleData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleNumber}`, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(vehicleData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error updating vehicle ${vehicleNumber}:`, error);
            throw error;
        }
    },

    // Patch vehicle (partial update)
    patchVehicle: async (vehicleNumber, vehicleData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleNumber}`, {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify(vehicleData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error patching vehicle ${vehicleNumber}:`, error);
            throw error;
        }
    },

    // Delete vehicle
    deleteVehicle: async (vehicleNumber) => {
        try {
            const headers = getHeaders();
            console.log('🗑️ DELETE Request:', `${API_BASE_URL}/vehicles/${vehicleNumber}`);
            console.log('🔑 Headers being sent:', headers);

            const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleNumber}`, {
                method: "DELETE",
                headers: headers
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error deleting vehicle ${vehicleNumber}:`, error);
            throw error;
        }
    }
};

/* =====================================================
                     ROUTE SERVICES
 * ===================================================== */

export const RouteService = {
    // Get all routes
    getAllRoutes: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/routes`, {
                method: "GET",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error fetching routes:", error);
            throw error;
        }
    },

    // Get active routes only
    getActiveRoutes: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/routes/active`, {
                method: "GET",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error fetching active routes:", error);
            throw error;
        }
    },

    // Get route by code
    getRouteByCode: async (routeCode) => {
        try {
            const response = await fetch(`${API_BASE_URL}/routes/${routeCode}`, {
                method: "GET",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error fetching route ${routeCode}:`, error);
            throw error;
        }
    },

    // Add new route
    addRoute: async (routeData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/routes`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(routeData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error adding route:", error);
            throw error;
        }
    },

    // Update route (full update)
    updateRoute: async (routeCode, routeData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/routes/${routeCode}`, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(routeData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error updating route ${routeCode}:`, error);
            throw error;
        }
    },

    // Patch route (partial update)
    patchRoute: async (routeCode, routeData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/routes/${routeCode}`, {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify(routeData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error patching route ${routeCode}:`, error);
            throw error;
        }
    },

    // Delete route
    deleteRoute: async (routeCode) => {
        try {
            const response = await fetch(`${API_BASE_URL}/routes/${routeCode}`, {
                method: "DELETE",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error deleting route ${routeCode}:`, error);
            throw error;
        }
    }
};

/* =====================================================
                     DRIVER SERVICES
 * ===================================================== */

export const DriverService = {
    // Get all drivers
    getAllDrivers: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/drivers`, {
                method: "GET",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error fetching drivers:", error);
            throw error;
        }
    },

    // Get driver by ID
    getDriverById: async (driverId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
                method: "GET",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error fetching driver ${driverId}:`, error);
            throw error;
        }
    },

    // Add new driver
    addDriver: async (driverData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/drivers`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(driverData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error adding driver:", error);
            throw error;
        }
    },

    // Update driver (full update)
    updateDriver: async (driverId, driverData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(driverData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error updating driver ${driverId}:`, error);
            throw error;
        }
    },

    // Patch driver (partial update)
    patchDriver: async (driverId, driverData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify(driverData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error patching driver ${driverId}:`, error);
            throw error;
        }
    },

    // Delete driver
    deleteDriver: async (driverId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
                method: "DELETE",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error deleting driver ${driverId}:`, error);
            throw error;
        }
    }
};

/* =====================================================
                   CONDUCTOR SERVICES
 * ===================================================== */

export const ConductorService = {
    // Get all conductors
    getAllConductors: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/conductors`, {
                method: "GET",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error fetching conductors:", error);
            throw error;
        }
    },

    // Get active conductors
    getActiveConductors: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/conductors/active`, {
                method: "GET",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error fetching active conductors:", error);
            throw error;
        }
    },

    // Get conductor by ID
    getConductorById: async (conductorId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/conductors/${conductorId}`, {
                method: "GET",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error fetching conductor ${conductorId}:`, error);
            throw error;
        }
    },

    // Add new conductor
    addConductor: async (conductorData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/conductors`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(conductorData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error adding conductor:", error);
            throw error;
        }
    },

    // Update conductor (full update)
    updateConductor: async (conductorId, conductorData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/conductors/${conductorId}`, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(conductorData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error updating conductor ${conductorId}:`, error);
            throw error;
        }
    },

    // Patch conductor (partial update)
    patchConductor: async (conductorId, conductorData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/conductors/${conductorId}`, {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify(conductorData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error patching conductor ${conductorId}:`, error);
            throw error;
        }
    },

    // Delete conductor
    deleteConductor: async (conductorId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/conductors/${conductorId}`, {
                method: "DELETE",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error deleting conductor ${conductorId}:`, error);
            throw error;
        }
    }
};

/* =====================================================
                      GPS SERVICES
 * ===================================================== */

export const GPSService = {
    // Save GPS location
    saveLocation: async (gpsData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/gps`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(gpsData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error saving GPS location:", error);
            throw error;
        }
    },

    // Get latest location for a vehicle
    getLatestLocation: async (vehicleId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/gps/latest/${vehicleId}`, {
                method: "GET",
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error fetching latest location for vehicle ${vehicleId}:`, error);
            throw error;
        }
    }
};

/* =====================================================
                  ATTENDANCE SERVICES
 * ===================================================== */

export const AttendanceService = {
    // Mark attendance by QR code
    markAttendanceByQR: async (attendanceData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/attendance/qr/mark`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(attendanceData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error marking attendance by QR:", error);
            throw error;
        }
    },

    // Generate QR code for attendance
    generateQR: async (vehicleId, routeId, session) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/attendance/qr?vehicleId=${vehicleId}&routeId=${routeId}&session=${session}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${getAuthToken()}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to generate QR code: ${response.statusText}`);
            }

            // Return blob for image
            return await response.blob();
        } catch (error) {
            console.error("Error generating QR code:", error);
            throw error;
        }
    }
};

/* =====================================================
                   UTILITY FUNCTIONS
 * ===================================================== */

// Set auth token in localStorage
export const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

// Remove auth token
export const removeAuthToken = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getAuthToken();
};

// Export all services as a single object
export const TransportService = {
    Vehicle: VehicleService,
    Route: RouteService,
    Driver: DriverService,
    Conductor: ConductorService,
    GPS: GPSService,
    Attendance: AttendanceService,
    Auth: {
        setToken: setAuthToken,
        removeToken: removeAuthToken,
        isAuthenticated
    }
};

export default TransportService;
