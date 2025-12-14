package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ApiResponse;
import com.example.demo.model.Cart;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private UserRepository userRepository;
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Cart>> getCart() {
        try {
            User user = getCurrentUser();
            Cart cart = cartService.getCartByUser(user);
            return ResponseEntity.ok(ApiResponse.success(cart));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Cart>> addToCart(@RequestBody Map<String, Object> request) {
        try {
            User user = getCurrentUser();
            // Handle both Integer and String productId
            Object productIdObj = request.get("productId");
            String productId;
            if (productIdObj instanceof Integer) {
                productId = String.valueOf((Integer) productIdObj);
            } else if (productIdObj instanceof String) {
                productId = (String) productIdObj;
            } else {
                productId = productIdObj != null ? productIdObj.toString() : null;
            }
            
            if (productId == null) {
                return ResponseEntity.ok(ApiResponse.error("Product ID is required"));
            }
            
            Integer quantity = request.get("quantity") != null ? 
                ((Number) request.get("quantity")).intValue() : 1;
            
            Cart cart = cartService.addToCart(user, productId, quantity);
            return ResponseEntity.ok(ApiResponse.success(cart));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Cart>> updateCartItem(@RequestBody Map<String, Object> request) {
        try {
            User user = getCurrentUser();
            // Handle both Integer and String productId
            Object productIdObj = request.get("productId");
            String productId;
            if (productIdObj instanceof Integer) {
                productId = String.valueOf((Integer) productIdObj);
            } else if (productIdObj instanceof String) {
                productId = (String) productIdObj;
            } else {
                productId = productIdObj != null ? productIdObj.toString() : null;
            }
            
            if (productId == null) {
                return ResponseEntity.ok(ApiResponse.error("Product ID is required"));
            }
            
            Integer quantity = ((Number) request.get("quantity")).intValue();
            
            Cart cart = cartService.updateCartItem(user, productId, quantity);
            return ResponseEntity.ok(ApiResponse.success(cart));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/remove/{productId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Cart>> removeFromCart(@PathVariable String productId) {
        try {
            User user = getCurrentUser();
            Cart cart = cartService.removeFromCart(user, productId);
            return ResponseEntity.ok(ApiResponse.success(cart));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/clear")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Cart>> clearCart() {
        try {
            User user = getCurrentUser();
            Cart cart = cartService.clearCart(user);
            return ResponseEntity.ok(ApiResponse.success(cart));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }
}