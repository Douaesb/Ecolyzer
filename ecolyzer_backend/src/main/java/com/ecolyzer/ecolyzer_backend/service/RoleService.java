package com.ecolyzer.ecolyzer_backend.service;

import com.ecolyzer.ecolyzer_backend.dto.request.RoleRequestDTO;

public interface RoleService {
    RoleRequestDTO addRole(RoleRequestDTO roleDTO);

}
