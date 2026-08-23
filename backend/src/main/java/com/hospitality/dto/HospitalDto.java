package com.hospitality.dto;

import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalDto {
    private Long id;
    private String name;
    private String location;
    private String address;
    private String networkStatus;
    private String description;
    @Builder.Default
    private List<String> specialties = new ArrayList<>();
    @Builder.Default
    private List<RoomCategoryDto> roomCategories = new ArrayList<>();
}
