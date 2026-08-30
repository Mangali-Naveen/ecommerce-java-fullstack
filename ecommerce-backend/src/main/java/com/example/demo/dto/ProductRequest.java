package com.example.demo.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;
import jakarta.validation.constraints.Size;

public class ProductRequest {

    @Size(max = 2048, message = "Image URL must be 2048 characters or less.")
    private String image;
    private String title;
    private String description;
    private String category;
    private String brand;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer totalStock;
    private List<String> sizes = new ArrayList<>();

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(BigDecimal salePrice) {
        this.salePrice = salePrice;
    }

    public Integer getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(Integer totalStock) {
        this.totalStock = totalStock;
    }

    public List<String> getSizes() {
        return sizes;
    }

    public void setSizes(List<String> sizes) {
        this.sizes = sizes == null ? new ArrayList<>() : sizes;
    }
}
