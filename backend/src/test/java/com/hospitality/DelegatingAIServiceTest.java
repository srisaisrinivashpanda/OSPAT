package com.hospitality;

import com.hospitality.ai.DelegatingAIService;
import com.hospitality.ai.GeminiAIService;
import com.hospitality.ai.HeuristicAIService;
import com.hospitality.ai.OllamaAIService;
import com.hospitality.dto.ExtractedPolicyDto;
import com.hospitality.dto.HospitalMatchResultDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DelegatingAIServiceTest {

    @Mock
    private GeminiAIService geminiAIService;

    @Mock
    private OllamaAIService ollamaAIService;

    @Mock
    private HeuristicAIService heuristicAIService;

    private DelegatingAIService delegatingAIService;

    @BeforeEach
    void setUp() {
        delegatingAIService = new DelegatingAIService(geminiAIService, ollamaAIService, heuristicAIService);
    }

    @Test
    @DisplayName("When Gemini is active and configured, delegates extraction to Gemini")
    void testGeminiActive_Success() {
        ReflectionTestUtils.setField(delegatingAIService, "configuredProvider", "gemini");
        when(geminiAIService.isConfigured()).thenReturn(true);

        ExtractedPolicyDto geminiDto = ExtractedPolicyDto.builder()
                .insurerName("Star Health Allied Insurance")
                .policyType("Family Health Optima")
                .coverageLimit(BigDecimal.valueOf(500000))
                .roomLimit(BigDecimal.valueOf(5000))
                .build();
        when(geminiAIService.extractPolicyFromText("Document text")).thenReturn(geminiDto);

        ExtractedPolicyDto result = delegatingAIService.extractPolicyFromText("Document text");

        assertNotNull(result);
        assertEquals("Star Health Allied Insurance", result.getInsurerName());
        verify(geminiAIService, times(1)).extractPolicyFromText("Document text");
        verify(heuristicAIService, never()).extractPolicyFromText(anyString());
    }

    @Test
    @DisplayName("When Gemini throws exception, seamlessly falls back to HeuristicAIService")
    void testGeminiFailure_FallbackToHeuristic() {
        ReflectionTestUtils.setField(delegatingAIService, "configuredProvider", "gemini");
        when(geminiAIService.isConfigured()).thenReturn(true);
        when(geminiAIService.extractPolicyFromText("Document text"))
                .thenThrow(new RuntimeException("Gemini API Rate Limit Exceeded 429"));

        ExtractedPolicyDto heuristicDto = ExtractedPolicyDto.builder()
                .insurerName("Star Health Allied Insurance")
                .coverageLimit(BigDecimal.valueOf(500000))
                .roomLimit(BigDecimal.valueOf(5000))
                .build();
        when(heuristicAIService.extractPolicyFromText("Document text")).thenReturn(heuristicDto);

        ExtractedPolicyDto result = delegatingAIService.extractPolicyFromText("Document text");

        assertNotNull(result);
        assertEquals("Star Health Allied Insurance", result.getInsurerName());
        verify(heuristicAIService, times(1)).extractPolicyFromText("Document text");
    }

    @Test
    @DisplayName("When Gemini key is missing, immediately routes to HeuristicAIService without error")
    void testGeminiNotConfigured_DirectHeuristicFallback() {
        ReflectionTestUtils.setField(delegatingAIService, "configuredProvider", "gemini");
        when(geminiAIService.isConfigured()).thenReturn(false);

        ExtractedPolicyDto heuristicDto = ExtractedPolicyDto.builder()
                .insurerName("HDFC ERGO Health Insurance")
                .coverageLimit(BigDecimal.valueOf(1000000))
                .build();
        when(heuristicAIService.extractPolicyFromText("Document text")).thenReturn(heuristicDto);

        ExtractedPolicyDto result = delegatingAIService.extractPolicyFromText("Document text");

        assertNotNull(result);
        assertEquals("HDFC ERGO Health Insurance", result.getInsurerName());
        verify(geminiAIService, never()).extractPolicyFromText(anyString());
        verify(heuristicAIService, times(1)).extractPolicyFromText("Document text");
    }

    @Test
    @DisplayName("When provider is heuristic, routes directly to HeuristicAIService")
    void testHeuristicProvider_DirectRoute() {
        ReflectionTestUtils.setField(delegatingAIService, "configuredProvider", "heuristic");

        ExtractedPolicyDto heuristicDto = ExtractedPolicyDto.builder()
                .insurerName("Care Health Insurance")
                .coverageLimit(BigDecimal.valueOf(750000))
                .build();
        when(heuristicAIService.extractPolicyFromText("Document text")).thenReturn(heuristicDto);

        ExtractedPolicyDto result = delegatingAIService.extractPolicyFromText("Document text");

        assertNotNull(result);
        assertEquals("Care Health Insurance", result.getInsurerName());
        verify(geminiAIService, never()).extractPolicyFromText(anyString());
        verify(ollamaAIService, never()).extractPolicyFromText(anyString());
        verify(heuristicAIService, times(1)).extractPolicyFromText("Document text");
    }

    @Test
    @DisplayName("When provider is ollama and fails, falls back to HeuristicAIService")
    void testOllamaFailure_FallbackToHeuristic() {
        ReflectionTestUtils.setField(delegatingAIService, "configuredProvider", "ollama");
        when(ollamaAIService.extractPolicyFromText("Document text"))
                .thenThrow(new RuntimeException("Connection refused"));

        ExtractedPolicyDto heuristicDto = ExtractedPolicyDto.builder()
                .insurerName("Star Health Allied Insurance")
                .build();
        when(heuristicAIService.extractPolicyFromText("Document text")).thenReturn(heuristicDto);

        ExtractedPolicyDto result = delegatingAIService.extractPolicyFromText("Document text");

        assertNotNull(result);
        assertEquals("Star Health Allied Insurance", result.getInsurerName());
        verify(heuristicAIService, times(1)).extractPolicyFromText("Document text");
    }

    @Test
    @DisplayName("Hospital match explanation falls back to heuristic on Gemini failure")
    void testExplanationFallback() {
        ReflectionTestUtils.setField(delegatingAIService, "configuredProvider", "gemini");
        when(geminiAIService.isConfigured()).thenReturn(true);
        when(geminiAIService.generateHospitalMatchExplanation(any(), any(), any()))
                .thenThrow(new RuntimeException("Timeout"));

        HospitalMatchResultDto match = HospitalMatchResultDto.builder().compatibilityScore(85).build();
        when(heuristicAIService.generateHospitalMatchExplanation(any(), any(), any()))
                .thenReturn("Deterministic explanation for Apex Hospital");

        String explanation = delegatingAIService.generateHospitalMatchExplanation("Star Health", "Apex Hospital", match);

        assertNotNull(explanation);
        assertEquals("Deterministic explanation for Apex Hospital", explanation);
        verify(heuristicAIService, times(1)).generateHospitalMatchExplanation(any(), any(), any());
    }

    @Test
    @DisplayName("Provider name reflects active provider and fallback status")
    void testProviderName() {
        ReflectionTestUtils.setField(delegatingAIService, "configuredProvider", "gemini");
        when(geminiAIService.isConfigured()).thenReturn(true);
        when(geminiAIService.getProviderName()).thenReturn("Google Gemini (gemini-2.5-flash)");
        assertTrue(delegatingAIService.getProviderName().contains("Google Gemini"));

        when(geminiAIService.isConfigured()).thenReturn(false);
        assertTrue(delegatingAIService.getProviderName().contains("Deterministic Heuristic Engine"));

        ReflectionTestUtils.setField(delegatingAIService, "configuredProvider", "heuristic");
        when(heuristicAIService.getProviderName()).thenReturn("Deterministic Heuristic Engine");
        assertEquals("Deterministic Heuristic Engine", delegatingAIService.getProviderName());
    }
}
