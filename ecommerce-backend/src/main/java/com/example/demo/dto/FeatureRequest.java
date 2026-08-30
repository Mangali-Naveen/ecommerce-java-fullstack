package com.example.demo.dto;

public class FeatureRequest {

    private String image;

    public FeatureRequest() {
    }

    public FeatureRequest(String image) {
        this.image = image;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
