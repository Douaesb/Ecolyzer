package com.ecolyzer.ecolyzer_backend.service;

import com.ecolyzer.ecolyzer_backend.dto.embedded.EnergyDashboardDTO;

public interface DashboardService {
    EnergyDashboardDTO getDashboardData(String period);

}
