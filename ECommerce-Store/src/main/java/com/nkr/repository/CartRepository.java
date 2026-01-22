package com.nkr.repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import com.nkr.entity.Cart;

public interface CartRepository extends CrudRepository<Cart, Integer> {

    List<Cart> findByUserId(int userId);
}
