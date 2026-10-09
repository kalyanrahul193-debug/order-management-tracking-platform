package com.orderplatform.service;

import com.orderplatform.dto.TrackingResponse;
import com.orderplatform.entity.Order;
import com.orderplatform.entity.OrderTracking;
import com.orderplatform.exception.ResourceNotFoundException;
import com.orderplatform.repository.OrderRepository;
import com.orderplatform.repository.OrderTrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrackingService {
    @Autowired private OrderTrackingRepository trackingRepository;
    @Autowired private OrderRepository orderRepository;

    public List<TrackingResponse> getTrackingHistory(Long orderId) {
        return trackingRepository.findByOrderIdOrderByTimestampAsc(orderId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TrackingResponse addTrackingEntry(Long orderId, String status, String location, String description) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
                
        OrderTracking tracking = new OrderTracking();
        tracking.setOrder(order);
        tracking.setStatus(status);
        tracking.setLocation(location);
        tracking.setDescription(description);
        tracking.setTimestamp(LocalDateTime.now());
        
        return mapToResponse(trackingRepository.save(tracking));
    }

    private TrackingResponse mapToResponse(OrderTracking t) {
        return new TrackingResponse(t.getId(), t.getStatus(), t.getLocation(), t.getDescription(), t.getTimestamp());
    }
}
