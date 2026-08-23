package com.hospitality.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hospitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "network_status")
    @Builder.Default
    private String networkStatus = "IN_NETWORK";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private java.util.Set<HospitalSpecialty> specialties = new java.util.HashSet<>();

    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private java.util.Set<RoomCategory> roomCategories = new java.util.HashSet<>();
}
