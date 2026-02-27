package com.kellyflo.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "services")
public class ServiceItem extends BaseEntity {

    @NotBlank(message = "Title is required")
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 1200)
    @Column(nullable = false, length = 1200)
    private String description;

    @NotBlank(message = "Icon is required")
    @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String icon;

    @Column(nullable = false)
    private Integer displayOrder = 0;
}
