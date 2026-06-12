package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
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
    public String addToCart(
            @RequestBody CartRequest request) {

        return cartService.addToCart(request);
    }
    
    @GetMapping("/{userId}")
    public Cart getCart(
            @PathVariable Long userId) {

        return cartService.getCartByUser(userId);
    }
    
    @PutMapping("/update")
    public String updateCartItem(
            @RequestBody UpdateCartRequest request) {

        return cartService.updateCartItem(request);
    }
    
    @DeleteMapping("/{cartItemId}")
    public String removeCartItem(
            @PathVariable Long cartItemId) {

        return cartService.removeCartItem(cartItemId);
    }
}