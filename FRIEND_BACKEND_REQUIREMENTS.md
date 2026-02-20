# Friend's Backend Requirements for Fee Installments

To integrate the Fee Installment logic, please implement the following API endpoint on your backend.

## 1. Create Installment Plan API

**Endpoint:** `POST /api/fee/student/{studentId}/installments`

**Description:** Saves a new installment plan for a specific student. This effectively "splits" the total fee into the specified installments.

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (if applicable)

**Path Parameters:**
- `studentId`: The unique identifier of the student (e.g., `STU-101` or `123`).

**Request Body (JSON):**

```json
{
  "planType": "Quarterly", // OneTime, Quarterly, HalfYearly, Yearly, Custom
  "totalFee": 50000,       // Total fee amount (for validation)
  "installments": [
    {
      "name": "Installment 1",
      "amount": 12500,
      "dueDate": "2025-04-01",
      "status": "PENDING"
    },
    {
      "name": "Installment 2",
      "amount": 12500,
      "dueDate": "2025-07-01",
      "status": "PENDING"
    },
    {
      "name": "Installment 3",
      "amount": 12500,
      "dueDate": "2025-10-01",
      "status": "PENDING"
    },
    {
      "name": "Installment 4",
      "amount": 12500,
      "dueDate": "2026-01-01",
      "status": "PENDING"
    }
  ]
}
```

**Expected Response (Success - 200/201):**

```json
{
  "success": true,
  "message": "Installment plan created successfully",
  "data": {
    "studentId": "STU-101",
    "planId": "PLAN-789",
    "createdAt": "2025-02-02T10:00:00Z"
  }
}
```

**Expected Response (Error):**
- **400 Bad Request:** If the sum of installments does not match the total fee.
- **404 Not Found:** If the student ID does not exist.
- **500 Internal Server Error:** General failure.

---

## 2. (Optional) Bulk Create API

If you wish to apply a plan to a whole batch at once:

**Endpoint:** `POST /api/fee/batches/installments/bulk`

**Request Body:**
```json
{
  "batchId": "BATCH-001",
  "planType": "Quarterly", 
  "students": [ "STU-101", "STU-102", ... ] // List of student IDs to apply to
}
```
*Note: The frontend currently implements the per-student endpoint (Option 1).*
