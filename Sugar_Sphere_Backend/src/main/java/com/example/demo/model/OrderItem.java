package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
class OrderItem {
    private String productId;
    private String productName;
    private String productImage;
    private Double price;
    private Integer quantity;
    private Double subtotal;
}