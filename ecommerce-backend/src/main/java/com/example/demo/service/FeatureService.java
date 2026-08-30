package com.example.demo.service;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.FeatureImage;
import com.example.demo.repository.FeatureRepository;

@Service
public class FeatureService {

    private final FeatureRepository featureRepository;

    public FeatureService(FeatureRepository featureRepository) {
        this.featureRepository = featureRepository;
    }

    public FeatureImage addFeatureImage(String imageUrl) {
        validateImageUrl(imageUrl);

        FeatureImage feature = new FeatureImage();
        feature.setImage(imageUrl);

        return featureRepository.save(feature);
    }

    public List<FeatureImage> getFeatureImages() {
        return featureRepository.findAll();
    }

    public FeatureImage updateFeatureImage(Long id, String imageUrl) {
        validateImageUrl(imageUrl);

        FeatureImage feature = featureRepository.findById(id).orElse(null);
        if (feature == null) {
            return null;
        }

        feature.setImage(imageUrl);
        return featureRepository.save(feature);
    }

    public boolean deleteFeatureImage(Long id) {
        if (!featureRepository.existsById(id)) {
            return false;
        }

        featureRepository.deleteById(id);
        return true;
    }

    private void validateImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("Image URL must not be empty");
        }

        try {
            URL parsedUrl = new URL(imageUrl);
            if (parsedUrl.getProtocol().isBlank()) {
                throw new IllegalArgumentException("Invalid image URL");
            }
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid image URL");
        }
    }
}
