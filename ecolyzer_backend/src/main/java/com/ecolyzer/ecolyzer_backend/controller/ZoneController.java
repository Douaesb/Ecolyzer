package com.ecolyzer.ecolyzer_backend.controller;

import com.ecolyzer.ecolyzer_backend.dto.request.ZoneRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.ZoneResponseDTO;
import com.ecolyzer.ecolyzer_backend.service.ZoneService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ZoneController {

    private final ZoneService zoneService;

    @Autowired
    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @GetMapping({"/user/zones", "/admin/zones"})
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Page<ZoneResponseDTO> getAllZones(@RequestParam int page, @RequestParam int size) {
        return zoneService.getAllZones(page, size);
    }

    @GetMapping({"/user/zones/{id}", "/admin/zones/{id}"})
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ZoneResponseDTO getZoneById(@PathVariable String id) {
        return zoneService.getZoneById(id);
    }

    @PostMapping("/admin/zones")
    @PreAuthorize("hasRole('ADMIN')")
    public ZoneResponseDTO createZone(@Valid @RequestBody ZoneRequestDTO dto) {
        return zoneService.addZone(dto);
    }

    @PutMapping("/admin/zones/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ZoneResponseDTO updateZone(@PathVariable String id, @Valid @RequestBody ZoneRequestDTO dto) {
        return zoneService.updateZone(id, dto);
    }

    @DeleteMapping("/admin/zones/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteZone(@PathVariable String id) {
        zoneService.deleteZone(id);
    }
}
