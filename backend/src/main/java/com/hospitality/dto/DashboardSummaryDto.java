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
@Schema(description = "Aggregated patient dashboard snapshot with indicative financial and care journey metrics")
public class DashboardSummaryDto {

    @Schema(description = "Patient ID", example = "1")
    private Long patientId;

    @Schema(description = "Patient name", example = "Rajesh Verma")
    private String patientName;

    @Schema(description = "Patient age", example = "58")
    private Integer patientAge;

    @Schema(description = "Currently active confirmed insurance policy")
    private PolicyResponseDto activePolicy;

    @Schema(description = "Active inpatient care journey if initiated")
    private CareJourneyDto activeJourney;

    @Schema(description = "Guidance for current care journey stage")
    private StageGuidanceDto currentStageGuidance;

    @Schema(description = "Total coverage limit stated in policy schedule", example = "500000.00")
    private BigDecimal totalCoverageLimit;

    @Schema(description = "Indicative remaining coverage balance based on provided policy data and demo tracking. Does not reflect live insurer claim adjudication.", example = "500000.00")
    private BigDecimal remainingCoverage;

    @Schema(description = "Indicative remaining balance alias based on provided policy data", example = "500000.00")
    public BigDecimal getIndicativeRemainingBalance() {
        return remainingCoverage;
    }

    @Schema(description = "Stated daily room rent cap from policy", example = "5000.00")
    private BigDecimal roomDailyLimit;

    @Schema(description = "Eligible room category from policy", example = "Semi-Private Room (Twin Sharing AC)")
    private String roomCategory;

    @Schema(description = "Count of affiliated network hospitals under policy", example = "6")
    private Integer networkHospitalsCount;

    @Schema(description = "Total hospital facilities listed in database", example = "8")
    private Integer totalHospitalsAvailable;

    @Schema(description = "Recent non-guaranteed policy and journey alerts")
    @Builder.Default
    private List<String> recentAlerts = new ArrayList<>();

    @Schema(description = "Recommended decision-support actions for the caregiver")
    @Builder.Default
    private List<String> recommendedActions = new ArrayList<>();
}
