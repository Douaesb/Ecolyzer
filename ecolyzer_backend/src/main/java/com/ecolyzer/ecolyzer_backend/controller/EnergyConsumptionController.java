package com.ecolyzer.ecolyzer_backend.controller;

import com.ecolyzer.ecolyzer_backend.model.EnergyConsumption;
import com.ecolyzer.ecolyzer_backend.model.EnergyConsumptionSummary;
import com.ecolyzer.ecolyzer_backend.service.EnergyConsumptionService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/energy")
public class EnergyConsumptionController {

    private final EnergyConsumptionService energyConsumptionService;

    public EnergyConsumptionController(EnergyConsumptionService energyConsumptionService) {
        this.energyConsumptionService = energyConsumptionService;
    }

    @GetMapping({"/user/device/{deviceId}/current", "/admin/device/{deviceId}/current"})
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EnergyConsumption> getCurrentEnergyConsumption(@PathVariable String deviceId) {
        Optional<EnergyConsumption> consumption = energyConsumptionService.getCurrentEnergyConsumption(deviceId);
        return consumption.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping({"/user/device/{deviceId}/summary", "/admin/device/{deviceId}/summary"})
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EnergyConsumptionSummary> getDailyEnergySummary(
            @PathVariable String deviceId,
            @RequestParam(required = false) LocalDate date) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now().minusDays(1);
        Optional<EnergyConsumptionSummary> summary = energyConsumptionService.getEnergySummaryByDeviceAndDate(deviceId, queryDate);
        return summary.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/summary/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EnergyConsumptionSummary>> getAllEnergySummaries() {
        return ResponseEntity.ok(energyConsumptionService.getAllEnergySummaries());
    }


    @GetMapping("/admin/zone/{zoneName}/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnergyConsumptionSummary> getZoneEnergySummary(
            @PathVariable String zoneName,
            @RequestParam(required = false) LocalDate date,
            @PageableDefault(size = 10) Pageable pageable) {

        LocalDate queryDate = (date != null) ? date : LocalDate.now().minusDays(1);

        Optional<EnergyConsumptionSummary> summary = energyConsumptionService.getEnergySummaryByZone(zoneName, queryDate, pageable);

        return summary.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
