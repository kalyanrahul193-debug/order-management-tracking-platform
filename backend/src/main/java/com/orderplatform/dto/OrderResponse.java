package com.orderplatform.dto;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        String status,
        Double totalAmount,
        String shippingAddress,
        LocalDateTime orderDate,
        String customerName,
        List<OrderItemResponse> items,
        PaymentResponse payment,
        List<TrackingResponse> trackingHistory
) {}
