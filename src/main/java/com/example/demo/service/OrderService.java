package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.OrderRequest;
import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(OrderRequest request) {

        Order order = new Order();

        order.setUserId(request.getUserId());
        order.setCartId(request.getCartId());
        order.setAddressId(request.getAddressId());

        order.setOrderStatus(request.getOrderStatus());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(request.getPaymentStatus());

        order.setTotalAmount(request.getTotalAmount());

        order.setPaymentId(request.getPaymentId());
        order.setPayerId(request.getPayerId());

        order.setOrderDate(LocalDateTime.now());
        order.setOrderUpdateDate(LocalDateTime.now());

        return orderRepository.save(order);
    }
    
    public List<Order> getOrdersByUser(Long userId) {

        return orderRepository.findByUserId(userId);
    }
    
    public Order getOrderDetails(Long orderId) {

        return orderRepository.findById(orderId)
                .orElse(null);
    }
}
