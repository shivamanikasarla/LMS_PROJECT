# Transport GPS Live Tracking Setup Guide

## 1. Frontend Status (Completed)
- **Component**: `src/pages/Transport/LiveTracking.jsx`
- **WebSocket Library**: Updated to `@stomp/stompjs` (modern Client)
- **Endpoint**: `/gps-websocket` (via Vite Proxy)
- **Status**: Ready to connect.

## 2. Backend Requirements (Verified)
The backend response confirms that the WebSocket configuration is **ACTIVE** and **CORRECT**.

**Verification Response:**
```json
{
  "entropy": -683961835,
  "origins": ["*:*"],
  "cookie_needed": true,
  "websocket": true
}
```

- `websocket: true` ✅ WebSockets are enabled.
- `origins: ["*:*"]` ✅ CORS is allowing connections from the frontend.

## 3. How to Validate Live Tracking
1.  **Open the Page**: Go to **Transport Module -> Live Tracking**.
2.  **Check Status Badge**: You should see a green **"Connected"** badge in the top right of the map card.
3.  **Check Debug Overlay**: The black box in the bottom left should say **[ONLINE] Connected to WebSocket**.
4.  **Test Simulation**:
    - Click **"Simulate Move"**.
    - This sends a GPS update to the backend (`POST /transport/gps`).
    - The backend publishes it to Kafka -> Consumer -> WebSocket.
    - Result: The bus marker on the map should move slightly.

## 4. Troubleshooting "Simulate Move"
If the "Connected" badge is green but "Simulate Move" doesn't work:
- **Issue**: The REST API endpoint might be different from the WebSocket one.
- **Check**: Open the distinct "Network" tab in browser dev tools.
- **Look for**: The `POST` request to `.../gps`.
- **Error**: If it is `404`, the backend path might be `/gps` instead of `/transport/gps`.
- **Error**: If it is `401`, your Auth Token is expired. Logout and Login again.
