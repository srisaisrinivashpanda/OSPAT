package com.hospitality.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Evaluation of a specific hospital room category against stated insurance policy limits")
public class RoomEvaluationDto {

    @Schema(description = "Room category ID", example = "1")
    private Long roomId;

    @Schema(description = "Room category name", example = "Semi-Private Room (Twin Sharing AC)")
    private String roomName;

    @Schema(description = "Hospital daily published room cost", example = "4000.00")
    private BigDecimal dailyCost;

    @Schema(description = "Stated daily policy limit from provided policy data", example = "5000.00")
    private BigDecimal policyLimit;

    @Schema(description = "Cost difference (dailyCost - policyLimit). Positive indicates estimated daily out-of-pocket room excess.", example = "-1000.00")
    private BigDecimal costDifference;

    @Schema(description = "True if daily cost is within stated policy limit, false otherwise", example = "true")
    private Boolean withinPolicyLimit;

    @Schema(description = "Indicates whether the room is currently listed as available", example = "true")
    private Boolean available;

    @Schema(description = "Compatibility status: WITHIN_STATED_LIMIT, POLICY_CONSIDERATION, EXCEEDS_STATED_LIMIT, or INFORMATION_UNAVAILABLE", example = "WITHIN_STATED_LIMIT")
    private String compatibilityStatus;

    @Schema(description = "Non-binding advisory note for decision support", example = "Daily room rent is within stated policy limit of ₹5000/day. Final reimbursement subject to insurer terms.")
    private String advisoryNote;
}
