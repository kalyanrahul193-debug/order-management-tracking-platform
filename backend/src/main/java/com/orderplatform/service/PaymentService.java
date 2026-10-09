package com.orderplatform.service;

import com.orderplatform.dto.PaymentResponse;
import com.orderplatform.entity.Payment;
import com.orderplatform.entity.PaymentStatus;
import com.orderplatform.exception.ResourceNotFoundException;
import com.orderplatform.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    @Autowired private PaymentRepository paymentRepository;

    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order"));
        return mapToResponse(payment);
    }

    public PaymentResponse updatePaymentStatus(Long paymentId, String status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        payment.setPaymentStatus(PaymentStatus.valueOf(status));
        return mapToResponse(paymentRepository.save(payment));
    }

    private PaymentResponse mapToResponse(Payment p) {
        return new PaymentResponse(p.getId(), p.getPaymentMethod().name(), p.getPaymentStatus().name(), 
                p.getAmount(), p.getTransactionId(), p.getPaymentDate());
    }
}
