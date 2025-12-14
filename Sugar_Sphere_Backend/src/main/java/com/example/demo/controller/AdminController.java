package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ApiResponse;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Endpoint to create admin user (only accessible if you're already admin or for initial setup)
    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse<User>> createAdmin(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");
            
            if (username == null || email == null || password == null) {
                return ResponseEntity.ok(ApiResponse.error("Username, email, and password are required"));
            }
            
            // Check if user already exists
            if (userRepository.existsByUsername(username)) {
                return ResponseEntity.ok(ApiResponse.error("Username already exists"));
            }
            
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.ok(ApiResponse.error("Email already exists"));
            }
            
            // Create admin user
            User admin = new User();
            admin.setUsername(username);
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(password));
            
            Set<Role> roles = new HashSet<>();
            roles.add(Role.ADMIN);
            roles.add(Role.USER); // Admin also has USER role
            admin.setRoles(roles);
            
            User savedAdmin = userRepository.save(admin);
            
            // Remove password from response
            savedAdmin.setPassword(null);
            
            return ResponseEntity.ok(ApiResponse.success(savedAdmin));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Endpoint to promote existing user to admin
    @PostMapping("/promote-to-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> promoteToAdmin(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            
            if (username == null) {
                return ResponseEntity.ok(ApiResponse.error("Username is required"));
            }
            
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (!user.getRoles().contains(Role.ADMIN)) {
                user.getRoles().add(Role.ADMIN);
                userRepository.save(user);
            }
            
            user.setPassword(null); // Remove password from response
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }
}