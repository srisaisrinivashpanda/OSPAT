package com.hospitality.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NetworkHospitalItemDto {
    private Long hospitalId;
    private String hospitalName;
    private String location;
}
