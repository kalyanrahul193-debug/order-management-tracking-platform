package com.orderplatform.controller;

import com.orderplatform.dto.OrderRequest;
import com.orderplatform.dto.OrderResponse;
import com.orderplatform.dto.StatusUpdateRequest;
import com.orderplatform.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired private OrderService orderService;

    @PostMapping
    public OrderResponse placeOrder(Authentication auth, @Valid @RequestBody OrderRequest request) {
        return orderService.placeOrder(auth.getName(), request);
    }

    @GetMapping
    public List<OrderResponse> getOrders(Authentication auth) {
        if (auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            return orderService.getAllOrders();
        }
        return orderService.getUserOrders(auth.getName());
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable Long id, Authentication auth) {
        return orderService.getOrderById(id, auth.getName());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public OrderResponse updateOrderStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        return orderService.updateOrderStatus(id, request.status());
    }
}
