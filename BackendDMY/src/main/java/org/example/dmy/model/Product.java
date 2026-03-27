package org.example.dmy.model;

import jakarta.persistence.*;
import lombok.*;
import org.example.dmy.enums.ProductStatus;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productName;

    private Double quantity;

    private Double price;

    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.AVAILABLE;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
