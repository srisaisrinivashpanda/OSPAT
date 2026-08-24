package com.hospitality;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospitality.ai.GeminiAIService;
import com.hospitality.dto.ExtractedPolicyDto;
import com.hospitality.dto.HospitalMatchResultDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GeminiAIServiceTest {

    @Mock
    private RestTemplate restTemplate;

    private GeminiAIService geminiAIService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        RestTemplateBuilder builder = mock(RestTemplateBuilder.class);
        when(builder.setConnectTimeout(any())).thenReturn(builder);
        when(builder.setReadTimeout(any())).thenReturn(builder);
        when(builder.build()).thenReturn(restTemplate);

        geminiAIService = new GeminiAIService(builder, objectMapper, 5000, 20000);
        ReflectionTestUtils.setField(geminiAIService, "apiKey", "test-gemini-api-key");
        ReflectionTestUtils.setField(geminiAIService, "model", "gemini-2.5-flash");
        ReflectionTestUtils.setField(geminiAIService, "baseUrl", "https://generativelanguage.googleapis.com");
    }

    @Test
    @DisplayName("isConfigured returns true when apiKey is present and non-empty")
    void testIsConfigured() {
        assertTrue(geminiAIService.isConfigured());
        ReflectionTestUtils.setField(geminiAIService, "apiKey", "");
        assertFalse(geminiAIService.isConfigured());
        ReflectionTestUtils.setField(geminiAIService, "apiKey", null);
        assertFalse(geminiAIService.isConfigured());
    }

    @Test
    @DisplayName("extractPolicyFromText parses valid Gemini JSON response")
    void testExtractPolicyFromText_ValidJson() {
        String geminiJson = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          {
                            "text": "{\\"insurerName\\": \\"Star Health Allied Insurance\\", \\"policyType\\": \\"Family Health Optima\\", \\"coverageLimit\\": 500000, \\"roomLimit\\": 5000, \\"roomCategory\\": \\"Semi-Private\\", \\"networkHospitals\\": [\\"Apex Multi-Specialty Hospital\\"], \\"exclusions\\": [\\"Cosmetic treatments excluded\\"], \\"otherConstraints\\": [\\"Pre-auth required\\"]}"
                          }
                        ]
                      }
                    }
                  ]
                }
                """;

        ResponseEntity<String> response = new ResponseEntity<>(geminiJson, HttpStatus.OK);
        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
                .thenReturn(response);

        ExtractedPolicyDto result = geminiAIService.extractPolicyFromText("Sample Document Text");

        assertNotNull(result);
        assertEquals("Star Health Allied Insurance", result.getInsurerName());
        assertEquals("Family Health Optima", result.getPolicyType());
        assertEquals(0, BigDecimal.valueOf(500000).compareTo(result.getCoverageLimit()));
        assertEquals(0, BigDecimal.valueOf(5000).compareTo(result.getRoomLimit()));
        assertEquals("Semi-Private", result.getRoomCategory());
        assertEquals(1, result.getNetworkHospitals().size());
        assertEquals("Apex Multi-Specialty Hospital", result.getNetworkHospitals().get(0));
    }

    @Test
    @DisplayName("extractPolicyFromText handles markdown code block formatting in Gemini response")
    void testExtractPolicyFromText_MarkdownWrappedJson() {
        String geminiJson = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          {
                            "text": "```json\\n{\\"insurerName\\": \\"HDFC ERGO Health Insurance\\", \\"coverageLimit\\": 1000000, \\"roomLimit\\": 8000}\\n```"
                          }
                        ]
                      }
                    }
                  ]
                }
                """;

        ResponseEntity<String> response = new ResponseEntity<>(geminiJson, HttpStatus.OK);
        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
                .thenReturn(response);

        ExtractedPolicyDto result = geminiAIService.extractPolicyFromText("Sample Document Text");

        assertNotNull(result);
        assertEquals("HDFC ERGO Health Insurance", result.getInsurerName());
        assertEquals(0, BigDecimal.valueOf(1000000).compareTo(result.getCoverageLimit()));
        assertEquals(0, BigDecimal.valueOf(8000).compareTo(result.getRoomLimit()));
    }

    @Test
    @DisplayName("extractPolicyFromText throws exception when Gemini returns HTTP error")
    void testExtractPolicyFromText_HttpError() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
                .thenThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR, "Server Error"));

        assertThrows(RuntimeException.class, () -> geminiAIService.extractPolicyFromText("Sample Document Text"));
    }

    @Test
    @DisplayName("extractPolicyFromText throws exception when API key is missing")
    void testExtractPolicyFromText_MissingApiKey() {
        ReflectionTestUtils.setField(geminiAIService, "apiKey", "");
        assertThrows(IllegalStateException.class, () -> geminiAIService.extractPolicyFromText("Sample Document Text"));
    }

    @Test
    @DisplayName("generateHospitalMatchExplanation generates and sanitizes explanation")
    void testGenerateHospitalMatchExplanation() {
        String geminiJson = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          {
                            "text": "Based on provided policy data, Apex Hospital is fully covered and recommended."
                          }
                        ]
                      }
                    }
                  ]
                }
                """;

        ResponseEntity<String> response = new ResponseEntity<>(geminiJson, HttpStatus.OK);
        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
                .thenReturn(response);

        HospitalMatchResultDto match = HospitalMatchResultDto.builder()
                .compatibilityScore(92)
                .isNetworkMatch(true)
                .matchingFactors(List.of("In network"))
                .build();

        String explanation = geminiAIService.generateHospitalMatchExplanation("Star Health", "Apex Hospital", match);

        assertNotNull(explanation);
        assertTrue(explanation.contains("within stated policy limits")); // sanitized from "fully covered"
        assertFalse(explanation.contains("fully covered"));
    }

    @Test
    @DisplayName("generateStageExplanation generates stage guidance")
    void testGenerateStageExplanation() {
        String geminiJson = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          {
                            "text": "For admission at Apex Hospital, please present patient ID and verify pre-authorization."
                          }
                        ]
                      }
                    }
                  ]
                }
                """;

        ResponseEntity<String> response = new ResponseEntity<>(geminiJson, HttpStatus.OK);
        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
                .thenReturn(response);

        String guidance = geminiAIService.generateStageExplanation("ADMISSION", "Star Health", "Apex Hospital", BigDecimal.valueOf(500000));
        assertNotNull(guidance);
        assertTrue(guidance.contains("Apex Hospital"));
    }
}
