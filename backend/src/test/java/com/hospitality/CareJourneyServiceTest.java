package com.hospitality;

import com.hospitality.dto.CareJourneyDto;
import com.hospitality.dto.JourneyContextDto;
import com.hospitality.dto.JourneyStageUpdateRequestDto;
import com.hospitality.entity.CareJourney;
import com.hospitality.entity.Hospital;
import com.hospitality.entity.InsurancePolicy;
import com.hospitality.entity.Patient;
import com.hospitality.journey.CareJourneyService;
import com.hospitality.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CareJourneyServiceTest {

    @Mock
    private CareJourneyRepository careJourneyRepository;

    @Mock
    private JourneyEventRepository journeyEventRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private HospitalRepository hospitalRepository;

    @Mock
    private InsurancePolicyRepository policyRepository;

    @InjectMocks
    private CareJourneyService careJourneyService;

    private Patient samplePatient;
    private Hospital sampleHospital;
    private CareJourney sampleJourney;

    @BeforeEach
    void setUp() {
        samplePatient = Patient.builder().id(1L).name("Rajesh Verma").age(58).build();
        sampleHospital = Hospital.builder().id(1L).name("Apex Hospital").location("Indiranagar").networkStatus("IN_NETWORK").build();
        sampleJourney = CareJourney.builder().id(10L).patient(samplePatient).hospital(sampleHospital).currentStage("ADMISSION").build();
    }

    @Test
    @DisplayName("Create or update care journey successfully initiates ADMISSION stage")
    void testCreateOrUpdateJourney() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(samplePatient));
        when(hospitalRepository.findById(1L)).thenReturn(Optional.of(sampleHospital));
        when(careJourneyRepository.findFirstByPatientIdOrderByUpdatedAtDesc(1L)).thenReturn(Optional.empty());
        when(careJourneyRepository.save(any(CareJourney.class))).thenAnswer(invocation -> {
            CareJourney c = invocation.getArgument(0);
            c.setId(100L);
            return c;
        });

        CareJourneyDto dto = careJourneyService.createOrUpdateJourney(1L, 1L);

        assertNotNull(dto);
        assertEquals("ADMISSION", dto.getCurrentStage());
        assertEquals("Apex Hospital", dto.getHospitalName());
        verify(journeyEventRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Valid stage transition advances stage and records journey event")
    void testUpdateJourneyStageValid() {
        when(careJourneyRepository.findById(10L)).thenReturn(Optional.of(sampleJourney));
        when(careJourneyRepository.save(any(CareJourney.class))).thenReturn(sampleJourney);

        JourneyStageUpdateRequestDto req = new JourneyStageUpdateRequestDto();
        req.setStage("PROCEDURE");
        req.setNote("Patient scheduled for surgery");

        CareJourneyDto updated = careJourneyService.updateJourneyStage(10L, req);

        assertNotNull(updated);
        assertEquals("PROCEDURE", sampleJourney.getCurrentStage());
        verify(journeyEventRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Invalid stage transition throws IllegalArgumentException")
    void testUpdateJourneyStageInvalid() {
        when(careJourneyRepository.findById(10L)).thenReturn(Optional.of(sampleJourney));

        JourneyStageUpdateRequestDto req = new JourneyStageUpdateRequestDto();
        req.setStage("INVALID_STAGE_NAME");

        assertThrows(IllegalArgumentException.class, () -> careJourneyService.updateJourneyStage(10L, req));
    }

    @Test
    @DisplayName("Retrieve stage context returns indicative balance and caregiver questions with disclaimer")
    void testGetJourneyContext() {
        InsurancePolicy policy = InsurancePolicy.builder()
                .id(1L)
                .insurerName("Star Health")
                .coverageLimit(BigDecimal.valueOf(500000))
                .remainingCoverage(BigDecimal.valueOf(450000))
                .roomLimit(BigDecimal.valueOf(5000))
                .confirmed(true)
                .build();

        when(careJourneyRepository.findById(10L)).thenReturn(Optional.of(sampleJourney));
        when(policyRepository.findByPatientIdAndConfirmedTrueOrderByUpdatedAtDesc(1L)).thenReturn(List.of(policy));

        JourneyContextDto context = careJourneyService.getJourneyContext(10L);

        assertNotNull(context);
        assertEquals("ADMISSION", context.getCurrentStage());
        assertEquals(0, BigDecimal.valueOf(450000).compareTo(context.getRemainingCoverage()));
        assertEquals(0, BigDecimal.valueOf(450000).compareTo(context.getIndicativeRemainingBalance()));
        assertNotNull(context.getCurrentStageGuidance());
        assertTrue(context.getCurrentStageGuidance().getCaregiverQuestionsToAsk().size() >= 2);
        assertTrue(context.getCurrentStageGuidance().getDisclaimer().contains("does not constitute medical advice or a binding claim guarantee"));
    }
}
