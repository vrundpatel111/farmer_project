package org.example.dmy.service;

import org.example.dmy.model.Vehicle;
import org.example.dmy.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public List<Vehicle> getVehiclesByUserId(Long userId) {
        return vehicleRepository.findByUserId(userId);
    }

    public Vehicle addVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle updated) {
        Vehicle existing = vehicleRepository.findById(id).orElseThrow();
        existing.setVehicleName(updated.getVehicleName());
        existing.setVehicleType(updated.getVehicleType());
        existing.setStatus(updated.getStatus());
        existing.setPlateNumber(updated.getPlateNumber());
        existing.setCapacity(updated.getCapacity());
        return vehicleRepository.save(existing);
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
