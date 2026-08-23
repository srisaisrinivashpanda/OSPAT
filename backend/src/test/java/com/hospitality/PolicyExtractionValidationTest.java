package com.hospitality;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospitality.ai.HeuristicPolicyExtractor;
import com.hospitality.ai.OllamaAIService;
import com.hospitality.dto.ExtractedPolicyDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class PolicyExtractionValidationTest {

    private OllamaAIService aiService;
    private HeuristicPolicyExtractor heuristicExtractor;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        heuristicExtractor = new HeuristicPolicyExtractor();
        aiService = new OllamaAIService(new RestTemplateBuilder(), objectMapper, heuristicExtractor, 500, 500);
        ReflectionTestUtils.setField(aiService, "ollamaBaseUrl", "http://localhost:11434");
        ReflectionTestUtils.setField(aiService, "ollamaModel", "qwen2.5:7b");
    }

    @Test
    @DisplayName("When Ollama service is unreachable, extraction safely falls back to HeuristicPolicyExtractor")
    void testExtractionFallbackWhenOllamaUnavailable() {
        String documentText = """
                STAR HEALTH AND ALLIED INSURANCE COMPANY LIMITED
                Policy Plan: Family Health Optima Comprehensive
                Sum Insured: Rs. 5,00,000
                Daily Room Rent Limit: Up to Rs. 5,000 per day
                Eligible Room Category: Semi-Private Room (Twin Sharing)
                Network Hospital: Apex Multi-Specialty Hospital
                """;

        ExtractedPolicyDto result = aiService.extractPolicyFromText(documentText);

        assertNotNull(result);
        assertEquals("Star Health Allied Insurance", result.getInsurerName());
        assertEquals("Family Health Optima Comprehensive", result.getPolicyType());
        assertEquals(0, BigDecimal.valueOf(500000).compareTo(result.getCoverageLimit()));
        assertEquals(0, BigDecimal.valueOf(5000).compareTo(result.getRoomLimit()));
    }

    @Test
    @DisplayName("AI explanation uses safe non-guaranteed language and disclaimers")
    void testExplanationSafety() {
        String stageExpl = aiService.generateStageExplanation("ADMISSION", "Star Health", "Apex Hospital", BigDecimal.valueOf(500000));
        assertNotNull(stageExpl);
        assertTrue(stageExpl.contains("Based on the provided policy data"));
        assertTrue(stageExpl.contains("indicative coverage balance"));
        assertFalse(stageExpl.contains("fully covered"));
        assertFalse(stageExpl.contains("guaranteed reimbursement"));
    }
}
