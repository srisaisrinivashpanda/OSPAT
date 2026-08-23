package com.hospitality.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyUpdateRequestDto {
    @NotBlank(message = "Insurer name is required")
    private String insurerName;

    private String policyType;

    @NotNull(message = "Coverage limit is required")
    @PositiveOrZero(message = "Coverage limit must be non-negative")
    private BigDecimal coverageLimit;

    @PositiveOrZero(message = "Remaining coverage must be non-negative")
    private BigDecimal remainingCoverage;

    @NotNull(message = "Room limit is required")
    @PositiveOrZero(message = "Room limit must be non-negative")
    private BigDecimal roomLimit;

    private String roomCategory;

    @Builder.Default
    private Boolean confirmed = true;

    @Builder.Default
    private List<String> exclusions = new ArrayList<>();

    @Builder.Default
    private List<Long> networkHospitalIds = new ArrayList<>();
}
