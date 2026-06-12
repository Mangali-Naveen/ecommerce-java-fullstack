package com.example.demo.service;

import java.util.*;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ProductRequest;
import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product addProduct(ProductRequest request) {

        Product product = new Product();

        product.setImage(request.getImage());
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        product.setSalePrice(request.getSalePrice());
        product.setTotalStock(request.getTotalStock());
        product.setAverageReview(0.0);

        return productRepository.save(product);
    }
    

    public List<Product> getAllProducts() {
        return productRepository.findAll();
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
        product.setTotalStock(request.getTotalStock());

        return productRepository.save(product);
    }
    
    public String deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            return "Product not found";
        }

        productRepository.deleteById(id);

        return "Product deleted successfully";
    }
    
    public Product getProductById(Long id) {
    		return productRepository.findById(id).orElse(null);
    }
}