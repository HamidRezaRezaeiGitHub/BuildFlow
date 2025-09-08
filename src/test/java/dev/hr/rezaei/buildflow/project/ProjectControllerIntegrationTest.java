package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractControllerIntegrationTest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.user.User;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class ProjectControllerIntegrationTest extends AbstractControllerIntegrationTest {

    @Test
    void createProject_shouldReturnCreated_whenAdminUser() throws Exception {
        User admin = registerAdmin();
        String token = login(admin);
        User builder = registerBuilder();
        User owner = registerOwner();
        var projectRequest = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(owner.getId())
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.29." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.projectDto.id").exists())
                .andExpect(jsonPath("$.projectDto.builderId").value(builder.getId().toString()))
                .andExpect(jsonPath("$.projectDto.ownerId").value(owner.getId().toString()));
    }

    @Test
    void createProject_shouldReturnCreated_whenUserHasCreateProjectAuthorityAndIsAllowed() throws Exception {
        User builder = registerBuilder();
        String token = login(builder);
        var projectRequest = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(builder.getId())
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.30." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.projectDto.id").exists())
                .andExpect(jsonPath("$.projectDto.builderId").value(builder.getId().toString()))
                .andExpect(jsonPath("$.projectDto.ownerId").value(builder.getId().toString()));
    }

    @Test
    void createProject_shouldReturnForbidden_whenUserHasCreateProjectAuthorityButIsNotAllowed() throws Exception {
        User actingUser = registerBuilder();
        String token = login(actingUser);
        User builder = registerBuilder();
        User owner = registerOwner();
        var projectRequest = CreateProjectRequest.builder()
                .builderId(builder.getId())
                .ownerId(owner.getId())
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.31." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void createProject_shouldReturnForbidden_whenUserLacksRequiredAuthority() throws Exception {
        User viewer = registerViewer();
        String token = login(viewer);
        var projectRequest = CreateProjectRequest.builder()
                .builderId(viewer.getId())
                .ownerId(viewer.getId())
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.32." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void createProject_shouldReturnUnauthorized_whenNoJwtProvided() throws Exception {
        var builder = userService.createUser(testCreateBuilderRequest);
        var owner = userService.createUser(testCreateOwnerRequest);
        var projectRequest = CreateProjectRequest.builder()
                .builderId(builder.getUserDto().getId())
                .ownerId(owner.getUserDto().getId())
                .locationRequestDto(testCreateProjectRequest.getLocationRequestDto())
                .build();
        mockMvc.perform(post("/api/v1/projects")
                        .header("X-Forwarded-For", "192.168.33." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getProjectsByBuilderId_shouldReturnOk_whenAdminUser() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        User owner = registerOwner();
        // Create a project for the builder using helper
        var projectDto = createProject(adminToken, builder.getId(), owner.getId(), testCreateProjectRequest.getLocationRequestDto());
        // Admin fetches builder's projects
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].builderId").value(builder.getId().toString()))
                .andExpect(jsonPath("$[0].id").value(projectDto.getId().toString()));
    }

    @Test
    void getProjectsByBuilderId_shouldReturnOk_whenBuilderIsSelf() throws Exception {
        User builder = registerBuilder();
        String builderToken = login(builder);
        User owner = registerOwner();
        // Create a project for the builder using helper
        var projectDto = createProject(builderToken, builder.getId(), owner.getId(), testCreateProjectRequest.getLocationRequestDto());
        // Builder fetches their own projects
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].builderId").value(builder.getId().toString()))
                .andExpect(jsonPath("$[0].id").value(projectDto.getId().toString()));
    }

    @Test
    void getProjectsByBuilderId_shouldReturnForbidden_whenOtherUser() throws Exception {
        User builder = registerBuilder();
        User owner = registerOwner();
        User otherUser = registerBuilder();
        String otherUserToken = login(otherUser);
        User admin = registerAdmin();
        String adminToken = login(admin);
        // Create a project for the builder using helper
        createProject(adminToken, builder.getId(), owner.getId(), testCreateProjectRequest.getLocationRequestDto());
        // Other user tries to fetch builder's projects
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
                        .header("Authorization", "Bearer " + otherUserToken))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void getProjectsByBuilderId_shouldReturnForbidden_whenNoViewProjectAuthority() throws Exception {
        User builder = registerBuilder();
        User owner = registerOwner();
        User viewer = registerViewer();
        String viewerToken = login(viewer);
        User admin = registerAdmin();
        String adminToken = login(admin);
        // Create a project for the builder using helper
        createProject(adminToken, builder.getId(), owner.getId(), testCreateProjectRequest.getLocationRequestDto());
        // Viewer tries to fetch builder's projects
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
                        .header("Authorization", "Bearer " + viewerToken))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void getProjectsByBuilderId_shouldReturnUnauthorized_whenNoJwt() throws Exception {
        User builder = registerBuilder();
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId()))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getProjectsByBuilderId_shouldReturnEmptyList_whenNoProjects() throws Exception {
        User builder = registerBuilder();
        String builderToken = login(builder);
        mockMvc.perform(get("/api/v1/projects/builder/{builderId}", builder.getId())
                        .header("Authorization", "Bearer " + builderToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnOk_whenAdminUser() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User builder = registerBuilder();
        User owner = registerOwner();
        // Create a project for the owner using helper
        var projectDto = createProject(adminToken, builder.getId(), owner.getId(), testCreateProjectRequest.getLocationRequestDto());
        // Admin fetches owner's projects
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].ownerId").value(owner.getId().toString()))
                .andExpect(jsonPath("$[0].id").value(projectDto.getId().toString()));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnOk_whenOwnerIsSelf() throws Exception {
        User builder = registerBuilder();
        User owner = registerOwner();
        String ownerToken = login(owner);
        // Create a project for the owner using helper
        var projectDto = createProject(ownerToken, builder.getId(), owner.getId(), testCreateProjectRequest.getLocationRequestDto());
        // Owner fetches their own projects
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].ownerId").value(owner.getId().toString()))
                .andExpect(jsonPath("$[0].id").value(projectDto.getId().toString()));
    }

    @Test
    void getProjectsByOwnerId_shouldReturnForbidden_whenOtherUser() throws Exception {
        User builder = registerBuilder();
        User owner = registerOwner();
        User otherUser = registerBuilder();
        String otherUserToken = login(otherUser);
        User admin = registerAdmin();
        String adminToken = login(admin);
        // Create a project for the owner using helper
        createProject(adminToken, builder.getId(), owner.getId(), testCreateProjectRequest.getLocationRequestDto());
        // Other user tries to fetch owner's projects
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + otherUserToken))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void getProjectsByOwnerId_shouldReturnForbidden_whenNoViewProjectAuthority() throws Exception {
        User builder = registerBuilder();
        User owner = registerOwner();
        User viewer = registerViewer();
        String viewerToken = login(viewer);
        User admin = registerAdmin();
        String adminToken = login(admin);
        // Create a project for the owner using helper
        createProject(adminToken, builder.getId(), owner.getId(), testCreateProjectRequest.getLocationRequestDto());
        // Viewer tries to fetch owner's projects
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + viewerToken))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void getProjectsByOwnerId_shouldReturnUnauthorized_whenNoJwt() throws Exception {
        User owner = registerOwner();
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId()))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getProjectsByOwnerId_shouldReturnEmptyList_whenNoProjects() throws Exception {
        User owner = registerOwner();
        String ownerToken = login(owner);
        mockMvc.perform(get("/api/v1/projects/owner/{ownerId}", owner.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
