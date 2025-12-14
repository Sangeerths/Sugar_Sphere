package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.SweetRequest;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Sweet;
import com.example.demo.repository.SweetRepository;

@Service
public class SweetService {
    
    @Autowired
    private SweetRepository sweetRepository;
    
    public Sweet createSweet(SweetRequest request) {
        Sweet sweet = new Sweet();
        sweet.setName(request.getName());
        sweet.setCategory(request.getCategory());
        sweet.setDescription(request.getDescription());
        sweet.setPrice(request.getPrice());
        sweet.setQuantity(request.getQuantity());
        sweet.setImageUrl(request.getImageUrl());
        
        return sweetRepository.save(sweet);
    }
    
    public List<Sweet> getAllSweets() {
        List<Sweet> sweets = sweetRepository.findAll();
        System.out.println("Total sweets found in database: " + sweets.size());
        if (!sweets.isEmpty()) {
            System.out.println("First sweet: " + sweets.get(0).getName() + ", ID: " + sweets.get(0).getId());
        }
        return sweets;
    }
    
    public List<Sweet> searchSweets(String searchTerm, String category, Double minPrice, Double maxPrice) {
        if (searchTerm != null && !searchTerm.isEmpty()) {
            return sweetRepository.searchByNameOrCategory(searchTerm);
        } else if (category != null && !category.isEmpty()) {
            return sweetRepository.findByCategory(category);
        } else if (minPrice != null && maxPrice != null) {
            return sweetRepository.findByPriceRange(minPrice.intValue(), maxPrice.intValue());
        }
        return sweetRepository.findAll();
    }
    
    // Get by MongoDB _id (String)
    public Sweet getSweetById(String id) {
        return sweetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sweet not found with id: " + id));
    }
    
    // Get by numeric id field
    public Sweet getSweetByNumericId(Integer id) {
        return sweetRepository.findByNumericId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sweet not found with id: " + id));
    }
    
    public Sweet updateSweet(String id, SweetRequest request) {
        // Try to parse as Integer (numeric id) first, if fails use as MongoDB _id
        Sweet sweet;
        try {
            Integer numericId = Integer.parseInt(id);
            sweet = getSweetByNumericId(numericId);
        } catch (NumberFormatException e) {
            sweet = getSweetById(id);
        }
        
        sweet.setName(request.getName());
        if (request.getCategory() != null) {
            sweet.setCategory(request.getCategory());
        }
        sweet.setDescription(request.getDescription());
        if (request.getPrice() != null) {
            sweet.setPrice(request.getPrice().intValue());
        }
        sweet.setQuantity(request.getQuantity());
        sweet.setImageUrl(request.getImageUrl());
        
        return sweetRepository.save(sweet);
    }
    
    public void deleteSweet(String id) {
        // Try to parse as Integer (numeric id) first, if fails use as MongoDB _id
        Sweet sweet;
        try {
            Integer numericId = Integer.parseInt(id);
            sweet = getSweetByNumericId(numericId);
        } catch (NumberFormatException e) {
            sweet = getSweetById(id);
        }
        sweetRepository.delete(sweet);
    }
    
    public Sweet purchaseSweet(String id) {
        // Try to parse as Integer (numeric id) first, if fails use as MongoDB _id
        Sweet sweet;
        try {
            Integer numericId = Integer.parseInt(id);
            sweet = getSweetByNumericId(numericId);
        } catch (NumberFormatException e) {
            sweet = getSweetById(id);
        }
        
        if (sweet.getQuantity() <= 0) {
            throw new BadRequestException("Sweet is out of stock");
        }
        
        sweet.setQuantity(sweet.getQuantity() - 1);
        return sweetRepository.save(sweet);
    }
    
    public Sweet restockSweet(String id, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new BadRequestException("Quantity must be a positive number");
        }
        
        // Try to parse as Integer (numeric id) first, if fails use as MongoDB _id
        Sweet sweet;
        try {
            Integer numericId = Integer.parseInt(id);
            sweet = getSweetByNumericId(numericId);
        } catch (NumberFormatException e) {
            sweet = getSweetById(id);
        }
        
        sweet.setQuantity(sweet.getQuantity() + quantity);
        return sweetRepository.save(sweet);
    }
}