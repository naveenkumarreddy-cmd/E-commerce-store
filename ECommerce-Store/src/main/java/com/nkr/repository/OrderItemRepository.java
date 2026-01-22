package com.nkr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nkr.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
}
