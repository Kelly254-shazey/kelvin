package com.kellyflo.portfolio.dto;

public record AuthResponse(
        String token,
        String tokenType,
        String username,
        String expiresAt) {
}
