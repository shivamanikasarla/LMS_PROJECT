# Backend Implementation Documentation for Webinar Module

## Overview
This document outlines the required backend changes and implementations to support the Webinar module. This includes the Controller, Service, and Entity for managing webinars.

## 1. Webinar Controller
**Endpoint:** `GET /api/webinars`  
**Required Change:**  
Create a new controller `WebinarController.java` to handle the webinar API calls.

```java
// Controller: WebinarController.java

package com.graphy.lms.controller;

import com.graphy.lms.entity.Webinar;
import com.graphy.lms.service.WebinarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/webinars")
public class WebinarController {

    @Autowired
    private WebinarService webinarService;

    @GetMapping
    public ResponseEntity<List<Webinar>> getAllWebinars(@RequestParam(required = false) String type) {
        if (type != null && !type.equals("all")) {
            return ResponseEntity.ok(webinarService.getWebinarsByType(type));
        }
        return ResponseEntity.ok(webinarService.getAllWebinars());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Webinar> getWebinarById(@PathVariable Long id) {
        return ResponseEntity.ok(webinarService.getWebinarById(id));
    }

    @PostMapping
    public ResponseEntity<Webinar> createWebinar(@RequestBody Webinar webinar) {
        return ResponseEntity.ok(webinarService.createWebinar(webinar));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Webinar> updateWebinar(@PathVariable Long id, @RequestBody Webinar webinar) {
        return ResponseEntity.ok(webinarService.updateWebinar(id, webinar));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWebinar(@PathVariable Long id) {
        webinarService.deleteWebinar(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 2. Webinar Service
**Logic:**  
Implement the `WebinarService.java` to handle the business logic for webinars.

```java
// Service: WebinarService.java

package com.graphy.lms.service;

import com.graphy.lms.entity.Webinar;
import com.graphy.lms.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WebinarService {

    @Autowired
    private WebinarRepository webinarRepository;

    public List<Webinar> getAllWebinars() {
        return webinarRepository.findAll();
    }

    public List<Webinar> getWebinarsByType(String type) {
        return webinarRepository.findByType(type);
    }

    public Webinar getWebinarById(Long id) {
        return webinarRepository.findById(id).orElseThrow(() -> new RuntimeException("Webinar not found"));
    }

    public Webinar createWebinar(Webinar webinar) {
        return webinarRepository.save(webinar);
    }

    public Webinar updateWebinar(Long id, Webinar webinarDetails) {
        Webinar webinar = getWebinarById(id);
        webinar.setTitle(webinarDetails.getTitle());
        webinar.setDateTime(webinarDetails.getDateTime());
        webinar.setDuration(webinarDetails.getDuration());
        webinar.setNotes(webinarDetails.getNotes());
        webinar.setCover(webinarDetails.getCover());
        webinar.setMemberLimit(webinarDetails.getMemberLimit());
        webinar.setType(webinarDetails.getType());
        return webinarRepository.save(webinar);
    }

    public void deleteWebinar(Long id) {
        webinarRepository.deleteById(id);
    }
}
```

---

## 3. Webinar Entity
**Logic:**  
Implement the `Webinar.java` to handle the data structure for webinars.

```java
// Entity: Webinar.java

package com.graphy.lms.entity;

import javax.persistence.*;

@Entity
@Table(name = "webinars")
public class Webinar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String dateTime;
    private Integer duration;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    private String cover;
    private Integer memberLimit;
    private Integer attendedCount = 0;
    private String type; // live, upcoming, recorded

    // Getters and Setters
}
```

---

## Summary of Endpoints to Verify

| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/webinars` | Fetch all webinars | **READY** |
| `POST` | `/api/webinars` | Create a new webinar | **READY** |
| `GET` | `/api/webinars/{id}` | Get webinar details | **READY** |
| `PUT` | `/api/webinars/{id}` | Update webinar details | **READY** |
| `DELETE` | `/api/webinars/{id}` | Delete a webinar | **READY** |
