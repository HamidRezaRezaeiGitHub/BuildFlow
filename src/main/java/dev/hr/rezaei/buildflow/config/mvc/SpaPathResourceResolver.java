package dev.hr.rezaei.buildflow.config.mvc;

import lombok.NonNull;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Custom path resource resolver for Single Page Application (SPA) routing support.
 *
 * <p>This resolver implements a fallback strategy that enables React Router to handle
 * client-side navigation while preserving backend API endpoints and static resource serving.
 *
 * <h3>Resolution Strategy:</h3>
 * <ol>
 *   <li><strong>Static Resources First:</strong> If a physical file exists (CSS, JS, images), serve it directly</li>
 *   <li><strong>API Route Preservation:</strong> Backend routes are passed through to Spring MVC controllers</li>
 *   <li><strong>SPA Fallback:</strong> All other routes return index.html for client-side routing</li>
 * </ol>
 *
 * <p>This approach allows users to:
 * <ul>
 *   <li>Navigate directly to any React route (e.g., /projects, /estimates)</li>
 *   <li>Refresh the browser on any page without getting 404 errors</li>
 *   <li>Bookmark and share deep links to specific application pages</li>
 * </ul>
 *
 * <p><strong>Protected Backend Routes:</strong>
 * <ul>
 *   <li>{@code /api/*} - REST API endpoints for application data</li>
 *   <li>{@code /h2-console} - H2 database web console for development</li>
 *   <li>{@code /actuator/*} - Spring Boot management endpoints</li>
 * </ul>
 */
@Component
public class SpaPathResourceResolver extends PathResourceResolver {

    /**
     * Resolves resources with SPA routing fallback support.
     *
     * <p>This method implements the core logic for serving a React SPA from a Spring Boot backend:
     * <ul>
     *   <li>If the requested resource exists as a static file, serve it directly</li>
     *   <li>If the resource doesn't exist, and it's not a backend route, serve index.html</li>
     *   <li>This enables React Router to handle client-side navigation seamlessly</li>
     * </ul>
     *
     * <p><strong>Example Request Handling:</strong>
     * <ul>
     *   <li>{@code /assets/index-123.js} → Serves the actual JavaScript file</li>
     *   <li>{@code /projects} → Returns index.html, React Router handles the route</li>
     *   <li>{@code /api/projects} → Returns null, Spring MVC handles the API call</li>
     *   <li>{@code /h2-console} → Returns null, preserves database console access</li>
     * </ul>
     *
     * @param resourcePath the path of the requested resource (e.g., "projects", "assets/app.js")
     * @param location     the base location to resolve the resource from (classpath:/static/)
     * @return the resolved resource, or null if the resource should be handled by Spring MVC
     * @throws IOException if an I/O error occurs during resource resolution
     */
    @Override
    protected Resource getResource(@NonNull String resourcePath, @NonNull Resource location) throws IOException {
        Resource requestedResource = location.createRelative(resourcePath);

        // If the resource exists as a static file, serve it directly
        // This handles CSS, JS, images, favicon, etc.
        if (requestedResource.exists() && requestedResource.isReadable()) {
            return requestedResource;
        }

        // For client-side routing, return index.html for non-backend routes
        // This allows React Router to handle navigation to application pages
        if (!isBackendRoute(resourcePath)) {
            return new ClassPathResource("/static/index.html");
        }

        // Return null for backend routes to let Spring MVC handle them
        return null;
    }

    /**
     * Determines if a resource path should be handled by the backend (Spring MVC) rather than the SPA.
     *
     * <p>Backend routes include:
     * <ul>
     *   <li>REST API endpoints starting with "api/"</li>
     *   <li>H2 database console paths starting with "h2-console"</li>
     *   <li>Spring Boot Actuator management endpoints starting with "actuator/"</li>
     *   <li>Authentication endpoints like "login" and "register"</li>
     * </ul>
     *
     * @param resourcePath the resource path to check
     * @return true if this is a backend route that should be handled by Spring MVC, false otherwise
     */
    private boolean isBackendRoute(String resourcePath) {
        return resourcePath.startsWith("api/") ||
                resourcePath.startsWith("h2-console") ||
                resourcePath.startsWith("actuator/") ||
                resourcePath.equals("login") ||
                resourcePath.equals("register");
    }
}
