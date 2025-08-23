package dev.hr.rezaei.buildflow.config.mvc.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Generic API response DTO.
 */
@Data
@AllArgsConstructor
@Schema(description = "Generic API response containing operation status and message")
public class MessageResponse {

    @Schema(description = "Indicates if the operation was successful", example = "true")
    private boolean success;

    @Schema(description = "Descriptive message about the operation result", example = "User registered successfully")
    private String message;
}
