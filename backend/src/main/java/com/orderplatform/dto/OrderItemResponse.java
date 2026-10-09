package com.orderplatform.dto;

public record OrderItemResponse(
        Long id,
        String productName,
        Integer quantity,
        Double unitPrice,
        Double subtotal
) {}
