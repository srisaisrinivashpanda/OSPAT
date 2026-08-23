package com.hospitality.dto;

import lombok.*;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JourneyEventDto {
    private Long id;
    private String stage;
    private String description;
    private OffsetDateTime timestamp;
}
