package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "sweets")
public class Sweet {
    @Id
    private String id;
    
    @Indexed
    private String name;
    
    @Indexed
    private String category;
    
    private String description;
    
    private Double price;
    
    private Integer quantity;
    
    private String imageUrl;
}
