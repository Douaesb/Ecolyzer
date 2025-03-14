package com.ecolyzer.ecolyzer_backend.dto.request;

import com.ecolyzer.ecolyzer_backend.model.SensorType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CapteurRequestDTO {
    private String name;
    private SensorType type;
    private String deviceId;
}
