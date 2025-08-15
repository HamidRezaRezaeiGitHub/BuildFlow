package dev.hr.rezaei.buildflow.config.mvc;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(
        description = "Validation error response containing detailed error information",
        example = """
                {
                  "timestamp": "2025-08-15T16:12:51.640038Z",
                  "status": 400,
                  "message": "Validation Failed",
                  "errors": [
                    "Builder user ID is required",
                    "Contact information is required",
                    "Street name is required"
                  ]
                }"""
)
public class ValidationErrorResponse {
    @Schema(description = "Timestamp when the error occurred", example = "2025-08-15T16:12:51.640038Z")
    private Instant timestamp;

    @Schema(description = "HTTP status code", example = "400")
    private int status;

    @Schema(description = "Error message describing the validation failure", example = "Validation Failed")
    private String message;

    @Schema(description = "List of specific validation error messages", example = "[\"Builder user ID is required\", \"Contact information is required\"]")
    private List<String> errors;
}
