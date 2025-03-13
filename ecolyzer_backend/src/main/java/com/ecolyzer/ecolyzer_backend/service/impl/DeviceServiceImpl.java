package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.dto.request.DeviceRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.DeviceResponseDTO;
import com.ecolyzer.ecolyzer_backend.mapper.DeviceMapper;
import com.ecolyzer.ecolyzer_backend.model.Capteur;
import com.ecolyzer.ecolyzer_backend.model.Device;
import com.ecolyzer.ecolyzer_backend.model.SensorType;
import com.ecolyzer.ecolyzer_backend.repository.CapteurRepository;
import com.ecolyzer.ecolyzer_backend.repository.DeviceRepository;
import com.ecolyzer.ecolyzer_backend.repository.ZoneRepository;
import com.ecolyzer.ecolyzer_backend.service.DeviceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class DeviceServiceImpl implements DeviceService {

    private final DeviceRepository deviceRepository;
    private final ZoneRepository zoneRepository;
    private final DeviceMapper deviceMapper;

    private final CapteurRepository capteurRepository;

    @Autowired
    public DeviceServiceImpl(DeviceRepository deviceRepository, ZoneRepository zoneRepository, DeviceMapper deviceMapper, CapteurRepository capteurRepository) {
        this.deviceRepository = deviceRepository;
        this.zoneRepository = zoneRepository;
        this.deviceMapper = deviceMapper;
        this.capteurRepository = capteurRepository;
    }

    @Override
    public Page<DeviceResponseDTO> getAllDevices(int page, int size) {
        return deviceRepository.findAll(PageRequest.of(page, size))
                .map(deviceMapper::toResponseDTO);
    }


    @Override
    public Page<DeviceResponseDTO> getDevicesByZone(String zoneId, int page, int size) {
        return deviceRepository.findByZoneId(zoneId, PageRequest.of(page, size))
                .map(deviceMapper::toResponseDTO);

    }

    @Override
    @Transactional
    public DeviceResponseDTO createDevice(DeviceRequestDTO dto) {
        Device device = deviceMapper.toDevice(dto);
        device.setZone(zoneRepository.findById(dto.getZoneId()).orElseThrow());
        device.setEnergyThreshold(dto.getEnergyThreshold());
        device.setLastUpdated(LocalDateTime.now());
        Device savedDevice = deviceRepository.save(device);
        List<Capteur> capteurs = List.of(
                new Capteur(null, "Capteur de Température", SensorType.TEMPERATURE, savedDevice),
                new Capteur(null, "Capteur d'Énergie", SensorType.ENERGY, savedDevice),
                new Capteur(null, "Capteur d'Humidité", SensorType.HUMIDITY, savedDevice)
        );
        List<Capteur> savedCapteurs = capteurRepository.saveAll(capteurs);

        savedDevice.setCapteurs(savedCapteurs);
        deviceRepository.save(savedDevice);

        log.info("✅ New device '{}' created with energyThreshold {} and default sensors.",
                savedDevice.getName(), savedDevice.getEnergyThreshold());

        Device updatedDevice = deviceRepository.findById(savedDevice.getId()).orElseThrow();

        return deviceMapper.toResponseDTO(updatedDevice);
    }

    @Override
    public DeviceResponseDTO updateDevice(String id, DeviceRequestDTO dto) {
        Device existingDevice = deviceRepository.findById(id).orElseThrow();
        existingDevice.setName(dto.getName());
        existingDevice.setSerialNum(dto.getSerialNum());
        existingDevice.setEnergyThreshold(dto.getEnergyThreshold());
        existingDevice.setLastUpdated(LocalDateTime.now());
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
