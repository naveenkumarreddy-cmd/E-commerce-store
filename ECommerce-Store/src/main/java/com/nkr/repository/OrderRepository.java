package com.nkr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nkr.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
	
	List<Order> findByUserId(Long userId);

}
