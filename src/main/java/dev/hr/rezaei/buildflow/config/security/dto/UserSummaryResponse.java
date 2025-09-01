package dev.hr.rezaei.buildflow.config.security.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

/**
 * Response DTO for user summary information.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Schema(description = "Summary information about the authenticated user")
public class UserSummaryResponse {

    @Schema(description = "Unique identifier of the user", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "Username of the user", example = "john.doe@example.com")
    private String username;

    @Schema(description = "Email address of the user", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Role of the user", example = "ADMIN")
    private String role;
}
