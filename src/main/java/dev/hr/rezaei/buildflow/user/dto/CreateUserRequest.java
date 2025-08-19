package dev.hr.rezaei.buildflow.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>User package documentation: "UserDtos.md"</li>
 *     <li>Base package documentation: "../Dtos.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for creating a new user")
public class CreateUserRequest {
    @Schema(description = "Registration status of the user", example = "true")
    @NotNull(message = "Registered status is required")
    private boolean registered;

    @Schema(description = "Username for the user", example = "john_doe")
    @NotNull(message = "Username is required")
    @Valid
    private String username;

    @Schema(description = "Contact information for the user")
    @Valid
    @NotNull(message = "Contact information is required")
    private ContactRequestDto contactRequestDto;
}
