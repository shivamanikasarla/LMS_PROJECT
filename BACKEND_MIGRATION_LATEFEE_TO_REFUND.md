# Backend Migration Guide: Late Fee -> Refund Policy

## Overview
The frontend has **removed** the "Late Fee" feature and replaced it with a **"Refund Policy"** setting. 
The backend needs to be updated to stop expecting/storing `lateFee` and start handling `refundAllowed`.

---

## 1. Database Changes

### If you are using a Key-Value Table (Recommended)
If your settings table looks like `(id, key, value)`:
*   **Action:** You don't need to change the schema.
*   **Data Cleanup:** You can delete the row where `key = 'lateFee'`.
*   **New Data:** The frontend will now send a new row with `key = 'refundAllowed'` and value `'true'` or `'false'`.

### If you are using a Specific Columns Table
If your settings table looks like `(id, late_fee, due_date, ...)`:
*   **Action 1:** **Remove/Drop** the `late_fee` column.
*   **Action 2:** **Add** a new column `refund_allowed` (Type: `BOOLEAN` or `VARCHAR`).
    *   *Default Value:* `false` (or 'false').

---

## 2. API & DTO Changes

### Update the Request/Response DTOs
The frontend will no longer send `lateFee`. It will send `refundAllowed`.

**Old DTO (To Remove):**
```java
public class TransportSettingsDTO {
    private Double lateFee; // REMOVE THIS
    private Integer dueDate;
    // ...
}
```

**New DTO (To Implement):**
```java
public class TransportSettingsDTO {
    private String refundAllowed; // ADD THIS (Accepts "true" or "false")
    private Integer dueDate;
    // ...
}
```

### Update the Controller Logic
*   **POST /settings:** When saving, map the incoming `refundAllowed` value to your database column.
*   **GET /settings:** Return the `refundAllowed` status so the frontend knows whether to show the "Refund" button.

---

## 3. Business Logic Changes

*   **Stop Late Fee Calculations:** If you had any background job or logic that automatically added fines based on the `lateFee` value, **disable or remove it**. The concept of a generic "Late Fee" no longer exists in the current requirements.
*   **Validate Refunds (Optional):** When a payment with a **negative amount** comes in (a refund), you can check the `refundAllowed` setting.
    *   If `refundAllowed` is `false`, you can reject the transaction.
    *   If `refundAllowed` is `true`, allow the negative payment.

---

## Summary of Tasks for Backend Dev
1.  [ ] Remove `lateFee` from Database and Code.
2.  [ ] Add `refundAllowed` to Database and Code.
3.  [ ] Ensure `POST /api/transport/settings` accepts `{ "refundAllowed": "true" }`.
4.  [ ] Ensure `GET /api/transport/settings` returns the new setting.
