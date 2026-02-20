# Fee Management - Complete Backend API Specification

## 🎯 Overview
This document specifies ALL backend endpoints needed to replace localStorage in the Fee Management module.

---

## 📋 Required Backend Endpoints

### 1. Fee Refunds API

#### GET `/api/fee/refunds`
**Description**: Get all refund records  
**Response**:
```json
[
  {
    "id": 1,
    "studentId": 123,
    "studentName": "John Doe",
    "action": "REFUND",
    "detail": "PARTIAL" | "FULL",
    "amount": 5000,
    "mode": "WALLET" | "BANK",
    "reason": "Student withdrew",
    "date": "2026-01-30",
    "status": "COMPLETED",
    "admin": "Admin Name"
  }
]
```

#### POST `/api/fee/refunds`
**Description**: Create a new refund  
**Request Body**:
```json
{
  "studentId": 123,
  "refundType": "PARTIAL" | "FULL",
  "amount": 5000,
  "mode": "WALLET" | "BANK",
  "reason": "Reason text",
  "reference": "REF123" (optional)
}
```
**Response**: Created refund object

#### DELETE `/api/fee/refunds/{refundId}`
**Description**: Delete/reverse a refund  
**Response**: Success boolean

---

### 2. Fee Payments API

#### GET `/api/fee/payments`
**Description**: Get all payment records  
**Response**: Array of payment objects

#### GET `/api/fee/payments/student/{studentId}`
**Description**: Get payments for specific student  
**Response**: Array of payment objects

#### POST `/api/fee/payments`
**Description**: Record a new payment  
**Request Body**:
```json
{
  "studentId": 123,
  "amount": 10000,
  "mode": "CASH" | "ONLINE" | "CHEQUE" | "CARD",
  "reference": "TXN123",
  "remarks": "Semester 1 fee"
}
```

---

### 3. Fee Batches/Students API

#### GET `/api/fee/students`
**Description**: Get all students with fee information  
**Response**:
```json
[
  {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "totalFee": 50000,
    "paidAmount": 25000,
    "dueAmount": 25000,
    "status": "PENDING" | "PARTIAL" | "PAID",
    "batchId": 1,
    "batchName": "CS 2025-26",
    "batchYear": "2025-26"
  }
]
```

#### GET `/api/fee/batches/{batchId}/students`
**Description**: Get students in a specific batch  
**Response**: Array of student objects

#### POST `/api/fee/batches/{batchId}/fees`
**Description**: Create fee structure for a batch  
**Request Body**:
```json
{
  "totalAmount": 50000,
  "description": "Semester 1 Fee",
  "dueDate": "2026-02-28",
  "components": [
    {
      "name": "Tuition Fee",
      "amount": 40000
    },
    {
      "name": "Lab Fee",
      "amount": 10000
    }
  ]
}
```

---

### 4. Fee Installments API

#### GET `/api/fee/installments`
**Description**: Get all installment plans  
**Response**: Array of installment plans

#### GET `/api/fee/student/{studentId}/installments`
**Description**: Get installment plan for a student  
**Response**:
```json
{
  "studentId": 123,
  "plan": "CUSTOM",
  "installments": [
    {
      "number": 1,
      "amount": 20000,
      "dueDate": "2026-02-15",
      "status": "PAID" | "PENDING" | "OVERDUE"
    }
  ]
}
```

#### POST `/api/fee/student/{studentId}/installments`
**Description**: Create installment plan for student  
**Request Body**:
```json
{
  "planType": "TWO_INSTALLMENTS" | "QUARTERLY" | "CUSTOM",
  "installments": [
    {
      "amount": 25000,
      "dueDate": "2026-02-15"
    }
  ]
}
```

---

### 5. Fee Reports/Dashboard API

#### GET `/api/fee/dashboard/stats`
**Description**: Get dashboard statistics  
**Response**:
```json
{
  "totalStudents": 500,
  "totalCollected": 15000000,
  "totalPending": 5000000,
  "overdueAmount": 500000,
  "recentPayments": [],
  "collectionTrend": []
}
```

#### GET `/api/fee/reports/collection`
**Description**: Get fee collection report  
**Query Params**: `startDate`, `endDate`, `batchId`  
**Response**: Collection report data

---

### 6. Create Fee API

#### POST `/api/fee/create`
**Description**: Create individual fee for a student  
**Request Body**:
```json
{
  "studentId": 123,
  "amount": 50000,
  "description": "Annual Fee",
  "dueDate": "2026-03-31",
  "category": "TUITION" | "HOSTEL" | "TRANSPORT" | "OTHER",
  "components": []
}
```

#### GET `/api/fee/student/{studentId}`
**Description**: Get fee details for a student  
**Response**: Student fee object with all components

---

## 🔄 Data Flow

### Current (localStorage):
1. User performs action → Save to localStorage → Update UI

### New (Backend):
1. User performs action → POST to backend → Backend saves to DB → Return response → Update UI

---

## ⚠️ Migration Strategy

### Phase 1: Backend Implementation (Backend Developer)
- Create all endpoints listed above
- Test with Postman/API client
- Ensure proper authentication

### Phase 2: Frontend Integration (You)
- Add API functions to `feeService.js`
- Remove localStorage calls
- Replace with backend API calls
- Add proper error handling

### Phase 3: Testing
- Test each module individually
- Verify data persistence
- Check error scenarios

---

## 📝 Next Steps

1. **Give this spec to your backend developer**
2. **Wait for backend endpoints to be ready**
3. **Test endpoints with Postman**
4. **Then I'll integrate them in frontend**

Without the backend APIs ready, removing localStorage will leave you with a non-functional system!

**Would you like me to:**
- A) Wait for backend to be ready before removing localStorage
- B) Remove localStorage now and handle empty states (system won't work)
- C) Create the frontend API integration code now (ready to use when backend is done)

**Which option do you prefer?**
