package org.example.dmy.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String vehicleName;

    @Column(nullable = false)
    private String vehicleType;

    @Column(nullable = false)
    private String status = "AVAILABLE";

    private String plateNumber;

    private Double capacity;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
