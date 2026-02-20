# Backend Implementation Documentation for Transport Fees Module

## Overview
This document outlines the required backend changes and implementations to support the latest frontend features in the Transport Fees module. These changes cover payment handling, refunds, settings management, and student fee configurations.

## 1. Important Fix: `getAllPayments` Endpoint
**Issue:**  
The endpoint `GET /api/transport/payments` is currently returning **Fee Structures** instead of **Payment Records**. This causes the frontend payment history to crash or show incorrect data.

**Required Change:**  
The controller method for this endpoint must be updated to call the correct service method.

```java
// Controller: TransportPaymentController.java

@GetMapping("/payments")
public ResponseEntity<List<TransportPayment>> getAllPayments() {
    // OLD (INCORRECT): return transportService.getAll(); 
    // NEW (CORRECT):
    return ResponseEntity.ok(transportService.getAllPayments());
}
```

---

## 2. Refund Support (Negative Payments)
**Issue:**  
The frontend now supports processing refunds by sending a negative amount (e.g., `-500`).

**Required Change:**  
Ensure the database and service logic for creating payments accept negative values for the `amount` field.

*   **Database Schema:** Ensure the `amount` column in the `transport_payments` table allows negative values (e.g., `DECIMAL(10,2)` or signed `INT`, not `UNSIGNED`).
*   **Validation:** Remove any `@Min(0)` or `amount > 0` validation checks in the `createPayment` DTO or service method.
*   **Transaction Mode:** The frontend sends `paymentMode: "REFUND"`. Ensure this is a valid enum value or string in your backend. If you use a strict Enum, add `REFUND` to it.

```java
// Enum: PaymentMode.java (if applicable)
public enum PaymentMode {
    CASH, ONLINE, CHEQUE, REFUND // Add REFUND
}
```

---

## 3. Settings API (`refundAllowed`)
**Issue:**  
The frontend settings now manage a `refundAllowed` toggle instead of `lateFee`.

**Required Change:**  
Ensure the `GET /api/transport/settings` and `POST /api/transport/settings` endpoints can handle the `refundAllowed` key.

*   **POST:** When saving, the frontend sends: `{ "key": "refundAllowed", "value": "true" }`. The backend should upsert this key-value pair into the settings table.
*   **GET:** The backend should return this key-value pair in the list of settings.

---

## 4. Student Fee Overrides (Optional / Future)
**Context:**  
The "Custom" fee feature (student-specific overrides) was previously using `localStorage`. This has been removed.

**Requirement (If needed):**  
If you want to support student-specific custom fees (e.g., a student pays 10,000 instead of the standard 15,000 for their route), you need a new API.

*   **New Endpoint:** `POST /api/transport/student-fee-override`
*   **Payload:** `{ "studentId": 123, "overrideAmount": 10000 }`
*   **Logic:** When calculating `getStudentFee(studentId)`, the backend should check this override table first before falling back to the Route's annual fee.

---

## Summary of Endpoints to Verify

| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/transport/payments` | Fetch all payment history | **CRITICAL FIX NEEDED** |
| `POST` | `/api/transport/payments` | Create payment / refund | **Needs Negative Amount Support** |
| `GET` | `/api/transport/settings` | Get global settings | Verify `refundAllowed` key |
| `POST` | `/api/transport/settings` | Update global settings | Verify `refundAllowed` key |
