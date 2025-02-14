package com.ecolyzer.ecolyzer_backend.dto.response;

import com.ecolyzer.ecolyzer_backend.dto.embedded.DeviceEmbeddedDTO;
import com.ecolyzer.ecolyzer_backend.model.SensorType;
import lombok.Data;

@Data
public class CapteurResponseDTO {
    private String id;
    private String name;
    private SensorType type;
    private DeviceEmbeddedDTO device;
}