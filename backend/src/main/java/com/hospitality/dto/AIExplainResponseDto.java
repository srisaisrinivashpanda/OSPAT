package com.hospitality.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "AI-generated caregiver explanation with non-medical disclaimer and provider trace")
public class AIExplainResponseDto {

    @Schema(description = "Caregiver-friendly non-binding explanation of policy-hospital compatibility or care stage", example = "Based on provided policy data, Apex Multi-Specialty Hospital appears compatible because it is listed as an in-network facility...")
    private String explanation;

    @Schema(description = "Decision-support disclaimer explicitly stating that output does not constitute medical advice or a binding claim guarantee", example = "This explanation is intended for decision support and does not constitute medical advice or a binding claim guarantee.")
    private String disclaimer;

    @Schema(description = "Active AI provider name or fallback engine used for generation", example = "Ollama (qwen2.5:7b) with Deterministic Fallback")
    private String providerUsed;
}
