package dev.hr.rezaei.buildflow.config.mvc;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration for serving the React frontend application alongside the Spring Boot backend.
 *
 * <p>This configuration enables the application to serve as a full-stack solution by:
 * <ul>
 *   <li>Serving static frontend assets (JS, CSS, images) from the classpath</li>
 *   <li>Handling client-side routing by returning index.html for non-API routes</li>
 *   <li>Preserving backend API endpoints and administrative interfaces</li>
 *   <li>Configuring CORS for development mode to allow frontend dev server integration</li>
 * </ul>
 *
 * <p>The frontend build files are included in the JAR during the Maven build process
 * via the frontend-maven-plugin, which builds the React application and copies the
 * resulting files to the Spring Boot static resources' directory.
 *
 * <h3>Route Handling Strategy:</h3>
 * <ul>
 *   <li><strong>Static Assets:</strong> Files that exist in /static are served directly</li>
 *   <li><strong>API Routes:</strong> Paths starting with /api/ are passed to Spring controllers</li>
 *   <li><strong>Admin Routes:</strong> Paths like /h2-console and /actuator/ are preserved</li>
 *   <li><strong>Client Routes:</strong> All other paths return index.html for React Router</li>
 * </ul>
 *
 * <h3>CORS Configuration:</h3>
 * <ul>
 *   <li><strong>Development Mode:</strong> Allows frontend dev server (localhost:3000) to call backend API (localhost:8080)</li>
 *   <li><strong>Production Mode:</strong> No CORS needed - frontend served from same origin as backend</li>
 * </ul>
 *
 * @author BuildFlow Team
 * @since 1.0.0
 * @see SpaPathResourceResolver
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final SpaPathResourceResolver spaPathResourceResolver;
    private final Environment environment;

    /**
     * Configures resource handlers to serve the React frontend application and handle client-side routing.
     *
     * <p>This method sets up a catch-all resource handler that serves static files from the classpath
     * and implements a fallback strategy for single-page application (SPA) routing using the
     * {@link SpaPathResourceResolver}.
     *
     * <p>When a request comes in, the resolver will:
     * <ol>
     *   <li>First attempt to serve the requested resource if it exists as a static file</li>
     *   <li>If the resource doesn't exist and the path is not an API/admin route, serve index.html</li>
     *   <li>This allows React Router to handle client-side navigation</li>
     * </ol>
     *
     * <p><strong>Preserved Backend Routes:</strong>
     * <ul>
     *   <li>{@code /api/*} - REST API endpoints</li>
     *   <li>{@code /h2-console} - H2 database web console</li>
     *   <li>{@code /actuator/*} - Spring Boot actuator endpoints</li>
     * </ul>
     *
     * @param registry the ResourceHandlerRegistry to configure
     * @see org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
     * @see SpaPathResourceResolver
     */
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve static resources from the frontend build with SPA routing support
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(spaPathResourceResolver);
    }

    /**
     * Configures CORS (Cross-Origin Resource Sharing) for development mode.
     *
     * <p>CORS is only enabled in development mode to allow the frontend dev server
     * (running on localhost:3000) to make API calls to the backend (running on localhost:8080).
     * In production, the frontend is served from the same origin as the backend (single JAR),
     * so no CORS configuration is needed.
     *
     * <p><strong>Development Mode Configuration:</strong>
     * <ul>
     *   <li><strong>Allowed Origins:</strong> http://localhost:3000, http://127.0.0.1:3000</li>
     *   <li><strong>Allowed Methods:</strong> GET, POST, PUT, DELETE, PATCH, OPTIONS</li>
     *   <li><strong>Allowed Headers:</strong> All headers (including Authorization for JWT)</li>
     *   <li><strong>Credentials:</strong> Enabled for cookies and authorization headers</li>
     *   <li><strong>Max Age:</strong> 3600 seconds (preflight responses cached for 1 hour)</li>
     * </ul>
     *
     * <p><strong>Environment Detection:</strong>
     * <ul>
     *   <li><strong>Development:</strong> Profiles 'dev', 'development', 'test', 'default'</li>
     *   <li><strong>Production:</strong> Profiles 'production', 'prod', 'uat'</li>
     * </ul>
     *
     * @param registry the CorsRegistry to configure
     * @see org.springframework.web.servlet.config.annotation.CorsRegistry
     */
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        // Check if we're in development mode
        boolean isDevelopment = environment.acceptsProfiles(Profiles.of("dev", "development", "test", "default")) ||
                !environment.acceptsProfiles(Profiles.of("production", "prod", "uat"));

        if (isDevelopment) {
            log.info("CORS enabled for development mode - allowing localhost:3000 and 127.0.0.1:3000");

            registry.addMapping("/api/**")
                    // Allow frontend dev server origins
                    .allowedOrigins(
                            "http://localhost:3000",
                            "http://127.0.0.1:3000"
                    )
                    // Allow all standard HTTP methods
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                    // Allow all headers (including Authorization for JWT)
                    .allowedHeaders("*")
                    // Allow credentials (cookies, authorization headers)
                    .allowCredentials(true)
                    // Cache preflight response for 1 hour
                    .maxAge(3600);
        } else {
            log.info("CORS disabled for production mode - frontend served from same origin");
            // Production: No CORS configuration needed
            // Frontend is built into /static/ and served from same origin as backend
        }
    }
}
