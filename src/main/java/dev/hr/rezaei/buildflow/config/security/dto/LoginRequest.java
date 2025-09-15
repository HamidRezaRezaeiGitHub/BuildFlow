package dev.hr.rezaei.buildflow.config.security.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Request DTO for user login.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Schema(description = "Request object for user authentication")
public class LoginRequest {

    @Schema(description = "Username or email for authentication", example = "john_doe or john@example.com")
    @NotBlank(message = "Username or email is required")
    @Size(min = 3, max = 100, message = "Username or email must be between 3 and 100 characters")
    private String username;

    @Schema(description = "Password for authentication", example = "password123")
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
    private String password;

}
