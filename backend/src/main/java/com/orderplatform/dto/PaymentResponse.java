package com.orderplatform.dto;

import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        String paymentMethod,
        String paymentStatus,
        Double amount,
        String transactionId,
        LocalDateTime paymentDate
) {}
