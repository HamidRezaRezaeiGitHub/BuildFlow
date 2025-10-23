package dev.hr.rezaei.buildflow.data.migration.dto;

import lombok.Data;

import java.util.List;

/**
 * Data Transfer Object for deserializing mock contact data from JSON files.
 * Represents contact information associated with a user.
 *
 * @see MockUserData
 * @see dev.hr.rezaei.buildflow.data.migration.JsonLoadUtil
 */
@Data
public class MockContactData {
    private String id;
    private String firstName;
    private String lastName;
    private List<String> labels;
    private String email;
    private String phone;
    private MockAddressData address;
}
