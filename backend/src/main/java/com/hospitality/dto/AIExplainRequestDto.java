package com.hospitality.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIExplainRequestDto {
    private Long policyId;
    private Long hospitalId;
    private String stage;
}
