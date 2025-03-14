package com.ecolyzer.ecolyzer_backend.dto.response;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
public class AuthResponse {
    private String token;
    private String username;
    private String email;

    private Collection<? extends GrantedAuthority> roles;

    public AuthResponse(String token, String username, String email, Collection<? extends GrantedAuthority> roles) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}
