package com.orderplatform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ProductRequest(
        @NotBlank String name,
        String description,
        String category,
        @NotNull @Positive Double price,
        @NotNull @Min(0) Integer stockQuantity,
        String imageUrl
) {}
