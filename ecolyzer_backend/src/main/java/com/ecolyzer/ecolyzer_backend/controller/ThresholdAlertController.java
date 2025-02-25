package com.ecolyzer.ecolyzer_backend.controller;

import com.ecolyzer.ecolyzer_backend.dto.response.ThresholdAlertResponseDTO;
import com.ecolyzer.ecolyzer_backend.model.AlertStatus;
import com.ecolyzer.ecolyzer_backend.service.ThresholdAlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ThresholdAlertController {

    private final ThresholdAlertService thresholdAlertService;

    public ThresholdAlertController(ThresholdAlertService thresholdAlertService) {
        this.thresholdAlertService = thresholdAlertService;
    }

    @GetMapping({"/user/threshold-alerts/device/{deviceId}", "/admin/threshold-alerts/device/{deviceId}"})
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ThresholdAlertResponseDTO>> getThresholdAlertsByDevice(@PathVariable String deviceId) {
        return ResponseEntity.ok(thresholdAlertService.getThresholdAlertsByDevice(deviceId));
    }

    @PutMapping("/alerts/{alertId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ThresholdAlertResponseDTO> updateThresholdAlertStatus(
            @PathVariable String alertId,
            @RequestParam AlertStatus status) {
        return ResponseEntity.ok(thresholdAlertService.updateThresholdAlertStatus(alertId, status));
    }


    @DeleteMapping("/admin/threshold-alerts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteThresholdAlert(@PathVariable String id) {
        thresholdAlertService.deleteThresholdAlert(id);
        return ResponseEntity.noContent().build();
    }
}
