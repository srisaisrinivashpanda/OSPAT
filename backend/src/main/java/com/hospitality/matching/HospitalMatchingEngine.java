package com.hospitality.matching;

import com.hospitality.dto.HospitalMatchResultDto;
import com.hospitality.dto.RoomEvaluationDto;
import com.hospitality.entity.Hospital;
import com.hospitality.entity.HospitalSpecialty;
import com.hospitality.entity.InsurancePolicy;
import com.hospitality.entity.RoomCategory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Component
@Slf4j
public class HospitalMatchingEngine {

    @Value("${hospitality.matching.weights.network:0.40}")
    private double networkWeight;

    @Value("${hospitality.matching.weights.room:0.30}")
    private double roomWeight;

    @Value("${hospitality.matching.weights.availability:0.20}")
    private double availabilityWeight;

    @Value("${hospitality.matching.weights.constraints:0.10}")
    private double constraintsWeight;

    /**
     * Executes deterministic compatibility scoring between an insurance policy and a hospital.
     * The score calculation is completely deterministic and reproducible.
     */
    public HospitalMatchResultDto matchHospital(InsurancePolicy policy, Hospital hospital, String requestedSpecialty) {
        List<String> factors = new ArrayList<>();
        List<String> considerations = new ArrayList<>();
        List<RoomEvaluationDto> roomEvaluations = new ArrayList<>();

        double rawNetworkScore;
        double rawRoomScore;
        double rawSpecialtyScore;
        double rawConstraintsScore = 1.0; // Baseline standard policy terms

        // 1. Network Status Matching (Weight: 40%)
        boolean isNetworkMatch = checkNetworkStatus(policy, hospital);
        if (isNetworkMatch) {
            rawNetworkScore = 1.0;
            factors.add("Listed network hospital: Potential cashless hospitalization consideration under policy terms, subject to insurer pre-authorization.");
        } else {
            rawNetworkScore = 0.25;
            considerations.add("Out-of-network facility: Based on provided policy data, cashless facility is typically unavailable; reimbursement claim filing subject to insurer review.");
        }

        // 2. Room Compatibility (Weight: 30%)
        BigDecimal policyRoomLimit = policy != null && policy.getRoomLimit() != null && policy.getRoomLimit().compareTo(BigDecimal.ZERO) > 0
                ? policy.getRoomLimit() 
                : (policy != null ? policy.getRoomLimit() : BigDecimal.valueOf(5000));
        
        BigDecimal lowestEligibleCost = null;
        BigDecimal highestCost = null;
        boolean hasEligibleRoom = false;

        Collection<RoomCategory> rooms = hospital != null && hospital.getRoomCategories() != null 
                ? hospital.getRoomCategories() 
                : Set.of();

        if (rooms.isEmpty()) {
            rawRoomScore = 0.0;
            considerations.add("Room category information is currently unavailable for this hospital.");
        } else {
            for (RoomCategory room : rooms) {
                BigDecimal dailyCost = room.getDailyCost() != null ? room.getDailyCost() : BigDecimal.ZERO;
                if (highestCost == null || dailyCost.compareTo(highestCost) > 0) {
                    highestCost = dailyCost;
                }

                if (policyRoomLimit == null || policyRoomLimit.compareTo(BigDecimal.ZERO) <= 0) {
                    // Policy room limit is not specified in provided data
                    roomEvaluations.add(RoomEvaluationDto.builder()
                            .roomId(room.getId())
                            .roomName(room.getName())
                            .dailyCost(dailyCost)
                            .policyLimit(BigDecimal.ZERO)
                            .costDifference(BigDecimal.ZERO)
                            .withinPolicyLimit(null)
                            .available(room.getAvailable())
                            .compatibilityStatus("POLICY_CONSIDERATION")
                            .advisoryNote("Daily room limit is not specified in provided policy data. Verify room coverage with insurer before admission.")
                            .build());
                    continue;
                }

                BigDecimal diff = dailyCost.subtract(policyRoomLimit);
                boolean withinLimit = diff.compareTo(BigDecimal.ZERO) <= 0;
                String status;
                String advisoryNote;

                if (withinLimit) {
                    status = "WITHIN_STATED_LIMIT";
                    advisoryNote = "Daily room rent (₹" + dailyCost.toPlainString() + ") is within stated policy limit of ₹" + policyRoomLimit.toPlainString() + "/day. Final reimbursement subject to insurer policy terms.";
                    hasEligibleRoom = true;
                    if (lowestEligibleCost == null || dailyCost.compareTo(lowestEligibleCost) < 0) {
                        lowestEligibleCost = dailyCost;
                    }
                } else {
                    double excessPct = policyRoomLimit.compareTo(BigDecimal.ZERO) > 0
                            ? diff.divide(policyRoomLimit, 4, RoundingMode.HALF_UP).doubleValue() * 100
                            : 100.0;
                    if (excessPct <= 40.0) {
                        status = "POLICY_CONSIDERATION";
                        advisoryNote = String.format("Exceeds stated limit by ₹%s/day. Differential room rent is typically an out-of-pocket expense.", diff.toPlainString());
                    } else {
                        status = "EXCEEDS_STATED_LIMIT";
                        advisoryNote = String.format("Exceeds stated limit by ₹%s/day. Proportionate deductions may apply across associated medical charges as per insurer policy terms.", diff.toPlainString());
                    }
                }

                roomEvaluations.add(RoomEvaluationDto.builder()
                        .roomId(room.getId())
                        .roomName(room.getName())
                        .dailyCost(dailyCost)
                        .policyLimit(policyRoomLimit)
                        .costDifference(diff)
                        .withinPolicyLimit(withinLimit)
                        .available(room.getAvailable())
                        .compatibilityStatus(status)
                        .advisoryNote(advisoryNote)
                        .build());
            }

            if (hasEligibleRoom) {
                rawRoomScore = 1.0;
                factors.add(String.format("Room categories available starting from ₹%s/day within stated policy limit of ₹%s/day.",
                        lowestEligibleCost != null ? lowestEligibleCost.toPlainString() : "N/A",
                        policyRoomLimit != null ? policyRoomLimit.toPlainString() : "N/A"));
            } else if (policyRoomLimit == null || policyRoomLimit.compareTo(BigDecimal.ZERO) <= 0) {
                rawRoomScore = 0.50;
                considerations.add("Policy room limit is not defined; verify room category eligibility with insurer.");
            } else {
                rawRoomScore = 0.30;
                considerations.add(String.format("All available room categories exceed the stated daily room limit of ₹%s/day. Proportionate deductions may apply.",
                        policyRoomLimit.toPlainString()));
            }
        }

        // 3. Specialty Alignment (Weight: 20%)
        List<String> specialties = hospital != null && hospital.getSpecialties() != null 
                ? hospital.getSpecialties().stream().map(HospitalSpecialty::getSpecialty).toList() 
                : List.of();

        if (requestedSpecialty != null && !requestedSpecialty.trim().isEmpty()) {
            String reqSpecTrimmed = requestedSpecialty.trim().toLowerCase();
            boolean specialtyFound = specialties.stream()
                    .anyMatch(s -> s.equalsIgnoreCase(reqSpecTrimmed) || s.toLowerCase().contains(reqSpecTrimmed) || reqSpecTrimmed.contains(s.toLowerCase()));
            if (specialtyFound) {
                rawSpecialtyScore = 1.0;
                factors.add("Requested specialty ('" + requestedSpecialty.trim() + "') is listed as an active department at this facility.");
            } else {
                rawSpecialtyScore = 0.0;
                considerations.add("Requested specialty ('" + requestedSpecialty.trim() + "') is not listed among primary departments at this facility.");
            }
        } else {
            // When no specialty is requested, evaluate baseline clinical department readiness
            if (!specialties.isEmpty()) {
                rawSpecialtyScore = 0.50; // Neutral baseline when not filtering by specialty
                factors.add("Clinical departments available: " + String.join(", ", specialties.stream().limit(3).toList()) + ". (No specific specialty requested for query filtering).");
            } else {
                rawSpecialtyScore = 0.0;
                considerations.add("No clinical specialty departments currently listed for this facility.");
            }
        }

        // 4. Policy Constraints & Baseline Terms (Weight: 10%)
        if (policy != null && policy.getExclusions() != null && !policy.getExclusions().isEmpty()) {
            factors.add("Standard policy terms and exclusions noted from provided document. Verify specific treatments with hospital/insurer.");
        } else {
            factors.add("Standard policy terms and baseline conditions apply.");
        }

        // Calculate Sub-scores
        int calculatedNetworkScore = (int) Math.round(rawNetworkScore * (networkWeight * 100));
        int calculatedRoomScore = (int) Math.round(rawRoomScore * (roomWeight * 100));
        int calculatedSpecialtyScore = (int) Math.round(rawSpecialtyScore * (availabilityWeight * 100));
        int calculatedConstraintScore = (int) Math.round(rawConstraintsScore * (constraintsWeight * 100));

        int finalScore = calculatedNetworkScore + calculatedRoomScore + calculatedSpecialtyScore + calculatedConstraintScore;
        finalScore = Math.min(100, Math.max(0, finalScore));

        String scoreRating;
        if (finalScore >= 80) {
            scoreRating = "HIGH_COMPATIBILITY";
        } else if (finalScore >= 50) {
            scoreRating = "MODERATE_COMPATIBILITY";
        } else {
            scoreRating = "LOW_COMPATIBILITY";
        }

        return HospitalMatchResultDto.builder()
                .hospitalId(hospital != null ? hospital.getId() : null)
                .hospitalName(hospital != null ? hospital.getName() : "Unknown Hospital")
                .location(hospital != null ? hospital.getLocation() : "")
                .address(hospital != null ? hospital.getAddress() : "")
                .networkStatus(isNetworkMatch ? "IN_NETWORK" : "OUT_OF_NETWORK")
                .isNetworkMatch(isNetworkMatch)
                .compatibilityScore(finalScore)
                .totalScore(finalScore)
                .networkScore(calculatedNetworkScore)
                .roomScore(calculatedRoomScore)
                .specialtyScore(calculatedSpecialtyScore)
                .policyConstraintScore(calculatedConstraintScore)
                .scoreRating(scoreRating)
                .matchingFactors(factors)
                .considerations(considerations)
                .specialties(specialties)
                .roomEvaluations(roomEvaluations)
                .lowestEligibleRoomCost(lowestEligibleCost)
                .highestRoomCost(highestCost)
                .hasEligibleRoom(hasEligibleRoom)
                .build();
    }

    private boolean checkNetworkStatus(InsurancePolicy policy, Hospital hospital) {
        if (hospital == null) return false;
        if (policy != null && policy.getNetworkHospitals() != null && !policy.getNetworkHospitals().isEmpty()) {
            return policy.getNetworkHospitals().stream()
                    .anyMatch(nh -> nh.getHospital() != null && nh.getHospital().getId().equals(hospital.getId()));
        }
        return "IN_NETWORK".equalsIgnoreCase(hospital.getNetworkStatus());
    }
}
