package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.security.JwtUtil;

import io.jsonwebtoken.Claims;
import java.util.Map;

@RestController
public class AuthCheckController {

	@GetMapping("/api/auth/check-auth")
	public ResponseEntity<?> checkAuth(
	        @RequestHeader(value = "Authorization", required = false) String authHeader) {

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
		}

		try {
			String token = authHeader.replace("Bearer ", "");
			Claims claims = JwtUtil.extractClaims(token);
			Map<String, Object> user = Map.of(
				"id", claims.get("id"),
				"email", claims.get("email"),
				"role", claims.get("role"),
				"userName", claims.get("userName")
			);
			return ResponseEntity.ok(Map.of("success", true, "message", "Authenticated user!", "user", user));
		} catch (Exception e) {
			return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
		}
	}
}

