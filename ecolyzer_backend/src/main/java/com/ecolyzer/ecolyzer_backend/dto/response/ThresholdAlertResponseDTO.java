package com.ecolyzer.ecolyzer_backend.dto.response;

import com.ecolyzer.ecolyzer_backend.model.AlertStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ThresholdAlertResponseDTO {
    private String id;
    private String deviceId;
    private Double thresholdValue;
    private String alertMessage;
    private boolean active;
    private LocalDateTime timestamp;
    private String updatedAt;
    private AlertStatus status;
}
