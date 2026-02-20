export const ATTENDANCE_RULES = {
    GEO_FENCE_RADIUS_METERS: 100,
    SESSION_TIMEOUT_MINUTES: 120
};

export const validateAttendance = (
    session,
    tokenData,
    userLocation = null
) => {
    if (!session || session.status !== 'LIVE') {
        return { valid: false, error: 'Session is not live' };
    }

    if (!tokenData || Date.now() > tokenData.expiresAt) {
        return { valid: false, error: 'QR code expired' };
    }

    // Geo-fence (placeholder, frontend only)
    if (session.geoEnabled && !userLocation) {
        return { valid: false, error: 'Location required' };
    }

    return { valid: true };
};
