package com.ecolyzer.ecolyzer_backend.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "status_changes")
public class StatusChange {

    @Id
    private String id;

    @DBRef
    private ThresholdAlert thresholdAlert;

    private AlertStatus status;

    private LocalDateTime changedAt;
}