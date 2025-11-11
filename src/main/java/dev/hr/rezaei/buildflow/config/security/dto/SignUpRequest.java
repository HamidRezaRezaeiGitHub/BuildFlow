package dev.hr.rezaei.buildflow.config.security.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Request DTO for user registration with complete contact information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Schema(description = "Request object for user registration with contact information and authentication credentials")
public class SignUpRequest {

    @Schema(description = "Username for the new account", example = "john_doe")
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @Schema(description = "Password for the new account", example = "SecurePassword123!")
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    @Pattern(regexp = ".*[a-z].*", message = "Password must contain at least one lowercase letter")
    @Pattern(regexp = ".*[A-Z].*", message = "Password must contain at least one uppercase letter")
    @Pattern(regexp = ".*\\d.*", message = "Password must contain at least one digit")
    @Pattern(regexp = ".*[@$!%*?&_].*", message = "Password must contain at least one special character (@$!%*?&_)")
    @Pattern(regexp = "^[A-Za-z\\d@$!%*?&_]{8,}$", message = "Password can only contain letters, digits, and special characters (@$!%*?&_)")
    private String password;

    @Schema(description = "Contact information for the new user")
    @Valid
    @NotNull(message = "Contact information is required")
    @JsonProperty("contact")
    private ContactRequestDto contactRequestDto;

}
