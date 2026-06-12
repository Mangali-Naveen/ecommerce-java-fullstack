package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.CartRequest;
import com.example.demo.dto.UpdateCartRequest;
import com.example.demo.entity.Cart;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public String addToCart(CartRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        // Check if item already exists in the cart to avoid duplicates
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.getQuantity());
            cartItemRepository.save(item);
            cart.getItems().add(item);
        }

        return "Product added to cart";
    }
    
    public Cart getCartByUser(Long userId) {

        System.out.println("Received User ID = " + userId);

        User user = userRepository.findById(userId)
                .orElse(null);

        if (user == null) {
            System.out.println("User not found");
            return null;
        }

        System.out.println("User found = " + user.getEmail());

        // Auto-create a cart if it doesn't exist for the user
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }
    
    public String updateCartItem(UpdateCartRequest request) {
        CartItem item = null;

        if (request.getCartItemId() != null) {
            item = cartItemRepository.findById(request.getCartItemId()).orElse(null);
        } else if (request.getUserId() != null && request.getProductId() != null) {
            User user = userRepository.findById(request.getUserId()).orElse(null);
            if (user != null) {
                Cart cart = cartRepository.findByUser(user).orElse(null);
                if (cart != null) {
                    item = cart.getItems().stream()
                            .filter(i -> i.getProduct().getId().equals(request.getProductId()))
                            .findFirst()
                            .orElse(null);
                }
            }
        }

        if (item == null) {
            return "Cart item not found";
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return "Cart updated successfully";
    }
    
    public String removeCartItem(Long cartItemId) {

        if (!cartItemRepository.existsById(cartItemId)) {
            return "Cart item not found";
        }

        cartItemRepository.deleteById(cartItemId);

        return "Cart item removed successfully";
    }

    public String removeCartItem(Long userId, Long productId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return "User not found";
        }

        Cart cart = cartRepository.findByUser(user).orElse(null);
        if (cart == null) {
            return "Cart not found";
        }

        CartItem itemToRemove = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (itemToRemove == null) {
            return "Cart item not found";
        }

        cart.getItems().remove(itemToRemove);
        cartItemRepository.delete(itemToRemove);

        return "Cart item removed successfully";
    }

}