package com.ecolyzer.ecolyzer_backend.dto.embedded;

import com.ecolyzer.ecolyzer_backend.model.SensorType;
import lombok.Data;

@Data
public class CapteurEmbeddedDTO {
    private String id;
    private String name;
    private SensorType type;
}