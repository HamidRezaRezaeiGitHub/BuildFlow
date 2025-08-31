package dev.hr.rezaei.buildflow.config.mvc;

import lombok.Getter;

/**
 * Enum representing different types of errors that can occur in the application.
 * Used to categorize errors for consistent error handling and client-side processing.
 */
@Getter
public enum ResponseErrorType {
    VALIDATION_ERROR("Validation Error", "Validation failed"),
    AUTHENTICATION_ERROR("Authentication Error", "Authentication failed"),
    AUTHENTICATION_REQUIRED("Authentication Required", "Authentication required"),
    ACCESS_DENIED("Access Denied", "Access denied"),
    CONFLICT_ERROR("Conflict Error", "Resource conflict occurred"),
    BAD_REQUEST_ERROR("Bad Request Error", "Bad request"),
    RATE_LIMIT_EXCEEDED("Rate Limit Exceeded", "Too many requests. Please try again later."),
    INTERNAL_ERROR("Internal Error", "Internal server error occurred");

    private final String description;
    private final String defaultMessage;

    ResponseErrorType(String description, String defaultMessage) {
        this.description = description;
        this.defaultMessage = defaultMessage;
    }

    @Override
    public String toString() {
        return this.name();
    }
}
