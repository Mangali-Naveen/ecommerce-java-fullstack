package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Order;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    @Query("select case when count(item) > 0 then true else false end from Order orderEntity join orderEntity.items item where item.product.id = :productId")
    boolean existsByProductIdInItems(@Param("productId") Long productId);
}