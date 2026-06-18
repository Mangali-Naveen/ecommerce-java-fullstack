package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;

import io.jsonwebtoken.Claims;

@RestController
public class AuthCheckController {

	@Autowired
	private UserRepository userRepository;

	@GetMapping("/api/auth/check-auth")
	public Map<String, Object> checkAuth(
			@RequestHeader(value = "Authorization", required = false) String authHeader) {

		Map<String, Object> resp = new HashMap<>();

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			resp.put("success", false);
			resp.put("user", null);
			return resp;
		}

		String token = authHeader.replace("Bearer ", "");

		Claims claims = JwtUtil.extractClaims(token);

		Object idObj = claims.get("id");
		Long userId = null;
		if (idObj != null) {
			try {
				userId = Long.valueOf(idObj.toString());
			} catch (Exception e) {
				userId = null;
			}
		}

		if (userId == null) {
			resp.put("success", false);
			resp.put("user", null);
			return resp;
		}

		User user = userRepository.findById(userId).orElse(null);

		if (user == null) {
			resp.put("success", false);
			resp.put("user", null);
			return resp;
		}

		UserDto dto = new UserDto(user);

		resp.put("success", true);
		resp.put("user", dto);
		return resp;
	}
}
