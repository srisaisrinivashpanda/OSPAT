package com.hospitality.service;

import com.hospitality.dto.*;
import com.hospitality.entity.*;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.journey.CareJourneyService;
import com.hospitality.policy.PolicyService;
import com.hospitality.repository.HospitalRepository;
import com.hospitality.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;
    private final PolicyService policyService;
    private final CareJourneyService careJourneyService;

    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary(Long patientId) {
        Long targetPatientId = patientId != null ? patientId : 1L;
        Patient patient = patientRepository.findById(targetPatientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + targetPatientId));

        PolicyResponseDto activePolicy = policyService.findActivePolicyForPatientOrNull(targetPatientId);
        CareJourneyDto activeJourney = careJourneyService.findLatestJourneyForPatientOrNull(targetPatientId);

        StageGuidanceDto stageGuidance = null;
        if (activeJourney != null) {
            try {
                JourneyContextDto ctx = careJourneyService.getJourneyContext(activeJourney.getId());
                stageGuidance = ctx.getCurrentStageGuidance();
            } catch (Exception ignored) {}
        }

        BigDecimal totalCoverage = activePolicy != null && activePolicy.getCoverageLimit() != null 
                ? activePolicy.getCoverageLimit() : BigDecimal.ZERO;
        BigDecimal remainingCoverage = activePolicy != null && activePolicy.getRemainingCoverage() != null 
                ? activePolicy.getRemainingCoverage() : totalCoverage;
        BigDecimal roomLimit = activePolicy != null && activePolicy.getRoomLimit() != null 
                ? activePolicy.getRoomLimit() : BigDecimal.ZERO;
        String roomCat = activePolicy != null && activePolicy.getRoomCategory() != null 
                ? activePolicy.getRoomCategory() : "Not Specified";
        int networkCount = activePolicy != null && activePolicy.getNetworkHospitals() != null 
                ? activePolicy.getNetworkHospitals().size() : 0;
        int totalHospitals = (int) hospitalRepository.count();

        List<String> alerts = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        if (activePolicy == null) {
            alerts.add("No insurance policy active. Upload or select a policy document to activate intelligence.");
            actions.add("Upload your insurance policy PDF on the Insurance page.");
        } else if (!Boolean.TRUE.equals(activePolicy.getConfirmed())) {
            alerts.add("Extracted insurance policy is in DRAFT mode. Review and confirm details to enable full matching.");
            actions.add("Confirm extracted insurance parameters.");
        } else {
            alerts.add("Policy verified: " + activePolicy.getInsurerName() + " (" + activePolicy.getPolicyType() + "). Indicative balance: ₹" + remainingCoverage.toPlainString() + ".");
            if (activeJourney == null) {
                actions.add("Explore compatible network hospitals for planned admission.");
            } else {
                alerts.add("Active Care Journey: " + activeJourney.getHospitalName() + " — Currently in " + activeJourney.getCurrentStage() + " stage.");
                actions.add("Review Stage-specific insurance questions to ask the hospital TPA desk.");
            }
        }

        return DashboardSummaryDto.builder()
                .patientId(patient.getId())
                .patientName(patient.getName())
                .patientAge(patient.getAge())
                .activePolicy(activePolicy)
                .activeJourney(activeJourney)
                .currentStageGuidance(stageGuidance)
                .totalCoverageLimit(totalCoverage)
                .remainingCoverage(remainingCoverage)
                .roomDailyLimit(roomLimit)
                .roomCategory(roomCat)
                .networkHospitalsCount(networkCount)
                .totalHospitalsAvailable(totalHospitals)
                .recentAlerts(alerts)
                .recommendedActions(actions)
                .build();
    }
}
