package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractControllerIntegrationTest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.project.dto.ProjectLocationRequestDto;
import dev.hr.rezaei.buildflow.user.User;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import java.time.Instant;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class ProjectControllerIntegrationTest extends AbstractControllerIntegrationTest {

    @Test
    void createProject_shouldReturnCreated_whenAdminUser() throws Exception {
        User admin = registerAdmin();
        String token = login(admin);
        User builder = registerBuilder();
        var projectRequest = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.29." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                // .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.project.id").exists())
                .andExpect(jsonPath("$.project.userId").value(builder.getId().toString()))
                .andExpect(jsonPath("$.project.role").value("BUILDER"));
    }

    @Test
    void createProject_shouldReturnCreated_whenUserHasCreateProjectAuthorityAndIsAllowed() throws Exception {
        User builder = registerBuilder();
        String token = login(builder);
        var projectRequest = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.30." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                // .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.project.id").exists())
                .andExpect(jsonPath("$.project.userId").value(builder.getId().toString()))
                .andExpect(jsonPath("$.project.role").value("BUILDER"));
    }

    @Test
    void createProject_shouldReturnForbidden_whenUserHasCreateProjectAuthorityButIsNotAllowed() throws Exception {
        User actingUser = registerBuilder();
        String token = login(actingUser);
        User builder = registerBuilder();
        var projectRequest = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.31." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void createProject_shouldReturnForbidden_whenUserLacksRequiredAuthority() throws Exception {
        User viewer = registerViewer();
        String token = login(viewer);
        var projectRequest = CreateProjectRequest.builder()
                .userId(viewer.getId())
                .role("OWNER")
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.32." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void createProject_shouldReturnUnauthorized_whenNoJwtProvided() throws Exception {
        User builder = registerBuilder();
        var projectRequest = CreateProjectRequest.builder()
                .userId(builder.getId())
                .role("BUILDER")
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("X-Forwarded-For", "192.168.33." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                // .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getProjectsByUserId_shouldReturnOk_whenAdminUser() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        // Create a project for the builder using helper
        var projectDto = createProject(adminToken, builder.getId(), true, testCreateProjectRequest.getLocationRequestDto());
        // Admin fetches builder's projects
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + adminToken))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].userId").value(builder.getId().toString()))
                .andExpect(jsonPath("$[0].role").value("BUILDER"))
                .andExpect(jsonPath("$[0].id").value(projectDto.getId().toString()));
    }

    @Test
    void getProjectsByUserId_shouldReturnOk_whenBuilderIsSelf() throws Exception {
        User builder = registerBuilder();
        String builderToken = login(builder);
        // Create a project for the builder using helper
        var projectDto = createProject(builderToken, builder.getId(), true, testCreateProjectRequest.getLocationRequestDto());
        // Builder fetches their own projects
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].userId").value(builder.getId().toString()))
                .andExpect(jsonPath("$[0].role").value("BUILDER"))
                .andExpect(jsonPath("$[0].id").value(projectDto.getId().toString()));
    }

    @Test
    void getProjectsByUserId_shouldReturnForbidden_whenOtherUser() throws Exception {
        User builder = registerBuilder();
        User otherUser = registerBuilder();
        String otherUserToken = login(otherUser);
        User admin = registerAdmin();
        String adminToken = login(admin);
        // Create a project for the builder using helper
        createProject(adminToken, builder.getId(), true, testCreateProjectRequest.getLocationRequestDto());
        // Other user tries to fetch builder's projects
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + otherUserToken))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void getProjectsByUserId_shouldReturnForbidden_whenNoViewProjectAuthority() throws Exception {
        User builder = registerBuilder();
        User viewer = registerViewer();
        String viewerToken = login(viewer);
        User admin = registerAdmin();
        String adminToken = login(admin);
        // Create a project for the builder using helper
        createProject(adminToken, builder.getId(), true, testCreateProjectRequest.getLocationRequestDto());
        // Viewer tries to fetch builder's projects
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + viewerToken))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void getProjectsByUserId_shouldReturnUnauthorized_whenNoJwt() throws Exception {
        User builder = registerBuilder();
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId()))
                // .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getProjectsByUserId_shouldReturnEmptyList_whenNoProjects() throws Exception {
        User builder = registerBuilder();
        String builderToken = login(builder);
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    // ==========================
    // Pagination Tests
    // ==========================

    @Test
    void getProjectsByUserId_shouldReturnDefaultPage_whenNoPaginationParams() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create 30 projects for the builder
        for (int i = 0; i < 30; i++) {
            var locationDto = ProjectLocationRequestDto.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            createProject(adminToken, builder.getId(), true, locationDto);
            // Small delay to ensure different lastUpdatedAt timestamps
            Thread.sleep(5);
        }

        String builderToken = login(builder);
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(25)) // Default page size
                .andExpect(header().string("X-Total-Count", "30"))
                .andExpect(header().string("X-Total-Pages", "2"))
                .andExpect(header().string("X-Page", "0"))
                .andExpect(header().string("X-Size", "25"))
                .andExpect(header().exists("Link"));
    }

    @Test
    void getProjectsByUserId_shouldReturnCustomPageSize() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create 15 projects
        for (int i = 0; i < 15; i++) {
            var locationDto = ProjectLocationRequestDto.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            createProject(adminToken, builder.getId(), true, locationDto);
            Thread.sleep(5);
        }

        String builderToken = login(builder);
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("page", "0")
                        .param("size", "10"))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(10))
                .andExpect(header().string("X-Total-Count", "15"))
                .andExpect(header().string("X-Total-Pages", "2"))
                .andExpect(header().string("X-Page", "0"))
                .andExpect(header().string("X-Size", "10"));
    }

    @Test
    void getProjectsByUserId_shouldReturnSecondPage() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create 15 projects
        for (int i = 0; i < 15; i++) {
            var locationDto = ProjectLocationRequestDto.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            createProject(adminToken, builder.getId(), true, locationDto);
            Thread.sleep(5);
        }

        String builderToken = login(builder);
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("page", "1")
                        .param("size", "10"))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(5))
                .andExpect(header().string("X-Total-Count", "15"))
                .andExpect(header().string("X-Total-Pages", "2"))
                .andExpect(header().string("X-Page", "1"))
                .andExpect(header().string("X-Size", "10"));
    }

    @Test
    void getProjectsByUserId_shouldAcceptSortParameter() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create 3 projects
        for (int i = 0; i < 3; i++) {
            var locationDto = ProjectLocationRequestDto.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            createProject(adminToken, builder.getId(), true, locationDto);
            Thread.sleep(10);
        }

        String builderToken = login(builder);
        // Test that sort parameter is accepted without errors
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("sort", "createdAt,ASC"))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void getProjectsByUserId_shouldAcceptOrderByParameter() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create 5 projects
        for (int i = 0; i < 5; i++) {
            var locationDto = ProjectLocationRequestDto.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            createProject(adminToken, builder.getId(), true, locationDto);
            Thread.sleep(10);
        }

        String builderToken = login(builder);
        // Test that orderBy parameter is accepted without errors
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("orderBy", "lastUpdatedAt")
                        .param("direction", "DESC"))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(5));
    }

    @Test
    void getProjectsByUserId_shouldReturnEmptyPageWithHeaders_whenPageOutOfBounds() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create only 5 projects
        for (int i = 0; i < 5; i++) {
            var locationDto = ProjectLocationRequestDto.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            createProject(adminToken, builder.getId(), true, locationDto);
            Thread.sleep(5);
        }

        String builderToken = login(builder);
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("page", "10")
                        .param("size", "10"))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0))
                .andExpect(header().string("X-Total-Count", "5"))
                .andExpect(header().string("X-Total-Pages", "1"))
                .andExpect(header().string("X-Page", "10"))
                .andExpect(header().string("X-Size", "10"));
    }

    @Test
    void getProjectsByUserId_shouldReturnEmptyListWithPaginationHeaders_whenNoProjects() throws Exception {
        User builder = registerBuilder();
        String builderToken = login(builder);
        
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("page", "0")
                        .param("size", "10"))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0))
                .andExpect(header().string("X-Total-Count", "0"))
                .andExpect(header().string("X-Total-Pages", "0"))
                .andExpect(header().string("X-Page", "0"))
                .andExpect(header().string("X-Size", "10"));
    }

    // ==========================
    // Date Filtering Tests
    // ==========================

    @Test
    void getProjectsByUserId_shouldFilterByCreatedAfter() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create projects with controlled timestamps
        var location1 = ProjectLocationRequestDto.builder()
                .streetNumberAndName("Old Street")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location1);
        Thread.sleep(100); // Ensure different createdAt timestamps
        
        long midTimestamp = System.currentTimeMillis();
        Thread.sleep(100);
        
        var location2 = ProjectLocationRequestDto.builder()
                .streetNumberAndName("New Street")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location2);

        String builderToken = login(builder);
        String createdAfter = Instant.ofEpochMilli(midTimestamp).toString();
        
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("createdAfter", createdAfter))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(header().string("X-Total-Count", "1"));
    }

    @Test
    void getProjectsByUserId_shouldFilterByCreatedBefore() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create first project
        var location1 = ProjectLocationRequestDto.builder()
                .streetNumberAndName("Old Street")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location1);
        Thread.sleep(100);
        
        long midTimestamp = System.currentTimeMillis();
        Thread.sleep(100);
        
        // Create second project
        var location2 = ProjectLocationRequestDto.builder()
                .streetNumberAndName("New Street")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location2);

        String builderToken = login(builder);
        String createdBefore = Instant.ofEpochMilli(midTimestamp).toString();
        
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("createdBefore", createdBefore))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(header().string("X-Total-Count", "1"));
    }

    @Test
    void getProjectsByUserId_shouldFilterByCreatedAfterAndBefore() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create project before time window
        var location1 = ProjectLocationRequestDto.builder()
                .streetNumberAndName("Too Old Street")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location1);
        Thread.sleep(100);
        
        long startTimestamp = System.currentTimeMillis();
        Thread.sleep(100);
        
        // Create project within time window
        var location2 = ProjectLocationRequestDto.builder()
                .streetNumberAndName("Within Window Street")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location2);
        Thread.sleep(100);
        
        long endTimestamp = System.currentTimeMillis();
        Thread.sleep(100);
        
        // Create project after time window
        var location3 = ProjectLocationRequestDto.builder()
                .streetNumberAndName("Too New Street")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location3);

        String builderToken = login(builder);
        String createdAfter = java.time.Instant.ofEpochMilli(startTimestamp).toString();
        String createdBefore = java.time.Instant.ofEpochMilli(endTimestamp).toString();
        
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("createdAfter", createdAfter)
                        .param("createdBefore", createdBefore))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(header().string("X-Total-Count", "1"));
    }

    @Test
    void getProjectsByUserId_shouldFilterByUpdatedAfter() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create two projects
        var location1 = ProjectLocationRequestDto.builder()
                .streetNumberAndName("Street 1")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location1);
        Thread.sleep(100);
        
        long midTimestamp = System.currentTimeMillis();
        Thread.sleep(100);
        
        var location2 = ProjectLocationRequestDto.builder()
                .streetNumberAndName("Street 2")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location2);

        String builderToken = login(builder);
        String updatedAfter = Instant.ofEpochMilli(midTimestamp).toString();
        
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("updatedAfter", updatedAfter))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(header().string("X-Total-Count", "1"));
    }

    @Test
    void getProjectsByUserId_shouldFilterByUpdatedBefore() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create first project
        var location1 = ProjectLocationRequestDto.builder()
                .streetNumberAndName("Street 1")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location1);
        Thread.sleep(100);
        
        long midTimestamp = System.currentTimeMillis();
        Thread.sleep(100);
        
        // Create second project
        var location2 = ProjectLocationRequestDto.builder()
                .streetNumberAndName("Street 2")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location2);

        String builderToken = login(builder);
        String updatedBefore = Instant.ofEpochMilli(midTimestamp).toString();
        
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("updatedBefore", updatedBefore))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(header().string("X-Total-Count", "1"));
    }

    @Test
    void getProjectsByUserId_shouldCombineAllDateFilters() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create 5 projects with different timestamps
        for (int i = 0; i < 5; i++) {
            var location = ProjectLocationRequestDto.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            createProject(adminToken, builder.getId(), true, location);
            Thread.sleep(100);
        }

        String builderToken = login(builder);
        // Use very wide date range to get all projects
        String createdAfter = "2024-01-01T00:00:00Z";
        String createdBefore = "2026-12-31T23:59:59Z";
        String updatedAfter = "2024-01-01T00:00:00Z";
        String updatedBefore = "2026-12-31T23:59:59Z";
        
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("createdAfter", createdAfter)
                        .param("createdBefore", createdBefore)
                        .param("updatedAfter", updatedAfter)
                        .param("updatedBefore", updatedBefore))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(5))
                .andExpect(header().string("X-Total-Count", "5"));
    }

    @Test
    void getProjectsByUserId_shouldReturnEmptyList_whenNoProjectsMatchDateFilter() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create a project
        var location = ProjectLocationRequestDto.builder()
                .streetNumberAndName("Street 1")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location);

        String builderToken = login(builder);
        // Use date range in the past that won't match
        String createdAfter = "2020-01-01T00:00:00Z";
        String createdBefore = "2020-12-31T23:59:59Z";
        
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("createdAfter", createdAfter)
                        .param("createdBefore", createdBefore))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0))
                .andExpect(header().string("X-Total-Count", "0"));
    }

    @Test
    void getProjectsByUserId_shouldCombineDateFilterWithPagination() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create 10 projects
        for (int i = 0; i < 10; i++) {
            var location = ProjectLocationRequestDto.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            createProject(adminToken, builder.getId(), true, location);
            Thread.sleep(50);
        }

        String builderToken = login(builder);
        // Wide date range to include all projects, but use pagination
        String createdAfter = "2024-01-01T00:00:00Z";
        String createdBefore = "2026-12-31T23:59:59Z";
        
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("createdAfter", createdAfter)
                        .param("createdBefore", createdBefore)
                        .param("page", "0")
                        .param("size", "5"))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(5))
                .andExpect(header().string("X-Total-Count", "10"))
                .andExpect(header().string("X-Total-Pages", "2"))
                .andExpect(header().string("X-Page", "0"))
                .andExpect(header().string("X-Size", "5"));
    }

    @Test
    void getProjectsByUserId_shouldHandleInvalidDateFormat() throws Exception {
        User builder = registerBuilder();
        String builderToken = login(builder);
        
        // Test with invalid date format
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("createdAfter", "invalid-date-format"))
                // .andDo(print())
                .andExpect(status().isOk()) // Should still return 200 but ignore invalid filter
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getProjectsByUserId_shouldHandleEmptyDateParameters() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create a project
        var location = ProjectLocationRequestDto.builder()
                .streetNumberAndName("Street 1")
                .city("City")
                .stateOrProvince("ST")
                .postalOrZipCode("12345")
                .country("Country")
                .build();
        createProject(adminToken, builder.getId(), true, location);

        String builderToken = login(builder);
        
        // Pass empty strings for date parameters
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("createdAfter", "")
                        .param("createdBefore", ""))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1)) // Should return all projects
                .andExpect(header().string("X-Total-Count", "1"));
    }

    @Test
    void getProjectsByUserId_shouldCombineDateFilterWithSorting() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        
        // Create 3 projects
        for (int i = 0; i < 3; i++) {
            var location = ProjectLocationRequestDto.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            createProject(adminToken, builder.getId(), true, location);
            Thread.sleep(50);
        }

        String builderToken = login(builder);
        String createdAfter = "2024-01-01T00:00:00Z";
        
        mockMvc.perform(get("/api/v1/projects/user/{userId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("createdAfter", createdAfter)
                        .param("orderBy", "createdAt")
                        .param("direction", "ASC"))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }
}
