package com.hospitality.journey;

import com.hospitality.dto.*;
import com.hospitality.entity.*;
import com.hospitality.exception.ResourceNotFoundException;
import com.hospitality.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CareJourneyService {

    private final CareJourneyRepository careJourneyRepository;
    private final JourneyEventRepository journeyEventRepository;
    private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;
    private final InsurancePolicyRepository policyRepository;

    @Transactional(readOnly = true)
    public CareJourneyDto findLatestJourneyForPatientOrNull(Long patientId) {
        return careJourneyRepository.findFirstByPatientIdOrderByUpdatedAtDesc(patientId)
                .map(this::mapToDto)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public CareJourneyDto getLatestJourneyForPatient(Long patientId) {
        CareJourney journey = careJourneyRepository.findFirstByPatientIdOrderByUpdatedAtDesc(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("No active care journey found for patient id: " + patientId));
        return mapToDto(journey);
    }

    @Transactional(readOnly = true)
    public CareJourneyDto getJourneyById(Long id) {
        CareJourney journey = careJourneyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Care journey not found with id: " + id));
        return mapToDto(journey);
    }

    @Transactional
    public CareJourneyDto createOrUpdateJourney(Long patientId, Long hospitalId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + hospitalId));

        CareJourney journey = careJourneyRepository.findFirstByPatientIdOrderByUpdatedAtDesc(patientId)
                .orElseGet(() -> CareJourney.builder()
                        .patient(patient)
                        .currentStage("ADMISSION")
                        .build());

        journey.setHospital(hospital);
        journey.setCurrentStage("ADMISSION");
        journey.setUpdatedAt(OffsetDateTime.now());
        journey = careJourneyRepository.save(journey);

        JourneyEvent event = JourneyEvent.builder()
                .journey(journey)
                .stage("ADMISSION")
                .description("Selected " + hospital.getName() + " and initiated admission care journey.")
                .timestamp(OffsetDateTime.now())
                .build();
        journeyEventRepository.save(event);

        return mapToDto(journey);
    }

    @Transactional
    public CareJourneyDto updateJourneyStage(Long journeyId, JourneyStageUpdateRequestDto request) {
        CareJourney journey = careJourneyRepository.findById(journeyId)
                .orElseThrow(() -> new ResourceNotFoundException("Care journey not found with id: " + journeyId));

        if (request == null || request.getStage() == null) {
            throw new IllegalArgumentException("Journey stage must not be null");
        }

        String targetStage = request.getStage().trim().toUpperCase();
        validateStage(targetStage);

        journey.setCurrentStage(targetStage);
        journey.setUpdatedAt(OffsetDateTime.now());
        journey = careJourneyRepository.save(journey);

        String note = request.getNote() != null && !request.getNote().isBlank()
                ? request.getNote()
                : "Stage progressed to " + targetStage;

        JourneyEvent event = JourneyEvent.builder()
                .journey(journey)
                .stage(targetStage)
                .description(note)
                .timestamp(OffsetDateTime.now())
                .build();
        journeyEventRepository.save(event);

        return mapToDto(journey);
    }

    @Transactional(readOnly = true)
    public JourneyContextDto getJourneyContext(Long journeyId) {
        CareJourney journey = careJourneyRepository.findById(journeyId)
                .orElseThrow(() -> new ResourceNotFoundException("Care journey not found with id: " + journeyId));

        Patient patient = journey.getPatient();
        List<InsurancePolicy> confirmedPolicies = policyRepository.findByPatientIdAndConfirmedTrueOrderByUpdatedAtDesc(patient.getId());
        InsurancePolicy policy = !confirmedPolicies.isEmpty() ? confirmedPolicies.get(0) : null;

        BigDecimal coverageLimit = policy != null ? policy.getCoverageLimit() : BigDecimal.valueOf(500000);
        BigDecimal remainingCoverage = policy != null ? policy.getRemainingCoverage() : BigDecimal.valueOf(500000);
        BigDecimal roomLimit = policy != null ? policy.getRoomLimit() : BigDecimal.valueOf(5000);
        String networkStatus = journey.getHospital() != null ? journey.getHospital().getNetworkStatus() : "UNKNOWN";

        StageGuidanceDto guidance = getGuidanceForStage(journey.getCurrentStage(), policy, journey.getHospital());

        return JourneyContextDto.builder()
                .journeyId(journey.getId())
                .patientId(patient.getId())
                .patientName(patient.getName())
                .hospitalId(journey.getHospital() != null ? journey.getHospital().getId() : null)
                .hospitalName(journey.getHospital() != null ? journey.getHospital().getName() : "Unassigned Hospital")
                .hospitalLocation(journey.getHospital() != null ? journey.getHospital().getLocation() : "")
                .currentStage(journey.getCurrentStage())
                .coverageLimit(coverageLimit)
                .remainingCoverage(remainingCoverage)
                .roomLimit(roomLimit)
                .networkStatus(networkStatus)
                .currentStageGuidance(guidance)
                .build();
    }

    public StageGuidanceDto getGuidanceForStage(String stage, InsurancePolicy policy, Hospital hospital) {
        String stg = stage != null ? stage.toUpperCase() : "ADMISSION";
        BigDecimal roomLimit = policy != null && policy.getRoomLimit() != null ? policy.getRoomLimit() : BigDecimal.valueOf(5000);
        BigDecimal remaining = policy != null && policy.getRemainingCoverage() != null ? policy.getRemainingCoverage() : BigDecimal.valueOf(500000);
        String insurer = policy != null && policy.getInsurerName() != null ? policy.getInsurerName() : "your insurer";

        List<String> insights = new ArrayList<>();
        List<String> constraints = new ArrayList<>();
        List<String> questions = new ArrayList<>();
        List<String> documents = new ArrayList<>();

        switch (stg) {
            case "ADMISSION":
                insights.add("Based on provided policy data, your stated daily room limit is ₹" + roomLimit.toPlainString() + ".");
                insights.add("Indicative remaining sum insured balance: ₹" + remaining.toPlainString() + " (does not reflect live insurer claim balance).");
                insights.add("Cashless pre-authorization requests are typically submitted via the hospital TPA desk within 24 hours of emergency admission or 48 hours before planned admission.");
                constraints.add("Selecting a room exceeding ₹" + roomLimit.toPlainString() + "/day may trigger proportionate deductions across doctor consultations and surgical procedures as per policy terms.");
                constraints.add("Initial cashless pre-authorization is typically an interim sanction amount; final settlement is adjudicated at discharge.");
                questions.add("Has the hospital TPA desk submitted the pre-authorization request with the correct policy number?");
                questions.add("What is the initial pre-authorization sanction amount communicated by " + insurer + "?");
                questions.add("Is the assigned room category within the stated policy limit of ₹" + roomLimit.toPlainString() + "/day?");
                documents.add("Physical or digital Health Card / Policy Schedule");
                documents.add("Government ID proof of patient (Aadhaar / Voter ID / Passport)");
                documents.add("Treating Doctor's Admission Recommendation Note");
                break;

            case "INVESTIGATION":
                insights.add("In-patient diagnostic evaluations, blood tests, and scans directly linked to the primary hospitalization diagnosis are typically evaluated under standard claim terms.");
                insights.add("Pre-hospitalization diagnostic bills (typically 30 to 60 days prior to admission) may be submitted for post-discharge reimbursement consideration subject to policy terms.");
                constraints.add("Routine general health checkups or investigative procedures without active medical intervention are strictly excluded under standard policy clauses.");
                constraints.add("Third-party laboratory tests outside the primary hospital network may require original itemized receipts with doctor prescriptions.");
                questions.add("Are all ordered tests (CT, MRI, Pathology) included in the in-patient hospital billing ledger?");
                questions.add("Does any specialized diagnostic test require prior authorization from " + insurer + "?");
                documents.add("Treating Doctor's Investigation Request Slips");
                documents.add("Diagnostic Reports & Radiographic Films");
                documents.add("Itemized Pharmacy and Lab Charge Slips");
                break;

            case "PROCEDURE":
                insights.add("Major surgical and therapeutic procedures are evaluated against the available indicative coverage balance of ₹" + remaining.toPlainString() + ".");
                insights.add("Package rate agreements between the hospital and " + insurer + " may help cap unexpected out-of-pocket costs.");
                constraints.add("High-value implants, prosthetics, and special surgical equipment may carry specific policy sub-limits or caps.");
                constraints.add("Non-medical consumables (PPE kits, administrative disposables, admission kits) are typically non-payable under standard insurance terms.");
                questions.add("Has the hospital requested an enhanced pre-authorization enhancement for the procedure cost?");
                questions.add("What is the estimated out-of-pocket cost for non-medical consumables and excluded surgical items?");
                questions.add("Are the surgeon fees and OT charges aligned with standard network package agreements?");
                documents.add("Operation Theatre & Surgical Notes");
                documents.add("Implant Invoices with Barcode / Batch Stickers (if applicable)");
                documents.add("Anaesthetist & Surgeon Consultation Logs");
                break;

            case "RECOVERY":
                insights.add("Final claim settlement is subject to insurer adjudication upon generation of the comprehensive itemized hospital bill.");
                insights.add("Post-hospitalization recovery expenses (prescribed medicines, follow-up tests) may be submitted for reimbursement consideration up to 60-90 days after discharge.");
                constraints.add("Discharge approval turnaround by insurance TPAs typically takes between 2 to 4 hours from final bill submission.");
                constraints.add("Any non-payable deductions (co-pay, non-medical items, room excess) must be settled directly at the hospital cash counter before physical discharge.");
                questions.add("Has the final itemized bill been submitted to " + insurer + " for final discharge clearance?");
                questions.add("What is the exact non-medical deductible amount required to be paid at the hospital counter?");
                questions.add("Have all original diagnostic reports and doctor discharge summaries been collected for post-hospitalization claims?");
                documents.add("Signed Final Discharge Summary");
                documents.add("Itemized Final Bill with Receipt Breakdown");
                documents.add("Pharmacy Bills & Prescribed Discharge Medications");
                break;
        }

        return StageGuidanceDto.builder()
                .stage(stg)
                .stageTitle(formatStageTitle(stg))
                .description(getStageDescription(stg))
                .insuranceInsights(insights)
                .potentialConstraints(constraints)
                .caregiverQuestionsToAsk(questions)
                .requiredDocuments(documents)
                .disclaimer("Information shown is indicative and based on provided policy data for decision support only. It does not constitute medical advice or a binding claim guarantee.")
                .build();
    }

    private void validateStage(String stage) {
        if (!List.of("ADMISSION", "INVESTIGATION", "PROCEDURE", "RECOVERY").contains(stage)) {
            throw new IllegalArgumentException("Invalid stage: " + stage + ". Must be ADMISSION, INVESTIGATION, PROCEDURE, or RECOVERY.");
        }
    }

    private String formatStageTitle(String stage) {
        return switch (stage) {
            case "ADMISSION" -> "Stage 1: Admission & Pre-Authorization";
            case "INVESTIGATION" -> "Stage 2: Diagnostics & Clinical Investigation";
            case "PROCEDURE" -> "Stage 3: Procedure & Therapeutic Treatment";
            case "RECOVERY" -> "Stage 4: Recovery, Discharge & Claim Reconciliation";
            default -> stage;
        };
    }

    private String getStageDescription(String stage) {
        return switch (stage) {
            case "ADMISSION" -> "Patient registration, room assignment, and cashless pre-authorization submission.";
            case "INVESTIGATION" -> "In-patient diagnostic workup, laboratory tests, and specialized imaging.";
            case "PROCEDURE" -> "Surgical intervention, critical care, and specialist procedural care.";
            case "RECOVERY" -> "Post-procedure monitoring, discharge summary preparation, and final cashless claim settlement.";
            default -> "";
        };
    }

    private CareJourneyDto mapToDto(CareJourney journey) {
        List<JourneyEventDto> eventDtos = journey.getEvents() != null ? journey.getEvents().stream()
                .map(e -> JourneyEventDto.builder()
                        .id(e.getId())
                        .stage(e.getStage())
                        .description(e.getDescription())
                        .timestamp(e.getTimestamp())
                        .build())
                .toList() : List.of();

        return CareJourneyDto.builder()
                .id(journey.getId())
                .patientId(journey.getPatient() != null ? journey.getPatient().getId() : null)
                .patientName(journey.getPatient() != null ? journey.getPatient().getName() : "Unknown")
                .hospitalId(journey.getHospital() != null ? journey.getHospital().getId() : null)
                .hospitalName(journey.getHospital() != null ? journey.getHospital().getName() : "Unassigned Hospital")
                .hospitalLocation(journey.getHospital() != null ? journey.getHospital().getLocation() : "")
                .currentStage(journey.getCurrentStage())
                .createdAt(journey.getCreatedAt())
                .updatedAt(journey.getUpdatedAt())
                .events(eventDtos)
                .build();
    }
}
