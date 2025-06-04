package com.quizappbackend.controllers;

import com.quizappbackend.entities.User;
import com.quizappbackend.jwt.AuthRequest;
import com.quizappbackend.jwt.AuthResponse;
import com.quizappbackend.services.JwtService;
import com.quizappbackend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/token")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public AuthResponse generateToken(@RequestBody AuthRequest authRequest) {
        User user = userService.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found " +  authRequest.getUsername() + " " + authRequest.getPassword()));

        if (!passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

}
