package com.coffee.backend.presentation.controller;

import com.coffee.backend.application.dto.request.LoginRequest;
import com.coffee.backend.application.dto.request.SignupRequest;
import com.coffee.backend.application.dto.response.JwtResponse;
import com.coffee.backend.application.dto.response.MessageResponse;
import com.coffee.backend.domain.model.Role;
import com.coffee.backend.domain.model.User;
import com.coffee.backend.domain.repository.UserRepository;
import com.coffee.backend.infrastructure.security.JwtUtils;
import com.coffee.backend.infrastructure.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Attempting login for user: {}", loginRequest.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();

            User user = userRepository.findByEmailAndDeletedFalse(userDetails.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found or deleted"));

            logger.info("Login successful for user: {} with role: {}", user.getEmail(), role);

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    user.getEmail(),
                    user.getUsername(),
                    user.getFullName(),
                    role));
        } catch (BadCredentialsException e) {
            logger.warn("Authentication failed: Bad credentials or user not found for input: {}", loginRequest.getEmail());
            return ResponseEntity.status(401).body(new MessageResponse("Sai tài khoản hoặc mật khẩu"));
        } catch (LockedException e) {
            logger.warn("Authentication failed: Account is locked for input: {}", loginRequest.getEmail());
            return ResponseEntity.status(403).body(new MessageResponse("Tài khoản đã bị khóa"));
        } catch (DisabledException e) {
            logger.warn("Authentication failed: Account is disabled for input: {}", loginRequest.getEmail());
            return ResponseEntity.status(403).body(new MessageResponse("Tài khoản đã bị vô hiệu hóa"));
        } catch (Exception e) {
            logger.error("Authentication failed: Unexpected error for input: {}", loginRequest.getEmail(), e);
            return ResponseEntity.status(500).body(new MessageResponse("Lỗi hệ thống trong quá trình xác thực"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already in use!"));
        }

        // Create new user's account
        User user = User.builder()
                .email(signUpRequest.getEmail())
                .username(signUpRequest.getUsername())
                .password(encoder.encode(signUpRequest.getPassword()))
                .fullName(signUpRequest.getFullName())
                .phone(signUpRequest.getPhone())
                .role(Role.ROLE_CUSTOMER) // Default role
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
