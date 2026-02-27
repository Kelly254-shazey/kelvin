package com.kellyflo.portfolio.controller;

import com.kellyflo.portfolio.model.Project;
import com.kellyflo.portfolio.model.ProjectStatus;
import com.kellyflo.portfolio.model.ServiceItem;
import com.kellyflo.portfolio.model.SiteContent;
import com.kellyflo.portfolio.model.Skill;
import com.kellyflo.portfolio.model.Testimonial;
import com.kellyflo.portfolio.model.Video;
import com.kellyflo.portfolio.model.BlogDocument;
import com.kellyflo.portfolio.repository.BlogDocumentRepository;
import com.kellyflo.portfolio.repository.ProjectRepository;
import com.kellyflo.portfolio.repository.ServiceItemRepository;
import com.kellyflo.portfolio.repository.SiteContentRepository;
import com.kellyflo.portfolio.repository.SkillRepository;
import com.kellyflo.portfolio.repository.TestimonialRepository;
import com.kellyflo.portfolio.repository.VideoRepository;
import com.kellyflo.portfolio.service.FileStorageService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final ProjectRepository projectRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final SkillRepository skillRepository;
    private final TestimonialRepository testimonialRepository;
    private final VideoRepository videoRepository;
    private final SiteContentRepository siteContentRepository;
    private final BlogDocumentRepository blogDocumentRepository;
    private final FileStorageService fileStorageService;

    public PublicController(ProjectRepository projectRepository,
            ServiceItemRepository serviceItemRepository,
            SkillRepository skillRepository,
            TestimonialRepository testimonialRepository,
            VideoRepository videoRepository,
            SiteContentRepository siteContentRepository,
            BlogDocumentRepository blogDocumentRepository,
            FileStorageService fileStorageService) {
        this.projectRepository = projectRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.skillRepository = skillRepository;
        this.testimonialRepository = testimonialRepository;
        this.videoRepository = videoRepository;
        this.siteContentRepository = siteContentRepository;
        this.blogDocumentRepository = blogDocumentRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/projects")
    public List<Project> projects(@RequestParam(defaultValue = "false") boolean featured) {
        if (featured) {
            return projectRepository.findByStatusAndFeaturedTrueOrderByUpdatedAtDesc(ProjectStatus.PUBLISHED);
        }
        return projectRepository.findByStatusOrderByUpdatedAtDesc(ProjectStatus.PUBLISHED);
    }

    @GetMapping("/services")
    public List<ServiceItem> services() {
        return serviceItemRepository.findAllByOrderByDisplayOrderAsc();
    }

    @GetMapping("/skills")
    public List<Skill> skills() {
        return skillRepository.findAllByOrderByCategoryAscNameAsc();
    }

    @GetMapping("/testimonials")
    public List<Testimonial> testimonials() {
        return testimonialRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/videos")
    public List<Video> videos() {
        return videoRepository.findByPublishedTrueOrderByCreatedAtDesc();
    }

    @GetMapping("/content")
    public SiteContent content() {
        return siteContentRepository.findTopByOrderByIdAsc().orElseGet(SiteContent::new);
    }

    @GetMapping("/content/documents")
    public List<PublicDocumentResponse> contentDocuments() {
        return blogDocumentRepository.findByVisibleTrueOrderByDisplayOrderAscIdAsc().stream()
                .map(item -> new PublicDocumentResponse(
                        item.getId(),
                        item.getTitle(),
                        item.getOriginalName(),
                        item.isDownloadEnabled(),
                        item.getDisplayOrder()))
                .toList();
    }

    @GetMapping("/content/documents/{id}/file")
    public ResponseEntity<Resource> contentDocumentFile(
            @PathVariable Long id,
            @RequestParam(defaultValue = "true") boolean download) {
        BlogDocument document = blogDocumentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Document not found."));

        if (!document.isVisible()) {
            throw new EntityNotFoundException("Document not found.");
        }
        if (download && !document.isDownloadEnabled()) {
            throw new AccessDeniedException("Download is disabled by admin.");
        }

        Resource resource = fileStorageService.loadAsResource(document.getStoredName());
        String safeName = StringUtils.hasText(document.getOriginalName()) ? document.getOriginalName() : "document.pdf";
        ContentDisposition disposition = download
                ? ContentDisposition.attachment().filename(safeName).build()
                : ContentDisposition.inline().filename(safeName).build();
        MediaType mediaType = resolveMediaType(safeName);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .contentType(mediaType)
                .body(resource);
    }

    @GetMapping("/content/file/{type}")
    public ResponseEntity<Resource> contentFile(
            @PathVariable String type,
            @RequestParam(defaultValue = "true") boolean download) {
        SiteContent content = siteContentRepository.findTopByOrderByIdAsc().orElseGet(SiteContent::new);
        FileInfo fileInfo = resolveFileInfo(type, content);

        if (download && !fileInfo.downloadEnabled) {
            throw new AccessDeniedException("Download is disabled by admin.");
        }

        if (!StringUtils.hasText(fileInfo.storedName)) {
            throw new EntityNotFoundException("File not found.");
        }

        Resource resource = fileStorageService.loadAsResource(fileInfo.storedName);

        String safeName = StringUtils.hasText(fileInfo.originalName) ? fileInfo.originalName : fileInfo.type + ".pdf";
        ContentDisposition disposition = download
                ? ContentDisposition.attachment().filename(safeName).build()
                : ContentDisposition.inline().filename(safeName).build();
        MediaType mediaType = resolveMediaType(safeName);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .contentType(mediaType)
                .body(resource);
    }

    private FileInfo resolveFileInfo(String type, SiteContent content) {
        if (type == null) {
            throw new IllegalArgumentException("File type is required.");
        }

        String normalized = type.trim().toLowerCase();
        if ("resume".equals(normalized)) {
            return new FileInfo(
                    "resume",
                    content.getResumeStoredName(),
                    content.getResumeOriginalName(),
                    content.isResumeVisible(),
                    content.isResumeDownloadEnabled());
        }
        if ("cv".equals(normalized)) {
            return new FileInfo(
                    "cv",
                    content.getCvStoredName(),
                    content.getCvOriginalName(),
                    content.isCvVisible(),
                    content.isCvDownloadEnabled());
        }

        throw new IllegalArgumentException("Invalid file type. Use 'resume' or 'cv'.");
    }

    private MediaType resolveMediaType(String fileName) {
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".pdf")) {
            return MediaType.APPLICATION_PDF;
        }
        if (lower.endsWith(".doc")) {
            return MediaType.parseMediaType("application/msword");
        }
        if (lower.endsWith(".docx")) {
            return MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        }
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    private static class FileInfo {
        private final String type;
        private final String storedName;
        private final String originalName;
        private final boolean visible;
        private final boolean downloadEnabled;

        private FileInfo(String type, String storedName, String originalName, boolean visible, boolean downloadEnabled) {
            this.type = type;
            this.storedName = storedName;
            this.originalName = originalName;
            this.visible = visible;
            this.downloadEnabled = downloadEnabled;
        }
    }

    public record PublicDocumentResponse(
            Long id,
            String title,
            String fileName,
            boolean downloadEnabled,
            Integer displayOrder) {
    }
}
