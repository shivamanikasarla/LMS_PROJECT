# Backend Guide: Fixing Settings 500 Error

**Issue:** 
The frontend is receiving a `500 Internal Server Error` when trying to save settings.
Payload sent: `{ "key": "refundAllowed", "value": "true" }` or `{ "key": "refundAllowed", "value": "false" }`

**Probable Cause:**
The backend endpoint `POST /api/transport/settings` might be expecting a different DTO structure or the `TransportSettings` entity is not set up dynamically (key-value pair).

---

## 1. Check Your DTO
If your backend expects a specific object structure like `TransportSettingsDTO` with fields `lateFee`, `dueDate`, etc., it will fail when mapped with just `key` and `value`.

**Recommended Fix (Dynamic Approach):**
Update your controller to accept a map or a generic KeyValue DTO.

```java
// Controller
@PostMapping("/settings")
public ResponseEntity<?> updateSetting(@RequestBody Map<String, String> payload) {
    String key = payload.get("key");
    String value = payload.get("value");
    
    // Call service to update this specific key
    transportSettingsService.updateSetting(key, value);
    return ResponseEntity.ok("Saved");
}
```

**Alternative Fix (Static Approach):**
If you strictly use a `TransportSettingsDTO` class, you must update that class to include `refundAllowed` and update the frontend to send the full object, not just one key.

**Frontend sends:** `{ "refundAllowed": "true", "dueDate": 5 }`
**Backend DTO:**
```java
public class TransportSettingsDTO {
    private String refundAllowed;
    private Integer dueDate;
    // getters/setters
}
```

---

## 2. Check Database Schema
If you are using a static table with columns (`id`, `late_fee`, `due_date`), and you try to save a "key-value" pair, it won't work unless you have a dedicated `settings` table with `key` and `value` columns.

**Option A (Best for Flexibility):**
Create a `transport_settings` table:
`key (VARCHAR, Unique)` | `value (VARCHAR)`

**Option B (Quick Fix):**
Add `refund_allowed` column to your existing single-row settings table.

---

## 3. Immediate Action for Dev
Check the server logs for the specific exception causing the 500 error. It is likely a **JSON Mapping Error** (Unrecognized field) or a **Database Column Error** (Field 'refundAllowed' not found).
