package com.orderplatform.dto;

public record AuthResponse(
        String token,
        String username,
        String role
) {}
