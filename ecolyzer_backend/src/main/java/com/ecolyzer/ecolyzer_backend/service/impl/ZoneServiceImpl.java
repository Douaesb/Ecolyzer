package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.dto.request.ZoneRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.ZoneResponseDTO;
import com.ecolyzer.ecolyzer_backend.mapper.ZoneMapper;
import com.ecolyzer.ecolyzer_backend.model.Zone;
import com.ecolyzer.ecolyzer_backend.repository.ZoneRepository;
import com.ecolyzer.ecolyzer_backend.service.ZoneService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ZoneServiceImpl implements ZoneService {

    private ZoneRepository zoneRepository;
    private ZoneMapper zoneMapper;

    public ZoneServiceImpl(ZoneRepository zoneRepository, ZoneMapper zoneMapper) {
        this.zoneRepository = zoneRepository;
        this.zoneMapper = zoneMapper;
    }

    @Override
    public Page<ZoneResponseDTO> getAllZones(int page, int size) {
        log.debug("Retrieving all zones from the database");
        int skip = page * size;
        List<Zone> zones = zoneRepository.findAllZonesWithDevices(skip, size);
        List<ZoneResponseDTO> zoneDTOs = zones.stream()
                .map(zoneMapper::toResponseDTO)
                .toList();
        long totalElements = zoneRepository.count();
        return new PageImpl<>(zoneDTOs, PageRequest.of(page, size), totalElements);
    }


    @Override
    public ZoneResponseDTO getZoneById(String id) {
        log.debug("Retrieving zone with ID: {}", id);
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Zone with ID {} not found", id);
                    throw new IllegalArgumentException("Zone not found");
                });
        log.debug("Retrieved zone: {}", zone);
        return zoneMapper.toResponseDTO(zone);
    }

    @Override
    public ZoneResponseDTO addZone(ZoneRequestDTO zoneRequestDTO) {
        if (zoneRequestDTO.getName() == null || zoneRequestDTO.getName().isEmpty()) {
            throw new IllegalArgumentException("Zone name is required");
        }
        Zone zone = zoneMapper.toEntity(zoneRequestDTO);
        Zone savedZone = zoneRepository.save(zone);
        return zoneMapper.toResponseDTO(savedZone);
    }

    @Override
    public ZoneResponseDTO updateZone(String id, ZoneRequestDTO dto) {
        Zone existingZone = zoneRepository.findById(id).orElseThrow();
        existingZone.setName(dto.getName());
        existingZone.setDescription(dto.getDescription());
        existingZone.setLocation(dto.getLocation());
        Zone updatedZone = zoneRepository.save(existingZone);
        return zoneMapper.toResponseDTO(updatedZone);
    }

    @Override
    public void deleteZone(String id) {
        zoneRepository.deleteById(id);
    }
}