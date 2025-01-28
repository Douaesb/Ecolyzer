package com.ecolyzer.ecolyzer_backend.service;

import com.ecolyzer.ecolyzer_backend.dto.request.DeviceRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.DeviceResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface DeviceService {

    Page<DeviceResponseDTO> getAllDevices(int page, int size);
    List<DeviceResponseDTO> getDevicesByZone(String zoneId, int page, int size);

    DeviceResponseDTO createDevice(DeviceRequestDTO dto);

    DeviceResponseDTO updateDevice(String id, DeviceRequestDTO dto);

    void deleteDevice(String id);

    Page<DeviceResponseDTO> searchDevicesByName(String name, int page, int size);

    Page<DeviceResponseDTO> filterDevicesBySerialNum(Integer serialNum, int page, int size);
}
