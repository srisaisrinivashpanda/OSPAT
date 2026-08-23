package com.hospitality.ai;

import com.hospitality.dto.ExtractedPolicyDto;
import com.hospitality.dto.HospitalMatchResultDto;

public interface AIService {
    
    /**
     * Extracts structured policy constraints from raw text.
     */
    ExtractedPolicyDto extractPolicyFromText(String rawText);

    /**
     * Generates a non-technical, safe caregiver explanation for hospital compatibility.
     */
    String generateHospitalMatchExplanation(String insurerName, String hospitalName, HospitalMatchResultDto matchResult);

    /**
     * Generates stage-specific insurance awareness notes for a caregiver.
     */
    String generateStageExplanation(String stage, String insurerName, String hospitalName, java.math.BigDecimal remainingCoverage);

    /**
     * Returns the name of the active AI provider (e.g., "Ollama (Qwen 2.5 7B)" or "Deterministic Fallback Engine").
     */
    String getProviderName();
}
