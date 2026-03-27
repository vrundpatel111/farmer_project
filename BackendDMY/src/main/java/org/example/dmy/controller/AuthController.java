package org.example.dmy.controller;

import org.example.dmy.model.User;
import org.example.dmy.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> creds) {
        return authService.login(creds.get("email"), creds.get("password"))
                .orElseThrow(() -> new RuntimeException("Invalid Credentials"));
    }
}
