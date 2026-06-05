package com.coffee.backend.domain.repository;

import com.coffee.backend.domain.model.CoffeeTable;
import com.coffee.backend.domain.model.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoffeeTableRepository extends JpaRepository<CoffeeTable, Long> {
    List<CoffeeTable> findByStatus(TableStatus status);
}
