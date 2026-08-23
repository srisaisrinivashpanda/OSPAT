package com.hospitality.dto;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareJourneyDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long hospitalId;
    private String hospitalName;
    private String hospitalLocation;
    private String currentStage; // ADMISSION, INVESTIGATION, PROCEDURE, RECOVERY
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    @Builder.Default
    private List<JourneyEventDto> events = new ArrayList<>();
}
