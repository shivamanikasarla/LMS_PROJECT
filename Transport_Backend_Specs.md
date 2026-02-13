# Transport Module Backend Specifications (Handover Document)

**Version:** 2.1
**Last Updated:** 2024-02-13
**Module:** Transport Management System (TMS) & Fees

---

## 1. System Overview
The Transport Module manages the entire lifecycle of school transportation, including:
1.  **Fleet Management:** Routes, Vehicles, and Drivers.
2.  **Student Mapping:** Assigning students to specific routes/pick-up points.
3.  **Fee Management:** configuring **route-based fees** (simple assignment) and recording fee payments.

This document serves as the **SINGLE SOURCE OF TRUTH** for the backend implementation.

---

## 2. Database Schema Design (Entities)

### A. Core Transport Entities

#### 1. `transport_routes`
Stores unique transport routes (e.g., "North City Route").
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Inc | Unique Route ID |
| `name` | VARCHAR(100) | NOT NULL | Route Name (e.g., "Route A") |
| `code` | VARCHAR(20) | UNIQUE | Short Code (e.g., "R-101") |
| `start_point` | VARCHAR(100) | | Starting location |
| `end_point` | VARCHAR(100) | | Destination |
| `is_active` | BOOLEAN | DEFAULT TRUE | Soft delete flag |

#### 2. `transport_vehicles`
Physical buses/vans assigned to routes.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Inc | Unique Vehicle ID |
| `reg_number` | VARCHAR(20) | UNIQUE, NOT NULL | License Plate (e.g., "KA-01-AB-1234") |
| `route_id` | INT | FK -> `transport_routes.id` | The route this bus runs on |
| `driver_id` | INT | FK -> `transport_drivers.id` | Assigned Driver |
| `capacity` | INT | NOT NULL | Max seats |
| `gps_device_id` | VARCHAR(50) | | For live tracking integration |

#### 3. `transport_student_assignments`
Maps a student to a specific route/vehicle.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Inc | |
| `student_id` | INT | UNIQUE, NOT NULL | Link to existing User/Student table |
| `route_id` | INT | FK -> `transport_routes.id` | Assigned Route |
| `vehicle_id` | INT | FK -> `transport_vehicles.id` | Assigned Vehicle (Optional) |
| `pickup_point` | VARCHAR(100) | | Specific stop name |
| `assigned_at` | TIMESTAMP | DEFAULT NOW() | |

---

### B. Fee Management Entities

#### 4. `transport_fee_structure` (Config)
Defines the standard annual fee for a route.
*Logic:* Every student on "Route A" pays this exact amount. No exceptions.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Inc | |
| `route_id` | INT | FK, UNIQUE | One fee structure per route |
| `annual_fee` | DECIMAL(10,2) | NOT NULL | Standard yearly fee for this route |
| `academic_year` | VARCHAR(10) | "2023-2024" | To handle year-over-year changes |

#### 5. `transport_payments` (Transactions)
Records all incoming payments.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(50) | PK | Transaction ID (e.g., "TXN_172839") |
| `student_id` | INT | FK | Who paid |
| `amount` | DECIMAL(10,2) | NOT NULL | Amount paid in this txn |
| `payment_date` | DATE | DEFAULT TODAY | |
| `payment_mode` | ENUM | 'Cash', 'UPI', 'Card', 'Cheque', 'Bank Transfer' | |
| `reference_no` | VARCHAR(50) | | Cheque No / UPI txn ID (Optional) |
| `remarks` | TEXT | | Admin notes |
| `created_at` | TIMESTAMP | DEFAULT NOW() | |

#### 6. `transport_settings`
Global settings for the module.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `key` | VARCHAR(50) | PK | "late_fee_per_day", "due_date_day" |
| `value` | VARCHAR(255) | | Store values as strings, parse in app |

---

## 3. API Specifications

### A. Core Data

#### `GET /api/transport/routes`
*   **Response:** List of all routes.
    ```json
    [
      { "id": 1, "name": "Route A", "code": "R101", "fee_configured": true }
    ]
    ```

#### `GET /api/transport/students`
*   **Response:** List of all students with their basic info.

#### `GET /api/transport/assignments`
*   **Response:**
    ```json
    [
      { "studentId": 101, "routeId": 1, "pickupPoint": "Main Gate" }
    ]
    ```

---

### B. Fee Configuration

#### `GET /api/transport/fees/config`
*   **Purpose:** content for the "Fee Structure" tab.
*   **Response:**
    ```json
    [
      { "routeId": 1, "annualFee": 50000, "academicYear": "2024-25" }
    ]
    ```

#### `POST /api/transport/fees/config`
*   **Purpose:** Set the fee for a specific route.
*   **Payload:**
    ```json
    { "routeId": 1, "annualFee": 52000, "academicYear": "2024-25" }
    ```

---

### C. Transactions (Payment Recording)

#### `GET /api/transport/payments`
*   **Purpose:** Global transaction history table.
*   **Query Params:** `?studentId=123` (optional filter).
*   **Response:**
    ```json
    [
      {
        "id": "txn_88291",
        "studentId": 123,
        "amount": 5000,
        "mode": "UPI",
        "date": "2024-02-14",
        "remarks": "Part Payment"
      }
    ]
    ```

#### `POST /api/transport/payments`  (Admin Manual Payment)
*   **Purpose:** The endpoint connected to the "Add Manual Payment" modal.
*   **Payload:**
    ```json
    {
      "studentId": 123,    // REQUIRED
      "amount": 5000,      // REQUIRED
      "mode": "Cash",      // ENUM: Cash, UPI, Card, Cheque, Bank Transfer
      "date": "2024-02-14",
      "remarks": "Collected at reception"
    }
    ```
*   **Backend Logic:**
    1.  Validate student exists.
    2.  Create entry in `transport_payments`.
    3.  Updates dashboard stats cache (if applicable).
    4.  Return new Transaction Object with `201 Created`.

---

## 4. Frontend-Backend Integration Logic

### 1. Determining "Total Fee" for a Student
Calculation is purely route-based:
1.  **Find Student's Route:** Check `transport_student_assignments` for `routeId`.
2.  **Get Route Fee:** Check `transport_fee_structure` for that `routeId`'s `annual_fee`.
3.  **Result:** That is the `Total Fee`. (If no route assigned, Fee = 0).

### 2. Calculating "Pending Amount"
`Pending = Total Fee (from Route) - SUM(All Payments for studentId)`

### 3. "No Payment Due" Validation
The Admin Payment Endpoint should ideally **NOT** reject overpayments (sometimes parents pay in advance), but the Frontend UI blocks it for clarity to prevent double entry.
