package com.kellyflo.portfolio.controller.admin;

import com.kellyflo.portfolio.model.BlogDocument;
import com.kellyflo.portfolio.repository.BlogDocumentRepository;
import com.kellyflo.portfolio.service.FileStorageService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/content/documents")
public class AdminBlogDocumentController {

    private final BlogDocumentRepository blogDocumentRepository;
    private final FileStorageService fileStorageService;

    public AdminBlogDocumentController(BlogDocumentRepository blogDocumentRepository, FileStorageService fileStorageService) {
        this.blogDocumentRepository = blogDocumentRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public List<BlogDocument> list() {
        List<BlogDocument> documents = blogDocumentRepository.findAllByOrderByDisplayOrderAscIdAsc();
        List<BlogDocument> available = new ArrayList<>();
        List<BlogDocument> missing = new ArrayList<>();

        for (BlogDocument document : documents) {
            if (fileStorageService.exists(document.getStoredName())) {
                available.add(document);
            } else {
                missing.add(document);
            }
        }

        if (!missing.isEmpty()) {
            blogDocumentRepository.deleteAll(missing);
        }

        return available;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogDocument> create(
            @RequestParam(required = false) String title,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "true") boolean visible,
            @RequestParam(defaultValue = "false") boolean downloadEnabled,
            @RequestParam(defaultValue = "0") int displayOrder) {

        FileStorageService.StoredFile stored = fileStorageService.store(file);

        BlogDocument document = new BlogDocument();
        document.setTitle(resolveTitle(title, stored.originalName()));
        document.setOriginalName(stored.originalName());
        document.setStoredName(stored.storedName());
        document.setVisible(visible);
        document.setDownloadEnabled(downloadEnabled);
        document.setDisplayOrder(Math.max(displayOrder, 0));

        return ResponseEntity.status(HttpStatus.CREATED).body(blogDocumentRepository.save(document));
    }

    @PutMapping("/{id}")
    public BlogDocument update(@PathVariable Long id, @Valid @RequestBody BlogDocumentUpdateRequest payload) {
        BlogDocument existing = findById(id);
        existing.setTitle(payload.title().trim());
        existing.setVisible(payload.visible());
        existing.setDownloadEnabled(payload.downloadEnabled());
        existing.setDisplayOrder(payload.displayOrder());
        return blogDocumentRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        BlogDocument existing = findById(id);
        blogDocumentRepository.delete(existing);
        try {
            fileStorageService.deleteIfExists(existing.getStoredName());
        } catch (IllegalArgumentException | IllegalStateException ex) {
            // The DB record should still be removable even if the file is already missing.
        }
        return ResponseEntity.noContent().build();
    }

    private BlogDocument findById(Long id) {
        return blogDocumentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));
    }

    private String resolveTitle(String title, String originalName) {
        String candidate = title;
        if (!StringUtils.hasText(candidate)) {
            candidate = fileNameWithoutExtension(originalName);
        }
        candidate = candidate == null ? "" : candidate.trim();
        if (!StringUtils.hasText(candidate)) {
            candidate = "Document";
        }
        if (candidate.length() > 140) {
            throw new IllegalArgumentException("Title must be at most 140 characters.");
        }
        return candidate;
    }

    private String fileNameWithoutExtension(String fileName) {
        if (!StringUtils.hasText(fileName)) {
            return "";
        }
        int idx = fileName.lastIndexOf('.');
        if (idx <= 0) {
            return fileName;
        }
        return fileName.substring(0, idx);
    }

    public record BlogDocumentUpdateRequest(
            @NotBlank @Size(max = 140) String title,
            boolean visible,
            boolean downloadEnabled,
            @NotNull @Min(0) Integer displayOrder) {
    }
}
