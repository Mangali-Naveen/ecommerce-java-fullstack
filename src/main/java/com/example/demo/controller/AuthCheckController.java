package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.security.JwtUtil;

import io.jsonwebtoken.Claims;

@RestController
public class AuthCheckController {

	@GetMapping("/api/auth/check-auth")
	public Claims checkAuth(
	        @RequestHeader("Authorization") String authHeader) {

	    String token = authHeader.replace("Bearer ", "");

	    return JwtUtil.extractClaims(token);
	}
}
