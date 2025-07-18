package dev.hr.rezaei.buildflow.model.address;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
    private UUID id;
    private String unitNumber;
    private String streetNumber;
    private String streetName;
    private String city;
    private String stateOrProvince;
    private String postalCode;
    private String country;
}
