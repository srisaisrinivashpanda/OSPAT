package com.hospitality.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Structured decision-support guidance, document requirements, and caregiver questions for a care stage")
public class StageGuidanceDto {

    @Schema(description = "Stage identifier: ADMISSION, INVESTIGATION, PROCEDURE, or RECOVERY", example = "ADMISSION")
    private String stage;

    @Schema(description = "User-friendly stage title", example = "Stage 1: Admission & Pre-Authorization")
    private String stageTitle;

    @Schema(description = "Stage summary description", example = "Patient registration, room assignment, and cashless pre-authorization submission.")
    private String description;

    @Schema(description = "Non-binding insurance insights based on provided policy data")
    @Builder.Default
    private List<String> insuranceInsights = new ArrayList<>();

    @Schema(description = "Potential policy considerations, out-of-pocket risks, or exclusions to monitor")
    @Builder.Default
    private List<String> potentialConstraints = new ArrayList<>();

    @Schema(description = "Actionable questions for the patient/caregiver to ask the hospital TPA desk or billing counter")
    @Builder.Default
    private List<String> caregiverQuestionsToAsk = new ArrayList<>();

    @Schema(description = "Checklist of documents typically needed at this stage")
    @Builder.Default
    private List<String> requiredDocuments = new ArrayList<>();

    @Schema(description = "Standard decision-support disclaimer", example = "Information shown is indicative and based on provided policy data for decision support only. It does not constitute medical advice or a binding claim guarantee.")
    private String disclaimer;
}
