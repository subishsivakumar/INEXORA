package com.appleproduct.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping({"/health", "/api/health"})
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "iNexora Apple Store Backend API");
        response.put("timestamp", Instant.now().toString());
        response.put("environment", "production");
        response.put("swaggerDocs", "/swagger-ui/index.html");
        return ResponseEntity.ok(response);
    }
}
