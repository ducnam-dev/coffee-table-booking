package com.coffee.backend.application.service;

import com.coffee.backend.domain.model.CoffeeTable;
import com.coffee.backend.domain.model.TableStatus;
import com.coffee.backend.domain.repository.CoffeeTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CoffeeTableService {
    
    private final CoffeeTableRepository coffeeTableRepository;

    public List<CoffeeTable> getAllTables() {
        return coffeeTableRepository.findAll();
    }

    public List<CoffeeTable> getTablesByStatus(TableStatus status) {
        return coffeeTableRepository.findByStatus(status);
    }

    public CoffeeTable getTableById(Long id) {
        return coffeeTableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found with id: " + id));
    }

    public CoffeeTable createTable(CoffeeTable table) {
        table.setStatus(TableStatus.AVAILABLE);
        return coffeeTableRepository.save(table);
    }

    public CoffeeTable updateTableStatus(Long id, TableStatus status) {
        CoffeeTable table = getTableById(id);
        table.setStatus(status);
        return coffeeTableRepository.save(table);
    }
    
    public void deleteTable(Long id) {
        coffeeTableRepository.deleteById(id);
    }
}
