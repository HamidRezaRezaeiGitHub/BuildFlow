package dev.hr.rezaei.buildflow.config.security;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

class SecurityAuditServiceTest {

    private SecurityAuditService securityAuditService;
    private TestableSecurityAuditService testableSecurityAuditService;
    private AutoCloseable mockitoCloseable;

    @Mock
    private HttpServletRequest mockRequest;

    @Mock
    private ServletRequestAttributes mockRequestAttributes;

    @BeforeEach
    void setUp() {
        mockitoCloseable = MockitoAnnotations.openMocks(this);
        securityAuditService = new SecurityAuditService();
        testableSecurityAuditService = new TestableSecurityAuditService();
    }

    @AfterEach
    void tearDown() throws Exception {
        mockitoCloseable.close();
    }

    // Test subclass to expose protected methods
    private static class TestableSecurityAuditService extends SecurityAuditService {
        @Override
        public String getClientIpAddress() {
            return super.getClientIpAddress();
        }

        @Override
        public String getUserAgent() {
            return super.getUserAgent();
        }
    }

    @Test
    void getClientIpAddress_shouldReturnXForwardedForIp_whenHeaderPresent() {
        try (MockedStatic<RequestContextHolder> mockedRequestContextHolder = mockStatic(RequestContextHolder.class)) {
            // Setup
            when(mockRequestAttributes.getRequest()).thenReturn(mockRequest);
            when(mockRequest.getHeader("X-Forwarded-For")).thenReturn("203.0.113.195, 192.168.1.1");
            mockedRequestContextHolder.when(RequestContextHolder::getRequestAttributes)
                    .thenReturn(mockRequestAttributes);

            // Execute
            String clientIp = testableSecurityAuditService.getClientIpAddress();
            testableSecurityAuditService.logLoginAttempt("testUser", true, "test");

            // Verify
            assertEquals("203.0.113.195", clientIp);
        }
    }

