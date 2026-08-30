package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.demo.dto.FeatureRequest;
import com.example.demo.entity.FeatureImage;
import com.example.demo.service.FeatureService;

@RestController
@RequestMapping("/api/common/feature")
@CrossOrigin(origins = "*")
public class FeatureController {

    private final FeatureService featureService;

    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @GetMapping("/get")
    public ResponseEntity<?> getFeatures() {
        List<FeatureImage> list = featureService.getFeatureImages();
        return ResponseEntity.ok(java.util.Map.of("success", true, "data", list));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addFeature(@RequestBody FeatureRequest request) {
        FeatureImage saved = featureService.addFeatureImage(request.getImage());
        return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", "Feature image uploaded successfully",
                "data", saved));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateFeature(
            @PathVariable Long id,
            @RequestBody FeatureRequest request) {
        FeatureImage updated = featureService.updateFeatureImage(id, request.getImage());
        if (updated == null) {
            return ResponseEntity.status(404).body(java.util.Map.of(
                    "success", false,
                    "message", "Feature image not found"));
        }

        return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", "Feature image updated successfully",
                "data", updated));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFeature(@PathVariable Long id) {
        if (!featureService.deleteFeatureImage(id)) {
            return ResponseEntity.status(404).body(java.util.Map.of(
                    "success", false,
                    "message", "Feature image not found"));
        }

        return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", "Feature image deleted successfully"));
    }
}
