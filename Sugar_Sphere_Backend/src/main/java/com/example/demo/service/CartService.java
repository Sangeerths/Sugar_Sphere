package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import com.example.demo.model.Sweet;
import com.example.demo.model.User;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.SweetRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private SweetRepository sweetRepository;

    public Cart getCartByUser(User user) {
        Optional<Cart> cartOpt = cartRepository.findByUser(user);
        Cart cart;
        if (cartOpt.isPresent()) {
            cart = cartOpt.get();
            // Ensure items list is never null
            if (cart.getItems() == null) {
                cart.setItems(new java.util.ArrayList<>());
            }
            cart.calculateTotals();
            return cart;
        }

        cart = new Cart();
        cart.setUser(user);
        cart.setCreatedAt(LocalDateTime.now());
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public Cart addToCart(User user, String sweetId, Integer quantity) {
        Cart cart = getCartByUser(user);

        // Try to parse as Integer (numeric id) first, if fails use as MongoDB _id
        Sweet sweet;
        String mongoId;
        try {
            Integer numericId = Integer.parseInt(sweetId);
            sweet = sweetRepository.findByNumericId(numericId)
                .orElseThrow(() -> new RuntimeException("Sweet not found"));
            // Get MongoDB _id from the found sweet
            mongoId = sweet.get_id() != null ? sweet.get_id() : sweetId;
        } catch (NumberFormatException e) {
            // sweetId is already a MongoDB _id
            sweet = sweetRepository.findById(sweetId)
                .orElseThrow(() -> new RuntimeException("Sweet not found"));
            // Use the _id from the sweet, or fallback to sweetId
            mongoId = sweet.get_id() != null ? sweet.get_id() : sweetId;
        }
        
        // Final fallback - if mongoId is still null, use sweetId
        final String finalMongoId = (mongoId != null) ? mongoId : sweetId;

        Optional<CartItem> existingItem = cart.getItems().stream()
            .filter(item -> item.getProductId().equals(finalMongoId))
            .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.calculateSubtotal();
        } else {
            CartItem newItem = new CartItem();
            newItem.setProductId(finalMongoId); // Use MongoDB _id for consistency
            newItem.setProductName(sweet.getName());
            newItem.setProductImage(sweet.getImageUrl());
            newItem.setPrice(sweet.getPrice());
            newItem.setQuantity(quantity);
            newItem.calculateSubtotal();
            cart.getItems().add(newItem);
        }

        cart.calculateTotals();
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public Cart updateCartItem(User user, String sweetId, Integer quantity) {
        Cart cart = getCartByUser(user);

        if (quantity < 1) {
            throw new RuntimeException("Quantity must be at least 1");
        }

        CartItem item = cart.getItems().stream()
            .filter(i -> i.getProductId().equals(sweetId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        item.setQuantity(quantity);
        item.calculateSubtotal();

        cart.calculateTotals();
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(User user, String sweetId) {
        Cart cart = getCartByUser(user);
        cart.getItems().removeIf(item -> item.getProductId().equals(sweetId));
        cart.calculateTotals();
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public Cart clearCart(User user) {
        Cart cart = getCartByUser(user);
        cart.getItems().clear();
        cart.calculateTotals();
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }
}