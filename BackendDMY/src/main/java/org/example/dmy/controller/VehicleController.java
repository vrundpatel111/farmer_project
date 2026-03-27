package org.example.dmy.controller;

import org.example.dmy.model.User;
import org.example.dmy.model.Vehicle;
import org.example.dmy.repository.UserRepository;
import org.example.dmy.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private UserRepository userRepository;

    // Get all vehicles for a transporter
    @GetMapping("/user/{userId}")
    public List<Vehicle> getByUser(@PathVariable Long userId) {
        return vehicleService.getVehiclesByUserId(userId);
    }

    // Add a vehicle for a transporter
    @PostMapping("/add/{userId}")
    public Vehicle add(@PathVariable Long userId, @RequestBody Vehicle vehicle) {
        User user = userRepository.findById(userId).orElseThrow();
        vehicle.setUser(user);
        return vehicleService.addVehicle(vehicle);
    }

    // Update vehicle
    @PutMapping("/{id}")
    public Vehicle update(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        return vehicleService.updateVehicle(id, vehicle);
    }

    // Delete vehicle
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
    }
}
