package com.ecolyzer.ecolyzer_backend.dto.embedded;

import com.ecolyzer.ecolyzer_backend.model.AlertStatus;
import lombok.Data;

@Data
public class ThresholdAlertEmbeddedDTO {
    private Double thresholdValue;
    private String alertMessage;
    private boolean active;
    private AlertStatus status;
}
