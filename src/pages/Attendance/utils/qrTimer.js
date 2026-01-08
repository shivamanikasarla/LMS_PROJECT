export const generateSessionToken = (sessionId, expiryMinutes = 5) => {
    const expiresAt = Date.now() + expiryMinutes * 60 * 1000;

    return {
        token: `${sessionId}-${Math.random().toString(36).slice(2)}`,
        expiresAt
    };
};

export const getTimeRemaining = (expiresAt) => {
    return Math.max(0, expiresAt - Date.now());
};
