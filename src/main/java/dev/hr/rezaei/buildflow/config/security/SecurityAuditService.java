package dev.hr.rezaei.buildflow.config.security;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.util.Map;

/**
 * Security audit logging service to track authentication and authorization events.
 * Provides comprehensive logging for security monitoring and compliance.
 */
@Slf4j
@Service
public class SecurityAuditService {

    private static final String SECURITY_AUDIT_LOGGER = "SECURITY_AUDIT";

    public void logLoginAttempt(String username, boolean successful, String reason) {
        String clientIp = getClientIpAddress();
        String userAgent = getUserAgent();

        if (successful) {
            log.info("[{}] LOGIN_SUCCESS - User: {}, IP: {}, UserAgent: {}, Timestamp: {}",
                    SECURITY_AUDIT_LOGGER, username, clientIp, userAgent, Instant.now());
        } else {
            log.warn("[{}] LOGIN_FAILED - User: {}, IP: {}, UserAgent: {}, Reason: {}, Timestamp: {}",
                    SECURITY_AUDIT_LOGGER, username, clientIp, userAgent, reason, Instant.now());
        }
    }

    public void logRegistrationAttempt(String username, String email, boolean successful, String reason) {
        String clientIp = getClientIpAddress();
        String userAgent = getUserAgent();

        if (successful) {
            log.info("[{}] REGISTRATION_SUCCESS - User: {}, Email: {}, IP: {}, UserAgent: {}, Timestamp: {}",
                    SECURITY_AUDIT_LOGGER, username, email, clientIp, userAgent, Instant.now());
        } else {
            log.warn("[{}] REGISTRATION_FAILED - User: {}, Email: {}, IP: {}, UserAgent: {}, Reason: {}, Timestamp: {}",
                    SECURITY_AUDIT_LOGGER, username, email, clientIp, userAgent, reason, Instant.now());
        }
    }

    public void logTokenGeneration(String username) {
        String clientIp = getClientIpAddress();

        log.info("[{}] TOKEN_GENERATED - User: {}, IP: {}, Timestamp: {}",
                SECURITY_AUDIT_LOGGER, username, clientIp, Instant.now());
    }

    public void logTokenValidationFailure(String reason, String token) {
        String clientIp = getClientIpAddress();
        // Only log first few characters of token for security
        String tokenPrefix = token != null && token.length() > 10 ? token.substring(0, 10) + "..." : "invalid";

        log.warn("[{}] TOKEN_VALIDATION_FAILED - Reason: {}, TokenPrefix: {}, IP: {}, Timestamp: {}",
                SECURITY_AUDIT_LOGGER, reason, tokenPrefix, clientIp, Instant.now());
    }

    public void logUnauthorizedAccess(String endpoint, String method) {
        String clientIp = getClientIpAddress();
        String userAgent = getUserAgent();

        log.warn("[{}] UNAUTHORIZED_ACCESS - Endpoint: {} {}, IP: {}, UserAgent: {}, Timestamp: {}",
                SECURITY_AUDIT_LOGGER, method, endpoint, clientIp, userAgent, Instant.now());
    }

    public void logRateLimitViolation(String clientIp, String endpoint) {
        log.warn("[{}] RATE_LIMIT_VIOLATION - IP: {}, Endpoint: {}, Timestamp: {}",
                SECURITY_AUDIT_LOGGER, clientIp, endpoint, Instant.now());
    }

    public void logPasswordChangeAttempt(String username, boolean successful) {
        String clientIp = getClientIpAddress();

        if (successful) {
            log.info("[{}] PASSWORD_CHANGED - User: {}, IP: {}, Timestamp: {}",
                    SECURITY_AUDIT_LOGGER, username, clientIp, Instant.now());
        } else {
            log.warn("[{}] PASSWORD_CHANGE_FAILED - User: {}, IP: {}, Timestamp: {}",
                    SECURITY_AUDIT_LOGGER, username, clientIp, Instant.now());
        }
    }

    public void logAccountLockout(String username, String reason) {
        String clientIp = getClientIpAddress();

        log.warn("[{}] ACCOUNT_LOCKED - User: {}, IP: {}, Reason: {}, Timestamp: {}",
                SECURITY_AUDIT_LOGGER, username, clientIp, reason, Instant.now());
    }

    public void logSecurityEvent(String eventType, String description, Map<String, Object> additionalData) {
        String clientIp = getClientIpAddress();

        log.info("[{}] {} - Description: {}, IP: {}, Data: {}, Timestamp: {}",
                SECURITY_AUDIT_LOGGER, eventType, description, clientIp, additionalData, Instant.now());
    }

    protected String getClientIpAddress() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();

                // Check for X-Forwarded-For header (load balancer/proxy)
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    return xForwardedFor.split(",")[0].trim();
                }

                // Check for X-Real-IP header (nginx proxy)
                String xRealIp = request.getHeader("X-Real-IP");
                if (xRealIp != null && !xRealIp.isEmpty()) {
                    return xRealIp;
                }

                // Fall back to remote address
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            log.debug("Could not determine client IP address", e);
        }
        return "unknown";
    }

    protected String getUserAgent() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String userAgent = request.getHeader("User-Agent");
                return userAgent != null ? userAgent : "unknown";
            }
        } catch (Exception e) {
            log.debug("Could not determine user agent", e);
        }
        return "unknown";
    }
}
