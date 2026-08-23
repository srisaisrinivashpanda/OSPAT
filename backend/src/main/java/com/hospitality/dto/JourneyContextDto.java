package com.hospitality.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Stage-aware contextual guidance and indicative policy parameters for an active care journey")
public class JourneyContextDto {

    @Schema(description = "Care journey ID", example = "1")
    private Long journeyId;

    @Schema(description = "Patient ID", example = "1")
    private Long patientId;

    @Schema(description = "Patient name", example = "Rajesh Verma")
    private String patientName;

    @Schema(description = "Assigned hospital ID", example = "1")
    private Long hospitalId;

    @Schema(description = "Hospital name", example = "Apex Multi-Specialty Hospital")
    private String hospitalName;

    @Schema(description = "Hospital locality / location", example = "Indiranagar, Bengaluru")
    private String hospitalLocation;

    @Schema(description = "Current active journey stage: ADMISSION, INVESTIGATION, PROCEDURE, or RECOVERY", example = "ADMISSION")
    private String currentStage;

    @Schema(description = "Total stated policy coverage limit", example = "500000.00")
    private BigDecimal coverageLimit;

    @Schema(description = "Indicative remaining balance based on provided policy data. Does not reflect live insurer claims adjudication.", example = "500000.00")
    private BigDecimal remainingCoverage;

    @Schema(description = "Indicative balance alias", example = "500000.00")
    public BigDecimal getIndicativeRemainingBalance() {
        return remainingCoverage;
    }

    @Schema(description = "Stated daily room rent limit", example = "5000.00")
    private BigDecimal roomLimit;

    @Schema(description = "Network status classification: IN_NETWORK or OUT_OF_NETWORK", example = "IN_NETWORK")
    private String networkStatus;

    @Schema(description = "Stage-specific insurance awareness notes, checklists, and caregiver questions")
    private StageGuidanceDto currentStageGuidance;
}
