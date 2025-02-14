package com.ecolyzer.ecolyzer_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "sensor_data")
public class SensorData implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    private Double value; // Mesure envoyée

    private Instant timestamp; // Date de la mesure

    private SensorType type; // Type de capteur à l'origine de la donnée

    private boolean processed = false;

    @DBRef
    private Capteur capteur;

}
