package com.ecolyzer.ecolyzer_backend.dto.embedded;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeviceEmbeddedDTO {
    private String id;
    private String name;
    private Integer serialNum;
    private Double energyThreshold;
    private LocalDateTime lastUpdated;
}
