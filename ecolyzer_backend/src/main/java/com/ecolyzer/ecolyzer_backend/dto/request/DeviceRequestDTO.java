package com.ecolyzer.ecolyzer_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class DeviceRequestDTO {
    @NotBlank(message = "Device name cannot be blank.")
    private String name;

    @NotNull(message = "Serial number cannot be null.")
    @Positive(message = "Serial number must be positive.")
    private Integer serialNum;

    @NotBlank(message = "Zone ID is required.")
    private String zoneId;
}
