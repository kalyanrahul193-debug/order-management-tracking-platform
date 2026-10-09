package com.orderplatform.dto;

import java.time.LocalDateTime;

public record TrackingResponse(
        Long id,
        String status,
        String location,
        String description,
        LocalDateTime timestamp
) {}
