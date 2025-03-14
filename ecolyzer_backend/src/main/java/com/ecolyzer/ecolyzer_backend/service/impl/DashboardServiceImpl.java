package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.dto.embedded.DeviceEmbeddedDTO;
import com.ecolyzer.ecolyzer_backend.dto.embedded.EnergyDashboardDTO;
import com.ecolyzer.ecolyzer_backend.dto.embedded.EnergyConsumptionSummaryDTO;
import com.ecolyzer.ecolyzer_backend.dto.embedded.ThresholdAlertEmbeddedDTO;
import com.ecolyzer.ecolyzer_backend.model.AlertStatus;
import com.ecolyzer.ecolyzer_backend.model.Device;
import com.ecolyzer.ecolyzer_backend.model.EnergyConsumption;
import com.ecolyzer.ecolyzer_backend.model.ThresholdAlert;
import com.ecolyzer.ecolyzer_backend.repository.DeviceRepository;
import com.ecolyzer.ecolyzer_backend.repository.EnergyConsumptionRepository;
import com.ecolyzer.ecolyzer_backend.repository.ThresholdAlertRepository;
import com.ecolyzer.ecolyzer_backend.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardServiceImpl.class);

    private final EnergyConsumptionRepository energyRepo;
    private final ThresholdAlertRepository alertRepo;
    private final DeviceRepository deviceRepository;

    public DashboardServiceImpl(EnergyConsumptionRepository energyRepo, ThresholdAlertRepository alertRepo, DeviceRepository deviceRepository) {
        this.energyRepo = energyRepo;
        this.alertRepo = alertRepo;
        this.deviceRepository = deviceRepository;
    }

    @Override
    public EnergyDashboardDTO getDashboardData(String period) {
        LocalDateTime startDate = getStartDateFromPeriod(period);
        log.debug("Getting dashboard data for period: {} (start date: {})", period, startDate);

        // Get total consumption and estimated cost
        double totalConsumption = Optional.ofNullable(energyRepo.getTotalConsumption(startDate)).orElse(0.0);
        double estimatedCost = totalConsumption * 0.15;
        double empreinteC02 = totalConsumption * 0.7;

        log.debug("Total consumption: {}, Estimated cost: {}, EmpreinteC02: {}", totalConsumption, estimatedCost, empreinteC02);

        long activeAlerts = alertRepo.countByStatus(AlertStatus.valueOf("UNRESOLVED"));
        log.debug("Active alerts: {}", activeAlerts);

        List<EnergyConsumption> energyConsumptions = energyRepo.findByTimestampAfter(startDate);
        List<EnergyConsumptionSummaryDTO> consumptionSummaries = energyConsumptions.stream()
                .filter(ec -> ec.getDevice() != null)
                .map(consumption -> new EnergyConsumptionSummaryDTO(
                        consumption.getDevice().getId(),                   // Device ID
                        consumption.getDevice().getName(),                 // Device name
                        consumption.getTimestamp().toLocalDate(),          // Date of the consumption
                        consumption.getTotalConsumption(),                 // Total consumption (kWh)
                        getAlertCountForDevice(consumption.getDevice())    // Alert count for the device
                ))
                .collect(Collectors.toList());
        log.debug("Found {} consumption summaries", consumptionSummaries.size());

        // Get threshold alerts and map to DTOs
        List<ThresholdAlert> thresholdAlerts = alertRepo.findByTimestampAfter(startDate);
        log.debug("Found {} threshold alerts for period", thresholdAlerts.size());

        List<ThresholdAlertEmbeddedDTO> thresholdAlertsDTO = thresholdAlerts.stream()
                .map(alert -> new ThresholdAlertEmbeddedDTO(
                        alert.getThresholdValue(),     // Threshold value
                        alert.getAlertMessage(),       // Alert message
                        alert.isActive(),              // Whether the alert is active
                        alert.getStatus(),
                        alert.getDevice().getName()
                ))
                .collect(Collectors.toList());

        // Get devices and correctly map to DTOs
        List<Device> deviceEntities = deviceRepository.findByLastUpdatedAfter(startDate);
        log.debug("Found {} devices updated after {}", deviceEntities.size(), startDate);

        List<DeviceEmbeddedDTO> devices = deviceEntities.stream()
                .map(device -> new DeviceEmbeddedDTO(
                        device.getId(),
                        device.getName(),
                        device.getSerialNum(),
                        device.getEnergyThreshold(),
                        device.getLastUpdated()
                ))
                .collect(Collectors.toList());

        EnergyDashboardDTO dashboardDTO = new EnergyDashboardDTO(
                totalConsumption,
                estimatedCost,
                activeAlerts,
                empreinteC02,
                consumptionSummaries,
                thresholdAlertsDTO,
                devices
        );

        log.debug("Dashboard DTO created with {} consumption summaries, {} threshold alerts, and {} devices",
                dashboardDTO.getConsumptionSummaries().size(),
                dashboardDTO.getThresholdAlerts().size(),
                dashboardDTO.getDevices().size());

        return dashboardDTO;
    }

    private int getAlertCountForDevice(Device device) {
        return alertRepo.countByDeviceAndStatus(device, "UNRESOLVED");
    }

    private LocalDateTime getStartDateFromPeriod(String period) {
        return switch (period) {
            case "week" -> LocalDateTime.now().minusDays(7);
            case "month" -> LocalDateTime.now().minusDays(30);
            default -> LocalDateTime.now().minusDays(1);
        };
    }
}