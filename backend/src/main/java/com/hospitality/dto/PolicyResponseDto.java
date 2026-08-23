package com.hospitality.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Insurance policy details with confirmed terms and network tie-ups")
public class PolicyResponseDto {

    @Schema(description = "Policy ID", example = "1")
    private Long id;

    @Schema(description = "Associated patient ID", example = "1")
    private Long patientId;

    @Schema(description = "Patient full name", example = "Rajesh Verma")
    private String patientName;

    @Schema(description = "Insurance provider name", example = "Star Health Allied Insurance")
    private String insurerName;

    @Schema(description = "Policy product / plan name", example = "Family Health Optima Comprehensive")
    private String policyType;

    @Schema(description = "Stated sum insured / coverage limit", example = "500000.00")
    private BigDecimal coverageLimit;

    @Schema(description = "Indicative remaining coverage balance based on provided policy data. Does not reflect real-time live insurer claim balance.", example = "500000.00")
    private BigDecimal remainingCoverage;

    @Schema(description = "Indicative balance alias", example = "500000.00")
    public BigDecimal getIndicativeRemainingBalance() {
        return remainingCoverage;
    }

    @Schema(description = "Stated daily room rent limit", example = "5000.00")
    private BigDecimal roomLimit;

    @Schema(description = "Eligible room category from schedule", example = "Semi-Private Room (Twin Sharing AC)")
    private String roomCategory;

    @Schema(description = "Policy status: DRAFT or ACTIVE", example = "ACTIVE")
    private String policyStatus;

    @Schema(description = "Source document file name", example = "StarHealth_FamilyOptima_Sample.pdf")
    private String sourceDocument;

    @Schema(description = "True if user reviewed and confirmed policy parameters", example = "true")
    private Boolean confirmed;

    @Schema(description = "Creation timestamp")
    private OffsetDateTime createdAt;

    @Schema(description = "Last update timestamp")
    private OffsetDateTime updatedAt;

    @Schema(description = "Key policy terms and exclusions from schedule")
    @Builder.Default
    private List<String> exclusions = new ArrayList<>();

    @Schema(description = "Mapped network hospitals")
    @Builder.Default
    private List<NetworkHospitalItemDto> networkHospitals = new ArrayList<>();
}
