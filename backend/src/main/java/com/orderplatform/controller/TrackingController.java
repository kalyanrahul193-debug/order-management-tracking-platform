package com.orderplatform.controller;

import com.orderplatform.dto.TrackingResponse;
import com.orderplatform.service.TrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {
    @Autowired private TrackingService trackingService;

    @GetMapping("/order/{orderId}")
    public List<TrackingResponse> getTrackingHistory(@PathVariable Long orderId) {
        return trackingService.getTrackingHistory(orderId);
    }
}
