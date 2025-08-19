package dev.hr.rezaei.buildflow.config.security;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
@Tag(name = "Security Testing", description = "API endpoints for testing security configuration and authentication behavior")
public class SecurityController {

    @Operation(
            summary = "Access public endpoint",
            description = "Returns a message from a public endpoint accessible without authentication"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Public endpoint accessed successfully",
                    content = @Content(
                            mediaType = "text/plain",
                            schema = @Schema(type = "string", example = "This is a public endpoint.")
                    )
            )
    })
    @GetMapping("/public")
    public ResponseEntity<String> publicEndpoint() {
        log.info("Public endpoint accessed");
        return ResponseEntity.ok("This is a public endpoint.");
    }

    @Operation(
            summary = "Access private endpoint",
            description = "Returns a message from a private endpoint that requires authentication"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Private endpoint accessed successfully",
                    content = @Content(
                            mediaType = "text/plain",
                            schema = @Schema(type = "string", example = "This is a private endpoint.")
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access forbidden"
            )
    })
    @GetMapping("/private")
    public ResponseEntity<String> privateEndpoint() {
        log.info("Private endpoint accessed by authenticated user");
        return ResponseEntity.ok("This is a private endpoint.");
    }
}
