package com.hospitality.controller;

import com.hospitality.dto.ErrorResponseDto;
import com.hospitality.dto.ExtractedPolicyDto;
import com.hospitality.dto.PolicyResponseDto;
import com.hospitality.dto.PolicyUpdateRequestDto;
import com.hospitality.policy.PolicyService;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Insurance Policy Management", description = "Endpoints for uploading, extracting, confirming, and inspecting insurance policies")
public class PolicyController {

    private final PolicyService policyService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload and extract insurance policy document (PDF)",
               description = "Extracts policy terms, room rent limits, coverage sums, and exclusions from an uploaded health insurance PDF schedule.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "PDF successfully extracted and saved in draft mode", content = @Content(schema = @Schema(implementation = ExtractedPolicyDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid or empty file provided", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "Patient not found", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
            @ApiResponse(responseCode = "413", description = "File size exceeds 25MB limit", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<ExtractedPolicyDto> uploadAndExtractPdf(
            @Parameter(description = "Health insurance PDF policy document", required = true)
            @RequestParam("file") MultipartFile file,
            @Parameter(description = "Patient ID for whom policy is being uploaded (default: 1)")
            @RequestParam(value = "patientId", defaultValue = "1") Long patientId) throws IOException {
        log.info("Received PDF upload: {} for patientId {}", file != null ? file.getOriginalFilename() : "null", patientId);
        ExtractedPolicyDto extracted = policyService.extractAndSavePolicyFromPdf(file, patientId);
        return ResponseEntity.ok(extracted);
    }

    @PutMapping("/{id}/confirm")
    @Operation(summary = "Confirm and activate extracted insurance policy with user edits",
               description = "Reviews draft policy parameters, applies user corrections, and marks policy as ACTIVE for matching.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Policy confirmed and activated", content = @Content(schema = @Schema(implementation = PolicyResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation failure on policy parameters", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "Policy not found", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<PolicyResponseDto> confirmPolicy(
            @Parameter(description = "Policy ID to confirm", required = true)
            @PathVariable("id") Long id,
            @Valid @RequestBody PolicyUpdateRequestDto request) {
        log.info("Confirming policy id {}", id);
        PolicyResponseDto confirmed = policyService.confirmAndActivatePolicy(id, request);
        return ResponseEntity.ok(confirmed);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get insurance policy details by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Policy details retrieved", content = @Content(schema = @Schema(implementation = PolicyResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "Policy not found", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<PolicyResponseDto> getPolicyById(
            @Parameter(description = "Policy ID", required = true)
            @PathVariable("id") Long id) {
        return ResponseEntity.ok(policyService.getPolicyById(id));
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get all policies for a patient")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of policies retrieved")
    })
    public ResponseEntity<List<PolicyResponseDto>> getPoliciesForPatient(
            @Parameter(description = "Patient ID", required = true)
            @PathVariable("patientId") Long patientId) {
        return ResponseEntity.ok(policyService.getPoliciesForPatient(patientId));
    }

    @GetMapping("/patient/{patientId}/active")
    @Operation(summary = "Get currently active/confirmed policy for a patient")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active policy retrieved", content = @Content(schema = @Schema(implementation = PolicyResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "No active policy found for patient", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<PolicyResponseDto> getActivePolicyForPatient(
            @Parameter(description = "Patient ID", required = true)
            @PathVariable("patientId") Long patientId) {
        return ResponseEntity.ok(policyService.getActivePolicyForPatient(patientId));
    }
}
