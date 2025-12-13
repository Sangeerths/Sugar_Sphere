package com.example.demo.model;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusHistory {
    private String status;
    private String message;  // Changed from 'note' to 'message'
    private LocalDateTime timestamp;
}