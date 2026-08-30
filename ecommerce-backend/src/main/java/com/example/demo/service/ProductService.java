package com.example.demo.service;

import java.util.*;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ProductRequest;
import com.example.demo.entity.Product;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.WishlistRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public Product addProduct(ProductRequest request) {

        Product product = new Product();

        product.setImage(request.getImage());
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        product.setSalePrice(request.getSalePrice());
        product.setSizes(request.getSizes());
        product.setTotalStock(request.getTotalStock());
        product.setAverageReview(0.0);

        return productRepository.save(product);
    }
    

    public List<Product> getAllProducts() {
        System.out.println("[ProductService] getAllProducts() called");
        List<Product> products = productRepository.findAll();
        System.out.println("[ProductService] Found " + products.size() + " products in database");
        products.forEach(p -> System.out.println("[ProductService] - Product ID: " + p.getId() + ", Title: " + p.getTitle()));
        return products;
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.searchByKeyword(keyword.trim());
    }
    


    public Product updateProduct(Long id, ProductRequest request) {

        Optional<Product> optionalProduct = productRepository.findById(id);

        if (optionalProduct.isEmpty()) {
            return null;
        }

        Product product = optionalProduct.get();

        product.setImage(request.getImage());
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        product.setSalePrice(request.getSalePrice());
        product.setSizes(request.getSizes());
        product.setTotalStock(request.getTotalStock());

        return productRepository.save(product);
    }
    
    public String deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            return "Product not found";
        }

        if (cartItemRepository.existsByProduct_Id(id)
                || orderRepository.existsByProductIdInItems(id)
                || wishlistRepository.existsByProduct_Id(id)
                || reviewRepository.existsByProductId(id)) {
            return "Product cannot be deleted because it is referenced by existing orders, cart items, wishlist items, or reviews.";
        }

        productRepository.deleteById(id);

        return "Product deleted successfully";
    }
    
    public Product getProductById(Long id) {
    		return productRepository.findById(id).orElse(null);
    }
}