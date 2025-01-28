package com.ecolyzer.ecolyzer_backend.service;

import com.ecolyzer.ecolyzer_backend.dto.request.ZoneRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.ZoneResponseDTO;
import org.springframework.data.domain.Page;

public interface ZoneService {
    ZoneResponseDTO addZone(ZoneRequestDTO zoneRequestDTO);
    ZoneResponseDTO getZoneById(String id);
    Page<ZoneResponseDTO> getAllZones(int page, int size);

    ZoneResponseDTO updateZone(String id, ZoneRequestDTO dto);

    void deleteZone(String id);
}
