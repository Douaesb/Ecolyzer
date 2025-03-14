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
@Document(collection = "energy_consumption")
public class EnergyConsumption {

    @Id
    private String id;

    @DBRef
    private Device device;

    private Double totalConsumption; // kWh

    private LocalDateTime timestamp;

    public void addConsumption(Double value) {
        if (this.totalConsumption == null) {
            this.totalConsumption = 0.0;
        }
        this.totalConsumption += value;
        this.timestamp = LocalDateTime.now();
    }
}
