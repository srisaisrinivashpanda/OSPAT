package com.hospitality;

import com.hospitality.ai.HeuristicPolicyExtractor;
import com.hospitality.dto.ExtractedPolicyDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class HeuristicPolicyExtractorTest {

    private HeuristicPolicyExtractor extractor;

    @BeforeEach
    void setUp() {
        extractor = new HeuristicPolicyExtractor();
    }

    @Test
    @DisplayName("Extract structured data from Star Health policy document text")
    void testExtractStarHealthPolicy() {
        String sampleText = """
                STAR HEALTH AND ALLIED INSURANCE COMPANY LIMITED
                Policy Plan: Family Health Optima Comprehensive
                Sum Insured: Rs. 5,00,000
                Daily Room Rent Limit: Up to Rs. 5,000 per day
                Eligible Room Category: Semi-Private Room (Twin Sharing)
                Network Hospital: Apex Multi-Specialty Hospital, Metro Care Medical Institute
                
                Exclusions:
                1. Cosmetic and aesthetic treatments are not covered.
                2. Pre-existing illness waiting period of 36 months.
                3. Non-medical consumables excluded.
                """;

        ExtractedPolicyDto result = extractor.extract(sampleText);

        assertNotNull(result);
        assertEquals("Star Health Allied Insurance", result.getInsurerName());
        assertEquals("Family Health Optima Comprehensive", result.getPolicyType());
        assertEquals(0, BigDecimal.valueOf(500000).compareTo(result.getCoverageLimit()));
        assertEquals(0, BigDecimal.valueOf(5000).compareTo(result.getRoomLimit()));
        assertTrue(result.getExclusions().size() >= 2);
        assertTrue(result.getNetworkHospitals().size() >= 2);
    }

    @Test
    @DisplayName("Extract structured data from HDFC ERGO policy document text")
    void testExtractHdfcErgoPolicy() {
        String sampleText = """
                HDFC ERGO GENERAL INSURANCE COMPANY LIMITED
                Policy Plan: Optima Restore Individual Cover
                Sum Insured: Rs. 10,00,000 (Ten Lakhs Only)
                Daily Room Rent Limit: Rs. 8,000 per day
                Eligible Room Category: Single Private Room AC
                Network Hospital: Fortis Escorts Care Center, Narayana Health City
                
                Exclusions:
                1. Cosmetic surgery not covered.
                2. Non-medical consumables excluded.
                """;

        ExtractedPolicyDto result = extractor.extract(sampleText);

        assertNotNull(result);
        assertEquals("HDFC ERGO Health Insurance", result.getInsurerName());
        assertEquals("Optima Restore Individual Cover", result.getPolicyType());
        assertEquals(0, BigDecimal.valueOf(1000000).compareTo(result.getCoverageLimit()));
        assertEquals(0, BigDecimal.valueOf(8000).compareTo(result.getRoomLimit()));
        assertEquals("Single Private Room AC", result.getRoomCategory());
    }

    @Test
    @DisplayName("Extract structured data from Care Health policy document text")
    void testExtractCareHealthPolicy() {
        String sampleText = """
                CARE HEALTH INSURANCE LIMITED
                Policy Plan: Care Advantage Senior Protection
                Basic Sum Insured: 7.5 Lakh
                Room Rent Limit: Rs. 4,000 per day
                Eligible Room: Semi-Private (Twin Sharing)
                """;

        ExtractedPolicyDto result = extractor.extract(sampleText);

        assertNotNull(result);
        assertEquals("Care Health Insurance", result.getInsurerName());
        assertEquals("Care Advantage Senior Protection", result.getPolicyType());
        assertEquals(0, BigDecimal.valueOf(750000).compareTo(result.getCoverageLimit()));
        assertEquals(0, BigDecimal.valueOf(4000).compareTo(result.getRoomLimit()));
    }

    @Test
    @DisplayName("Empty or null text returns safe fallback object without crashing")
    void testExtractEmptyOrNullText() {
        ExtractedPolicyDto nullResult = extractor.extract(null);
        assertNotNull(nullResult);
        assertEquals("NOT_AVAILABLE", nullResult.getInsurerName());
        assertEquals(BigDecimal.ZERO, nullResult.getCoverageLimit());

        ExtractedPolicyDto blankResult = extractor.extract("   ");
        assertNotNull(blankResult);
        assertEquals("NOT_AVAILABLE", blankResult.getInsurerName());
    }
}
