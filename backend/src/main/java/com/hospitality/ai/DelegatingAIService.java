package com.hospitality.ai;

import com.hospitality.dto.ExtractedPolicyDto;
import com.hospitality.dto.HospitalMatchResultDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicBoolean;

@Service("aiService")
@Primary
@Slf4j
public class DelegatingAIService implements AIService {

    private final GeminiAIService geminiAIService;
    private final OllamaAIService ollamaAIService;
    private final HeuristicAIService heuristicAIService;

    @Value("${hospitality.ai.provider:gemini}")
    private String configuredProvider;

    private final AtomicBoolean keyWarningLogged = new AtomicBoolean(false);

    public DelegatingAIService(@Qualifier("geminiAIService") GeminiAIService geminiAIService,
                               @Qualifier("ollamaAIService") OllamaAIService ollamaAIService,
                               @Qualifier("heuristicAIService") HeuristicAIService heuristicAIService) {
        this.geminiAIService = geminiAIService;
        this.ollamaAIService = ollamaAIService;
        this.heuristicAIService = heuristicAIService;
    }

    @Override
    public ExtractedPolicyDto extractPolicyFromText(String rawText) {
        String provider = getNormalizedProvider();

        if ("gemini".equals(provider)) {
            if (!geminiAIService.isConfigured()) {
                logMissingKeyNoticeOnce();
                return heuristicAIService.extractPolicyFromText(rawText);
            }
            try {
                ExtractedPolicyDto dto = geminiAIService.extractPolicyFromText(rawText);
                if (dto == null || isExtractionIncomplete(dto)) {
                    log.warn("Gemini policy extraction had missing fields; merging with deterministic heuristic results");
                    ExtractedPolicyDto fallback = heuristicAIService.extractPolicyFromText(rawText);
                    mergeMissingFields(dto, fallback);
                }
                return dto;
            } catch (Exception e) {
                log.warn("Gemini extraction failed ({}); falling back to deterministic heuristic engine", e.getMessage());
                return heuristicAIService.extractPolicyFromText(rawText);
            }
        } else if ("ollama".equals(provider)) {
            try {
                ExtractedPolicyDto dto = ollamaAIService.extractPolicyFromText(rawText);
                if (dto == null || isExtractionIncomplete(dto)) {
                    log.warn("Ollama policy extraction had missing fields; merging with deterministic heuristic results");
                    ExtractedPolicyDto fallback = heuristicAIService.extractPolicyFromText(rawText);
                    mergeMissingFields(dto, fallback);
                }
                return dto;
            } catch (Exception e) {
                log.warn("Ollama extraction failed ({}); falling back to deterministic heuristic engine", e.getMessage());
                return heuristicAIService.extractPolicyFromText(rawText);
            }
        }

        return heuristicAIService.extractPolicyFromText(rawText);
    }

    @Override
    public String generateHospitalMatchExplanation(String insurerName, String hospitalName, HospitalMatchResultDto matchResult) {
        String provider = getNormalizedProvider();

        if ("gemini".equals(provider)) {
            if (!geminiAIService.isConfigured()) {
                logMissingKeyNoticeOnce();
                return heuristicAIService.generateHospitalMatchExplanation(insurerName, hospitalName, matchResult);
            }
            try {
                return geminiAIService.generateHospitalMatchExplanation(insurerName, hospitalName, matchResult);
            } catch (Exception e) {
                log.warn("Gemini match explanation failed ({}); using deterministic explanation", e.getMessage());
                return heuristicAIService.generateHospitalMatchExplanation(insurerName, hospitalName, matchResult);
            }
        } else if ("ollama".equals(provider)) {
            try {
                return ollamaAIService.generateHospitalMatchExplanation(insurerName, hospitalName, matchResult);
            } catch (Exception e) {
                log.warn("Ollama match explanation failed ({}); using deterministic explanation", e.getMessage());
                return heuristicAIService.generateHospitalMatchExplanation(insurerName, hospitalName, matchResult);
            }
        }

        return heuristicAIService.generateHospitalMatchExplanation(insurerName, hospitalName, matchResult);
    }

