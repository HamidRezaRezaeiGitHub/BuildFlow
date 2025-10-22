package dev.hr.rezaei.buildflow.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hr.rezaei.buildflow.config.mvc.dto.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import static dev.hr.rezaei.buildflow.config.mvc.ResponseErrorType.RATE_LIMIT_EXCEEDED;
import static org.springframework.http.HttpStatus.TOO_MANY_REQUESTS;

/**
 * Rate limiting filter to prevent brute force attacks on authentication endpoints.
 * Implements a sliding window rate limiting algorithm with automatic cleanup.
 */
@Slf4j
@Component
@ConditionalOnProperty(prefix = "spring.security", name = "enabled", havingValue = "true", matchIfMissing = true)
@Order(1) // Execute before other filters
public class RateLimitingFilter extends OncePerRequestFilter {

    public static final int MAX_ATTEMPTS_PER_WINDOW = 5;
    public static final int WINDOW_SIZE_MINUTES = 15;
    public static final int LOCKOUT_DURATION_MINUTES = 30;

    private final ConcurrentHashMap<String, RateLimitEntry> attemptMap = new ConcurrentHashMap<>();
    private final SecurityAuditService securityAuditService;
    private final ObjectMapper objectMapper;

    public RateLimitingFilter(SecurityAuditService securityAuditService, ObjectMapper objectMapper) {
        this.securityAuditService = securityAuditService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        if (shouldApplyRateLimit(requestURI)) {
            String clientKey = getClientKey(request);

            if (isRateLimited(clientKey)) {
                securityAuditService.logRateLimitViolation(clientKey, requestURI);

                ErrorResponse errorResponse = ErrorResponse.builder()
                        .timestamp(Instant.now())
                        .status(TOO_MANY_REQUESTS.toString())
                        .message(RATE_LIMIT_EXCEEDED.getDefaultMessage())
                        .errors(List.of("Rate limit exceeded. Please try again in " + LOCKOUT_DURATION_MINUTES + " minutes."))
                        .path(requestURI)
                        .method(request.getMethod())
                        .errorType(RATE_LIMIT_EXCEEDED)
                        .build();

                response.setStatus(TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setCharacterEncoding("UTF-8");

                String jsonResponse = objectMapper.writeValueAsString(errorResponse);
                response.getWriter().write(jsonResponse);
                return;
            }

            // Record the attempt
            recordAttempt(clientKey);
        }

        filterChain.doFilter(request, response);
    }

    private boolean shouldApplyRateLimit(String requestURI) {
        return requestURI.startsWith("/api/auth/login") ||
                requestURI.startsWith("/api/auth/register") ||
                requestURI.startsWith("/api/auth/refresh") ||
                requestURI.startsWith("/api/auth/validate") ||
                requestURI.startsWith("/api/auth/logout");
    }

    private String getClientKey(HttpServletRequest request) {
        // Use X-Forwarded-For header if behind proxy, otherwise use remote address
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private boolean isRateLimited(String clientKey) {
        RateLimitEntry entry = attemptMap.get(clientKey);
        if (entry == null) {
            return false;
        }

        LocalDateTime now = LocalDateTime.now();

        // Check if client is in lockout period
        if (entry.isLockedOut() && entry.getLockoutUntil().isAfter(now)) {
            return true;
        }

        // Reset if lockout period has expired
        if (entry.isLockedOut() && entry.getLockoutUntil().isBefore(now)) {
            entry.reset();
            return false;
        }

        // Clean up old attempts outside the window
        entry.cleanupOldAttempts(now);

        // Check if within rate limit
        return entry.getAttemptCount() >= MAX_ATTEMPTS_PER_WINDOW;
    }

    private void recordAttempt(String clientKey) {
        LocalDateTime now = LocalDateTime.now();

        attemptMap.computeIfAbsent(clientKey, k -> new RateLimitEntry())
                .addAttempt(now);

        RateLimitEntry entry = attemptMap.get(clientKey);

        // Check if should be locked out
        if (entry.getAttemptCount() >= MAX_ATTEMPTS_PER_WINDOW && !entry.isLockedOut()) {
            entry.lockout(now.plusMinutes(LOCKOUT_DURATION_MINUTES));

            // Log account lockout due to rate limiting
            securityAuditService.logAccountLockout(clientKey,
                    "Rate limit exceeded - " + MAX_ATTEMPTS_PER_WINDOW + " attempts in " + WINDOW_SIZE_MINUTES + " minutes");
        }
    }

    /**
     * Internal class to track rate limiting data for each client
     */
    protected static class RateLimitEntry {
        private final ConcurrentHashMap<LocalDateTime, AtomicInteger> attempts = new ConcurrentHashMap<>();
        private volatile boolean lockedOut = false;
        private volatile LocalDateTime lockoutUntil;

        void addAttempt(LocalDateTime timestamp) {
            attempts.computeIfAbsent(timestamp.truncatedTo(ChronoUnit.MINUTES),
                    k -> new AtomicInteger(0)).incrementAndGet();
        }

        int getAttemptCount() {
            return attempts.values().stream()
                    .mapToInt(AtomicInteger::get)
                    .sum();
        }

        void cleanupOldAttempts(LocalDateTime now) {
            LocalDateTime cutoff = now.minusMinutes(WINDOW_SIZE_MINUTES);
            attempts.entrySet().removeIf(entry -> entry.getKey().isBefore(cutoff));
        }

        void lockout(LocalDateTime until) {
            this.lockedOut = true;
            this.lockoutUntil = until;
        }

        void reset() {
            this.lockedOut = false;
            this.lockoutUntil = null;
            this.attempts.clear();
        }

        boolean isLockedOut() {
            return lockedOut;
        }

        LocalDateTime getLockoutUntil() {
            return lockoutUntil;
        }
    }
}
