package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.config.mvc.ValidationErrorResponse;
import dev.hr.rezaei.buildflow.user.dto.CreateBuilderRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateBuilderResponse;
import dev.hr.rezaei.buildflow.user.dto.CreateOwnerRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateOwnerResponse;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "API endpoints for managing users including builders and owners")
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "Create a new builder",
            description = "Creates a new builder user with contact information and registration status"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Builder created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CreateBuilderResponse.class)
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
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
    @PostMapping("/builders")
    public ResponseEntity<CreateBuilderResponse> createBuilder(
            @Parameter(description = "Builder creation request containing contact information and registration status")
            @Valid @RequestBody CreateBuilderRequest request
    ) {
        log.info("Creating builder with request: {}", request);

        CreateBuilderResponse response = userService.createBuilder(request);

        log.info("Successfully created builder with ID: {}", response.getUserDto().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
            summary = "Create a new owner",
            description = "Creates a new owner user with contact information and registration status"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Owner created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CreateOwnerResponse.class)
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
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
    @PostMapping("/owners")
    public ResponseEntity<CreateOwnerResponse> createOwner(
            @Parameter(description = "Owner creation request containing contact information and registration status")
            @Valid @RequestBody CreateOwnerRequest request
    ) {
        log.info("Creating owner with request: {}", request);

        CreateOwnerResponse response = userService.createOwner(request);

        log.info("Successfully created owner with ID: {}", response.getUserDto().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
