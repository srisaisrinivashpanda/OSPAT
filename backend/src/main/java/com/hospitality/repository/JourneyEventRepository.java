package com.hospitality.repository;

import com.hospitality.entity.JourneyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JourneyEventRepository extends JpaRepository<JourneyEvent, Long> {
    List<JourneyEvent> findByJourneyIdOrderByTimestampDesc(Long journeyId);
}
