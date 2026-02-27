package com.kellyflo.portfolio.controller.admin;

import com.kellyflo.portfolio.model.Video;
import com.kellyflo.portfolio.repository.VideoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
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
@RequestMapping("/api/admin/videos")
public class AdminVideoController {

    private final VideoRepository videoRepository;

    public AdminVideoController(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    @GetMapping
    public Page<Video> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean published) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return videoRepository.search(nullable(search), nullable(category), published, pageable);
    }

    @GetMapping("/{id}")
    public Video get(@PathVariable Long id) {
        return findById(id);
    }

    @PostMapping
    public ResponseEntity<Video> create(@Valid @RequestBody Video payload) {
        payload.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(videoRepository.save(payload));
    }

    @PutMapping("/{id}")
    public Video update(@PathVariable Long id, @Valid @RequestBody Video payload) {
        Video existing = findById(id);
        existing.setTitle(payload.getTitle());
        existing.setDescription(payload.getDescription());
        existing.setCategory(payload.getCategory());
        existing.setVideoUrl(payload.getVideoUrl());
        existing.setThumbnailUrl(payload.getThumbnailUrl());
        existing.setPublished(payload.isPublished());
        return videoRepository.save(existing);
    }

    @PatchMapping("/{id}/published")
    public Video updatePublished(@PathVariable Long id, @RequestParam boolean published) {
        Video existing = findById(id);
        existing.setPublished(published);
        return videoRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Video existing = findById(id);
        videoRepository.delete(existing);
        return ResponseEntity.noContent().build();
    }

    private Video findById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Video not found"));
    }

    private String nullable(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
