package com.nkr.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import com.nkr.dto.ProductRequestDTO;
import com.nkr.dto.ProductResponseDTO;
import com.nkr.entity.Product;
import com.nkr.exception.ProductNotFoundException;
import com.nkr.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // CREATE
    public ProductResponseDTO addProduct(ProductRequestDTO dto) {

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());

        Product saved = productRepository.save(product);
        return mapToResponseDTO(saved);
    }

    // ===============================
    // ⭐ NEW — PAGINATED PRODUCTS
    // ===============================
    public Page<ProductResponseDTO> getProductsPaged(Pageable pageable){

        return productRepository.findAll(pageable)
                .map(this::mapToResponseDTO);
    }

    // GET ALL
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        return mapToResponseDTO(product);
    }

    // UPDATE
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO dto) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());

        Product updated = productRepository.save(product);
        return mapToResponseDTO(updated);
    }

    // ===============================
    // ⭐ NEW — UPDATE STOCK ONLY
    // ===============================
    public ProductResponseDTO updateStock(Long id, int qty){

        if(qty < 0)
            throw new IllegalArgumentException("Stock cannot be negative");

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        product.setStock(qty);

        Product updated = productRepository.save(product);

        return mapToResponseDTO(updated);
    }

    // DELETE
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        productRepository.delete(product);
    }

    // ===============================
    // DTO MAPPER
    // ===============================
    private ProductResponseDTO mapToResponseDTO(Product product) {

        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setImageUrl(product.getImageUrl());
        dto.setCreatedAt(product.getCreatedAt());

        return dto;
    }
}
