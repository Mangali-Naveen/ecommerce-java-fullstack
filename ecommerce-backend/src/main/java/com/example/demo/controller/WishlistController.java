package com.example.demo.controller;

import com.example.demo.dto.WishlistRequest;
import com.example.demo.entity.Wishlist;
import com.example.demo.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<?> getWishlist() {
        List<Wishlist> wishlistItems = wishlistService.getWishlistForCurrentUser();
        return ResponseEntity.ok(Map.of("success", true, "data", wishlistItems));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToWishlist(@RequestBody WishlistRequest request) {
        String result = wishlistService.addToWishlist(request);

        if ("Product added to wishlist".equals(result)) {
            List<Wishlist> wishlistItems = wishlistService.getWishlistForCurrentUser();
            return ResponseEntity.ok(Map.of("success", true, "message", result, "data", wishlistItems));
        }

        return ResponseEntity.badRequest().body(Map.of("success", false, "message", result));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId) {
        String result = wishlistService.removeFromWishlist(productId);

        if ("Product removed from wishlist".equals(result)) {
            List<Wishlist> wishlistItems = wishlistService.getWishlistForCurrentUser();
            return ResponseEntity.ok(Map.of("success", true, "message", result, "data", wishlistItems));
        }

        return ResponseEntity.badRequest().body(Map.of("success", false, "message", result));
    }
}
