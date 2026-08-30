package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.DoubleStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ReviewRequest;
import com.example.demo.entity.Product;
import com.example.demo.entity.Review;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ReviewRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public Review addReview(ReviewRequest request) {
        Review review = new Review();
        review.setProductId(request.getProductId());
        review.setUserId(request.getUserId());
        review.setUserName(request.getUserName());
        review.setReviewMessage(request.getReviewMessage());
        review.setReviewValue(request.getReviewValue());

        Review savedReview = reviewRepository.save(review);
        recalculateProductAverage(request.getProductId());
        return savedReview;
    }

    private void recalculateProductAverage(Long productId) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isEmpty()) {
            return;
        }

        List<Review> reviews = reviewRepository.findByProductId(productId);
        double average = 0.0;
        if (!reviews.isEmpty()) {
            average = reviews.stream()
                .flatMapToDouble(r -> DoubleStream.of(r.getReviewValue() == null ? 0.0 : r.getReviewValue()))
                .average()
                .orElse(0.0);
        }

        Product product = optionalProduct.get();
        product.setAverageReview(average);
        productRepository.save(product);
    }
}
