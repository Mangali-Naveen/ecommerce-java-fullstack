package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public String register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            return "User already exists!";
        }

        User user = new User();

        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);

        return "Registration successful";
    }
    
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new AuthResponse(
                    false,
                    "User doesn't exist!",
                    null);
        }

        boolean match = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword());

        if (!match) {
            return new AuthResponse(
                    false,
                    "Incorrect password!",
                    null);
        }

        String token = JwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getUserName());

        return new AuthResponse(
                true,
                "Logged in successfully",
                token);
    }
}