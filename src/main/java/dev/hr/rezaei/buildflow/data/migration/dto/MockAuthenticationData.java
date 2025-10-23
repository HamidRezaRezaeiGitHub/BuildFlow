package dev.hr.rezaei.buildflow.data.migration.dto;

import lombok.Data;

/**
 * Data Transfer Object for deserializing mock authentication data from JSON files.
 * Contains user authentication and authorization information for testing/development.
 *
 * @see dev.hr.rezaei.buildflow.data.migration.JsonLoadUtil
 */
@Data
public class MockAuthenticationData {
    private String id;
    private String username;
    private String passwordHash;
    private String role;
    private boolean enabled;
    private String createdAt;
    private String lastLogin;
}
