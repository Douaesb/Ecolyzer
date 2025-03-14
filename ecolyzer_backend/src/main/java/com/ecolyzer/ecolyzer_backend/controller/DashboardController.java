package com.ecolyzer.ecolyzer_backend.controller;

import com.ecolyzer.ecolyzer_backend.dto.embedded.EnergyDashboardDTO;
import com.ecolyzer.ecolyzer_backend.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public EnergyDashboardDTO getDashboard(@RequestParam(defaultValue = "day") String period) {
        return dashboardService.getDashboardData(period);
    }
}
