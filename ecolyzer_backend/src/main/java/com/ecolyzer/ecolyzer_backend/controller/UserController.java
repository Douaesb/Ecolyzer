package com.ecolyzer.ecolyzer_backend.controller;

import com.ecolyzer.ecolyzer_backend.dto.request.UserRequestDTO;
import com.ecolyzer.ecolyzer_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserRequestDTO>> getAllUsers() {
        List<UserRequestDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserRoles(@PathVariable String id, @RequestBody List<String> roles) {
        userService.updateUserRoles(id, roles);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}