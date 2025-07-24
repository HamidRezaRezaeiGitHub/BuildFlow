package dev.hr.rezaei.buildflow.model.base;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@MappedSuperclass
public abstract class BaseAddress {
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
    private String postalOrZipCode;

    @Column(length = 100, nullable = false)
    private String country;
}
