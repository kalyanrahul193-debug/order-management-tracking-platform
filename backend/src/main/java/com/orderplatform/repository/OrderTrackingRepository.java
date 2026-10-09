package com.orderplatform.repository;

import com.orderplatform.entity.OrderTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderTrackingRepository extends JpaRepository<OrderTracking, Long> {
    List<OrderTracking> findByOrderIdOrderByTimestampAsc(Long orderId);
}
