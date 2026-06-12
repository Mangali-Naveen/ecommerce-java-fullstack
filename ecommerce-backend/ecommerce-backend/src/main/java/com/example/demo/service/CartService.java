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
                .orElseThrow();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow();

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(request.getQuantity());

        cartItemRepository.save(item);

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

        Cart cart = cartRepository.findByUser(user)
                .orElse(null);

        if (cart == null) {
            System.out.println("Cart not found");
            return null;
        }

        System.out.println("Cart found = " + cart.getId());

        return cart;
    }
    
    public String updateCartItem(UpdateCartRequest request) {

        CartItem item = cartItemRepository
                .findById(request.getCartItemId())
                .orElse(null);

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
}