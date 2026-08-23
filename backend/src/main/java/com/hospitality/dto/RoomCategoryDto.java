package com.hospitality.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomCategoryDto {
    private Long id;
    private String name;
    private BigDecimal dailyCost;
    private Boolean available;
}
