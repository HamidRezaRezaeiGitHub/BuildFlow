package dev.hr.rezaei.buildflow.config.security.dto;

import dev.hr.rezaei.buildflow.config.security.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO for UserAuthentication entity without password-related fields.
 * Used for safe transmission of user authentication data to admin users.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User authentication information without sensitive data")
public class UserAuthenticationDto {

    @Schema(description = "Unique identifier of the user authentication", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "Username", example = "john.doe@example.com")
    private String username;

    @Schema(description = "User role", example = "USER")
    private Role role;

    @Schema(description = "Whether the user account is enabled", example = "true")
    private boolean enabled;

    @Schema(description = "Timestamp when the user was created", example = "2023-01-01T00:00:00Z")
    private Instant createdAt;

    @Schema(description = "Timestamp of the user's last login", example = "2023-01-01T12:00:00Z")
    private Instant lastLogin;
}