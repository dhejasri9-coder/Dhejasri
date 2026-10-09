
package com.dhejamart.backend.controller;

import com.dhejamart.backend.entity.User;
import com.dhejamart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User loginUser) {

        Map<String, Object> response = new HashMap<>();

        User user = userRepository
                .findByUsername(loginUser.getUsername())
                .orElse(null);

        if (user != null
                && user.getPassword().equals(loginUser.getPassword())) {

            response.put("message", "Login successful");
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("role", user.getRole());

            return response;
        }

        response.put("message", "Invalid username or password");
        return response;
    }
}