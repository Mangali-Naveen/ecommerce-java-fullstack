package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.WishlistRequest;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.entity.Wishlist;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WishlistRepository;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Wishlist> getWishlistForCurrentUser() {
        User user = getCurrentUser();
        return wishlistRepository.findByUser(user);
    }

    public String addToWishlist(WishlistRequest request) {
        if (request == null || request.getProductId() == null) {
            return "Invalid request: productId is required";
        }

        User user = getCurrentUser();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (wishlistRepository.findByUserAndProduct(user, product).isPresent()) {
            return "Product already in wishlist";
        }

        Wishlist wishlistItem = new Wishlist();
        wishlistItem.setUser(user);
        wishlistItem.setProduct(product);
        wishlistRepository.save(wishlistItem);

        return "Product added to wishlist";
    }

    @Transactional
    public String removeFromWishlist(Long productId) {
        if (productId == null) {
            return "Invalid request: productId is required";
        }

        User user = getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (wishlistRepository.findByUserAndProduct(user, product).isEmpty()) {
            return "Wishlist item not found";
        }

        wishlistRepository.deleteByUserAndProduct(user, product);
        return "Product removed from wishlist";
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
