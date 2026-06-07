package com.coffee.backend.domain.repository;

import com.coffee.backend.domain.model.CoffeeTable;
import com.coffee.backend.domain.model.TableStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoffeeTableRepository extends MongoRepository<CoffeeTable, Long> {
    List<CoffeeTable> findByStatus(TableStatus status);
}
