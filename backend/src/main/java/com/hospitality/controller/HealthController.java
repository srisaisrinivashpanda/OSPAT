package com.hospitality.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health Check", description = "Lightweight keep-alive endpoint for cloud monitoring")
public class HealthController {

    @GetMapping
    @Operation(summary = "Lightweight health check endpoint for cold-start prevention",
               description = "Returns immediate HTTP 200 with minimal status JSON without performing database queries or remote AI calls.")
    @ApiResponse(responseCode = "200", description = "Service is healthy and responding")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
