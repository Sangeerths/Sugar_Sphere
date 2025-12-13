package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.SweetRequest;
import com.example.demo.model.Sweet;
import com.example.demo.service.SweetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/sweets")
@CrossOrigin(origins = "*")
public class SweetController {
    
    @Autowired
    private SweetService sweetService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Sweet> createSweet(@Valid @RequestBody SweetRequest request) {
        return ResponseEntity.ok(sweetService.createSweet(request));
    }
    
    @GetMapping
    public ResponseEntity<List<Sweet>> getAllSweets() {
        List<Sweet> sweets = sweetService.getAllSweets();
        System.out.println("=== GET /api/sweets ===");
        System.out.println("Total sweets: " + sweets.size());
        if (!sweets.isEmpty()) {
            Sweet first = sweets.get(0);
            System.out.println("Sample sweet - ID: " + first.getId() + 
                             ", Name: " + first.getName() + 
                             ", Price: " + first.getPrice() + 
                             ", Quantity: " + first.getQuantity());
        } else {
            System.out.println("WARNING: No sweets found in database!");
        }
        return ResponseEntity.ok(sweets);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Sweet> getSweetById(@PathVariable String id) {
        return ResponseEntity.ok(sweetService.getSweetById(id));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Sweet>> searchSweets(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        return ResponseEntity.ok(sweetService.searchSweets(searchTerm, category, minPrice, maxPrice));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Sweet> updateSweet(@PathVariable String id, @Valid @RequestBody SweetRequest request) {
        return ResponseEntity.ok(sweetService.updateSweet(id, request));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSweet(@PathVariable String id) {
        sweetService.deleteSweet(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/purchase")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Sweet> purchaseSweet(@PathVariable String id) {
        return ResponseEntity.ok(sweetService.purchaseSweet(id));
    }
    
    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Sweet> restockSweet(@PathVariable String id, @RequestBody Map<String, Integer> body) {
        Integer quantity = body.get("quantity");
        return ResponseEntity.ok(sweetService.restockSweet(id, quantity));
    }
    
    // Test endpoint to check MongoDB connection
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testConnection() {
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        try {
            List<Sweet> sweets = sweetService.getAllSweets();
            response.put("status", "success");
            response.put("database", "test");
            response.put("collection", "sweets");
            response.put("count", sweets.size());
            if (!sweets.isEmpty()) {
                Sweet first = sweets.get(0);
                response.put("sample", Map.of(
                    "id", first.getId(),
                    "name", first.getName(),
                    "price", first.getPrice(),
                    "quantity", first.getQuantity()
                ));
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
}