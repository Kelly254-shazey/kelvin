package com.kellyflo.portfolio.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "projects")
public class Project extends BaseEntity {

    @NotBlank(message = "Title is required")
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String title;

    @Size(max = 150)
    @Column(nullable = false, unique = true, length = 150)
    private String slug;

    @NotBlank(message = "Summary is required")
    @Size(max = 500)
    @Column(nullable = false, length = 500)
    private String summary;

    @NotBlank(message = "Description is required")
    @Size(max = 4000)
    @Column(nullable = false, length = 4000)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_tech_tags", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tech_tag", length = 50)
    private List<String> techTags = new ArrayList<>();

    @URL(message = "Invalid live URL")
    @Size(max = 255)
    @Column(length = 255)
    private String liveUrl;

    @URL(message = "Invalid GitHub URL")
    @Size(max = 255)
    @Column(length = 255)
    private String githubUrl;

    @NotBlank(message = "Thumbnail URL is required")
    @URL(message = "Invalid thumbnail URL")
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String thumbnailUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_gallery_images", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "image_url", length = 255)
    private List<String> galleryImages = new ArrayList<>();

    @Column(nullable = false)
    private boolean featured = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectStatus status = ProjectStatus.DRAFT;
}
