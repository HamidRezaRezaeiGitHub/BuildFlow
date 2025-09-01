package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.config.mvc.dto.ErrorResponse;
import dev.hr.rezaei.buildflow.user.dto.CreateUserRequest;
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
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "API endpoints for managing users including builders and owners")
@Hidden
public class UserController {

    private final UserService userService;

    @Operation(summary = "Create a new user", description = "Creates a new user with contact information, username, and registration status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CreateUserResponse.class)))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<CreateUserResponse> createUser(
            @Parameter(description = "User creation request data")
            @Valid @RequestBody CreateUserRequest request
    ) {
        log.info("Creating user with request: {}", request);

        CreateUserResponse response = userService.createUser(request);

        log.info("Successfully created user with ID: {}", response.getUserDto().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get user by username", description = "Retrieves a user by their username")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserDto.class))),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUserByUsername(
            @Parameter(description = "Username of the user to retrieve")
            @PathVariable String username
    ) {
        log.info("Getting user with username: {}", username);

        UserDto userDto = userService.getUserDtoByUsername(username);

        log.info("Successfully found user with username: {}", username);
        return ResponseEntity.ok(userDto);
    }
}
