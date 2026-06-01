package com.example.demo.security;

import java.security.Key;
import java.util.Date;

import javax.crypto.spec.SecretKeySpec;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtUtil {

    private static final String SECRET =
            "CLIENT_SECRET_KEY_CLIENT_SECRET_KEY_CLIENT_SECRET_KEY";

    private static final Key KEY =
            new SecretKeySpec(
                    SECRET.getBytes(),
                    SignatureAlgorithm.HS256.getJcaName());

    public static String generateToken(Long id,
                                       String email,
                                       String role,
                                       String userName) {

        return Jwts.builder()
                .claim("id", id)
                .claim("email", email)
                .claim("role", role)
                .claim("userName", userName)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(KEY)
                .compact();
    }
}