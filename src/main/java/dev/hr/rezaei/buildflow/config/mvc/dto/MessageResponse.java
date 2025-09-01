package dev.hr.rezaei.buildflow.config.mvc.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * Generic API response DTO.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(description = "Generic API response containing operation status and message")
public class MessageResponse {

    @Schema(description = "Timestamp when the response was generated")
    private Instant timestamp;

    @Schema(description = "Indicates if the operation was successful", example = "true")
    private boolean success;

    @Schema(description = "HTTP status code of the response", example = "200")
    private String status;

    @Schema(description = "List of messages related to the response")
    private List<String> messages;
}
