

package com.nkr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nkr.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}

