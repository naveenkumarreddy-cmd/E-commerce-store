package com.nkr.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.nkr.entity.Cart;
import com.nkr.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    @Autowired
    private CartService cartService;

    // Add to cart
    @PostMapping
    public Cart addToCart(@RequestBody Cart cart) {
        return cartService.addToCart(cart);
    }

    // Get cart by user
    @GetMapping("/{userId}")
    public List<Cart> getUserCart(@PathVariable int userId) {
        return cartService.getUserCart(userId);
    }
}
