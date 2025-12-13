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
import com.example.demo.model.StatusHistory;
import com.example.demo.model.User;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
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
}