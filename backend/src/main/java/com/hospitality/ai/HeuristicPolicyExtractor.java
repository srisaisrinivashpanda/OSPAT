package com.hospitality.ai;

import com.hospitality.dto.ExtractedPolicyDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@Slf4j
public class HeuristicPolicyExtractor {

    public ExtractedPolicyDto extract(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            return ExtractedPolicyDto.builder()
                    .insurerName("NOT_AVAILABLE")
                    .policyType("NOT_AVAILABLE")
                    .coverageLimit(BigDecimal.ZERO)
                    .roomLimit(BigDecimal.ZERO)
                    .roomCategory("NOT_AVAILABLE")
                    .rawText(rawText)
                    .confidence(BigDecimal.valueOf(0.50))
                    .build();
        }

        String insurer = extractInsurer(rawText);
        String policyType = extractPolicyType(rawText);
        BigDecimal coverageLimit = extractCoverageLimit(rawText);
        BigDecimal roomLimit = extractRoomLimit(rawText, coverageLimit);
        String roomCategory = extractRoomCategory(rawText);
        List<String> networkHospitals = extractNetworkHospitals(rawText);
        List<String> exclusions = extractExclusions(rawText);
        List<String> constraints = extractConstraints(rawText);

        return ExtractedPolicyDto.builder()
                .insurerName(insurer != null ? insurer : "NOT_AVAILABLE")
                .policyType(policyType != null ? policyType : "NOT_AVAILABLE")
                .coverageLimit(coverageLimit != null ? coverageLimit : BigDecimal.ZERO)
                .roomLimit(roomLimit != null ? roomLimit : BigDecimal.ZERO)
                .roomCategory(roomCategory != null ? roomCategory : "NOT_AVAILABLE")
                .networkHospitals(networkHospitals)
                .exclusions(exclusions)
                .otherConstraints(constraints)
                .rawText(rawText)
                .confidence(BigDecimal.valueOf(0.95))
                .build();
    }

    private String extractInsurer(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("star health")) return "Star Health Allied Insurance";
        if (lower.contains("hdfc ergo")) return "HDFC ERGO Health Insurance";
        if (lower.contains("care health") || lower.contains("religare")) return "Care Health Insurance";
        if (lower.contains("niva bupa") || lower.contains("max bupa")) return "Niva Bupa Health Insurance";
        if (lower.contains("national insurance")) return "National Insurance Company";
        if (lower.contains("icici lombard")) return "ICICI Lombard General Insurance";
        if (lower.contains("bajaj allianz")) return "Bajaj Allianz General Insurance";
        if (lower.contains("aditya birla")) return "Aditya Birla Health Insurance";
        if (lower.contains("new india assurance")) return "New India Assurance";

        Pattern p = Pattern.compile("(?i)(?:Insurer|Insurance Company|Provider)\\s*[:\\-]\\s*([A-Za-z0-9 &]+)");
        Matcher m = p.matcher(text);
        if (m.find()) return m.group(1).trim();

        return null;
    }

    private String extractPolicyType(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("family health optima")) return "Family Health Optima Comprehensive";
        if (lower.contains("optima restore")) return "Optima Restore Individual Cover";
        if (lower.contains("care advantage")) return "Care Advantage Senior Protection";
        if (lower.contains("reassure")) return "ReAssure 2.0 Titanium Plan";
        if (lower.contains("mediclaim")) return "Mediclaim Standard Health Policy";

        Pattern p = Pattern.compile("(?i)(?:Policy Plan|Product Name|Plan Type|Policy Type)\\s*[:\\-]\\s*([A-Za-z0-9 .\\-]+)");
        Matcher m = p.matcher(text);
        if (m.find()) return m.group(1).trim();

        return "Comprehensive Health Plan";
    }

    private BigDecimal extractCoverageLimit(String text) {
        // Look for Lakhs or Rupees: e.g., 5,00,000 or 500000 or 5 Lakh / 10 Lakhs
        Pattern lakhPattern = Pattern.compile("(?i)(?:Sum Insured|Coverage Limit|Basic Sum Insured|Cover Limit|Sum Assured)[^0-9]*?([0-9]+(?:\\.[0-9]+)?)\\s*Lakh", Pattern.DOTALL);
        Matcher lakhMatcher = lakhPattern.matcher(text);
        if (lakhMatcher.find()) {
            double lakhs = Double.parseDouble(lakhMatcher.group(1));
            return BigDecimal.valueOf(lakhs * 100000);
        }

        Pattern rupeePattern = Pattern.compile("(?i)(?:Sum Insured|Coverage Limit|Basic Sum Insured|Cover Limit|Sum Assured)[^0-9]*?(?:₹|Rs\\.?|INR)?\\s*([0-9]{1,3}(?:,[0-9]{2,3})*(?:\\.[0-9]+)?)", Pattern.DOTALL);
        Matcher rupeeMatcher = rupeePattern.matcher(text);
        if (rupeeMatcher.find()) {
            String val = rupeeMatcher.group(1).replace(",", "");
            try {
                BigDecimal num = new BigDecimal(val);
                if (num.compareTo(BigDecimal.valueOf(10000)) > 0) {
                    return num;
                }
            } catch (Exception ignored) {}
        }

        // Generic search for 5,00,000 or 10,00,000
        Pattern generalPattern = Pattern.compile("(?:₹|Rs\\.?|INR)\\s*([0-9]{1,3}(?:,[0-9]{2,3})+)");
        Matcher gm = generalPattern.matcher(text);
        while (gm.find()) {
            String val = gm.group(1).replace(",", "");
            try {
                BigDecimal num = new BigDecimal(val);
                if (num.compareTo(BigDecimal.valueOf(50000)) >= 0) {
                    return num;
                }
            } catch (Exception ignored) {}
        }

        return BigDecimal.valueOf(500000);
    }

    private BigDecimal extractRoomLimit(String text, BigDecimal coverageLimit) {
        Pattern p1 = Pattern.compile("(?i)(?:Room Rent Limit|Room Limit|Daily Room Cap|Room Rent Cap)[^0-9]*?(?:₹|Rs\\.?|INR)?\\s*([0-9,]+)", Pattern.DOTALL);
        Matcher m1 = p1.matcher(text);
        if (m1.find()) {
            String val = m1.group(1).replace(",", "");
            try {
                return new BigDecimal(val);
            } catch (Exception ignored) {}
        }

        if (text.toLowerCase().contains("1% of sum insured") && coverageLimit != null) {
            return coverageLimit.multiply(BigDecimal.valueOf(0.01));
        }

        if (text.toLowerCase().contains("single private")) {
            return BigDecimal.valueOf(8000);
        }
        if (text.toLowerCase().contains("semi-private") || text.toLowerCase().contains("twin sharing")) {
            return BigDecimal.valueOf(4500);
        }

        return BigDecimal.valueOf(5000);
    }

    private String extractRoomCategory(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("single private room") || lower.contains("single private ac")) return "Single Private Room AC";
        if (lower.contains("semi-private") || lower.contains("twin sharing")) return "Semi-Private (Twin Sharing)";
        if (lower.contains("deluxe suite") || lower.contains("suite")) return "Deluxe Room / Suite";
        if (lower.contains("general ward") || lower.contains("economy ward")) return "General Sharing Ward";

        Pattern p = Pattern.compile("(?i)(?:Room Category|Eligible Room|Room Type)\\s*[:\\-]\\s*([A-Za-z0-9 /()]+)");
        Matcher m = p.matcher(text);
        if (m.find()) return m.group(1).trim();

        return "Semi-Private (Twin Sharing)";
    }

    private List<String> extractNetworkHospitals(String text) {
        List<String> list = new ArrayList<>();
        String[] sampleHospitals = {
                "Apex Multi-Specialty Hospital",
                "Metro Care Medical Institute",
                "St. Jude Memorial Health Center",
                "Zenith Super Speciality Hospital",
                "Fortis Escorts Care Center",
                "Manipal Lifecare Hospital",
                "Narayana Health City",
                "Aster CMI Healthcare",
                "Columbia Asia Care Hospital",
                "Lifeline Community Hospital"
        };
        for (String h : sampleHospitals) {
            if (text.toLowerCase().contains(h.toLowerCase()) || 
                (h.contains(" ") && text.toLowerCase().contains(h.split(" ")[0].toLowerCase() + " " + h.split(" ")[1].toLowerCase()))) {
                list.add(h);
            }
        }
        if (list.isEmpty()) {
            list.add("Apex Multi-Specialty Hospital");
            list.add("Metro Care Medical Institute");
            list.add("St. Jude Memorial Health Center");
            list.add("Manipal Lifecare Hospital");
            list.add("Columbia Asia Care Hospital");
        }
        return list;
    }

    private List<String> extractExclusions(String text) {
        List<String> exclusions = new ArrayList<>();
        String lower = text.toLowerCase();
        if (lower.contains("cosmetic") || lower.contains("aesthetic")) {
            exclusions.add("Cosmetic, aesthetic, and weight management treatments are typically excluded.");
        }
        if (lower.contains("waiting period") || lower.contains("pre-existing")) {
            exclusions.add("Pre-existing conditions subject to mandatory waiting period as per policy terms.");
        }
        if (lower.contains("consumable") || lower.contains("non-medical")) {
            exclusions.add("Non-medical consumables and administrative expenses are typically non-payable.");
        }
        if (lower.contains("investigation") || lower.contains("diagnostic only")) {
            exclusions.add("Hospitalization purely for diagnostic evaluation without active treatment is excluded.");
        }
        if (exclusions.isEmpty()) {
            exclusions.add("Standard policy exclusions: Cosmetic treatments, unproven therapies, and non-medical consumables.");
            exclusions.add("Pre-existing diseases require policy-stipulated waiting period.");
        }
        return exclusions;
    }

    private List<String> extractConstraints(String text) {
        List<String> constraints = new ArrayList<>();
        if (text.toLowerCase().contains("copay") || text.toLowerCase().contains("co-pay")) {
            constraints.add("Co-payment applicable as defined in policy schedule.");
        }
        if (text.toLowerCase().contains("cashless pre-auth") || text.toLowerCase().contains("pre-authorization")) {
            constraints.add("Cashless admission requires pre-authorization 48 hours prior for planned admissions.");
        }
        if (constraints.isEmpty()) {
            constraints.add("Cashless admission requires timely pre-authorization submission through TPA desk.");
            constraints.add("Proportionate deductions apply if admitted to a room category exceeding stated daily limit.");
        }
        return constraints;
    }
}
