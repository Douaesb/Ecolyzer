package com.ecolyzer.ecolyzer_backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "devices")
public class Device {

    @Id
    private String id;
    private String name;
    private Integer serialNum;
    private Double energyThreshold;

    @DBRef
    private Zone zone;

    @DBRef
    @ToString.Exclude
    @JsonIgnore
    private List<Capteur> capteurs;

}
