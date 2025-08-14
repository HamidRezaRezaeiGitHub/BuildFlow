package dev.hr.rezaei.buildflow.user.dto;

import dev.hr.rezaei.buildflow.user.UserDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@Schema(description = "Response object containing the created owner user information")
public class CreateOwnerResponse {
    @Schema(description = "The created owner user details")
    private UserDto userDto;
}
