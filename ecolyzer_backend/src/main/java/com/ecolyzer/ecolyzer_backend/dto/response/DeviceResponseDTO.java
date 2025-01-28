package com.ecolyzer.ecolyzer_backend.dto.response;

import lombok.Data;

@Data
public class DeviceResponseDTO {
    private String id;
    private String name;
    private Integer serialNum;
    private String zoneId;
}
