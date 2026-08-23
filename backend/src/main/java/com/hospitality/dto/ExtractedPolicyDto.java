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
@Schema(description = "Structured policy parameters extracted from an uploaded insurance document")
public class ExtractedPolicyDto {

    @Schema(description = "Extracted insurer name", example = "Star Health Allied Insurance")
    private String insurerName;

    @Schema(description = "Extracted plan name", example = "Family Health Optima Comprehensive")
    private String policyType;

    @Schema(description = "Stated sum insured / coverage limit", example = "500000.00")
    private BigDecimal coverageLimit;

    @Schema(description = "Stated daily room rent limit", example = "5000.00")
    private BigDecimal roomLimit;

    @Schema(description = "Eligible room category from schedule", example = "Semi-Private Room (Twin Sharing AC)")
    private String roomCategory;

    @Schema(description = "Network hospitals mentioned in the policy document")
    @Builder.Default
    private List<String> networkHospitals = new ArrayList<>();

    @Schema(description = "Key policy terms and exclusions extracted")
    @Builder.Default
    private List<String> exclusions = new ArrayList<>();

    @Schema(description = "Other constraints and pre-authorization terms extracted")
    @Builder.Default
    private List<String> otherConstraints = new ArrayList<>();

    @Schema(description = "Raw text extracted from PDF source")
    private String rawText;

    @Schema(description = "Confidence estimate of the extraction (0.00 to 1.00)", example = "0.95")
    private BigDecimal confidence;

    @Schema(description = "Draft policy ID generated in database", example = "1")
    private Long policyId;
}
