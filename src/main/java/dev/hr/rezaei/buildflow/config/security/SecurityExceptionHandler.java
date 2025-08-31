package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.config.mvc.GlobalExceptionHandler;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class SecurityExceptionHandler implements AuthenticationEntryPoint, AccessDeniedHandler {

    private final GlobalExceptionHandler globalExceptionHandler;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                        AuthenticationException authException) throws IOException {
        // Delegate to GlobalExceptionHandler for consistent error handling
        globalExceptionHandler.handleAuthenticationException(request, response, authException);
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                      AccessDeniedException accessDeniedException) throws IOException {
        // Delegate to GlobalExceptionHandler for consistent error handling
        globalExceptionHandler.handleAccessDeniedException(request, response, accessDeniedException);
    }
}
