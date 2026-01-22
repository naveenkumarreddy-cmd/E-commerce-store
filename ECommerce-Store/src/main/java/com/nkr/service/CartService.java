package com.nkr.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nkr.entity.Cart;
import com.nkr.repository.CartRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    // Add to cart
    public Cart addToCart(Cart cart) {
        return cartRepository.save(cart);
    }

    // Get cart items by user
    public List<Cart> getUserCart(int userId) {
        return cartRepository.findByUserId(userId);
    }

}
