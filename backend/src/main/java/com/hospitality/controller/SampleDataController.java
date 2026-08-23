package com.hospitality.controller;

import com.hospitality.dto.ErrorResponseDto;
import com.hospitality.sample.SamplePdfGeneratorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/samples")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Sample Insurance Documents", description = "Endpoints for downloading generated sample synthetic insurance PDFs for demo testing")
public class SampleDataController {

    private final SamplePdfGeneratorService samplePdfService;

    @GetMapping("/pdf/{type}")
    @Operation(summary = "Download a synthetic test insurance PDF (star, hdfc, or care)",
               description = "Dynamically generates and downloads synthetic insurance schedules tailored for hackathon demo testing.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Synthetic PDF generated and downloaded",
                         content = @Content(mediaType = MediaType.APPLICATION_PDF_VALUE)),
            @ApiResponse(responseCode = "500", description = "PDF generation error",
                         content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    public ResponseEntity<byte[]> getSamplePdf(
            @Parameter(description = "Insurer type: star, hdfc, or care", required = true, example = "star")
            @PathVariable("type") String type) throws IOException {
        byte[] pdfBytes;
        String filename;

        String safeType = type != null ? type.toLowerCase().trim() : "star";
        switch (safeType) {
            case "hdfc":
                pdfBytes = samplePdfService.generateHdfcErgoSamplePdf();
                filename = "HDFC_Ergo_OptimaRestore_Sample.pdf";
                break;
            case "care":
                pdfBytes = samplePdfService.generateCareHealthSamplePdf();
                filename = "Care_Health_Advantage_Sample.pdf";
                break;
            case "star":
            default:
                pdfBytes = samplePdfService.generateStarHealthSamplePdf();
                filename = "StarHealth_FamilyOptima_Sample.pdf";
                break;
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
