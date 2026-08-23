package com.hospitality.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalMatchRequestDto {
    private Long policyId;
    private Long patientId;
    private String specialty;
    private String location;
}
