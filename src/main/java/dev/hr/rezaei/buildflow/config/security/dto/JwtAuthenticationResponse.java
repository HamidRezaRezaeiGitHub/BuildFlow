package dev.hr.rezaei.buildflow.config.security.dto;

import dev.hr.rezaei.buildflow.config.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.Instant;
import java.util.Date;

/**
 * Response DTO containing JWT token.
 */
@Data
@Schema(description = "Response object containing JWT authentication token")
public class JwtAuthenticationResponse {

    @Schema(description = "Token type", example = "Bearer", defaultValue = "Bearer")
    private String tokenType = "Bearer";

    @Schema(description = "JWT access token for API authentication", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;

    @Schema(description = "Expiration date and time of the token in ISO 8601 format", example = "2024-12-31T23:59:59Z")
    private Instant expiryDate;

    @Schema(description = "Time in seconds until the token expires", example = "3600")
    private long expiresInSeconds;

    public JwtAuthenticationResponse(JwtTokenProvider.Token token) {
        this.accessToken = token.getValue();
        Date date = token.getExpiryDate();
        this.expiryDate = date.toInstant();
        this.expiresInSeconds = (date.getTime() - System.currentTimeMillis()) / 1000;
    }

}
