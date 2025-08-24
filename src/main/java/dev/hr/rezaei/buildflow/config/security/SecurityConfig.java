package dev.hr.rezaei.buildflow.config.security;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Set;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RateLimitingFilter rateLimitingFilter;
    private final Environment environment;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          RateLimitingFilter rateLimitingFilter,
                          Environment environment) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.rateLimitingFilter = rateLimitingFilter;
        this.environment = environment;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    @ConditionalOnProperty(prefix = "spring.security", name = "enabled", havingValue = "false")
    public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .build();
    }

    public static Set<String> PUBLIC_URLS = Set.of(
            "/", "/home",
            "/api/auth/**",
            "/api/public/**", "/api/*/public/**",
            "/actuator/health",
            // Swagger UI and OpenAPI documentation
            "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**",
            // Static resources - CSS, JS, images, etc.
            "/assets/**", "/static/**", "/*.js", "/*.css", "/*.ico", "/*.png", "/*.jpg", "/*.svg"
    );

    @Bean
    @ConditionalOnProperty(prefix = "spring.security", name = "enabled", havingValue = "true", matchIfMissing = true)
    public SecurityFilterChain secureFilterChain(HttpSecurity http) throws Exception {
        // Check if we're in development profile for H2 console access
        boolean isDevelopment = environment.acceptsProfiles(Profiles.of("dev", "development", "test", "default")) ||
                !environment.acceptsProfiles(Profiles.of("production", "prod", "uat"));

        http.authorizeHttpRequests(auth -> {
                    // Public routes - accessible without authentication
                    auth.requestMatchers(PUBLIC_URLS.toArray(new String[0])).permitAll();

                    // H2 console only in development
                    if (isDevelopment) {
                        auth.requestMatchers("/h2-console/**").permitAll();
                    }

                    // All other requests require authentication
                    auth.anyRequest().authenticated();
                })
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Disable form login for API-first approach
                .formLogin(AbstractHttpConfigurer::disable)
                // Keep HTTP Basic disabled for API endpoints
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessUrl("/")
                        .permitAll()
                )
                // Disable CSRF for API endpoints (required for JWT)
                .csrf(csrf -> {
                    if (isDevelopment) {
                        csrf.ignoringRequestMatchers("/api/**", "/h2-console/**");
                    } else {
                        csrf.ignoringRequestMatchers("/api/**");
                    }
                })
                // Configure security headers with modern Spring Security 6.x syntax
                .headers(headers -> headers
                        .frameOptions(frameOptions -> {
                            // Allow frames only for H2 console in development
                            if (isDevelopment) {
                                frameOptions.sameOrigin();
                            } else {
                                frameOptions.deny();
                            }
                        })
                        .contentTypeOptions(contentTypeOptions -> {
                        })
                        .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                                .maxAgeInSeconds(31536000) // 1 year
                                .includeSubDomains(true)
                        )
                        .addHeaderWriter((request, response) -> {
                            // Add Content Security Policy
                            response.setHeader("Content-Security-Policy",
                                    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'");
                            // Add X-XSS-Protection header
                            response.setHeader("X-XSS-Protection", "1; mode=block");
                            // Add Referrer Policy
                            response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
                            // Add X-Content-Type-Options
                            response.setHeader("X-Content-Type-Options", "nosniff");
                        })
                )
                // Add rate limiting filter before authentication processing
                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
                // Add JWT authentication filter before Spring's username/password filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    public static boolean isPublicUrl(String url) {
        return PUBLIC_URLS.stream().anyMatch(pattern -> matches(pattern, url));
    }

    public static boolean matches(String pattern, String url) {
        try {
            new URI(url);
        } catch (URISyntaxException e) {
            return false;
        }

        if (!pattern.startsWith("/") || !url.startsWith("/")) {
            return false;
        }

        boolean endsWithWildcard = false;
        String trimmedPattern = pattern;
        if (pattern.endsWith("/**")) {
            endsWithWildcard = true;
            trimmedPattern = pattern.substring(0, pattern.length() - 3);
        }

        // patterns with double wildcard in the middle are not supported
        if (trimmedPattern.contains("/**/")) {
            return false;
        }

        String regex = trimmedPattern;
        if (trimmedPattern.contains("*")) {
            regex = trimmedPattern.replace("*", "[^/]*");
        }

        if (endsWithWildcard) {
            regex = regex + "(/.*)?";
        }
        regex = "^" + regex + "$";

        return url.matches(regex);
    }

}
