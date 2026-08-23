package com.hospitality.controller;

import com.hospitality.dto.ErrorResponseDto;
import com.hospitality.dto.HospitalDto;
import com.hospitality.dto.HospitalMatchRequestDto;
import com.hospitality.dto.HospitalMatchResultDto;
import com.hospitality.hospital.HospitalService;
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

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Hospital Matching & Search", description = "Endpoints for retrieving hospitals and executing deterministic policy matching")
public class HospitalController {

    private final HospitalService hospitalService;

    @GetMapping
    @Operation(summary = "Get all hospitals with room categories and specialties",
               description = "Returns complete list of hospital facilities along with published room costs and clinical specialties.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of hospitals retrieved")
    })
    public ResponseEntity<List<HospitalDto>> getAllHospitals() {
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific hospital details by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hospital details retrieved", content = @Content(schema = @Schema(implementation = HospitalDto.class))),
            @ApiResponse(responseCode = "404", description = "Hospital not found", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<HospitalDto> getHospitalById(
            @Parameter(description = "Hospital ID", required = true)
            @PathVariable("id") Long id) {
        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }

    @PostMapping("/match")
    @Operation(summary = "Execute deterministic hospital matching against active or specified policy",
               description = "Computes deterministic compatibility score (0-100) using a multi-factor rule engine (network status, room limit adherence, specialty alignment, and policy constraints).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Matching results calculated successfully")
    })
    public ResponseEntity<List<HospitalMatchResultDto>> matchHospitals(@RequestBody(required = false) HospitalMatchRequestDto request) {
        Long policyId = request != null ? request.getPolicyId() : null;
        Long patientId = request != null && request.getPatientId() != null ? request.getPatientId() : 1L;
        String specialty = request != null ? request.getSpecialty() : null;
        String location = request != null ? request.getLocation() : null;

        List<HospitalMatchResultDto> results = hospitalService.matchHospitals(policyId, patientId, specialty, location);
        return ResponseEntity.ok(results);
    }
}
