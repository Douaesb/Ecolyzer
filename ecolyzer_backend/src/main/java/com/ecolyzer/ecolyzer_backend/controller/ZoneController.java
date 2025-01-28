package com.ecolyzer.ecolyzer_backend.controller;

import com.ecolyzer.ecolyzer_backend.dto.request.ZoneRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.ZoneResponseDTO;
import com.ecolyzer.ecolyzer_backend.service.ZoneService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/zones")
public class ZoneController {

    private final ZoneService zoneService;

    @Autowired
    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @GetMapping
    public Page<ZoneResponseDTO> getAllZones(@RequestParam int page, @RequestParam int size) {
        return zoneService.getAllZones(page, size);
    }

    @GetMapping("/{id}")
    public ZoneResponseDTO getZoneById(@PathVariable String id) {
        return zoneService.getZoneById(id);
    }

    @PostMapping
    public ZoneResponseDTO createZone(@Valid @RequestBody ZoneRequestDTO dto) {
        return zoneService.addZone(dto);
    }

    @PutMapping("/{id}")
    public ZoneResponseDTO updateZone(@PathVariable String id, @Valid @RequestBody ZoneRequestDTO dto) {
        return zoneService.updateZone(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteZone(@PathVariable String id) {
        zoneService.deleteZone(id);
    }
}
