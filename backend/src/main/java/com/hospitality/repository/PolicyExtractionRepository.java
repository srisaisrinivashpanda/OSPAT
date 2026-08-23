package com.hospitality.repository;

import com.hospitality.entity.PolicyExtraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyExtractionRepository extends JpaRepository<PolicyExtraction, Long> {
    List<PolicyExtraction> findByPolicyIdOrderByCreatedAtDesc(Long policyId);
}
