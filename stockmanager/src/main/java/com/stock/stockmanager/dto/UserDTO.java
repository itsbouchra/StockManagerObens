package com.stock.stockmanager.dto;

public class UserDTO {
    private int id_user;
    private String username;
    private String role;

    // Getters and setters
    public int getId_user() { return id_user; }
    public void setId_user(int id_user) { this.id_user = id_user; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}