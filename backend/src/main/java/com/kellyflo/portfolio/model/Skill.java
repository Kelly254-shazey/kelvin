package com.kellyflo.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "skills")
public class Skill extends BaseEntity {

    @NotBlank(message = "Category is required")
    @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String category;

    @NotBlank(message = "Skill name is required")
    @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String name;

    @Min(1)
    @Max(100)
    @Column
    private Integer level;
}
