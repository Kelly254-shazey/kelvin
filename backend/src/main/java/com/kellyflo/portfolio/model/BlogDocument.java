package com.kellyflo.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "blog_documents")
public class BlogDocument extends BaseEntity {

    @NotBlank
    @Size(max = 140)
    @Column(nullable = false, length = 140)
    private String title;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String originalName;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String storedName;

    @Column(nullable = false)
    private boolean visible = true;

    @Column(nullable = false)
    private boolean downloadEnabled = false;

    @NotNull
    @Column(nullable = false)
    private Integer displayOrder = 0;
}
