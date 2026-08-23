package com.hospitality.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Standard API error response payload")
public class ErrorResponseDto {

    @Schema(description = "Timestamp of the error", example = "2026-08-23T14:50:00Z")
    private OffsetDateTime timestamp;

    @Schema(description = "HTTP status code", example = "400")
    private int status;

    @Schema(description = "HTTP error title", example = "Bad Request")
    private String error;

    @Schema(description = "User-facing descriptive error message", example = "Invalid parameter specified")
    private String message;

    @Schema(description = "API endpoint path where error occurred", example = "/api/journeys/1/stage")
    private String path;

    @Schema(description = "Detailed field validation errors if applicable")
    private Map<String, String> fieldErrors;
}
