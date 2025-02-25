package com.ecolyzer.ecolyzer_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "threshold_alerts")
public class ThresholdAlert {

    @Id
    private String id;

    @DBRef
    private Device device;

    private Double thresholdValue; // kWh

    private String alertMessage;

    private boolean active;

    private LocalDateTime timestamp;

    private LocalDateTime updatedAt;


    private AlertStatus status = AlertStatus.UNRESOLVED;

    @DBRef
    @Builder.Default
    private List<StatusChange> statusHistory = new ArrayList<>();
    public void updateThreshold(Double newValue, String newMessage, boolean status) {
        this.thresholdValue = newValue;
        this.alertMessage = newMessage;
        this.active = status;
        this.updatedAt = LocalDateTime.now();
    }
}
