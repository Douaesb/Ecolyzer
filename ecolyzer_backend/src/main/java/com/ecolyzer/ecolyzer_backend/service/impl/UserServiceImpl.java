package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.dto.request.UserRequestDTO;
import com.ecolyzer.ecolyzer_backend.exception.ResourceNotFoundException;
import com.ecolyzer.ecolyzer_backend.exception.RoleNotFoundException;
import com.ecolyzer.ecolyzer_backend.exception.UsernameAlreadyExistsException;
import com.ecolyzer.ecolyzer_backend.mapper.UserMapper;
import com.ecolyzer.ecolyzer_backend.model.Role;
import com.ecolyzer.ecolyzer_backend.model.User;
import com.ecolyzer.ecolyzer_backend.repository.RoleRepository;
import com.ecolyzer.ecolyzer_backend.repository.UserRepository;
import com.ecolyzer.ecolyzer_backend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    @Override
    public UserRequestDTO register(UserRequestDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new UsernameAlreadyExistsException("Username '" + userDTO.getUsername() + "' is already taken");
        }

        User user = userMapper.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        List<Role> roles = userDTO.getRoles().stream()
                .map(roleName -> roleRepository.findByName(roleName))
                .filter(Objects::nonNull)
                .toList();

        if (roles.isEmpty()) {
            throw new RoleNotFoundException("At least one valid role is required (e.g., ROLE_USER or ROLE_ADMIN)");
        }

        user.setRoles(roles);

        return userMapper.toDTO(userRepository.save(user));
    }


    @Override
    public List<UserRequestDTO> getAllUsers() {
        return userRepository.findAll().stream().map(userMapper::toDTO).toList();
    }

    @Override
    public void updateUserRoles(String id, List<String> roles) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        List<Role> updatedRoles = roles.stream().map(roleRepository::findByName).toList();
        user.setRoles(updatedRoles);
        userRepository.save(user);
    }

    @Override
    public User loadUserByUsername(String usernameOrEmail) {
        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail)) 
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + usernameOrEmail));
    }
    

}
