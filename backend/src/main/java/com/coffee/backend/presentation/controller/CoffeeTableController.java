package com.coffee.backend.presentation.controller;

import com.coffee.backend.application.service.CoffeeTableService;
import com.coffee.backend.domain.model.CoffeeTable;
import com.coffee.backend.domain.model.TableStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class CoffeeTableController {

    private final CoffeeTableService coffeeTableService;

    @GetMapping
    public ResponseEntity<List<CoffeeTable>> getAllTables() {
        return ResponseEntity.ok(coffeeTableService.getAllTables());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoffeeTable> getTableById(@PathVariable Long id) {
        return ResponseEntity.ok(coffeeTableService.getTableById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CoffeeTable>> getTablesByStatus(@PathVariable TableStatus status) {
        return ResponseEntity.ok(coffeeTableService.getTablesByStatus(status));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<CoffeeTable> createTable(@RequestBody CoffeeTable table) {
        return ResponseEntity.ok(coffeeTableService.createTable(table));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<CoffeeTable> updateTableStatus(@PathVariable Long id, @RequestParam TableStatus status) {
        return ResponseEntity.ok(coffeeTableService.updateTableStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        coffeeTableService.deleteTable(id);
        return ResponseEntity.ok().build();
    }
}
