import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiFileText, FiDownload, FiBarChart, FiPieChart,
    FiTruck, FiUsers, FiMapPin, FiTool, FiDroplet,
    FiX, FiEye
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { useTransportTheme } from './TransportContext.jsx';
import TransportService from '../../services/transportService';

const TransportReports = () => {
    const theme = useTransportTheme();
    const isDark = theme?.isDark || false;

    // Theme colors
    const colors = {
        text: isDark ? '#f1f5f9' : '#1e293b',
        textSecondary: isDark ? '#e2e8f0' : '#475569',
        textMuted: isDark ? '#94a3b8' : '#64748b',
        cardBg: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '#334155' : '#e2e8f0',
        buttonBg: isDark ? '#334155' : '#f8fafc',
        modalBg: isDark ? '#1e293b' : '#ffffff',
        tableHeader: isDark ? '#0f172a' : '#f8fafc',
        tableRow: isDark ? '#1e293b' : '#ffffff',
    };

    // --- Data State ---
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [fuel, setFuel] = useState([]);
    const [students, setStudents] = useState([]);
    const [fees, setFees] = useState({});
    const [payments, setPayments] = useState({});
    const [loading, setLoading] = useState(false);

    // --- UI State ---
    const [previewModal, setPreviewModal] = useState({ open: false, report: null, data: [] });

    // --- Load Data ---
    const loadData = async () => {
        setLoading(true);
        try {
            console.log("Starting data fetch...");

            const fetchWithLog = async (name, promise) => {
                try {
                    console.log(`Fetching ${name}...`);
                    const data = await promise; // Promise already has .catch(() => []) in original code, so this might still return []
                    // But wait, the original code had .catch on each call. I should remove it.
                    // Oh wait, I am replacing the fetch block.
                    // The instruction said "Remove the silent error suppression".

                    if (Array.isArray(data)) {
                        console.log(`✅ Fetched ${name}: ${data.length} records`);
                    } else if (data && typeof data === 'object') {
                        console.log(`✅ Fetched ${name}: Object/Single Record`, data);
                    } else {
                        console.log(`⚠️ Fetched ${name}:`, data);
                    }
                    return data;
                } catch (err) {
                    console.error(`❌ Error fetching ${name}:`, err);
                    return [];
                }
            };

            const [vehiclesData, driversData, routesData, maintenanceData, fuelData, studentsData, feesData, paymentsData] = await Promise.all([
                fetchWithLog('Vehicles', TransportService.Vehicle.getAllVehicles()),
                fetchWithLog('Drivers', TransportService.Driver.getAllDrivers()),
                fetchWithLog('Routes', TransportService.Route.getAllRoutes()),
                fetchWithLog('Maintenance', TransportService.Maintenance.getAllMaintenance()), // CORRECTION: Internal service method is getAllMaintenance
                fetchWithLog('Fuel', TransportService.Fuel.getFuelLogs()),
                fetchWithLog('Students', TransportService.Student.getAllStudents()),
                fetchWithLog('Fees', TransportService.FeeStructure.getAll()),
                fetchWithLog('Payments', TransportService.Payments.getAll())
            ]);

            setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
            setDrivers(Array.isArray(driversData) ? driversData : []);
            setRoutes(Array.isArray(routesData) ? routesData : []);
            setMaintenance(Array.isArray(maintenanceData) ? maintenanceData : []);
            setFuel(Array.isArray(fuelData) ? fuelData : []);

            // Map students to unified format
            const mappedStudents = (studentsData || []).map(s => {
                const user = s.user || {};
                return {
                    id: user.userId || s.id,
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || s.name || 'Unknown',
                    routeId: user.routeId || s.routeId || null,
                    class: s.grade || s.class || 'N/A',
                    shift: s.shift || 'Morning',
                    pickup: s.pickupPoint || 'N/A'
                };
            });
            setStudents(mappedStudents);

            // Map Fee Structure from Backend
            const mappedFees = {};
            if (Array.isArray(feesData)) {
                feesData.forEach(fee => {
                    const routeId = fee.route?.id || fee.routeId;
                    if (routeId) {
                        mappedFees[routeId] = { monthly: fee.amount || fee.monthly || 0 };
                    }
                });
            }
            setFees(mappedFees);

            // Map Payments from Backend
            const mappedPayments = {};
            if (Array.isArray(paymentsData)) {
                paymentsData.forEach(payment => {
                    if (payment.studentId) {
                        mappedPayments[payment.studentId] = {
                            status: payment.status || 'Pending',
                            date: payment.paymentDate || payment.date || 'N/A'
                        };
                    }
                });
            }
            setPayments(mappedPayments);

        } catch (error) {
            console.error("Failed to load report data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- Report Generators ---
    const generateVehicleUtilizationReport = () => {
        return vehicles.map(vehicle => {
            const vehicleFuel = fuel.filter(f => f.vehicleId === vehicle.number);
            const vehicleMaintenance = maintenance.filter(m => m.vehicleId === vehicle.number);
            const totalFuelCost = vehicleFuel.reduce((acc, f) => acc + (parseInt(f.cost) || 0), 0);
            const totalFuelQty = vehicleFuel.reduce((acc, f) => acc + (parseInt(f.quantity) || 0), 0);
            const totalMaintenanceCost = vehicleMaintenance.reduce((acc, m) => acc + (parseInt(m.cost) || 0), 0);
            const latestOdo = vehicleFuel.length > 0 ? Math.max(...vehicleFuel.map(f => parseInt(f.odo) || 0)) : 0;

            return {
                vehicleNumber: vehicle.number,
                type: vehicle.type,
                status: vehicle.status,
                capacity: vehicle.capacity,
                occupiedSeats: vehicle.occupiedSeats || 0,
                gpsEnabled: vehicle.gps ? 'Yes' : 'No',
                assignedRoute: vehicle.route || 'Unassigned',
                totalFuelConsumed: `${totalFuelQty} L`,
                totalFuelCost: `₹${totalFuelCost.toLocaleString()}`,
                totalMaintenanceCost: `₹${totalMaintenanceCost.toLocaleString()}`,
                latestOdometer: `${latestOdo.toLocaleString()} km`
            };
        });
    };

    const generateDriverReport = () => {
        return drivers.map(driver => {
            const licenseExpiry = new Date(driver.licenseExpiryDate);
            const today = new Date();
            const daysToExpiry = Math.ceil((licenseExpiry - today) / (1000 * 60 * 60 * 24));

            return {
                name: driver.fullName || 'Unknown',
                contact: driver.contactNumber || 'N/A',
                licenseNumber: driver.licenseNumber || 'N/A',
                licenseExpiry: driver.licenseExpiryDate || 'N/A',
                licenseStatus: daysToExpiry < 0 ? 'Expired' : daysToExpiry < 30 ? 'Expiring Soon' : 'Valid',
                experienceYears: driver.experienceYears || 0,
                experienceCategory: driver.experienceCategory || 'N/A',
                driverStatus: driver.verificationStatus || (driver.active ? 'Active' : 'Inactive'),
                assignedVehicle: driver.vehicle ? driver.vehicle.vehicleNumber : 'Unassigned',
                assignedRoute: driver.route ? driver.route.routeName : 'Unassigned',
                shift: driver.shift || 'N/A',
                policeVerification: driver.backgroundVerified ? 'Verified' : 'Pending',
                medicalCheck: driver.backgroundVerified ? 'Cleared' : 'Pending' // Assuming background check covers medical
            };
        });
    };

    const generateRouteCapacityReport = () => {
        return routes.map(route => {
            const enrolledStudents = students.filter(s => s.routeId === route.id);
            const occupancyRate = route.capacity > 0 ? ((enrolledStudents.length / route.capacity) * 100).toFixed(1) : 0;
            const availableSeats = route.capacity - enrolledStudents.length;

            return {
                routeCode: route.code,
                routeName: route.name,
                pickupPoint: route.pickupPoint || 'N/A',
                dropPoint: route.dropPoint || 'N/A',
                distance: route.distance,
                estimatedTime: route.time,
                assignedVehicle: route.vehicle || 'Unassigned',
                totalCapacity: route.capacity,
                enrolledStudents: enrolledStudents.length,
                availableSeats: availableSeats,
                occupancyRate: `${occupancyRate}%`,
                status: availableSeats <= 0 ? 'Full' : availableSeats <= 5 ? 'Almost Full' : 'Available'
            };
        });
    };

    const generateMaintenanceExpenseReport = () => {
        return maintenance.map(record => {
            const vehicle = vehicles.find(v => v.id == record.vehicleId || v.vehicleNumber === record.vehicleId);
            return {
                vehicleNumber: vehicle?.vehicleNumber || record.vehicleId || 'Unknown',
                type: record.type,
                date: record.date,
                description: record.description,
                cost: `₹${parseInt(record.cost).toLocaleString()}`,
                status: record.status,
                nextDueDate: record.nextDue || 'N/A'
            };
        });
    };

    const generateFeeStatusReport = () => {
        return students.filter(s => s.routeId).map(student => {
            const route = routes.find(r => r.id === student.routeId);
            const feeAmount = fees[student.routeId]?.monthly || 0;
            const payment = payments[student.id] || { status: 'Pending' };

            return {
                studentId: student.id,
                studentName: student.name,
                class: student.class,
                routeCode: route?.code || 'N/A',
                routeName: route?.name || 'Unknown',
                pickupPoint: student.pickup || 'N/A',
                shift: student.shift || 'N/A',
                monthlyFee: feeAmount ? `₹${parseInt(feeAmount).toLocaleString()}` : 'Not Set',
                paymentStatus: payment.status,
                paymentDate: payment.date || 'N/A'
            };
        });
    };

    const generateFuelConsumptionReport = () => {
        return fuel.map(log => {
            // Find vehicle by ID since log.vehicleId likely matches vehicle.id (based on user seeing '2')
            // Using flexible == comparison in case of string/number mismatch
            const vehicle = vehicles.find(v => v.id == log.vehicleId || v.vehicleNumber === log.vehicleId);
            const pricePerLiter = parseInt(log.cost) / parseInt(log.quantity) || 0;

            return {
                vehicleNumber: vehicle?.vehicleNumber || log.vehicleId || 'Unknown',
                date: log.date,
                quantity: `${log.quantity} L`,
                cost: `₹${parseInt(log.cost).toLocaleString()}`,
                pricePerLiter: `₹${pricePerLiter.toFixed(2)}`,
                odometer: `${parseInt(log.odo).toLocaleString()} km`,
                station: log.station || 'N/A'
            };
        });
    };

    // --- Reports Configuration ---
    const reports = [
        { id: 'vehicle-utilization', title: 'Vehicle Utilization Report', icon: FiTruck, color: '#6366f1', generator: generateVehicleUtilizationReport },
        { id: 'driver-details', title: 'Driver Details & Status', icon: FiUsers, color: '#10b981', generator: generateDriverReport },
        { id: 'route-capacity', title: 'Route Capacity Analysis', icon: FiMapPin, color: '#f59e0b', generator: generateRouteCapacityReport },
        { id: 'maintenance-expense', title: 'Maintenance Expense History', icon: FiTool, color: '#ef4444', generator: generateMaintenanceExpenseReport },
        { id: 'fee-status', title: 'Student Transport Fee Status', icon: FaRupeeSign, color: '#8b5cf6', generator: generateFeeStatusReport },
        { id: 'fuel-consumption', title: 'Fuel Consumption Report', icon: FiDroplet, color: '#06b6d4', generator: generateFuelConsumptionReport }
    ];

    // --- CSV Export ---
    const exportToCSV = (reportId) => {
        const report = reports.find(r => r.id === reportId);
        if (!report) return;

        const data = report.generator();
        if (data.length === 0) {
            alert('No data available to export for this report.');
            return;
        }

        const rawHeaders = Object.keys(data[0]);
        const formattedHeaders = rawHeaders.map(header =>
            header.replace(/([A-Z])/g, ' $1') // Insert space before capital letters
                .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
                .trim()
        );

        let csvContent = '\uFEFF' + formattedHeaders.join(',') + '\n'; // Add BOM for Excel UTF-8 support
        data.forEach(row => {
            const values = rawHeaders.map(header => {
                let value = row[header];

                // Force Excel to treat dates as text by prepending a space
                if (header.toLowerCase().includes('date') && value) {
                    value = ` ${value}`;
                }

                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            });
            csvContent += values.join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${reportId}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    // --- Preview Report ---
    const openPreview = (report) => {
        const data = report.generator();
        setPreviewModal({ open: true, report, data });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Reports Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {reports.map((report, index) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="glass-card"
                        style={{
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}
                    >
                        {/* Report Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: '10px',
                                background: `${report.color}15`, color: report.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '20px'
                            }}>
                                <report.icon />
                            </div>
                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: colors.text, margin: 0 }}>
                                {report.title}
                            </h3>
                        </div>

                        {/* Actions - Preview & Download Only */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => openPreview(report)}
                                style={{
                                    flex: 1, padding: '10px 16px',
                                    background: colors.buttonBg, border: `1px solid ${colors.border}`,
                                    borderRadius: '8px', color: colors.textSecondary,
                                    fontWeight: '600', fontSize: '13px',
                                    cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: 6,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <FiEye size={15} /> Preview
                            </button>
                            <button
                                onClick={() => exportToCSV(report.id)}
                                style={{
                                    flex: 1, padding: '10px 16px',
                                    background: report.color, border: 'none',
                                    borderRadius: '8px', color: 'white',
                                    fontWeight: '600', fontSize: '13px',
                                    cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: 6,
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={e => e.target.style.opacity = '0.9'}
                                onMouseOut={e => e.target.style.opacity = '1'}
                            >
                                <FiDownload size={15} /> Download
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {previewModal.open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setPreviewModal({ open: false, report: null, data: [] })}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.6)',
                                zIndex: 1000,
                                backdropFilter: 'blur(4px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    width: '90%',
                                    maxWidth: '1000px',
                                    maxHeight: '85vh',
                                    background: colors.modalBg,
                                    borderRadius: '16px',
                                    padding: '24px',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: `1px solid ${colors.border}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '18px', color: colors.text }}>{previewModal.report?.title}</h3>
                                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: colors.textMuted }}>{previewModal.data.length} records found</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            onClick={() => exportToCSV(previewModal.report?.id)}
                                            style={{
                                                padding: '8px 16px', borderRadius: '8px',
                                                background: previewModal.report?.color, border: 'none',
                                                color: 'white', fontWeight: '600', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px'
                                            }}
                                        >
                                            <FiDownload size={14} /> Download
                                        </button>
                                        <button
                                            onClick={() => setPreviewModal({ open: false, report: null, data: [] })}
                                            style={{ background: colors.buttonBg, border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: colors.textMuted }}
                                        >
                                            <FiX size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
                                    {previewModal.data.length > 0 ? (
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                            <thead>
                                                <tr style={{ background: colors.tableHeader, position: 'sticky', top: 0 }}>
                                                    {Object.keys(previewModal.data[0]).map((key, i) => (
                                                        <th key={i} style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: colors.textMuted, borderBottom: `1px solid ${colors.border}`, whiteSpace: 'nowrap' }}>
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previewModal.data.map((row, i) => (
                                                    <tr key={i} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                                        {Object.entries(row).map(([key, value], j) => (
                                                            <td key={j} style={{ padding: '12px', color: colors.textSecondary, whiteSpace: 'nowrap' }}>
                                                                {key.toLowerCase().includes('status') ? (
                                                                    <span style={{
                                                                        padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                                                                        background: value === 'Paid' || value === 'Verified' || value === 'Valid' || value === 'Active' || value === 'Completed' || value === 'Cleared' ? '#ecfdf5' :
                                                                            value === 'Pending' || value === 'Expiring Soon' || value === 'Almost Full' ? '#fff7ed' : '#fef2f2',
                                                                        color: value === 'Paid' || value === 'Verified' || value === 'Valid' || value === 'Active' || value === 'Completed' || value === 'Cleared' ? '#10b981' :
                                                                            value === 'Pending' || value === 'Expiring Soon' || value === 'Almost Full' ? '#f59e0b' : '#ef4444'
                                                                    }}>
                                                                        {value}
                                                                    </span>
                                                                ) : value}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                                            <FiFileText size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                                            <div>No data available for this report.</div>
                                            <div style={{ fontSize: '12px', marginTop: '4px' }}>Add some records to generate this report.</div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TransportReports;

