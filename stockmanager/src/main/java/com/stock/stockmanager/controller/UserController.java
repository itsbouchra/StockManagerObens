package com.stock.stockmanager.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.dto.LoginRequest;
import com.stock.stockmanager.dto.UserDTO;
import com.stock.stockmanager.model.User;
import com.stock.stockmanager.repository.UserRepository;
import com.stock.stockmanager.response.UserResponse;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            UserDTO dto = new UserDTO();
            dto.setId_user(user.getId_user());
            dto.setUsername(user.getUsername());
            dto.setRole(user.getRole());
            return dto;
        }).toList();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginData) {
        Optional<User> userOpt = userRepository.findByUsernameAndPassword(
            loginData.getUsername(),
            loginData.getPassword()
        );
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            UserDTO dto = new UserDTO();
            dto.setId_user(user.getId_user());
            dto.setUsername(user.getUsername());
            dto.setRole(user.getRole());
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable int id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            UserDTO dto = new UserDTO();
            dto.setId_user(user.getId_user());
            dto.setUsername(user.getUsername());
            dto.setRole(user.getRole());
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User user) {
        user.setId_user(id);
        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    public UserResponse deleteUser(@PathVariable int id) {
        userRepository.deleteById(id);
        return new UserResponse("User deleted successfully.");
    }
}

