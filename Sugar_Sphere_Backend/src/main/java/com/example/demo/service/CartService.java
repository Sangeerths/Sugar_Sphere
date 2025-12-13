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
        if (cartOpt.isPresent()) {
            return cartOpt.get();
        }

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setCreatedAt(LocalDateTime.now());
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public Cart addToCart(User user, String sweetId, Integer quantity) {
        Cart cart = getCartByUser(user);

        Sweet sweet = sweetRepository.findById(sweetId)
            .orElseThrow(() -> new RuntimeException("Sweet not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
            .filter(item -> item.getProductId().equals(sweetId))
            .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.calculateSubtotal();
        } else {
            CartItem newItem = new CartItem();
            newItem.setProductId(sweetId);
            newItem.setProductName(sweet.getName());
            newItem.setProductImage(sweet.getImage());
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