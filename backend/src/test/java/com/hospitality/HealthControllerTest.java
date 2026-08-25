package com.hospitality;

import com.hospitality.controller.HealthController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class HealthControllerTest {

    private final HealthController healthController = new HealthController();

    @Test
    @DisplayName("GET /api/health should return HTTP 200 with status ok")
    void testHealthCheckReturnsOk() {
        ResponseEntity<Map<String, String>> response = healthController.healthCheck();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("ok", response.getBody().get("status"));
    }
}
