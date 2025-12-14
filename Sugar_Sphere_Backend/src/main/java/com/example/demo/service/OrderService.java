package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.dto.PaymentVerificationRequest;
import com.example.demo.model.Cart;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.model.StatusHistory;
import com.example.demo.model.Sweet;
import com.example.demo.model.User;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.SweetRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private SweetRepository sweetRepository;
    
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    
    private RazorpayClient razorpayClient;
    
    private RazorpayClient getRazorpayClient() throws RazorpayException {
        if (razorpayClient == null) {
            razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        }
        return razorpayClient;
    }
    
    public Map<String, Object> createRazorpayOrder(Double amount) throws RazorpayException {
        RazorpayClient client = getRazorpayClient();
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_" + System.currentTimeMillis());
        orderRequest.put("payment_capture", 1);
        
        com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);
        
        Map<String, Object> response = new HashMap<>();
        response.put("orderId", razorpayOrder.get("id"));
        response.put("amount", razorpayOrder.get("amount"));
        response.put("currency", razorpayOrder.get("currency"));
        response.put("key", razorpayKeyId);
        
        return response;
    }
    
    public Order verifyPaymentAndCreateOrder(User user, PaymentVerificationRequest request) 
            throws RazorpayException {
        
        String signature = request.getRazorpaySignature();
        String orderId = request.getRazorpayOrderId();
        String paymentId = request.getRazorpayPaymentId();
        
        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", orderId);
        options.put("razorpay_payment_id", paymentId);
        options.put("razorpay_signature", signature);
        
        boolean isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeySecret);
        
        if (!isValidSignature) {
            throw new RuntimeException("Invalid payment signature");
        }
        
        Order order = new Order();
        order.setUser(user);
        order.generateOrderNumber();
        order.setItems(request.getItems());
        order.setShippingAddress(request.getShippingAddress());
        order.setSubtotal(request.getSubtotal());
        order.setShippingCost(request.getShippingCost());
        order.setTax(request.getTax());
        order.setTotalAmount(request.getTotalAmount());
        order.setPaymentMethod("razorpay");
        order.setPaymentStatus("completed");
        order.setRazorpayOrderId(orderId);
        order.setRazorpayPaymentId(paymentId);
        order.setRazorpaySignature(signature);
        order.setOrderStatus("confirmed");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        
        StatusHistory statusHistory = new StatusHistory();
        statusHistory.setStatus("confirmed");
        statusHistory.setTimestamp(LocalDateTime.now());
        statusHistory.setMessage("Order confirmed and payment received");
        order.getStatusHistory().add(statusHistory);
        
        Order savedOrder = orderRepository.save(order);
        
        // Log order creation for debugging
        System.out.println("=== ORDER CREATED ===");
        System.out.println("Order ID: " + savedOrder.getId());
        System.out.println("Order Number: " + savedOrder.getOrderNumber());
        System.out.println("Total Amount: " + savedOrder.getTotalAmount());
        System.out.println("Items Count: " + savedOrder.getItems().size());
        System.out.println("Order saved to MongoDB collection: orders");
        
        // Update stock for each item in the order
        for (OrderItem item : savedOrder.getItems()) {
            try {
                // Try to find sweet by MongoDB _id first, then by numeric id
                Sweet sweet = null;
                String sweetId = item.getSweetId();
                
                try {
                    // Try as MongoDB _id
                    sweet = sweetRepository.findById(sweetId)
                        .orElse(null);
                    
                    // If not found, try as numeric id
                    if (sweet == null) {
                        try {
                            Integer numericId = Integer.parseInt(sweetId);
                            sweet = sweetRepository.findByNumericId(numericId)
                                .orElse(null);
                        } catch (NumberFormatException e) {
                            // Not a numeric ID, continue
                        }
                    }
                    
                    if (sweet != null && sweet.getQuantity() != null) {
                        int newQuantity = sweet.getQuantity() - item.getQuantity();
                        if (newQuantity < 0) {
                            newQuantity = 0;
                        }
                        sweet.setQuantity(newQuantity);
                        sweetRepository.save(sweet);
                    }
                } catch (Exception e) {
                    // Log error but don't fail the order
                    System.err.println("Error updating stock for sweet " + sweetId + ": " + e.getMessage());
                }
            } catch (Exception e) {
                System.err.println("Error processing order item: " + e.getMessage());
            }
        }
        
        Cart cart = cartRepository.findByUser(user).orElse(null);
        if (cart != null) {
            cart.getItems().clear();
            cart.calculateTotals();
            cartRepository.save(cart);
        }
        
        return savedOrder;
    }
    
    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    public Order getOrderById(String orderId, User user) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to order");
        }
        
        return order;
    }
    
    public Order cancelOrder(String orderId, User user) {
        Order order = getOrderById(orderId, user);
        
        if (!order.getOrderStatus().equals("pending") && 
            !order.getOrderStatus().equals("confirmed")) {
            throw new RuntimeException("Order cannot be cancelled at this stage");
        }
        
        order.setOrderStatus("cancelled");
        
        StatusHistory statusHistory = new StatusHistory();
        statusHistory.setStatus("cancelled");
        statusHistory.setTimestamp(LocalDateTime.now());
        statusHistory.setMessage("Order cancelled by user");
        order.getStatusHistory().add(statusHistory);
        
        if (order.getPaymentStatus().equals("completed")) {
            order.setPaymentStatus("refunded");
        }
        
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public Order updateOrderStatus(String orderId, String status, String note) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setOrderStatus(status);
        
        StatusHistory statusHistory = new StatusHistory();
        statusHistory.setStatus(status);
        statusHistory.setTimestamp(LocalDateTime.now());
        statusHistory.setMessage(note != null ? note : "Order status updated to " + status);
        order.getStatusHistory().add(statusHistory);
        
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }
    
    public Map<String, Object> getRevenueStats() {
        List<Order> allOrders = orderRepository.findAll();
        
        double totalRevenue = allOrders.stream()
            .filter(order -> "completed".equals(order.getPaymentStatus()))
            .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
            .sum();
        
        long totalOrders = allOrders.size();
        long completedOrders = allOrders.stream()
            .filter(order -> "completed".equals(order.getPaymentStatus()))
            .count();
        
        long pendingOrders = allOrders.stream()
            .filter(order -> "pending".equals(order.getOrderStatus()) || "confirmed".equals(order.getOrderStatus()))
            .count();
        
        double todayRevenue = allOrders.stream()
            .filter(order -> {
                if (order.getCreatedAt() == null) return false;
                LocalDateTime today = LocalDateTime.now();
                LocalDateTime orderDate = order.getCreatedAt();
                return orderDate.toLocalDate().equals(today.toLocalDate()) 
                    && "completed".equals(order.getPaymentStatus());
            })
            .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
            .sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("todayRevenue", todayRevenue);
        stats.put("totalOrders", totalOrders);
        stats.put("completedOrders", completedOrders);
        stats.put("pendingOrders", pendingOrders);
        
        return stats;
    }
}