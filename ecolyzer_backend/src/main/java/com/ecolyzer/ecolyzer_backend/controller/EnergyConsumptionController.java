package com.ecolyzer.ecolyzer_backend.controller;

import com.ecolyzer.ecolyzer_backend.model.EnergyConsumption;
import com.ecolyzer.ecolyzer_backend.model.EnergyConsumptionSummary;
import com.ecolyzer.ecolyzer_backend.service.EnergyConsumptionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
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

        log.info("Fetching daily energy summary for Device ID: {} on Date: {}", deviceId, queryDate);

        Optional<EnergyConsumptionSummary> summary = energyConsumptionService.getEnergySummaryByDeviceAndDate(deviceId, queryDate);

        if (summary.isPresent()) {
            log.info("Summary found: {}", summary.get());
            return ResponseEntity.ok(summary.get());
        } else {
            log.warn("No energy summary found for Device ID: {} on Date: {}", deviceId, queryDate);
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping({"/admin/summary/all","/user/summary/all", })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<EnergyConsumptionSummary>> getAllEnergySummaries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<EnergyConsumptionSummary> summaries = energyConsumptionService.getAllEnergySummaries(pageable);

        return ResponseEntity.ok(summaries);
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


    @PostMapping("/generate-summary")
    public ResponseEntity<String> generateSummary() {
        energyConsumptionService.generateDailyEnergySummary();
        return ResponseEntity.ok("Daily energy summary generation triggered manually.");
    }
}
