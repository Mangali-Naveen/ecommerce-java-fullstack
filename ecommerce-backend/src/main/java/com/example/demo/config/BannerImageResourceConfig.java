package com.example.demo.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class BannerImageResourceConfig implements WebMvcConfigurer {

    private final Path uploadDirectory;

    public BannerImageResourceConfig(
            @Value("${app.upload.dir:uploads/banner-images}") String uploadDirectory) {
        this.uploadDirectory = Paths.get(uploadDirectory).toAbsolutePath().normalize();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/banner-images/**")
                .addResourceLocations(uploadDirectory.toUri().toString());
    }
}
