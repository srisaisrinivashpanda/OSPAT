package com.hospitality.controller;

import com.hospitality.ai.AIService;
import com.hospitality.dto.AIExplainRequestDto;
import com.hospitality.dto.AIExplainResponseDto;
import com.hospitality.dto.ErrorResponseDto;
import com.hospitality.dto.HospitalMatchResultDto;
import com.hospitality.entity.Hospital;
import com.hospitality.entity.InsurancePolicy;
import com.hospitality.matching.HospitalMatchingEngine;
import com.hospitality.repository.HospitalRepository;
import com.hospitality.repository.InsurancePolicyRepository;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "AI Explanation Engine", description = "Endpoints for AI-driven plain-English explanations and policy insights")
public class AIController {

    private final AIService aiService;
    private final InsurancePolicyRepository policyRepository;
    private final HospitalRepository hospitalRepository;
    private final HospitalMatchingEngine matchingEngine;

    @PostMapping("/explain")
    @Operation(summary = "Generate safe plain-English explanation for hospital match or care stage",
               description = "Synthesizes deterministic match scores or stage requirements into clear, non-technical explanations with required medical/claim disclaimers.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Explanation generated successfully", content = @Content(schema = @Schema(implementation = AIExplainResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Malformed request payload", content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<AIExplainResponseDto> explainMatchOrStage(@RequestBody(required = false) AIExplainRequestDto request) {
        InsurancePolicy policy = (request != null && request.getPolicyId() != null)
                ? policyRepository.findByIdWithDetails(request.getPolicyId()).orElse(null) 
                : null;
        Hospital hospital = (request != null && request.getHospitalId() != null)
                ? hospitalRepository.findByIdWithDetails(request.getHospitalId()).orElse(null) 
                : null;

        String explanation;
        if (request != null && request.getStage() != null && !request.getStage().isBlank()) {
            explanation = aiService.generateStageExplanation(
                    request.getStage(),
                    policy != null ? policy.getInsurerName() : null,
                    hospital != null ? hospital.getName() : null,
                    policy != null ? policy.getRemainingCoverage() : null
            );
        } else if (hospital != null) {
            HospitalMatchResultDto match = matchingEngine.matchHospital(policy, hospital, null);
            explanation = aiService.generateHospitalMatchExplanation(
                    policy != null ? policy.getInsurerName() : null,
                    hospital.getName(),
                    match
            );
        } else {
            explanation = "Based on provided policy data, active coverage is available. Please verify network status before planned hospitalization.";
        }

        return ResponseEntity.ok(AIExplainResponseDto.builder()
                .explanation(explanation)
                .disclaimer("This explanation is intended for decision support only and does not constitute medical advice or a binding claim guarantee.")
                .providerUsed(aiService.getProviderName())
                .build());
    }
}
