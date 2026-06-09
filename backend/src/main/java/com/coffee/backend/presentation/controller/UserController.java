package com.coffee.backend.presentation.controller;

import com.coffee.backend.domain.model.User;
import com.coffee.backend.domain.repository.UserRepository;
import com.coffee.backend.application.dto.response.MessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean locked) {
        
        List<User> users = userRepository.findAllByDeletedFalse();
        
        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            users = users.stream()
                    .filter(u -> (u.getFullName() != null && u.getFullName().toLowerCase().contains(q))
                            || (u.getUsername() != null && u.getUsername().toLowerCase().contains(q))
                            || (u.getEmail() != null && u.getEmail().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        if (role != null && !role.trim().isEmpty()) {
            users = users.stream()
                    .filter(u -> u.getRole() != null && u.getRole().name().equalsIgnoreCase(role))
                    .collect(Collectors.toList());
        }

        if (locked != null) {
            users = users.stream()
                    .filter(u -> u.isLocked() == locked)
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty() ||
            user.getUsername() == null || user.getUsername().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email, tên đăng nhập và mật khẩu không được trống"));
        }

        if (userRepository.existsByEmail(user.getEmail().trim())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email đã tồn tại"));
        }

        if (userRepository.existsByUsername(user.getUsername().trim())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Tên đăng nhập đã tồn tại"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setLocked(false);
        user.setDeleted(false);
        
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (userDetails.getEmail() != null && !userDetails.getEmail().trim().isEmpty()) {
            String newEmail = userDetails.getEmail().trim();
            if (!newEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Email đã tồn tại"));
            }
            user.setEmail(newEmail);
        }

        if (userDetails.getUsername() != null && !userDetails.getUsername().trim().isEmpty()) {
            String newUsername = userDetails.getUsername().trim();
            if (!newUsername.equalsIgnoreCase(user.getUsername()) && userRepository.existsByUsername(newUsername)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Tên đăng nhập đã tồn tại"));
            }
            user.setUsername(newUsername);
        }

        if (userDetails.getFullName() != null) {
            user.setFullName(userDetails.getFullName());
        }

        if (userDetails.getPhone() != null) {
            user.setPhone(userDetails.getPhone());
        }

        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }

        user.setLocked(userDetails.isLocked());

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{id}/lock")
    public ResponseEntity<?> lockUnlockUser(@PathVariable Long id, @RequestParam boolean lock) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setLocked(lock);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse(lock ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setDeleted(true);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Đã xóa mềm tài khoản"));
    }
}
