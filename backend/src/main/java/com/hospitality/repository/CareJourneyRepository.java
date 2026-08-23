package com.hospitality.repository;

import com.hospitality.entity.CareJourney;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CareJourneyRepository extends JpaRepository<CareJourney, Long> {
    Optional<CareJourney> findFirstByPatientIdOrderByUpdatedAtDesc(Long patientId);
}
