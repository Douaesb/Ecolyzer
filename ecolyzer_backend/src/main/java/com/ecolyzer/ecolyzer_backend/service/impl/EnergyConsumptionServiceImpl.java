package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.model.*;
import com.ecolyzer.ecolyzer_backend.repository.*;
import com.ecolyzer.ecolyzer_backend.service.EnergyConsumptionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class EnergyConsumptionServiceImpl implements EnergyConsumptionService {
    private final EnergyConsumptionRepository repository;
    private final CapteurRepository capteurRepository;
    private final SensorDataRepository sensorDataRepository;
    private final DeviceRepository deviceRepository;
    private final EnergySummaryRepository energySummaryRepository;

    public EnergyConsumptionServiceImpl(EnergyConsumptionRepository repository,
                                        CapteurRepository capteurRepository,
                                        SensorDataRepository sensorDataRepository,
                                        DeviceRepository deviceRepository,
                                        EnergySummaryRepository energySummaryRepository) {
        this.repository = repository;
        this.capteurRepository = capteurRepository;
        this.sensorDataRepository = sensorDataRepository;
        this.deviceRepository = deviceRepository;
        this.energySummaryRepository = energySummaryRepository;
    }


    @Scheduled(fixedRate = 60000) // Runs every 60 seconds
    @Transactional
    public void processUnprocessedEnergyData() {
        log.info("⏳ Processing unprocessed energy sensor data...");

        List<SensorData> unprocessedData = sensorDataRepository.findUnprocessedEnergyData();

        if (unprocessedData.isEmpty()) {
            log.info("✅ No new energy data to process.");
            return;
        }
        unprocessedData.forEach(this::updateEnergyConsumption);

        unprocessedData.forEach(sensorData -> sensorData.setProcessed(true));
        sensorDataRepository.saveAll(unprocessedData);

        log.info("✅ Processed {} energy data entries.", unprocessedData.size());
    }

    public Double calculateDailyEnergyConsumption(String deviceId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusHours(24);

        List<SensorData> energyReadings = sensorDataRepository.findEnergyDataForDeviceBetween(deviceId, startOfDay, endOfDay);

        return energyReadings.stream()
                .mapToDouble(SensorData::getValue)
                .sum();
    }

    public void updateEnergyConsumption(SensorData sensorData) {
        if (!"energy".equalsIgnoreCase(sensorData.getType().name())) return;

        Capteur capteur = capteurRepository.findById(sensorData.getCapteur().getId()).orElse(null);

        if (capteur == null) {
            log.warn("⚠ Capteur not found for SensorData: {}", sensorData.getId());
            return;
        }

        if (capteur.getDevice() == null) {
            log.warn("⚠ No device associated with Capteur: {}", capteur.getId());
            return;
        }
        Device device = capteur.getDevice();
        EnergyConsumption consumption = repository.findByDeviceId(device.getId())
                .orElseGet(() -> {
                    log.info("Creating new EnergyConsumption record for Device: {}", device.getId());
                    return new EnergyConsumption(null, device, 0.0, LocalDateTime.now());
                });
        consumption.addConsumption(sensorData.getValue());
        repository.save(consumption);
        log.info("✅ Updated Energy Consumption for Device: {}, New Total: {} kWh",
                device.getId(), consumption.getTotalConsumption());
    }

    @Scheduled(cron = "0 0 0 * * ?") // Runs every midnight
    public void generateDailyEnergySummary() {
        log.info("📊 Running daily energy consumption summary task...");

        List<Device> devices = deviceRepository.findAll();

        for (Device device : devices) {
            double dailyConsumption = calculateDailyEnergyConsumption(device.getId(), LocalDate.now().minusDays(1));

            EnergyConsumptionSummary summary = new EnergyConsumptionSummary();
            summary.setDevice(device);
            summary.setDate(LocalDate.now().minusDays(1));
            summary.setTotalEnergyConsumption(dailyConsumption);

            energySummaryRepository.save(summary);
            log.info("✅ Saved daily energy summary for Device: {}, Total: {} kWh", device.getId(), dailyConsumption);
        }
    }

}
