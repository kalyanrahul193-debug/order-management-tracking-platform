package com.orderplatform.dto;

public record ProductResponse(
        Long id,
        String name,
        String description,
        String category,
        Double price,
        Integer stockQuantity,
        String imageUrl,
        Boolean active
) {}
