package com.example.demo.dto;

import java.util.List;

import com.example.demo.model.OrderItem;
import com.example.demo.model.ShippingAddress;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerificationRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    
    private List<OrderItem> items;  // Make sure this is OrderItem, not Order
    private ShippingAddress shippingAddress;
    
    private Double subtotal;
    private Double shippingCost;
    private Double tax;
    private Double totalAmount;
}