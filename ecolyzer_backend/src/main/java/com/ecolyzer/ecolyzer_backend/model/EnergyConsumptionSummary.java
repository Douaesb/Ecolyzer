package com.ecolyzer.ecolyzer_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;



@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "energy_consumption_summary")
public class EnergyConsumptionSummary {

    @Id
    private String id;

    @DBRef
    private Device device;

    private LocalDate date;

    private Double totalEnergyConsumption;
    private int alertCount;
}
