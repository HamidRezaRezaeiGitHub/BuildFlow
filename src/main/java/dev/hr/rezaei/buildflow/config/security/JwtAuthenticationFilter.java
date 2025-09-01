package dev.hr.rezaei.buildflow.config.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static dev.hr.rezaei.buildflow.config.security.SecurityConfig.isPublicUrl;

/**
 * JWT authentication filter that validates JWT tokens and sets the authentication context.
 */
@Slf4j
@Component
@ConditionalOnProperty(prefix = "spring.security", name = "enabled", havingValue = "true", matchIfMissing = true)
@Order(2)
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    private final CustomUserDetailsService customUserDetailsService;

    private final SecurityAuditService securityAuditService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider,
                                   CustomUserDetailsService customUserDetailsService,
                                   SecurityAuditService securityAuditService
    ) {
        this.tokenProvider = tokenProvider;
        this.customUserDetailsService = customUserDetailsService;
        this.securityAuditService = securityAuditService;
    }

    /**
     * Filters incoming HTTP requests to validate JWT tokens.
     * <p>
     * Extracts the JWT from the Authorization header, validates it, loads user details,
     * and sets the authentication in the security context if valid.
     * Continues the filter chain regardless of authentication outcome.
     *
     * @param request     the HTTP request
     * @param response    the HTTP response
     * @param filterChain the filter chain
     * @throws ServletException if a servlet error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String url = request.getRequestURI();
        if (isPublicUrl(url)) {
            log.debug("URL {} is public, skipping JWT authentication", url);
            filterChain.doFilter(request, response); // Continue filter chain for public URLs
            return;
        }

        String jwt = getJwtFromRequest(request);
        if (jwt == null || jwt.isBlank()) {
            securityAuditService.logTokenValidationFailure("Missing token", null);
            filterChain.doFilter(request, response); // Continue filter chain to let Spring Security handle 401
            return;
        }

        if (tokenProvider.isValid(jwt)) {
            try {
                String username = tokenProvider.getUsernameFromToken(jwt);
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                log.debug("Failed to set user authentication: {}", e.getMessage());
                securityAuditService.logTokenValidationFailure("Failed to load user details", jwt);
            }
        } else {
            securityAuditService.logTokenValidationFailure("Invalid or expired token", jwt);
        }

        filterChain.doFilter(request, response);
    }

    protected String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
