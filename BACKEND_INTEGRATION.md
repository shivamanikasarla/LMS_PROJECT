# Fee Settings Backend Integration Guide

## 🎯 Overview
This document explains how the Fee Settings frontend is now connected to your friend's backend.

---

## 📁 Files Created/Modified

### 1. Backend Controller (Ask your friend to add this)
**File**: `GlobalConfigController.java`
**Location**: `com.graphy.lms.controller`

**Endpoints**:
- `GET /api/fee/settings` - Fetch all settings
- `POST /api/fee/settings` - Save settings

### 2. Frontend Service
**File**: `src/services/feeService.js`
**Purpose**: API calls to backend

### 3. Updated Component
**File**: `src/pages/FeeManagement/FeeSettings.jsx`
**Changes**:
- Replaced localStorage with backend API calls
- Added loading state
- Added error handling

---

## 🔧 Backend Setup Required

Ask your friend to add the controller code I provided above. The controller uses the **existing** `GlobalConfigRepository` that's already in your friend's code.

### Database Keys Used

The settings are stored in the `global_config` table with these keys:

#### General Settings:
- `CURRENCY_CODE` (e.g., "INR")
- `CURRENCY_SYMBOL` (e.g., "₹")
- `TAX_NAME` (e.g., "GST")
- `TAX_PERCENTAGE` (e.g., "18")
- `INVOICE_PREFIX` (e.g., "INV-")
- `CURRENT_FINANCIAL_YEAR` (e.g., "2025-26")

#### Late Fee Settings:
- `ENABLE_LATE_FEES` (true/false)
- `LATE_FEE_AMOUNT` (e.g., "50")
- `LATE_FEE_SEND_EMAIL` (true/false)
- `LATE_FEE_FREQUENCY` ("daily"/"weekly"/"monthly")

#### Notification Toggles:
- `NOTIF_FEE_CREATION_ENABLED`
- `NOTIF_PENDING_REMINDER_ENABLED`
- `NOTIF_OVERDUE_ALERT_ENABLED`
- `NOTIF_PAYMENT_SUCCESS_ENABLED`
- `NOTIF_PARTIAL_PAYMENT_ENABLED`
- `NOTIF_REFUND_UPDATE_ENABLED`

---

## 🚀 How It Works

### On Page Load:
1. Frontend calls `GET /api/fee/settings`
2. Backend reads from `global_config` table
3. Settings displayed in UI

### On Save:
1. User clicks "Save Changes"
2. Frontend calls `POST /api/fee/settings` with JSON payload
3. Backend updates `global_config` table
4. Success message shown

---

## 🧪 Testing

1. **Start Backend**: Make sure your friend's Spring Boot server is running on `http://192.168.1.4:9191`

2. **Open Fee Settings**:
   ```
   Navigate to: Finance → Fee Management → Settings tab
   ```

3. **Test Loading**:
   - You should see "Loading settings from database..."
   - Settings should populate from backend

4. **Test Saving**:
   - Change any setting
   - Click "Save Changes"
   - Check database to verify update

---

## 🐛 Troubleshooting

### Error: "Failed to load settings"
- **Issue**: Backend not running or wrong URL
- **Fix**: Check backend is running on port 9191

### Error: "401 Unauthorized"
- **Issue**: Missing/invalid JWT token
- **Fix**: Check `localStorage.getItem('token')` exists

### Error: "CORS Policy"
- **Issue**: Backend not allowing frontend origin
- **Fix**: Ask your friend to add `@CrossOrigin(origins = "*")` on controller

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  FeeSettings    │
│   Component     │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Loading │ ← Shows spinner
    └────┬────┘
         │
    ┌────▼────────────┐
    │  feeService.js  │ ← API calls
    └────┬────────────┘
         │
    ┌────▼──────────────────┐
    │ GlobalConfigController│ ← Backend
    └────┬──────────────────┘
         │
    ┌────▼────────────┐
    │ GlobalConfig DB │ ← Database
    └─────────────────┘
```

---

## ✅ Benefits

1. **Persistent**: Settings saved to database, not browser
2. **Centralized**: All fee configuration in one place
3. **Backend-Controlled**: Business logic executes based on these settings
4. **Secure**: Settings persist across browsers/devices

---

## 🔐 Security Note

The backend already has JWT authentication via `@Autowired RazorpayClient` and token interceptors. Make sure your React app stores the JWT token in localStorage after login!

---

## 📝 Next Steps

1. ✅ Ask your friend to add the `GlobalConfigController` to backend
2. ✅ Test the integration
3. ✅ Initialize default settings in database if needed

**Initialization SQL (optional)**:
```sql
-- Run this once to set defaults
INSERT INTO global_config (config_key, config_value) VALUES 
('CURRENCY_CODE', 'INR'),
('CURRENCY_SYMBOL', '₹'),
('TAX_NAME', 'GST'),
('TAX_PERCENTAGE', '18'),
('INVOICE_PREFIX', 'INV-'),
('CURRENT_FINANCIAL_YEAR', '2025-26'),
('ENABLE_LATE_FEES', 'false'),
('LATE_FEE_AMOUNT', '50'),
('LATE_FEE_SEND_EMAIL', 'true'),
('LATE_FEE_FREQUENCY', 'weekly'),
('NOTIF_FEE_CREATION_ENABLED', 'true'),
('NOTIF_PENDING_REMINDER_ENABLED', 'true'),
('NOTIF_OVERDUE_ALERT_ENABLED', 'true'),
('NOTIF_PAYMENT_SUCCESS_ENABLED', 'true'),
('NOTIF_PARTIAL_PAYMENT_ENABLED', 'true'),
('NOTIF_REFUND_UPDATE_ENABLED', 'true');
```

---

**Created**: 2026-01-30  
**Author**: Antigravity AI Assistant
