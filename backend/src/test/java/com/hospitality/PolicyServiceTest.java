package com.hospitality;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospitality.ai.AIService;
import com.hospitality.dto.ExtractedPolicyDto;
import com.hospitality.dto.PolicyResponseDto;
import com.hospitality.dto.PolicyUpdateRequestDto;
import com.hospitality.entity.InsurancePolicy;
import com.hospitality.entity.Patient;
import com.hospitality.policy.PdfExtractionService;
import com.hospitality.policy.PolicyService;
import com.hospitality.repository.HospitalRepository;
import com.hospitality.repository.InsurancePolicyRepository;
import com.hospitality.repository.PatientRepository;
import com.hospitality.repository.PolicyExtractionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PolicyServiceTest {

    @Mock
    private PdfExtractionService pdfExtractionService;

    @Mock
    private AIService aiService;

    @Mock
    private InsurancePolicyRepository policyRepository;

    @Mock
    private PolicyExtractionRepository extractionRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private HospitalRepository hospitalRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private PolicyService policyService;

    private Patient samplePatient;

    @BeforeEach
    void setUp() {
        samplePatient = Patient.builder().id(1L).name("Rajesh Verma").age(58).build();
    }

    @Test
    @DisplayName("Extract and save policy from PDF creates draft policy in database")
    void testExtractAndSavePolicyFromPdf() throws IOException {
        MockMultipartFile file = new MockMultipartFile("file", "test_policy.pdf", "application/pdf", "%PDF-1.4 test".getBytes());

        when(patientRepository.findById(1L)).thenReturn(Optional.of(samplePatient));
        when(pdfExtractionService.extractTextFromPdf(file)).thenReturn("Star Health Policy Sample");

        ExtractedPolicyDto extractedDto = ExtractedPolicyDto.builder()
                .insurerName("Star Health Allied Insurance")
                .policyType("Family Health Optima Comprehensive")
                .coverageLimit(BigDecimal.valueOf(500000))
                .roomLimit(BigDecimal.valueOf(5000))
                .roomCategory("Semi-Private Room")
                .exclusions(List.of("Cosmetic treatments excluded"))
                .build();

        when(aiService.extractPolicyFromText("Star Health Policy Sample")).thenReturn(extractedDto);
        when(hospitalRepository.findAll()).thenReturn(List.of());
        when(policyRepository.save(any(InsurancePolicy.class))).thenAnswer(inv -> {
            InsurancePolicy p = inv.getArgument(0);
            p.setId(42L);
            return p;
        });

        ExtractedPolicyDto result = policyService.extractAndSavePolicyFromPdf(file, 1L);

        assertNotNull(result);
        assertEquals(42L, result.getPolicyId());
        assertEquals("Star Health Allied Insurance", result.getInsurerName());
        verify(policyRepository, times(1)).save(any());
        verify(extractionRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Empty upload file throws IllegalArgumentException")
    void testEmptyFileThrowsException() {
        MockMultipartFile emptyFile = new MockMultipartFile("file", "empty.pdf", "application/pdf", new byte[0]);
        assertThrows(IllegalArgumentException.class, () -> policyService.extractAndSavePolicyFromPdf(emptyFile, 1L));
    }

    @Test
    @DisplayName("Confirm and activate policy updates fields and sets status to ACTIVE")
    void testConfirmAndActivatePolicy() {
        InsurancePolicy policy = InsurancePolicy.builder()
                .id(1L)
                .patient(samplePatient)
                .policyStatus("DRAFT")
                .confirmed(false)
                .build();

        when(policyRepository.findById(1L)).thenReturn(Optional.of(policy));
        when(policyRepository.save(any(InsurancePolicy.class))).thenAnswer(inv -> inv.getArgument(0));

        PolicyUpdateRequestDto req = PolicyUpdateRequestDto.builder()
                .insurerName("HDFC ERGO Health Insurance")
                .policyType("Optima Restore Individual Cover")
                .coverageLimit(BigDecimal.valueOf(1000000))
                .remainingCoverage(BigDecimal.valueOf(1000000))
                .roomLimit(BigDecimal.valueOf(8000))
                .roomCategory("Single Private Room AC")
                .confirmed(true)
                .exclusions(List.of("Maternity excluded"))
                .build();

        PolicyResponseDto result = policyService.confirmAndActivatePolicy(1L, req);

        assertNotNull(result);
        assertEquals("ACTIVE", policy.getPolicyStatus());
        assertTrue(policy.getConfirmed());
        assertEquals("HDFC ERGO Health Insurance", policy.getInsurerName());
        assertEquals(0, BigDecimal.valueOf(1000000).compareTo(policy.getCoverageLimit()));
        assertEquals(0, BigDecimal.valueOf(1000000).compareTo(result.getIndicativeRemainingBalance()));
    }
}
