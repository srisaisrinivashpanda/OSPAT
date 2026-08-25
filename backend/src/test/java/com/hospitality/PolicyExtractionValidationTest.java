package com.hospitality;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospitality.ai.DelegatingAIService;
import com.hospitality.ai.GeminiAIService;
import com.hospitality.ai.HeuristicAIService;
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

    private DelegatingAIService aiService;
    private HeuristicAIService heuristicAIService;
    private OllamaAIService ollamaAIService;
    private GeminiAIService geminiAIService;

    @BeforeEach
    void setUp() {
        ObjectMapper objectMapper = new ObjectMapper();
        HeuristicPolicyExtractor heuristicExtractor = new HeuristicPolicyExtractor();
        heuristicAIService = new HeuristicAIService(heuristicExtractor);

        geminiAIService = new GeminiAIService(new RestTemplateBuilder(), objectMapper, 500, 500);
        ReflectionTestUtils.setField(geminiAIService, "apiKey", "");

        ollamaAIService = new OllamaAIService(new RestTemplateBuilder(), objectMapper, 500, 500);
        ReflectionTestUtils.setField(ollamaAIService, "ollamaBaseUrl", "http://localhost:11434");
        ReflectionTestUtils.setField(ollamaAIService, "ollamaModel", "qwen2.5:7b");

        aiService = new DelegatingAIService(geminiAIService, ollamaAIService, heuristicAIService);
        ReflectionTestUtils.setField(aiService, "configuredProvider", "ollama");
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
