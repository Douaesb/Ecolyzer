package com.ecolyzer.ecolyzer_backend.service;

import com.ecolyzer.ecolyzer_backend.model.*;
import com.ecolyzer.ecolyzer_backend.repository.*;
import com.ecolyzer.ecolyzer_backend.service.impl.EnergyConsumptionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnergyConsumptionServiceImplTest {

    @InjectMocks
    private EnergyConsumptionServiceImpl energyConsumptionService;

    @Mock
    private EnergyConsumptionRepository repository;

    @Mock
    private CapteurRepository capteurRepository;

    @Mock
    private SensorDataRepository sensorDataRepository;

    @Mock
    private DeviceRepository deviceRepository;

    @Mock
    private EnergySummaryRepository energySummaryRepository;

    @Mock
    private ThresholdAlertRepository thresholdAlertRepository;

    @Mock
    private ZoneRepository zoneRepository;

    private Device testDevice;
    private SensorData testSensorData;
    private EnergyConsumption testConsumption;

    @BeforeEach
    void setUp() {
        testDevice = new Device("device1", "Device 1", 12345, 50.0, LocalDateTime.now(), null, null);
        testSensorData = new SensorData("sensor1", 10.0, Instant.now(), SensorType.ENERGY, false, new Capteur("capteur1", "Capteur 1", SensorType.ENERGY, testDevice));
        testConsumption = new EnergyConsumption("ec1", testDevice, 40.0, LocalDateTime.now());
    }

    @Test
    void processUnprocessedEnergyData_ShouldProcessDataCorrectly() {
        when(sensorDataRepository.findUnprocessedEnergyData()).thenReturn(List.of(testSensorData));
        when(capteurRepository.findById(any())).thenReturn(Optional.of(testSensorData.getCapteur()));
        when(repository.findByDeviceId(any())).thenReturn(Optional.of(testConsumption));
        when(repository.save(any())).thenReturn(testConsumption);

        energyConsumptionService.processUnprocessedEnergyData();

        verify(repository, times(1)).save(any(EnergyConsumption.class));
        verify(sensorDataRepository, times(1)).saveAll(any());
    }

    @Test
    void calculateDailyEnergyConsumption_ShouldReturnCorrectConsumption() {
        LocalDate date = LocalDate.now();
        when(repository.findByDeviceIdAndTimestampBetween(any(), any(), any()))
                .thenReturn(List.of(testConsumption));

        Double result = energyConsumptionService.calculateDailyEnergyConsumption("device1", date);

        assertEquals(40.0, result);
    }

    @Test
    void updateEnergyConsumption_ShouldUpdateExistingRecord() {
        when(capteurRepository.findById(any())).thenReturn(Optional.of(testSensorData.getCapteur()));
        when(repository.findByDeviceId(any())).thenReturn(Optional.of(testConsumption));
        when(repository.save(any())).thenReturn(testConsumption);

        energyConsumptionService.updateEnergyConsumption(testSensorData);

        verify(repository, times(1)).save(any(EnergyConsumption.class));
    }

    @Test
    void checkAndGenerateAlert_ShouldGenerateNewAlert_WhenThresholdExceeded() {
        Device device = new Device();
        device.setId("device123");
        device.setEnergyThreshold(100.0);

        double newConsumption = 120.0;

        when(thresholdAlertRepository.findByDeviceIdAndActive("device123", true))
                .thenReturn(Optional.empty());
        energyConsumptionService.checkAndGenerateAlert(device, newConsumption);

        ArgumentCaptor<ThresholdAlert> alertCaptor = ArgumentCaptor.forClass(ThresholdAlert.class);
        verify(thresholdAlertRepository, times(1)).save(alertCaptor.capture());

        ThresholdAlert savedAlert = alertCaptor.getValue();
        assertNotNull(savedAlert);
        assertEquals(device.getId(), savedAlert.getDevice().getId());
        assertEquals(100.0, savedAlert.getThresholdValue());
        assertTrue(savedAlert.isActive());
        assertEquals(AlertStatus.UNRESOLVED, savedAlert.getStatus());
    }


    @Test
    void getCurrentEnergyConsumption_ShouldReturnCorrectData() {
        when(repository.findByDeviceId(any())).thenReturn(Optional.of(testConsumption));

        Optional<EnergyConsumption> result = energyConsumptionService.getCurrentEnergyConsumption("device1");

        assertTrue(result.isPresent());
        assertEquals(40.0, result.get().getTotalConsumption());
    }

    @Test
    void generateDailyEnergySummary_ShouldCreateSummary() {
        when(deviceRepository.findAll()).thenReturn(List.of(testDevice));
        when(energySummaryRepository.existsByDeviceIdAndDate(any(), any())).thenReturn(false);
        when(repository.findByDeviceIdAndTimestampBetween(any(), any(), any())).thenReturn(List.of(testConsumption));
        when(thresholdAlertRepository.countByDeviceIdAndTimestampBetween(any(), any(), any())).thenReturn(2);

        energyConsumptionService.generateDailyEnergySummary();

        verify(energySummaryRepository, times(1)).save(any(EnergyConsumptionSummary.class));
    }

    @Test
    void getEnergySummaryByDeviceAndDate_ShouldReturnCorrectSummary() {
        LocalDate date = LocalDate.now();
        EnergyConsumptionSummary summary = new EnergyConsumptionSummary("summary1", testDevice, date, 100.0, 3);
        when(energySummaryRepository.findByDeviceIdAndDate(any(), any())).thenReturn(Optional.of(summary));

        Optional<EnergyConsumptionSummary> result = energyConsumptionService.getEnergySummaryByDeviceAndDate("device1", date);

        assertTrue(result.isPresent());
        assertEquals(100.0, result.get().getTotalEnergyConsumption());
        assertEquals(3, result.get().getAlertCount());
    }

    @Test
    void getAllEnergySummaries_ShouldReturnPagedResults() {
        Pageable pageable = mock(Pageable.class);
        Page<EnergyConsumptionSummary> mockPage = new PageImpl<>(List.of());
        when(energySummaryRepository.findAll(pageable)).thenReturn(mockPage);

        Page<EnergyConsumptionSummary> result = energyConsumptionService.getAllEnergySummaries(pageable);

        assertEquals(mockPage, result);
    }
}
