package com.orderplatform.service;

import com.orderplatform.dto.OrderItemRequest;
import com.orderplatform.dto.OrderItemResponse;
import com.orderplatform.dto.OrderRequest;
import com.orderplatform.dto.OrderResponse;
import com.orderplatform.dto.PaymentResponse;
import com.orderplatform.dto.TrackingResponse;
import com.orderplatform.entity.Order;
import com.orderplatform.entity.OrderItem;
import com.orderplatform.entity.OrderStatus;
import com.orderplatform.entity.OrderTracking;
import com.orderplatform.entity.Payment;
import com.orderplatform.entity.PaymentMethod;
import com.orderplatform.entity.PaymentStatus;
import com.orderplatform.entity.Product;
import com.orderplatform.entity.Role;
import com.orderplatform.entity.User;
import com.orderplatform.exception.BadRequestException;
import com.orderplatform.exception.ResourceNotFoundException;
import com.orderplatform.repository.OrderRepository;
import com.orderplatform.repository.OrderTrackingRepository;
import com.orderplatform.repository.PaymentRepository;
import com.orderplatform.repository.ProductRepository;
import com.orderplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {
    
    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private OrderTrackingRepository trackingRepository;

    public OrderResponse placeOrder(String username, OrderRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setStatus(OrderStatus.PLACED);
        order.setShippingAddress(request.shippingAddress());
        order.setOrderDate(LocalDateTime.now());
        
        List<OrderItem> items = new ArrayList<>();
        double totalAmount = 0.0;
        
        for (OrderItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            
            if (product.getStockQuantity() < itemReq.quantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - itemReq.quantity());
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.quantity());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setSubtotal(product.getPrice() * itemReq.quantity());
            items.add(orderItem);
            
            totalAmount += orderItem.getSubtotal();
        }
        
        order.setOrderItems(items);
        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);
        
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(PaymentMethod.valueOf(request.paymentMethod()));
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setAmount(totalAmount);
        payment.setTransactionId("TXN-" + System.currentTimeMillis());
        payment.setPaymentDate(LocalDateTime.now());
        payment = paymentRepository.save(payment);
        order.setPayment(payment);
        
        OrderTracking tracking = new OrderTracking();
        tracking.setOrder(order);
        tracking.setStatus("PLACED");
        tracking.setLocation("System");
        tracking.setDescription("Order has been placed successfully");
        tracking.setTimestamp(LocalDateTime.now());
        tracking = trackingRepository.save(tracking);
        
        order.setTrackingHistory(new ArrayList<>(List.of(tracking)));
        return mapToOrderResponse(order);
    }

    public List<OrderResponse> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId())
                .stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id, String username) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        if (user.getRole() != Role.ROLE_ADMIN && !order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Not authorized to view this order");
        }
        return mapToOrderResponse(order);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc()
                .stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    public OrderResponse updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(OrderStatus.valueOf(newStatus));
        order = orderRepository.save(order);
        
        OrderTracking tracking = new OrderTracking();
        tracking.setOrder(order);
        tracking.setStatus(newStatus);
        tracking.setLocation("Warehouse"); 
        tracking.setDescription("Order status updated to " + newStatus);
        tracking.setTimestamp(LocalDateTime.now());
        trackingRepository.save(tracking);
        
        if (order.getTrackingHistory() == null) {
            order.setTrackingHistory(new ArrayList<>());
        }
        order.getTrackingHistory().add(tracking);
        return mapToOrderResponse(order);
    }

    private OrderResponse mapToOrderResponse(Order o) {
        List<OrderItemResponse> items = o.getOrderItems() != null ? 
            o.getOrderItems().stream().map(this::mapToOrderItemResponse).collect(Collectors.toList()) : new ArrayList<>();
        PaymentResponse payment = o.getPayment() != null ? mapToPaymentResponse(o.getPayment()) : null;
        List<TrackingResponse> tracking = o.getTrackingHistory() != null ? 
            o.getTrackingHistory().stream().map(this::mapToTrackingResponse).collect(Collectors.toList()) : new ArrayList<>();
            
        return new OrderResponse(o.getId(), o.getOrderNumber(), o.getStatus().name(), o.getTotalAmount(),
                o.getShippingAddress(), o.getOrderDate(), o.getUser().getUsername(), items, payment, tracking);
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem i) {
        return new OrderItemResponse(i.getId(), i.getProduct().getName(), i.getQuantity(), i.getUnitPrice(), i.getSubtotal());
    }

    private PaymentResponse mapToPaymentResponse(Payment p) {
        return new PaymentResponse(p.getId(), p.getPaymentMethod().name(), p.getPaymentStatus().name(), p.getAmount(), p.getTransactionId(), p.getPaymentDate());
    }

    private TrackingResponse mapToTrackingResponse(OrderTracking t) {
        return new TrackingResponse(t.getId(), t.getStatus(), t.getLocation(), t.getDescription(), t.getTimestamp());
    }
}
