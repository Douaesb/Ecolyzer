package com.ecolyzer.ecolyzer_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ZoneRequestDTO {
    @NotBlank(message = "Zone name is required.")
    @Size(max = 50, message = "Zone name cannot exceed 50 characters.")
    private String name;

    @NotBlank(message = "Description is required.")
    @Size(max = 200, message = "Description cannot exceed 200 characters.")
    private String description;

    @NotBlank(message = "Location is required.")
    private String location;
    private List<String> deviceIds;
}
