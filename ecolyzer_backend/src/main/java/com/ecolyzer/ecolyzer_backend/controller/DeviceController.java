package com.ecolyzer.ecolyzer_backend.controller;

import com.ecolyzer.ecolyzer_backend.dto.request.DeviceRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.DeviceResponseDTO;
import com.ecolyzer.ecolyzer_backend.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    @Autowired
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    public Page<DeviceResponseDTO> getAllDevices(@RequestParam int page, @RequestParam int size) {
        return deviceService.getAllDevices(page, size);
    }

    @PostMapping
    public DeviceResponseDTO createDevice(@Valid @RequestBody DeviceRequestDTO dto) {
        return deviceService.createDevice(dto);
    }

    @PutMapping("/{id}")
    public DeviceResponseDTO updateDevice(@PathVariable String id, @Valid @RequestBody DeviceRequestDTO dto) {
        return deviceService.updateDevice(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteDevice(@PathVariable String id) {
        deviceService.deleteDevice(id);
    }

    @GetMapping("/search")
    public Page<DeviceResponseDTO> searchDevices(@RequestParam String name, @RequestParam int page, @RequestParam int size) {
        return deviceService.searchDevicesByName(name, page, size);
    }

    @GetMapping("/filter")
    public Page<DeviceResponseDTO> filterDevices(@RequestParam Integer serialNum, @RequestParam int page, @RequestParam int size) {
        return deviceService.filterDevicesBySerialNum(serialNum, page, size);
    }

    @GetMapping("/zone/{zoneId}")
    public List<DeviceResponseDTO> getDevicesByZone(@PathVariable String zoneId,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "5") int size) {
        return deviceService.getDevicesByZone(zoneId, page, size);
    }
}
