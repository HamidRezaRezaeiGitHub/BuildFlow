package dev.hr.rezaei.buildflow.data.migration.dto;

import lombok.Data;

/**
 * Data Transfer Object for deserializing mock user data from JSON files.
 * Used by {@link dev.hr.rezaei.buildflow.config.security.MockDataInitializer}
 * to load test/development user data.
 *
 * @see dev.hr.rezaei.buildflow.data.migration.JsonLoadUtil
 */
@Data
public class MockUserData {
    private String id;
    private String username;
    private String email;
    private boolean registered;
    private MockContactData contact;
}
