package dev.hr.rezaei.buildflow.config.mvc;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.function.Function;

/**
 * Generic builder for paginated HTTP responses.
 * 
 * Provides standardized pagination headers and response construction for all controllers.
 * Encapsulates pagination metadata, Link headers (RFC 5988), and DTO mapping logic.
 * 
 * Usage:
 * <pre>
 * PagedResponseBuilder<EntityDto> builder = new PagedResponseBuilder<>();
 * return builder.build(page, dto -> mapper.toDto(dto), "/api/v1/resource");
 * </pre>
 * 
 * Headers added:
 * - X-Total-Count: Total number of elements
 * - X-Total-Pages: Total number of pages
 * - X-Page: Current page number (0-based)
 * - X-Size: Page size
 * - Link: RFC 5988 pagination links (first, prev, next, last)
 */
@Component
public class PagedResponseBuilder<T> {

    /**
     * Build a paginated response with standard headers and mapped content.
     * 
     * @param page The Spring Data Page object containing pagination metadata
     * @param mapper Function to map from entity to DTO (if null, returns entities directly)
     * @param basePath The base URL path for Link header generation (e.g., "/api/v1/projects")
     * @param <E> Entity type
     * @return ResponseEntity with mapped content and pagination headers
     */
    public <E> ResponseEntity<List<T>> build(Page<E> page, Function<E, T> mapper, String basePath) {
        // Map entities to DTOs if mapper is provided
        List<T> content = mapper != null 
            ? page.getContent().stream().map(mapper).toList()
            : (List<T>) page.getContent();
        
        // Create pagination headers
        HttpHeaders headers = createPaginationHeaders(page, basePath);
        
        return ResponseEntity.ok().headers(headers).body(content);
    }
    
    /**
     * Build a paginated response when content is already mapped to DTOs.
     * 
     * @param page The Spring Data Page object containing pagination metadata
     * @param basePath The base URL path for Link header generation
     * @return ResponseEntity with content and pagination headers
     */
    public ResponseEntity<List<T>> buildFromMappedPage(Page<T> page, String basePath) {
        HttpHeaders headers = createPaginationHeaders(page, basePath);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
    
    /**
     * Creates pagination headers for the response.
     * Adds X-* custom headers and RFC 5988 Link header.
     * 
     * @param page The page object containing pagination metadata
     * @param basePath The base URL path for link generation
     * @return HttpHeaders with pagination information
     */
    private HttpHeaders createPaginationHeaders(Page<?> page, String basePath) {
        HttpHeaders headers = new HttpHeaders();
        
        // Add custom pagination headers
        headers.add("X-Total-Count", String.valueOf(page.getTotalElements()));
        headers.add("X-Total-Pages", String.valueOf(page.getTotalPages()));
        headers.add("X-Page", String.valueOf(page.getNumber()));
        headers.add("X-Size", String.valueOf(page.getSize()));
        
        // Add RFC 5988 Link header
        String linkHeader = buildLinkHeader(page, basePath);
        if (!linkHeader.isEmpty()) {
            headers.add(HttpHeaders.LINK, linkHeader);
        }
        
        return headers;
    }
    
    /**
     * Builds RFC 5988 Link header with pagination links.
     * Includes first, prev, next, and last page links.
     * 
     * @param page The page object
     * @param basePath The base URL path
     * @return Link header string
     */
    private String buildLinkHeader(Page<?> page, String basePath) {
        StringBuilder linkHeader = new StringBuilder();
        
        String baseUrl = ServletUriComponentsBuilder.fromCurrentRequest()
                .replacePath(basePath)
                .replaceQuery("")
                .toUriString();
        
        // First page link
        linkHeader.append(String.format("<%s?page=0&size=%d>; rel=\"first\"", baseUrl, page.getSize()));
        
        // Previous page link
        if (page.hasPrevious()) {
            linkHeader.append(String.format(", <%s?page=%d&size=%d>; rel=\"prev\"", 
                    baseUrl, page.getNumber() - 1, page.getSize()));
        }
        
        // Next page link
        if (page.hasNext()) {
            linkHeader.append(String.format(", <%s?page=%d&size=%d>; rel=\"next\"", 
                    baseUrl, page.getNumber() + 1, page.getSize()));
        }
        
        // Last page link
        if (page.getTotalPages() > 0) {
            linkHeader.append(String.format(", <%s?page=%d&size=%d>; rel=\"last\"", 
                    baseUrl, page.getTotalPages() - 1, page.getSize()));
        }
        
        return linkHeader.toString();
    }
}
