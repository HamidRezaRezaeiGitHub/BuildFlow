package dev.hr.rezaei.buildflow.base;

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

    @Column(length = 220)
    private String streetNumberAndName;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String stateOrProvince;

    @Column(length = 20)
    private String postalOrZipCode;

    @Column(length = 100)
    private String country;
}
