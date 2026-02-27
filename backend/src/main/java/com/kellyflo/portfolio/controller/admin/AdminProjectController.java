package com.kellyflo.portfolio.controller.admin;

import com.kellyflo.portfolio.model.Project;
import com.kellyflo.portfolio.model.ProjectStatus;
import com.kellyflo.portfolio.repository.ProjectRepository;
import com.kellyflo.portfolio.util.SlugUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.ArrayList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final ProjectRepository projectRepository;

    public AdminProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public Page<Project> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ProjectStatus status) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        return projectRepository.search(nullable(search), status, pageable);
    }

    @GetMapping("/{id}")
    public Project get(@PathVariable Long id) {
        return findById(id);
    }

    @PostMapping
    public ResponseEntity<Project> create(@Valid @RequestBody Project payload) {
        Project prepared = sanitize(payload, new Project());
        if (prepared.getStatus() == null) {
            prepared.setStatus(ProjectStatus.DRAFT);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(projectRepository.save(prepared));
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id, @Valid @RequestBody Project payload) {
        Project existing = findById(id);
        Project prepared = sanitize(payload, existing);
        return projectRepository.save(prepared);
    }

    @PatchMapping("/{id}/status")
    public Project updateStatus(@PathVariable Long id, @RequestParam ProjectStatus status) {
        Project existing = findById(id);
        existing.setStatus(status);
        return projectRepository.save(existing);
    }

    @PatchMapping("/{id}/featured")
    public Project updateFeatured(@PathVariable Long id, @RequestParam boolean featured) {
        Project existing = findById(id);
        existing.setFeatured(featured);
        return projectRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Project existing = findById(id);
        projectRepository.delete(existing);
        return ResponseEntity.noContent().build();
    }

    private Project findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
    }

    private Project sanitize(Project source, Project target) {
        target.setTitle(trim(source.getTitle()));
        target.setSlug(resolveSlug(source));
        target.setSummary(trim(source.getSummary()));
        target.setDescription(trim(source.getDescription()));
        target.setTechTags(source.getTechTags() == null ? new ArrayList<>() : source.getTechTags());
        target.setLiveUrl(trim(source.getLiveUrl()));
        target.setGithubUrl(trim(source.getGithubUrl()));
        target.setThumbnailUrl(trim(source.getThumbnailUrl()));
        target.setGalleryImages(source.getGalleryImages() == null ? new ArrayList<>() : source.getGalleryImages());
        target.setFeatured(source.isFeatured());
        target.setStatus(source.getStatus() == null ? ProjectStatus.DRAFT : source.getStatus());
        return target;
    }

    private String resolveSlug(Project source) {
        String candidate = nullable(source.getSlug());
        if (candidate == null) {
            candidate = SlugUtil.toSlug(source.getTitle());
        }
        return candidate;
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }

    private String nullable(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
