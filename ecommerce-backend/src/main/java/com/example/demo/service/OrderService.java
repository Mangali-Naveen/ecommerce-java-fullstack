package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.OrderRequest;
import com.example.demo.entity.Address;
import com.example.demo.entity.Cart;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
import com.example.demo.entity.User;
import com.example.demo.repository.AddressRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    public Order createOrder(OrderRequest request) {

        User user = getCurrentUser();

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!Objects.equals(address.getUserId(), user.getId())) {
            throw new RuntimeException("Address does not belong to the authenticated user");
        }

        Order order = new Order();
        order.setUserId(user.getId());
        order.setCartId(cart.getId());
        order.setAddressId(address.getId());
        order.setOrderStatus(request.getOrderStatus() != null ? request.getOrderStatus() : "pending");
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "paypal");
        order.setPaymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "pending");

        double totalAmount = 0.0;
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItem.setSalePrice(cartItem.getProduct().getSalePrice());
            order.addItem(orderItem);

            double unitPrice = 0.0;
            if (cartItem.getProduct().getSalePrice() != null
                    && cartItem.getProduct().getSalePrice().doubleValue() > 0) {
                unitPrice = cartItem.getProduct().getSalePrice().doubleValue();
            } else if (cartItem.getProduct().getPrice() != null) {
                unitPrice = cartItem.getProduct().getPrice().doubleValue();
            }
            totalAmount += unitPrice * cartItem.getQuantity();
        }

        order.setTotalAmount(totalAmount);
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

    public List<Order> getAllOrdersForAdmin() {

        return orderRepository.findAll();
    }

    public Order getOrderDetailsForAdmin(Long orderId) {

        return getOrderDetails(orderId);
    }

    public Map<String, Object> getOrderDetailsWithAddressInfo(Long orderId) {

        Order order = getOrderDetails(orderId);
        if (order == null) {
            return null;
        }

        Map<String, Object> orderData = new LinkedHashMap<>();
        orderData.put("id", order.getId());
        orderData.put("userId", order.getUserId());
        orderData.put("cartId", order.getCartId());
        orderData.put("addressId", order.getAddressId());
        orderData.put("items", order.getItems());
        orderData.put("orderStatus", order.getOrderStatus());
        orderData.put("paymentMethod", order.getPaymentMethod());
        orderData.put("paymentStatus", order.getPaymentStatus());
        orderData.put("totalAmount", order.getTotalAmount());
        orderData.put("orderDate", order.getOrderDate());
        orderData.put("orderUpdateDate", order.getOrderUpdateDate());
        orderData.put("paymentId", order.getPaymentId());
        orderData.put("payerId", order.getPayerId());

        if (order.getAddressId() != null) {
            Address address = addressRepository.findById(order.getAddressId()).orElse(null);
            if (address != null) {
                Map<String, Object> addressInfo = new LinkedHashMap<>();
                addressInfo.put("address", address.getAddress());
                addressInfo.put("city", address.getCity());
                addressInfo.put("pincode", address.getPincode());
                addressInfo.put("phone", address.getPhone());
                addressInfo.put("notes", address.getNotes());
                orderData.put("addressInfo", addressInfo);
            }
        }

        return orderData;
    }

    public Order updateOrderStatus(Long orderId, String orderStatus) {

        Order order = getOrderDetails(orderId);
        if (order == null) {
            return null;
        }

        order.setOrderStatus(orderStatus);
        order.setOrderUpdateDate(LocalDateTime.now());
        return orderRepository.save(order);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Unauthenticated user");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

