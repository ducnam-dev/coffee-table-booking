package com.coffee.backend.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "coffee_tables")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoffeeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., T1, T2

    @Column(nullable = false)
    private Integer seats;

    @Column(nullable = false)
    private Boolean isNearWindow;

    @Column(nullable = false)
    private Boolean isOutdoor;

    @Column(nullable = false)
    private Boolean hasPowerSocket;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TableStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
