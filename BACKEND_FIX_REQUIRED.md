# 🔴 BACKEND FIX REQUIRED - Circular Reference Issue

## Problem
The backend is returning **invalid JSON** due to a **circular reference** between `Vehicle` and `RouteWay`:

- `Vehicle` has `route` (RouteWay)
- `RouteWay` has `vehicles` (List\<Vehicle\>)

When Jackson tries to serialize this, it creates an infinite loop!

---

## ✅ SOLUTION: Add @JsonIgnore

### Update RouteWay.java

**File:** `com.campusFacilities.www.model.Transport.RouteWay`

**Add this import:**
```java
import com.fasterxml.jackson.annotation.JsonIgnore;
```

**Modify the vehicles field:**
```java
/* =============VEHICLES ASSIGNED TO THIS ROUTE =========*/

@JsonIgnore  // ← ADD THIS ANNOTATION
@OneToMany(mappedBy = "route")
private List<Vehicle> vehicles;
```

---

## Complete Fixed RouteWay.java

```java
package com.campusFacilities.www.model.Transport;

import java.util.List;

import com.fasterxml..jackson.annotation.JsonIgnore;  // ← ADD THIS
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "route_way")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteWay {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "route_Code")
    private Long routeCode;

    @Column(name = "route_name", nullable = false)
    private String routeName;
    
    @ElementCollection
    @CollectionTable(name = "route_pickup_points", joinColumns = @JoinColumn(name = "route_id"))
    @Column(name = "pickup_point")
    private List<String> pickupPoints;

    @ElementCollection
    @CollectionTable(name = "route_drop_points", joinColumns = @JoinColumn(name = "route_id"))
    @Column(name = "drop_point")
    private List<String> dropPoints;
    
    private Double distanceKm;
    
    private Integer estimatedTimeMinutes;
    
    /* =============VEHICLES ASSIGNED TO THIS ROUTE =========*/
    
    @JsonIgnore  // ← CRITICAL: Prevents circular reference
    @OneToMany(mappedBy = "route")
    private List<Vehicle> vehicles;
    
    @Column(nullable = false)
    private Boolean active = true;
}
```

---

## Why This Fixes It

**Without @JsonIgnore:**
```
Vehicle → route (RouteWay) → vehicles (List<Vehicle>) → route → vehicles → route → ∞
```

**With @JsonIgnore:**
```
Vehicle → route (RouteWay) → [vehicles field ignored during serialization] ✅
```

---

## Alternative Solutions (if you need vehicles list)

### Option 1: Use @JsonManagedReference and @JsonBackReference

**In RouteWay.java:**
```java
@JsonManagedReference
@OneToMany(mappedBy = "route")
private List<Vehicle> vehicles;
```

**In Vehicle.java:**
```java
@JsonBackReference
@ManyToOne
@JoinColumn(name = "route_id", nullable = true) 
private RouteWay route;
```

### Option 2: Create separate DTOs
Create separate Data Transfer Objects without circular references for API responses.

---

## After Making the Fix

1. **Rebuild backend:** `mvn clean install`
2. **Restart backend server**
3. **Test frontend:** Refresh and try fetching vehicles again
4. **Expected Result:** Vehicles list loads successfully! ✅

---

## Verification

After the fix, the JSON response should look like:
```json
[
  {
    "id": 1,
    "vehicleNumber": "KA-01-AB-1234",
    "vehicletype": "BUS",
    "capacity": 50,
    "occupiedSeats": 25,
    "vehicleStatus": "ACTIVE",
    "gpsEnabled": true,
    "route": {
      "id": 1,
      "routeCode": 101,
      "routeName": "Route 1",
      "pickupPoints": ["Stop A", "Stop B"],
      "dropPoints": ["College"],
      "distanceKm": 15.5,
      "estimatedTimeMinutes": 45,
      "active": true
      // ✅ No "vehicles" field = No circular reference!
    }
  }
]
```

---

**Status:** ⏳ Waiting for backend fix
**Priority:** 🔴 CRITICAL - Frontend cannot work without this
