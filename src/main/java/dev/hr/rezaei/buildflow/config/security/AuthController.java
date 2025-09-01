package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.config.mvc.ResponseFacilitator;
import dev.hr.rezaei.buildflow.config.mvc.dto.ErrorResponse;
import dev.hr.rezaei.buildflow.config.mvc.dto.MessageResponse;
import dev.hr.rezaei.buildflow.config.security.dto.JwtAuthenticationResponse;
import dev.hr.rezaei.buildflow.config.security.dto.LoginRequest;
import dev.hr.rezaei.buildflow.config.security.dto.SignUpRequest;
import dev.hr.rezaei.buildflow.config.security.dto.UserSummaryResponse;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.dto.CreateUserResponse;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
    private final ResponseFacilitator responseFacilitator;

    @Operation(summary = "Register new user", description = "Registers a new user account with complete contact information and authentication credentials")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CreateUserResponse.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<CreateUserResponse> registerUser(
            @Parameter(description = "User registration information including username, password and complete contact details")
            @Valid @RequestBody SignUpRequest signUpRequest
    ) {
        log.info("Registration attempt with SingUpRequest: {}", signUpRequest);

        CreateUserResponse response = authService.registerUser(signUpRequest);

        log.info("User registration successful for username: {}", response.getUserDto().getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Authenticate user", description = "Authenticates user credentials and returns a JWT token for subsequent API calls")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authentication successful",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = JwtAuthenticationResponse.class)))
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

    @Operation(summary = "Get current user information", description = "Returns information about the currently authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User information retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserSummaryResponse.class)))
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/current")
    public ResponseEntity<UserSummaryResponse> getCurrentUser(
            @Parameter(description = "Current authentication context", hidden = true)
            Authentication authentication
    ) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = authService.findUserByUsername(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.info("Retrieved current user information for: {}", user.getUsername());
        return ResponseEntity.ok(UserSummaryResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(userPrincipal.getRole().name())
                .build());
    }

    @Operation(summary = "Refresh JWT token", description = "Refreshes an existing JWT token if it's still valid")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = JwtAuthenticationResponse.class)))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(Authentication authentication) {
        String newJwt = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        securityAuditService.logTokenGeneration(userPrincipal.getUsername());
        log.info("Token refreshed for username: {}", userPrincipal.getUsername());

        return ResponseEntity.ok(new JwtAuthenticationResponse(newJwt));
    }

    @Operation(summary = "Logout user", description = "Invalidates the current user session (client-side logout for stateless JWT)")
    @ApiResponse(responseCode = "200", description = "Logout successful",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class)))
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            log.info("User logout: {}", userPrincipal.getUsername());
            securityAuditService.logSecurityEvent("LOGOUT",
                    "User logged out",
                    Map.of("username", userPrincipal.getUsername()));
        }

        // Clear security context
        SecurityContextHolder.clearContext();

        return responseFacilitator.ok("Logout successful");
    }

    @Operation(summary = "Validate JWT token", description = "Validates if the provided JWT token is still valid")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token is valid",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class))),
            @ApiResponse(responseCode = "401", description = "Token is invalid",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/validate")
    public ResponseEntity<MessageResponse> validateToken(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return responseFacilitator.ok("Token is valid");
        } else {
            return responseFacilitator.message(HttpStatus.UNAUTHORIZED, "Token is invalid");
        }
    }

    @Operation(summary = "Create admin user", description = "Creates a new user with admin privileges. Requires admin role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Admin user created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CreateUserResponse.class))),
            @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Hidden
    public ResponseEntity<CreateUserResponse> createAdminUser(
            @Parameter(description = "Admin user registration information")
            @Valid @RequestBody SignUpRequest signUpRequest,
            Authentication authentication
    ) {
        UserPrincipal currentUser = (UserPrincipal) authentication.getPrincipal();
        String currentUserUsername = currentUser.getUsername();
        String newAdminUsername = signUpRequest.getUsername();
        log.info("Admin user creation attempt by: {} for new user: {}", currentUserUsername, newAdminUsername);

        CreateUserResponse response = authService.createAdminUser(signUpRequest);

        securityAuditService.logSecurityEvent("ADMIN_USER_CREATED", "Admin user created",
                Map.of(
                        "createdBy", currentUserUsername,
                        "newAdminUser", response.getUserDto().getUsername()
                ));

        log.info("Admin user creation successful for username: {} by admin: {}", response.getUserDto().getUsername(), currentUserUsername);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
