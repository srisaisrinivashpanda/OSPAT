package com.hospitality.hospital;

import com.hospitality.ai.AIService;
import com.hospitality.dto.*;
import com.hospitality.entity.*;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.matching.HospitalMatchingEngine;
import com.hospitality.repository.HospitalRepository;
import com.hospitality.repository.InsurancePolicyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final InsurancePolicyRepository policyRepository;
    private final HospitalMatchingEngine matchingEngine;
    private final AIService aiService;

    @Transactional(readOnly = true)
    public List<HospitalDto> getAllHospitals() {
        return hospitalRepository.findAllByOrderByCreatedAtAsc().stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public HospitalDto getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
        return mapToDto(hospital);
    }

    @Transactional(readOnly = true)
    public List<HospitalMatchResultDto> matchHospitals(Long policyId, Long patientId, String specialty,
            String location) {
        InsurancePolicy policy = null;
        if (policyId != null) {
            policy = policyRepository.findById(policyId).orElse(null);
        }
        if (policy == null && patientId != null) {
            List<InsurancePolicy> confirmed = policyRepository
                    .findByPatientIdAndConfirmedTrueOrderByUpdatedAtDesc(patientId);
            if (!confirmed.isEmpty()) {
                policy = confirmed.get(0);
            } else {
                List<InsurancePolicy> all = policyRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
                if (!all.isEmpty()) {
                    policy = all.get(0);
                }
            }
        }

        final InsurancePolicy finalPolicy = policy;
        List<Hospital> hospitals = hospitalRepository.findAllByOrderByCreatedAtAsc();

        List<HospitalMatchResultDto> results = hospitals.stream()
                .filter(h -> location == null || location.isBlank()
                        || h.getLocation().toLowerCase().contains(location.toLowerCase()))
                .map(h -> {
                    HospitalMatchResultDto match = matchingEngine.matchHospital(finalPolicy, h, specialty);
                    // Generate safe, non-technical explanation
                    String explanation = aiService.generateHospitalMatchExplanation(
                            finalPolicy != null ? finalPolicy.getInsurerName() : null,
                            h.getName(),
                            match);
                    match.setCaregiverSummary(explanation);
                    return match;
                })
                .sorted(Comparator.comparing(HospitalMatchResultDto::getCompatibilityScore).reversed())
                .toList();

        log.info("Computed matching results for policy id {} across {} hospitals",
                policy != null ? policy.getId() : "null", results.size());
        return results;
    }

    public HospitalDto mapToDto(Hospital hospital) {
        List<String> specs = hospital.getSpecialties() != null ? hospital.getSpecialties().stream()
                .map(HospitalSpecialty::getSpecialty)
                .toList() : List.of();

        List<RoomCategoryDto> rooms = hospital.getRoomCategories() != null ? hospital.getRoomCategories().stream()
                .map(r -> RoomCategoryDto.builder()
                        .id(r.getId())
                        .name(r.getName())
                        .dailyCost(r.getDailyCost())
                        .available(r.getAvailable())
                        .build())
                .toList() : List.of();

        return HospitalDto.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .location(hospital.getLocation())
                .address(hospital.getAddress())
                .networkStatus(hospital.getNetworkStatus())
                .description(hospital.getDescription())
                .specialties(specs)
                .roomCategories(rooms)
                .build();
    }
}
