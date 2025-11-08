package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractControllerIntegrationTest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.project.dto.ProjectLocationRequestDto;
import dev.hr.rezaei.buildflow.user.User;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

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
    void getProjectsByBuilderId_shouldReturnOk_whenAdminUser() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        // Create a project for the builder using helper
        var projectDto = createProject(adminToken, builder.getId(), true, testCreateProjectRequest.getLocationRequestDto());
        // Admin fetches builder's projects
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
                        .header("Authorization", "Bearer " + adminToken))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].userId").value(builder.getId().toString()))
                .andExpect(jsonPath("$[0].role").value("BUILDER"))
                .andExpect(jsonPath("$[0].id").value(projectDto.getId().toString()));
    }

    @Test
    void getProjectsByBuilderId_shouldReturnOk_whenBuilderIsSelf() throws Exception {
        User builder = registerBuilder();
        String builderToken = login(builder);
        // Create a project for the builder using helper
        var projectDto = createProject(builderToken, builder.getId(), true, testCreateProjectRequest.getLocationRequestDto());
        // Builder fetches their own projects
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].userId").value(builder.getId().toString()))
                .andExpect(jsonPath("$[0].role").value("BUILDER"))
                .andExpect(jsonPath("$[0].id").value(projectDto.getId().toString()));
    }

    @Test
    void getProjectsByBuilderId_shouldReturnForbidden_whenOtherUser() throws Exception {
        User builder = registerBuilder();
        User otherUser = registerBuilder();
        String otherUserToken = login(otherUser);
        User admin = registerAdmin();
        String adminToken = login(admin);
        // Create a project for the builder using helper
        createProject(adminToken, builder.getId(), true, testCreateProjectRequest.getLocationRequestDto());
        // Other user tries to fetch builder's projects
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
                        .header("Authorization", "Bearer " + otherUserToken))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void getProjectsByBuilderId_shouldReturnForbidden_whenNoViewProjectAuthority() throws Exception {
        User builder = registerBuilder();
        User viewer = registerViewer();
        String viewerToken = login(viewer);
        User admin = registerAdmin();
        String adminToken = login(admin);
        // Create a project for the builder using helper
        createProject(adminToken, builder.getId(), true, testCreateProjectRequest.getLocationRequestDto());
        // Viewer tries to fetch builder's projects
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
                        .header("Authorization", "Bearer " + viewerToken))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void getProjectsByBuilderId_shouldReturnUnauthorized_whenNoJwt() throws Exception {
        User builder = registerBuilder();
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId()))
                // .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getProjectsByBuilderId_shouldReturnEmptyList_whenNoProjects() throws Exception {
        User builder = registerBuilder();
        String builderToken = login(builder);
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnOk_whenAdminUser() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User owner = registerOwner();
        // Create a project for the owner using helper
        var projectDto = createProject(adminToken, owner.getId(), false, testCreateProjectRequest.getLocationRequestDto());
        // Admin fetches owner's projects
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + adminToken))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].userId").value(owner.getId().toString()))
                .andExpect(jsonPath("$[0].role").value("OWNER"))
                .andExpect(jsonPath("$[0].id").value(projectDto.getId().toString()));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnOk_whenOwnerIsSelf() throws Exception {
        User owner = registerOwner();
        String ownerToken = login(owner);
        // Create a project for the owner using helper
        var projectDto = createProject(ownerToken, owner.getId(), false, testCreateProjectRequest.getLocationRequestDto());
        // Owner fetches their own projects
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].userId").value(owner.getId().toString()))
                .andExpect(jsonPath("$[0].role").value("OWNER"))
                .andExpect(jsonPath("$[0].id").value(projectDto.getId().toString()));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnForbidden_whenOtherUser() throws Exception {
        User owner = registerOwner();
        User otherUser = registerBuilder();
        String otherUserToken = login(otherUser);
        User admin = registerAdmin();
        String adminToken = login(admin);
        // Create a project for the owner using helper
        createProject(adminToken, owner.getId(), false, testCreateProjectRequest.getLocationRequestDto());
        // Other user tries to fetch owner's projects
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + otherUserToken))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void getProjectsByOwnerId_shouldReturnForbidden_whenNoViewProjectAuthority() throws Exception {
        User owner = registerOwner();
        User viewer = registerViewer();
        String viewerToken = login(viewer);
        User admin = registerAdmin();
        String adminToken = login(admin);
        // Create a project for the owner using helper
        createProject(adminToken, owner.getId(), false, testCreateProjectRequest.getLocationRequestDto());
        // Viewer tries to fetch owner's projects
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + viewerToken))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void getProjectsByOwnerId_shouldReturnUnauthorized_whenNoJwt() throws Exception {
        User owner = registerOwner();
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId()))
                // .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getProjectsByOwnerId_shouldReturnEmptyList_whenNoProjects() throws Exception {
        User owner = registerOwner();
        String ownerToken = login(owner);
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + ownerToken))
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
    void getProjectsByBuilderId_shouldReturnDefaultPage_whenNoPaginationParams() throws Exception {
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
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
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
    void getProjectsByBuilderId_shouldReturnCustomPageSize() throws Exception {
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
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
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
    void getProjectsByBuilderId_shouldReturnSecondPage() throws Exception {
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
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
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
    void getProjectsByBuilderId_shouldAcceptSortParameter() throws Exception {
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
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("sort", "createdAt,ASC"))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void getProjectsByBuilderId_shouldAcceptOrderByParameter() throws Exception {
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
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken)
                        .param("orderBy", "lastUpdatedAt")
                        .param("direction", "DESC"))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(5));
    }

    @Test
    void getProjectsByBuilderId_shouldReturnEmptyPageWithHeaders_whenPageOutOfBounds() throws Exception {
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
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
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
    void getProjectsByOwnerId_shouldReturnDefaultPage_whenNoPaginationParams() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User owner = registerOwner();
        
        // Create 30 projects for the owner
        for (int i = 0; i < 30; i++) {
            var locationDto = ProjectLocationRequestDto.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            createProject(adminToken, owner.getId(), false, locationDto);
            Thread.sleep(5);
        }

        String ownerToken = login(owner);
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(25))
                .andExpect(header().string("X-Total-Count", "30"))
                .andExpect(header().string("X-Total-Pages", "2"))
                .andExpect(header().string("X-Page", "0"))
                .andExpect(header().string("X-Size", "25"));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnCustomPageSize() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User owner = registerOwner();
        
        // Create 15 projects
        for (int i = 0; i < 15; i++) {
            var locationDto = ProjectLocationRequestDto.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            createProject(adminToken, owner.getId(), false, locationDto);
            Thread.sleep(5);
        }

        String ownerToken = login(owner);
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + ownerToken)
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
    void getProjectsByOwnerId_shouldHandleInvalidSortField() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User owner = registerOwner();
        
        // Create 5 projects
        for (int i = 0; i < 5; i++) {
            var locationDto = ProjectLocationRequestDto.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            createProject(adminToken, owner.getId(), false, locationDto);
            Thread.sleep(5);
        }

        String ownerToken = login(owner);
        // Request with invalid sort field should fall back to default
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .param("orderBy", "invalidField")
                        .param("direction", "ASC"))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(5));
    }

    @Test
    void getProjectsByBuilderId_shouldReturnEmptyListWithPaginationHeaders_whenNoProjects() throws Exception {
        User builder = registerBuilder();
        String builderToken = login(builder);
        
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
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
}
