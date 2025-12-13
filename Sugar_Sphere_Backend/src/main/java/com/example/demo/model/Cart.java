package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "carts")
public class Cart {
    
    @Id
    private String id;
    
    @DBRef
    private User user;
    
    private List<CartItem> items = new ArrayList<>();
    
    private Double totalAmount = 0.0;
    
    private Integer itemCount = 0;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    public void calculateTotals() {
        this.totalAmount = items.stream()
            .mapToDouble(CartItem::getSubtotal)
            .sum();
        this.itemCount = items.stream()
            .mapToInt(CartItem::getQuantity)
            .sum();
    }
}