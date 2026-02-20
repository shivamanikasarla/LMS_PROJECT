# Backend Guide: Implementing "Refunds Allowed" Check

**Requirement:** 
Ensure that the backend strictly enforces the "No Refunds" policy. If the admin has set `refundAllowed = false` in the settings, the backend MUST reject any attempt to create a refund (negative payment).

---

## 1. Controller Logic (TransportPaymentController)

In your `createPayment` or `addTransaction` method, you must add a check before saving.

```java
// TransportPaymentController.java

@PostMapping("/payments")
public ResponseEntity<?> createPayment(@RequestBody TransportPaymentDTO paymentDTO) {

    // 1. Check if this is a Refund Attempt (Amount is negative)
    if (paymentDTO.getAmount() < 0) {
    
        // 2. Fetch the current settings from DB
        // Assuming you have a service method getSetting(key)
        String refundAllowed = transportSettingsService.getSettingValue("refundAllowed");
        
        // 3. Validate Policy
        // Default to "false" (safe) if setting is missing, or strictly check "true"
        if (refundAllowed == null || !refundAllowed.equalsIgnoreCase("true")) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Error: Refunds are currently disabled in Transport Settings.");
        }
    }

    // 4. Proceed with saving payment...
    return ResponseEntity.ok(transportPaymentService.save(paymentDTO));
}
```

---

## 2. Service Logic (TransportSettingsService)

Ensure you have a method to easily retrieve a single setting value.

```java
// TransportSettingsService.java

public String getSettingValue(String key) {
    Optional<TransportSetting> setting = repository.findByKey(key);
    return setting.map(TransportSetting::getValue).orElse(null);
}
```

---

## Summary
*   **Intercept:** Check every incoming payment request.
*   **Detect Refund:** Identify if `amount < 0`.
*   **Check Setting:** Look up `refundAllowed` in the database.
*   **Block:** If setting is missing or "false", throw a 403 Forbidden error.
