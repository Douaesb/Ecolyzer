package com.ecolyzer.ecolyzer_backend.mapper;

import com.ecolyzer.ecolyzer_backend.model.Device;
import com.ecolyzer.ecolyzer_backend.repository.DeviceRepository;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
public class CapteurMapperHelper {

    private final DeviceRepository deviceRepository;

    public CapteurMapperHelper(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Named("mapDeviceIdToDevice")
    public Device mapDeviceIdToDevice(String deviceId) {
        return deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("❌ Device not found with ID: " + deviceId));
    }
}