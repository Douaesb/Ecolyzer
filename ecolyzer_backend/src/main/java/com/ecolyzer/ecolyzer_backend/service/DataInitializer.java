package com.ecolyzer.ecolyzer_backend.service;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ecolyzer.ecolyzer_backend.model.Role;
import com.ecolyzer.ecolyzer_backend.model.User;
import com.ecolyzer.ecolyzer_backend.repository.RoleRepository;
import com.ecolyzer.ecolyzer_backend.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public void run(String... args) {
        if (roleRepository.findByName("ROLE_ADMIN") == null) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
        }
    
        if (roleRepository.findByName("ROLE_USER") == null) {
            Role userRole = new Role();
            userRole.setName("ROLE_USER");
            roleRepository.save(userRole);
        }
    
        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN");
            if (adminRole != null) { 
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@ecolyzer.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRoles(List.of(adminRole));
                admin.setApproved(true); 
                userRepository.save(admin);
            } else {
                throw new IllegalStateException("ROLE_ADMIN was not found in the database.");
            }
        }
    }
    
}
