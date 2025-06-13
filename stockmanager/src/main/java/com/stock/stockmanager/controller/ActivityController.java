package com.stock.stockmanager.controller;

import com.stock.stockmanager.dto.RecentActivityDTO;
import com.stock.stockmanager.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @GetMapping("/dashboard/allActivities")
    public ResponseEntity<List<RecentActivityDTO>> getAllActivities() {
        List<RecentActivityDTO> activities = activityService.getAllRecentActivities();
        return ResponseEntity.ok(activities);
    }
}
