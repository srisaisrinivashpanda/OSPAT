package com.hospitality.policy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospitality.ai.AIService;
import com.hospitality.dto.*;
import com.hospitality.entity.*;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PolicyService {

    private final PdfExtractionService pdfExtractionService;
    private final AIService aiService;
    private final InsurancePolicyRepository policyRepository;
    private final PolicyExtractionRepository extractionRepository;
    private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public ExtractedPolicyDto extractAndSavePolicyFromPdf(MultipartFile file, Long patientId) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded policy file is required and cannot be empty.");
        }

        Patient patient = patientRepository.findById(patientId != null ? patientId : 1L)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        String rawText = pdfExtractionService.extractTextFromPdf(file);
        ExtractedPolicyDto extractedDto = aiService.extractPolicyFromText(rawText);

        BigDecimal coverage = extractedDto.getCoverageLimit() != null && extractedDto.getCoverageLimit().compareTo(BigDecimal.ZERO) >= 0
                ? extractedDto.getCoverageLimit() : BigDecimal.ZERO;
        BigDecimal roomCap = extractedDto.getRoomLimit() != null && extractedDto.getRoomLimit().compareTo(BigDecimal.ZERO) >= 0
                ? extractedDto.getRoomLimit() : BigDecimal.ZERO;

        InsurancePolicy policy = InsurancePolicy.builder()
                .patient(patient)
                .insurerName(extractedDto.getInsurerName() != null ? extractedDto.getInsurerName() : "NOT_AVAILABLE")
                .policyType(extractedDto.getPolicyType() != null ? extractedDto.getPolicyType() : "NOT_AVAILABLE")
                .coverageLimit(coverage)
                .remainingCoverage(coverage)
                .roomLimit(roomCap)
                .roomCategory(extractedDto.getRoomCategory() != null ? extractedDto.getRoomCategory() : "NOT_AVAILABLE")
                .policyStatus("DRAFT")
                .sourceDocument(file.getOriginalFilename())
                .confirmed(false)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        // Add exclusions
        if (extractedDto.getExclusions() != null) {
            for (String ex : extractedDto.getExclusions()) {
                if (ex != null && !ex.isBlank()) {
                    policy.getExclusions().add(PolicyExclusion.builder()
                            .policy(policy)
                            .description(ex.trim())
                            .build());
                }
            }
        }

        // Match network hospitals by name
        List<Hospital> allHospitals = hospitalRepository.findAll();
        if (extractedDto.getNetworkHospitals() != null && !extractedDto.getNetworkHospitals().isEmpty()) {
            for (String netName : extractedDto.getNetworkHospitals()) {
                if (netName == null || netName.isBlank()) continue;
                String cleanNet = netName.trim().toLowerCase();
                allHospitals.stream()
                        .filter(h -> h.getName().toLowerCase().contains(cleanNet) || 
                                     cleanNet.contains(h.getName().toLowerCase()))
                        .findFirst()
                        .ifPresent(h -> policy.getNetworkHospitals().add(
                                NetworkHospital.builder().policy(policy).hospital(h).build()
                        ));
            }
        }
        // If no explicit network matched, link in-network hospitals by default
        if (policy.getNetworkHospitals().isEmpty()) {
            allHospitals.stream()
                    .filter(h -> "IN_NETWORK".equalsIgnoreCase(h.getNetworkStatus()))
                    .limit(6)
                    .forEach(h -> policy.getNetworkHospitals().add(
                            NetworkHospital.builder().policy(policy).hospital(h).build()
                    ));
        }

        InsurancePolicy savedPolicy = policyRepository.save(policy);

        // Record Extraction Audit
        String jsonPayload = "";
        try {
            jsonPayload = objectMapper.writeValueAsString(extractedDto);
        } catch (Exception ignored) {}

        PolicyExtraction extractionRecord = PolicyExtraction.builder()
                .policy(savedPolicy)
                .rawText(rawText)
                .structuredJson(jsonPayload)
                .confidence(extractedDto.getConfidence() != null ? extractedDto.getConfidence() : BigDecimal.ONE)
                .createdAt(OffsetDateTime.now())
                .build();
        extractionRepository.save(extractionRecord);

        extractedDto.setPolicyId(savedPolicy.getId());
        log.info("Saved draft policy id {} for patient id {}", savedPolicy.getId(), patient.getId());
        return extractedDto;
    }

    @Transactional
    public PolicyResponseDto confirmAndActivatePolicy(Long policyId, PolicyUpdateRequestDto request) {
        InsurancePolicy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new ResourceNotFoundException("Insurance policy not found with id: " + policyId));

        if (request == null) {
            throw new IllegalArgumentException("Policy update request cannot be null.");
        }

        policy.setInsurerName(request.getInsurerName());
        policy.setPolicyType(request.getPolicyType());
        policy.setCoverageLimit(request.getCoverageLimit() != null ? request.getCoverageLimit() : BigDecimal.ZERO);
        policy.setRemainingCoverage(request.getRemainingCoverage() != null ? request.getRemainingCoverage() : policy.getCoverageLimit());
        policy.setRoomLimit(request.getRoomLimit() != null ? request.getRoomLimit() : BigDecimal.ZERO);
        policy.setRoomCategory(request.getRoomCategory());
        policy.setConfirmed(Boolean.TRUE.equals(request.getConfirmed()));
        policy.setPolicyStatus(Boolean.TRUE.equals(request.getConfirmed()) ? "ACTIVE" : "DRAFT");
        policy.setUpdatedAt(OffsetDateTime.now());

        // Update exclusions
        policy.getExclusions().clear();
        if (request.getExclusions() != null) {
            for (String desc : request.getExclusions()) {
                if (desc != null && !desc.isBlank()) {
                    policy.getExclusions().add(PolicyExclusion.builder()
                            .policy(policy)
                            .description(desc.trim())
                            .build());
                }
            }
        }

        // Update network hospitals
        if (request.getNetworkHospitalIds() != null && !request.getNetworkHospitalIds().isEmpty()) {
            policy.getNetworkHospitals().clear();
            List<Hospital> hospitals = hospitalRepository.findAllById(request.getNetworkHospitalIds());
            for (Hospital h : hospitals) {
                policy.getNetworkHospitals().add(NetworkHospital.builder()
                        .policy(policy)
                        .hospital(h)
                        .build());
            }
        }

        InsurancePolicy updated = policyRepository.save(policy);
        log.info("Confirmed and activated policy id {}", updated.getId());
        return mapToDto(updated);
    }

    @Transactional(readOnly = true)
    public PolicyResponseDto getPolicyById(Long id) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id: " + id));
        return mapToDto(policy);
    }

    @Transactional(readOnly = true)
    public List<PolicyResponseDto> getPoliciesForPatient(Long patientId) {
        return policyRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PolicyResponseDto findActivePolicyForPatientOrNull(Long patientId) {
        List<InsurancePolicy> confirmed = policyRepository.findByPatientIdAndConfirmedTrueOrderByUpdatedAtDesc(patientId);
        if (!confirmed.isEmpty()) {
            return mapToDto(confirmed.get(0));
        }
        List<InsurancePolicy> all = policyRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        if (!all.isEmpty()) {
            return mapToDto(all.get(0));
        }
        return null;
    }

    @Transactional(readOnly = true)
    public PolicyResponseDto getActivePolicyForPatient(Long patientId) {
        PolicyResponseDto dto = findActivePolicyForPatientOrNull(patientId);
        if (dto == null) {
            throw new ResourceNotFoundException("No insurance policy found for patient id: " + patientId);
        }
        return dto;
    }

    public PolicyResponseDto mapToDto(InsurancePolicy policy) {
        List<String> exclusions = policy.getExclusions() != null ? policy.getExclusions().stream()
                .map(PolicyExclusion::getDescription)
                .toList() : List.of();

        List<NetworkHospitalItemDto> networks = policy.getNetworkHospitals() != null ? policy.getNetworkHospitals().stream()
                .filter(nh -> nh.getHospital() != null)
                .map(nh -> NetworkHospitalItemDto.builder()
                        .hospitalId(nh.getHospital().getId())
                        .hospitalName(nh.getHospital().getName())
                        .location(nh.getHospital().getLocation())
                        .build())
                .toList() : List.of();

        return PolicyResponseDto.builder()
                .id(policy.getId())
                .patientId(policy.getPatient() != null ? policy.getPatient().getId() : null)
                .patientName(policy.getPatient() != null ? policy.getPatient().getName() : "Unknown")
                .insurerName(policy.getInsurerName())
                .policyType(policy.getPolicyType())
                .coverageLimit(policy.getCoverageLimit())
                .remainingCoverage(policy.getRemainingCoverage())
                .roomLimit(policy.getRoomLimit())
                .roomCategory(policy.getRoomCategory())
                .policyStatus(policy.getPolicyStatus())
                .sourceDocument(policy.getSourceDocument())
                .confirmed(policy.getConfirmed())
                .createdAt(policy.getCreatedAt())
                .updatedAt(policy.getUpdatedAt())
                .exclusions(exclusions)
                .networkHospitals(networks)
                .build();
    }
}
