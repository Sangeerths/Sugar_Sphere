package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String sweetId;
    private String sweetName;
    private Double price;
    private Integer quantity;
    private String imageUrl;
}