package com.orderplatform.service;

import com.orderplatform.dto.OrderItemRequest;
import com.orderplatform.dto.OrderRequest;
import com.orderplatform.dto.OrderResponse;
import com.orderplatform.entity.*;
import com.orderplatform.exception.BadRequestException;
import com.orderplatform.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private ProductRepository productRepository;
    @Mock private UserRepository userRepository;
    @Mock private PaymentRepository paymentRepository;
    @Mock private OrderTrackingRepository trackingRepository;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setRole(Role.ROLE_CUSTOMER);

        testProduct = new Product();
        testProduct.setId(10L);
        testProduct.setName("Wireless Mouse");
        testProduct.setPrice(50.0);
        testProduct.setStockQuantity(20);
        testProduct.setActive(true);
    }

    @Test
    void testPlaceOrder_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(productRepository.findById(10L)).thenReturn(Optional.of(testProduct));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(trackingRepository.save(any(OrderTracking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderRequest request = new OrderRequest(
                Collections.singletonList(new OrderItemRequest(10L, 2)),
                "123 Tech Park, Suite 4",
                "CREDIT_CARD"
        );

        OrderResponse response = orderService.placeOrder("testuser", request);

        assertNotNull(response);
        assertEquals(100.0, response.totalAmount());
        assertEquals("PLACED", response.status());
        assertEquals("testuser", response.customerName());
        assertEquals(18, testProduct.getStockQuantity()); // Stock decremented from 20 to 18
        assertEquals(1, response.items().size());
        assertEquals("Wireless Mouse", response.items().get(0).productName());
        assertEquals("CREDIT_CARD", response.payment().paymentMethod());
    }

    @Test
    void testPlaceOrder_InsufficientStock_ThrowsBadRequest() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(productRepository.findById(10L)).thenReturn(Optional.of(testProduct));

        OrderRequest request = new OrderRequest(
                Collections.singletonList(new OrderItemRequest(10L, 25)), // Requesting 25 when stock is 20
                "123 Tech Park",
                "UPI"
        );

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            orderService.placeOrder("testuser", request);
        });

        assertTrue(ex.getMessage().contains("Insufficient stock"));
        verify(orderRepository, never()).save(any());
    }
}
