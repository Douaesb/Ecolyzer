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
@Document(collection = "devices")
public class Device {

    @Id
    private String id;
    private String name;
    private Integer serialNum;

    @DBRef
    private Zone zone;


}
