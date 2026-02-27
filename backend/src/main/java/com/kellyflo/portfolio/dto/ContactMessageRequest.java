package com.kellyflo.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactMessageRequest(
        @NotBlank(message = "Name is required") @Size(max = 120) String name,
        @NotBlank(message = "Email is required") @Email(message = "Invalid email") @Size(max = 180) String email,
        @NotBlank(message = "Subject is required") @Size(max = 180) String subject,
        @NotBlank(message = "Message is required") @Size(max = 3000) String body) {
}
