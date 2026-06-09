package com.coffee.backend.domain.repository;

import com.coffee.backend.domain.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, Long> {
    Optional<User> findByEmailAndDeletedFalse(String email);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByUsernameAndDeletedFalse(String username);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    @org.springframework.data.mongodb.repository.Query("{ '$or': [ { 'email': ?0 }, { 'username': ?1 } ], 'deleted': false }")
    Optional<User> findByEmailOrUsernameAndDeletedFalse(String email, String username);

    java.util.List<User> findAllByDeletedFalse();
}
