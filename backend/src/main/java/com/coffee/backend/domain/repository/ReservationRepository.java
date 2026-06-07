package com.coffee.backend.domain.repository;

import com.coffee.backend.domain.model.Reservation;
import com.coffee.backend.domain.model.ReservationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByStatus(ReservationStatus status);
}
