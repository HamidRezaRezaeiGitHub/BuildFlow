package dev.hr.rezaei.buildflow.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * CreateBuilderRequest representing request object for creating builder users.
 * <p>
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
