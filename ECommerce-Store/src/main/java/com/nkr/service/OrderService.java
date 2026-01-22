package com.nkr.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.nkr.dto.*;
import com.nkr.entity.*;
import com.nkr.repository.*;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // ================= PLACE ORDER =================
    public OrderResponseDTO placeOrder(OrderRequestDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("CREATED");

        List<OrderItem> orderItems = dto.getItems().stream().map(itemDTO -> {

            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());
            item.setPrice(product.getPrice());

            return item;
        }).collect(Collectors.toList());

        double totalAmount = orderItems.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        return mapToResponseDTO(savedOrder);
    }

    // ================= GET BY ID =================
    public OrderResponseDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToResponseDTO(order);
    }

    // ================= GET ALL (OLD ENDPOINT) =================
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ================= PAGED ORDERS (FOR ADMIN UI) =================
    public Page<OrderResponseDTO> getOrdersPaged(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(this::mapToResponseDTO);
    }

    // ================= DELETE =================
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // ================= MAPPER =================
    private OrderResponseDTO mapToResponseDTO(Order order) {

        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setOrderId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());

        dto.setUserEmail(order.getUser().getEmail());

        List<OrderItemResponseDTO> items =
                order.getOrderItems().stream().map(i -> {

                    OrderItemResponseDTO itemDTO = new OrderItemResponseDTO();
                    itemDTO.setProductName(i.getProduct().getName());
                    itemDTO.setQuantity(i.getQuantity());
                    itemDTO.setPrice(i.getPrice());
                    return itemDTO;

                }).collect(Collectors.toList());

        dto.setItems(items);
        return dto;
    }
    
    public List<OrderResponseDTO> getOrdersByUser(Long userId){

        return orderRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

}
