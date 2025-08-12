package dev.hr.rezaei.buildflow.config.mvc;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
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
 * @author BuildFlow Team
 * @since 1.0.0
 * @see SpaPathResourceResolver
 */
@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final SpaPathResourceResolver spaPathResourceResolver;

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
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources from the frontend build with SPA routing support
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(spaPathResourceResolver);
    }
}
