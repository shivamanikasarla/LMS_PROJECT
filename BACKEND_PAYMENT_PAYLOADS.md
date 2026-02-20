# Backend Guide: Payment & Refund API Payload

This document details exactly what the frontend sends to the backend when processing **Payments (Collections)** and **Refunds**.

---

## 1. Collecting Payment (Positive Transaction)

When the user clicks "Collect" and submits the form, the frontend sends a `POST` request to `/api/transport/payments`.

### **Payload Structure:**
```json
{
  "studentId": 123,           // Long/Integer: ID of the student
  "amount": 5000.00,          // Double: Positive amount being paid
  "paymentMode": "UPI",       // String/Enum: 'UPI', 'CASH', 'BANK_TRANSFER', 'CHEQUE', 'CARD'
  "paymentDate": "2024-02-14",// String (YYYY-MM-DD): Date of payment
  "remarks": "Term 1 Fee"     // String: Optional notes
}
```

### **Backend logic should:**
1.  Verify `studentId` exists.
2.  Save the record with a **positive** amount.
3.  Update the student's total paid balance (if you store it separately, or just sum it up on the fly).
4.  Generate a Transaction ID (e.g., `txn_8392`).

---

## 2. Processing Refund (Negative Transaction)

When the user clicks "Refund" and submits the form, the frontend **also** sends a `POST` request to `/api/transport/payments`.

### **Payload Structure:**
```json
{
  "studentId": 123,           // Long/Integer: ID of the student
  "amount": -2000.00,         // Double: NEGATIVE amount (Refund)
  "paymentMode": "REFUND",    // String/Enum: 'REFUND' (Critical: Add this to your Enum)
  "paymentDate": "2024-02-14",// String (YYYY-MM-DD): Date of refund
  "remarks": "REFUND: Partial - Overpayment adjustment" // String: Details
}
```

### **Backend logic should:**
1.  **Intercept Check:** Check if `amount < 0`.
    *   If yes, check `TransportSettings` for `refundAllowed`.
    *   If `refundAllowed == false`, **Reject** with `403 Forbidden`.
2.  **Enum Support:** Ensure your `PaymentMode` enum includes `REFUND`. If not, map it to `CASH` internally but keep the remarks clear.
3.  **Balance Update:** Since the amount is negative, summing up all payments `sum(amount)` including this one will correctly reduce the total paid amount.
    *   Example: Paid 5000 + Refund (-2000) = Net Paid 3000.

---

## Field Summary for DTO

**`TransportPaymentDTO.java`**

| Field | Type | Description |
| :--- | :--- | :--- |
| `studentId` | `Long` | **Required.** The student associated with the transaction. |
| `amount` | `Double` | **Required.** Positive for Payment, Negative for Refund. |
| `paymentMode` | `String` | **Required.** Enum value (UPI, CASH, REFUND, etc.). |
| `paymentDate` | `LocalDate` | **Required.** The date of the transaction. |
| `remarks` | `String` | Optional. Notes or reasons. |

---

## Common Issues to Prevent
1.  **"Invalid Enum" Error:** If your backend strictly uses `PaymentMode` enum and doesn't have `REFUND`, the request will fail.
    *   *Fix:* Add `REFUND` to the enum OR frontend can fallback to 'CASH' (but 'REFUND' is cleaner).
2.  **"Min Value 0" Error:** If you have `@Min(0)` validation on `amount`, refunds will fail.
    *   *Fix:* Remove `@Min(0)`.
3.  **Date Format:** Ensure backend accepts `YYYY-MM-DD` string for LocalDate.
