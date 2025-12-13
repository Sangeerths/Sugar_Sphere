package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Sweet;

@Repository
public interface SweetRepository extends MongoRepository<Sweet, String> {
    // Note: category field might not exist in MongoDB, so this might return empty
    @Query("{ 'category': ?0 }")
    List<Sweet> findByCategory(String category);
    
    // Search by title field in MongoDB
    @Query("{ 'title': { $regex: ?0, $options: 'i' } }")
    List<Sweet> findByNameContainingIgnoreCase(String name);
    
    // Find by numeric id field (not MongoDB _id)
    @Query("{ 'id': ?0 }")
    Optional<Sweet> findByNumericId(Integer id);
    
    @Query("{ 'price' : { $gte: ?0, $lte: ?1 } }")
    List<Sweet> findByPriceRange(Integer minPrice, Integer maxPrice);
    
    // Search by title (MongoDB field name) or details
    @Query("{ $or: [ " +
           "{ 'title': { $regex: ?0, $options: 'i' } }, " +
           "{ 'details': { $regex: ?0, $options: 'i' } } " +
           "] }")
    List<Sweet> searchByNameOrCategory(String searchTerm);
}
