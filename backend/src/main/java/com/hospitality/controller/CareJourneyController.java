package com.hospitality.controller;

import com.hospitality.dto.CareJourneyDto;
import com.hospitality.dto.ErrorResponseDto;
import com.hospitality.dto.JourneyContextDto;
import com.hospitality.dto.JourneyStageUpdateRequestDto;
import com.hospitality.journey.CareJourneyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/journeys")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Care Journey Management", description = "Endpoints for tracking, transitioning, and retrieving insurance-aware care stages")
public class CareJourneyController {

    private final CareJourneyService careJourneyService;

    @GetMapping("/{patientId}")
    @Operation(summary = "Get current active care journey for a patient",
               description = "Returns the latest care journey including chronological stage history events.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Care journey retrieved", content = @Content(schema = @Schema(implementation = CareJourneyDto.class))),
            @ApiResponse(responseCode = "404", description = "No active care journey found", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<CareJourneyDto> getJourneyForPatient(
            @Parameter(description = "Patient ID", required = true)
            @PathVariable("patientId") Long patientId) {
        return ResponseEntity.ok(careJourneyService.getLatestJourneyForPatient(patientId));
    }

    @PostMapping
    @Operation(summary = "Start or update a care journey by selecting a hospital",
               description = "Initializes an admission journey at the specified hospital facility.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Care journey initiated", content = @Content(schema = @Schema(implementation = CareJourneyDto.class))),
            @ApiResponse(responseCode = "404", description = "Patient or Hospital not found", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<CareJourneyDto> createOrUpdateJourney(
            @Parameter(description = "Patient ID", required = true)
            @RequestParam("patientId") Long patientId,
            @Parameter(description = "Hospital ID", required = true)
            @RequestParam("hospitalId") Long hospitalId) {
        log.info("Starting care journey for patientId {} at hospitalId {}", patientId, hospitalId);
        return ResponseEntity.ok(careJourneyService.createOrUpdateJourney(patientId, hospitalId));
    }

    @PutMapping("/{id}/stage")
    @Operation(summary = "Transition care journey stage (ADMISSION, INVESTIGATION, PROCEDURE, RECOVERY)",
               description = "Advances the patient care stage and appends a chronological audit log event.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stage transitioned successfully", content = @Content(schema = @Schema(implementation = CareJourneyDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid stage name provided", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "Care journey not found", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<CareJourneyDto> updateJourneyStage(
            @Parameter(description = "Journey ID", required = true)
            @PathVariable("id") Long id,
            @Valid @RequestBody JourneyStageUpdateRequestDto request) {
        log.info("Updating journey id {} stage to {}", id, request != null ? request.getStage() : "null");
        return ResponseEntity.ok(careJourneyService.updateJourneyStage(id, request));
    }

    @GetMapping("/{id}/context")
    @Operation(summary = "Get insurance-aware context, guidance, questions and alerts for current stage",
               description = "Returns stage-specific guidance, questions for the caregiver to ask hospital staff, document checklists, and policy constraints.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stage guidance context retrieved", content = @Content(schema = @Schema(implementation = JourneyContextDto.class))),
            @ApiResponse(responseCode = "404", description = "Care journey not found", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<JourneyContextDto> getJourneyContext(
            @Parameter(description = "Journey ID", required = true)
            @PathVariable("id") Long id) {
        return ResponseEntity.ok(careJourneyService.getJourneyContext(id));
    }
}
