package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "user")
@EqualsAndHashCode(exclude = "user")
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    @DBRef
    private User user;

    private String orderNumber;

    private List<OrderItem> items = new ArrayList<>();

    private ShippingAddress shippingAddress;

    private Double subtotal;

    private Double shippingCost = 0.0;

    private Double tax = 0.0;

    private Double totalAmount;

    private String paymentMethod = "razorpay";

    private String paymentStatus = "pending";
    // pending, completed, failed, refunded

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    private String orderStatus = "pending";
    // pending, confirmed, processing, shipped, delivered, cancelled

    private List<StatusHistory> statusHistory = new ArrayList<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    /* =========================
       Utility Methods
       ========================= */

    public void generateOrderNumber() {
        if (this.orderNumber == null) {
            this.orderNumber = "ORD-" + System.currentTimeMillis() + "-"
                    + (int) (Math.random() * 1000);
        }
    }

    public void calculateTotal() {
        double itemsTotal = items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        this.subtotal = itemsTotal;
        this.totalAmount = subtotal + shippingCost + tax;
    }

    public void addStatus(String status, String message) {
        if (this.statusHistory == null) {
            this.statusHistory = new ArrayList<>();
        }

        this.statusHistory.add(
                new StatusHistory(status, message, LocalDateTime.now())
        );

        this.orderStatus = status;
        this.updatedAt = LocalDateTime.now();
    }

    public void markCreated() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        generateOrderNumber();
        addStatus("pending", "Order created");
    }
}