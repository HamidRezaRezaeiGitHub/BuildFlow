package dev.hr.rezaei.buildflow.config.mvc;

import dev.hr.rezaei.buildflow.user.DuplicateUserException;
import dev.hr.rezaei.buildflow.base.UserNotAuthorizedException;
import dev.hr.rezaei.buildflow.user.UserNotFoundException;
import dev.hr.rezaei.buildflow.config.mvc.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import static dev.hr.rezaei.buildflow.config.mvc.ResponseErrorType.BAD_REQUEST_ERROR;
import static dev.hr.rezaei.buildflow.config.mvc.ResponseErrorType.VALIDATION_ERROR;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@ControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final ResponseFacilitator responseFacilitator;

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
        log.warn("Validation errors: {}", errors);
        return responseFacilitator.badRequest(request, VALIDATION_ERROR, errors);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
        log.warn("Bad credentials exception: {}", ex.getMessage());
        return responseFacilitator.unauthorized(request, List.of("Invalid username or password"));
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponse> handleDisabledException(DisabledException ex, HttpServletRequest request) {
        log.warn("Disabled account exception: {}", ex.getMessage());
        return responseFacilitator.unauthorized(request, List.of("Account is disabled"));
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ErrorResponse> handleLockedException(LockedException ex, HttpServletRequest request) {
        log.warn("Locked account exception: {}", ex.getMessage());
        return responseFacilitator.unauthorized(request, List.of("Account is locked"));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {
        log.warn("Authentication exception: {}", ex.getMessage());
        return responseFacilitator.unauthorized(request, List.of("Authentication failed"));
    }

    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateUserException(DuplicateUserException ex, HttpServletRequest request) {
        log.warn("Duplicate user exception: {}", ex.getMessage());
        return responseFacilitator.conflict(request, List.of(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        log.warn("Illegal argument exception: {}", ex.getMessage());
        return responseFacilitator.badRequest(request, BAD_REQUEST_ERROR, List.of(ex.getMessage()));
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAuthorizationDeniedException(AuthorizationDeniedException ex, HttpServletRequest request) {
        log.warn("Authorization denied exception: {}", ex.getMessage());
        return responseFacilitator.forbidden(request, List.of("You don't have permission to access this resource"));
    }

    @ExceptionHandler(UserNotAuthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUserNotAuthorizedException(UserNotAuthorizedException ex, HttpServletRequest request) {
        log.warn("User not authorized exception: {}", ex.getMessage());
        return responseFacilitator.forbidden(request, List.of(ex.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException ex, HttpServletRequest request) {
        log.warn("User not found exception: {}", ex.getMessage());
        return responseFacilitator.notFound(request, List.of(ex.getMessage()));
    }

    @ExceptionHandler(dev.hr.rezaei.buildflow.project.ProjectNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleProjectNotFoundException(dev.hr.rezaei.buildflow.project.ProjectNotFoundException ex, HttpServletRequest request) {
        log.warn("Project not found exception: {}", ex.getMessage());
        return responseFacilitator.notFound(request, List.of(ex.getMessage()));
    }

    @ExceptionHandler(dev.hr.rezaei.buildflow.user.ContactNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleContactNotFoundException(dev.hr.rezaei.buildflow.user.ContactNotFoundException ex, HttpServletRequest request) {
        log.warn("Contact not found exception: {}", ex.getMessage());
        return responseFacilitator.notFound(request, List.of(ex.getMessage()));
    }

    @ExceptionHandler(dev.hr.rezaei.buildflow.project.ParticipantNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleParticipantNotFoundException(dev.hr.rezaei.buildflow.project.ParticipantNotFoundException ex, HttpServletRequest request) {
        log.warn("Participant not found exception: {}", ex.getMessage());
        return responseFacilitator.notFound(request, List.of(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error occurred", ex);
        return responseFacilitator.internalServerError(request, List.of("An unexpected error occurred"));
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
        ErrorResponse errorResponse = responseFacilitator.unauthorized(request, List.of("You must be authenticated to access this resource")).getBody();
        responseFacilitator.writeErrorResponse(response, errorResponse, UNAUTHORIZED);
    }

    /**
     * Handles access denied failures (403 Forbidden)
     * Called by SecurityExceptionHandler.handle()
     */
    public void handleAccessDeniedException(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        log.warn("Access denied: {}", accessDeniedException.getMessage());
        ErrorResponse errorResponse = responseFacilitator.forbidden(request, List.of("You don't have permission to access this resource")).getBody();
        responseFacilitator.writeErrorResponse(response, errorResponse, FORBIDDEN);
    }
}
