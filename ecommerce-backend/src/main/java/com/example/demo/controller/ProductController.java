package com.example.demo.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.ProductRequest;
import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@Valid @RequestBody ProductRequest request) {
        Product saved = productService.addProduct(request);
        return ResponseEntity.ok(Map.of("success", true, "data", saved));
    }

    @GetMapping("/get")
    public ResponseEntity<?> getAllProducts() {
        System.out.println("[ProductController] GET /api/admin/products/get - Admin fetching all products");
        List<Product> products = productService.getAllProducts();
        System.out.println("[ProductController] Returning " + products.size() + " products");
        return ResponseEntity.ok(Map.of("success", true, "data", products));
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        Product updated = productService.updateProduct(id, request);
        if (updated == null) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Product not found"));
        }
        return ResponseEntity.ok(Map.of("success", true, "data", updated));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        String result = productService.deleteProduct(id);
        if (result.toLowerCase().contains("not found")) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", result));
        }
        if (result.toLowerCase().contains("cannot be deleted")) {
            return ResponseEntity.status(409).body(Map.of("success", false, "message", result));
        }
        return ResponseEntity.ok(Map.of("success", true, "message", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        System.out.println("[ProductController] GET /api/admin/products/" + id + " - Admin fetching product by ID");
        Product p = productService.getProductById(id);
        if (p == null) {
            System.out.println("[ProductController] Product with ID " + id + " not found");
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Product not found"));
        }
        System.out.println("[ProductController] Found product: " + p.getTitle());
        return ResponseEntity.ok(Map.of("success", true, "data", p));
    }
}