package com.example.demo.repository;



import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Cart;
import com.example.demo.model.User;

import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUserId(String userId);
    void deleteByUser(User user);
}