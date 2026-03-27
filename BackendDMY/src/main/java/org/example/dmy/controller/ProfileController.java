package org.example.dmy.controller;

import org.example.dmy.model.User;
import org.example.dmy.repository.UserRepository;
import org.example.dmy.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.example.dmy.enums.UserRole;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/profile/{userId}")
    public User getProfile(@PathVariable Long userId) {
        return userRepository.findById(userId).orElseThrow();
    }

    @GetMapping("/users/{userId}")
    public User getUserById(@PathVariable Long userId) {
        return userRepository.findById(userId).orElseThrow();
    }

    @GetMapping("/farmers")
    public List<User> getFarmers() {
        return userRepository.findByRole(UserRole.FARMER);
    }

    @GetMapping("/businessmen")
    public List<User> getBusinessmen() {
        return userRepository.findByRole(UserRole.BUSINESSMAN);
    }

    @GetMapping("/transporters")
    public List<User> getTransporters() {
        return userRepository.findByRole(UserRole.TRANSPORTER);
    }

    @PutMapping("/profile/{userId}")
    public User updateProfile(@PathVariable Long userId,
                              @RequestParam(value = "username", required = false) String username,
                              @RequestParam(value = "address", required = false) String address,
                              @RequestParam(value = "image", required = false) MultipartFile image) throws Exception {
        
        User user = userRepository.findById(userId).orElseThrow();
        if (username != null) user.setUsername(username);
        if (address != null) user.setAddress(address);
        if (image != null && !image.isEmpty()) {
            String fileName = fileStorageService.storeFile(image);
            user.setProfilePic(fileName);
        }
        return userRepository.save(user);
    }
}
