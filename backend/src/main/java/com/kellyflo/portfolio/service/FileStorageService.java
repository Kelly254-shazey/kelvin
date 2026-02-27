package com.kellyflo.portfolio.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".pdf", ".doc", ".docx");

    private final Path storageDir;

    public record StoredFile(String originalName, String storedName) {
    }

    public FileStorageService(@Value("${app.upload.dir:./uploads}") String uploadDir) {
        this.storageDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        initStorage();
    }

    public StoredFile store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a file to upload.");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
        String extension = getExtension(originalName);

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("Only PDF, DOC, and DOCX files are allowed.");
        }

        String storedName = UUID.randomUUID() + extension;
        Path destination = storageDir.resolve(storedName).normalize();

        if (!destination.startsWith(storageDir)) {
            throw new IllegalArgumentException("Invalid file path.");
        }

        try {
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            return new StoredFile(originalName, storedName);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to store uploaded file.", ex);
        }
    }

    public Resource loadAsResource(String storedName) {
        if (!StringUtils.hasText(storedName)) {
            throw new IllegalArgumentException("File not found.");
        }

        try {
            Path filePath = storageDir.resolve(storedName).normalize();
            if (!filePath.startsWith(storageDir)) {
                throw new IllegalArgumentException("Invalid file path.");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new IllegalArgumentException("File not found.");
            }
            return resource;
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to read file.", ex);
        }
    }

    public void deleteIfExists(String storedName) {
        if (!StringUtils.hasText(storedName)) {
            return;
        }

        try {
            Path filePath = storageDir.resolve(storedName).normalize();
            if (filePath.startsWith(storageDir)) {
                Files.deleteIfExists(filePath);
            }
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to delete file.", ex);
        }
    }

    private void initStorage() {
        try {
            Files.createDirectories(storageDir);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to initialize upload storage.", ex);
        }
    }

    private String getExtension(String fileName) {
        int index = fileName.lastIndexOf('.');
        if (index < 0) {
            return "";
        }
        return fileName.substring(index);
    }
}
