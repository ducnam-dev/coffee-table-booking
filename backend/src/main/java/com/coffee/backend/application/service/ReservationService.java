package com.coffee.backend.application.service;

import com.coffee.backend.domain.model.CoffeeTable;
import com.coffee.backend.domain.model.Reservation;
import com.coffee.backend.domain.model.ReservationStatus;
import com.coffee.backend.domain.model.TableStatus;
import com.coffee.backend.domain.model.User;
import com.coffee.backend.domain.repository.CoffeeTableRepository;
import com.coffee.backend.domain.repository.ReservationRepository;
import com.coffee.backend.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {
    
    private final ReservationRepository reservationRepository;
    private final CoffeeTableRepository tableRepository;
    private final UserRepository userRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public List<Reservation> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    public Reservation createReservation(Reservation request, String userEmail) {
        User user = userRepository.findByEmailAndDeletedFalse(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        CoffeeTable table = tableRepository.findById(request.getCoffeeTable().getId())
                .orElseThrow(() -> new RuntimeException("Table not found"));

        if (table.getStatus() != TableStatus.AVAILABLE) {
            throw new RuntimeException("Table is not available");
        }

        request.setUser(user);
        request.setCoffeeTable(table);
        request.setStatus(ReservationStatus.PENDING);
        
        // Update table status to reserved temporarily until completed or cancelled
        table.setStatus(TableStatus.RESERVED);
        tableRepository.save(table);

        return reservationRepository.save(request);
    }

    public Reservation updateReservationStatus(Long id, ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        reservation.setStatus(status);

        if (status == ReservationStatus.CANCELLED || status == ReservationStatus.COMPLETED) {
            CoffeeTable table = reservation.getCoffeeTable();
            table.setStatus(TableStatus.AVAILABLE);
            tableRepository.save(table);
        }

        return reservationRepository.save(reservation);
    }
}