    @Test
    void getClientIpAddress_shouldReturnXRealIpIp_whenXForwardedForAbsentButXRealIpPresent() {
        try (MockedStatic<RequestContextHolder> mockedRequestContextHolder = mockStatic(RequestContextHolder.class)) {
            // Setup
            when(mockRequestAttributes.getRequest()).thenReturn(mockRequest);
            when(mockRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(mockRequest.getHeader("X-Real-IP")).thenReturn("203.0.113.195");
            mockedRequestContextHolder.when(RequestContextHolder::getRequestAttributes)
                    .thenReturn(mockRequestAttributes);

            // Execute
            String clientIp = testableSecurityAuditService.getClientIpAddress();
            testableSecurityAuditService.logLoginAttempt("testUser", true, "test");

            // Verify
            assertEquals("203.0.113.195", clientIp);
        }
    }

    @Test
    void getClientIpAddress_shouldReturnRemoteAddr_whenProxyHeadersAbsent() {
        try (MockedStatic<RequestContextHolder> mockedRequestContextHolder = mockStatic(RequestContextHolder.class)) {
            // Setup
            when(mockRequestAttributes.getRequest()).thenReturn(mockRequest);
            when(mockRequest.getHeader("X-Forwarded-For")).thenReturn(null);
            when(mockRequest.getHeader("X-Real-IP")).thenReturn(null);
            when(mockRequest.getRemoteAddr()).thenReturn("192.168.1.100");
            mockedRequestContextHolder.when(RequestContextHolder::getRequestAttributes)
                    .thenReturn(mockRequestAttributes);

            // Execute
            String clientIp = testableSecurityAuditService.getClientIpAddress();
            testableSecurityAuditService.logLoginAttempt("testUser", true, "test");

            // Verify
            assertEquals("192.168.1.100", clientIp);
        }
    }

    @Test
    void getClientIpAddress_shouldReturnUnknown_whenRequestAttributesNull() {
        try (MockedStatic<RequestContextHolder> mockedRequestContextHolder = mockStatic(RequestContextHolder.class)) {
            // Setup
            mockedRequestContextHolder.when(RequestContextHolder::getRequestAttributes)
                    .thenReturn(null);

            // Execute
            String clientIp = testableSecurityAuditService.getClientIpAddress();
            testableSecurityAuditService.logLoginAttempt("testUser", true, "test");

            // Verify
            assertEquals("unknown", clientIp);
        }
    }

    @Test
    void getClientIpAddress_shouldReturnUnknown_whenExceptionThrown() {
        try (MockedStatic<RequestContextHolder> mockedRequestContextHolder = mockStatic(RequestContextHolder.class)) {
            // Setup
            mockedRequestContextHolder.when(RequestContextHolder::getRequestAttributes)
                    .thenThrow(new RuntimeException("Test exception"));

            // Execute
            String clientIp = testableSecurityAuditService.getClientIpAddress();
            testableSecurityAuditService.logLoginAttempt("testUser", true, "test");

            // Verify
            assertEquals("unknown", clientIp);
        }
    }

    @Test
    void getClientIpAddress_shouldHandleEmptyXForwardedFor_whenHeaderEmpty() {
        try (MockedStatic<RequestContextHolder> mockedRequestContextHolder = mockStatic(RequestContextHolder.class)) {
            // Setup
            when(mockRequestAttributes.getRequest()).thenReturn(mockRequest);
            when(mockRequest.getHeader("X-Forwarded-For")).thenReturn("");
            when(mockRequest.getHeader("X-Real-IP")).thenReturn("203.0.113.195");
            mockedRequestContextHolder.when(RequestContextHolder::getRequestAttributes)
                    .thenReturn(mockRequestAttributes);

            // Execute
            String clientIp = testableSecurityAuditService.getClientIpAddress();
            testableSecurityAuditService.logLoginAttempt("testUser", true, "test");

            // Verify
            assertEquals("203.0.113.195", clientIp);
        }
    }

    @Test
    void getUserAgent_shouldReturnUserAgent_whenHeaderPresent() {
        try (MockedStatic<RequestContextHolder> mockedRequestContextHolder = mockStatic(RequestContextHolder.class)) {
            // Setup
            String expectedUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
            when(mockRequestAttributes.getRequest()).thenReturn(mockRequest);
            when(mockRequest.getHeader("User-Agent")).thenReturn(expectedUserAgent);
            mockedRequestContextHolder.when(RequestContextHolder::getRequestAttributes)
                    .thenReturn(mockRequestAttributes);

            // Execute
            String userAgent = testableSecurityAuditService.getUserAgent();
            testableSecurityAuditService.logLoginAttempt("testUser", true, "test");

            // Verify
            assertEquals(expectedUserAgent, userAgent);
        }
    }

    @Test
    void getUserAgent_shouldReturnUnknown_whenHeaderNull() {
        try (MockedStatic<RequestContextHolder> mockedRequestContextHolder = mockStatic(RequestContextHolder.class)) {
            // Setup
            when(mockRequestAttributes.getRequest()).thenReturn(mockRequest);
            when(mockRequest.getHeader("User-Agent")).thenReturn(null);
            mockedRequestContextHolder.when(RequestContextHolder::getRequestAttributes)
                    .thenReturn(mockRequestAttributes);

            // Execute
            String userAgent = testableSecurityAuditService.getUserAgent();

            // Verify
            assertEquals("unknown", userAgent);
        }
    }

    @Test
    void getUserAgent_shouldReturnUnknown_whenRequestAttributesNull() {
        try (MockedStatic<RequestContextHolder> mockedRequestContextHolder = mockStatic(RequestContextHolder.class)) {
            // Setup
            mockedRequestContextHolder.when(RequestContextHolder::getRequestAttributes)
                    .thenReturn(null);

            // Execute
            String userAgent = testableSecurityAuditService.getUserAgent();
            testableSecurityAuditService.logLoginAttempt("testUser", true, "test");

            // Verify
            assertEquals("unknown", userAgent);
        }
    }

    @Test
    void getUserAgent_shouldReturnUnknown_whenExceptionThrown() {
        try (MockedStatic<RequestContextHolder> mockedRequestContextHolder = mockStatic(RequestContextHolder.class)) {
            // Setup
            mockedRequestContextHolder.when(RequestContextHolder::getRequestAttributes)
                    .thenThrow(new RuntimeException("Test exception"));

            // Execute
            String userAgent = testableSecurityAuditService.getUserAgent();
            testableSecurityAuditService.logLoginAttempt("testUser", true, "test");

            // Verify
            assertEquals("unknown", userAgent);
        }
    }
}
