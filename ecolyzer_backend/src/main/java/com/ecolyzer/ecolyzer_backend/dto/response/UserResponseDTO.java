package com.ecolyzer.ecolyzer_backend.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
     private String id;

    private String username;

    private String email;

    private String password;

    // private Boolean active;

    private boolean approved;
    
    private List<String> roles;
}
