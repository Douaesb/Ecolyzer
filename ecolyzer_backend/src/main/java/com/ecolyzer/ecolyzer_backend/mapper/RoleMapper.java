package com.ecolyzer.ecolyzer_backend.mapper;

import com.ecolyzer.ecolyzer_backend.dto.request.RoleRequestDTO;
import com.ecolyzer.ecolyzer_backend.model.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleRequestDTO toDTO(Role role);

    Role toEntity(RoleRequestDTO roleDTO);
}