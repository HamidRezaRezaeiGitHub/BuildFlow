package dev.hr.rezaei.buildflow.base;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public abstract class BaseAddressDto {
    private String unitNumber;
    private String streetNumber;
    private String streetName;
    private String city;
    private String stateOrProvince;
    private String postalOrZipCode;
    private String country;
}
