package com.dhejamart.backend.controller;

import com.dhejamart.backend.entity.User;
import com.dhejamart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class RegisterController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public String register(@RequestBody User newUser) {

        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            return "Username already exists";
        }

        newUser.setRole("BUYER");
        userRepository.save(newUser);

        return "Registration successful";
    }
}