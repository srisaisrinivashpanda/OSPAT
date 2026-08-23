package com.hospitality;

import com.hospitality.sample.SamplePdfGeneratorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

class SamplePdfGeneratorServiceTest {

    private SamplePdfGeneratorService samplePdfGeneratorService;

    @BeforeEach
    void setUp() {
        samplePdfGeneratorService = new SamplePdfGeneratorService();
    }

    @Test
    @DisplayName("Generate Star Health synthetic PDF returns non-empty valid PDF bytes")
    void testGenerateStarHealthPdf() throws IOException {
        byte[] bytes = samplePdfGeneratorService.generateStarHealthSamplePdf();
        assertNotNull(bytes);
        assertTrue(bytes.length > 500);
        // Valid PDF starts with "%PDF-"
        assertEquals('%', (char) bytes[0]);
        assertEquals('P', (char) bytes[1]);
        assertEquals('D', (char) bytes[2]);
        assertEquals('F', (char) bytes[3]);
    }

    @Test
    @DisplayName("Generate HDFC ERGO synthetic PDF returns non-empty valid PDF bytes")
    void testGenerateHdfcErgoPdf() throws IOException {
        byte[] bytes = samplePdfGeneratorService.generateHdfcErgoSamplePdf();
        assertNotNull(bytes);
        assertTrue(bytes.length > 500);
        assertEquals('%', (char) bytes[0]);
    }

    @Test
    @DisplayName("Generate Care Health synthetic PDF returns non-empty valid PDF bytes")
    void testGenerateCareHealthPdf() throws IOException {
        byte[] bytes = samplePdfGeneratorService.generateCareHealthSamplePdf();
        assertNotNull(bytes);
        assertTrue(bytes.length > 500);
        assertEquals('%', (char) bytes[0]);
    }
}
