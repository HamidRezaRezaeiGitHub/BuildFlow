package dev.hr.rezaei.buildflow.config.mvc;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for PagedResponseBuilder
 * Tests pagination header generation and response construction
 */
class PagedResponseBuilderTest {

    private PagedResponseBuilder<TestDto> pagedResponseBuilder;

    // Simple test DTO
    record TestDto(Long id, String name) {}
    
    // Simple test entity
    record TestEntity(Long id, String name) {}

    @BeforeEach
    void setUp() {
        pagedResponseBuilder = new PagedResponseBuilder<>();
        
        // Setup mock request for ServletUriComponentsBuilder
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setScheme("http");
        request.setServerName("localhost");
        request.setServerPort(8080);
        request.setRequestURI("/api/v1/test");
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    // ============================================
    // buildFromMappedPage Tests
    // ============================================

    @Test
    void buildFromMappedPage_withFirstPage_shouldIncludeCorrectHeaders() {
        List<TestDto> content = List.of(
            new TestDto(1L, "Item 1"),
            new TestDto(2L, "Item 2")
        );
        Pageable pageable = PageRequest.of(0, 10);
        Page<TestDto> page = new PageImpl<>(content, pageable, 25);
        
        ResponseEntity<List<TestDto>> response = pagedResponseBuilder.buildFromMappedPage(page, "/api/v1/test");
        
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(content, response.getBody());
        
        HttpHeaders headers = response.getHeaders();
        assertEquals("25", headers.getFirst("X-Total-Count"));
        assertEquals("3", headers.getFirst("X-Total-Pages"));
        assertEquals("0", headers.getFirst("X-Page"));
        assertEquals("10", headers.getFirst("X-Size"));
    }

    @Test
    void buildFromMappedPage_withMiddlePage_shouldIncludeNextAndPrevLinks() {
        List<TestDto> content = List.of(new TestDto(11L, "Item 11"));
        Pageable pageable = PageRequest.of(1, 10);
        Page<TestDto> page = new PageImpl<>(content, pageable, 25);
        
        ResponseEntity<List<TestDto>> response = pagedResponseBuilder.buildFromMappedPage(page, "/api/v1/test");
        
        HttpHeaders headers = response.getHeaders();
        String linkHeader = headers.getFirst(HttpHeaders.LINK);
        
        assertNotNull(linkHeader);
        assertTrue(linkHeader.contains("rel=\"first\""));
        assertTrue(linkHeader.contains("rel=\"prev\""));
        assertTrue(linkHeader.contains("rel=\"next\""));
        assertTrue(linkHeader.contains("rel=\"last\""));
        assertTrue(linkHeader.contains("page=0"));
        assertTrue(linkHeader.contains("page=2"));
    }

    @Test
    void buildFromMappedPage_withLastPage_shouldNotIncludeNextLink() {
        List<TestDto> content = List.of(new TestDto(21L, "Item 21"));
        Pageable pageable = PageRequest.of(2, 10);
        Page<TestDto> page = new PageImpl<>(content, pageable, 25);
        
        ResponseEntity<List<TestDto>> response = pagedResponseBuilder.buildFromMappedPage(page, "/api/v1/test");
        
        HttpHeaders headers = response.getHeaders();
        String linkHeader = headers.getFirst(HttpHeaders.LINK);
        
        assertNotNull(linkHeader);
        assertTrue(linkHeader.contains("rel=\"first\""));
        assertTrue(linkHeader.contains("rel=\"prev\""));
        assertFalse(linkHeader.contains("rel=\"next\""));
        assertTrue(linkHeader.contains("rel=\"last\""));
    }

    @Test
    void buildFromMappedPage_withEmptyPage_shouldHandleGracefully() {
        List<TestDto> content = List.of();
        Pageable pageable = PageRequest.of(0, 10);
        Page<TestDto> page = new PageImpl<>(content, pageable, 0);
        
        ResponseEntity<List<TestDto>> response = pagedResponseBuilder.buildFromMappedPage(page, "/api/v1/test");
        
        assertEquals(200, response.getStatusCode().value());
        assertEquals(0, response.getBody().size());
        
        HttpHeaders headers = response.getHeaders();
        assertEquals("0", headers.getFirst("X-Total-Count"));
        assertEquals("0", headers.getFirst("X-Total-Pages"));
    }

    @Test
    void buildFromMappedPage_withSinglePageResult_shouldIncludeOnlyFirstAndLast() {
        List<TestDto> content = List.of(new TestDto(1L, "Item 1"));
        Pageable pageable = PageRequest.of(0, 10);
        Page<TestDto> page = new PageImpl<>(content, pageable, 5);
        
        ResponseEntity<List<TestDto>> response = pagedResponseBuilder.buildFromMappedPage(page, "/api/v1/test");
        
        HttpHeaders headers = response.getHeaders();
        String linkHeader = headers.getFirst(HttpHeaders.LINK);
        
        assertNotNull(linkHeader);
        assertTrue(linkHeader.contains("rel=\"first\""));
        assertTrue(linkHeader.contains("rel=\"last\""));
        assertFalse(linkHeader.contains("rel=\"prev\""));
        assertFalse(linkHeader.contains("rel=\"next\""));
    }

    // ============================================
    // build with mapper Tests
    // ============================================

    @Test
    void build_withMapper_shouldMapEntitesToDtos() {
        List<TestEntity> entities = List.of(
            new TestEntity(1L, "Entity 1"),
            new TestEntity(2L, "Entity 2")
        );
        Pageable pageable = PageRequest.of(0, 10);
        Page<TestEntity> page = new PageImpl<>(entities, pageable, 2);
        
        ResponseEntity<List<TestDto>> response = pagedResponseBuilder.build(
            page,
            entity -> new TestDto(entity.id(), entity.name()),
            "/api/v1/test"
        );
        
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(2, response.getBody().size());
        assertEquals(new TestDto(1L, "Entity 1"), response.getBody().get(0));
        assertEquals(new TestDto(2L, "Entity 2"), response.getBody().get(1));
    }

    @Test
    void build_withNullMapper_shouldReturnEntitiesDirectly() {
        List<TestDto> content = List.of(
            new TestDto(1L, "Item 1"),
            new TestDto(2L, "Item 2")
        );
        Pageable pageable = PageRequest.of(0, 10);
        Page<TestDto> page = new PageImpl<>(content, pageable, 2);
        
        PagedResponseBuilder<TestDto> builder = new PagedResponseBuilder<>();
        ResponseEntity<List<TestDto>> response = builder.build(page, null, "/api/v1/test");
        
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(content, response.getBody());
    }

    // ============================================
    // Link Header Format Tests
    // ============================================

    @Test
    void buildFromMappedPage_shouldIncludePageSizeInLinks() {
        List<TestDto> content = List.of(new TestDto(1L, "Item 1"));
        Pageable pageable = PageRequest.of(0, 50);
        Page<TestDto> page = new PageImpl<>(content, pageable, 100);
        
        ResponseEntity<List<TestDto>> response = pagedResponseBuilder.buildFromMappedPage(page, "/api/v1/test");
        
        HttpHeaders headers = response.getHeaders();
        String linkHeader = headers.getFirst(HttpHeaders.LINK);
        
        assertNotNull(linkHeader);
        assertTrue(linkHeader.contains("size=50"));
    }

    @Test
    void buildFromMappedPage_shouldConstructCorrectBaseUrl() {
        List<TestDto> content = List.of(new TestDto(1L, "Item 1"));
        Pageable pageable = PageRequest.of(0, 10);
        Page<TestDto> page = new PageImpl<>(content, pageable, 20);
        
        ResponseEntity<List<TestDto>> response = pagedResponseBuilder.buildFromMappedPage(page, "/api/v1/projects");
        
        HttpHeaders headers = response.getHeaders();
        String linkHeader = headers.getFirst(HttpHeaders.LINK);
        
        assertNotNull(linkHeader);
        assertTrue(linkHeader.contains("http://localhost:8080/api/v1/projects"));
    }
}
