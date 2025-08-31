package dev.hr.rezaei.buildflow.config.mvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hr.rezaei.buildflow.base.DuplicateUserException;
import dev.hr.rezaei.buildflow.config.mvc.dto.ErrorResponse;
import dev.hr.rezaei.buildflow.config.security.SecurityAuditService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static dev.hr.rezaei.buildflow.config.mvc.ResponseErrorType.*;
import static org.springframework.http.HttpStatus.*;

@ControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final SecurityAuditService securityAuditService;
    private final ObjectMapper objectMapper;

    // =========================
    // Controller Exception Handlers
    // =========================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        ErrorResponse errorResponse = createErrorResponse(BAD_REQUEST, VALIDATION_ERROR, errors, request);

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
        log.warn("Bad credentials exception: {}", ex.getMessage());
        return unauthorized(request, List.of("Invalid username or password"));
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponse> handleDisabledException(DisabledException ex, HttpServletRequest request) {
        log.warn("Disabled account exception: {}", ex.getMessage());
        return unauthorized(request, List.of("Account is disabled"));
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ErrorResponse> handleLockedException(LockedException ex, HttpServletRequest request) {
        log.warn("Locked account exception: {}", ex.getMessage());
        return unauthorized(request, List.of("Account is locked"));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {
        log.warn("Authentication exception: {}", ex.getMessage());
        return unauthorized(request, List.of("Authentication failed"));
    }

    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateUserException(DuplicateUserException ex, HttpServletRequest request) {
        log.warn("Duplicate user exception: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(CONFLICT, CONFLICT_ERROR, List.of("Username is already taken"), request);

        return ResponseEntity.status(CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        log.warn("Illegal argument exception: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(BAD_REQUEST, BAD_REQUEST_ERROR, List.of(ex.getMessage()), request);

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error occurred", ex);

        ErrorResponse errorResponse = createErrorResponse(INTERNAL_SERVER_ERROR, INTERNAL_ERROR, List.of("An unexpected error occurred"), request);

        return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    // =========================
    // Security Exception Handlers (for SecurityExceptionHandler delegation)
    // =========================

    /**
     * Handles authentication entry point failures (401 Unauthorized)
     * Called by SecurityExceptionHandler.commence()
     */
    public void handleAuthenticationException(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        log.warn("Authentication entry point called: {}", authException.getMessage());

        ErrorResponse errorResponse = createSecurityErrorResponse(
                UNAUTHORIZED,
                AUTHENTICATION_REQUIRED,
                List.of("You must be authenticated to access this resource"),
                request,
                () -> securityAuditService.logUnauthorizedAccess(request.getRequestURI(), request.getMethod())
        );

        writeErrorResponse(response, errorResponse, UNAUTHORIZED);
    }

    /**
     * Handles access denied failures (403 Forbidden)
     * Called by SecurityExceptionHandler.handle()
     */
    public void handleAccessDeniedException(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        log.warn("Access denied: {}", accessDeniedException.getMessage());

        ErrorResponse errorResponse = createSecurityErrorResponse(
                FORBIDDEN,
                ACCESS_DENIED,
                List.of("You don't have permission to access this resource"),
                request,
                () -> securityAuditService.logSecurityEvent(
                        "ACCESS_DENIED",
                        "Access denied to protected resource",
                        Map.of("endpoint", request.getRequestURI(), "method", request.getMethod())
                )
        );

        writeErrorResponse(response, errorResponse, FORBIDDEN);
    }

    // =========================
    // Private Utility Methods
    // =========================

    private ResponseEntity<ErrorResponse> unauthorized(HttpServletRequest request, List<String> errors) {
        ErrorResponse errorResponse = createSecurityErrorResponse(
                UNAUTHORIZED,
                AUTHENTICATION_REQUIRED,
                errors,
                request,
                () -> securityAuditService.logUnauthorizedAccess(request.getRequestURI(), request.getMethod())
        );

        return ResponseEntity.status(UNAUTHORIZED).body(errorResponse);
    }

    /**
     * Creates a security error response with audit logging using default message
     */
    private ErrorResponse createSecurityErrorResponse(HttpStatus status, ResponseErrorType errorType, List<String> errors, HttpServletRequest request, Runnable auditAction) {
        // Execute audit logging action
        auditAction.run();

        return createErrorResponse(status, errorType, errors, request);
    }

    /**
     * Creates a standard error response using default message from error type
     */
    private ErrorResponse createErrorResponse(HttpStatus status, ResponseErrorType errorType, List<String> errors, HttpServletRequest request) {
        return createErrorResponse(status, errorType.getDefaultMessage(), errors, request, errorType);
    }

    /**
     * Creates a standard error response with custom message
     */
    private ErrorResponse createErrorResponse(HttpStatus status, String message, List<String> errors, HttpServletRequest request, ResponseErrorType errorType) {
        return ErrorResponse.builder()
                .timestamp(Instant.now())
                .status(status.toString())
                .message(message)
                .errors(errors)
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorType(errorType)
                .build();
    }

    /**
     * Writes error response to HTTP response for security handlers
     */
    private void writeErrorResponse(HttpServletResponse response, ErrorResponse errorResponse, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String jsonResponse = objectMapper.writeValueAsString(errorResponse);
        response.getWriter().write(jsonResponse);
    }
}
