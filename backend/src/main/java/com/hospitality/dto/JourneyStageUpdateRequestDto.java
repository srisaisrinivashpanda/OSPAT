package com.hospitality.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JourneyStageUpdateRequestDto {
    @NotBlank(message = "Stage is required")
    private String stage; // ADMISSION, INVESTIGATION, PROCEDURE, RECOVERY

    private String note;
}
