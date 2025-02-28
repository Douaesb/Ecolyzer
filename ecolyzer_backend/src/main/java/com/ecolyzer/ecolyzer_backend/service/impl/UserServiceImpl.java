package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.dto.request.UserRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.UserResponseDTO;
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

import java.util.Collections;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, 
                           PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }


    @Override
    public UserResponseDTO register(UserRequestDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new UsernameAlreadyExistsException("Username '" + userDTO.getUsername() + "' is already taken");
        }

        User user = userMapper.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // List<Role> roles = userDTO.getRoles().stream()
        //         .map(roleName -> roleRepository.findByName(roleName))
        //         .filter(Objects::nonNull)
        //         .toList();

        // if (roles.isEmpty()) {
        //     throw new RoleNotFoundException("At least one valid role is required (e.g., ROLE_USER or ROLE_ADMIN)");
        // }

        // user.setRoles(roles);
        user.setRoles(Collections.emptyList());
        user.setApproved(false);
        return userMapper.toDTO(userRepository.save(user));
    }


    @Override
    public List<UserResponseDTO> getAllUsers() {
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

    @Override
    public String approveUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> 
            new ResourceNotFoundException("User not found"));

        Role userRole = roleRepository.findByName("ROLE_USER");
        if (userRole == null) {
            throw new RoleNotFoundException("User role not found");
        }

        user.setApproved(true);
        user.setRoles(List.of(userRole));
        userRepository.save(user);

        return "User approved successfully";
    }

    @Override
    public void deleteUser(String id){
        userRepository.deleteById(id);
    }
    

}
