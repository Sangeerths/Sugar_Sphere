package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public
class CartItem {
    
    private String productId;
    
    private String productName;
    
    private String productImage;
    
    private Integer price;
    
    private Integer quantity;
    
    private int subtotal;
    
    public void calculateSubtotal() {
        this.subtotal = this.price * this.quantity;
    }
}