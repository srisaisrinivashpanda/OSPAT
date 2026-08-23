package com.hospitality.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "room_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    @JsonIgnore
    private Hospital hospital;

    @Column(nullable = false)
    private String name;

    @Column(name = "daily_cost", nullable = false, precision = 12, scale = 2)
    private BigDecimal dailyCost;

    @Column(nullable = false)
    @Builder.Default
    private Boolean available = true;
}
