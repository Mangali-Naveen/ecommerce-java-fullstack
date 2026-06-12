package com.example.demo.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.CartRequest;
import com.example.demo.dto.UpdateCartRequest;
import com.example.demo.entity.Cart;
import com.example.demo.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody CartRequest request) {

        System.out.println("USER ID = " + request.getUserId());
        System.out.println("PRODUCT ID = " + request.getProductId());
        System.out.println("QUANTITY = " + request.getQuantity());

        String result = cartService.addToCart(request);
        if ("Product added to cart".equals(result)) {
            Cart cart = cartService.getCartByUser(request.getUserId());
            return ResponseEntity.ok(Map.of("success", true, "message", result, "data", cart));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", result));
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(
            @PathVariable Long userId) {

        Cart cart = cartService.getCartByUser(userId);
        if (cart == null) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "User not found"));
        }
        return ResponseEntity.ok(Map.of("success", true, "data", cart));
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(
            @RequestBody UpdateCartRequest request) {

        String result = cartService.updateCartItem(request);
        if ("Cart updated successfully".equals(result)) {
            Cart cart = cartService.getCartByUser(request.getUserId());
            return ResponseEntity.ok(Map.of("success", true, "message", result, "data", cart));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", result));
    }
    
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeCartItem(
            @PathVariable Long cartItemId) {

        // Legacy delete support
        String result = cartService.removeCartItem(cartItemId);
        if ("Cart item removed successfully".equals(result)) {
            return ResponseEntity.ok(Map.of("success", true, "message", result));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", result));
    }

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<?> removeCartItem(
            @PathVariable Long userId,
            @PathVariable Long productId) {

        String result = cartService.removeCartItem(userId, productId);
        if ("Cart item removed successfully".equals(result)) {
            Cart cart = cartService.getCartByUser(userId);
            return ResponseEntity.ok(Map.of("success", true, "message", result, "data", cart));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", result));
    }
}