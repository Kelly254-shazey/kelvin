package com.kellyflo.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "testimonials")
public class Testimonial extends BaseEntity {

    @NotBlank(message = "Name is required")
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String name;

    @NotBlank(message = "Role is required")
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String role;

    @NotBlank(message = "Quote is required")
    @Size(max = 1800)
    @Column(nullable = false, length = 1800)
    private String quote;

    @URL(message = "Invalid avatar URL")
    @Size(max = 255)
    @Column(length = 255)
    private String avatarUrl;
}
