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
            return "Hospital compatibility evaluated based on standard policy parameters. Verify room tariffs and network status with the hospital TPA desk before admission.";
        }

        String insurer = (insurerName != null && !insurerName.isBlank()) ? insurerName : "your insurer";
        String hosp = (hospitalName != null && !hospitalName.isBlank()) ? hospitalName : "This hospital";
        boolean isNetwork = Boolean.TRUE.equals(matchResult.getIsNetworkMatch());
        boolean hasRoom = Boolean.TRUE.equals(matchResult.getHasEligibleRoom());
        int score = matchResult.getCompatibilityScore() != null ? matchResult.getCompatibilityScore() : 0;
        String lowestRoom = matchResult.getLowestEligibleRoomCost() != null ? "₹" + matchResult.getLowestEligibleRoomCost().toPlainString() + "/day" : "standard limits";

        if (isNetwork && hasRoom) {
            return String.format(
                "%s is a strong fit for your policy with an overall compatibility score of %d%%. As an in-network provider for %s, planned cashless hospitalization is supported subject to insurer pre-authorization. Available room categories include options starting from %s, fitting comfortably within your policy limit. If you choose a room category above the stated cap, additional out-of-pocket room differentials and proportionate deductions may apply.\n\nWhat to confirm:\nAsk the hospital cashless/TPA desk to verify room category availability, confirm your policy pre-authorization checklist, and confirm that all primary treatment components fall under the network agreement.",
                hosp, score, insurer, lowestRoom
            );
        } else if (isNetwork && !hasRoom) {
            return String.format(
                "%s is listed as an in-network hospital under %s (Score: %d%%), meaning cashless pre-authorization can be initiated. However, available room tariffs currently exceed your stated policy room limit. Choosing a room above your daily limit will require paying the daily rate difference out-of-pocket and may trigger proportionate deductions across doctor fees and procedure charges.\n\nWhat to confirm:\nAsk the hospital admission desk whether lower-tier standard or twin-sharing rooms are available, or request an itemized pre-admission estimate of expected out-of-pocket room deductions.",
                hosp, insurer, score
            );
        } else if (!isNetwork && hasRoom) {
            return String.format(
                "%s offers room categories starting from %s that comply with your policy daily limit (Score: %d%%). However, because this facility is currently out-of-network for %s, cashless admission is unavailable and upfront payment will be required. You will need to file a post-discharge reimbursement claim with your insurer along with original bills and diagnostic reports.\n\nWhat to confirm:\nAsk the hospital billing department for upfront deposit and payment timeline requirements, and verify required claim documentation and claim submission deadlines with your insurer.",
                hosp, lowestRoom, score, insurer
            );
        } else {
            return String.format(
                "%s is currently out-of-network for %s, and available room tariffs exceed your stated daily room limit (Score: %d%%). Cashless hospitalization is unavailable, requiring full upfront out-of-pocket payment before filing for reimbursement. Additionally, exceeding room-rent caps may lead to significant proportionate deductions during claim settlement.\n\nWhat to confirm:\nRequest a comprehensive cost estimate from hospital billing, confirm non-network reimbursement terms with your insurer, and evaluate whether an in-network facility with matching room limits is available.",
                hosp, insurer, score
            );
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
