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
        if (matchResult == null) {
            return "Hospital compatibility evaluated based on standard policy parameters.";
        }

        boolean isNetwork = Boolean.TRUE.equals(matchResult.getIsNetworkMatch());
        boolean hasRoom = Boolean.TRUE.equals(matchResult.getHasEligibleRoom());
        boolean hasSpec = matchResult.getSpecialtyScore() != null && matchResult.getSpecialtyScore() > 0;

        if (isNetwork && hasRoom) {
            if (hasSpec) {
                return "In-network facility with matching specialty care and room categories within your policy limit.";
            }
            return "Strong network compatibility and room categories within your policy limit.";
        } else if (isNetwork && !hasRoom) {
            return "In-network facility for cashless admission, but available room tariffs may exceed your daily limit.";
        } else if (!isNetwork && hasRoom) {
            return "Your policy supports available room categories, but this hospital is out-of-network for cashless admission.";
        } else {
            return "Out-of-network facility where room tariffs exceed stated limits, requiring reimbursement filing.";
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
        return "Deterministic Heuristic Engine";
    }
}
