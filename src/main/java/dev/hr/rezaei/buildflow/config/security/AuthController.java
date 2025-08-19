package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.config.mvc.ValidationErrorResponse;
import dev.hr.rezaei.buildflow.config.security.dto.*;
import dev.hr.rezaei.buildflow.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller that handles login, registration, and JWT token management.
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "API endpoints for user authentication and JWT token management")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final JwtTokenProvider tokenProvider;
    private final SecurityAuditService securityAuditService;

    @Operation(
            summary = "Authenticate user",
            description = "Authenticates user credentials and returns a JWT token for subsequent API calls"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Authentication successful",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = JwtAuthenticationResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request data",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ValidationErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid credentials"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
    @PostMapping("/login")
    public ResponseEntity<JwtAuthenticationResponse> authenticateUser(
            @Parameter(description = "User login credentials")
            @Valid @RequestBody LoginRequest loginRequest
    ) {
        log.info("Authentication attempt for username: {}", loginRequest.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            // Get user details for audit logging
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            // Log successful authentication
            securityAuditService.logLoginAttempt(loginRequest.getUsername(), true, "Valid credentials");
            securityAuditService.logTokenGeneration(loginRequest.getUsername());

            log.info("Authentication successful for username: {}", loginRequest.getUsername());
            return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));

        } catch (Exception e) {
            // Log failed authentication attempt
            securityAuditService.logLoginAttempt(loginRequest.getUsername(), false, e.getMessage());
            log.warn("Authentication failed for username: {} - {}", loginRequest.getUsername(), e.getMessage());
            throw e; // Re-throw to let Spring Security handle the response
        }
    }

    @Operation(
            summary = "Register new user",
            description = "Registers a new user account with complete contact information and authentication credentials"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "User registered successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GenericApiResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request data or username already taken",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ValidationErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
    @PostMapping("/register")
    public ResponseEntity<GenericApiResponse> registerUser(
            @Parameter(description = "User registration information including username, password and complete contact details")
            @Valid @RequestBody SignUpRequest signUpRequest
    ) {
        log.info("Registration attempt for username: {} and email: {}",
                signUpRequest.getUsername(), signUpRequest.getContactRequestDto().getEmail());

        try {
            authService.registerUser(signUpRequest);

            // Log successful registration
            securityAuditService.logRegistrationAttempt(
                    signUpRequest.getUsername(),
                    signUpRequest.getContactRequestDto().getEmail(),
                    true,
                    "Registration completed successfully"
            );

            log.info("User registration successful for username: {}", signUpRequest.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new GenericApiResponse(true, "User registered successfully"));

        } catch (IllegalArgumentException e) {
            // Log failed registration attempt
            securityAuditService.logRegistrationAttempt(
                    signUpRequest.getUsername(),
                    signUpRequest.getContactRequestDto().getEmail(),
                    false,
                    e.getMessage()
            );

            log.warn("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new GenericApiResponse(false, e.getMessage()));
        }
    }

    @Operation(
            summary = "Get current user information",
            description = "Returns information about the currently authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Current user information retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserSummary.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User not authenticated"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(
            @Parameter(description = "Current authentication context", hidden = true)
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("Attempt to get current user without authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new GenericApiResponse(false, "User not authenticated"));
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = authService.findUserByUsername(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.info("Retrieved current user information for: {}", user.getUsername());
        return ResponseEntity.ok(new UserSummary(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        ));
    }
}
