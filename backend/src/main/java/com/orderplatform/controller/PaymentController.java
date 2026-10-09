package com.orderplatform.controller;

import com.orderplatform.dto.PaymentResponse;
import com.orderplatform.dto.StatusUpdateRequest;
import com.orderplatform.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired private PaymentService paymentService;

    @GetMapping("/order/{orderId}")
    public PaymentResponse getPaymentByOrderId(@PathVariable Long orderId) {
        return paymentService.getPaymentByOrderId(orderId);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public PaymentResponse updatePaymentStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        return paymentService.updatePaymentStatus(id, request.status());
    }
}
