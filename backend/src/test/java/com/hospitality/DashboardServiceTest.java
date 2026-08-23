package com.hospitality;

import com.hospitality.dto.CareJourneyDto;
import com.hospitality.dto.DashboardSummaryDto;
import com.hospitality.dto.PolicyResponseDto;
import com.hospitality.entity.Patient;
import com.hospitality.journey.CareJourneyService;
import com.hospitality.policy.PolicyService;
import com.hospitality.repository.HospitalRepository;
import com.hospitality.repository.PatientRepository;
import com.hospitality.service.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private HospitalRepository hospitalRepository;

    @Mock
    private PolicyService policyService;

    @Mock
    private CareJourneyService careJourneyService;

    @InjectMocks
    private DashboardService dashboardService;

    private Patient samplePatient;

    @BeforeEach
    void setUp() {
        samplePatient = Patient.builder().id(1L).name("Rajesh Verma").age(58).build();
    }

    @Test
    @DisplayName("Dashboard summary with active policy and journey computes indicative balances and metrics")
    void testGetDashboardSummaryWithActivePolicyAndJourney() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(samplePatient));

        PolicyResponseDto policy = PolicyResponseDto.builder()
                .id(1L)
                .insurerName("Star Health Allied Insurance")
                .policyType("Family Health Optima Comprehensive")
                .coverageLimit(BigDecimal.valueOf(500000))
                .remainingCoverage(BigDecimal.valueOf(450000))
                .roomLimit(BigDecimal.valueOf(5000))
                .roomCategory("Semi-Private (Twin Sharing)")
                .confirmed(true)
                .build();

        CareJourneyDto journey = CareJourneyDto.builder()
                .id(1L)
                .patientId(1L)
                .hospitalName("Apex Multi-Specialty Hospital")
                .currentStage("ADMISSION")
                .build();

        when(policyService.findActivePolicyForPatientOrNull(1L)).thenReturn(policy);
        when(careJourneyService.findLatestJourneyForPatientOrNull(1L)).thenReturn(journey);
        when(hospitalRepository.count()).thenReturn(8L);

        DashboardSummaryDto summary = dashboardService.getDashboardSummary(1L);

        assertNotNull(summary);
        assertEquals("Rajesh Verma", summary.getPatientName());
        assertEquals(58, summary.getPatientAge());
        assertEquals(0, BigDecimal.valueOf(500000).compareTo(summary.getTotalCoverageLimit()));
        assertEquals(0, BigDecimal.valueOf(450000).compareTo(summary.getRemainingCoverage()));
        assertEquals(0, BigDecimal.valueOf(450000).compareTo(summary.getIndicativeRemainingBalance()));
        assertEquals(8, summary.getTotalHospitalsAvailable());
        assertTrue(summary.getRecentAlerts().stream().anyMatch(a -> a.contains("Policy verified")));
    }

    @Test
    @DisplayName("Dashboard summary with no policy is null-safe and recommends policy upload")
    void testGetDashboardSummaryNoPolicy() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(samplePatient));
        when(policyService.findActivePolicyForPatientOrNull(1L)).thenReturn(null);
        when(careJourneyService.findLatestJourneyForPatientOrNull(1L)).thenReturn(null);
        when(hospitalRepository.count()).thenReturn(8L);

        DashboardSummaryDto summary = dashboardService.getDashboardSummary(1L);

        assertNotNull(summary);
        assertEquals(BigDecimal.ZERO, summary.getTotalCoverageLimit());
        assertEquals(BigDecimal.ZERO, summary.getRemainingCoverage());
        assertTrue(summary.getRecentAlerts().stream().anyMatch(a -> a.contains("No insurance policy active")));
        assertTrue(summary.getRecommendedActions().stream().anyMatch(a -> a.contains("Upload your insurance policy PDF")));
    }
}
