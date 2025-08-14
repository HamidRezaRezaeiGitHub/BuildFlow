package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.dto.Dto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;

/**
 * ContactDto representing complete contact information for API responses.
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
@Schema(description = "Contact information containing personal details and address")
public class ContactDto implements Dto<Contact> {
    @Schema(description = "Unique identifier for the contact", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "First name of the contact", example = "John")
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;

    @Schema(description = "Last name of the contact", example = "Doe")
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;

    @Schema(description = "List of labels/tags associated with the contact", example = "[\"builder\", \"contractor\"]")
    @NotNull(message = "Labels are required")
    private List<String> labels;

    @Schema(description = "Email address of the contact", example = "john.doe@example.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Schema(description = "Phone number of the contact", example = "+1-555-123-4567")
    @Size(max = 30, message = "Phone number must not exceed 30 characters")
    private String phone;

    @Schema(description = "Address information for the contact")
    @Valid
    @NotNull(message = "Address information is required")
    private ContactAddressDto addressDto;
}
