package com.hospitality.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospitality.dto.ExtractedPolicyDto;
import com.hospitality.dto.HospitalMatchResultDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.*;

@Service("geminiAIService")
@Slf4j
public class GeminiAIService implements AIService {

    @Value("${hospitality.ai.gemini.api-key:}")
    private String apiKey;

    @Value("${hospitality.ai.gemini.model:gemini-2.5-flash}")
    private String model;

    @Value("${hospitality.ai.gemini.base-url:https://generativelanguage.googleapis.com}")
    private String baseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiAIService(RestTemplateBuilder builder,
                            ObjectMapper objectMapper,
                            @Value("${hospitality.ai.gemini.connect-timeout-ms:5000}") long connectTimeout,
                            @Value("${hospitality.ai.gemini.read-timeout-ms:20000}") long readTimeout) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofMillis(connectTimeout))
                .setReadTimeout(Duration.ofMillis(readTimeout))
                .build();
        this.objectMapper = objectMapper;
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    @Override
    public ExtractedPolicyDto extractPolicyFromText(String rawText) {
        if (!isConfigured()) {
            throw new IllegalStateException("Gemini API key is not configured");
        }
        if (rawText == null || rawText.isBlank()) {
            throw new IllegalArgumentException("Raw text must not be empty");
        }

        try {
            log.info("Calling Google Gemini API ({}) for structured policy extraction", model);
            String prompt = buildExtractionPrompt(rawText);

            Map<String, Object> contentPart = Map.of("text", prompt);
            Map<String, Object> contents = Map.of("role", "user", "parts", List.of(contentPart));
            Map<String, Object> generationConfig = Map.of(
                    "responseMimeType", "application/json",
                    "temperature", 0.1
            );

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(contents));
            requestBody.put("generationConfig", generationConfig);

            String responseText = executeGeminiRequest(requestBody);
            log.debug("Gemini extraction raw text: {}", responseText);

            String cleanedJson = stripMarkdownCodeBlocks(responseText);
            JsonNode parsed = objectMapper.readTree(cleanedJson);
            return parseAndValidateExtraction(parsed, rawText);
        } catch (Exception e) {
            log.warn("Gemini policy extraction failed: {}", e.getMessage());
            throw new RuntimeException("Gemini policy extraction failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateHospitalMatchExplanation(String insurerName, String hospitalName, HospitalMatchResultDto matchResult) {
        if (!isConfigured()) {
            throw new IllegalStateException("Gemini API key is not configured");
        }

        try {
            log.info("Calling Google Gemini API ({}) for hospital match explanation", model);
            String prompt = String.format(
                    "You are an insurance decision-support assistant. In 2 concise sentences, summarize why %s scored a deterministic compatibility of %d%% based on provided %s policy data. Key factors: %s. Considerations: %s. Use safe, non-committal language ('Based on provided policy data...', 'Listed as network hospital...', 'Within stated room limit...'). Do NOT guarantee insurance coverage, cashless approval, or claim settlement.",
                    hospitalName != null ? hospitalName : "this hospital",
                    matchResult != null ? matchResult.getCompatibilityScore() : 0,
                    insurerName != null ? insurerName : "stated",
                    matchResult != null ? String.join("; ", matchResult.getMatchingFactors()) : "None",
                    matchResult != null && !matchResult.getConsiderations().isEmpty() ? String.join("; ", matchResult.getConsiderations()) : "None"
            );

            Map<String, Object> contentPart = Map.of("text", prompt);
            Map<String, Object> contents = Map.of("role", "user", "parts", List.of(contentPart));
            Map<String, Object> generationConfig = Map.of("temperature", 0.2);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(contents));
            requestBody.put("generationConfig", generationConfig);

            String responseText = executeGeminiRequest(requestBody);
            if (responseText != null && !responseText.isBlank()) {
                return sanitizeExplanation(responseText.trim());
            }
            throw new RuntimeException("Empty response received from Gemini");
        } catch (Exception e) {
            log.warn("Gemini hospital match explanation failed: {}", e.getMessage());
            throw new RuntimeException("Gemini explanation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateStageExplanation(String stage, String insurerName, String hospitalName, BigDecimal remainingCoverage) {
        if (!isConfigured()) {
            throw new IllegalStateException("Gemini API key is not configured");
        }

        try {
            log.info("Calling Google Gemini API ({}) for care stage guidance", model);
            String prompt = String.format(
                    "You are an insurance decision-support assistant. Provide 2 concise sentences of stage-specific caregiver guidance for the '%s' stage at '%s' with an indicative coverage balance of INR %s under %s. Emphasize TPA coordination and pre-authorization. Do not provide medical advice or binding claim assurances.",
                    stage != null ? stage : "ADMISSION",
                    hospitalName != null ? hospitalName : "the hospital",
                    remainingCoverage != null ? remainingCoverage.toPlainString() : "5,00,000",
                    insurerName != null ? insurerName : "the insurer"
            );

            Map<String, Object> contentPart = Map.of("text", prompt);
            Map<String, Object> contents = Map.of("role", "user", "parts", List.of(contentPart));
            Map<String, Object> generationConfig = Map.of("temperature", 0.2);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(contents));
            requestBody.put("generationConfig", generationConfig);

            String responseText = executeGeminiRequest(requestBody);
            if (responseText != null && !responseText.isBlank()) {
                return sanitizeExplanation(responseText.trim());
            }
            throw new RuntimeException("Empty response received from Gemini");
        } catch (Exception e) {
            log.warn("Gemini stage explanation failed: {}", e.getMessage());
            throw new RuntimeException("Gemini stage explanation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String getProviderName() {
        return "Google Gemini (" + model + ")";
    }

    private String executeGeminiRequest(Map<String, Object> requestBody) throws Exception {
        String url = String.format("%s/v1beta/models/%s:generateContent", baseUrl.replaceAll("/+$", ""), model);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
        );

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    return parts.get(0).path("text").asText();
                }
            }
        }
        throw new RuntimeException("Unexpected response status or structure from Gemini: " + response.getStatusCode());
    }

    private String buildExtractionPrompt(String rawText) {
        return "You are extracting structured health insurance parameters from a provided insurance policy document.\n" +
                "RULES:\n" +
                "1. Extract ONLY information explicitly stated in the document.\n" +
                "2. Do NOT infer missing coverage or assume standard benefits.\n" +
                "3. Do NOT invent missing values.\n" +
                "4. Use \"NOT_AVAILABLE\" for string fields when information is absent.\n" +
                "5. Return valid JSON adhering strictly to the schema below.\n" +
                "6. Do NOT provide medical advice or binding insurance assurances.\n\n" +
                "JSON Schema:\n" +
                "{\n" +
                "  \"insurerName\": \"string (or NOT_AVAILABLE)\",\n" +
                "  \"policyType\": \"string (or NOT_AVAILABLE)\",\n" +
                "  \"coverageLimit\": number,\n" +
                "  \"roomLimit\": number,\n" +
                "  \"roomCategory\": \"string (or NOT_AVAILABLE)\",\n" +
                "  \"networkHospitals\": [\"string\"],\n" +
                "  \"exclusions\": [\"string\"],\n" +
                "  \"otherConstraints\": [\"string\"]\n" +
                "}\n\n" +
                "Document Text:\n" + rawText;
    }

    private ExtractedPolicyDto parseAndValidateExtraction(JsonNode parsed, String rawText) {
        ExtractedPolicyDto dto = new ExtractedPolicyDto();
        dto.setInsurerName(cleanString(parsed.path("insurerName").asText(null)));
        dto.setPolicyType(cleanString(parsed.path("policyType").asText(null)));

        if (parsed.has("coverageLimit") && !parsed.get("coverageLimit").isNull()) {
            try {
                BigDecimal val = new BigDecimal(parsed.get("coverageLimit").asText());
                if (val.compareTo(BigDecimal.ZERO) >= 0) {
                    dto.setCoverageLimit(val);
                }
            } catch (Exception ignored) {}
        }

        if (parsed.has("roomLimit") && !parsed.get("roomLimit").isNull()) {
            try {
                BigDecimal val = new BigDecimal(parsed.get("roomLimit").asText());
                if (val.compareTo(BigDecimal.ZERO) >= 0) {
                    dto.setRoomLimit(val);
                }
            } catch (Exception ignored) {}
        }

        dto.setRoomCategory(cleanString(parsed.path("roomCategory").asText(null)));

        if (parsed.has("networkHospitals") && parsed.get("networkHospitals").isArray()) {
            List<String> nets = new ArrayList<>();
            parsed.get("networkHospitals").forEach(n -> {
                String val = cleanString(n.asText());
                if (val != null && !val.isBlank() && !"NOT_AVAILABLE".equalsIgnoreCase(val)) nets.add(val);
            });
            dto.setNetworkHospitals(nets);
        }

        if (parsed.has("exclusions") && parsed.get("exclusions").isArray()) {
            List<String> exs = new ArrayList<>();
            parsed.get("exclusions").forEach(e -> {
                String val = cleanString(e.asText());
                if (val != null && !val.isBlank() && !"NOT_AVAILABLE".equalsIgnoreCase(val)) exs.add(val);
            });
            dto.setExclusions(exs);
        }

        if (parsed.has("otherConstraints") && parsed.get("otherConstraints").isArray()) {
            List<String> cs = new ArrayList<>();
            parsed.get("otherConstraints").forEach(c -> {
                String val = cleanString(c.asText());
                if (val != null && !val.isBlank() && !"NOT_AVAILABLE".equalsIgnoreCase(val)) cs.add(val);
            });
            dto.setOtherConstraints(cs);
        }

        dto.setRawText(rawText);
        dto.setConfidence(BigDecimal.valueOf(0.95));
        return dto;
    }

    private String stripMarkdownCodeBlocks(String text) {
        if (text == null) return "";
        String trimmed = text.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }

    private String cleanString(String input) {
        if (input == null) return null;
        String trimmed = input.trim();
        if (trimmed.equalsIgnoreCase("null") || trimmed.equalsIgnoreCase("none") || trimmed.equalsIgnoreCase("n/a") || trimmed.equalsIgnoreCase("undefined")) {
            return "NOT_AVAILABLE";
        }
        return trimmed;
    }

    private String sanitizeExplanation(String explanation) {
        return explanation
                .replace("fully covered", "within stated policy limits")
                .replace("Fully covered", "Within stated policy limits")
                .replace("guaranteed reimbursement", "potential reimbursement consideration")
                .replace("claim approved", "pre-authorization submitted");
    }
}
