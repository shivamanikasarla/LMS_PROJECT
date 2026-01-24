/**
 * TRANSPORT SERVICE USAGE EXAMPLES
 * 
 * This file demonstrates how to use the transportService.js
 * in your React components for the Transport module
 */

import TransportService from '../services/transportService';

// ============================================
// EXAMPLE 1: Using in VehicleManagement.jsx
// ============================================

// First, set the auth token (do this after login)
const handleLogin = async (token) => {
    TransportService.Auth.setToken(token);
    // Or directly:
    // import { setAuthToken } from '../services/transportService';
    // setAuthToken('your-token-here');
};

// Fetch all vehicles
const fetchVehicles = async () => {
    try {
        const vehicles = await TransportService.Vehicle.getAllVehicles();
        console.log('Vehicles:', vehicles);
        return vehicles;
    } catch (error) {
        console.error('Failed to fetch vehicles:', error.message);
    }
};

// Add new vehicle
const addNewVehicle = async (vehicleData) => {
    try {
        const newVehicle = await TransportService.Vehicle.addVehicle({
            vehicleNumber: "TN-01-AB-1234",
            vehicleType: "Bus",
            capacity: 50,
            occupiedSeats: 0,
            model: "Volvo",
            year: 2023,
            status: "Active"
        });
        console.log('Vehicle added:', newVehicle);
        return newVehicle;
    } catch (error) {
        console.error('Failed to add vehicle:', error.message);
    }
};

// Update vehicle
const updateVehicle = async (vehicleNumber, updatedData) => {
    try {
        const updated = await TransportService.Vehicle.updateVehicle(vehicleNumber, updatedData);
        console.log('Vehicle updated:', updated);
        return updated;
    } catch (error) {
        console.error('Failed to update vehicle:', error.message);
    }
};

// Delete vehicle
const deleteVehicle = async (vehicleNumber) => {
    try {
        const result = await TransportService.Vehicle.deleteVehicle(vehicleNumber);
        console.log('Vehicle deleted:', result);
        return result;
    } catch (error) {
        console.error('Failed to delete vehicle:', error.message);
    }
};

// ============================================
// EXAMPLE 2: Using in RouteManagement.jsx
// ============================================

// Fetch all routes
const fetchRoutes = async () => {
    try {
        const routes = await TransportService.Route.getAllRoutes();
        return routes;
    } catch (error) {
        console.error('Failed to fetch routes:', error.message);
    }
};

// Add new route
const addNewRoute = async () => {
    try {
        const routeData = {
            routeName: "Route 1",
            startPoint: "College",
            endPoint: "City Center",
            stops: ["Stop 1", "Stop 2", "Stop 3"],
            distance: 15.5,
            estimatedTime: "45 mins",
            isActive: true
        };
        const newRoute = await TransportService.Route.addRoute(routeData);
        return newRoute;
    } catch (error) {
        console.error('Failed to add route:', error.message);
    }
};

// ============================================
// EXAMPLE 3: Using in DriverManagement.jsx
// ============================================

// Fetch all drivers
const fetchDrivers = async () => {
    try {
        const drivers = await TransportService.Driver.getAllDrivers();
        return drivers;
    } catch (error) {
        console.error('Failed to fetch drivers:', error.message);
    }
};

// Add new driver
const addNewDriver = async () => {
    try {
        const driverData = {
            name: "John Doe",
            email: "john@example.com",
            phone: "1234567890",
            licenseNumber: "DL123456",
            experience: 5,
            status: "Active"
        };
        const newDriver = await TransportService.Driver.addDriver(driverData);
        return newDriver;
    } catch (error) {
        console.error('Failed to add driver:', error.message);
    }
};

// ============================================
// EXAMPLE 4: Using in LiveTracking.jsx
// ============================================

// Save GPS location
const saveGPSLocation = async (vehicleId, latitude, longitude) => {
    try {
        const gpsData = {
            vehicleId: vehicleId,
            latitude: latitude,
            longitude: longitude,
            timestamp: new Date().toISOString()
        };
        const result = await TransportService.GPS.saveLocation(gpsData);
        return result;
    } catch (error) {
        console.error('Failed to save GPS location:', error.message);
    }
};

// Get latest vehicle location
const getVehicleLocation = async (vehicleId) => {
    try {
        const location = await TransportService.GPS.getLatestLocation(vehicleId);
        console.log('Latest location:', location);
        return location;
    } catch (error) {
        console.error('Failed to get vehicle location:', error.message);
    }
};

// ============================================
// EXAMPLE 5: QR Attendance
// ============================================

// Generate QR code for attendance
const generateAttendanceQR = async (vehicleId, routeId, session) => {
    try {
        const qrBlob = await TransportService.Attendance.generateQR(vehicleId, routeId, session);
        // Convert blob to URL for display
        const qrUrl = URL.createObjectURL(qrBlob);
        console.log('QR Code URL:', qrUrl);
        return qrUrl;
    } catch (error) {
        console.error('Failed to generate QR code:', error.message);
    }
};

// Mark attendance by QR
const markAttendance = async (attendanceData) => {
    try {
        const result = await TransportService.Attendance.markAttendanceByQR({
            vehicleId: 1,
            routeId: 1,
            studentId: 123,
            date: new Date().toISOString(),
            session: "Morning"
        });
        console.log('Attendance marked:', result);
        return result;
    } catch (error) {
        console.error('Failed to mark attendance:', error.message);
    }
};

// ============================================
// EXAMPLE 6: React Component Integration
// ============================================

/*
import React, { useState, useEffect } from 'react';
import TransportService from '../services/transportService';

const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await TransportService.Vehicle.getAllVehicles();
            setVehicles(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVehicle = async (vehicleData) => {
        try {
            await TransportService.Vehicle.addVehicle(vehicleData);
            loadVehicles(); // Refresh list
        } catch (err) {
            alert('Failed to add vehicle: ' + err.message);
        }
    };

    const handleDeleteVehicle = async (vehicleNumber) => {
        if (window.confirm('Are you sure?')) {
            try {
                await TransportService.Vehicle.deleteVehicle(vehicleNumber);
                loadVehicles(); // Refresh list
            } catch (err) {
                alert('Failed to delete vehicle: ' + err.message);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {vehicles.map(vehicle => (
                <div key={vehicle.vehicleNumber}>
                    <h3>{vehicle.vehicleNumber}</h3>
                    <button onClick={() => handleDeleteVehicle(vehicle.vehicleNumber)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};
*/

export {
    fetchVehicles,
    addNewVehicle,
    updateVehicle,
    deleteVehicle,
    fetchRoutes,
    fetchDrivers,
    saveGPSLocation,
    getVehicleLocation,
    generateAttendanceQR,
    markAttendance
};
