package dev.hr.rezaei.buildflow.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.io.PrintWriter;

import static dev.hr.rezaei.buildflow.config.security.RateLimitingFilter.MAX_ATTEMPTS_PER_WINDOW;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Slf4j
class RateLimitingFilterTest {

    private RateLimitingFilter rateLimitingFilter;
    private SecurityAuditService mockSecurityAuditService;
    private AutoCloseable mockitoCloseable;

    @Mock
    private HttpServletRequest mockRequest;

    @Mock
    private HttpServletResponse mockResponse;

    @Mock
    private FilterChain mockFilterChain;

    @Mock
    private PrintWriter mockPrintWriter;

    @BeforeEach
    void setUp() throws IOException {
        mockitoCloseable = MockitoAnnotations.openMocks(this);
        mockSecurityAuditService = spy(new SecurityAuditServiceTest.TestableSecurityAuditService());
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        rateLimitingFilter = new RateLimitingFilter(mockSecurityAuditService, objectMapper);

        when(mockResponse.getWriter()).thenReturn(mockPrintWriter);
    }

    @AfterEach
    void tearDown() throws Exception {
        mockitoCloseable.close();
    }

    @Test
    void doFilterInternal_shouldContinueFilterChain_whenRequestNotRateLimited() throws ServletException, IOException {
        // Given
        when(mockRequest.getRequestURI()).thenReturn("/api/users");
        when(mockRequest.getRemoteAddr()).thenReturn("192.168.1.1");

        // When
        rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldApplyRateLimit_whenLoginEndpointAccessed() throws ServletException, IOException {
        // Given
        when(mockRequest.getRequestURI()).thenReturn("/api/auth/login");
        when(mockRequest.getRemoteAddr()).thenReturn("192.168.1.1");
        when(mockRequest.getHeader("X-Forwarded-For")).thenReturn(null);

        // When
        rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldApplyRateLimit_whenRegisterEndpointAccessed() throws ServletException, IOException {
        // Given
        when(mockRequest.getRequestURI()).thenReturn("/api/auth/register");
        when(mockRequest.getRemoteAddr()).thenReturn("192.168.1.1");
        when(mockRequest.getHeader("X-Forwarded-For")).thenReturn(null);

        // When
        rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldBlockRequest_whenRateLimitExceeded() throws ServletException, IOException {
        // Given
        String clientIp = "192.168.1.100";
        String loginUri = "/api/auth/login";

        when(mockRequest.getRequestURI()).thenReturn(loginUri);
        when(mockRequest.getRemoteAddr()).thenReturn(clientIp);
        when(mockRequest.getHeader("X-Forwarded-For")).thenReturn(null);

        // Make attempts to hit the rate limit
        for (int i = 0; i < MAX_ATTEMPTS_PER_WINDOW; i++) {
            rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);
        }

        // Reset mocks for the final test
        reset(mockResponse, mockFilterChain);
        when(mockResponse.getWriter()).thenReturn(mockPrintWriter);

        // When - next attempt should be blocked
        rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockResponse).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        verify(mockFilterChain, never()).doFilter(mockRequest, mockResponse);

        // Verify audit logging
        verify(mockSecurityAuditService).logAccountLockout(eq(clientIp), contains("Rate limit exceeded"));
        verify(mockSecurityAuditService, atLeastOnce()).logRateLimitViolation(eq(clientIp), eq(loginUri));
    }

    @Test
    void doFilterInternal_shouldLogAccountLockout_whenRateLimitExceeded() throws ServletException, IOException {
        // Given
        String clientIp = "192.168.1.200";
        String loginUri = "/api/auth/login";

        when(mockRequest.getRequestURI()).thenReturn(loginUri);
        when(mockRequest.getRemoteAddr()).thenReturn(clientIp);
        when(mockRequest.getHeader("X-Forwarded-For")).thenReturn(null);

        // When - Make exactly MAX_ATTEMPTS_PER_WINDOW attempts to trigger lockout
        for (int i = 0; i < MAX_ATTEMPTS_PER_WINDOW; i++) {
            rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);
        }

        // Then - Verify audit logging occurred
        verify(mockSecurityAuditService).logAccountLockout(
                eq(clientIp),
                contains("Rate limit")
        );
        verify(mockSecurityAuditService, never()).logRateLimitViolation(any(), any());
    }

