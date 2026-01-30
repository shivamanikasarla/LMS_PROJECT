# Admin Audit Log System

## Overview
The audit log system tracks all administrative operations performed in the Fee Management module.

## What Gets Logged
The system automatically logs when admins perform these actions:
- **Fee Created** - When a new fee is created
- **Scholarship Added** - When a scholarship is added to a student
- **Discount Applied** - When a discount is applied
- **Refund Processed** - When a refund is processed
- **Payment Recorded** - When a payment is manually recorded
- **Settings Updated** - When fee settings are modified
- **Fee Structure Modified** - When fee structure is changed
- **Installment Plan Created** - When a new installment plan is set up
- **Late Fee Applied** - When late fees are applied

## How to Use

### Viewing Audit Logs
Navigate to **Fee Management > Audit Logs** to see all admin operations displayed in a clean timeline format.

Each log entry shows:
- **What action was performed** (e.g., "Created a new fee")
- **Details about the action** (specific information)
- **Who performed it** (admin email)
- **When it happened** (timestamp)
- **Who was affected** (target user, if applicable)

### Adding Audit Logs in Your Code

To log an admin action anywhere in the Fee Management module:

1. Import the audit log hook:
```javascript
import useAuditLog from '../../hooks/useAuditLog';
```

2. Use it in your component:
```javascript
const { logAction } = useAuditLog();
```

3. Call it when an admin performs an action:
```javascript
await logAction('FEE_CREATED', {
    details: `Created fee for ${courseName} - Amount: ₹${amount}`,
    targetUser: studentEmail,
    status: 'SUCCESS'
});
```

### Available Action Types
- `FEE_CREATED`
- `SCHOLARSHIP_ADDED`
- `DISCOUNT_APPLIED`
- `REFUND_PROCESSED`
- `PAYMENT_RECORDED`
- `SETTINGS_UPDATED`
- `FEE_STRUCTURE_MODIFIED`
- `INSTALLMENT_PLAN_CREATED`
- `LATE_FEE_APPLIED`

### Backend API
The frontend calls these endpoints:
- `GET /api/fee/audit-logs` - Fetch all audit logs
- `POST /api/fee/audit-logs` - Create a new audit log entry

Expected backend data structure:
```json
{
  "id": 1,
  "action": "FEE_CREATED",
  "adminEmail": "admin@example.com",
  "adminId": 1,
  "timestamp": "2026-01-30T17:45:00Z",
  "details": "Created fee for Computer Science - Amount: ₹50000",
  "targetUser": "student@example.com",
  "status": "SUCCESS"
}
```

## Next Steps
Your backend developer should implement:
1. `/api/fee/audit-logs` endpoints
2. Database table to store audit logs
3. Automatic logging in backend for critical operations

## Already Implemented
✅ Audit log viewing page with timeline display
✅ API service methods for fetching logs
✅ Custom React hook for easy logging (`useAuditLog`)
✅ Auto-logging in FeeSettings when settings are saved
✅ Clean, visual  display of all admin operations
