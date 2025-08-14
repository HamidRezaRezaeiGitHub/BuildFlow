package dev.hr.rezaei.buildflow.base;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Base address information with common address fields")
public abstract class BaseAddressDto {
    @Schema(description = "Unit or apartment number", example = "Apt 101")
    @Size(max = 20, message = "Unit number must not exceed 20 characters")
    private String unitNumber;

    @Schema(description = "Street number", example = "123")
    @Size(max = 20, message = "Street number must not exceed 20 characters")
    private String streetNumber;

    @Schema(description = "Street name", example = "Main Street")
    @Size(max = 200, message = "Street name must not exceed 200 characters")
    private String streetName;

    @Schema(description = "City name", example = "New York")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Schema(description = "State or province", example = "NY")
    @Size(max = 100, message = "State or province must not exceed 100 characters")
    private String stateOrProvince;

    @Schema(description = "Postal or zip code", example = "10001")
    @Size(max = 20, message = "Postal or zip code must not exceed 20 characters")
    private String postalOrZipCode;

    @Schema(description = "Country", example = "United States")
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;
}
