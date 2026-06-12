package com.example.demo.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.OrderRequest;
import com.example.demo.entity.Order;
import com.example.demo.service.OrderService;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public Order createOrder(
            @RequestBody OrderRequest request) {

        return orderService.createOrder(request);
    }

    @GetMapping("/list/{userId}")
    public List<Order> getOrdersByUser(
            @PathVariable Long userId) {

        return orderService.getOrdersByUser(userId);
    }

    @GetMapping("/details/{id}")
    public Order getOrderDetails(
            @PathVariable Long id) {

        return orderService.getOrderDetails(id);
    }
}
