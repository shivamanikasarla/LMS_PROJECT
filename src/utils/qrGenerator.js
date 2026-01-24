import CryptoJS from 'crypto-js';

// Secret salt for security (in production, this should be environment variable)
const SECRET_SALT = 'LMS_TRANSPORT_QR_SECRET_2024';

/**
 * Generate secure QR data for a student
 * @param {Object} student - Student object with id, name, routeId, pickup, etc.
 * @param {string} tripType - 'PICKUP' or 'DROP'
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {Object} route - Route object with vehicle info
 * @returns {string} - Encrypted QR data string
 */
export const generateQRData = (student, tripType, date, route) => {
    // Validate inputs
    if (!student || !tripType || !date || !route) {
        throw new Error('Invalid QR generation parameters');
    }

    // Create payload
    const payload = {
        s: hashValue(student.id),              // Hashed student ID
        r: hashValue(student.routeId),         // Hashed route ID
        v: hashValue(route.vehicle || 'UNASSIGNED'), // Hashed vehicle ID
        t: tripType,                            // PICKUP or DROP
        d: date,                                // Valid date
        ts: Date.now(),                         // Timestamp
        sn: student.name.substring(0, 3).toUpperCase(), // Student name hint (first 3 chars)
    };

    // Generate security token
    payload.tk = generateSecurityToken(payload);

    // Convert to JSON string
    return JSON.stringify(payload);
};

/**
 * Validate QR data
 * @param {string} qrString - Scanned QR data string
 * @param {Array} students - Array of all students
 * @param {Array} routes - Array of all routes
 * @returns {Object} - { valid: boolean, data: Object, error: string }
 */
export const validateQRData = (qrString, students, routes) => {
    try {
        // Parse QR data
        const payload = JSON.parse(qrString);

        // Check required fields
        if (!payload.s || !payload.r || !payload.v || !payload.t || !payload.d || !payload.tk) {
            return { valid: false, error: 'Invalid QR format' };
        }

        // Verify security token
        const expectedToken = generateSecurityToken({
            s: payload.s,
            r: payload.r,
            v: payload.v,
            t: payload.t,
            d: payload.d,
            ts: payload.ts,
            sn: payload.sn
        });

        if (payload.tk !== expectedToken) {
            return { valid: false, error: 'QR code authentication failed - possible tampering' };
        }

        // Check date validity (must be today)
        const today = new Date().toISOString().split('T')[0];
        if (payload.d !== today) {
            return { valid: false, error: 'QR code expired - valid only for ' + payload.d };
        }

        // Find matching student
        const student = students.find(s =>
            hashValue(s.id) === payload.s &&
            hashValue(s.routeId) === payload.r
        );

        if (!student) {
            return { valid: false, error: 'Student not found or route mismatch' };
        }

        // Check if student transport is active
        if (student.status !== 'Active') {
            return { valid: false, error: 'Student transport is inactive' };
        }

        // Find matching route
        const route = routes.find(r => hashValue(r.id) === payload.r);
        if (!route) {
            return { valid: false, error: 'Route not found' };
        }

        // Verify vehicle matches
        const routeVehicle = route.vehicle || 'UNASSIGNED';
        if (hashValue(routeVehicle) !== payload.v) {
            return { valid: false, error: 'Vehicle mismatch - QR not valid for this vehicle' };
        }

        // Verify trip type matches student config
        if (payload.t === 'PICKUP' && student.pickup !== 'Yes') {
            return { valid: false, error: 'Student not configured for pickup' };
        }
        if (payload.t === 'DROP' && !student.pickup) {
            return { valid: false, error: 'Student not configured for drop' };
        }

        // All validations passed
        return {
            valid: true,
            data: {
                student,
                route,
                tripType: payload.t,
                date: payload.d,
                timestamp: payload.ts
            },
            error: null
        };

    } catch (error) {
        return { valid: false, error: 'Invalid QR code format' };
    }
};

/**
 * Generate security token using SHA-256
 * @param {Object} data - Data to hash
 * @returns {string} - Security token
 */
const generateSecurityToken = (data) => {
    const tokenString = `${data.s}-${data.r}-${data.v}-${data.t}-${data.d}-${data.ts}-${SECRET_SALT}`;
    return CryptoJS.SHA256(tokenString).toString();
};