    @Override
    public String generateStageExplanation(String stage, String insurerName, String hospitalName, BigDecimal remainingCoverage) {
        String provider = getNormalizedProvider();

        if ("gemini".equals(provider)) {
            if (!geminiAIService.isConfigured()) {
                logMissingKeyNoticeOnce();
                return heuristicAIService.generateStageExplanation(stage, insurerName, hospitalName, remainingCoverage);
            }
            try {
                return geminiAIService.generateStageExplanation(stage, insurerName, hospitalName, remainingCoverage);
            } catch (Exception e) {
                log.warn("Gemini stage explanation failed ({}); using deterministic stage guidance", e.getMessage());
                return heuristicAIService.generateStageExplanation(stage, insurerName, hospitalName, remainingCoverage);
            }
        } else if ("ollama".equals(provider)) {
            try {
                return ollamaAIService.generateStageExplanation(stage, insurerName, hospitalName, remainingCoverage);
            } catch (Exception e) {
                log.warn("Ollama stage explanation failed ({}); using deterministic stage guidance", e.getMessage());
                return heuristicAIService.generateStageExplanation(stage, insurerName, hospitalName, remainingCoverage);
            }
        }

        return heuristicAIService.generateStageExplanation(stage, insurerName, hospitalName, remainingCoverage);
    }

    @Override
    public String getProviderName() {
        String provider = getNormalizedProvider();
        if ("gemini".equals(provider)) {
            if (geminiAIService.isConfigured()) {
                return geminiAIService.getProviderName() + " with Deterministic Fallback";
            }
            return "Deterministic Heuristic Engine (Gemini key not configured)";
        } else if ("ollama".equals(provider)) {
            return ollamaAIService.getProviderName() + " with Deterministic Fallback";
        }
        return heuristicAIService.getProviderName();
    }

    private String getNormalizedProvider() {
        return configuredProvider != null ? configuredProvider.trim().toLowerCase() : "gemini";
    }

    private void logMissingKeyNoticeOnce() {
        if (keyWarningLogged.compareAndSet(false, true)) {
            log.info("GEMINI_API_KEY is not configured; Hospitality is operating in zero-dependency deterministic heuristic mode.");
        }
    }

    private boolean isExtractionIncomplete(ExtractedPolicyDto dto) {
        return dto.getInsurerName() == null || "NOT_AVAILABLE".equalsIgnoreCase(dto.getInsurerName())
                || dto.getCoverageLimit() == null || dto.getCoverageLimit().compareTo(BigDecimal.ZERO) <= 0;
    }

    private void mergeMissingFields(ExtractedPolicyDto target, ExtractedPolicyDto source) {
        if (target == null || source == null) return;

        if (target.getInsurerName() == null || "NOT_AVAILABLE".equalsIgnoreCase(target.getInsurerName())) {
            target.setInsurerName(source.getInsurerName());
        }
        if (target.getPolicyType() == null || "NOT_AVAILABLE".equalsIgnoreCase(target.getPolicyType())) {
            target.setPolicyType(source.getPolicyType());
        }
        if (target.getCoverageLimit() == null || target.getCoverageLimit().compareTo(BigDecimal.ZERO) <= 0) {
            target.setCoverageLimit(source.getCoverageLimit());
        }
        if (target.getRoomLimit() == null || target.getRoomLimit().compareTo(BigDecimal.ZERO) <= 0) {
            target.setRoomLimit(source.getRoomLimit());
        }
        if (target.getRoomCategory() == null || "NOT_AVAILABLE".equalsIgnoreCase(target.getRoomCategory())) {
            target.setRoomCategory(source.getRoomCategory());
        }
        if (target.getNetworkHospitals() == null || target.getNetworkHospitals().isEmpty()) {
            target.setNetworkHospitals(source.getNetworkHospitals());
        }
        if (target.getExclusions() == null || target.getExclusions().isEmpty()) {
            target.setExclusions(source.getExclusions());
        }
        if (target.getOtherConstraints() == null || target.getOtherConstraints().isEmpty()) {
            target.setOtherConstraints(source.getOtherConstraints());
        }
    }
}
