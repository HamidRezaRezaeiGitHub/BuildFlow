package dev.hr.rezaei.buildflow.base;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseAddressDto {
    @Size(max = 20, message = "Unit number must not exceed 20 characters")
    private String unitNumber;

    @Size(max = 20, message = "Street number must not exceed 20 characters")
    private String streetNumber;

    @Size(max = 200, message = "Street name must not exceed 200 characters")
    private String streetName;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 100, message = "State or province must not exceed 100 characters")
    private String stateOrProvince;

    @Size(max = 20, message = "Postal or zip code must not exceed 20 characters")
    private String postalOrZipCode;

    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;
}