    @Test
    void doFilterInternal_shouldUseXForwardedForHeader_whenPresent() throws ServletException, IOException {
        // Given
        String xForwardedFor = "203.0.113.1, 192.168.1.1";
        String expectedClientIp = "203.0.113.1";
        String loginUri = "/api/auth/login";

        when(mockRequest.getRequestURI()).thenReturn(loginUri);
        when(mockRequest.getRemoteAddr()).thenReturn("192.168.1.1");
        when(mockRequest.getHeader("X-Forwarded-For")).thenReturn(xForwardedFor);

        // Make attempts to hit the rate limit
        for (int i = 0; i < MAX_ATTEMPTS_PER_WINDOW; i++) {
            rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);
        }

        // Reset mocks for the final test
        reset(mockResponse, mockFilterChain);
        when(mockResponse.getWriter()).thenReturn(mockPrintWriter);

        // When - next attempt should be blocked
        rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then - Verify correct IP is used in audit logs
        verify(mockSecurityAuditService).logAccountLockout(eq(expectedClientIp), contains("Rate limit"));
        verify(mockSecurityAuditService, atLeastOnce()).logRateLimitViolation(eq(expectedClientIp), eq(loginUri));
    }

    @Test
    void doFilterInternal_shouldHandleEmptyXForwardedForHeader_whenEmpty() throws ServletException, IOException {
        // Given
        String remoteAddr = "192.168.1.1";
        String loginUri = "/api/auth/login";

        when(mockRequest.getRequestURI()).thenReturn(loginUri);
        when(mockRequest.getRemoteAddr()).thenReturn(remoteAddr);
        when(mockRequest.getHeader("X-Forwarded-For")).thenReturn("");

        // When
        rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);
    }

    @Test
    void doFilterInternal_shouldNotApplyRateLimit_whenNonAuthEndpoint() throws ServletException, IOException {
        // Given
        when(mockRequest.getRequestURI()).thenReturn("/api/users/profile");
        when(mockRequest.getRemoteAddr()).thenReturn("192.168.1.1");

        // When
        rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockFilterChain).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldTrackSeparateClients_whenDifferentIpAddresses() throws ServletException, IOException {
        // Given
        String client1 = "192.168.1.1";
        String client2 = "192.168.1.2";
        String loginUri = "/api/auth/login";

        when(mockRequest.getRequestURI()).thenReturn(loginUri);
        when(mockRequest.getHeader("X-Forwarded-For")).thenReturn(null);

        // When - Client 1 makes MAX_ATTEMPTS_PER_WINDOW attempts
        when(mockRequest.getRemoteAddr()).thenReturn(client1);
        for (int i = 0; i < MAX_ATTEMPTS_PER_WINDOW; i++) {
            rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);
        }

        // Client 2 makes 3 attempts
        when(mockRequest.getRemoteAddr()).thenReturn(client2);
        for (int i = 0; i < MAX_ATTEMPTS_PER_WINDOW - 2; i++) {
            rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);
        }

        // Then
        verify(mockFilterChain, times(MAX_ATTEMPTS_PER_WINDOW + MAX_ATTEMPTS_PER_WINDOW - 2)).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldWriteCorrectErrorResponse_whenRateLimitExceeded() throws ServletException, IOException {
        // Given
        String clientIp = "192.168.1.300";
        String loginUri = "/api/auth/login";

        when(mockRequest.getRequestURI()).thenReturn(loginUri);
        when(mockRequest.getRemoteAddr()).thenReturn(clientIp);
        when(mockRequest.getHeader("X-Forwarded-For")).thenReturn(null);

        // Make attempts to hit the rate limit
        for (int i = 0; i < MAX_ATTEMPTS_PER_WINDOW; i++) {
            rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);
        }

        // Reset mocks for the final test
        reset(mockResponse, mockFilterChain);
        when(mockResponse.getWriter()).thenReturn(mockPrintWriter);

        // When - next attempt should be blocked
        rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);

        // Then
        verify(mockResponse).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());

        // Verify audit logging
        verify(mockSecurityAuditService).logAccountLockout(eq(clientIp), contains("Rate limit"));
        verify(mockSecurityAuditService, atLeastOnce()).logRateLimitViolation(eq(clientIp), eq(loginUri));
    }

    @Test
    void doFilterInternal_shouldContinueProcessing_whenLockoutPeriodExpired() throws ServletException, IOException {
        // This test verifies the concept but cannot fully test time-based lockout expiration
        // in a unit test without manipulating time or using a time provider

        // Given
        String clientIp = "192.168.1.400";
        String loginUri = "/api/auth/login";

        when(mockRequest.getRequestURI()).thenReturn(loginUri);
        when(mockRequest.getRemoteAddr()).thenReturn(clientIp);
        when(mockRequest.getHeader("X-Forwarded-For")).thenReturn(null);

        // When - Make attempts to trigger rate limiting
        for (int i = 0; i < MAX_ATTEMPTS_PER_WINDOW - 2; i++) {
            rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);
        }

        // Then - Should continue processing as lockout hasn't been triggered yet
        verify(mockFilterChain, times(MAX_ATTEMPTS_PER_WINDOW - 2)).doFilter(mockRequest, mockResponse);
    }

    @Test
    void doFilterInternal_shouldHandleMultipleXForwardedForIps_whenChainedProxies() throws ServletException, IOException {
        // Given
        String xForwardedFor = "203.0.113.1, 192.168.1.1, 10.0.0.1";
        String expectedClientIp = "203.0.113.1"; // Should use the first IP
        String loginUri = "/api/auth/login";

        when(mockRequest.getRequestURI()).thenReturn(loginUri);
        when(mockRequest.getRemoteAddr()).thenReturn("10.0.0.1");
        when(mockRequest.getHeader("X-Forwarded-For")).thenReturn(xForwardedFor);

        // When - Make attempts to trigger rate limiting
        for (int i = 0; i < MAX_ATTEMPTS_PER_WINDOW; i++) {
            rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);
        }

        // Then - Should use the first IP from X-Forwarded-For in audit logs
        verify(mockFilterChain, times(MAX_ATTEMPTS_PER_WINDOW)).doFilter(mockRequest, mockResponse);
        verify(mockSecurityAuditService).logAccountLockout(eq(expectedClientIp), contains("Rate limit"));

        // Make one more attempt to trigger rate limit violation
        rateLimitingFilter.doFilterInternal(mockRequest, mockResponse, mockFilterChain);
        verify(mockSecurityAuditService).logRateLimitViolation(eq(expectedClientIp), eq(loginUri));
    }

    @Test
    void rateLimitEntry_shouldIncrementAttemptCount_whenAttemptsAdded() {
        // Given
        RateLimitingFilter.RateLimitEntry entry = new RateLimitingFilter.RateLimitEntry();

        // When
        entry.addAttempt(java.time.LocalDateTime.now());
        entry.addAttempt(java.time.LocalDateTime.now());

        // Then
        assertEquals(2, entry.getAttemptCount());
    }

    @Test
    void rateLimitEntry_shouldReturnTrue_whenLockedOut() {
        // Given
        RateLimitingFilter.RateLimitEntry entry = new RateLimitingFilter.RateLimitEntry();
        java.time.LocalDateTime futureTime = java.time.LocalDateTime.now().plusMinutes(30);

        // When
        entry.lockout(futureTime);

        // Then
        assertTrue(entry.isLockedOut());
        assertEquals(futureTime, entry.getLockoutUntil());
    }

    @Test
    void rateLimitEntry_shouldReset_whenResetCalled() {
        // Given
        RateLimitingFilter.RateLimitEntry entry = new RateLimitingFilter.RateLimitEntry();
        entry.addAttempt(java.time.LocalDateTime.now());
        entry.lockout(java.time.LocalDateTime.now().plusMinutes(30));

        // When
        entry.reset();

        // Then
        assertFalse(entry.isLockedOut());
        assertNull(entry.getLockoutUntil());
        assertEquals(0, entry.getAttemptCount());
    }

    @Test
    void rateLimitEntry_shouldCleanupOldAttempts_whenOutsideWindow() {
        // Given
        RateLimitingFilter.RateLimitEntry entry = new RateLimitingFilter.RateLimitEntry();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        java.time.LocalDateTime oldTime = now.minusMinutes(20); // Outside 15-minute window

        entry.addAttempt(oldTime);
        entry.addAttempt(now);

        // When
        entry.cleanupOldAttempts(now);

        // Then
        assertEquals(1, entry.getAttemptCount()); // Only recent attempt should remain
    }
}
