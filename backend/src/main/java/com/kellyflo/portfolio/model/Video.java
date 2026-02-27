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
@Table(name = "videos")
public class Video extends BaseEntity {

    @NotBlank(message = "Title is required")
    @Size(max = 140)
    @Column(nullable = false, length = 140)
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 1500)
    @Column(nullable = false, length = 1500)
    private String description;

    @NotBlank(message = "Category is required")
    @Size(max = 60)
    @Column(nullable = false, length = 60)
    private String category;

    @NotBlank(message = "Video URL is required")
    @URL(message = "Invalid video URL")
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String videoUrl;

    @NotBlank(message = "Thumbnail URL is required")
    @URL(message = "Invalid thumbnail URL")
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String thumbnailUrl;

    @Column(nullable = false)
    private boolean published = false;
}
