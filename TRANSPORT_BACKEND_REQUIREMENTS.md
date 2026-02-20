# Backend Requirements for Transport Module

Your backend (Spring Boot) must run on `http://192.168.1.20:9191` and implement the following endpoints.

## 1. Assign Student to Bus (Student Mapping)

Currently returning **404 Not Found**. Please implement this immediately.

*   **Endpoint:** `POST /transport/student-mappings`
*   **Controller Mapping:** `@RequestMapping("/transport")` + `@PostMapping("/student-mappings")`

*   **Request Body (JSON):**
    ```json
    {
      "studentId": 101,            // Long : ID of the student
      "vehicleId": 5,              // Long : ID of the vehicle (bus)
      "pickupPoint": "Ameerpet",   // String : Name of the pickup stop
      "dropPoint": "Institute",    // String : Name of the drop stop
      "shift": "Morning"           // String : "Morning", "Evening", or "Both"
    }
    ```

*   **Logic:**
    1.  Find the Student by `studentId`.
    2.  Update the student's record with the new `vehicleId`, `pickupPoint`, `dropPoint`, and `shift`.
    3.  Return success message.

---

## 2. Mark Attendance (Transport Attendance)

*   **Endpoint:** `POST /transport/attendance`
*   **Controller Mapping:** `@RequestMapping("/transport")` + `@PostMapping("/attendance")`

*   **Request Body (JSON):**
    ```json
    {
      "id": null,                   // Long : Send null for new record
      "studentId": 101,             // Long : ID of the student
      "attendanceDate": "2026-02-10", // LocalDate : YYYY-MM-DD
      "markedBy": "MANUAL",         // String : "MANUAL" or "QRCODE"
      "route": { "id": 5 },         // Object : Route ID
      "vehicle": { "id": 12 },      // Object : Vehicle ID
      "pickupStatus": "PICKED_UP",  // String : "PICKED_UP", "ABSENT", etc.
      "dropStatus": "ABSENT"        // String : "DROPPED", "ABSENT", etc.
    }
    ```

*   **Logic:**
    1.  Check if an attendance record already exists for this `studentId` + `attendanceDate`.
    2.  If exists, **update** it. If not, **create** a new one.

---

## 3. Fuel Tracking

*   **Endpoint:** `POST /transport/fuel-logs`
*   **Controller Mapping:** `@RequestMapping("/transport")` + `@PostMapping("/fuel-logs")`

*   **Request Body (JSON):**
    ```json
    {
      "vehicleId": "TS 09 A 2834", // String : Vehicle Number
      "date": "2026-02-10",        // LocalDate
      "quantity": 10.5,            // Double : Liters
      "cost": 1200.00,             // BigDecimal : Cost
      "odo": 15400,                // Long : Odometer Reading
      "station": "Indian Oil"      // String : Station Name
    }
    ```

---

## 4. Maintenance Logs

*   **Endpoint:** `POST /transport/maintenance-logs`
*   **Controller Mapping:** `@RequestMapping("/transport")` + `@PostMapping("/maintenance-logs")`

*   **Request Body (JSON):**
    ```json
    {
      "vehicleId": "TS 09 A 2834",       // String : Vehicle Number
      "type": "Service",                 // String : Service/Repair/Inspection
      "date": "2026-02-10",              // LocalDate
      "cost": 5000.00,                   // BigDecimal
      "description": "Oil change",       // String
      "status": "Completed",             // String : Pending/Completed
      "nextDue": "2026-08-10"            // LocalDate
    }
    ```

---

## 5. Live Tracking (WebSocket)

*   **WebSocket URL:** `ws://192.168.1.20:9191/transport/ws/live-tracking`
*   **Function:** Push vehicle location updates to the admin dashboard in real-time.
*   **Message Format (Server to Client):**
    ```json
    {
      "vehicleId": "TS 09 A 2834",
      "status": "ACTIVE",
      "latitude": 17.4065,
      "longitude": 78.4772,
      "speed": 45
    }
    ```
