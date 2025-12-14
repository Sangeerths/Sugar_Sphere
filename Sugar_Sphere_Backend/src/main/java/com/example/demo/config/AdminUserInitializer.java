package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import java.util.HashSet;
import java.util.Set;

@Component
public class AdminUserInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@sugarshop.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            
            Set<Role> roles = new HashSet<>();
            roles.add(Role.ADMIN);
            roles.add(Role.USER);
            admin.setRoles(roles);
            
            userRepository.save(admin);
            System.out.println("========================================");
            System.out.println("ADMIN USER CREATED SUCCESSFULLY!");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("Email: admin@sugarshop.com");
            System.out.println("========================================");
            System.out.println("⚠️  IMPORTANT: Change the password after first login!");
            System.out.println("========================================");
        } else {
            System.out.println("Admin user already exists. Skipping creation.");
        }
    }
}