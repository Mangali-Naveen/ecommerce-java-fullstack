package com.example.demo.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.ProductRequest;
import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;

@RestController
@RequestMapping("/api/admin/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public Product addProduct(
            @RequestBody ProductRequest request) {

        return productService.addProduct(request);
    }
    
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
    
    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request) {

        return productService.updateProduct(id, request);
    }
    
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {

        return productService.deleteProduct(id);
    }
}