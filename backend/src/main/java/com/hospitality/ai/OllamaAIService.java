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

@Service("ollamaAIService")
@Slf4j
public class OllamaAIService implements AIService {

    @Value("${hospitality.ai.ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${hospitality.ai.ollama.model:qwen2.5:7b}")
    private String ollamaModel;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public OllamaAIService(RestTemplateBuilder builder,
                            ObjectMapper objectMapper,
                            @Value("${hospitality.ai.ollama.connect-timeout-ms:3000}") long connectTimeout,
                            @Value("${hospitality.ai.ollama.read-timeout-ms:15000}") long readTimeout) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofMillis(connectTimeout))
                .setReadTimeout(Duration.ofMillis(readTimeout))
                .build();
        this.objectMapper = objectMapper;
    }

    @Override
    public ExtractedPolicyDto extractPolicyFromText(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            throw new IllegalArgumentException("Raw text must not be empty");
        }

        try {
            log.info("Attempting structured AI extraction via Ollama at {} using model {}", ollamaBaseUrl, ollamaModel);
            String prompt = buildExtractionPrompt(rawText);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", ollamaModel);
            requestBody.put("prompt", prompt);
            requestBody.put("stream", false);
            requestBody.put("format", "json");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    ollamaBaseUrl + "/api/generate",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String responseText = root.path("response").asText();
                JsonNode parsed = objectMapper.readTree(responseText);
                return parseAndValidateExtraction(parsed, rawText);
            }
            throw new RuntimeException("Unexpected response status from Ollama: " + response.getStatusCode());
        } catch (Exception e) {
            log.warn("Ollama extraction failed: {}", e.getMessage());
            throw new RuntimeException("Ollama extraction failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateHospitalMatchExplanation(String insurerName, String hospitalName, HospitalMatchResultDto matchResult) {
        try {
            String prompt = String.format(
                    "You are a healthcare policy decision-support assistant. In 2 concise sentences, summarize why %s scored a deterministic compatibility of %d%% based on provided %s policy data. Key factors: %s. Considerations: %s. Use safe, non-committal language ('Based on provided policy data...', 'Listed as network hospital...', 'Within stated room limit...'). Do NOT guarantee insurance coverage, cashless approval, or claim settlement.",
                    hospitalName != null ? hospitalName : "this hospital",
                    matchResult != null ? matchResult.getCompatibilityScore() : 0,
                    insurerName != null ? insurerName : "stated",
                    matchResult != null ? String.join("; ", matchResult.getMatchingFactors()) : "None",
                    matchResult != null && !matchResult.getConsiderations().isEmpty() ? String.join("; ", matchResult.getConsiderations()) : "None"
            );

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", ollamaModel);
            requestBody.put("prompt", prompt);
            requestBody.put("stream", false);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    ollamaBaseUrl + "/api/generate",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String explanation = root.path("response").asText();
                if (explanation != null && !explanation.isBlank()) {
                    return sanitizeExplanation(explanation.trim());
                }
            }
            throw new RuntimeException("Empty response received from Ollama");
        } catch (Exception e) {
            log.warn("Ollama match explanation failed: {}", e.getMessage());
            throw new RuntimeException("Ollama match explanation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateStageExplanation(String stage, String insurerName, String hospitalName, BigDecimal remainingCoverage) {
        String stg = stage != null ? stage.toUpperCase() : "ADMISSION";
        String base = String.format("Based on the provided policy data, your indicative coverage balance is ₹%s at %s. ",
                remainingCoverage != null ? remainingCoverage.toPlainString() : "5,00,000",
                hospitalName != null ? hospitalName : "the hospital");

        switch (stg) {
            case "ADMISSION":
                return base + "Ensure pre-authorization documentation is submitted to the hospital TPA desk with patient ID proof. Daily room rates should be checked against stated policy limits.";
            case "INVESTIGATION":
                return base + "In-patient diagnostic tests and pathology linked directly to the primary admission diagnosis are typically evaluated under standard policy clauses.";
            case "PROCEDURE":
                return base + "Surgical procedures and special equipment may involve agreed network package rates. Consumables and high-value items may require verification of policy sub-limits.";
            case "RECOVERY":
                return base + "Review the preliminary itemized hospital summary bill for non-medical deductions before final discharge authorization by the insurer.";
            default:
                return base + "Please verify pre-authorization status and document requirements with the hospital billing department.";
        }
    }

    @Override
    public String getProviderName() {
        return "Ollama (" + ollamaModel + ")";
    }

    private String buildExtractionPrompt(String rawText) {
        return "You are extracting information from a provided insurance policy document.\n" +
                "RULES:\n" +
                "1. Extract ONLY information explicitly stated in the document.\n" +
                "2. Do NOT infer missing coverage or assume standard benefits.\n" +
                "3. Do NOT invent missing values.\n" +
                "4. Use null or \"NOT_AVAILABLE\" when information is absent.\n" +
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
