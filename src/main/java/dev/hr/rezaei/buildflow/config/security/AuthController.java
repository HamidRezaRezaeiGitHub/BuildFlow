package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.config.mvc.dto.ErrorResponse;
import dev.hr.rezaei.buildflow.config.mvc.dto.MessageResponse;
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

    @Operation(summary = "Authenticate user", description = "Authenticates user credentials and returns a JWT token for subsequent API calls")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authentication successful",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = JwtAuthenticationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request data",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<JwtAuthenticationResponse> authenticateUser(
            @Parameter(description = "User login credentials")
            @Valid @RequestBody LoginRequest loginRequest
    ) {
        log.info("Authentication attempt for username: {}", loginRequest.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        // Log successful authentication
        securityAuditService.logLoginAttempt(loginRequest.getUsername(), true, "Valid credentials");
        securityAuditService.logTokenGeneration(loginRequest.getUsername());

        log.info("Authentication successful for username: {}", loginRequest.getUsername());
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @Operation(summary = "Register new user", description = "Registers a new user account with complete contact information and authentication credentials")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request data",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Username already taken",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerUser(
            @Parameter(description = "User registration information including username, password and complete contact details")
            @Valid @RequestBody SignUpRequest signUpRequest
    ) {
        log.info("Registration attempt for username: {} and email: {}",
                signUpRequest.getUsername(),
                signUpRequest.getContactRequestDto().getEmail());

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
                .body(new MessageResponse(true, "User registered successfully"));
    }

    @Operation(summary = "Get current user information", description = "Returns information about the currently authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User information retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserSummary.class))),
            @ApiResponse(responseCode = "401", description = "User not authenticated",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(
            @Parameter(description = "Current authentication context", hidden = true)
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("Attempt to get current user without authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse(false, "User not authenticated"));
        }

        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = authService.findUserByUsername(userPrincipal.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            log.info("Retrieved current user information for: {}", user.getUsername());
            return ResponseEntity.ok(new UserSummary(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail()
            ));
        } catch (Exception e) {
            log.error("Error retrieving current user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse(false, "Failed to retrieve user information"));
        }
    }

    @Operation(summary = "Refresh JWT token", description = "Refreshes an existing JWT token if it's still valid")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = JwtAuthenticationResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid or expired token",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("Attempt to refresh token without valid authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse(false, "Invalid authentication"));
        }

        try {
            String newJwt = tokenProvider.generateToken(authentication);
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            securityAuditService.logTokenGeneration(userPrincipal.getUsername());
            log.info("Token refreshed for username: {}", userPrincipal.getUsername());

            return ResponseEntity.ok(new JwtAuthenticationResponse(newJwt));
        } catch (Exception e) {
            log.error("Token refresh failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse(false, "Token refresh failed"));
        }
    }

    @Operation(summary = "Logout user", description = "Invalidates the current user session (client-side logout for stateless JWT)")
    @ApiResponse(responseCode = "200", description = "Logout successful",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class)))
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            log.info("User logout: {}", userPrincipal.getUsername());
            securityAuditService.logSecurityEvent("LOGOUT",
                    "User logged out",
                    java.util.Map.of("username", userPrincipal.getUsername()));
        }

        // Clear security context
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(new MessageResponse(true, "Logout successful"));
    }

    @Operation(summary = "Validate JWT token", description = "Validates if the provided JWT token is still valid")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token is valid",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class))),
            @ApiResponse(responseCode = "401", description = "Token is invalid",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/validate")
    public ResponseEntity<MessageResponse> validateToken(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok(new MessageResponse(true, "Token is valid"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse(false, "Token is invalid"));
        }
    }
}
