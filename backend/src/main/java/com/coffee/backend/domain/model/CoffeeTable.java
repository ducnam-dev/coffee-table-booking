package com.coffee.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "coffee_tables")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoffeeTable {
    @Id
    private Long id;

    @Indexed(unique = true)
    private String name; // e.g., T1, T2

    private Integer seats;

    private Boolean isNearWindow;

    private Boolean isOutdoor;

    private Boolean hasPowerSocket;

    private TableStatus status;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
