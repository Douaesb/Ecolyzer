package com.ecolyzer.ecolyzer_backend.dto.response;

import com.ecolyzer.ecolyzer_backend.dto.embedded.DeviceEmbeddedDTO;
import lombok.Data;

import java.util.List;

@Data
public class ZoneResponseDTO {
    private String id;
    private String name;
    private String description;
    private String location;
    private List<DeviceEmbeddedDTO> devices;
}
