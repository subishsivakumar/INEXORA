package com.appleproduct.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<?> root(
            @RequestHeader(value = HttpHeaders.ACCEPT, required = false) String acceptHeader) {
        // If accessed by a web browser, redirect to the interactive Swagger UI API dashboard
        if (acceptHeader != null && acceptHeader.contains(MediaType.TEXT_HTML_VALUE)) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("/swagger-ui/index.html"));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        }
        return healthCheck();
    }

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
