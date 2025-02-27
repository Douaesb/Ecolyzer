package com.ecolyzer.ecolyzer_backend.controller;

import com.ecolyzer.ecolyzer_backend.dto.request.LoginRequest;
import com.ecolyzer.ecolyzer_backend.dto.request.UserRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.AuthResponse;
import com.ecolyzer.ecolyzer_backend.model.User;
import com.ecolyzer.ecolyzer_backend.security.JwtTokenProvider;
import com.ecolyzer.ecolyzer_backend.service.TokenBlacklistService;
import com.ecolyzer.ecolyzer_backend.service.UserService;
import com.ecolyzer.ecolyzer_backend.service.impl.CustomUserDetails;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final JwtTokenProvider jwtTokenProvider;
        private final UserService userService;
        private final TokenBlacklistService tokenBlacklistService;

        public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
                        UserService userService, TokenBlacklistService tokenBlacklistService) {
                this.authenticationManager = authenticationManager;
                this.jwtTokenProvider = jwtTokenProvider;
                this.userService = userService;
                this.tokenBlacklistService = tokenBlacklistService;
        }

        @PostMapping("/login")
        public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
                User user = userService.loadUserByUsername(request.getUsernameOrEmail());

                if (request.getUsernameOrEmail() == null || request.getUsernameOrEmail().trim().isEmpty()) {
                        throw new IllegalArgumentException("Username or email cannot be null or empty");
                }
                if (!user.isApproved()) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

                }

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword()));

                CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
                List<String> roles = userDetails.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .toList();

                String token = jwtTokenProvider.generateToken(userDetails.getUsername(), roles);

                return ResponseEntity.ok(new AuthResponse(token, userDetails.getUsername(), userDetails.getEmail(),
                                userDetails.getAuthorities()));
        }

        @PostMapping("/register")
        public ResponseEntity<AuthResponse> register(@RequestBody UserRequestDTO userDTO) {
                UserRequestDTO registeredUser = userService.register(userDTO);

                List<String> roles = registeredUser.getRoles();

                String token = jwtTokenProvider.generateToken(registeredUser.getUsername(), roles);

                List<SimpleGrantedAuthority> authorities = roles.stream()
                                .map(SimpleGrantedAuthority::new)
                                .toList();

                return ResponseEntity
                                .ok(new AuthResponse(token, registeredUser.getUsername(), registeredUser.getEmail(),
                                                authorities));
        }

        @PostMapping("/logout")
        public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorization) {
                String token = authorization.replace("Bearer ", "");
                tokenBlacklistService.blacklistToken(token);

                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
}
