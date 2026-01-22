package com.nkr.controller;

import com.nkr.dto.PaymentRequestDTO;
import com.nkr.dto.PaymentResponseDTO;
import com.nkr.service.PaymentService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    // 🔹 STEP-1 Create Razorpay Order (Frontend calls this first)
    @PostMapping("/create/{orderId}")
    public String createOrder(@PathVariable Long orderId) throws Exception {
        return paymentService.createRazorpayOrder(orderId);
    }


    // 🔹 STEP-2 Verify Payment + Save + Mark Order PAID
    @PostMapping("/{orderId}")
    public PaymentResponseDTO pay(
            @PathVariable Long orderId,
            @Valid @RequestBody PaymentRequestDTO dto) throws Exception {

        return paymentService.makePayment(orderId, dto);
    }
}
