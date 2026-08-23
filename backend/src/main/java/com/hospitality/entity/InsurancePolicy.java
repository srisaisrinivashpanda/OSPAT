package com.hospitality.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "insurance_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsurancePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnore
    private Patient patient;

    @Column(name = "insurer_name")
    private String insurerName;

    @Column(name = "policy_type")
    private String policyType;

    @Column(name = "coverage_limit", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal coverageLimit = BigDecimal.ZERO;

    @Column(name = "remaining_coverage", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal remainingCoverage = BigDecimal.ZERO;

    @Column(name = "room_limit", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal roomLimit = BigDecimal.ZERO;

    @Column(name = "room_category")
    private String roomCategory;

    @Column(name = "policy_status")
    @Builder.Default
    private String policyStatus = "DRAFT"; // DRAFT, ACTIVE, EXPIRED

    @Column(name = "source_document")
    private String sourceDocument;

    @Column(nullable = false)
    @Builder.Default
    private Boolean confirmed = false;

    @Column(name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private java.util.Set<PolicyExclusion> exclusions = new java.util.HashSet<>();

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private java.util.Set<NetworkHospital> networkHospitals = new java.util.HashSet<>();

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PolicyExtraction> extractions = new ArrayList<>();
}
