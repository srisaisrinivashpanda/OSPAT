package com.hospitality.controller;

import com.hospitality.dto.DashboardSummaryDto;
import com.hospitality.dto.ErrorResponseDto;
import com.hospitality.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Dashboard Intelligence", description = "Endpoints for aggregated overview and health-financial snapshot")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Get aggregated dashboard summary for default patient (id=1)",
               description = "Returns aggregated active policy metrics, indicative balances, active care journey stage, and recommended actions.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Dashboard summary retrieved", content = @Content(schema = @Schema(implementation = DashboardSummaryDto.class))),
            @ApiResponse(responseCode = "404", description = "Default patient not found", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<DashboardSummaryDto> getDefaultDashboardSummary() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary(1L));
    }

    @GetMapping("/{patientId}")
    @Operation(summary = "Get aggregated dashboard summary for specific patient")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Dashboard summary retrieved", content = @Content(schema = @Schema(implementation = DashboardSummaryDto.class))),
            @ApiResponse(responseCode = "404", description = "Patient not found", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary(
            @Parameter(description = "Patient ID", required = true)
            @PathVariable("patientId") Long patientId) {
        return ResponseEntity.ok(dashboardService.getDashboardSummary(patientId));
    }
}
