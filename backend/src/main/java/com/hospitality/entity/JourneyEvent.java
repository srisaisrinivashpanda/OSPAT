package com.hospitality.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "journey_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JourneyEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journey_id", nullable = false)
    @JsonIgnore
    private CareJourney journey;

    @Column(nullable = false)
    private String stage;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private OffsetDateTime timestamp = OffsetDateTime.now();
}
