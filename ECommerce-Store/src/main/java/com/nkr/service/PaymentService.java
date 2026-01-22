package com.nkr.service;

import com.nkr.dto.PaymentRequestDTO;
import com.nkr.dto.PaymentResponseDTO;
import com.nkr.entity.Order;
import com.nkr.entity.Payment;
import com.nkr.repository.OrderRepository;
import com.nkr.repository.PaymentRepository;

import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;


    // 🔹 STEP-1 Create Razorpay Order
    public String createRazorpayOrder(Long orderId) throws Exception {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject req = new JSONObject();
        req.put("amount", order.getTotalAmount() * 100);  // paise
        req.put("currency", "INR");
        req.put("receipt", "order_" + order.getId());

        return client.orders.create(req).toString();
    }


    // 🔹 STEP-2 Verify Payment + Save Payment
    public PaymentResponseDTO makePayment(Long orderId, PaymentRequestDTO dto) throws Exception {

        // verify signature
        JSONObject sig = new JSONObject();
        sig.put("razorpay_order_id", dto.getRazorpayOrderId());
        sig.put("razorpay_payment_id", dto.getPaymentId());
        sig.put("razorpay_signature", dto.getSignature());

        boolean valid = Utils.verifyPaymentSignature(sig, keySecret);

        if (!valid) {
            throw new RuntimeException("⚠ Payment Signature Invalid");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // save payment
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setStatus("SUCCESS");

        order.setStatus("PAID");
        orderRepository.save(order);

        Payment saved = paymentRepository.save(payment);

        // response dto
        PaymentResponseDTO res = new PaymentResponseDTO();
        res.setPaymentId((long) saved.getId());
        res.setOrderId(order.getId());
        res.setAmount(saved.getAmount());
        res.setStatus(saved.getStatus());
        res.setPaymentMethod(saved.getPaymentMethod());

        return res;
    }
}
