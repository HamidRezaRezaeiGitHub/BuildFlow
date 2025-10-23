package dev.hr.rezaei.buildflow.data.migration.dto;

import lombok.Data;

/**
 * Data Transfer Object for deserializing mock address data from JSON files.
 * Represents a physical address associated with a contact.
 *
 * @see MockContactData
 * @see dev.hr.rezaei.buildflow.data.migration.JsonLoadUtil
 */
@Data
public class MockAddressData {
    private String id;
    private String unitNumber;
    private String streetNumberAndName;
    private String city;
    private String stateOrProvince;
    private String postalOrZipCode;
    private String country;
}
