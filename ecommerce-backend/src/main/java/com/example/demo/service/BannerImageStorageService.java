package com.example.demo.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class BannerImageStorageService {

    private final Path uploadDirectory;

    public BannerImageStorageService(
            @Value("${app.upload.dir:uploads/banner-images}") String uploadDirectory) {
        this.uploadDirectory = Paths.get(uploadDirectory).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file must be provided");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new IllegalArgumentException("Uploaded file must be an image");
        }

        String extension = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + extension;
        Files.createDirectories(uploadDirectory);
        file.transferTo(uploadDirectory.resolve(filename));
        return filename;
    }

    private String getExtension(String originalFilename) {
        if (originalFilename == null) {
            return "";
        }

        int extensionStart = originalFilename.lastIndexOf('.');
        if (extensionStart < 0) {
            return "";
        }

        String extension = originalFilename.substring(extensionStart).toLowerCase();
        return extension.matches("\\.(png|jpe?g|gif|webp|bmp|svg)") ? extension : "";
    }
}
