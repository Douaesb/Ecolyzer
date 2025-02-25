package com.ecolyzer.ecolyzer_backend.dto.response;

import com.ecolyzer.ecolyzer_backend.dto.embedded.CapteurEmbeddedDTO;
import lombok.Data;

import java.util.List;

@Data
public class DeviceResponseDTO {
    private String id;
    private String name;
    private Integer serialNum;
    private String zoneId;
    private Double energyThreshold;
    private List<CapteurEmbeddedDTO> capteurs;
}
