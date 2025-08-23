package dev.hr.rezaei.buildflow.config.mvc;

import dev.hr.rezaei.buildflow.base.DuplicateUserException;
import dev.hr.rezaei.buildflow.config.mvc.dto.ErrorResponse;
import dev.hr.rezaei.buildflow.config.security.SecurityAuditService;
import dev.hr.rezaei.buildflow.config.mvc.dto.MessageResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final SecurityAuditService securityAuditService;

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed")
                .errors(errors)
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorType("VALIDATION_ERROR")
                .build();

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
        log.warn("Bad credentials exception: {}", ex.getMessage());

        // Log security event for unauthorized access attempt
        securityAuditService.logUnauthorizedAccess(request.getRequestURI(), request.getMethod());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.FORBIDDEN.value())
                .message("Authentication failed")
                .errors(List.of("Invalid username or password"))
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorType("AUTHENTICATION_ERROR")
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponse> handleDisabledException(DisabledException ex, HttpServletRequest request) {
        log.warn("Disabled account exception: {}", ex.getMessage());

        // Log security event for disabled account access attempt
        securityAuditService.logSecurityEvent("DISABLED_ACCOUNT_ACCESS",
                "Access attempt with disabled account",
                Map.of("endpoint", request.getRequestURI(), "method", request.getMethod()));

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .message("Authentication failed")
                .errors(List.of("Account is disabled"))
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorType("AUTHENTICATION_ERROR")
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ErrorResponse> handleLockedException(LockedException ex, HttpServletRequest request) {
        log.warn("Locked account exception: {}", ex.getMessage());

        // Log security event for locked account access attempt
        securityAuditService.logSecurityEvent("LOCKED_ACCOUNT_ACCESS",
                "Access attempt with locked account",
                Map.of("endpoint", request.getRequestURI(), "method", request.getMethod()));

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .message("Authentication failed")
                .errors(List.of("Account is locked"))
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorType("AUTHENTICATION_ERROR")
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateUserException(DuplicateUserException ex, HttpServletRequest request) {
        log.warn("Duplicate user exception: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.CONFLICT.value())
                .message("Resource conflict occurred")
                .errors(List.of("Username is already taken"))
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorType("CONFLICT_ERROR")
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        log.warn("Illegal argument exception: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Bad request")
                .errors(List.of(ex.getMessage()))
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorType("BAD_REQUEST_ERROR")
                .build();

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error occurred", ex);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("Internal server error occurred")
                .errors(List.of("An unexpected error occurred"))
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorType("INTERNAL_SERVER_ERROR")
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
