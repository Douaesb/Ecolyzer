package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.model.*;
import com.ecolyzer.ecolyzer_backend.repository.*;
import com.ecolyzer.ecolyzer_backend.service.EnergyConsumptionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class EnergyConsumptionServiceImpl implements EnergyConsumptionService {
    private final EnergyConsumptionRepository repository;
    private final CapteurRepository capteurRepository;
    private final SensorDataRepository sensorDataRepository;
    private final DeviceRepository deviceRepository;
    private final EnergySummaryRepository energySummaryRepository;
    private final ThresholdAlertRepository thresholdAlertRepository;
    private final ZoneRepository zoneRepository;


    public EnergyConsumptionServiceImpl(EnergyConsumptionRepository repository, CapteurRepository capteurRepository, SensorDataRepository sensorDataRepository, DeviceRepository deviceRepository, EnergySummaryRepository energySummaryRepository, ThresholdAlertRepository thresholdAlertRepository, ZoneRepository zoneRepository) {
        this.repository = repository;
        this.capteurRepository = capteurRepository;
        this.sensorDataRepository = sensorDataRepository;
        this.deviceRepository = deviceRepository;
        this.energySummaryRepository = energySummaryRepository;
        this.thresholdAlertRepository = thresholdAlertRepository;
        this.zoneRepository = zoneRepository;
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

        if (capteur == null || capteur.getDevice() == null) {
            log.warn("⚠ Capteur or Device not found for SensorData: {}", sensorData.getId());
            return;
        }
        Device device = capteur.getDevice();
        EnergyConsumption consumption = repository.findByDeviceId(device.getId())
                .orElseGet(() -> new EnergyConsumption(null, device, 0.0, LocalDateTime.now()));

        double newConsumption = consumption.getTotalConsumption() + sensorData.getValue();
        consumption.setTotalConsumption(newConsumption);
        repository.save(consumption);

        log.info("✅ Updated Energy Consumption for Device: {}, New Total: {} kWh", device.getId(), newConsumption);

        checkAndGenerateAlert(device, newConsumption);
    }

    private void checkAndGenerateAlert(Device device, double newConsumption) {
        Optional<ThresholdAlert> existingAlert = thresholdAlertRepository.findByDeviceIdAndActive(device.getId(), true);

        if (device.getEnergyThreshold() != null && newConsumption >= device.getEnergyThreshold()) {
            if (existingAlert.isEmpty()) {
                ThresholdAlert alert = new ThresholdAlert();
                alert.setDevice(device);
                alert.setThresholdValue(device.getEnergyThreshold());
                alert.setAlertMessage("⚠ Energy consumption exceeded the threshold!");
                alert.setActive(true);
                alert.setStatus(AlertStatus.UNRESOLVED);
                alert.setTimestamp(LocalDateTime.now());

                thresholdAlertRepository.save(alert);
                log.warn("🚨 Alert generated for Device: {}, Threshold: {} kWh, Current: {} kWh",
                        device.getId(), device.getEnergyThreshold(), newConsumption);
            }
        } else {
            existingAlert.ifPresent(alert -> {
                if (alert.getStatus() == AlertStatus.UNRESOLVED || alert.getStatus() == AlertStatus.RESOLVING) {
                    alert.setStatus(AlertStatus.RESOLVED);
                    alert.setActive(false);
                    thresholdAlertRepository.save(alert);
                    log.info("✅ Alert resolved for Device: {}", device.getId());
                }
            });
        }
    }

    @Scheduled(cron = "0 0 0 * * ?") // Runs every midnight
    public void generateDailyEnergySummary() {
        log.info("📊 Running daily energy consumption summary task...");

        List<Device> devices = deviceRepository.findAll();

        for (Device device : devices) {
            double dailyConsumption = calculateDailyEnergyConsumption(device.getId(), LocalDate.now().minusDays(1));

            int alertCount = thresholdAlertRepository.countByDeviceIdAndTimestampBetween(
                    device.getId(),
                    LocalDate.now().minusDays(1).atStartOfDay(),
                    LocalDate.now().atStartOfDay()
            );

            EnergyConsumptionSummary summary = new EnergyConsumptionSummary();
            summary.setDevice(device);
            summary.setDate(LocalDate.now().minusDays(1));
            summary.setTotalEnergyConsumption(dailyConsumption);
            summary.setAlertCount(alertCount);

            energySummaryRepository.save(summary);
            log.info("✅ Saved daily energy summary for Device: {}, Total: {} kWh, Alerts: {}",
                    device.getId(), dailyConsumption, alertCount);
        }
    }

    public Optional<EnergyConsumption> getCurrentEnergyConsumption(String deviceId) {
        return repository.findByDeviceId(deviceId);
    }

    public Optional<EnergyConsumptionSummary> getEnergySummaryByDeviceAndDate(String deviceId, LocalDate date) {
        return energySummaryRepository.findByDeviceIdAndDate(deviceId, date);
    }

    public List<EnergyConsumptionSummary> getAllEnergySummaries() {
        return energySummaryRepository.findAll();
    }

    public Optional<EnergyConsumptionSummary> getEnergySummaryByZone(String zoneName, LocalDate date, Pageable pageable) {

        Optional<Zone> zone = zoneRepository.findByName(zoneName);
        if (zone.isEmpty()) {
            return Optional.empty();
        }
        String zoneId = zone.get().getId();

        Page<Device> devicesPage = deviceRepository.findByZoneId(zoneId, pageable);
        List<Device> devicesInZone = devicesPage.getContent();

        if (devicesInZone.isEmpty()) {
            return Optional.empty();
        }

        List<EnergyConsumptionSummary> summaries = energySummaryRepository.findByDeviceInAndDate(devicesInZone, date);

        double totalConsumption = summaries.stream().mapToDouble(EnergyConsumptionSummary::getTotalEnergyConsumption).sum();
        int totalAlerts = summaries.stream().mapToInt(EnergyConsumptionSummary::getAlertCount).sum();

        EnergyConsumptionSummary zoneSummary = EnergyConsumptionSummary.builder()
                .date(date)
                .totalEnergyConsumption(totalConsumption)
                .alertCount(totalAlerts)
                .build();

        return Optional.of(zoneSummary);
    }

}
