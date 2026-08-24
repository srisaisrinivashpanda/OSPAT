package com.hospitality.ai;

import com.hospitality.dto.ExtractedPolicyDto;
import com.hospitality.dto.HospitalMatchResultDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service("heuristicAIService")
@RequiredArgsConstructor
@Slf4j
public class HeuristicAIService implements AIService {

    private final HeuristicPolicyExtractor heuristicExtractor;

    @Override
    public ExtractedPolicyDto extractPolicyFromText(String rawText) {
        log.debug("Executing deterministic heuristic policy extraction");
        return heuristicExtractor.extract(rawText);
    }

    @Override
    public String generateHospitalMatchExplanation(String insurerName, String hospitalName, HospitalMatchResultDto matchResult) {
        int score = matchResult != null ? matchResult.getCompatibilityScore() : 0;
        String hosp = hospitalName != null ? hospitalName : "This hospital";

        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Based on provided policy data, %s scored a deterministic compatibility of %d%%. ", hosp, score));

        if (matchResult != null && Boolean.TRUE.equals(matchResult.getIsNetworkMatch())) {
            sb.append("It is listed as an in-network facility under your policy schedule. ");
        } else {
            sb.append("Note that it is currently designated as out-of-network for cashless admission. ");
        }

        if (matchResult != null && Boolean.TRUE.equals(matchResult.getHasEligibleRoom())) {
            sb.append("Room categories matching your stated daily limit are available. ");
        } else {
            sb.append("Available room categories may exceed stated daily limits, which could lead to proportionate out-of-pocket deductions. ");
        }
        sb.append("Final coverage and cashless pre-authorization must be verified directly with the hospital TPA desk and insurer.");
        return sb.toString();
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
        return "Deterministic Heuristic Engine";
    }
}
