package com.hospitality.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Transparent deterministic compatibility matching result between an insurance policy and a hospital")
public class HospitalMatchResultDto {

    @Schema(description = "Hospital ID", example = "1")
    private Long hospitalId;

    @Schema(description = "Hospital name", example = "Apex Multi-Specialty Hospital")
    private String hospitalName;

    @Schema(description = "Hospital locality / city", example = "Indiranagar, Bengaluru")
    private String location;

    @Schema(description = "Detailed hospital street address", example = "12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038")
    private String address;

    @Schema(description = "Network status classification: IN_NETWORK or OUT_OF_NETWORK", example = "IN_NETWORK")
    private String networkStatus;

    @Schema(description = "True if listed as network hospital under provided policy schedule", example = "true")
    private Boolean isNetworkMatch;

    @Schema(description = "Overall compatibility score from 0 to 100 calculated deterministically", example = "92")
    private Integer compatibilityScore;

    @Schema(description = "Total score alias (0 to 100)", example = "92")
    private Integer totalScore;

    @Schema(description = "Sub-score for network status (0 to 40)", example = "40")
    private Integer networkScore;

    @Schema(description = "Sub-score for room limit compatibility (0 to 30)", example = "30")
    private Integer roomScore;

    @Schema(description = "Sub-score for requested clinical specialty alignment (0 to 20)", example = "20")
    private Integer specialtyScore;

    @Schema(description = "Sub-score for policy terms and baseline constraints (0 to 10)", example = "10")
    private Integer policyConstraintScore;

    @Schema(description = "Categorical score rating: HIGH_COMPATIBILITY, MODERATE_COMPATIBILITY, or LOW_COMPATIBILITY", example = "HIGH_COMPATIBILITY")
    private String scoreRating;

    @Schema(description = "Positive matching factors evaluated by the deterministic engine")
    @Builder.Default
    private List<String> matchingFactors = new ArrayList<>();

    @Schema(description = "Potential policy considerations or warnings evaluated by the deterministic engine")
    @Builder.Default
    private List<String> considerations = new ArrayList<>();

    @Schema(description = "Caregiver-friendly non-technical explanation summarizing deterministic findings", example = "Based on provided policy data, Apex Multi-Specialty Hospital scored 92% compatibility...")
    private String caregiverSummary;

    @Schema(description = "Clinical specialties supported at this hospital")
    @Builder.Default
    private List<String> specialties = new ArrayList<>();

    @Schema(description = "Detailed evaluations across all available room categories")
    @Builder.Default
    private List<RoomEvaluationDto> roomEvaluations = new ArrayList<>();

    @Schema(description = "Lowest daily cost among rooms within stated policy limits", example = "4000.00")
    private BigDecimal lowestEligibleRoomCost;

    @Schema(description = "Highest daily room cost at this hospital", example = "10000.00")
    private BigDecimal highestRoomCost;

    @Schema(description = "True if at least one room category is within stated policy limits", example = "true")
    private Boolean hasEligibleRoom;
}
