package com.ecolyzer.ecolyzer_backend.service;

import com.ecolyzer.ecolyzer_backend.dto.request.UserRequestDTO;
import com.ecolyzer.ecolyzer_backend.model.User;

import java.util.List;

public interface UserService {
    UserRequestDTO register(UserRequestDTO userDTO);
    List<UserRequestDTO> getAllUsers();
    void updateUserRoles(String id, List<String> roles);
    // User loadUserByUsername(String username);
    User loadUserByUsername(String usernameOrEmail);
    String approveUser(String id);
}
