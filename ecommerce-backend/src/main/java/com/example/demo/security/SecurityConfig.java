package com.example.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .cors(cors -> {
                })
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session
                        -> session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**")
                .permitAll()
                // Feature endpoints: allow anyone to read features, but only ADMIN can add
                .requestMatchers(HttpMethod.GET, "/api/common/feature/get")
                .permitAll()
                .requestMatchers(HttpMethod.POST, "/api/common/feature/add")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/common/feature/update/**")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/common/feature/delete/**")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/common/feature/upload-image")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/uploads/banner-images/**")
                .permitAll()
                .requestMatchers(HttpMethod.GET, "/api/shop/**")
                .permitAll()
                .requestMatchers("/api/admin/**")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/cart/**")
                .authenticated()
                .requestMatchers(HttpMethod.POST, "/api/cart/add")
                .authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/cart/update")
                .authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/cart/**")
                .authenticated()
                .requestMatchers(HttpMethod.GET, "/api/wishlist/**")
                .authenticated()
                .requestMatchers(HttpMethod.POST, "/api/wishlist/**")
                .authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/wishlist/**")
                .authenticated()
                .requestMatchers(HttpMethod.GET, "/api/address/**")
                .authenticated()
                .requestMatchers(HttpMethod.POST, "/api/address/**")
                .authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/address/**")
                .authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/address/**")
                .authenticated()
                .requestMatchers(HttpMethod.GET, "/api/order/**")
                .authenticated()
                .requestMatchers(HttpMethod.POST, "/api/order/**")
                .authenticated()
                .anyRequest()
                .authenticated()
                );

        // Ensure JWT filter runs before username/password filter
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
