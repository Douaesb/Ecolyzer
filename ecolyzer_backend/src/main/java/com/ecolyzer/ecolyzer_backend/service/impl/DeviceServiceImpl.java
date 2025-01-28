package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.dto.request.DeviceRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.DeviceResponseDTO;
import com.ecolyzer.ecolyzer_backend.mapper.DeviceMapper;
import com.ecolyzer.ecolyzer_backend.model.Device;
import com.ecolyzer.ecolyzer_backend.repository.DeviceRepository;
import com.ecolyzer.ecolyzer_backend.repository.ZoneRepository;
import com.ecolyzer.ecolyzer_backend.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceServiceImpl implements DeviceService {

    private final DeviceRepository deviceRepository;
    private final ZoneRepository zoneRepository;
    private final DeviceMapper deviceMapper;

    @Autowired
    public DeviceServiceImpl(DeviceRepository deviceRepository, ZoneRepository zoneRepository, DeviceMapper deviceMapper) {
        this.deviceRepository = deviceRepository;
        this.zoneRepository = zoneRepository;
        this.deviceMapper = deviceMapper;
    }

    @Override
    public Page<DeviceResponseDTO> getAllDevices(int page, int size) {
        return deviceRepository.findAll(PageRequest.of(page, size))
                .map(deviceMapper::toResponseDTO);
    }


    @Override
    public List<DeviceResponseDTO> getDevicesByZone(String zoneId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Device> devicePage = deviceRepository.findByZoneId(zoneId, pageable);
        return devicePage.getContent().stream()
                .map(deviceMapper::toResponseDTO)
                .toList();
    }


    @Override
    public DeviceResponseDTO createDevice(DeviceRequestDTO dto) {
        Device device = deviceMapper.toDevice(dto);
        device.setZone(zoneRepository.findById(dto.getZoneId()).orElseThrow());
        Device savedDevice = deviceRepository.save(device);
        return deviceMapper.toResponseDTO(savedDevice);
    }

    @Override
    public DeviceResponseDTO updateDevice(String id, DeviceRequestDTO dto) {
        Device existingDevice = deviceRepository.findById(id).orElseThrow();
        existingDevice.setName(dto.getName());
        existingDevice.setSerialNum(dto.getSerialNum());
        existingDevice.setZone(zoneRepository.findById(dto.getZoneId()).orElseThrow());
        Device updatedDevice = deviceRepository.save(existingDevice);
        return deviceMapper.toResponseDTO(updatedDevice);
    }

    @Override
    public void deleteDevice(String id) {
        deviceRepository.deleteById(id);
    }

    @Override
    public Page<DeviceResponseDTO> searchDevicesByName(String name, int page, int size) {
        return deviceRepository.findByNameContainingIgnoreCase(name, PageRequest.of(page, size))
                .map(deviceMapper::toResponseDTO);
    }

    @Override
    public Page<DeviceResponseDTO> filterDevicesBySerialNum(Integer serialNum, int page, int size) {
        return deviceRepository.findBySerialNum(serialNum, PageRequest.of(page, size))
                .map(deviceMapper::toResponseDTO);
    }
}
