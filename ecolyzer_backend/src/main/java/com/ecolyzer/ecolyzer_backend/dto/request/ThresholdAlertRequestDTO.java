package com.ecolyzer.ecolyzer_backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThresholdAlertRequestDTO {

    @NotBlank(message = "Device ID cannot be blank")
    private String deviceId;

    @NotNull(message = "Threshold value is required")
    @Min(value = 0, message = "Threshold value must be at least 0 kWh")
    @Max(value = 1000, message = "Threshold value cannot exceed 1000 kWh")
    private Double thresholdValue;

    @NotBlank(message = "Alert message cannot be blank")
    @Size(max = 255, message = "Alert message cannot exceed 255 characters")
    private String alertMessage;

    @NotNull(message = "Active status must be specified")
    private Boolean active;

}