/**
 * Hash a value using SHA-256
 * @param {string} value - Value to hash
 * @returns {string} - Hashed value (first 16 chars)
 */
const hashValue = (value) => {
    if (!value) return '';
    return CryptoJS.SHA256(value.toString()).toString().substring(0, 16);
};

/**
 * Check if student should have QR codes
 * @param {Object} student - Student object
 * @returns {Object} - { hasPickup: boolean, hasDrop: boolean }
 */
export const getStudentQRConfig = (student) => {
    const hasPickup = student.pickup === 'Yes' || student.pickup === true;
    // If pickup is specified, we assume drop exists unless explicitly set
    const hasDrop = student.routeId ? true : false;

    return { hasPickup, hasDrop };
};

/**
 * Check if QR can be scanned (not duplicate)
 * @param {Object} scanData - Scan validation result
 * @param {Array} existingScans - Array of existing scans for today
 * @returns {Object} - { canScan: boolean, reason: string }
 */
export const checkDuplicateScan = (scanData, existingScans) => {
    const today = new Date().toISOString().split('T')[0];

    // Check if already scanned for this trip type today
    const duplicateScan = existingScans.find(scan =>
        scan.studentId === scanData.student.id &&
        scan.tripType === scanData.tripType &&
        scan.date === today
    );

    if (duplicateScan) {
        return {
            canScan: false,
            reason: `Already scanned ${scanData.tripType.toLowerCase()} at ${duplicateScan.scanTime}`
        };
    }

    // If this is a DROP scan, check if PICKUP happened first
    if (scanData.tripType === 'DROP') {
        const pickupScan = existingScans.find(scan =>
            scan.studentId === scanData.student.id &&
            scan.tripType === 'PICKUP' &&
            scan.date === today
        );

        if (!pickupScan) {
            return {
                canScan: false,
                reason: 'Cannot mark drop - pickup not recorded yet'
            };
        }
    }

    return { canScan: true, reason: null };
};

/**
 * Record a QR scan
 * @param {Object} scanData - Validated scan data
 * @param {string} scannedBy - Name/ID of person who scanned
 * @returns {Object} - Scan record
 */
export const recordQRScan = (scanData, scannedBy = 'System') => {
    const scanRecord = {
        id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        studentId: scanData.student.id,
        studentName: scanData.student.name,
        routeId: scanData.route.id,
        routeName: scanData.route.name,
        vehicleId: scanData.route.vehicle || 'UNASSIGNED',
        tripType: scanData.tripType,
        date: scanData.date,
        scanTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
        scanTimestamp: Date.now(),
        scannedBy,
        scanMethod: 'QR'
    };

    // Save to localStorage
    const existingScans = JSON.parse(localStorage.getItem('lms_transport_qr_scans') || '[]');
    existingScans.push(scanRecord);
    localStorage.setItem('lms_transport_qr_scans', JSON.stringify(existingScans));

    return scanRecord;
};

/**
 * Get today's scans
 * @returns {Array} - Array of today's scans
 */
export const getTodaysScans = () => {
    const today = new Date().toISOString().split('T')[0];
    const allScans = JSON.parse(localStorage.getItem('lms_transport_qr_scans') || '[]');
    return allScans.filter(scan => scan.date === today);
};

/**
 * Initialize QR settings if not exists
 */
export const initializeQRSettings = () => {
    const settings = localStorage.getItem('lms_transport_qr_settings');
    if (!settings) {
        const defaultSettings = {
            enabled: true,
            expiryHours: 24,
            allowManualOverride: true,
            requirePickupBeforeDrop: true,
            secretSalt: SECRET_SALT
        };
        localStorage.setItem('lms_transport_qr_settings', JSON.stringify(defaultSettings));
    }
};

/**
 * Get QR settings
 * @returns {Object} - QR settings
 */
export const getQRSettings = () => {
    return JSON.parse(localStorage.getItem('lms_transport_qr_settings') || '{}');
};

/**
 * Update QR settings
 * @param {Object} newSettings - New settings to merge
 */
export const updateQRSettings = (newSettings) => {
    const currentSettings = getQRSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem('lms_transport_qr_settings', JSON.stringify(updatedSettings));
};
