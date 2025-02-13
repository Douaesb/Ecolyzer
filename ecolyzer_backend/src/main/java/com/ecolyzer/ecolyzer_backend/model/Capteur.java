package com.ecolyzer.ecolyzer_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "capteurs")
public class Capteur {

    @Id
    private String id;

    private String name;

    private SensorType type;

    @DBRef
    private Device device;
}
