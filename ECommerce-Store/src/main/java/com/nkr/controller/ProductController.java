package com.nkr.controller;

import java.io.File;

import java.nio.file.Files;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.nkr.dto.ProductRequestDTO;
import com.nkr.dto.ProductResponseDTO;
import com.nkr.entity.Product;
import com.nkr.repository.ProductRepository;
import com.nkr.service.ProductService;

import io.swagger.v3.oas.models.Paths;
import jakarta.persistence.criteria.Path;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    // CREATE PRODUCT
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponseDTO addProduct(@Valid @RequestBody ProductRequestDTO dto) {
        return productService.addProduct(dto);
    }

    // 👉 PAGINATED PRODUCTS (ADMIN USE)
    // example:  /api/products?page=0&size=8
    @GetMapping(params = { "page", "size" })
    public Page<ProductResponseDTO> getProductsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return productService.getProductsPaged(pageable);
    }

    // EXISTING — GET ALL (unchanged)
    @GetMapping
    public java.util.List<ProductResponseDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ProductResponseDTO getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // UPDATE FULL PRODUCT
    @PutMapping("/{id}")
    public ProductResponseDTO updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDTO dto) {

        return productService.updateProduct(id, dto);
    }

    // 👉 UPDATE STOCK ONLY
    @PutMapping("/{id}/stock/{qty}")
    public ProductResponseDTO updateStock(
            @PathVariable Long id,
            @PathVariable int qty) {

        return productService.updateStock(id, qty);
    }

    // DELETE PRODUCT
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
    
    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/upload")
    public Product uploadProduct(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam double price,
            @RequestParam int stock,
            @RequestParam("image") MultipartFile image
    ) throws Exception {

        String folder = "src/main/resources/static/images/";

        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

        java.nio.file.Path path = java.nio.file.Paths.get(folder + fileName);

        java.nio.file.Files.write(path, image.getBytes());

        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setPrice(price);
        p.setStock(stock);
         // store full accessible path
         p.setImageUrl("/images/" + fileName);

        return productRepository.save(p);
    }



}
