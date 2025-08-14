package dev.hr.rezaei.buildflow.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@Schema(description = "User information containing basic user details and contact information")
public class UserDto {
    @Schema(description = "Unique identifier for the user", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "Email address of the user", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Registration status of the user", example = "true")
    private boolean registered;

    @Schema(description = "Contact information for the user")
    private ContactDto contactDto;
}
