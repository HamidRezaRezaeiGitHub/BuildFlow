package dev.hr.rezaei.buildflow.user.dto;

import dev.hr.rezaei.buildflow.user.UserDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.SuperBuilder;

/**
 * CreateBuilderResponse representing response object containing created builder user information.
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
@Schema(description = "Response object containing the created builder user information")
public class CreateBuilderResponse {
    @Schema(description = "The created builder user details")
    private UserDto userDto;
}
