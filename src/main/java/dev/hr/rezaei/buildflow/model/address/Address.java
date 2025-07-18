package dev.hr.rezaei.buildflow.model.address;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(length = 20)
    private String unitNumber;

    @Column(length = 20)
    private String streetNumber;

    @Column(length = 200)
    private String streetName;

    @Column(length = 100, nullable = false)
    private String city;

    @Column(length = 100, nullable = false)
    private String stateOrProvince;

    @Column(length = 20, nullable = false)
    private String postalCode;

    @Column(length = 100, nullable = false)
    private String country;
}
