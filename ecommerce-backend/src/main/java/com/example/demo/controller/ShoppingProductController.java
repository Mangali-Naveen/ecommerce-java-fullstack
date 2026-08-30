package com.example.demo.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;

@RestController
@RequestMapping("/api/shop")
public class ShoppingProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/products/get")
    public ResponseEntity<?> getAllProducts() {
        System.out.println("[ShoppingProductController] GET /api/shop/products/get - Fetching all products");
        
        List<Product> products = productService.getAllProducts();
        
        System.out.println("[ShoppingProductController] Response: " + products.size() + " products found");
        System.out.println("[ShoppingProductController] Product IDs: " + 
            products.stream().map(p -> p.getId()).toList());
        
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "data", products,
            "count", products.size()
        ));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        System.out.println("[ShoppingProductController] GET /api/shop/products/" + id + " - Fetching product by ID");
        
        Product p = productService.getProductById(id);
        
        if (p == null) {
            System.out.println("[ShoppingProductController] Product with ID " + id + " not found");
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Product not found"));
        }
        
        System.out.println("[ShoppingProductController] Product found: " + p.getTitle());
        return ResponseEntity.ok(Map.of("success", true, "data", p));
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<?> searchProducts(@PathVariable String keyword) {
        List<Product> products = productService.searchProducts(keyword);
        return ResponseEntity.ok(Map.of("success", true, "data", products));
    }
}
