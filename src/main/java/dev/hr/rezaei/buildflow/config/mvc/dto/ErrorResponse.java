package dev.hr.rezaei.buildflow.config.mvc.dto;

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
@Schema(description = "Unified error response for all types of errors")
public class ErrorResponse {

    @Schema(description = "Timestamp when the error occurred")
    private Instant timestamp;

    @Schema(description = "HTTP status code")
    private int status;

    @Schema(description = "Error message describing the failure")
    private String message;

    @Schema(description = "List of specific error details")
    private List<String> errors;

    @Schema(description = "Request path where the error occurred")
    private String path;

    @Schema(description = "HTTP method")
    private String method;

    @Schema(description = "Type of error that occurred")
    private String errorType;
}
