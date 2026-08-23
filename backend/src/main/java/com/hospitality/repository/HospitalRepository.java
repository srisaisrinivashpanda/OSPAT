package com.hospitality.repository;

import com.hospitality.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findAllByOrderByCreatedAtAsc();

    @Query("SELECT h FROM Hospital h LEFT JOIN FETCH h.roomCategories WHERE h.id = :id")
    Optional<Hospital> findByIdWithDetails(@Param("id") Long id);
}
