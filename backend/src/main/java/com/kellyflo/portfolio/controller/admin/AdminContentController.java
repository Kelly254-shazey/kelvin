package com.kellyflo.portfolio.controller.admin;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kellyflo.portfolio.model.SiteContent;
import com.kellyflo.portfolio.repository.SiteContentRepository;
import com.kellyflo.portfolio.service.FileStorageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/content")
public class AdminContentController {

    private final SiteContentRepository siteContentRepository;
    private final FileStorageService fileStorageService;

    public AdminContentController(SiteContentRepository siteContentRepository, FileStorageService fileStorageService) {
        this.siteContentRepository = siteContentRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public SiteContent getContent() {
        return siteContentRepository.findTopByOrderByIdAsc().orElseGet(() -> {
            SiteContent content = new SiteContent();
            return siteContentRepository.save(content);
        });
    }

    @PutMapping
    public SiteContent updateContent(@Valid @RequestBody SiteContent payload) {
        SiteContent content = ensureContent();

        content.setBrandName(payload.getBrandName());
        content.setHeroTitle(payload.getHeroTitle());
        content.setHeroHighlight(payload.getHeroHighlight());
        content.setHeroSubheadline(payload.getHeroSubheadline());
        content.setHeroDescription(payload.getHeroDescription());
        content.setHeroPrimaryCtaText(payload.getHeroPrimaryCtaText());
        content.setHeroPrimaryCtaLink(payload.getHeroPrimaryCtaLink());
        content.setHeroSecondaryCtaText(payload.getHeroSecondaryCtaText());
        content.setHeroSecondaryCtaLink(payload.getHeroSecondaryCtaLink());
        content.setHeroTagOne(payload.getHeroTagOne());
        content.setHeroTagTwo(payload.getHeroTagTwo());
        content.setHeroTagThree(payload.getHeroTagThree());
        content.setProfileImageUrl(payload.getProfileImageUrl());
        content.setAboutTitle(payload.getAboutTitle());
        content.setAboutDescription(payload.getAboutDescription());
        content.setStatOneValue(payload.getStatOneValue());
        content.setStatOneLabel(payload.getStatOneLabel());
        content.setStatTwoValue(payload.getStatTwoValue());
        content.setStatTwoLabel(payload.getStatTwoLabel());
        content.setStatThreeValue(payload.getStatThreeValue());
        content.setStatThreeLabel(payload.getStatThreeLabel());
        content.setServicesTitle(payload.getServicesTitle());
        content.setWorkTitle(payload.getWorkTitle());
        content.setSkillsTitle(payload.getSkillsTitle());
        content.setTestimonialsTitle(payload.getTestimonialsTitle());
        content.setVideosTitle(payload.getVideosTitle());
        content.setContactTitle(payload.getContactTitle());
        content.setContactCardTitle(payload.getContactCardTitle());
        content.setNavHireCtaText(payload.getNavHireCtaText());
        content.setContactEmail(payload.getContactEmail());
        content.setWhatsappUrl(payload.getWhatsappUrl());
        content.setLinkedinUrl(payload.getLinkedinUrl());
        content.setGithubUrl(payload.getGithubUrl());
        content.setTiktokUrl(payload.getTiktokUrl());
        content.setResumeVisible(payload.isResumeVisible());
        content.setResumeDownloadEnabled(payload.isResumeDownloadEnabled());
        content.setCvVisible(payload.isCvVisible());
        content.setCvDownloadEnabled(payload.isCvDownloadEnabled());

        return siteContentRepository.save(content);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam String type,
            @RequestParam("file") MultipartFile file) {
        String fileType = normalizeType(type);
        SiteContent content = ensureContent();

        FileStorageService.StoredFile stored = fileStorageService.store(file);

        if ("resume".equals(fileType)) {
            fileStorageService.deleteIfExists(content.getResumeStoredName());
            content.setResumeOriginalName(stored.originalName());
            content.setResumeStoredName(stored.storedName());
            content.setResumeVisible(true);
        } else {
            fileStorageService.deleteIfExists(content.getCvStoredName());
            content.setCvOriginalName(stored.originalName());
            content.setCvStoredName(stored.storedName());
            content.setCvVisible(true);
        }

        siteContentRepository.save(content);

        return ResponseEntity.ok(Map.of(
                "type", fileType,
                "fileName", stored.originalName(),
                "downloadUrl", "/api/public/content/file/" + fileType));
    }

    @DeleteMapping("/upload")
    public ResponseEntity<Map<String, String>> deleteFile(@RequestParam String type) {
        String fileType = normalizeType(type);
        SiteContent content = ensureContent();

        if ("resume".equals(fileType)) {
            fileStorageService.deleteIfExists(content.getResumeStoredName());
            content.setResumeOriginalName(null);
            content.setResumeStoredName(null);
            content.setResumeVisible(false);
            content.setResumeDownloadEnabled(false);
        } else {
            fileStorageService.deleteIfExists(content.getCvStoredName());
            content.setCvOriginalName(null);
            content.setCvStoredName(null);
            content.setCvVisible(false);
            content.setCvDownloadEnabled(false);
        }

        siteContentRepository.save(content);

        return ResponseEntity.ok(Map.of("type", fileType, "message", "File deleted successfully"));
    }

    private SiteContent ensureContent() {
        return siteContentRepository.findTopByOrderByIdAsc().orElseGet(SiteContent::new);
    }

    private String normalizeType(String type) {
        if (type == null) {
            throw new IllegalArgumentException("File type is required.");
        }

        String normalized = type.trim().toLowerCase();
        if (!"resume".equals(normalized) && !"cv".equals(normalized)) {
            throw new IllegalArgumentException("Invalid file type. Use 'resume' or 'cv'.");
        }
        return normalized;
    }
}
