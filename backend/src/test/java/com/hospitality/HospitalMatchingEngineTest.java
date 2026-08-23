package com.hospitality;

import com.hospitality.dto.HospitalMatchResultDto;
import com.hospitality.dto.RoomEvaluationDto;
import com.hospitality.entity.*;
import com.hospitality.matching.HospitalMatchingEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class HospitalMatchingEngineTest {

    private HospitalMatchingEngine matchingEngine;

    @BeforeEach
    void setUp() {
        matchingEngine = new HospitalMatchingEngine();
        ReflectionTestUtils.setField(matchingEngine, "networkWeight", 0.40);
        ReflectionTestUtils.setField(matchingEngine, "roomWeight", 0.30);
        ReflectionTestUtils.setField(matchingEngine, "availabilityWeight", 0.20);
        ReflectionTestUtils.setField(matchingEngine, "constraintsWeight", 0.10);
    }

    @Test
    @DisplayName("In-network hospital with room under cap should achieve high compatibility with transparent breakdown")
    void testInNetworkAndRoomUnderCap() {
        Hospital hospital = Hospital.builder()
                .id(1L)
                .name("Apex Multi-Specialty Hospital")
                .location("Indiranagar, Bengaluru")
                .networkStatus("IN_NETWORK")
                .roomCategories(Set.of(
                        RoomCategory.builder().id(1L).name("General Ward").dailyCost(BigDecimal.valueOf(2000)).available(true).build(),
                        RoomCategory.builder().id(2L).name("Semi-Private").dailyCost(BigDecimal.valueOf(4000)).available(true).build(),
                        RoomCategory.builder().id(3L).name("Deluxe Suite").dailyCost(BigDecimal.valueOf(10000)).available(true).build()
                ))
                .specialties(Set.of(
                        HospitalSpecialty.builder().id(1L).specialty("Cardiology").build(),
                        HospitalSpecialty.builder().id(2L).specialty("Orthopedics").build()
                ))
                .build();

        InsurancePolicy policy = InsurancePolicy.builder()
                .id(1L)
                .insurerName("Star Health Allied Insurance")
                .coverageLimit(BigDecimal.valueOf(500000))
                .roomLimit(BigDecimal.valueOf(5000))
                .networkHospitals(Set.of(NetworkHospital.builder().hospital(hospital).build()))
                .build();

        HospitalMatchResultDto result = matchingEngine.matchHospital(policy, hospital, "Cardiology");

        assertNotNull(result);
        assertEquals(100, result.getCompatibilityScore());
        assertEquals(100, result.getTotalScore());
        assertEquals(40, result.getNetworkScore());
        assertEquals(30, result.getRoomScore());
        assertEquals(20, result.getSpecialtyScore());
        assertEquals(10, result.getPolicyConstraintScore());
        assertEquals("HIGH_COMPATIBILITY", result.getScoreRating());
        assertTrue(result.getIsNetworkMatch());
        assertTrue(result.getHasEligibleRoom());
        assertEquals(3, result.getRoomEvaluations().size());

        RoomEvaluationDto semiPrivate = result.getRoomEvaluations().stream()
                .filter(r -> r.getRoomName().equals("Semi-Private"))
                .findFirst().orElseThrow();
        assertEquals("WITHIN_STATED_LIMIT", semiPrivate.getCompatibilityStatus());
        assertTrue(semiPrivate.getWithinPolicyLimit());
        assertTrue(semiPrivate.getAdvisoryNote().contains("within stated policy limit"));

        RoomEvaluationDto deluxe = result.getRoomEvaluations().stream()
                .filter(r -> r.getRoomName().equals("Deluxe Suite"))
                .findFirst().orElseThrow();
        assertEquals("EXCEEDS_STATED_LIMIT", deluxe.getCompatibilityStatus());
        assertFalse(deluxe.getWithinPolicyLimit());
    }

    @Test
    @DisplayName("Out-of-network hospital with exceeding room rates should receive lower score and considerations")
    void testOutOfNetworkAndExceedingRooms() {
        Hospital hospital = Hospital.builder()
                .id(2L)
                .name("Aster Healthcare")
                .location("Hebbal, Bengaluru")
                .networkStatus("OUT_OF_NETWORK")
                .roomCategories(Set.of(
                        RoomCategory.builder().id(4L).name("Single Deluxe AC").dailyCost(BigDecimal.valueOf(9000)).available(true).build()
                ))
                .specialties(Set.of(
                        HospitalSpecialty.builder().id(3L).specialty("Bariatric Surgery").build()
                ))
                .build();

        InsurancePolicy policy = InsurancePolicy.builder()
                .id(2L)
                .insurerName("National Insurance")
                .coverageLimit(BigDecimal.valueOf(300000))
                .roomLimit(BigDecimal.valueOf(3000))
                .build();

        HospitalMatchResultDto result = matchingEngine.matchHospital(policy, hospital, "Oncology");

        assertNotNull(result);
        assertFalse(result.getIsNetworkMatch());
        assertFalse(result.getHasEligibleRoom());
        assertEquals(10, result.getNetworkScore()); // 0.25 * 40 = 10
        assertEquals(9, result.getRoomScore());     // 0.30 * 30 = 9
        assertEquals(0, result.getSpecialtyScore()); // 0.0 * 20 = 0
        assertEquals(10, result.getPolicyConstraintScore());
        assertEquals(29, result.getCompatibilityScore());
        assertEquals("LOW_COMPATIBILITY", result.getScoreRating());
        assertTrue(result.getConsiderations().stream().anyMatch(c -> c.contains("Out-of-network")));
    }

    @Test
    @DisplayName("When no specialty is requested, specialty factor is evaluated neutrally and documented")
    void testNoSpecialtyRequested() {
        Hospital hospital = Hospital.builder()
                .id(1L)
                .name("Apex Multi-Specialty Hospital")
                .networkStatus("IN_NETWORK")
                .roomCategories(Set.of(
                        RoomCategory.builder().id(1L).name("General Ward").dailyCost(BigDecimal.valueOf(3000)).available(true).build()
                ))
                .specialties(Set.of(
                        HospitalSpecialty.builder().id(1L).specialty("Cardiology").build(),
                        HospitalSpecialty.builder().id(2L).specialty("Neurology").build()
                ))
                .build();

        InsurancePolicy policy = InsurancePolicy.builder()
                .id(1L)
                .coverageLimit(BigDecimal.valueOf(500000))
                .roomLimit(BigDecimal.valueOf(5000))
                .build();

        // Null specialty
        HospitalMatchResultDto resultNull = matchingEngine.matchHospital(policy, hospital, null);
        // Blank specialty
        HospitalMatchResultDto resultBlank = matchingEngine.matchHospital(policy, hospital, "   ");

        assertNotNull(resultNull);
        assertEquals(10, resultNull.getSpecialtyScore()); // 0.50 * 20 = 10
        assertEquals(90, resultNull.getCompatibilityScore()); // 40 + 30 + 10 + 10 = 90
        assertTrue(resultNull.getMatchingFactors().stream().anyMatch(f -> f.contains("No specific specialty requested")));

        assertEquals(resultNull.getCompatibilityScore(), resultBlank.getCompatibilityScore());
    }

    @Test
    @DisplayName("Deterministic score reproducibility: same inputs produce exact same score")
    void testScoreReproducibility() {
        Hospital hospital = Hospital.builder()
                .id(1L)
                .name("City General Hospital")
                .networkStatus("IN_NETWORK")
                .roomCategories(Set.of(
                        RoomCategory.builder().id(1L).name("Semi-Private").dailyCost(BigDecimal.valueOf(4500)).available(true).build()
                ))
                .specialties(Set.of(
                        HospitalSpecialty.builder().id(1L).specialty("General Surgery").build()
                ))
                .build();

        InsurancePolicy policy = InsurancePolicy.builder()
                .id(1L)
                .coverageLimit(BigDecimal.valueOf(400000))
                .roomLimit(BigDecimal.valueOf(4000))
                .build();

        HospitalMatchResultDto result1 = matchingEngine.matchHospital(policy, hospital, "General Surgery");
        HospitalMatchResultDto result2 = matchingEngine.matchHospital(policy, hospital, "General Surgery");

        assertEquals(result1.getCompatibilityScore(), result2.getCompatibilityScore());
        assertEquals(result1.getNetworkScore(), result2.getNetworkScore());
        assertEquals(result1.getRoomScore(), result2.getRoomScore());
        assertEquals(result1.getSpecialtyScore(), result2.getSpecialtyScore());
        assertEquals(result1.getMatchingFactors(), result2.getMatchingFactors());
        assertEquals(result1.getConsiderations(), result2.getConsiderations());
    }

    @Test
    @DisplayName("Missing hospital room data is handled without fabricating assumptions")
    void testMissingRoomData() {
        Hospital hospital = Hospital.builder()
                .id(3L)
                .name("Community Clinic")
                .networkStatus("IN_NETWORK")
                .roomCategories(Set.of())
                .specialties(Set.of())
                .build();

        InsurancePolicy policy = InsurancePolicy.builder()
                .id(1L)
                .coverageLimit(BigDecimal.valueOf(500000))
                .roomLimit(BigDecimal.valueOf(5000))
                .build();

        HospitalMatchResultDto result = matchingEngine.matchHospital(policy, hospital, null);

        assertNotNull(result);
        assertEquals(0, result.getRoomScore());
        assertEquals(0, result.getSpecialtyScore());
        assertEquals(40, result.getNetworkScore());
        assertEquals(10, result.getPolicyConstraintScore());
        assertEquals(50, result.getCompatibilityScore());
        assertTrue(result.getConsiderations().stream().anyMatch(c -> c.contains("Room category information is currently unavailable")));
    }
}
