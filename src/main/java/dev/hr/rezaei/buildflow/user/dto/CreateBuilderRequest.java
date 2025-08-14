package dev.hr.rezaei.buildflow.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for creating a new builder user")
public class CreateBuilderRequest {
    @Schema(description = "Registration status of the builder", example = "true")
    @NotNull(message = "Registered status is required")
    private boolean registered;

    @Schema(description = "Contact information for the builder")
    @Valid
    @NotNull(message = "Contact information is required")
    private ContactRequestDto contactRequestDto;
}
