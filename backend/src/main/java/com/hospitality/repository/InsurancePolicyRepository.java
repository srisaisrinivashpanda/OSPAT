package com.hospitality.repository;

import com.hospitality.entity.InsurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {
    List<InsurancePolicy> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<InsurancePolicy> findByPatientIdAndConfirmedTrueOrderByUpdatedAtDesc(Long patientId);

    @Query("SELECT p FROM InsurancePolicy p LEFT JOIN FETCH p.exclusions WHERE p.id = :id")
    Optional<InsurancePolicy> findByIdWithDetails(@Param("id") Long id);
}
