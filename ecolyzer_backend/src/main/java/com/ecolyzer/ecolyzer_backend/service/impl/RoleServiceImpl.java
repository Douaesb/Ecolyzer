package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.dto.request.RoleRequestDTO;
import com.ecolyzer.ecolyzer_backend.mapper.RoleMapper;
import com.ecolyzer.ecolyzer_backend.model.Role;
import com.ecolyzer.ecolyzer_backend.repository.RoleRepository;
import com.ecolyzer.ecolyzer_backend.service.RoleService;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public RoleServiceImpl(RoleRepository roleRepository, RoleMapper roleMapper) {
        this.roleRepository = roleRepository;
        this.roleMapper = roleMapper;
    }

    @Override
    public RoleRequestDTO addRole(RoleRequestDTO roleDTO) {
        Role role = roleMapper.toEntity(roleDTO);

        if (roleRepository.findByName(role.getName()) != null) {
            throw new IllegalArgumentException("Role with name '" + role.getName() + "' already exists.");
        }

        Role savedRole = roleRepository.save(role);
        return roleMapper.toDTO(savedRole);
    }
}
