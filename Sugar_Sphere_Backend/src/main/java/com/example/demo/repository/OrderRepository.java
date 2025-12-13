package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Order;
import com.example.demo.model.User;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
    List<Order> findAllByOrderByCreatedAtDesc();
}