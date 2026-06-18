package com.example.demo.dto;

import com.example.demo.entity.User;

public class UserDto {
    private Long id;
    private String userName;
    private String email;
    private String role;

    public UserDto() {}

    public UserDto(Long id, String userName, String email, String role) {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.role = role;
    }

    public UserDto(User user) {
        if (user != null) {
            this.id = user.getId();
            this.userName = user.getUserName();
            this.email = user.getEmail();
            this.role = user.getRole();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
