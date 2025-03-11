package com.ecolyzer.ecolyzer_backend.dto.embedded;

import com.ecolyzer.ecolyzer_backend.model.AlertStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThresholdAlertEmbeddedDTO {
    private Double thresholdValue;
    private String alertMessage;
    private boolean active;
    private AlertStatus status;
    private String deviceName;
}
